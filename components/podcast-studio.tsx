"use client";

import Link from "next/link";
import { useDeferredValue, useEffect, useRef, useState, useTransition } from "react";

import { siteConfig } from "@/lib/site";
import type {
  EpisodeAudio,
  EpisodeLanguage,
  GeneratePodcastResponse,
  VoiceOption,
} from "@/lib/types";

function isLikelyUrl(input: string): boolean {
  return /^https?:\/\//i.test(input.trim());
}

function bytesFromBase64(base64: string): Uint8Array {
  const binary = window.atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
}

function blobFromBase64(base64: string, mimeType: string): Blob {
  const bytes = bytesFromBase64(base64);
  const buffer = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(buffer).set(bytes);
  return new Blob([buffer], { type: mimeType });
}

function getLanguageLabel(language: EpisodeLanguage): string {
  return language === "de" ? "German" : "English";
}

export function PodcastStudio() {
  const [input, setInput] = useState("");
  const [userIntent, setUserIntent] = useState("");
  const [followUpQuestion, setFollowUpQuestion] = useState("");
  const [language, setLanguage] = useState<EpisodeLanguage>("en");
  const [result, setResult] = useState<GeneratePodcastResponse | null>(null);
  const [audio, setAudio] = useState<EpisodeAudio | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [voices, setVoices] = useState<VoiceOption[]>([]);
  const [voicesError, setVoicesError] = useState<string | null>(null);
  const [voiceIdHostA, setVoiceIdHostA] = useState("");
  const [voiceIdHostB, setVoiceIdHostB] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPending, startTransition] = useTransition();
  const deferredInput = useDeferredValue(input);
  const deferredIntent = useDeferredValue(userIntent);
  const lastAudioUrl = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadVoices() {
      const response = await fetch("/api/voices", { cache: "no-store" });
      const payload = (await response.json()) as {
        error?: string;
        voices?: VoiceOption[];
      };

      if (cancelled) {
        return;
      }

      if (!response.ok) {
        setVoices([]);
        setVoicesError(payload.error ?? "Set ELEVENLABS_API_KEY to load voice options.");
        return;
      }

      const loadedVoices = payload.voices ?? [];
      setVoices(loadedVoices);
      setVoicesError(null);
      setVoiceIdHostA((current) => current || loadedVoices[0]?.id || "");
      setVoiceIdHostB((current) => current || loadedVoices[1]?.id || "");
    }

    void loadVoices();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!audio) {
      if (lastAudioUrl.current) {
        URL.revokeObjectURL(lastAudioUrl.current);
        lastAudioUrl.current = null;
      }

      setAudioUrl(null);
      return;
    }

    const blob = blobFromBase64(audio.base64, audio.mimeType);
    const nextUrl = URL.createObjectURL(blob);

    if (lastAudioUrl.current) {
      URL.revokeObjectURL(lastAudioUrl.current);
    }

    lastAudioUrl.current = nextUrl;
    setAudioUrl(nextUrl);

    return () => {
      if (lastAudioUrl.current) {
        URL.revokeObjectURL(lastAudioUrl.current);
        lastAudioUrl.current = null;
      }
    };
  }, [audio]);

  async function runGeneration({
    nextIntent,
    reuseRetrievedContext = false,
  }: {
    nextIntent?: string | null;
    reuseRetrievedContext?: boolean;
  } = {}) {
    const reuseExistingResult =
      reuseRetrievedContext && Boolean(result?.retrievalContext) && Boolean(result?.relevantSources.length);
    const resolvedIntent = nextIntent ?? (userIntent.trim() || null);

    setIsSubmitting(true);
    setError(null);

    if (!reuseExistingResult) {
      setResult(null);
      setAudio(null);
    }

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input,
          userIntent: resolvedIntent,
          language,
          retrievalContext: reuseExistingResult ? result?.retrievalContext : null,
          relevantSources: reuseExistingResult ? result?.relevantSources : [],
          voiceIdHostA,
          voiceIdHostB,
        }),
      });

      const payload = (await response.json()) as GeneratePodcastResponse & { error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? "The episode request failed.");
      }

      startTransition(() => {
        setResult(payload);
        setAudio(payload.audio);
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    void runGeneration().catch((submissionError: unknown) => {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Something went wrong while generating the episode.",
      );
    });
  }

  function handleFollowUp(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!followUpQuestion.trim()) {
      return;
    }

    void runGeneration({
      nextIntent: followUpQuestion.trim(),
      reuseRetrievedContext: true,
    })
      .then(() => {
        setFollowUpQuestion("");
      })
      .catch((submissionError: unknown) => {
        setError(
          submissionError instanceof Error
            ? submissionError.message
            : "Something went wrong while generating the episode.",
        );
      });
  }

  const trimmedInput = deferredInput.trim();
  const trimmedIntent = deferredIntent.trim();
  const inputMode = isLikelyUrl(trimmedInput)
    ? trimmedIntent
      ? "Intent-guided URL mode"
      : "URL mode"
    : "Topic mode";
  const isBusy = isSubmitting || isPending;
  const selectedVoiceA = voices.find((voice) => voice.id === voiceIdHostA) ?? null;
  const selectedVoiceB = voices.find((voice) => voice.id === voiceIdHostB) ?? null;
  const intentLabel = isLikelyUrl(trimmedInput)
    ? "What do you need from this site?"
    : "Optional angle or constraint";
  const intentPlaceholder = isLikelyUrl(trimmedInput)
    ? "I need driving licence related information in Berlin, especially requirements, documents, fees, and appointments."
    : "Focus on onboarding, compare options, or explain the main tradeoffs.";
  const canFollowUp =
    Boolean(result?.retrievalContext) &&
    Boolean(result?.relevantSources.length) &&
    result?.sourceType === "url";

  return (
    <main className="px-4 py-8 text-slate-900 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <section className="glass-card-strong rounded-[2rem] px-6 py-7 sm:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-4">
              <p className="label-mono text-[11px] text-[var(--muted)]">{siteConfig.name} Studio</p>
              <h1 className="text-4xl leading-none font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl">
                Ask a site for exactly what you need, then turn the answer into audio.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-lg">
                Add intent, switch between English and German, inspect citations, and ask
                follow-up questions without crawling the site again.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="rounded-full border border-slate-900/10 bg-white/75 px-4 py-2 text-sm text-slate-900">
                {inputMode}
              </div>
              <div className="rounded-full border border-slate-900/10 bg-white/75 px-4 py-2 text-sm text-slate-900">
                {getLanguageLabel(language)}
              </div>
              <Link
                href="/how-it-works"
                className="inline-flex items-center rounded-full border border-slate-900/10 bg-white/75 px-4 py-2 text-sm text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-slate-900"
              >
                How it works
              </Link>
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
          <form onSubmit={handleSubmit} className="glass-card rounded-[2rem] p-6 sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="label-mono text-[11px] text-[var(--muted)]">Input</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">
                  Source and intent
                </h2>
              </div>
              <div className="rounded-full border border-slate-900/10 bg-white/70 px-3 py-2 text-right">
                <p className="label-mono text-[10px] text-[var(--muted)]">Mode</p>
                <p className="mt-1 text-sm font-medium text-slate-900">{inputMode}</p>
              </div>
            </div>

            <div className="mt-6 space-y-5">
              <label className="block">
                <span className="label-mono text-[11px] text-[var(--muted)]">URL or topic</span>
                <textarea
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  data-testid="source-input"
                  placeholder="Paste a public website URL, or type a topic if you want a general audio briefing."
                  className="mt-2 min-h-40 w-full rounded-[1.6rem] border border-slate-900/10 bg-white px-5 py-4 text-base leading-7 text-slate-900 outline-none transition focus:border-[var(--accent)] focus:ring-4 focus:ring-[rgba(255,122,48,0.12)]"
                />
              </label>

              <label className="block">
                <span className="label-mono text-[11px] text-[var(--muted)]">{intentLabel}</span>
                <textarea
                  value={userIntent}
                  onChange={(event) => setUserIntent(event.target.value)}
                  data-testid="intent-input"
                  placeholder={intentPlaceholder}
                  className="mt-2 min-h-32 w-full rounded-[1.6rem] border border-slate-900/10 bg-white px-5 py-4 text-base leading-7 text-slate-900 outline-none transition focus:border-[var(--accent)] focus:ring-4 focus:ring-[rgba(255,122,48,0.12)]"
                />
              </label>

              {isLikelyUrl(trimmedInput) && !trimmedIntent ? (
                <div className="rounded-[1.4rem] border border-amber-200 bg-amber-50 px-4 py-4 text-sm leading-6 text-amber-800">
                  Add a short intent to strip unrelated sections from broad sites like portals,
                  government pages, or directories.
                </div>
              ) : null}

              <div className="grid gap-4 md:grid-cols-3">
                <label className="block">
                  <span className="label-mono text-[11px] text-[var(--muted)]">Language</span>
                  <select
                    value={language}
                    onChange={(event) => setLanguage(event.target.value === "de" ? "de" : "en")}
                    data-testid="language-select"
                    className="mt-2 h-[52px] w-full rounded-2xl border border-slate-900/10 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-[var(--accent)] focus:ring-4 focus:ring-[rgba(255,122,48,0.12)]"
                  >
                    <option value="en">English</option>
                    <option value="de">German</option>
                  </select>
                </label>

                <label className="block">
                  <span className="label-mono text-[11px] text-[var(--muted)]">Host A voice</span>
                  <select
                    value={voiceIdHostA}
                    onChange={(event) => setVoiceIdHostA(event.target.value)}
                    data-testid="voice-select-a"
                    className="mt-2 h-[52px] w-full rounded-2xl border border-slate-900/10 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-[var(--accent)] focus:ring-4 focus:ring-[rgba(255,122,48,0.12)]"
                  >
                    <option value="">Use `.env.local` default</option>
                    {voices.map((voice) => (
                      <option key={voice.id} value={voice.id}>
                        {voice.name}
                        {voice.category ? ` - ${voice.category}` : ""}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="label-mono text-[11px] text-[var(--muted)]">Host B voice</span>
                  <select
                    value={voiceIdHostB}
                    onChange={(event) => setVoiceIdHostB(event.target.value)}
                    data-testid="voice-select-b"
                    className="mt-2 h-[52px] w-full rounded-2xl border border-slate-900/10 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-[var(--accent)] focus:ring-4 focus:ring-[rgba(255,122,48,0.12)]"
                  >
                    <option value="">Use `.env.local` default</option>
                    {voices.map((voice) => (
                      <option key={voice.id} value={voice.id}>
                        {voice.name}
                        {voice.category ? ` - ${voice.category}` : ""}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div
                className="rounded-[1.5rem] border border-slate-900/8 bg-white px-4 py-4 text-sm leading-6 text-[var(--muted)]"
                data-testid="voice-loading"
              >
                <p className="label-mono text-[10px]">Voices</p>
                <p className="mt-2">
                  {voicesError
                    ? voicesError
                    : voices.length
                      ? "Voice options loaded from ElevenLabs. Pick two distinct voices or keep the defaults from `.env.local`."
                      : "No live voices available yet. Add your ElevenLabs API key and reload the page."}
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {[selectedVoiceA, selectedVoiceB].map((voice, index) => (
                  <div
                    key={index === 0 ? "host-a-preview" : "host-b-preview"}
                    className="rounded-[1.5rem] border border-slate-900/10 bg-white p-4"
                  >
                    <p className="label-mono text-[10px] text-[var(--muted)]">
                      {index === 0 ? "Host A preview" : "Host B preview"}
                    </p>
                    <p className="mt-2 text-sm font-medium text-slate-900">
                      {voice?.name ?? "No voice selected"}
                    </p>
                    <p className="mt-1 text-sm text-[var(--muted)]">
                      {voice?.category ?? "Preview appears when available"}
                    </p>
                    {voice?.previewUrl ? (
                      <audio
                        className="mt-3 w-full"
                        controls
                        preload="none"
                        src={voice.previewUrl}
                        data-testid={index === 0 ? "preview-audio-a" : "preview-audio-b"}
                      />
                    ) : (
                      <p className="mt-3 text-sm text-[var(--muted)]">No preview clip available.</p>
                    )}
                  </div>
                ))}
              </div>

              {error ? (
                <div className="rounded-[1.5rem] border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={isBusy || !trimmedInput}
                data-testid="generate-button"
                className="flex h-14 w-full items-center justify-center rounded-full bg-[var(--accent)] px-6 text-base font-semibold text-white transition hover:bg-[var(--accent-deep)] disabled:cursor-not-allowed disabled:bg-[rgba(255,122,48,0.55)]"
              >
                {isBusy ? "Generating briefing..." : "Generate briefing"}
              </button>
            </div>
          </form>

          <section className="space-y-6">
            <article className="glass-card rounded-[2rem] p-6 sm:p-7">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="label-mono text-[11px] text-[var(--muted)]">Answer</p>
                  <h2
                    className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950"
                    data-testid="episode-title"
                  >
                    {result?.episode.title ?? "Nothing generated yet"}
                  </h2>
                </div>
                <div className="flex flex-wrap gap-3 text-sm">
                  <div className="rounded-full border border-slate-900/10 bg-white px-3 py-2">
                    {result?.sourceType === "url" ? "Grounded URL retrieval" : "Topic generation"}
                  </div>
                  <div className="rounded-full border border-slate-900/10 bg-white px-3 py-2">
                    {result ? getLanguageLabel(result.language) : getLanguageLabel(language)}
                  </div>
                  <div className="rounded-full border border-slate-900/10 bg-white px-3 py-2">
                    {result?.episode.dialogue.length ?? 0} lines
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
                <div className="rounded-[1.6rem] border border-slate-900/10 bg-white p-5">
                  <p className="label-mono text-[10px] text-[var(--muted)]">Direct answer</p>
                  <p
                    className="mt-3 text-base leading-7 text-slate-900"
                    data-testid="direct-answer"
                  >
                    {result?.episode.directAnswer ??
                      "The grounded answer will appear here after generation."}
                  </p>

                  <p className="label-mono mt-6 text-[10px] text-[var(--muted)]">Summary</p>
                  <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                    {result?.episode.summary ??
                      "A tighter summary, focused on the requested topic, will appear here."}
                  </p>

                  {result?.userIntent ? (
                    <>
                      <p className="label-mono mt-6 text-[10px] text-[var(--muted)]">User intent</p>
                      <p className="mt-2 text-sm leading-7 text-slate-900" data-testid="result-intent">
                        {result.userIntent}
                      </p>
                    </>
                  ) : null}
                </div>

                <div className="rounded-[1.6rem] border border-slate-900/10 bg-slate-950 p-5 text-white">
                  <p className="label-mono text-[10px] text-white/50">Audio</p>
                  {audioUrl ? (
                    <>
                      <audio className="mt-4 w-full" controls src={audioUrl} data-testid="audio-player" />
                      <div className="mt-4 flex flex-wrap gap-3 text-sm text-white/72">
                        <span>{result?.episode.estimatedCharacters ?? 0} chars</span>
                        <span>{result?.episode.dialogue.length ?? 0} scripted turns</span>
                      </div>
                      {result?.episode.usageWarning ? (
                        <p className="mt-3 text-sm text-amber-300">{result.episode.usageWarning}</p>
                      ) : null}
                      <a
                        href={audioUrl}
                        download={`${result?.episode.title ?? "sourcewave-briefing"}.mp3`}
                        className="mt-5 inline-flex rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white transition hover:border-white/35"
                      >
                        Download audio
                      </a>
                    </>
                  ) : (
                    <p className="mt-4 max-w-md text-sm leading-7 text-white/68">
                      The final audio briefing will appear here as a single playable file.
                    </p>
                  )}
                </div>
              </div>
            </article>

            {canFollowUp ? (
              <article className="glass-card rounded-[2rem] p-6 sm:p-7">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="label-mono text-[11px] text-[var(--muted)]">Follow-up</p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">
                      Ask another question on the same sources
                    </h2>
                  </div>
                  <div className="rounded-full border border-slate-900/10 bg-white px-3 py-2 text-sm text-[var(--muted)]">
                    Reusing {result?.relevantSources.length ?? 0} retrieved pages
                  </div>
                </div>
                <form onSubmit={handleFollowUp} className="mt-5 space-y-4">
                  <textarea
                    value={followUpQuestion}
                    onChange={(event) => setFollowUpQuestion(event.target.value)}
                    data-testid="follow-up-input"
                    placeholder="What documents do I need, and where do I book the appointment?"
                    className="min-h-28 w-full rounded-[1.6rem] border border-slate-900/10 bg-white px-5 py-4 text-base leading-7 text-slate-900 outline-none transition focus:border-[var(--accent)] focus:ring-4 focus:ring-[rgba(255,122,48,0.12)]"
                  />
                  <button
                    type="submit"
                    disabled={isBusy || !followUpQuestion.trim()}
                    data-testid="follow-up-button"
                    className="inline-flex h-12 items-center justify-center rounded-full border border-slate-900/10 bg-white px-5 text-sm font-medium text-slate-900 transition hover:border-[var(--accent)] disabled:cursor-not-allowed disabled:text-[var(--muted)]"
                  >
                    {isBusy ? "Generating follow-up..." : "Generate follow-up"}
                  </button>
                </form>
              </article>
            ) : null}

            <article className="glass-card rounded-[2rem] p-6 sm:p-7">
              <div className="grid gap-4 xl:grid-cols-3">
                <div className="rounded-[1.6rem] border border-slate-900/10 bg-white p-5">
                  <p className="label-mono text-[10px] text-[var(--muted)]">Checklist</p>
                  <div className="mt-3" data-testid="checklist">
                    {result?.episode.checklist.length ? (
                      <ul className="space-y-3 text-sm leading-7 text-slate-900">
                        {result.episode.checklist.map((item) => (
                          <li
                            key={item}
                            className="rounded-2xl border border-slate-900/8 bg-[rgba(17,32,48,0.03)] px-4 py-3"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm leading-7 text-[var(--muted)]">
                        Actionable requirements and next steps will appear here.
                      </p>
                    )}
                  </div>
                </div>

                <div className="rounded-[1.6rem] border border-slate-900/10 bg-white p-5">
                  <p className="label-mono text-[10px] text-[var(--muted)]">Claim citations</p>
                  <div className="mt-3 space-y-3" data-testid="citations">
                    {result?.episode.citations.length ? (
                      result.episode.citations.map((citation) => (
                        <article
                          key={`${citation.claim}-${citation.sourceUrl}`}
                          className="rounded-2xl border border-slate-900/8 bg-[rgba(17,32,48,0.03)] px-4 py-3"
                        >
                          <p className="text-sm font-medium text-slate-900">{citation.claim}</p>
                          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                            {citation.evidence}
                          </p>
                          <a
                            href={citation.sourceUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-3 inline-flex text-sm font-medium text-[var(--accent-deep)] transition hover:text-[var(--accent)]"
                          >
                            {citation.sourceLabel}
                          </a>
                        </article>
                      ))
                    ) : (
                      <p className="text-sm leading-7 text-[var(--muted)]">
                        Per-claim citations will appear here for grounded URL runs.
                      </p>
                    )}
                  </div>
                </div>

                <div className="rounded-[1.6rem] border border-slate-900/10 bg-white p-5">
                  <p className="label-mono text-[10px] text-[var(--muted)]">Relevant sources</p>
                  <div className="mt-3 space-y-3" data-testid="relevant-sources">
                    {result?.relevantSources.length ? (
                      result.relevantSources.map((source) => (
                        <a
                          key={source.url}
                          href={source.url}
                          target="_blank"
                          rel="noreferrer"
                          className="block rounded-2xl border border-slate-900/8 bg-[rgba(17,32,48,0.03)] px-4 py-3 transition hover:border-[var(--accent)]"
                        >
                          <p className="text-sm font-medium text-slate-900">{source.label}</p>
                          <p className="mt-1 break-all text-sm leading-6 text-[var(--muted)]">
                            {source.url}
                          </p>
                        </a>
                      ))
                    ) : (
                      <p className="text-sm leading-7 text-[var(--muted)]">
                        Retrieved source pages will appear here for URL-based runs.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </article>

            <article className="glass-card rounded-[2rem] p-6 sm:p-7">
              <div className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
                <div className="rounded-[1.6rem] border border-slate-900/10 bg-white p-5">
                  <p className="label-mono text-[10px] text-[var(--muted)]">Source input</p>
                  <p className="mt-2 break-words text-sm leading-7 text-slate-900">
                    {result?.source || "Your original URL or topic will show here."}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-3 text-sm text-[var(--muted)]">
                    <span>{result?.sourceType === "url" ? "Needle retrieval" : "Direct topic"}</span>
                    <span>{result?.contextLength ?? 0} chars</span>
                  </div>
                </div>

                <div className="rounded-[1.6rem] border border-slate-900/10 bg-white p-5">
                  <p className="label-mono text-[10px] text-[var(--muted)]">Context preview</p>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-[var(--muted)]">
                    {result?.contextPreview ??
                      "Needle retrieval context will appear here so you can inspect what grounded the briefing."}
                  </p>
                </div>
              </div>
            </article>

            <article className="glass-card rounded-[2rem] p-6 sm:p-7">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="label-mono text-[11px] text-[var(--muted)]">Transcript</p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">
                    Host-by-host script
                  </h2>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {result?.episode.dialogue.length ? (
                  result.episode.dialogue.map((line, index) => {
                    const host = result.episode.hosts.find((entry) => entry.id === line.speaker);

                    return (
                      <article
                        key={`${line.speaker}-${index}`}
                        className={`rounded-[1.6rem] border px-5 py-4 ${
                          line.speaker === "hostA"
                            ? "border-[rgba(255,122,48,0.22)] bg-[rgba(255,122,48,0.08)]"
                            : "border-[rgba(23,109,105,0.22)] bg-[rgba(23,109,105,0.08)]"
                        }`}
                      >
                        <p className="label-mono text-[10px] text-[var(--muted)]">
                          {host?.name ?? line.speaker} - {host?.role ?? "Host"}
                        </p>
                        <p className="mt-2 text-sm leading-7 text-slate-900">{line.text}</p>
                      </article>
                    );
                  })
                ) : (
                  <p className="rounded-[1.6rem] border border-dashed border-slate-900/10 bg-white px-5 py-6 text-sm leading-7 text-[var(--muted)]">
                    The final transcript will land here after generation.
                  </p>
                )}
              </div>
            </article>
          </section>
        </section>
      </div>
    </main>
  );
}
