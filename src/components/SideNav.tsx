"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useFavorites } from "./FavoritesProvider";
import { useAuth } from "./AuthProvider";
import { Avatar } from "@/lib/Media";

const LINKS = [
  { href: "/", label: "Feed", icon: "✦" },
  { href: "/carte", label: "Carte", icon: "◍" },
  { href: "/decouvrir", label: "Tendances", icon: "✧" },
  { href: "/favoris", label: "Mes inspirations", icon: "♥" },
] as const;

export function SideNav() {
  const pathname = usePathname();
  const { count } = useFavorites();
  const { user, signOut } = useAuth();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col px-4 py-6 lg:flex">
      <Link href="/" className="px-3">
        <span className="font-display text-3xl font-bold text-gradient-gold">Shaymae</span>
        <span className="mt-1 block text-[11px] font-medium text-ink-soft">
          Beauté près de vous
        </span>
      </Link>

      <nav className="mt-8 flex flex-col gap-1">
        {LINKS.map((l) => {
          const active = isActive(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`flex items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-semibold transition ${
                active ? "bg-blanc text-ink shadow-float" : "text-ink-soft hover:bg-blanc/60"
              }`}
            >
              <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-rose to-or-rose/70 text-ink">
                {l.icon}
              </span>
              {l.label}
              {l.href === "/favoris" && count > 0 && (
                <span className="ml-auto grid h-5 min-w-5 place-items-center rounded-full bg-rose-deep px-1.5 text-[10px] font-bold text-white">
                  {count}
                </span>
              )}
            </Link>
          );
        })}

        <Link
          href="/studio"
          className={`mt-1 flex items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-semibold transition ${
            isActive("/studio") ? "bg-blanc text-ink shadow-float" : "text-ink-soft hover:bg-blanc/60"
          }`}
        >
          <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-lavande to-sauge text-ink">
            ✨
          </span>
          Espace créatrice
        </Link>
      </nav>

      <Link
        href="/carte"
        className="mt-6 rounded-full bg-gradient-to-r from-rose-deep to-or-rose py-3 text-center text-sm font-bold text-white shadow-soft"
      >
        Trouver une créatrice
      </Link>

      <div className="mt-auto">
        {user ? (
          <div className="rounded-3xl border border-line bg-blanc/70 p-3">
            <Link href="/compte" className="flex items-center gap-3">
              <Avatar seed={20} category={user.categories?.[0] ?? "maquillage"} name={user.name} size={42} />
              <span className="min-w-0">
                <span className="block truncate text-sm font-bold text-ink">{user.name}</span>
                <span className="block text-[11px] text-ink-soft">
                  {user.role === "creatrice" ? "Créatrice" : "Cliente"}
                </span>
              </span>
            </Link>
            <button
              onClick={signOut}
              className="mt-2 w-full rounded-full border border-line py-2 text-[12px] font-semibold text-ink-soft"
            >
              Déconnexion
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <Link
              href="/connexion"
              className="rounded-full glass border border-white/60 py-2.5 text-center text-sm font-bold text-ink shadow-float"
            >
              Se connecter
            </Link>
            <Link
              href="/inscription"
              className="rounded-full bg-ink py-2.5 text-center text-sm font-bold text-blanc"
            >
              Créer un compte
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}
