import Link from "next/link";

import { siteConfig } from "@/lib/site";

export function SiteLogo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="inline-flex items-center gap-3">
      <span className="relative inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl border border-slate-900/10 bg-white/75 shadow-[0_10px_24px_rgba(24,39,58,0.08)]">
        <span className="absolute inset-x-0 top-0 h-4 bg-[linear-gradient(90deg,rgba(255,122,48,0.95),rgba(23,109,105,0.95))]" />
        <span className="relative mt-1 text-base font-semibold tracking-[-0.06em] text-slate-950">
          SW
        </span>
      </span>
      <span className="flex flex-col">
        <span className="text-lg leading-none font-semibold tracking-[-0.05em] text-slate-950">
          {siteConfig.name}
        </span>
        <span className="label-mono mt-1 text-[9px] text-[var(--muted)]">grounded voice</span>
      </span>
    </Link>
  );
}
