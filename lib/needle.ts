import { Needle } from "@needle-ai/needle/v1";

import type { RetrievedSource } from "@/lib/types";

const GENERIC_SEARCH_QUERIES = [
  "key claims, main arguments, summary, important points",
  "main content, key points, evidence, conclusions",
  "requirements, steps, documents, eligibility, fees, deadlines",
];

const GOVERNMENT_NOISE_TERMS = [
  "hauptnavigation",
  "barrierefreiheit",
  "datenschutzerklarung",
  "datenschutzerklaerung",
  "impressum",
  "zum seitenanfang",
  "menu",
  "suche",
  "weitere informationen",
  "service-app",
  "portalverbund",
];

const NEEDLE_API_URL = process.env.NEEDLE_API_URL?.trim() || "https://needle.app";
const MAX_RETURN_CHARS = 9000;
const POLL_INTERVAL_MS = 2000;
const INDEX_TIMEOUT_MS = 90000;
const MAX_DISCOVERED_URLS = 5;

export interface ExtractedContentResult {
  context: string;
  relevantSources: RetrievedSource[];
  userIntent: string | null;
}

function getNeedleApiKey(): string {
  const apiKey = process.env.NEEDLE_API_KEY?.trim();

  if (!apiKey) {
    throw new Error("Missing NEEDLE_API_KEY");
  }

  return apiKey;
}

function getNeedleClient(): Needle {
  return new Needle({ apiKey: getNeedleApiKey() });
}

