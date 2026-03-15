import type {
  EpisodeCitation,
  EpisodeDialogueLine,
  EpisodeHost,
  EpisodeLanguage,
  HostId,
  PodcastEpisode,
  RetrievedSource,
} from "@/lib/types";

const FEATHERLESS_API_URL = "https://api.featherless.ai/v1/chat/completions";
const DEFAULT_MODEL =
  process.env.FEATHERLESS_MODEL?.trim() || "Qwen/Qwen2.5-7B-Instruct";

const BASE_SYSTEM_PROMPT = [
  "You create short, grounded two-host audio briefings.",
  "Keep the finished spoken runtime around 90 to 150 seconds.",
  "Host A should be the confident explainer. Host B should be curious and slightly skeptical.",
  "Each dialogue turn should be concise, natural, and under 320 characters.",
  "Do not include stage directions, scene descriptions, or markdown.",
  "Return JSON only.",
].join(" ");

const URL_GROUNDING_RULES = [
  "Treat the provided context as the only source of truth.",
  "Stay grounded in the provided context and do not invent unsupported facts.",
  "If a detail is not explicit in the context, omit it.",
  "Do not add filler judgments such as impressive, exciting, successful, going well, or promising unless the source explicitly supports them.",
  "Do not infer future progress, motivations, current status, or business results beyond what the source states.",
  "Prefer source-anchored phrasing like 'the site says' or 'according to the source' when describing a person, company, or service.",
  "The tone should be neutral and factual, not promotional.",
].join(" ");

const JSON_SHAPE = {
  title: "Short briefing title",
  hook: "One punchy sentence that frames the request",
  summary: "Two short factual sentences summarizing the answer",
  directAnswer: "A concise factual answer for the user's intent",
  checklist: [
    "Actionable step or requirement one",
    "Actionable step or requirement two",
  ],
  citations: [
    {
      claim: "A factual claim from the answer or checklist",
      sourceUrl: "https://example.com/source-page",
      sourceLabel: "Source page label",
      evidence: "Short source-grounded evidence snippet",
    },
  ],
  hosts: [
    {
      id: "hostA",
      name: "Maya",
      role: "Lead explainer",
    },
    {
      id: "hostB",
      name: "Leo",
      role: "Curious co-host",
    },
  ],
  dialogue: [
    {
      speaker: "hostA",
      text: "First short dialogue turn",
    },
    {
      speaker: "hostB",
      text: "Second short dialogue turn",
    },
  ],
};

function getFeatherlessApiKey(): string {
  const apiKey = process.env.FEATHERLESS_API_KEY?.trim();

  if (!apiKey) {
    throw new Error("Missing FEATHERLESS_API_KEY");
  }

  return apiKey;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getLanguageName(language: EpisodeLanguage): string {
  return language === "de" ? "German" : "English";
}

function normalizeSourceKey(url: string): string {
  const value = url.trim();

  try {
    const parsed = new URL(value);
    parsed.hash = "";
    return parsed.toString().replace(/\/$/, "");
  } catch {
    return value.replace(/\/$/, "");
  }
}

function normalizeHost(value: unknown, expectedId: HostId, fallbackName: string): EpisodeHost {
  if (!isRecord(value)) {
    return {
      id: expectedId,
      name: fallbackName,
      role: expectedId === "hostA" ? "Lead explainer" : "Curious co-host",
    };
  }

  const name = typeof value.name === "string" ? value.name.trim() : fallbackName;
  const role =
    typeof value.role === "string" && value.role.trim()
      ? value.role.trim()
      : expectedId === "hostA"
        ? "Lead explainer"
        : "Curious co-host";

  return {
    id: expectedId,
    name: name || fallbackName,
    role,
  };
}

function normalizeDialogue(value: unknown): EpisodeDialogueLine[] {
  if (!Array.isArray(value)) {
    throw new Error("Featherless returned an invalid dialogue payload.");
  }

  const dialogue = value
    .map((line) => {
      if (!isRecord(line)) {
        return null;
      }

      const speaker = line.speaker === "hostB" ? "hostB" : "hostA";
      const text = typeof line.text === "string" ? line.text.trim() : "";

      if (!text) {
        return null;
      }

      return {
        speaker,
        text: text.slice(0, 320),
      } satisfies EpisodeDialogueLine;
    })
    .filter((line): line is EpisodeDialogueLine => Boolean(line));

  if (dialogue.length < 4) {
    throw new Error("Featherless did not return enough dialogue.");
  }

  return dialogue;
}

function normalizeChecklist(value: unknown): string[] {
  if (!Array.isArray(value)) {
    throw new Error("Featherless returned an invalid checklist.");
  }

  const checklist = value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean)
    .slice(0, 6);

  if (!checklist.length) {
    throw new Error("Featherless returned an empty checklist.");
  }

  return checklist;
}

