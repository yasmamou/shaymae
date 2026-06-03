"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { CATEGORIES, categoryOf, type CategoryKey } from "@/lib/data";
import { Media, Avatar } from "@/lib/Media";

export default function StudioPage() {
  const { user, ready, posts, addPost, removePost, signOut } = useAuth();
  const [cat, setCat] = useState<CategoryKey>("cils");
  const [label, setLabel] = useState("");
  const [caption, setCaption] = useState("");

  if (!ready) return null;

  if (!user || user.role !== "creatrice") {
    return (
      <div className="mx-auto flex min-h-[100dvh] max-w-md flex-col items-center justify-center px-8 pb-32 text-center">
        <span className="mb-4 text-6xl">✨</span>
        <h1 className="font-display text-3xl font-semibold text-ink">Espace créatrice</h1>
        <p className="mt-2 max-w-xs text-sm text-ink-soft">
          Connectez-vous en tant que créatrice pour publier vos réalisations,
          gérer vos prestations et recevoir des réservations.
        </p>
        <div className="mt-6 flex w-full max-w-xs flex-col gap-2.5">
          <Link href="/inscription" className="rounded-full bg-gradient-to-r from-rose-deep to-or-rose py-3.5 text-sm font-bold text-white shadow-soft">
            Devenir créatrice Shaymae
          </Link>
          <Link href="/connexion" className="rounded-full glass border border-white/60 py-3.5 text-sm font-bold text-ink shadow-float">
            J&apos;ai déjà un compte
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-[100dvh] max-w-3xl px-5 pb-32 pt-[max(16px,env(safe-area-inset-top))]">
      {/* En-tête studio */}
      <div className="rounded-[2rem] border border-white/60 bg-blanc/85 p-5 shadow-soft">
        <div className="flex items-center gap-4">
          <Avatar seed={20} category={user.categories?.[0] ?? "maquillage"} name={user.name} size={64} ring />
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-or-rose">Espace créatrice</p>
            <h1 className="truncate font-display text-2xl font-bold text-ink">{user.name}</h1>
            <p className="truncate text-[12px] text-ink-soft">
              {user.handle} · 📍 {user.city} · {user.mode === "mobile" ? "🚗 Se déplace" : "🏠 Salon"}
            </p>
          </div>
          <button onClick={signOut} className="rounded-full border border-line px-3 py-1.5 text-[11px] font-semibold text-ink-soft">
            Déconnexion
          </button>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          {[
            { n: posts.length, l: "Publications" },
            { n: "—", l: "Réservations" },
            { n: "5.0", l: "Note" },
          ].map((s) => (
            <div key={s.l} className="rounded-2xl bg-creme/50 py-3">
              <p className="font-display text-xl font-bold text-ink">{s.n}</p>
              <p className="text-[11px] text-ink-soft">{s.l}</p>
            </div>
          ))}
        </div>
        {(!user.categories || user.categories.length === 0) && (
          <p className="mt-3 rounded-2xl bg-rose/40 px-3 py-2 text-[12px] text-ink">
            💡 Complétez votre profil pour apparaître sur la carte.
          </p>
        )}
      </div>

      {/* Publier une réalisation */}
      <section className="mt-6 rounded-[2rem] border border-white/60 bg-blanc/85 p-5 shadow-soft">
        <h2 className="font-display text-xl font-semibold text-ink">Publier une réalisation</h2>
        <p className="text-[12px] text-ink-soft">Partagez vos plus belles prestations dans le feed.</p>

        <div className="mt-4">
          <span className="mb-1.5 block text-[12px] font-semibold text-ink">Catégorie</span>
          <div className="no-scrollbar flex gap-2 overflow-x-auto">
            {CATEGORIES.map((c) => (
              <button
                key={c.key}
                onClick={() => setCat(c.key)}
                className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                  cat === c.key ? "border-transparent bg-ink text-blanc" : "border-line bg-blanc/60 text-ink-soft"
                }`}
              >
                {c.emoji} {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* aperçu */}
        <div className="mt-4 overflow-hidden rounded-3xl shadow-float">
          <Media category={cat} seed={(label.length * 13 + caption.length) % 360} className="h-48 w-full" label={label || "Aperçu"} glyph={false} />
        </div>

        <div className="mt-4 space-y-3">
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Titre (ex. Volume russe glamour)"
            className="w-full rounded-2xl border border-line bg-creme/50 px-4 py-3 text-sm outline-none focus:border-or-rose focus:bg-blanc"
          />
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Légende…"
            rows={2}
            className="w-full resize-none rounded-2xl border border-line bg-creme/50 px-4 py-3 text-sm outline-none focus:border-or-rose focus:bg-blanc"
          />
          <button
            onClick={() => {
              if (!label.trim()) return;
              addPost({ category: cat, label: label.trim(), caption: caption.trim(), seed: (label.length * 13 + caption.length + Date.parse("2020") % 7) % 360 });
              setLabel("");
              setCaption("");
            }}
            className="w-full rounded-full bg-gradient-to-r from-rose-deep to-or-rose py-3.5 text-sm font-bold text-white shadow-soft disabled:opacity-50"
            disabled={!label.trim()}
          >
            Publier ✨
          </button>
        </div>
      </section>

      {/* Mes publications */}
      <section className="mt-6">
        <h2 className="mb-3 font-display text-xl font-semibold text-ink">Mes publications</h2>
        {posts.length === 0 ? (
          <p className="rounded-3xl border border-dashed border-line bg-blanc/50 p-8 text-center text-sm text-ink-soft">
            Aucune publication pour l&apos;instant. Publiez votre première réalisation ci-dessus ✨
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {posts.map((p) => (
              <div key={p.id} className="group relative overflow-hidden rounded-3xl shadow-float">
                <Media category={p.category} seed={p.seed} className="h-44 w-full" glyph={false} />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
                <div className="absolute inset-x-2.5 bottom-2.5">
                  <p className="text-[11px] font-medium text-white/80">{categoryOf(p.category).emoji} {categoryOf(p.category).label}</p>
                  <p className="line-clamp-1 text-sm font-bold text-white">{p.label}</p>
                </div>
                <button
                  onClick={() => removePost(p.id)}
                  className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-blanc/90 text-xs shadow-float"
                  aria-label="Supprimer"
                >
                  🗑
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
