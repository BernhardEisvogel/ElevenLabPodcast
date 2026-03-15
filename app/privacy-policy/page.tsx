import type { Metadata } from "next";

import { legalHighlights, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for Sourcewave Labs.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="px-4 pb-4 pt-6 sm:px-6 lg:px-10">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <section className="how-slide rounded-[2rem] px-6 py-8 sm:px-8 lg:px-10">
          <p className="label-mono text-[11px] text-[var(--muted)]">Privacy policy</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-5xl">
            Privacy and data handling at {siteConfig.legalName}.
          </h1>
          <p className="mt-5 text-base leading-8 text-[var(--muted)]">
            This policy explains how Sourcewave handles submitted source material, generated
            outputs, and contact-form data.
          </p>
        </section>

        <section className="glass-card rounded-[2rem] p-6 sm:p-8">
          <div className="space-y-6 text-sm leading-8 text-[var(--muted)] sm:text-base">
            <div>
              <h2 className="text-xl font-semibold text-slate-950">What we collect</h2>
              <p className="mt-3">
                We process URLs, prompts, selected voice inputs, generated transcripts, audio
                outputs, and contact-form submissions necessary to operate the service.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-950">How we use data</h2>
              <p className="mt-3">
                Data is used to retrieve content, generate scripts, render audio, respond to
                contact requests, and maintain the product experience.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-950">Service providers</h2>
              <p className="mt-3">
                Sourcewave relies on third-party providers, including Needle, Featherless AI,
                ElevenLabs, and Formspree, to fulfill core workflow steps.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-950">Key points</h2>
              <div className="mt-3 space-y-3">
                {legalHighlights.map((item) => (
                  <div
                    key={item}
                    className="rounded-[1.4rem] border border-slate-900/10 bg-white/82 px-4 py-4"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-950">Requests</h2>
              <p className="mt-3">
                For privacy-related questions or deletion requests, use the contact page and label
                the subject as a privacy request.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
