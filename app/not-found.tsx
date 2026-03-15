import Link from "next/link";

export default function NotFound() {
  return (
    <main className="px-4 pb-4 pt-10 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <section className="how-slide how-slide-dark rounded-[2.2rem] px-6 py-12 text-center sm:px-8 lg:px-12 lg:py-16">
          <p className="label-mono text-[11px] text-white/50">404</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-[-0.05em] text-white sm:text-7xl">
            This page drifted off the timeline.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/72 sm:text-lg">
            The route you tried does not exist, or it was moved while the site was being rebuilt.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950"
            >
              Go home
            </Link>
            <Link
              href="/studio"
              className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white"
            >
              Open studio
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