function normalizeCitations({
  value,
  sourceType,
  relevantSources,
}: {
  value: unknown;
  sourceType: "topic" | "url";
  relevantSources: RetrievedSource[];
}): EpisodeCitation[] {
  if (sourceType === "topic") {
    return [];
  }

  if (!Array.isArray(value)) {
    throw new Error("Featherless returned an invalid citations payload.");
  }

  const sourceLookup = new Map(
    relevantSources.map((source) => [normalizeSourceKey(source.url), source]),
  );
  const citations = value
    .map((entry) => {
      if (!isRecord(entry)) {
        return null;
      }

      const claim = typeof entry.claim === "string" ? entry.claim.trim() : "";
      const evidence = typeof entry.evidence === "string" ? entry.evidence.trim() : "";
      const sourceUrl = typeof entry.sourceUrl === "string" ? entry.sourceUrl.trim() : "";
      const matchedSource = sourceLookup.get(normalizeSourceKey(sourceUrl));

      if (!claim || !evidence || !matchedSource) {
        return null;
      }

      return {
        claim,
        evidence: evidence.slice(0, 240),
        sourceUrl: matchedSource.url,
        sourceLabel: matchedSource.label,
      } satisfies EpisodeCitation;
    })
    .filter((citation): citation is EpisodeCitation => Boolean(citation))
    .slice(0, 6);

  if (sourceType === "url" && citations.length < 2) {
    throw new Error("Featherless did not return enough grounded citations.");
  }

  return citations;
}

function parseEpisodePayload({
  payload,
  sourceType,
  relevantSources,
}: {
  payload: string;
  sourceType: "topic" | "url";
  relevantSources: RetrievedSource[];
}): PodcastEpisode {
  let parsed: unknown;

  try {
    parsed = JSON.parse(payload);
  } catch {
    throw new Error("Featherless returned malformed JSON.");
  }

  if (!isRecord(parsed)) {
    throw new Error("Featherless returned an invalid episode payload.");
  }

  const hostsRaw = Array.isArray(parsed.hosts) ? parsed.hosts : [];
  const hosts = [
    normalizeHost(hostsRaw[0], "hostA", "Maya"),
    normalizeHost(hostsRaw[1], "hostB", "Leo"),
  ];
  const title = typeof parsed.title === "string" ? parsed.title.trim() : "";
  const hook = typeof parsed.hook === "string" ? parsed.hook.trim() : "";
  const summary = typeof parsed.summary === "string" ? parsed.summary.trim() : "";
  const directAnswer =
    typeof parsed.directAnswer === "string" ? parsed.directAnswer.trim() : "";
  const checklist = normalizeChecklist(parsed.checklist);
  const citations = normalizeCitations({
    value: parsed.citations,
    sourceType,
    relevantSources,
  });
  const dialogue = normalizeDialogue(parsed.dialogue);

  if (!title || !hook || !summary || !directAnswer) {
    throw new Error("Featherless returned an incomplete episode.");
  }

  return {
    title,
    hook,
    summary,
    directAnswer,
    checklist,
    citations,
    hosts,
    dialogue,
  };
}

function extractMessageContent(message: unknown): string {
  if (typeof message === "string") {
    return message.trim();
  }

  if (Array.isArray(message)) {
    return message
      .map((part) => (isRecord(part) && typeof part.text === "string" ? part.text : ""))
      .join("\n")
      .trim();
  }

  return "";
}

function extractJsonPayload(content: string): string {
  const trimmed = content.trim();
  const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fencedMatch?.[1]?.trim() || trimmed;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");

  if (start === -1 || end === -1 || end < start) {
    throw new Error("Featherless did not return a JSON object.");
  }

  return candidate.slice(start, end + 1);
}

async function readErrorMessage(response: Response): Promise<string> {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const payload = (await response.json().catch(() => null)) as
      | {
          error?: {
            message?: string;
          };
          message?: string;
        }
      | null;

    return payload?.error?.message || payload?.message || response.statusText;
  }

  const text = await response.text().catch(() => "");
  return text || response.statusText;
}

async function requestEpisodeJson({
  systemPrompt,
  userPrompt,
  temperature,
}: {
  systemPrompt: string;
  userPrompt: string;
  temperature: number;
}): Promise<string> {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${getFeatherlessApiKey()}`,
    "Content-Type": "application/json",
    "X-Title": "Sourcewave",
  };
  const referer = process.env.NEXT_PUBLIC_APP_URL?.trim();

  if (referer) {
    headers["HTTP-Referer"] = referer;
  }

  const response = await fetch(FEATHERLESS_API_URL, {
    method: "POST",
    headers,
    cache: "no-store",
    body: JSON.stringify({
      model: DEFAULT_MODEL,
      temperature,
      max_tokens: 1800,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Featherless request failed: ${await readErrorMessage(response)}`);
  }

  const payload = (await response.json()) as {
    choices?: Array<{
      message?: {
        content?: unknown;
      };
    }>;
  };
  const content = extractMessageContent(payload.choices?.[0]?.message?.content);

  if (!content) {
    throw new Error("Featherless returned an empty response.");
  }

  return extractJsonPayload(content);
}

