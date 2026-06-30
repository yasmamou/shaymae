"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "./I18nProvider";

export function BottomNav() {
  const pathname = usePathname();
  const { t } = useI18n();

  const TABS = [
    { href: "/", label: t("nav.feed"), icon: "✦", match: (p: string) => p === "/" },
    { href: "/recherche", label: t("nav.search"), icon: "🔍", match: (p: string) => p.startsWith("/recherche") },
    { href: "/carte", label: t("nav.map"), icon: "◍", match: (p: string) => p.startsWith("/carte") },
    { href: "/camera", label: "Story", icon: "📷", match: (p: string) => p.startsWith("/camera"), gold: true },
    { href: "/messages", label: t("nav.messages"), icon: "✉", match: (p: string) => p.startsWith("/messages") },
    { href: "/compte", label: t("nav.account"), icon: "♡", match: (p: string) => p.startsWith("/compte") || p.startsWith("/favoris") },
  ] as const;

  return (
    <nav className="pointer-events-none fixed inset-x-0 bottom-0 z-[1500] mx-auto w-full max-w-[480px] px-3 pb-[max(12px,env(safe-area-inset-bottom))] lg:hidden">
      <div className="pointer-events-auto glass shadow-soft flex items-center justify-between rounded-[2rem] border border-white/60 px-1.5 py-2">
        {TABS.map((tb) => {
          const active = tb.match(pathname);
          const gold = "gold" in tb && tb.gold;
          return (
            <Link key={tb.href} href={tb.href} className={`flex min-w-0 flex-1 flex-col items-center gap-0.5 py-0.5 ${active ? "text-ink" : "text-ink-soft"}`}>
              <span
                className={`grid h-9 w-9 place-items-center rounded-full text-lg transition ${
                  gold ? "text-brun-profond shadow-float ring-2 ring-blanc" : active ? "bg-gradient-to-br from-rose-baby to-champagne text-brun-profond shadow-float" : ""
                }`}
                style={gold ? { background: "linear-gradient(135deg, #e6c98f, #c9a227)" } : undefined}
              >
                {tb.icon}
              </span>
              <span className="text-[9px] font-semibold tracking-tight">{tb.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
