import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getBlogPost, getBlogPosts } from "@/lib/blog";

export function generateStaticParams() {
  return getBlogPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="px-4 pb-4 pt-6 sm:px-6 lg:px-10">
      <article className="mx-auto flex max-w-4xl flex-col gap-6">
        <section className="how-slide how-slide-hero rounded-[2rem] px-6 py-8 sm:px-8 lg:px-10 lg:py-12">
          <div className="flex flex-wrap gap-2 text-xs text-[var(--muted)]">
            <span className="rounded-full bg-[rgba(255,122,48,0.12)] px-3 py-1 text-slate-900">
              {post.category}
            </span>
            <span className="rounded-full border border-slate-900/10 px-3 py-1">{post.date}</span>
            <span className="rounded-full border border-slate-900/10 px-3 py-1">
              {post.readingTime}
            </span>
          </div>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-6xl">
            {post.title}
          </h1>
          <p className="mt-5 text-base leading-8 text-[var(--muted)] sm:text-lg">{post.summary}</p>
        </section>

        <section className="glass-card rounded-[2rem] p-6 sm:p-8">
          <div className="space-y-10">
            {post.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-2xl font-semibold tracking-[-0.03em] text-slate-950">
                  {section.heading}
                </h2>
                <div className="mt-4 space-y-4 text-sm leading-8 text-[var(--muted)] sm:text-base">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
                {section.bullets?.length ? (
                  <div className="mt-5 space-y-3">
                    {section.bullets.map((bullet) => (
                      <div
                        key={bullet}
                        className="rounded-[1.3rem] border border-slate-900/10 bg-white/82 px-4 py-4 text-sm leading-7 text-slate-900"
                      >
                        {bullet}
                      </div>
                    ))}
                  </div>
                ) : null}
              </section>
            ))}
          </div>
        </section>
      </article>
    </main>
  );
}
