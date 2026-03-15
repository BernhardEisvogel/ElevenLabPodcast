import type { Metadata } from "next";
import Link from "next/link";

import { careerPrinciples, openRoles } from "@/lib/site";

export const metadata: Metadata = {
  title: "Careers",
  description: "Join Sourcewave and help build grounded voice products for the next generation of AI teams.",
};

export default function CareersPage() {
  return (
    <main className="px-4 pb-4 pt-6 sm:px-6 lg:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <section className="how-slide how-slide-hero rounded-[2rem] px-6 py-8 sm:px-8 lg:px-10 lg:py-12">
          <p className="label-mono text-[11px] text-[var(--muted)]">Careers</p>
          <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-6xl">
            Build the next generation of grounded voice tools.
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-[var(--muted)] sm:text-lg">
            Sourcewave sits at the intersection of retrieval, generation, and audio. We care about
            product quality, not just AI novelty.
          </p>
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
          <article className="glass-card rounded-[2rem] p-6 sm:p-8">
            <p className="label-mono text-[11px] text-[var(--muted)]">What we care about</p>
            <div className="mt-6 space-y-3">
              {careerPrinciples.map((item) => (
                <div
                  key={item}
                  className="rounded-[1.4rem] border border-slate-900/10 bg-white/82 px-4 py-4 text-sm leading-7 text-slate-900"
                >
                  {item}
                </div>
              ))}
            </div>
          </article>

          <article className="glass-card rounded-[2rem] p-6 sm:p-8">
            <p className="label-mono text-[11px] text-[var(--muted)]">Open roles</p>
            <div className="mt-6 space-y-4">
              {openRoles.map((role) => (
                <div
                  key={role.title}
                  className="rounded-[1.6rem] border border-slate-900/10 bg-white/82 p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="text-xl font-semibold tracking-[-0.03em] text-slate-950">
                      {role.title}
                    </h2>
                    <span className="rounded-full border border-slate-900/10 px-3 py-1 text-xs text-[var(--muted)]">
                      {role.mode}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{role.summary}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-[1.6rem] border border-slate-900/10 bg-slate-950 px-5 py-5 text-white">
              <p className="text-sm leading-7 text-white/76">
                Interested? Use the contact page and include the role title, relevant work, and why
                you care about grounded voice systems.
              </p>
              <Link
                href="/contact"
                className="mt-4 inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950"
              >
                Contact us
              </Link>
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
