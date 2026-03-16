import Link from "next/link";

import { SiteLogo } from "@/components/site-logo";
import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="px-4 pb-8 pt-10 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="glass-card rounded-[2rem] p-6 sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="max-w-xl">
              <SiteLogo />
              <p className="mt-5 text-sm leading-7 text-[var(--muted)] sm:text-base">
                {siteConfig.description}
              </p>
              <p className="mt-4 max-w-lg text-sm leading-7 text-slate-900">
                Capture a page, review the grounded answer, then render the final audio when it is
                ready.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={siteConfig.studioHref}
                  className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
                >
                  Open studio
                </Link>
                <Link
                  href={siteConfig.chromeExtensionHref}
                  className="rounded-full border border-slate-900/10 bg-white/80 px-4 py-2 text-sm font-medium text-slate-900"
                >
                  Chrome extension
                </Link>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {siteConfig.footerGroups.map((group) => (
                <div key={group.title}>
                  <p className="label-mono text-[10px] text-[var(--muted)]">{group.title}</p>
                  <div className="mt-4 flex flex-col gap-3">
                    {group.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="text-sm text-slate-900 transition hover:text-[var(--accent-deep)]"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 border-t border-slate-900/10 pt-4 text-sm text-[var(--muted)]">
            {new Date().getFullYear()} {siteConfig.legalName}. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
