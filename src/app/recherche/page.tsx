"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  searchCreators, PRESTATIONS, CITIES, nextAvailability,
  type CategoryKey, type RegionKey,
} from "@/lib/data";
import { ProCard } from "@/components/ProCard";
import { CategoryChips } from "@/components/CategoryChips";
import { AccountButton } from "@/components/AccountButton";

export default function RecherchePage() {
  const [query, setQuery] = useState("");
  const [base, setBase] = useState<CategoryKey | "all">("all");
  const [region, setRegion] = useState<RegionKey>("Montpellier");
  const [mode, setMode] = useState<"all" | "salon" | "mobile">("all");
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [minRating, setMinRating] = useState(0);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [fromMs, setFromMs] = useState(0);

  useEffect(() => {
    const d = new Date();
    setFromMs(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  }, []);

  const results = useMemo(
    () => searchCreators({ query, base, region, mode, maxPrice, minRating, verifiedOnly }),
    [query, base, region, mode, maxPrice, minRating, verifiedOnly]
  );

  return (
    <div className="min-h-[100dvh] pb-32">
      {/* Barre de recherche */}
      <header className="sticky top-0 z-30 glass border-b border-white/50 px-5 pb-3 pt-[max(14px,env(safe-area-inset-top))]">
        <div className="mb-2 flex items-center justify-between gap-3">
          <h1 className="font-display text-2xl font-bold text-ink">Recherche</h1>
          <span className="lg:hidden"><AccountButton /></span>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-line bg-blanc/80 px-4 py-2.5">
          <span className="text-ink-soft">🔍</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Prestation, technique, ville…"
            className="flex-1 bg-transparent text-sm outline-none"
          />
          <button onClick={() => setShowFilters((v) => !v)} className={`rounded-full px-2.5 py-1 text-xs font-bold ${showFilters ? "bg-ink text-blanc" : "text-ink-soft"}`}>
            Filtres
          </button>
        </div>

        {/* Suggestions de prestations */}
        <div className="no-scrollbar -mx-5 mt-2.5 flex gap-2 overflow-x-auto px-5">
          {PRESTATIONS.slice(0, 10).map((p) => (
            <button
              key={p.key}
              onClick={() => { setQuery(p.label); setBase(p.base); }}
              className="shrink-0 whitespace-nowrap rounded-full border border-line bg-blanc/60 px-3 py-1.5 text-xs font-semibold text-ink-soft"
            >
              {p.emoji} {p.label}
            </button>
          ))}
        </div>
      </header>

      {/* Panneau filtres (replié par défaut → épuré) */}
      {showFilters && (
        <div className="animate-float-up space-y-3 border-b border-line bg-creme/40 px-5 py-4">
          <CategoryChips value={base} onChange={setBase} />
          <div className="flex flex-wrap gap-2">
            {CITIES.map((c) => (
              <Chip key={c.key} active={region === c.key} onClick={() => setRegion(c.key)}>📍 {c.label}</Chip>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <Chip active={mode === "all"} onClick={() => setMode("all")}>Tous</Chip>
            <Chip active={mode === "salon"} onClick={() => setMode("salon")}>🏠 Salon</Chip>
            <Chip active={mode === "mobile"} onClick={() => setMode("mobile")}>🚗 Se déplace</Chip>
            <Chip active={verifiedOnly} onClick={() => setVerifiedOnly((v) => !v)}>✅ Vérifiées</Chip>
          </div>
          <div className="flex flex-wrap gap-2">
            {[0, 4.5, 4.8].map((r) => (
              <Chip key={r} active={minRating === r} onClick={() => setMinRating(r)}>{r === 0 ? "Toutes notes" : `⭐ ${r}+`}</Chip>
            ))}
            {[null, 60, 100, 150].map((p) => (
              <Chip key={String(p)} active={maxPrice === p} onClick={() => setMaxPrice(p)}>
                {p === null ? "Tout prix" : `≤ ${p}.–`}
              </Chip>
            ))}
          </div>
        </div>
      )}

      {/* Résultats */}
      <div className="px-5 pt-4">
        <p className="mb-3 text-[12px] font-semibold text-ink-soft">
          {results.length} résultat{results.length > 1 ? "s" : ""}
          {region !== "all" ? ` · ${CITIES.find((c) => c.key === region)?.label}` : ""}
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {results.map((c) => (
            <div key={c.id} className="overflow-hidden rounded-3xl">
              <ProCard creator={c} />
              {fromMs > 0 && (
                <div className="-mt-2 rounded-b-2xl bg-sauge/30 px-3 py-1.5 text-[11px] font-semibold text-ink">
                  ⏱ Prochaine dispo : {nextAvailability(c, fromMs)}
                </div>
              )}
            </div>
          ))}
        </div>
        {results.length === 0 && (
          <p className="rounded-3xl border border-dashed border-line bg-blanc/50 p-8 text-center text-sm text-ink-soft">
            Aucun résultat. Élargissez vos filtres ✨
          </p>
        )}
      </div>
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${active ? "border-transparent bg-ink text-blanc" : "border-line bg-blanc/60 text-ink-soft"}`}>
      {children}
    </button>
  );
}
