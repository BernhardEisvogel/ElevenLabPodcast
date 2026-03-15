import type { Metadata } from "next";
import Link from "next/link";

import { getBlogPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description: "Articles from Sourcewave on grounded audio, voice agents, retrieval, and AI content workflows.",
};

export default function BlogIndexPage() {
  const posts = getBlogPosts();

  return (
    <main className="px-4 pb-4 pt-6 sm:px-6 lg:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <section className="how-slide how-slide-hero rounded-[2rem] px-6 py-8 sm:px-8 lg:px-10 lg:py-12">
          <p className="label-mono text-[11px] text-[var(--muted)]">Blog</p>
          <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-6xl">
            Writing about grounded audio, voice agents, and the systems behind them.
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-[var(--muted)] sm:text-lg">
            Practical notes from building Sourcewave and shipping voice workflows that need more
            than just a good synthetic voice.
          </p>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="glass-card rounded-[1.8rem] p-6 transition hover:translate-y-[-2px]"
            >
              <div className="flex flex-wrap gap-2 text-xs text-[var(--muted)]">
                <span className="rounded-full bg-[rgba(255,122,48,0.12)] px-3 py-1 text-slate-900">
                  {post.category}
                </span>
                <span className="rounded-full border border-slate-900/10 px-3 py-1">
                  {post.readingTime}
                </span>
                <span className="rounded-full border border-slate-900/10 px-3 py-1">
                  {post.date}
                </span>
              </div>
              <h2 className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-slate-950">
                {post.title}
              </h2>
              <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{post.excerpt}</p>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
