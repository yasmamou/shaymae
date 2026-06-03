import Link from "next/link";
import type { Creator } from "@/lib/data";
import { categoryOf } from "@/lib/data";
import { Media, Avatar } from "@/lib/Media";
import { SaveButton } from "./SaveButton";

export function ProCard({
  creator,
  distanceKm,
  compact = false,
}: {
  creator: Creator;
  distanceKm?: number;
  compact?: boolean;
}) {
  if (compact) {
    return (
      <Link
        href={`/pro/${creator.slug}`}
        className="group flex items-center gap-3 overflow-hidden rounded-2xl border border-white/60 bg-blanc/90 p-2 pr-3 shadow-float transition active:scale-[0.99]"
      >
        <div className="relative shrink-0">
          <Media
            category={creator.categories[0]}
            seed={creator.coverSeed}
            rounded="rounded-xl"
            glyph={false}
            className="h-16 w-16"
          />
          <span className="absolute -bottom-1 -right-1 grid h-5 w-5 place-items-center rounded-full bg-blanc text-[10px] shadow-float">
            {creator.mode === "mobile" ? "🚗" : "🏠"}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1 truncate text-[13px] font-bold text-ink">
            {creator.name}
            {creator.verified && <span className="text-[9px]">✅</span>}
          </p>
          <p className="truncate text-[11px] text-ink-soft">{creator.tagline}</p>
          <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-ink-soft">
            <span className="font-bold text-ink">⭐ {creator.rating}</span>
            <span>({creator.reviews})</span>
            <span>·</span>
            <span className="truncate">📍 {creator.city}</span>
            {distanceKm !== undefined && <span>· {distanceKm.toFixed(1)} km</span>}
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-ink px-3 py-1.5 text-[11px] font-bold text-blanc">
          Voir
        </span>
      </Link>
    );
  }

  return (
    <Link
      href={`/pro/${creator.slug}`}
      className="group block overflow-hidden rounded-3xl border border-white/60 bg-blanc/80 shadow-float transition active:scale-[0.99]"
    >
      <div className="relative">
        <Media
          category={creator.categories[0]}
          seed={creator.coverSeed}
          rounded=""
          glyph
          className="h-32 w-full"
        />
        <div className="absolute right-2.5 top-2.5">
          <SaveButton id={"pro-" + creator.id} size={34} light />
        </div>
        <span className="absolute left-2.5 top-2.5 rounded-full glass px-2.5 py-1 text-[10px] font-bold text-ink shadow-float">
          {creator.mode === "mobile" ? "🚗 Se déplace" : "🏠 Salon"}
        </span>
      </div>
      <div className="flex items-center gap-3 p-3">
        <Avatar seed={creator.avatarSeed} category={creator.categories[0]} name={creator.name} size={42} />
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1 truncate text-sm font-bold text-ink">
            {creator.name}
            {creator.verified && <span className="text-[10px]">✅</span>}
          </p>
          <p className="truncate text-[11px] text-ink-soft">{creator.tagline}</p>
          <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-ink-soft">
            <span className="font-bold text-ink">⭐ {creator.rating}</span>
            <span>({creator.reviews})</span>
            <span>·</span>
            <span>📍 {creator.city}</span>
            {distanceKm !== undefined && (
              <>
                <span>·</span>
                <span>{distanceKm.toFixed(1)} km</span>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5 px-3 pb-3">
        {creator.categories.map((c) => {
          const cat = categoryOf(c);
          return (
            <span key={c} className="rounded-full bg-creme px-2 py-0.5 text-[10px] font-semibold text-ink-soft">
              {cat.emoji} {cat.label}
            </span>
          );
        })}
      </div>
    </Link>
  );
}