function buildDraftPrompt({
  source,
  context,
  sourceType,
  userIntent,
  language,
  relevantSources,
}: {
  source: string;
  context: string;
  sourceType: "topic" | "url";
  userIntent: string | null;
  language: EpisodeLanguage;
  relevantSources: RetrievedSource[];
}): string {
  const languageName = getLanguageName(language);
  const requirements =
    sourceType === "url"
      ? [
          "- Use only facts supported by the context.",
          "- Focus on the user's intent and remove unrelated site sections.",
          "- If the source is a service or government portal, prioritize requirements, documents, fees, deadlines, appointment information, and notable caveats.",
          "- Do not imply progress, quality, or outcomes unless the source says so explicitly.",
          "- If a line cannot be supported by the source, remove it rather than guessing.",
          "- citations must contain 2 to 6 claim-level citations.",
          "- Every citation must use one exact sourceUrl from the relevant source list.",
          "- Each citation should support a concrete claim from the direct answer, summary, or checklist.",
        ]
      : [
          "- Use general knowledge to explain the topic clearly.",
          "- Keep the explanation accessible and useful for a short audio briefing.",
          "- Avoid niche jargon unless one host immediately explains it.",
          "- citations should be an empty array for topic mode.",
        ];

  return [
    "Build a grounded audio briefing from the source and context below.",
    "Return JSON only with this exact shape:",
    JSON.stringify(JSON_SHAPE, null, 2),
    "Requirements:",
    "- Exactly 2 hosts: hostA and hostB.",
    "- 6 to 12 dialogue turns total.",
    "- Keep every dialogue turn under 320 characters.",
    `- Write every user-visible field in ${languageName}.`,
    "- directAnswer should answer the user's need directly.",
    "- checklist should contain 3 to 6 actionable bullet items.",
    ...requirements,
    "",
    userIntent ? `User intent: ${userIntent}` : "User intent: general overview",
    `Output language: ${languageName}`,
    `Source: ${source}`,
    sourceType === "url"
      ? `Relevant source URLs:\n${relevantSources.map((sourceItem) => `- ${sourceItem.label} (${sourceItem.url})`).join("\n")}`
      : "",
    "",
    "Context:",
    context,
  ]
    .filter(Boolean)
    .join("\n");
}

async function factCheckEpisode({
  source,
  context,
  draftJson,
  userIntent,
  language,
  sourceType,
  relevantSources,
}: {
  source: string;
  context: string;
  draftJson: string;
  userIntent: string | null;
  language: EpisodeLanguage;
  sourceType: "topic" | "url";
  relevantSources: RetrievedSource[];
}): Promise<PodcastEpisode> {
  const reviewedJson = await requestEpisodeJson({
    systemPrompt: [
      BASE_SYSTEM_PROMPT,
      URL_GROUNDING_RULES,
      `Write the output in ${getLanguageName(language)}.`,
      "You are now acting as a fact-checking editor.",
      "Rewrite the draft so every factual statement is directly supported by the source context.",
      "Delete unsupported reactions, opinions, predictions, and filler.",
      "Keep the answer tightly focused on the user's intent.",
      "Preserve or improve the citations so each one points to an allowed source URL and supports a concrete claim.",
    ].join(" "),
    userPrompt: [
      "Review and rewrite this audio briefing draft.",
      "Return the same JSON shape.",
      "Remove or rewrite anything not clearly supported by the source.",
      userIntent ? `User intent: ${userIntent}` : "User intent: general overview",
      `Output language: ${getLanguageName(language)}`,
      "",
      `Source: ${source}`,
      sourceType === "url"
        ? `Allowed citation URLs:\n${relevantSources.map((sourceItem) => `- ${sourceItem.label} (${sourceItem.url})`).join("\n")}`
        : "",
      "",
      "Context:",
      context,
      "",
      "Draft JSON:",
      draftJson,
    ]
      .filter(Boolean)
      .join("\n"),
    temperature: 0.05,
  });

  return parseEpisodePayload({
    payload: reviewedJson,
    sourceType,
    relevantSources,
  });
}

export async function generatePodcastEpisode({
  source,
  context,
  sourceType,
  userIntent,
  language,
  relevantSources,
}: {
  source: string;
  context: string;
  sourceType: "topic" | "url";
  userIntent: string | null;
  language: EpisodeLanguage;
  relevantSources: RetrievedSource[];
}): Promise<PodcastEpisode> {
  const draftJson = await requestEpisodeJson({
    systemPrompt:
      sourceType === "url"
        ? `${BASE_SYSTEM_PROMPT} ${URL_GROUNDING_RULES} Write the output in ${getLanguageName(language)}.`
        : `${BASE_SYSTEM_PROMPT} Write the output in ${getLanguageName(language)}.`,
    userPrompt: buildDraftPrompt({
      source,
      context,
      sourceType,
      userIntent,
      language,
      relevantSources,
    }),
    temperature: sourceType === "url" ? 0.08 : 0.25,
  });

  if (sourceType === "url") {
    return factCheckEpisode({
      source,
      context,
      draftJson,
      userIntent,
      language,
      sourceType,
      relevantSources,
    });
  }

  return parseEpisodePayload({
    payload: draftJson,
    sourceType,
    relevantSources,
  });
}
