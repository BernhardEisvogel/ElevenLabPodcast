"use client";

import { useState } from "react";

type ScriptLine = {
  speaker: "ALEX" | "SAM";
  text: string;
};

type DebugInfo = {
  extractedPreview?: string;
  rawScript?: string;
  charCount?: number;
  wordCount?: number;
  estimatedDurationSec?: number;
  lineCount?: number;
};

const LOADING_STEPS = [
  "Extracting content...",
  "Writing script...",
  "Generating audio...",
];

export default function HomePage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState<string>(LOADING_STEPS[0]);
  const [error, setError] = useState<string | null>(null);
  const [scriptLines, setScriptLines] = useState<ScriptLine[]>([]);
  const [debug, setDebug] = useState<DebugInfo | null>(null);

  async function onGenerate() {
    const trimmed = input.trim();
    if (!trimmed) {
      setError("Please enter a URL or topic.");
      return;
    }

    setLoading(true);
    setError(null);
    setScriptLines([]);
    setDebug(null);
    setLoadingText(LOADING_STEPS[0]);

    const stepTimer = window.setInterval(() => {
      setLoadingText((current) => {
        const idx = LOADING_STEPS.indexOf(current);
        const next = Math.min(idx + 1, LOADING_STEPS.length - 1);
        return LOADING_STEPS[next];
      });
    }, 1200);

    try {
      const res = await fetch("/api/script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: trimmed }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to generate podcast script.");
      }

      if (!Array.isArray(data?.scriptLines)) {
        throw new Error("Invalid response from API.");
      }

      setScriptLines(data.scriptLines);
      setDebug(data?.debug || null);
      setLoadingText(LOADING_STEPS[LOADING_STEPS.length - 1]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      window.clearInterval(stepTimer);
      setLoading(false);
    }
  }

  return (
    <main
      style={{ background: "#0a0a0a" }}
      className="min-h-screen text-white flex items-center justify-center px-4"
    >
      <section className="w-full max-w-2xl rounded-xl border border-white/10 bg-white/5 p-6 sm:p-8">
        <h1 className="text-3xl font-semibold tracking-tight">Drop</h1>
        <p className="mt-2 text-sm text-white/75">
          Paste a URL or topic. Get a podcast episode in 60 seconds.
        </p>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste a URL or describe a topic..."
          className="mt-5 h-36 w-full rounded-lg border border-white/15 bg-black/20 p-4 text-sm outline-none placeholder:text-white/40 focus:border-white/40"
        />

        <button
          type="button"
          onClick={onGenerate}
          disabled={loading}
          className="mt-4 w-full rounded-lg bg-white text-black font-medium py-3 disabled:opacity-60"
        >
          {loading ? "Generating..." : "Generate"}
        </button>

        {loading ? <p className="mt-3 text-sm text-white/80">{loadingText}</p> : null}
        {error ? <p className="mt-3 text-sm text-red-300">{error}</p> : null}

        {scriptLines.length > 0 ? (
          <div className="mt-6 space-y-5">
            <div className="rounded-lg border border-white/10 bg-black/20 p-4">
              <p className="text-xs uppercase tracking-wide text-white/60">Episode Stats</p>
              <p className="mt-2 text-sm text-white/85">
                {debug?.lineCount ?? scriptLines.length} lines • {debug?.wordCount ?? 0} words • {debug?.charCount ?? 0} chars • ~{debug?.estimatedDurationSec ?? 0}s
              </p>
            </div>

            <div className="space-y-3">
              {scriptLines.map((line, idx) => (
                <p
                  key={`${line.speaker}-${idx}`}
                  className="text-sm leading-relaxed"
                  style={{ color: line.speaker === "ALEX" ? "#6b9fd4" : "#d4a843" }}
                >
                  <span className="font-semibold">{line.speaker}:</span> {line.text}
                </p>
              ))}
            </div>

            <div className="rounded-lg border border-white/10 bg-black/20 p-4">
              <p className="text-xs uppercase tracking-wide text-white/60">
                Needle Output (Extracted Content Preview)
              </p>
              <p className="mt-2 whitespace-pre-wrap text-xs text-white/80">
                {debug?.extractedPreview || "No extraction preview available."}
              </p>
            </div>

            <div className="rounded-lg border border-white/10 bg-black/20 p-4">
              <p className="text-xs uppercase tracking-wide text-white/60">
                Featherless Output (Raw Script)
              </p>
              <p className="mt-2 whitespace-pre-wrap text-xs text-white/80">
                {debug?.rawScript || "No raw script available."}
              </p>
            </div>
          </div>
        ) : null}
      </section>
    </main>
  );
}
