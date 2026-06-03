"use client";

import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { useFavorites } from "@/components/FavoritesProvider";
import { Avatar } from "@/lib/Media";

export default function ComptePage() {
  const { user, ready, signOut } = useAuth();
  const { count } = useFavorites();
  if (!ready) return null;

  if (!user) {
    return (
      <div className="mx-auto flex min-h-[100dvh] max-w-md flex-col items-center justify-center px-8 pb-32 text-center">
        <span className="mb-4 text-6xl">💗</span>
        <h1 className="font-display text-3xl font-semibold text-ink">Votre compte Shaymae</h1>
        <p className="mt-2 max-w-xs text-sm text-ink-soft">
          Connectez-vous pour sauvegarder vos inspirations, suivre vos créatrices
          et réserver en un clic.
        </p>
        <div className="mt-6 flex w-full max-w-xs flex-col gap-2.5">
          <Link href="/connexion" className="rounded-full bg-gradient-to-r from-rose-deep to-or-rose py-3.5 text-sm font-bold text-white shadow-soft">
            Se connecter
          </Link>
          <Link href="/inscription" className="rounded-full glass border border-white/60 py-3.5 text-sm font-bold text-ink shadow-float">
            Créer un compte
          </Link>
        </div>
        <p className="mt-6 text-[12px] text-ink-soft">
          Vous pouvez aussi continuer à explorer{" "}
          <Link href="/" className="font-semibold text-ink underline">sans compte</Link>.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-[100dvh] max-w-md px-5 pb-32 pt-[max(18px,env(safe-area-inset-top))]">
      <div className="rounded-[2rem] border border-white/60 bg-blanc/85 p-6 text-center shadow-soft">
        <div className="mx-auto w-fit">
          <Avatar seed={20} category={user.categories?.[0] ?? "maquillage"} name={user.name} size={84} ring />
        </div>
        <h1 className="mt-3 font-display text-2xl font-bold text-ink">{user.name}</h1>
        <p className="text-[13px] text-ink-soft">
          {user.email} · {user.role === "creatrice" ? "✨ Créatrice" : "💗 Cliente"}
          {user.city ? ` · 📍 ${user.city}` : ""}
        </p>
      </div>

      <div className="mt-5 flex flex-col gap-2.5">
        <Row href="/favoris" emoji="♥" label="Mes inspirations" hint={`${count} sauvegardée${count > 1 ? "s" : ""}`} />
        {user.role === "creatrice" ? (
          <Row href="/studio" emoji="✨" label="Mon espace créatrice" hint="Publier du contenu" />
        ) : (
          <Row href="/inscription" emoji="🌸" label="Devenir créatrice" hint="Publier & être réservée" />
        )}
        <Row href="/carte" emoji="◍" label="Explorer la carte" hint="Créatrices près de vous" />
      </div>

      <button
        onClick={signOut}
        className="mt-5 w-full rounded-full border border-line bg-blanc/70 py-3.5 text-sm font-bold text-ink-soft"
      >
        Se déconnecter
      </button>
    </div>
  );
}

function Row({ href, emoji, label, hint }: { href: string; emoji: string; label: string; hint: string }) {
  return (
    <Link href={href} className="flex items-center gap-3.5 rounded-2xl border border-line bg-blanc/70 px-4 py-3.5 transition active:scale-[0.99]">
      <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-rose to-or-rose/70 text-lg">{emoji}</span>
      <span className="flex-1">
        <span className="block text-sm font-bold text-ink">{label}</span>
        <span className="block text-xs text-ink-soft">{hint}</span>
      </span>
      <span className="text-ink-soft">→</span>
    </Link>
  );
}
