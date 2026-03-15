import type { Metadata } from "next";

import { exampleFlows, useCases } from "@/lib/site";

export const metadata: Metadata = {
  title: "Use Cases",
  description: "See how Sourcewave fits product marketing, voice agents, support, onboarding, and internal briefing workflows.",
};

export default function UseCasesPage() {
  return (
    <main className="px-4 pb-4 pt-6 sm:px-6 lg:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <section className="how-slide how-slide-hero rounded-[2.2rem] px-6 py-8 sm:px-8 lg:px-10 lg:py-12">
          <p className="label-mono text-[11px] text-[var(--muted)]">Use cases</p>
          <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-6xl">
            Grounded voice workflows for teams shipping faster with audio.
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-[var(--muted)] sm:text-lg">
            Sourcewave is useful anywhere a team needs clean spoken output that still maps back to
            source material they can inspect.
          </p>
        </section>

        <section className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {useCases.map((item) => (
            <article key={item.title} className="glass-card rounded-[1.8rem] p-6">
              <p className="label-mono text-[10px] text-[var(--muted)]">{item.audience}</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-slate-950">
                {item.title}
              </h2>
              <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{item.summary}</p>
              <div className="mt-5 rounded-[1.4rem] border border-slate-900/10 bg-white/82 px-4 py-4 text-sm leading-7 text-slate-900">
                {item.outcome}
              </div>
            </article>
          ))}
        </section>

        <section className="glass-card rounded-[2rem] px-6 py-8 sm:px-8">
          <p className="label-mono text-[11px] text-[var(--muted)]">Example programs</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">
            Typical ways teams use Sourcewave.
          </h2>
          <div className="mt-8 grid gap-4 xl:grid-cols-3">
            {exampleFlows.map((item) => (
              <article
                key={item.title}
                className="rounded-[1.7rem] border border-slate-900/10 bg-white/82 p-5"
              >
                <div className="flex flex-wrap gap-2 text-xs text-[var(--muted)]">
                  <span className="rounded-full bg-slate-950 px-3 py-1 text-white">
                    {item.source}
                  </span>
                  <span className="rounded-full border border-slate-900/10 px-3 py-1">
                    {item.output}
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-950">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{item.detail}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
