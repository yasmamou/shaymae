"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  TRENDS,
  INSPIRATIONS,
  categoryOf,
  type CategoryKey,
} from "@/lib/data";
import { Media } from "@/lib/Media";
import { CategoryChips } from "@/components/CategoryChips";
import { SaveButton } from "@/components/SaveButton";
import { AccountButton } from "@/components/AccountButton";

export default function DecouvrirPage() {
  const [cat, setCat] = useState<CategoryKey | "all">("all");

  const inspirations = useMemo(
    () =>
      INSPIRATIONS.filter((m) => cat === "all" || m.category === cat),
    [cat]
  );

  return (
    <div className="min-h-[100dvh] pb-32">
      <header className="sticky top-0 z-30 glass border-b border-white/50 px-5 pb-3 pt-[max(14px,env(safe-area-inset-top))]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl font-bold text-ink">Tendances</h1>
            <p className="text-[12px] text-ink-soft">
              Les prestations les plus populaires près de chez vous
            </p>
          </div>
          <span className="lg:hidden">
            <AccountButton />
          </span>
        </div>
      </header>

      {/* Tendances */}
      <section className="px-5 pt-4">
        <div className="no-scrollbar -mx-5 flex gap-3 overflow-x-auto px-5">
          {TRENDS.map((t) => {
            const cat = categoryOf(t.category);
            return (
              <div
                key={t.rank}
                className="relative w-40 shrink-0 overflow-hidden rounded-3xl shadow-float"
              >
                <Media category={t.category} seed={t.seed} rounded="" className="h-52 w-full" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
                <span className="absolute left-2.5 top-2.5 grid h-7 w-7 place-items-center rounded-full bg-blanc text-xs font-bold text-ink shadow-float">
                  {t.rank}
                </span>
                <span className="absolute right-2.5 top-2.5 rounded-full bg-sauge/90 px-2 py-0.5 text-[10px] font-bold text-ink">
                  {t.growth}
                </span>
                <div className="absolute inset-x-3 bottom-3">
                  <p className="text-[11px] font-medium text-white/85">
                    {cat.emoji} {cat.label}
                  </p>
                  <p className="font-display text-lg font-semibold leading-tight text-white">
                    {t.name}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Inspiration — grille Pinterest */}
      <section className="px-5 pt-7">
        <div className="mb-3 flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold text-ink">Inspiration</h2>
            <p className="text-[12px] text-ink-soft">
              Sauvegardez vos envies, envoyez-les à votre créatrice 💌
            </p>
          </div>
        </div>

        <div className="mb-4">
          <CategoryChips value={cat} onChange={setCat} />
        </div>

        <div className="columns-2 gap-3 [column-fill:_balance] md:columns-3 lg:columns-4">
          {inspirations.map((m, i) => (
            <div
              key={m.id + i}
              className="group relative mb-3 break-inside-avoid overflow-hidden rounded-3xl shadow-float"
            >
              <Media
                category={m.category}
                seed={m.seed}
                rounded=""
                label={m.label}
                className={i % 3 === 0 ? "h-56 w-full" : i % 3 === 1 ? "h-44 w-full" : "h-64 w-full"}
              />
              <div className="absolute right-2.5 top-2.5">
                <SaveButton id={"insp-" + m.id} size={34} light />
              </div>
            </div>
          ))}
        </div>

        <Link
          href="/carte"
          className="mt-4 block rounded-full bg-gradient-to-r from-rose-deep to-or-rose py-3.5 text-center text-sm font-bold text-white shadow-soft"
        >
          Trouver une créatrice sur la carte →
        </Link>
      </section>
    </div>
  );
}
