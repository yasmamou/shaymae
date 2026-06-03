"use client";

import { useState } from "react";
import Link from "next/link";
import { getCreator, type FeedItem } from "@/lib/data";
import { Media, Avatar } from "@/lib/Media";
import { BeforeAfterSlider } from "./BeforeAfterSlider";
import { SaveButton } from "./SaveButton";
import { useFavorites } from "./FavoritesProvider";

export function FeedCard({ item }: { item: FeedItem }) {
  const creator = getCreator(item.creatorSlug)!;
  const { has, toggle } = useFavorites();
  const [burst, setBurst] = useState(false);
  const liked = has(item.media.id);

  const onDoubleTap = () => {
    if (!liked) toggle(item.media.id);
    setBurst(true);
    setTimeout(() => setBurst(false), 600);
  };

  return (
    <section className="snap-item relative h-[86dvh] w-full px-4 pt-4">
      <div className="relative h-full w-full overflow-hidden rounded-[2rem] shadow-soft" onDoubleClick={onDoubleTap}>
        {item.media.beforeAfter ? (
          <BeforeAfterSlider
            category={item.media.category}
            seed={item.media.seed}
            className="h-full w-full"
          />
        ) : (
          <Media
            category={item.media.category}
            seed={item.media.seed}
            rounded=""
            glyph
            className="h-full w-full"
          />
        )}

        {/* voile bas pour lisibilité */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-ink/65 to-transparent" />

        {burst && (
          <span className="pointer-events-none absolute inset-0 grid animate-pop place-items-center text-7xl">
            ❤️
          </span>
        )}

        {/* actions latérales façon TikTok */}
        <div className="absolute bottom-28 right-3 flex flex-col items-center gap-4">
          <button
            onClick={() => toggle(item.media.id)}
            className="flex flex-col items-center gap-1"
            aria-label="J'aime"
          >
            <span className="grid h-12 w-12 place-items-center rounded-full glass shadow-float text-2xl">
              {liked ? "❤️" : "🤍"}
            </span>
            <span className="text-[11px] font-semibold text-white drop-shadow">
              {(item.likes + (liked ? 1 : 0)).toLocaleString("fr-CH")}
            </span>
          </button>
          <Link href={`/pro/${creator.slug}`} className="flex flex-col items-center gap-1" aria-label="Profil">
            <span className="grid h-12 w-12 place-items-center rounded-full glass shadow-float text-2xl">◍</span>
            <span className="text-[11px] font-semibold text-white drop-shadow">Profil</span>
          </Link>
          <div className="flex flex-col items-center gap-1">
            <SaveButton id={"feed-" + item.media.id} size={48} light />
            <span className="text-[11px] font-semibold text-white drop-shadow">Garder</span>
          </div>
        </div>

        {/* infos créatrice + légende */}
        <div className="absolute inset-x-4 bottom-6 max-w-[78%]">
          <Link href={`/pro/${creator.slug}`} className="mb-2 flex items-center gap-2.5">
            <Avatar seed={creator.avatarSeed} category={creator.categories[0]} name={creator.name} size={40} ring />
            <span>
              <span className="flex items-center gap-1 text-sm font-bold text-white drop-shadow">
                {creator.name}
                {creator.verified && <span className="text-[11px]">✅</span>}
              </span>
              <span className="block text-[11px] text-white/85">
                {creator.mode === "mobile" ? "Se déplace · " : ""}
                {creator.city} · ⭐ {creator.rating}
              </span>
            </span>
          </Link>
          <p className="text-sm leading-snug text-white/95 drop-shadow">{item.caption}</p>
        </div>
      </div>
    </section>
  );
}
