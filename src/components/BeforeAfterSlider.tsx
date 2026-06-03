"use client";

import { useRef, useState } from "react";
import { Media } from "@/lib/Media";
import type { CategoryKey } from "@/lib/data";

export function BeforeAfterSlider({
  category,
  seed,
  className = "",
}: {
  category: CategoryKey;
  seed: number;
  className?: string;
}) {
  const [pos, setPos] = useState(52);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const move = (clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const p = ((clientX - r.left) / r.width) * 100;
    setPos(Math.max(4, Math.min(96, p)));
  };

  return (
    <div
      ref={ref}
      className={`relative select-none overflow-hidden rounded-3xl ${className}`}
      onPointerDown={(e) => {
        dragging.current = true;
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
        move(e.clientX);
      }}
      onPointerMove={(e) => dragging.current && move(e.clientX)}
      onPointerUp={() => (dragging.current = false)}
    >
      {/* APRÈS (fond) */}
      <Media category={category} seed={seed} rounded="" className="h-full w-full" glyph />
      <span className="absolute right-3 top-3 rounded-full glass px-2.5 py-1 text-[10px] font-semibold tracking-wide text-ink shadow-float">
        APRÈS
      </span>

      {/* AVANT (clip) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        <Media
          category={category}
          seed={seed + 180}
          rounded=""
          className="h-full w-full grayscale-[0.35] brightness-95"
          glyph
        />
        <span className="absolute left-3 top-3 rounded-full glass px-2.5 py-1 text-[10px] font-semibold tracking-wide text-ink shadow-float">
          AVANT
        </span>
      </div>

      {/* poignée */}
      <div
        className="absolute inset-y-0 flex w-0 items-center justify-center"
        style={{ left: `${pos}%` }}
      >
        <div className="absolute inset-y-0 w-0.5 bg-white/90 shadow-[0_0_12px_rgba(0,0,0,0.25)]" />
        <div className="grid h-10 w-10 place-items-center rounded-full bg-blanc shadow-soft">
          <span className="text-ink text-sm">⇆</span>
        </div>
      </div>
    </div>
  );
}
