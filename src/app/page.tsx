import Link from "next/link";
import { FeedList } from "@/components/FeedList";
import { StoriesRail } from "@/components/Stories";
import { DiscoverRail } from "@/components/DiscoverRail";

export default function HomePage() {
  return (
    <div className="lg:flex lg:gap-6 lg:px-6 lg:py-6">
      {/* Colonne feed immersif */}
      <div className="snap-feed no-scrollbar h-[100dvh] overflow-y-scroll lg:h-[calc(100dvh-3rem)] lg:w-[460px] lg:shrink-0 lg:rounded-[2rem] lg:border lg:border-line lg:bg-blanc/30">
        {/* En-tête épuré : Glow + favoris (pas de connexion ni localisation) */}
        <header className="sticky top-0 z-30 glass border-b border-white/50 lg:rounded-t-[2rem]">
          <div className="flex items-center justify-between gap-3 px-5 pb-2 pt-[max(12px,env(safe-area-inset-top))]">
            <h1 className="font-display text-3xl font-bold leading-none text-gradient-gold">Glow</h1>
            <Link
              href="/favoris"
              aria-label="Mes favoris"
              className="grid h-10 w-10 place-items-center rounded-full glass shadow-float text-lg"
            >
              ♡
            </Link>
          </div>
          {/* Stories qui buzz — mises en avant */}
          <div className="px-5 pb-3">
            <p className="mb-2 text-[12px] font-bold tracking-wide text-ink">✨ Stories du moment</p>
            <StoriesRail />
          </div>
        </header>

        {/* Feed immersif (+ publications créatrices) */}
        <FeedList />
        <div className="h-32 lg:h-6" />
      </div>

      {/* Rail découverte (desktop) */}
      <DiscoverRail />
    </div>
  );
}
