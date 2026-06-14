"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { FORMATIONS, CATEGORIES, type CategoryKey } from "@/lib/data";
import { Media } from "@/lib/Media";
import { AccountButton } from "@/components/AccountButton";

export default function FormationsPage() {
  const [base, setBase] = useState<CategoryKey | "all">("all");
  const [query, setQuery] = useState("");

  const list = useMemo(
    () =>
      FORMATIONS.filter(
        (f) =>
          (base === "all" || f.base === base) &&
          (!query || (f.title + f.trainer + f.city).toLowerCase().includes(query.toLowerCase()))
      ),
    [base, query]
  );

  return (
    <div className="min-h-[100dvh] pb-32">
      <header className="sticky top-0 z-30 glass border-b border-white/50 px-5 pb-3 pt-[max(14px,env(safe-area-inset-top))]">
        <div className="mb-2 flex items-start justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl font-bold text-ink">Formations</h1>
            <p className="text-[12px] text-ink-soft">Montez en compétences avec des formatrices vérifiées</p>
          </div>
          <span className="lg:hidden"><AccountButton /></span>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-line bg-blanc/80 px-4 py-2.5">
          <span className="text-ink-soft">🔍</span>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Technique, formatrice, ville…" className="flex-1 bg-transparent text-sm outline-none" />
        </div>
        <div className="no-scrollbar -mx-5 mt-2.5 flex gap-2 overflow-x-auto px-5">
          <Chip active={base === "all"} onClick={() => setBase("all")}>✨ Toutes</Chip>
          {CATEGORIES.map((c) => (
            <Chip key={c.key} active={base === c.key} onClick={() => setBase(c.key)}>{c.emoji} {c.label}</Chip>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 gap-3 px-5 pt-4 sm:grid-cols-2">
        {list.map((f) => (
          <Link key={f.id} href={`/formations/${f.slug}`} className="overflow-hidden rounded-3xl border border-white/60 bg-blanc/80 shadow-float transition active:scale-[0.99]">
            <div className="relative">
              <Media category={f.base} seed={f.seed} rounded="" glyph={false} className="h-36 w-full" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/55 to-transparent" />
              <span className="absolute left-2.5 top-2.5 rounded-full glass px-2.5 py-1 text-[10px] font-bold text-ink shadow-float">🎓 {f.level}</span>
              {f.certified && <span className="absolute right-2.5 top-2.5 rounded-full bg-sauge/90 px-2 py-1 text-[10px] font-bold text-ink">Certifiante</span>}
              <div className="absolute inset-x-3 bottom-2.5">
                <p className="font-display text-lg font-semibold leading-tight text-white">{f.title}</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3">
              <div className="min-w-0">
                <p className="truncate text-[13px] font-bold text-ink">{f.trainer} ✅</p>
                <p className="text-[11px] text-ink-soft">📍 {f.city} · {f.durationDays}j · ⭐ {f.rating} ({f.reviews})</p>
              </div>
              <p className="font-display text-lg font-semibold text-ink">{f.price}.–</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={`shrink-0 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-sm font-semibold transition ${active ? "border-transparent bg-ink text-blanc" : "border-line bg-blanc/60 text-ink-soft"}`}>
      {children}
    </button>
  );
}
