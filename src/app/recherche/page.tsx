"use client";

import { useEffect, useMemo, useState } from "react";
import {
  searchCreators, CATEGORIES, nextAvailability,
  type CategoryKey,
} from "@/lib/data";
import { ProCard } from "@/components/ProCard";

function distanceKm(a: [number, number], b: [number, number]) {
  const R = 6371;
  const dLat = ((b[0] - a[0]) * Math.PI) / 180;
  const dLng = ((b[1] - a[1]) * Math.PI) / 180;
  const s = Math.sin(dLat / 2) ** 2 + Math.cos((a[0] * Math.PI) / 180) * Math.cos((b[0] * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

export default function RecherchePage() {
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("");
  const [base, setBase] = useState<CategoryKey | "all">("all");
  const [mode, setMode] = useState<"all" | "salon" | "mobile">("all");
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [minRating, setMinRating] = useState(0);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [fromMs, setFromMs] = useState(0);
  const [userPos, setUserPos] = useState<[number, number] | null>(null);
  const [geoMsg, setGeoMsg] = useState("");

  useEffect(() => {
    const d = new Date();
    setFromMs(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  }, []);

  const results = useMemo(() => {
    let r = searchCreators({ query, base, region: "all", mode, maxPrice, minRating, verifiedOnly });
    if (city.trim()) {
      const q = city.trim().toLowerCase();
      r = r.filter((c) => c.city.toLowerCase().includes(q) || (c.zones ?? []).some((z) => z.toLowerCase().includes(q)));
    }
    if (userPos) {
      r = [...r].sort((a, b) => distanceKm(userPos, [a.lat, a.lng]) - distanceKm(userPos, [b.lat, b.lng]));
    }
    return r;
  }, [query, city, base, mode, maxPrice, minRating, verifiedOnly, userPos]);

  const geolocate = () => {
    setGeoMsg("Localisation…");
    if (!navigator.geolocation) { setGeoMsg("Géolocalisation indisponible"); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => { setUserPos([pos.coords.latitude, pos.coords.longitude]); setGeoMsg("📍 Autour de vous"); },
      () => setGeoMsg("Localisation refusée"),
      { timeout: 8000 }
    );
  };

  const activeFilters = (base !== "all" ? 1 : 0) + (mode !== "all" ? 1 : 0) + (maxPrice !== null ? 1 : 0) + (minRating > 0 ? 1 : 0) + (verifiedOnly ? 1 : 0);

  return (
    <div className="min-h-[100dvh] pb-36">
      {/* Barre de recherche épurée */}
      <header className="sticky top-0 z-30 glass border-b border-white/50 px-5 pb-3 pt-[max(16px,env(safe-area-inset-top))]">
        <h1 className="mb-3 text-center font-display text-3xl font-bold text-gradient-gold">Rechercher</h1>
        <div className="flex items-center gap-2 rounded-full border border-line bg-blanc/90 px-5 py-3 shadow-float">
          <span className="text-ink-soft">🔍</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Une prestation, une créatrice…"
            className="flex-1 bg-transparent text-sm outline-none"
          />
        </div>
        {/* Filtre unique centré */}
        <div className="mt-3 flex justify-center">
          <button
            onClick={() => setShowFilters((v) => !v)}
            className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-bold shadow-float transition ${showFilters ? "bg-ink text-blanc" : "bg-gradient-to-r from-rose-baby to-champagne text-brun-profond"}`}
          >
            ⚙︎ Filtrer{activeFilters > 0 ? ` · ${activeFilters}` : ""}
          </button>
        </div>
      </header>

      {/* Panneau filtres en sections claires */}
      {showFilters && (
        <div className="animate-float-up space-y-5 border-b border-line bg-creme/40 px-5 py-5">
          {/* 1 — Où */}
          <FilterSection n={1} title="Où ?">
            <div className="flex items-center gap-2 rounded-full border border-line bg-blanc px-4 py-2.5">
              <span className="text-ink-soft">🏙️</span>
              <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Rechercher une ville…" className="flex-1 bg-transparent text-sm outline-none" />
              {city && <button onClick={() => setCity("")} className="text-ink-soft">✕</button>}
            </div>
            <button onClick={geolocate} className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-brun-profond px-4 py-2 text-[12px] font-bold text-blanc">
              📍 Autour de moi
            </button>
            {geoMsg && <span className="ml-2 text-[12px] text-ink-soft">{geoMsg}</span>}
          </FilterSection>

          {/* 2 — Lieu de la prestation */}
          <FilterSection n={2} title="À domicile ou en institut ?">
            <div className="flex flex-wrap gap-2">
              <Chip active={mode === "all"} onClick={() => setMode("all")}>Tous</Chip>
              <Chip active={mode === "salon"} onClick={() => setMode("salon")}>🏠 En institut</Chip>
              <Chip active={mode === "mobile"} onClick={() => setMode("mobile")}>🚗 À domicile</Chip>
            </div>
          </FilterSection>

          {/* 3 — Prestation & critères */}
          <FilterSection n={3} title="Prestation & critères">
            <div className="flex flex-wrap gap-2">
              <Chip active={base === "all"} onClick={() => setBase("all")}>✨ Toutes</Chip>
              {CATEGORIES.map((c) => (
                <Chip key={c.key} active={base === c.key} onClick={() => setBase(c.key)}>{c.emoji} {c.label}</Chip>
              ))}
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {[0, 4.5, 4.8].map((r) => (
                <Chip key={r} active={minRating === r} onClick={() => setMinRating(r)}>{r === 0 ? "Toutes notes" : `⭐ ${r}+`}</Chip>
              ))}
              {[null, 60, 100, 150].map((p) => (
                <Chip key={String(p)} active={maxPrice === p} onClick={() => setMaxPrice(p)}>{p === null ? "Tout prix" : `≤ ${p}.–`}</Chip>
              ))}
              <Chip active={verifiedOnly} onClick={() => setVerifiedOnly((v) => !v)}>✅ Vérifiées</Chip>
            </div>
          </FilterSection>
        </div>
      )}

      {/* Résultats */}
      <div className="px-5 pt-4">
        <p className="mb-3 text-[12px] font-semibold text-ink-soft">{results.length} créatrice{results.length > 1 ? "s" : ""}</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {results.map((c) => (
            <div key={c.id} className="overflow-hidden rounded-3xl">
              <ProCard creator={c} distanceKm={userPos ? distanceKm(userPos, [c.lat, c.lng]) : undefined} />
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

function FilterSection({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section>
      <p className="mb-2 flex items-center gap-2 text-[13px] font-bold text-ink">
        <span className="grid h-5 w-5 place-items-center rounded-full bg-brun-profond text-[10px] font-bold text-blanc">{n}</span>
        {title}
      </p>
      {children}
    </section>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={`rounded-full border px-3.5 py-2 text-xs font-semibold transition active:scale-95 ${active ? "border-transparent bg-ink text-blanc" : "border-line bg-blanc/70 text-ink-soft"}`}>
      {children}
    </button>
  );
}
