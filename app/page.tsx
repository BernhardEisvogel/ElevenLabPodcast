import Link from "next/link";

import { getBlogPosts } from "@/lib/blog";
import {
  elevenLabsCapabilities,
  exampleFlows,
  featureCards,
  homeStats,
  siteConfig,
  useCases,
} from "@/lib/site";

export default function Home() {
  const featuredPosts = getBlogPosts().slice(0, 3);
  const featuredUseCases = useCases.slice(0, 4);

  return (
    <main className="px-4 pb-4 pt-6 sm:px-6 lg:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <section className="glass-card-strong wave-grid relative overflow-hidden rounded-[2.4rem] px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
          <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-[radial-gradient(circle,_rgba(255,122,48,0.3),_transparent_68%)]" />
          <div className="absolute bottom-[-40px] left-[-40px] h-72 w-72 rounded-full bg-[radial-gradient(circle,_rgba(23,109,105,0.2),_transparent_72%)]" />

          <div className="relative grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="max-w-3xl">
              <p className="label-mono text-[11px] text-[var(--muted)]">{siteConfig.name}</p>
              <h1 className="mt-4 max-w-4xl text-4xl leading-none font-semibold tracking-[-0.05em] text-slate-950 sm:text-5xl lg:text-7xl">
                {siteConfig.tagline}
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--muted)] sm:text-lg">
                {siteConfig.description} Build podcasts, explainers, voice-agent content, and
                internal briefings from source material your team can actually inspect.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href={siteConfig.studioHref}
                  className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-deep)]"
                >
                  Open studio
                </Link>
                <Link
                  href="/contact"
                  className="rounded-full border border-slate-900/10 bg-white/80 px-5 py-3 text-sm font-medium text-slate-900 transition hover:border-[var(--accent)]"
                >
                  Book a workflow review
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap gap-2">
                {["Needle retrieval", "Featherless scripting", "ElevenLabs audio"].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-slate-900/10 bg-white/75 px-3 py-2 text-sm text-[var(--muted)]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid gap-4">
              <article className="rounded-[2rem] border border-slate-900/10 bg-slate-950 p-5 text-white shadow-[0_24px_70px_rgba(24,39,58,0.18)]">
                <p className="label-mono text-[10px] text-white/50">Studio preview</p>
                <div className="mt-4 grid gap-4 sm:grid-cols-[0.9fr_1.1fr]">
                  <div className="rounded-[1.4rem] border border-white/10 bg-white/6 p-4">
                    <p className="text-sm text-white/65">Input</p>
                    <p className="mt-2 text-sm leading-7 text-white">
                      https://rahulai.com
                    </p>
                    <div className="mt-4 space-y-2">
                      <div className="h-2 rounded-full bg-white/18" />
                      <div className="h-2 w-5/6 rounded-full bg-white/12" />
                      <div className="h-2 w-3/4 rounded-full bg-white/10" />
                    </div>
                  </div>
                  <div className="rounded-[1.4rem] border border-white/10 bg-white/6 p-4">
                    <p className="text-sm text-white/65">Output</p>
                    <p className="mt-2 text-sm leading-7 text-white">
                      Grounded transcript, selected voices, final downloadable audio.
                    </p>
                    <div className="mt-4 flex items-end gap-1">
                      {[16, 28, 18, 34, 22, 30, 20, 38].map((height, index) => (
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
                {homeStats.map((item) => (
                  <article
                    key={item.title}
                    className="rounded-[1.7rem] border border-slate-900/10 bg-white/78 p-4"
                  >
                    <p className="text-sm font-semibold text-slate-950">{item.title}</p>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{item.copy}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {featureCards.map((item) => (
            <article
              key={item.title}
              className="glass-card rounded-[1.8rem] p-5 transition hover:translate-y-[-2px]"
            >
              <p className="text-lg font-semibold tracking-[-0.03em] text-slate-950">{item.title}</p>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{item.copy}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <article className="how-slide rounded-[2rem] px-6 py-8 sm:px-8">
            <p className="label-mono text-[11px] text-[var(--muted)]">What you can ship</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">
              More than a podcast generator.
            </h2>
            <div className="mt-6 space-y-3">
              {elevenLabsCapabilities.map((item) => (
                <article
                  key={item.title}
                  className="rounded-[1.5rem] border border-slate-900/10 bg-white/80 px-4 py-4"
                >
                  <p className="text-base font-semibold text-slate-950">{item.title}</p>
                  <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{item.copy}</p>
                </article>
              ))}
            </div>
          </article>

          <article className="how-slide rounded-[2rem] px-6 py-8 sm:px-8">
            <p className="label-mono text-[11px] text-[var(--muted)]">Example flows</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">
              Real outputs for real teams.
            </h2>
            <div className="mt-6 space-y-4">
              {exampleFlows.map((item) => (
                <article
                  key={item.title}
                  className="rounded-[1.6rem] border border-slate-900/10 bg-white/82 p-5"
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
          </article>
        </section>

        <section className="glass-card rounded-[2rem] px-6 py-8 sm:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="label-mono text-[11px] text-[var(--muted)]">Use cases</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">
                Built for product teams, content teams, and voice-agent builders.
              </h2>
            </div>
            <Link
              href="/use-cases"
              className="rounded-full border border-slate-900/10 bg-white/80 px-4 py-2 text-sm font-medium text-slate-900 transition hover:border-[var(--accent)]"
            >
              See all use cases
            </Link>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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
        </section>

        <section className="glass-card rounded-[2rem] px-6 py-8 sm:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="label-mono text-[11px] text-[var(--muted)]">From the blog</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">
                Practical writing on grounded audio and voice agents.
              </h2>
            </div>
            <Link
              href="/blog"
              className="rounded-full border border-slate-900/10 bg-white/80 px-4 py-2 text-sm font-medium text-slate-900 transition hover:border-[var(--accent)]"
            >
              Visit the blog
            </Link>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {featuredPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="rounded-[1.8rem] border border-slate-900/10 bg-white/82 p-5 transition hover:translate-y-[-2px]"
              >
                <div className="flex flex-wrap gap-2 text-xs text-[var(--muted)]">
                  <span className="rounded-full bg-[rgba(255,122,48,0.12)] px-3 py-1 text-slate-900">
                    {post.category}
                  </span>
                  <span className="rounded-full border border-slate-900/10 px-3 py-1">
                    {post.readingTime}
                  </span>
                </div>
                <h3 className="mt-4 text-xl font-semibold tracking-[-0.03em] text-slate-950">
                  {post.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{post.excerpt}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="how-slide how-slide-dark rounded-[2rem] px-6 py-8 text-center sm:px-8 lg:px-10 lg:py-12">
          <div className="mx-auto max-w-3xl">
            <p className="label-mono text-[11px] text-white/50">{siteConfig.name} studio</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
              Ship grounded audio faster.
            </h2>
            <p className="mt-5 text-base leading-7 text-white/72 sm:text-lg">
              Start with a URL, a topic, or a product brief. Review the retrieved context. Choose
              voices. Export the final asset.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href={siteConfig.studioHref}
                className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-white/90"
              >
                Open studio
              </Link>
              <Link
                href="/contact"
                className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/35"
              >
                Talk to Sourcewave
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
