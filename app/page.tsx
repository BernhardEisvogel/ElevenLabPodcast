import Link from "next/link";

import {
  exampleFlows,
  extensionBenefits,
  featureCards,
  homeWorkflow,
  siteConfig,
  useCases,
} from "@/lib/site";

export default function Home() {
  const featuredUseCases = useCases.slice(0, 3);

  return (
    <main className="px-4 pb-8 pt-6 sm:px-6 lg:px-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 lg:gap-8">
        <section className="glass-card-strong relative overflow-hidden rounded-[2.6rem] px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
          <div className="absolute top-0 right-0 h-72 w-72 rounded-full bg-[radial-gradient(circle,_rgba(255,122,48,0.24),_transparent_68%)]" />
          <div className="absolute bottom-[-70px] left-[-50px] h-80 w-80 rounded-full bg-[radial-gradient(circle,_rgba(23,109,105,0.18),_transparent_72%)]" />

          <div className="relative grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="max-w-3xl">
              <p className="label-mono text-[11px] text-[var(--muted)]">{siteConfig.name}</p>
              <h1 className="mt-4 max-w-4xl text-4xl leading-none font-semibold tracking-[-0.05em] text-slate-950 sm:text-5xl lg:text-6xl">
                {siteConfig.tagline}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--muted)] sm:text-lg">
                {siteConfig.description} Start in the studio or launch the flow from the Chrome
                extension when you find a page worth turning into audio.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href={siteConfig.studioHref}
                  className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-deep)]"
                >
                  Open studio
                </Link>
                <Link
                  href={siteConfig.chromeExtensionHref}
                  className="rounded-full border border-slate-900/10 bg-white/85 px-5 py-3 text-sm font-medium text-slate-900 transition hover:border-[var(--accent)]"
                >
                  Chrome extension
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap gap-2">
                {["URL in, audio out", "Review before render", "Chrome capture flow"].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-slate-900/10 bg-white/80 px-3 py-2 text-sm text-slate-900"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid gap-4">
              <article className="rounded-[2rem] border border-slate-900/10 bg-slate-950 p-5 text-white shadow-[0_24px_70px_rgba(24,39,58,0.18)]">
                <p className="label-mono text-[10px] text-white/55">Studio flow</p>
                <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_1fr]">
                  <div className="rounded-[1.4rem] border border-white/10 bg-white/6 p-4">
                    <p className="text-sm text-white/60">Current page</p>
                    <p className="mt-2 text-sm leading-7 text-white">https://example.com/pricing</p>
                    <p className="mt-4 text-sm leading-6 text-white/68">
                      Extension captures the tab and opens Sourcewave Studio with the URL ready.
                    </p>
                  </div>
                  <div className="rounded-[1.4rem] border border-white/10 bg-white/6 p-4">
                    <p className="text-sm text-white/60">Generated output</p>
                    <p className="mt-2 text-sm leading-7 text-white">
                      Direct answer, transcript, citations, and final audio in one review flow.
                    </p>
                    <div className="mt-4 flex items-end gap-1">
                      {[18, 30, 22, 38, 24, 34, 20, 40].map((height, index) => (
                        <span
                          key={`${height}-${index}`}
                          className="how-wave-bar w-2 rounded-full bg-white/80"
                          style={{ height }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </article>

              <div className="grid gap-4 sm:grid-cols-3">
                {exampleFlows.map((item) => (
                  <article
                    key={item.title}
                    className="rounded-[1.6rem] border border-slate-900/10 bg-white/82 p-4"
                  >
                    <p className="label-mono text-[10px] text-[var(--muted)]">{item.source}</p>
                    <p className="mt-2 text-sm font-semibold text-slate-950">{item.title}</p>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{item.output}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="glass-card rounded-[2.2rem] px-6 py-8 sm:px-8">
          <div className="max-w-3xl">
            <p className="label-mono text-[11px] text-[var(--muted)]">From page to podcast</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">
              A clearer workflow from source capture to final audio.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--muted)]">
              The product is designed to make capture fast without removing the review step that
              keeps audio grounded.
            </p>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {homeWorkflow.map((item, index) => (
              <article
                key={item.title}
                className="rounded-[1.8rem] border border-slate-900/10 bg-white/84 p-5"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-900/10 bg-white text-sm font-semibold text-slate-950">
                  {index + 1}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-950">{item.title}</h3>
                <p className="mt-3 max-w-sm text-sm leading-7 text-[var(--muted)]">{item.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
          <article className="glass-card rounded-[2.2rem] px-6 py-8 sm:px-8">
            <p className="label-mono text-[11px] text-[var(--muted)]">Core capabilities</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">
              Built to stay readable while still showing the important parts.
            </h2>
            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              {featureCards.map((item) => (
                <article
                  key={item.title}
                  className="rounded-[1.7rem] border border-slate-900/10 bg-white/82 p-5"
                >
                  <h3 className="text-lg font-semibold text-slate-950">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{item.copy}</p>
                </article>
              ))}
            </div>
          </article>

          <article className="glass-card rounded-[2.2rem] px-6 py-8 sm:px-8">
            <p className="label-mono text-[11px] text-[var(--muted)]">Where teams use it</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">
              Useful for product, content, and voice workflow teams.
            </h2>
            <div className="mt-7 space-y-4">
              {featuredUseCases.map((item) => (
                <article
                  key={item.title}
                  className="rounded-[1.7rem] border border-slate-900/10 bg-white/82 p-5"
                >
                  <p className="label-mono text-[10px] text-[var(--muted)]">{item.audience}</p>
                  <h3 className="mt-3 text-lg font-semibold text-slate-950">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{item.summary}</p>
                </article>
              ))}
            </div>
            <Link
              href="/use-cases"
              className="mt-6 inline-flex rounded-full border border-slate-900/10 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition hover:border-[var(--accent)]"
            >
              See more use cases
            </Link>
          </article>
        </section>

        <section className="how-slide rounded-[2.2rem] px-6 py-8 sm:px-8">
          <div className="grid gap-6 lg:grid-cols-[0.98fr_1.02fr] lg:items-center">
            <div className="max-w-2xl">
              <p className="label-mono text-[11px] text-[var(--muted)]">Chrome extension</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">
                Capture the page you are reading and send it straight into the studio.
              </h2>
              <p className="mt-4 text-base leading-7 text-[var(--muted)]">
                The extension is intentionally lightweight. It grabs the active tab, opens
                Sourcewave Studio with that URL prefilled, and keeps the full review flow on the
                web app where the grounded answer and audio generation already live.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href={siteConfig.chromeExtensionHref}
                  className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Install for Chrome
                </Link>
                <Link
                  href={siteConfig.studioHref}
                  className="rounded-full border border-slate-900/10 bg-white px-5 py-3 text-sm font-medium text-slate-900 transition hover:border-[var(--accent)]"
                >
                  Open studio directly
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {extensionBenefits.map((item) => (
                <article
                  key={item.title}
                  className="rounded-[1.7rem] border border-slate-900/10 bg-white/84 p-5"
                >
                  <h3 className="text-base font-semibold text-slate-950">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{item.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="how-slide how-slide-dark rounded-[2.2rem] px-6 py-8 text-center sm:px-8 lg:px-10 lg:py-12">
          <div className="mx-auto max-w-3xl">
            <p className="label-mono text-[11px] text-white/50">{siteConfig.name} Studio</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
              Review the answer. Then render the audio.
            </h2>
            <p className="mt-5 text-base leading-7 text-white/72 sm:text-lg">
              Whether you start in the studio or from the Chrome extension, the important step is
              the same: inspect the grounded output before you publish the voice version.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href={siteConfig.studioHref}
                className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-white/90"
              >
                Open studio
              </Link>
              <Link
                href={siteConfig.chromeExtensionHref}
                className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/35"
              >
                View extension setup
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
