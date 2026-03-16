import Link from "next/link";
import type { Metadata } from "next";

import {
  extensionBenefits,
  extensionHowToSteps,
  extensionInstallSteps,
  extensionTrustNotes,
  siteConfig,
} from "@/lib/site";

export const metadata: Metadata = {
  title: "Chrome Extension",
  description:
    "Install the Sourcewave Chrome extension to capture the current page and open Sourcewave Studio with the URL prefilled.",
};

export default function ChromeExtensionPage() {
  return (
    <main className="px-4 pb-8 pt-6 sm:px-6 lg:px-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 lg:gap-8">
        <section className="how-slide how-slide-hero rounded-[2.4rem] px-6 py-8 sm:px-8 lg:px-12 lg:py-12">
          <div className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
            <div className="max-w-3xl">
              <p className="label-mono text-[11px] text-[var(--muted)]">Chrome extension</p>
              <h1
                className="mt-4 text-4xl leading-none font-semibold tracking-[-0.05em] text-slate-950 sm:text-5xl lg:text-6xl"
                data-testid="extension-page-heading"
              >
                Capture the page you are already reading and send it into Sourcewave Studio.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--muted)] sm:text-lg">
                The Sourcewave Chrome extension is a lightweight handoff tool. It reads the active
                tab, opens the studio with the URL prefilled, and keeps the grounded review flow on
                the web app where the answer, transcript, and audio are generated.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#install-steps"
                  className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-deep)]"
                  data-testid="extension-install-cta"
                >
                  Install for Chrome
                </a>
                <Link
                  href={siteConfig.studioHref}
                  className="rounded-full border border-slate-900/10 bg-white/85 px-5 py-3 text-sm font-medium text-slate-900 transition hover:border-[var(--accent)]"
                >
                  Open studio
                </Link>
              </div>
            </div>

            <article className="glass-card-strong rounded-[2rem] p-5 sm:p-6">
              <p className="label-mono text-[10px] text-[var(--muted)]">What it does</p>
              <div className="mt-4 space-y-4">
                {[
                  "Reads the current active tab when you open the extension.",
                  "Shows the page domain so you can confirm the source before opening the studio.",
                  "Launches Sourcewave Studio with the current URL in the source field.",
                ].map((item, index) => (
                  <div
                    key={item}
                    className="rounded-[1.5rem] border border-slate-900/10 bg-white/84 px-4 py-4"
                  >
                    <p className="label-mono text-[10px] text-[var(--muted)]">
                      Step {String(index + 1).padStart(2, "0")}
                    </p>
                    <p className="mt-2 text-sm leading-7 text-slate-900">{item}</p>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </section>

        <section className="glass-card rounded-[2.2rem] px-6 py-8 sm:px-8">
          <div className="max-w-3xl">
            <p className="label-mono text-[11px] text-[var(--muted)]">Why use it</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">
              Faster capture, same grounded workflow.
            </h2>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {extensionBenefits.map((item) => (
              <article
                key={item.title}
                className="rounded-[1.8rem] border border-slate-900/10 bg-white/84 p-5"
              >
                <h3 className="text-lg font-semibold text-slate-950">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{item.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section
          id="install-steps"
          className="glass-card rounded-[2.2rem] px-6 py-8 sm:px-8"
          data-testid="extension-install-steps"
        >
          <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
            <div>
              <p className="label-mono text-[11px] text-[var(--muted)]">Install</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">
                Manual Chrome install for the first release.
              </h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-[var(--muted)]">
                Download the extension archive, unzip it locally, and load the unpacked folder in
                Chrome. This keeps the first release simple while the extension stays easy to test
                and iterate.
              </p>

              <a
                href={siteConfig.extensionDownloadHref}
                download
                className="mt-6 inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                data-testid="extension-download-link"
              >
                Download extension files
              </a>
            </div>

            <div className="space-y-3">
              {extensionInstallSteps.map((step, index) => (
                <article
                  key={step}
                  className="rounded-[1.6rem] border border-slate-900/10 bg-white/84 px-4 py-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-900/10 bg-white text-sm font-semibold text-slate-950">
                      {index + 1}
                    </div>
                    <p className="pt-1 text-sm leading-7 text-slate-900">{step}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.02fr_0.98fr]">
          <article className="glass-card rounded-[2.2rem] px-6 py-8 sm:px-8">
            <p className="label-mono text-[11px] text-[var(--muted)]">How to use it</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">
              After install, the flow is intentionally short.
            </h2>
            <div className="mt-7 space-y-3">
              {extensionHowToSteps.map((step, index) => (
                <div
                  key={step}
                  className="rounded-[1.6rem] border border-slate-900/10 bg-white/84 px-4 py-4"
                >
                  <p className="label-mono text-[10px] text-[var(--muted)]">
                    Flow {String(index + 1).padStart(2, "0")}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-slate-900">{step}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="glass-card rounded-[2.2rem] px-6 py-8 sm:px-8">
            <p className="label-mono text-[11px] text-[var(--muted)]">Permissions and trust</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">
              Minimal permissions for a focused handoff.
            </h2>
            <div className="mt-7 space-y-3">
              {extensionTrustNotes.map((item) => (
                <div
                  key={item}
                  className="rounded-[1.6rem] border border-slate-900/10 bg-white/84 px-4 py-4 text-sm leading-7 text-slate-900"
                >
                  {item}
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="how-slide how-slide-dark rounded-[2.2rem] px-6 py-8 text-center sm:px-8 lg:px-10 lg:py-12">
          <div className="mx-auto max-w-3xl">
            <p className="label-mono text-[11px] text-white/50">Next step</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
              Start in the extension, finish in the studio.
            </h2>
            <p className="mt-5 text-base leading-7 text-white/72 sm:text-lg">
              The extension speeds up capture. The studio is still where you review the grounded
              answer, inspect the context, and render the final audio.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href={siteConfig.studioHref}
                className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-white/90"
              >
                Open studio
              </Link>
              <a
                href={siteConfig.extensionDownloadHref}
                download
                className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/35"
              >
                Download extension files
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
