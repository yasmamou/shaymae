"use client";

import Link from "next/link";
import { useFavorites } from "@/components/FavoritesProvider";
import { CREATORS, type MediaItem, type Creator } from "@/lib/data";
import { Media } from "@/lib/Media";
import { SaveButton } from "@/components/SaveButton";
import { ProCard } from "@/components/ProCard";

const ALL_MEDIA: MediaItem[] = CREATORS.flatMap((c) => c.stories.map((s) => ({
  id: `${c.slug}-s-${s.id}`, category: s.category, seed: s.seed, label: s.caption,
})) ).concat(CREATORS.flatMap((c) => c.gallery));

function resolveMedia(rawId: string): MediaItem | undefined {
  const id = rawId.replace(/^(feed|insp)-/, "");
  return ALL_MEDIA.find((m) => m.id === id);
}
function resolveCreator(rawId: string): Creator | undefined {
  const id = rawId.replace(/^pro-/, "");
  return CREATORS.find((c) => c.id === id);
}

export default function FavorisPage() {
  const { ids } = useFavorites();

  const pros = ids
    .filter((i) => i.startsWith("pro-"))
    .map(resolveCreator)
    .filter(Boolean) as Creator[];

  const medias = ids
    .filter((i) => !i.startsWith("pro-"))
    .map((i) => ({ rawId: i, media: resolveMedia(i) }))
    .filter((x) => x.media) as { rawId: string; media: MediaItem }[];

  const empty = pros.length === 0 && medias.length === 0;

  return (
    <div className="min-h-[100dvh] pb-32">
      <header className="sticky top-0 z-30 glass border-b border-white/50 px-5 pb-3 pt-[max(14px,env(safe-area-inset-top))]">
        <h1 className="font-display text-3xl font-bold text-ink">Mes inspirations</h1>
        <p className="text-[12px] text-ink-soft">
          Votre board beauté — à envoyer à votre créatrice
        </p>
      </header>

      {empty ? (
        <div className="flex flex-col items-center px-8 pt-24 text-center">
          <span className="mb-4 text-6xl">🤍</span>
          <h2 className="font-display text-2xl font-semibold text-ink">
            Rien sauvegardé… pour l&apos;instant
          </h2>
          <p className="mt-2 max-w-xs text-sm text-ink-soft">
            Touchez le cœur sur une réalisation ou un profil pour la garder ici,
            comme un tableau Pinterest.
          </p>
          <Link
            href="/decouvrir"
            className="mt-6 rounded-full bg-gradient-to-r from-rose-deep to-or-rose px-6 py-3 text-sm font-bold text-white shadow-soft"
          >
            Explorer l&apos;inspiration ✨
          </Link>
        </div>
      ) : (
        <div className="px-5 pt-4">
          {pros.length > 0 && (
            <section className="mb-7">
              <h2 className="mb-3 font-display text-xl font-semibold text-ink">
                Créatrices gardées
              </h2>
              <div className="flex flex-col gap-3">
                {pros.map((c) => (
                  <ProCard key={c.id} creator={c} />
                ))}
              </div>
            </section>
          )}

          {medias.length > 0 && (
            <section>
              <h2 className="mb-3 font-display text-xl font-semibold text-ink">
                Réalisations gardées
              </h2>
              <div className="columns-2 gap-3">
                {medias.map(({ rawId, media }, i) => (
                  <div
                    key={rawId}
                    className="relative mb-3 break-inside-avoid overflow-hidden rounded-3xl shadow-float"
                  >
                    <Media
                      category={media.category}
                      seed={media.seed}
                      rounded=""
                      label={media.label}
                      className={i % 2 === 0 ? "h-56 w-full" : "h-44 w-full"}
                    />
                    <div className="absolute right-2.5 top-2.5">
                      <SaveButton id={rawId} size={34} light />
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() =>
                  alert(
                    "Envoyer mes inspirations ✨\n\nBientôt : partagez ce board directement à la créatrice de votre choix via WhatsApp, Instagram ou la messagerie Shaymae."
                  )
                }
                className="mt-4 w-full rounded-full bg-ink py-3.5 text-sm font-bold text-blanc shadow-soft"
              >
                💌 Envoyer mes inspirations à une créatrice
              </button>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
