"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "./I18nProvider";

const TABS = [
  { href: "/", key: "nav.feed", icon: "✦", match: (p: string) => p === "/" },
  { href: "/recherche", key: "nav.search", icon: "🔍", match: (p: string) => p.startsWith("/recherche") },
  { href: "/carte", key: "nav.map", icon: "◍", match: (p: string) => p.startsWith("/carte") },
  { href: "/messages", key: "nav.messages", icon: "✉", match: (p: string) => p.startsWith("/messages") },
  { href: "/compte", key: "nav.account", icon: "●", match: (p: string) => p.startsWith("/compte") },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  const { t } = useI18n();

  return (
    <nav className="pointer-events-none fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-[480px] px-4 pb-[max(14px,env(safe-area-inset-bottom))] lg:hidden">
      <div className="pointer-events-auto glass shadow-soft flex items-center justify-around rounded-full border border-white/60 px-1.5 py-2">
        {TABS.map((tab) => {
          const active = tab.match(pathname);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`relative flex min-w-[58px] flex-col items-center gap-0.5 rounded-full px-2 py-1.5 transition ${active ? "text-ink" : "text-ink-soft"}`}
            >
              <span className={`grid h-9 w-9 place-items-center rounded-full text-lg transition ${active ? "bg-gradient-to-br from-rose to-or-rose text-ink shadow-float" : ""}`}>
                {tab.icon}
              </span>
              <span className="text-[10px] font-semibold tracking-wide">{t(tab.key)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
