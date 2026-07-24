"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { FeedList } from "@/components/FeedList";
import { StoriesRail } from "@/components/Stories";
import { InstallButton } from "@/components/InstallButton";

export function HomeScrollColumn() {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  function onScroll(e: React.UIEvent<HTMLDivElement>) {
    const y = e.currentTarget.scrollTop;
    if (y < 24) {
      setHidden(false);
    } else if (y > lastY.current + 6) {
      setHidden(true); // on descend → on cache le haut (titre + stories)
    } else if (y < lastY.current - 6) {
      setHidden(false); // on remonte → on réaffiche
    }
    lastY.current = y;
  }

  return (
    <div
      onScroll={onScroll}
      className="snap-feed no-scrollbar h-[100dvh] overflow-y-scroll lg:h-[calc(100dvh-3rem)] lg:w-[460px] lg:shrink-0 lg:rounded-[2rem] lg:border lg:border-line lg:bg-blanc/30"
    >
      {/* En-tête épuré : disparaît au scroll vers le bas, réapparaît en remontant */}
      <header
        className={`sticky top-0 z-30 glass border-b border-white/50 transition-transform duration-300 ease-out lg:rounded-t-[2rem] ${
          hidden ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        {/* Barre titre : inutile sur desktop (déjà dans la SideNav) */}
        <div className="flex items-center justify-between gap-3 px-5 pb-2 pt-[max(12px,env(safe-area-inset-top))] lg:hidden">
          <h1 className="font-display text-3xl font-bold leading-none text-gradient-gold">Shaymae</h1>
          <div className="flex items-center gap-2">
            <InstallButton />
            <Link
              href="/favoris"
              aria-label="Mes favoris"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full glass shadow-float text-lg"
            >
              ♡
            </Link>
          </div>
        </div>
        {/* Stories qui buzz — mises en avant */}
        <div className="px-5 pb-3 lg:pt-4">
          <p className="mb-2 text-[12px] font-bold tracking-wide text-ink">✨ Stories du moment</p>
          <StoriesRail />
        </div>
      </header>

      {/* Feed immersif (+ publications créatrices) */}
      <FeedList />
      <div className="h-32 lg:h-6" />
    </div>
  );
}
