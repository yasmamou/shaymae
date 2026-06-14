"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CREATORS, type Creator, type Story } from "@/lib/data";
import { Media, Avatar } from "@/lib/Media";

const withStories = CREATORS.filter((c) => c.stories.length > 0);

const KIND_LABEL: Record<Story["kind"], string> = {
  "before-after": "Avant / Après",
  promo: "Promo",
  dispo: "Disponibilités",
  realisation: "Réalisation",
};

export function StoriesBar() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <>
      <div className="no-scrollbar -mx-5 flex gap-3.5 overflow-x-auto px-5 py-1">
        {withStories.map((c, i) => (
          <button
            key={c.id}
            onClick={() => setActive(i)}
            className="flex w-16 shrink-0 flex-col items-center gap-1.5"
          >
            <span className="rounded-full bg-gradient-to-tr from-rose-deep via-or-rose to-champagne p-[2.5px]">
              <span className="block rounded-full bg-blanc p-[2px]">
                <Avatar
                  seed={c.avatarSeed}
                  category={c.categories[0]}
                  name={c.name}
                  size={56}
                />
              </span>
            </span>
            <span className="line-clamp-1 max-w-full text-[10px] font-medium text-ink-soft">
              {c.name.split(" ")[0]}
            </span>
          </button>
        ))}
      </div>

      {active !== null && (
        <StoryViewer
          creators={withStories}
          startIndex={active}
          onClose={() => setActive(null)}
        />
      )}
    </>
  );
}

function StoryViewer({
  creators,
  startIndex,
  onClose,
}: {
  creators: Creator[];
  startIndex: number;
  onClose: () => void;
}) {
  const [ci, setCi] = useState(startIndex);
  const [si, setSi] = useState(0);
  const creator = creators[ci];
  const story = creator.stories[si];

  const next = () => {
    if (si < creator.stories.length - 1) setSi(si + 1);
    else if (ci < creators.length - 1) {
      setCi(ci + 1);
      setSi(0);
    } else onClose();
  };
  const prev = () => {
    if (si > 0) setSi(si - 1);
    else if (ci > 0) {
      setCi(ci - 1);
      setSi(creators[ci - 1].stories.length - 1);
    }
  };

  useEffect(() => {
    const t = setTimeout(next, 4200);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ci, si]);

  return (
    <div className="fixed inset-0 z-50 mx-auto w-full max-w-[480px] bg-ink">
      <Media
        category={story.category}
        seed={story.seed}
        rounded=""
        glyph
        className="absolute inset-0 h-full w-full"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-transparent to-ink/60" />

      {/* barres de progression */}
      <div className="absolute inset-x-3 top-3 flex gap-1">
        {creator.stories.map((_, k) => (
          <span key={k} className="h-1 flex-1 overflow-hidden rounded-full bg-white/30">
            <span
              className={`block h-full rounded-full bg-white ${
                k < si ? "w-full" : k === si ? "w-full animate-[shimmer_4.2s_linear]" : "w-0"
              }`}
              style={k === si ? { animation: "growbar 4.2s linear forwards" } : undefined}
            />
          </span>
        ))}
      </div>

      {/* entête */}
      <div className="absolute inset-x-3 top-6 flex items-center gap-2.5">
        <Avatar seed={creator.avatarSeed} category={creator.categories[0]} name={creator.name} size={36} />
        <div className="flex-1">
          <p className="text-sm font-bold text-white drop-shadow">{creator.name}</p>
          <p className="text-[11px] text-white/80">{KIND_LABEL[story.kind]}</p>
        </div>
        <button onClick={onClose} aria-label="Fermer" className="grid h-9 w-9 place-items-center rounded-full bg-black/25 text-white">
          ✕
        </button>
      </div>

      {/* zones tactiles */}
      <button aria-label="Précédent" className="absolute left-0 top-0 h-full w-1/3" onClick={prev} />
      <button aria-label="Suivant" className="absolute right-0 top-0 h-full w-1/3" onClick={next} />

      {/* légende + CTA */}
      <div className="absolute inset-x-4 bottom-8 flex flex-col items-start gap-3">
        <p className="max-w-[80%] font-display text-2xl font-semibold leading-tight text-white drop-shadow">
          {story.caption}
        </p>
        <div className="flex items-center gap-2">
          <Link
            href={`/reserver/${creator.slug}`}
            onClick={onClose}
            className="rounded-full bg-gradient-to-r from-rose-deep to-or-rose px-5 py-2.5 text-sm font-bold text-white shadow-soft"
          >
            Réserver
          </Link>
          <Link
            href={`/pro/${creator.slug}`}
            onClick={onClose}
            className="rounded-full bg-white/95 px-4 py-2.5 text-sm font-bold text-ink shadow-soft"
          >
            Profil →
          </Link>
        </div>
      </div>

      <style>{`@keyframes growbar { from { width: 0 } to { width: 100% } }`}</style>
    </div>
  );
}
