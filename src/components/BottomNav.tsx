"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useFavorites } from "./FavoritesProvider";

const TABS = [
  { href: "/", label: "Feed", icon: "✦" },
  { href: "/carte", label: "Carte", icon: "◍" },
  { href: "/decouvrir", label: "Tendances", icon: "✧" },
  { href: "/favoris", label: "Inspirations", icon: "♥" },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  const { count } = useFavorites();

  return (
    <nav className="pointer-events-none fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-[480px] px-4 pb-[max(14px,env(safe-area-inset-bottom))] lg:hidden">
      <div className="pointer-events-auto glass shadow-soft flex items-center justify-around rounded-full border border-white/60 px-2 py-2">
        {TABS.map((t) => {
          const active =
            t.href === "/" ? pathname === "/" : pathname.startsWith(t.href);
          return (
            <Link
              key={t.href}
              href={t.href}
              className={`relative flex min-w-[64px] flex-col items-center gap-0.5 rounded-full px-3 py-1.5 transition ${
                active ? "text-ink" : "text-ink-soft"
              }`}
            >
              <span
                className={`grid h-9 w-9 place-items-center rounded-full text-lg transition ${
                  active
                    ? "bg-gradient-to-br from-rose to-or-rose text-ink shadow-float"
                    : ""
                }`}
              >
                {t.icon}
                {t.href === "/favoris" && count > 0 && (
                  <span className="absolute -right-0 -top-0 grid h-4 min-w-4 place-items-center rounded-full bg-rose-deep px-1 text-[9px] font-bold text-white">
                    {count}
                  </span>
                )}
              </span>
              <span className="text-[10px] font-semibold tracking-wide">
                {t.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
