import { FeedList } from "@/components/FeedList";
import { StoriesBar } from "@/components/Stories";
import { DiscoverRail } from "@/components/DiscoverRail";
import { AccountButton } from "@/components/AccountButton";

export default function HomePage() {
  return (
    <div className="lg:flex lg:gap-6 lg:px-6 lg:py-6">
      {/* Colonne feed immersif */}
      <div className="snap-feed no-scrollbar h-[100dvh] overflow-y-scroll lg:h-[calc(100dvh-3rem)] lg:w-[460px] lg:shrink-0 lg:rounded-[2rem] lg:border lg:border-line lg:bg-blanc/30">
        {/* En-tête flottant */}
        <header className="sticky top-0 z-30 glass border-b border-white/50 lg:rounded-t-[2rem]">
          <div className="flex items-center justify-between gap-3 px-5 pb-2 pt-[max(12px,env(safe-area-inset-top))]">
            <div className="min-w-0">
              <h1 className="font-display text-3xl font-bold leading-none text-ink lg:hidden">Shaymae</h1>
              <p className="mt-0.5 text-[11px] font-medium text-ink-soft max-lg:mt-0.5">
                <span className="hidden lg:inline font-display text-lg font-semibold text-ink">À la une </span>
                Créatrices beauté près de vous
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 rounded-full border border-line bg-blanc/70 px-3 py-2 text-xs font-semibold text-ink">
                📍 Montpellier <span className="text-ink-soft">▾</span>
              </span>
              <span className="lg:hidden">
                <AccountButton />
              </span>
            </div>
          </div>
          {/* Stories */}
          <div className="px-5 pb-3">
            <StoriesBar />
          </div>
        </header>

        {/* Feed immersif (+ publications créatrices) */}
        <FeedList />
        <div className="h-28 lg:h-6" />
      </div>

      {/* Rail découverte (desktop) */}
      <DiscoverRail />
    </div>
  );
}
