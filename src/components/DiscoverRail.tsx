import Link from "next/link";
import { CREATORS, TRENDS, categoryOf } from "@/lib/data";
import { Media } from "@/lib/Media";
import { ProCard } from "./ProCard";

/** Rail latéral affiché uniquement sur desktop, façon site web. */
export function DiscoverRail() {
  const montpellier = CREATORS.filter((c) => c.region === "Montpellier").slice(0, 3);

  return (
    <aside className="hidden min-w-0 flex-1 lg:block">
      <div className="flex h-[calc(100dvh-3rem)] flex-col gap-6 overflow-y-auto no-scrollbar pb-6 pr-1">
        {/* Tendances */}
        <section className="rounded-[2rem] border border-line bg-blanc/60 p-5">
          <div className="mb-3 flex items-end justify-between">
            <h2 className="font-display text-2xl font-semibold text-ink">Tendances</h2>
            <Link href="/decouvrir" className="text-[12px] font-semibold text-or-rose">Tout voir →</Link>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {TRENDS.slice(0, 6).map((t) => {
              const cat = categoryOf(t.category);
              return (
                <div key={t.rank} className="relative overflow-hidden rounded-2xl shadow-float">
                  <Media category={t.category} seed={t.seed} rounded="" className="h-28 w-full" glyph={false} />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/75 to-transparent" />
                  <span className="absolute right-1.5 top-1.5 rounded-full bg-sauge/90 px-1.5 py-0.5 text-[9px] font-bold text-ink">
                    {t.growth}
                  </span>
                  <div className="absolute inset-x-2 bottom-2">
                    <p className="text-[9px] font-medium text-white/80">{cat.emoji} {cat.label}</p>
                    <p className="font-display text-[13px] font-semibold leading-tight text-white">{t.name}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Créatrices à Montpellier */}
        <section className="rounded-[2rem] border border-line bg-blanc/60 p-5">
          <div className="mb-3 flex items-end justify-between">
            <h2 className="font-display text-2xl font-semibold text-ink">À Montpellier</h2>
            <Link href="/carte" className="text-[12px] font-semibold text-or-rose">Carte →</Link>
          </div>
          <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
            {montpellier.map((c) => (
              <ProCard key={c.id} creator={c} />
            ))}
          </div>
        </section>
      </div>
    </aside>
  );
}
