import { NextResponse } from "next/server";

import { generateDialogueAudio } from "@/lib/elevenlabs";
import { estimateCharacters, getUsageWarning } from "@/lib/elevenlabsBudget";
import { extractContent, isUrl } from "@/lib/needle";
import { generatePodcastEpisode } from "@/lib/script";
import type { EpisodeLanguage, GeneratePodcastResponse, HostId, RetrievedSource } from "@/lib/types";

export const runtime = "nodejs";

const MAX_INPUT_CHARS = 3000;
const MAX_INTENT_CHARS = 500;
const MAX_RETRIEVAL_CONTEXT_CHARS = 12000;

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (error && typeof error === "object") {
    const candidate = error as { message?: unknown; detail?: unknown };

    if (typeof candidate.message === "string" && candidate.message.trim()) {
      return candidate.message.trim();
    }

    if (typeof candidate.detail === "string" && candidate.detail.trim()) {
      return candidate.detail.trim();
    }
  }

  return "Something went wrong while generating the episode.";
}

function resolveVoiceMap(body: {
  voiceIdHostA?: unknown;
  voiceIdHostB?: unknown;
}): Record<HostId, string> {
  const hostA =
    typeof body.voiceIdHostA === "string" && body.voiceIdHostA.trim()
      ? body.voiceIdHostA.trim()
      : process.env.ELEVENLABS_VOICE_ID_HOST_A?.trim();
  const hostB =
    typeof body.voiceIdHostB === "string" && body.voiceIdHostB.trim()
      ? body.voiceIdHostB.trim()
      : process.env.ELEVENLABS_VOICE_ID_HOST_B?.trim();

  if (!hostA || !hostB) {
    throw new Error(
      "Provide ElevenLabs voice IDs in the form or set ELEVENLABS_VOICE_ID_HOST_A and ELEVENLABS_VOICE_ID_HOST_B.",
    );
  }

  if (hostA === hostB) {
    throw new Error("Choose two different ElevenLabs voices so both hosts sound distinct.");
  }

  return {
    hostA,
    hostB,
  };
}

function buildContextPreview(context: string): string {
  const preview = context.trim();

  if (preview.length <= 1800) {
    return preview;
  }

  return `${preview.slice(0, 1797).trimEnd()}...`;
}

function normalizeLanguage(value: unknown): EpisodeLanguage {
  return value === "de" ? "de" : "en";
}

function normalizeRelevantSources(value: unknown): RetrievedSource[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((entry) => {
      if (!entry || typeof entry !== "object") {
        return null;
      }

      const candidate = entry as { url?: unknown; label?: unknown };
      const url = typeof candidate.url === "string" ? candidate.url.trim() : "";
      const label = typeof candidate.label === "string" ? candidate.label.trim() : "";

      if (!url || !label) {
        return null;
      }

      return {
        url,
        label,
      } satisfies RetrievedSource;
    })
    .filter((entry): entry is RetrievedSource => Boolean(entry));
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as
      | {
          input?: unknown;
          userIntent?: unknown;
          language?: unknown;
          retrievalContext?: unknown;
          relevantSources?: unknown;
          voiceIdHostA?: unknown;
          voiceIdHostB?: unknown;
        }
      | null;

    const input = typeof body?.input === "string" ? body.input.trim() : "";
    const userIntent =
      typeof body?.userIntent === "string" && body.userIntent.trim()
        ? body.userIntent.trim()
        : null;
    const retrievalContext =
      typeof body?.retrievalContext === "string" && body.retrievalContext.trim()
        ? body.retrievalContext.trim()
        : null;
    const language = normalizeLanguage(body?.language);
    const providedRelevantSources = normalizeRelevantSources(body?.relevantSources);

    if (!input) {
      return NextResponse.json({ error: "Input is required" }, { status: 400 });
    }

    if (input.length > MAX_INPUT_CHARS) {
      return NextResponse.json(
        { error: `Input is too long. Keep it under ${MAX_INPUT_CHARS} characters.` },
        { status: 400 },
      );
    }

    if (userIntent && userIntent.length > MAX_INTENT_CHARS) {
      return NextResponse.json(
        {
          error: `Intent is too long. Keep it under ${MAX_INTENT_CHARS} characters.`,
        },
        { status: 400 },
      );
    }

    if (retrievalContext && retrievalContext.length > MAX_RETRIEVAL_CONTEXT_CHARS) {
      return NextResponse.json(
        {
          error: `Retrieval context is too long. Keep it under ${MAX_RETRIEVAL_CONTEXT_CHARS} characters.`,
        },
        { status: 400 },
      );
    }

    const sourceType = isUrl(input) ? "url" : "topic";
    const voiceMap = resolveVoiceMap(body ?? {});
    const extracted =
      retrievalContext && providedRelevantSources.length
        ? {
            context: retrievalContext,
            relevantSources: providedRelevantSources,
            userIntent,
          }
        : await extractContent({
            input,
            userIntent,
          });
    const episode = await generatePodcastEpisode({
      source: input,
      context: extracted.context,
      sourceType,
      userIntent: extracted.userIntent,
      language,
      relevantSources: extracted.relevantSources,
    });
    const audio = await generateDialogueAudio({
      dialogue: episode.dialogue,
      voiceMap,
    });
    const estimatedCharacters = estimateCharacters(
      episode.dialogue.map((line) => line.text).join(" "),
    );
    const payload: GeneratePodcastResponse = {
      source: input,
      sourceType,
      userIntent: extracted.userIntent,
      language,
      contextPreview: buildContextPreview(extracted.context),
      retrievalContext: extracted.context,
      contextLength: extracted.context.length,
      relevantSources: extracted.relevantSources,
      episode: {
        ...episode,
        estimatedCharacters,
        usageWarning: getUsageWarning(estimatedCharacters),
      },
      audio,
    };

    return NextResponse.json(payload);
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}
