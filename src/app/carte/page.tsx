"use client";

import dynamic from "next/dynamic";
import { useMemo, useRef, useState } from "react";
import { CREATORS, CITIES, type CategoryKey, type RegionKey } from "@/lib/data";
import { CategoryChips } from "@/components/CategoryChips";
import { ProCard } from "@/components/ProCard";
import { AccountButton } from "@/components/AccountButton";

const ProMap = dynamic(() => import("@/components/ProMap"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full w-full place-items-center bg-creme">
      <span className="animate-pulse text-sm text-ink-soft">Chargement de la carte…</span>
    </div>
  ),
});

type Mode = "all" | "salon" | "mobile";

export default function CartePage() {
  const [cat, setCat] = useState<CategoryKey | "all">("all");
  const [mode, setMode] = useState<Mode>("all");
  const [region, setRegion] = useState<RegionKey>("Montpellier");
  const [selected, setSelected] = useState<string | undefined>();
  const stripRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(
    () =>
      CREATORS.filter(
        (c) =>
          (region === "all" || c.region === region) &&
          (cat === "all" || c.categories.includes(cat)) &&
          (mode === "all" || c.mode === mode)
      ),
    [cat, mode, region]
  );

  const select = (slug: string) => {
    setSelected(slug);
    const el = document.getElementById(`strip-${slug}`);
    el?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  };

  return (
    <div className="relative h-[100dvh] overflow-hidden">
      {/* Carte plein écran */}
      <div className="absolute inset-0">
        <ProMap creators={filtered} selected={selected} onSelect={select} />
      </div>

      {/* En-tête + filtres flottants */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[1000] space-y-3 pt-[max(12px,env(safe-area-inset-top))]">
        <div className="px-5">
          <div className="pointer-events-auto glass shadow-soft flex items-center gap-2 rounded-full border border-white/60 px-4 py-2.5">
            <span className="text-lg">📍</span>
            <div className="flex-1">
              <p className="font-display text-lg font-semibold leading-none text-ink">
                Carte Shaymae
              </p>
              <p className="text-[11px] text-ink-soft">
                {filtered.length} créatrice{filtered.length > 1 ? "s" : ""}
                {region !== "all" ? ` · ${CITIES.find((c) => c.key === region)?.label}` : ""}
              </p>
            </div>
            <AccountButton />
          </div>
        </div>

        {/* Sélecteur de ville */}
        <div className="pointer-events-auto flex gap-2 px-5">
          {CITIES.map((c) => (
            <button
              key={c.key}
              onClick={() => {
                setRegion(c.key);
                setSelected(undefined);
              }}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold shadow-float transition active:scale-95 ${
                region === c.key
                  ? "border-transparent bg-gradient-to-r from-rose-deep to-or-rose text-white"
                  : "border-white/60 glass text-ink"
              }`}
            >
              📍 {c.label}
            </button>
          ))}
        </div>

        <div className="pointer-events-auto">
          <CategoryChips value={cat} onChange={setCat} />
        </div>

        <div className="pointer-events-auto flex gap-2 px-5">
          {(
            [
              { k: "all", label: "Tous", emoji: "✨" },
              { k: "salon", label: "Salon", emoji: "🏠" },
              { k: "mobile", label: "Se déplace", emoji: "🚗" },
            ] as const
          ).map((m) => (
            <button
              key={m.k}
              onClick={() => setMode(m.k)}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold shadow-float transition active:scale-95 ${
                mode === m.k
                  ? "border-transparent bg-ink text-blanc"
                  : "border-white/60 glass text-ink"
              }`}
            >
              {m.emoji} {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bandeau de cartes compactes, posé tout en bas (recouvre peu la map) */}
      <div
        ref={stripRef}
        className="no-scrollbar absolute inset-x-0 bottom-[max(96px,calc(env(safe-area-inset-bottom)+92px))] z-[1000] flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 lg:bottom-5"
      >
        {filtered.map((c) => {
          const active = selected === c.slug;
          return (
            <div
              key={c.id}
              id={`strip-${c.slug}`}
              className={`w-[84%] shrink-0 snap-center rounded-2xl transition sm:w-[70%] lg:w-[340px] ${
                active ? "ring-2 ring-or-rose" : "opacity-95"
              }`}
              onClick={() => setSelected(c.slug)}
            >
              <ProCard creator={c} compact />
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="w-full rounded-2xl glass p-4 text-center text-sm text-ink-soft shadow-float">
            Aucune créatrice pour ce filtre. Essayez une autre catégorie ✨
          </div>
        )}
      </div>
    </div>
  );
}