export function isUrl(input: string): boolean {
  try {
    const url = new URL(input.trim());
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function truncateContext(text: string, maxChars = MAX_RETURN_CHARS): string {
  return text.length <= maxChars ? text : `${text.slice(0, maxChars - 3).trimEnd()}...`;
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function stripHtml(text: string): string {
  return decodeHtmlEntities(text.replace(/<[^>]+>/g, " "));
}

function cleanText(text: string): string {
  return decodeHtmlEntities(
    text
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
      .replace(/\\([[\]()*_`#+.!-])/g, "$1")
      .replace(/\r\n/g, "\n"),
  )
    .split("\n")
    .map((line) => line.trim())
    .filter((line, index, lines) => {
      if (!line) {
        return index > 0 && lines[index - 1] !== "";
      }

      return line.length > 1;
    })
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function normalizeForMatch(text: string): string {
  return text
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function dedupeStrings(values: string[]): string[] {
  return Array.from(new Set(values.filter(Boolean)));
}

function normalizeIntent(input: string | null | undefined): string | null {
  const value = typeof input === "string" ? input.trim() : "";
  return value || null;
}

function isDrivingIntent(intent: string | null): boolean {
  const normalized = normalizeForMatch(intent ?? "");

  return /driv|driver|licen|licence|license|fahrerlaub|fuehrerschein|fuhrerschein/.test(
    normalized,
  );
}

function getIntentTokens(intent: string | null, sourceUrl: string): string[] {
  const normalizedIntent = normalizeIntent(intent);
  const rawTokens = normalizedIntent
    ? normalizeForMatch(normalizedIntent)
        .split(/[^a-z0-9]+/)
        .filter((token) => token.length > 2)
    : [];
  const sourceHost = new URL(sourceUrl).hostname;
  const joined = rawTokens.join(" ");
  const extras: string[] = [];

  if (isDrivingIntent(joined)) {
    extras.push(
      "driving",
      "driver",
      "license",
      "licence",
      "fuehrerschein",
      "fuhrerschein",
      "fahrerlaubnis",
      "ersterteilung",
      "umtausch",
      "international",
      "ersatz",
      "unterlagen",
      "gebuhren",
      "kosten",
      "termine",
      "beantragen",
    );
  }

  if (sourceHost === "service.berlin.de") {
    extras.push("dienstleistung", "serviceportal", "berlin");
  }

  return dedupeStrings([...rawTokens, ...extras]);
}

function buildSearchQueries(sourceUrl: string, userIntent: string | null): string[] {
  const intent = normalizeIntent(userIntent);
  const intentTokens = getIntentTokens(intent, sourceUrl);
  const sourceHost = new URL(sourceUrl).hostname;
  const queries = [...GENERIC_SEARCH_QUERIES];

  if (intent) {
    queries.unshift(
      intent,
      `${intent} requirements documents fees appointment`,
      `${intent} steps eligibility documents deadlines`,
    );
  }

  if (intentTokens.length) {
    queries.push(intentTokens.join(" "));
    queries.push(`${intentTokens.join(" ")} requirements documents fees`);
  }

  if (sourceHost === "service.berlin.de" && intentTokens.length) {
    queries.unshift(
      `${intentTokens.join(" ")} antrag unterlagen gebuhren kosten termine`,
      `${intentTokens.join(" ")} berlin dienstleistung`,
    );
  }

  if (sourceHost === "service.berlin.de" && isDrivingIntent(intent)) {
    queries.unshift(
      "fuehrerschein berlin unterlagen gebuhren termine",
      "fahrerlaubnis ersterteilung unterlagen kosten termin",
    );
  }

  return dedupeStrings(queries);
}

function getServiceBerlinDrivingSources(sourceUrl: string): RetrievedSource[] {
  const url = new URL(sourceUrl);
  const curatedSources = [
    {
      url: url.toString(),
      label: "ServicePortal Berlin",
    },
    {
      url: new URL("/fuehrerschein/", url).toString(),
      label: "Fuehrerschein topic page",
    },
    {
      url: new URL("/lagen/1090100/", url).toString(),
      label: "Fuehrerscheine overview",
    },
    {
      url: new URL("/dienstleistung/121627/", url).toString(),
      label: "Fahrerlaubnis - Ersterteilung beantragen",
    },
  ];

  return dedupeStrings(curatedSources.map((source) => `${source.url}::${source.label}`)).map(
    (entry) => {
      const [curatedUrl, label] = entry.split("::");
      return {
        url: curatedUrl,
        label,
      };
    },
  );
}

function getDiscoverySeedUrls(sourceUrl: string, userIntent: string | null): string[] {
  const url = new URL(sourceUrl);

  if (url.hostname === "service.berlin.de" && isDrivingIntent(userIntent)) {
    return getServiceBerlinDrivingSources(sourceUrl).map((source) => source.url);
  }

  if (url.hostname === "service.berlin.de") {
    return dedupeStrings([
      url.toString(),
      new URL("/auto-verkehr/", url).toString(),
      new URL("/dienstleistungen/", url).toString(),
    ]);
  }

  return [url.toString()];
}

function shouldIgnoreLink(url: URL, label: string): boolean {
  const normalized = normalizeForMatch(`${label} ${url.pathname}`);

  if (
    url.hash ||
    /\.(pdf|jpg|jpeg|png|svg|doc|docx)$/i.test(url.pathname) ||
    normalized.includes("datenschutz") ||
    normalized.includes("impressum") ||
    normalized.includes("barriere") ||
    normalized.includes("app") ||
    normalized.includes("rss")
  ) {
    return true;
  }

  return false;
}

async function fetchHtmlDocument(url: string): Promise<{
  url: string;
  title: string;
  description: string;
  html: string;
}> {
  const response = await fetch(url, {
    method: "GET",
    cache: "no-store",
    headers: {
      "User-Agent": "SourcewaveBot/1.0",
    },
  });

  if (!response.ok) {
    throw new Error(`Unable to fetch ${url}`);
  }

  const html = await response.text();
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const descriptionMatch = html.match(
    /<meta[^>]+name=["']description["'][^>]+content=["']([\s\S]*?)["'][^>]*>/i,
  );

  return {
    url,
    title: titleMatch ? cleanText(stripHtml(titleMatch[1])) : "",
    description: descriptionMatch ? cleanText(stripHtml(descriptionMatch[1])) : "",
    html,
  };
}

function extractLinksFromHtml(baseUrl: string, html: string): RetrievedSource[] {
  const base = new URL(baseUrl);
  const matches = html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi);
  const links = new Map<string, RetrievedSource>();

  for (const match of matches) {
    const href = match[1]?.trim();
    const rawLabel = stripHtml(match[2] ?? "");

    if (!href || !rawLabel.trim()) {
      continue;
    }

    try {
      const nextUrl = new URL(href, base);

      if (nextUrl.hostname !== base.hostname || shouldIgnoreLink(nextUrl, rawLabel)) {
        continue;
      }

      const finalUrl = `${nextUrl.origin}${nextUrl.pathname}${nextUrl.search}`;

      if (!links.has(finalUrl)) {
        links.set(finalUrl, {
          url: finalUrl,
          label: cleanText(rawLabel),
        });
      }
    } catch {
      continue;
    }
  }

  return Array.from(links.values());
}

function scoreDiscoveredLink(link: RetrievedSource, intentTokens: string[]): number {
  const haystack = normalizeForMatch(`${link.label} ${link.url}`);
  let score = 0;

  for (const token of intentTokens) {
    if (haystack.includes(token)) {
      score += 3;
    }
  }

  if (link.url.includes("/dienstleistung/")) {
    score += 4;
  }

  if (haystack.includes("beantragen")) {
    score += 1;
  }

  if (
    haystack.includes("gebuhr") ||
    haystack.includes("unterlagen") ||
    haystack.includes("termin")
  ) {
    score += 1;
  }

  if (
    haystack.includes("datenschutz") ||
    haystack.includes("impressum") ||
    haystack.includes("barriere")
  ) {
    score -= 4;
  }

  return score;
}

async function discoverRelevantSources(
  sourceUrl: string,
  userIntent: string | null,
): Promise<RetrievedSource[]> {
  const sourceHost = new URL(sourceUrl).hostname;

  if (sourceHost === "service.berlin.de" && isDrivingIntent(userIntent)) {
    return getServiceBerlinDrivingSources(sourceUrl);
  }

  const intentTokens = getIntentTokens(userIntent, sourceUrl);
  const seedUrls = getDiscoverySeedUrls(sourceUrl, userIntent);
  const scoredLinks = new Map<string, { label: string; score: number }>();
  const seedPages = await Promise.allSettled(seedUrls.map((url) => fetchHtmlDocument(url)));

  for (const page of seedPages) {
    if (page.status !== "fulfilled") {
      continue;
    }

    const seedLabel = page.value.title || page.value.description || page.value.url;
    const seedScore =
      scoreDiscoveredLink({ url: page.value.url, label: seedLabel }, intentTokens) + 2;
    const currentSeed = scoredLinks.get(page.value.url);

    if (!currentSeed || currentSeed.score < seedScore) {
      scoredLinks.set(page.value.url, { label: seedLabel, score: seedScore });
    }

    for (const link of extractLinksFromHtml(page.value.url, page.value.html)) {
      const score = scoreDiscoveredLink(link, intentTokens);

      if (score <= 0) {
        continue;
      }

      const existing = scoredLinks.get(link.url);

      if (!existing || existing.score < score) {
        scoredLinks.set(link.url, { label: link.label, score });
      }
    }
  }

  if (!scoredLinks.size) {
    return [
      {
        url: sourceUrl,
        label: sourceUrl,
      },
    ];
  }

  const ranked = Array.from(scoredLinks.entries())
    .sort((left, right) => right[1].score - left[1].score)
    .slice(0, MAX_DISCOVERED_URLS)
    .map(([url, entry]) => ({
      url,
      label: entry.label || url,
    }));

  if (!ranked.some((entry) => entry.url === sourceUrl)) {
    ranked.unshift({
      url: sourceUrl,
      label: sourceUrl,
    });
  }

  return ranked.slice(0, MAX_DISCOVERED_URLS);
}

function buildSourceHeader(sources: RetrievedSource[]): string {
  if (!sources.length) {
    return "";
  }

  return [
    "Relevant source pages:",
    ...sources.map((source) => `- ${source.label} (${source.url})`),
  ].join("\n");
}

function isNoisyChunk(content: string, intentTokens: string[]): boolean {
  const normalized = normalizeForMatch(content);
  const noiseHits = GOVERNMENT_NOISE_TERMS.filter((term) => normalized.includes(term)).length;
  const hasIntentSignal = intentTokens.some((token) => normalized.includes(token));

  if (noiseHits >= 2 && !hasIntentSignal) {
    return true;
  }

  if (content.length < 100 && !hasIntentSignal) {
    return true;
  }

  return false;
}

function normalizeResults(
  results: Array<{ content?: string; file_id?: string }>,
  intentTokens: string[],
  fileLookup: Map<string, RetrievedSource>,
): string {
  const seen = new Set<string>();
  const chunks: string[] = [];

  for (const result of results) {
    const content = cleanText(result.content?.trim() ?? "");
    const source = result.file_id ? fileLookup.get(result.file_id) : null;
    const dedupeKey = `${source?.url ?? "unknown"}::${content}`;

    if (!content || seen.has(dedupeKey) || isNoisyChunk(content, intentTokens)) {
      continue;
    }

    seen.add(dedupeKey);
    chunks.push(
      source
        ? `[Source: ${source.label} | ${source.url}]\n${content}`
        : content,
    );
  }

  return truncateContext(chunks.join("\n\n").trim());
}

async function getCollectionStatusSummary(collectionId: string): Promise<{
  indexedFiles: number;
  erroredFiles: number;
  activeFiles: number;
}> {
  const response = await fetch(`${NEEDLE_API_URL}/api/v1/collections/${collectionId}/stats`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": getNeedleApiKey(),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Needle could not read collection status");
  }

  const payload = (await response.json()) as {
    result?: {
      data_stats?: Array<{
        status?: string;
        files?: number;
      }>;
    };
  };
  const dataStats = payload.result?.data_stats ?? [];

  return dataStats.reduce(
    (summary, entry) => {
      const files = entry.files ?? 0;

      if (entry.status === "indexed") {
        summary.indexedFiles += files;
      } else if (entry.status === "error") {
        summary.erroredFiles += files;
      } else {
        summary.activeFiles += files;
      }

      return summary;
    },
    {
      indexedFiles: 0,
      erroredFiles: 0,
      activeFiles: 0,
    },
  );
}

async function waitForCollectionIndexing(collectionId: string): Promise<void> {
  const startedAt = Date.now();

  while (Date.now() - startedAt < INDEX_TIMEOUT_MS) {
    const { activeFiles, indexedFiles, erroredFiles } =
      await getCollectionStatusSummary(collectionId);

    if (erroredFiles > 0) {
      throw new Error("Needle failed to index the source URL");
    }

    if (indexedFiles > 0 && activeFiles === 0) {
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
  }

  throw new Error("Needle indexing timed out");
}

export async function extractContent({
  input,
  userIntent,
}: {
  input: string;
  userIntent?: string | null;
}): Promise<ExtractedContentResult> {
  const trimmed = input.trim();
  const intent = normalizeIntent(userIntent);

  if (!trimmed) {
    throw new Error("Input is required");
  }

  if (!isUrl(trimmed)) {
    const combined = intent ? `${trimmed}\n\nUser need:\n${intent}` : trimmed;

    return {
      context: combined,
      relevantSources: [],
      userIntent: intent,
    };
  }

  const needle = getNeedleClient();
  const relevantSources = await discoverRelevantSources(trimmed, intent);
  const intentTokens = getIntentTokens(intent, trimmed);
  const collection = await needle.collections
    .create({
      name: `sourcewave-${Date.now()}`,
      model: null,
    })
    .catch(() => {
      throw new Error("Needle could not create a collection");
    });

  const uploadedFiles = await needle.collections.files
    .add({
      collection_id: collection.id,
      files: relevantSources.map((source, index) => ({
        name: `source-${index + 1}`,
        url: source.url,
      })),
    })
    .catch(() => {
      throw new Error("Needle could not add the source URL");
    });
  const fileLookup = new Map(
    uploadedFiles.map((file) => {
      const matchedSource =
        relevantSources.find((source) => source.url === file.url) ??
        ({
          url: file.url,
          label: file.name,
        } satisfies RetrievedSource);

      return [file.id, matchedSource] as const;
    }),
  );

  if (!uploadedFiles.length || uploadedFiles.some((file) => file.status === "error")) {
    throw new Error("Needle could not add the source URL");
  }

  await waitForCollectionIndexing(collection.id);

  for (const query of buildSearchQueries(trimmed, intent)) {
    const results = await needle.collections.search({
      collection_id: collection.id,
      text: query,
      top_k: 10,
    });
    const normalized = normalizeResults(results, intentTokens, fileLookup);

    if (normalized) {
      return {
        context: truncateContext(
          [
            intent ? `User intent:\n${intent}` : "",
            buildSourceHeader(relevantSources),
            "Retrieved evidence:",
            normalized,
          ]
            .filter(Boolean)
            .join("\n\n")
            .trim(),
        ),
        relevantSources,
        userIntent: intent,
      };
    }
  }

  return {
    context: truncateContext(
      [intent ? `User intent:\n${intent}` : "", buildSourceHeader(relevantSources)]
        .filter(Boolean)
        .join("\n\n")
        .trim(),
    ),
    relevantSources,
    userIntent: intent,
  };
}
