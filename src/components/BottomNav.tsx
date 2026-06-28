"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "./I18nProvider";

const LEFT = [
  { href: "/", key: "nav.feed", icon: "✦", match: (p: string) => p === "/" },
  { href: "/recherche", key: "nav.search", icon: "🔍", match: (p: string) => p.startsWith("/recherche") },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  const { t } = useI18n();

  const Tab = ({ href, icon, label, active }: { href: string; icon: string; label: string; active: boolean }) => (
    <Link href={href} className={`flex min-w-[58px] flex-col items-center gap-0.5 py-1 transition ${active ? "text-ink" : "text-ink-soft"}`}>
      <span className={`grid h-10 w-10 place-items-center rounded-full text-xl transition ${active ? "bg-gradient-to-br from-rose-baby to-champagne text-brun-profond shadow-float" : ""}`}>
        {icon}
      </span>
      <span className="text-[10px] font-semibold tracking-wide">{label}</span>
    </Link>
  );

  return (
    <nav className="pointer-events-none fixed inset-x-0 bottom-0 z-[1500] mx-auto w-full max-w-[480px] px-4 pb-[max(12px,env(safe-area-inset-bottom))] lg:hidden">
      <div className="pointer-events-auto glass shadow-soft relative flex items-end justify-between rounded-[2rem] border border-white/60 px-3 py-2">
        {LEFT.map((tb) => <Tab key={tb.href} href={tb.href} icon={tb.icon} label={t(tb.key)} active={tb.match(pathname)} />)}

        {/* Caméra dorée centrale (Stories) */}
        <Link href="/camera" className="flex flex-col items-center" aria-label="Caméra & Stories">
          <span
            className="-mt-7 grid h-16 w-16 place-items-center rounded-full text-2xl text-brun-profond shadow-soft ring-4 ring-blanc"
            style={{ background: "linear-gradient(135deg, #e6c98f, #c9a227)" }}
          >
            📷
          </span>
          <span className="mt-0.5 text-[10px] font-bold text-ink">Story</span>
        </Link>

        <Tab href="/messages" icon="✉" label={t("nav.messages")} active={pathname.startsWith("/messages")} />
        <Tab href="/compte" icon="♡" label={t("nav.account")} active={pathname.startsWith("/compte") || pathname.startsWith("/favoris")} />
      </div>
    </nav>
  );
}
