import type { Metadata } from "next";

import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Talk to Sourcewave about grounded voice products, voice agents, and audio workflows.",
};

export default function ContactPage() {
  return (
    <main className="px-4 pb-4 pt-6 sm:px-6 lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <section className="how-slide how-slide-hero rounded-[2rem] px-6 py-8 sm:px-8 lg:px-10">
          <p className="label-mono text-[11px] text-[var(--muted)]">Contact</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-5xl">
            Tell us what you want to build with grounded voice.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-[var(--muted)]">
            We help teams turn source material into podcasts, explainers, internal briefings, and
            voice-agent content with a workflow that stays inspectable end to end.
          </p>

          <div className="mt-8 space-y-3">
            {[
              "Launch audio workflows for product marketing",
              "Build voice-agent demos from real source material",
              "Repurpose blogs, docs, and updates into audio assets",
              "Design safer review flows before synthetic audio goes live",
            ].map((item) => (
              <div
                key={item}
                className="rounded-[1.4rem] border border-slate-900/10 bg-white/82 px-4 py-4 text-sm text-slate-900"
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="glass-card rounded-[2rem] p-6 sm:p-8">
          <p className="label-mono text-[11px] text-[var(--muted)]">Send a note</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950">
            We read every serious workflow request.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--muted)]">
            This form submits through Formspree and comes straight into the project inbox.
          </p>

          <div className="mt-6">
            <ContactForm />
          </div>
        </section>
      </div>
    </main>
  );
}
