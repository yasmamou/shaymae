import { FEED } from "@/lib/data";
import { FeedCard } from "@/components/FeedCard";
import { StoriesBar } from "@/components/Stories";

export default function HomePage() {
  return (
    <div className="snap-feed no-scrollbar h-[100dvh] overflow-y-scroll">
      {/* En-tête flottant */}
      <header className="sticky top-0 z-30 glass border-b border-white/50">
        <div className="flex items-center justify-between px-5 pb-2 pt-[max(12px,env(safe-area-inset-top))]">
          <div>
            <h1 className="font-display text-3xl font-bold leading-none text-ink">
              Shaymae
            </h1>
            <p className="mt-0.5 text-[11px] font-medium text-ink-soft">
              Créatrices beauté près de vous
            </p>
          </div>
          <button className="flex items-center gap-1.5 rounded-full border border-line bg-blanc/70 px-3 py-2 text-xs font-semibold text-ink">
            <span>📍</span> Lausanne
            <span className="text-ink-soft">▾</span>
          </button>
        </div>
        {/* Stories */}
        <div className="px-5 pb-3">
          <StoriesBar />
        </div>
      </header>

      {/* Feed immersif */}
      {FEED.map((item) => (
        <FeedCard key={item.id} item={item} />
      ))}

      <div className="h-28" />
    </div>
  );
}
