import type { Metadata } from "next";

import { legalHighlights, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: "Terms and conditions for using Sourcewave.",
};

export default function TermsPage() {
  return (
    <main className="px-4 pb-4 pt-6 sm:px-6 lg:px-10">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <section className="how-slide rounded-[2rem] px-6 py-8 sm:px-8 lg:px-10">
          <p className="label-mono text-[11px] text-[var(--muted)]">Terms and conditions</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-5xl">
            Terms for using {siteConfig.name}.
          </h1>
          <p className="mt-5 text-base leading-8 text-[var(--muted)]">
            These terms govern access to the Sourcewave site, studio, and related workflows.
          </p>
        </section>

        <section className="glass-card rounded-[2rem] p-6 sm:p-8">
          <div className="space-y-6 text-sm leading-8 text-[var(--muted)] sm:text-base">
            <div>
              <h2 className="text-xl font-semibold text-slate-950">Acceptable use</h2>
              <p className="mt-3">
                You may use the service only with content you are permitted to process and in a
                way that complies with applicable law and third-party platform rules.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-950">Generated output</h2>
              <p className="mt-3">
                Sourcewave provides generated transcripts and audio as workflow outputs. You remain
                responsible for reviewing and validating generated material before relying on it
                externally.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-950">Third-party services</h2>
              <p className="mt-3">
                Certain capabilities rely on third-party APIs and services. Availability, limits,
                and quality may vary based on those providers.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-950">Important notes</h2>
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
              <h2 className="text-xl font-semibold text-slate-950">Changes</h2>
              <p className="mt-3">
                We may update these terms as the product evolves. Continued use of the service
                after changes means you accept the updated terms.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
