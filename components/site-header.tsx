"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { siteConfig } from "@/lib/site";
import { SiteLogo } from "@/components/site-logo";

function isActive(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 px-4 pt-4 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="glass-card-strong flex items-center justify-between rounded-[1.8rem] px-4 py-3 sm:px-5">
          <SiteLogo />

          <nav className="hidden items-center gap-1 lg:flex">
            {siteConfig.navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  isActive(pathname, item.href)
                    ? "bg-slate-950 text-white"
                    : "text-slate-700 hover:bg-white/70"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Link
              href={siteConfig.studioHref}
              className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--accent-deep)]"
            >
              Open studio
            </Link>
          </div>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-900/10 bg-white/80 text-sm text-slate-900 lg:hidden"
            aria-label="Toggle menu"
            onClick={() => setIsOpen((current) => !current)}
          >
            {isOpen ? "X" : "Menu"}
          </button>
        </div>

        {isOpen ? (
          <div className="glass-card mt-3 rounded-[1.8rem] p-4 lg:hidden">
            <nav className="flex flex-col gap-2">
              {siteConfig.navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-2xl px-4 py-3 text-sm transition ${
                    isActive(pathname, item.href)
                      ? "bg-slate-950 text-white"
                      : "bg-white/75 text-slate-900"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href={siteConfig.studioHref}
                className="rounded-2xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-white"
                onClick={() => setIsOpen(false)}
              >
                Open studio
              </Link>
            </nav>
          </div>
        ) : null}
      </div>
    </header>
  );
}
