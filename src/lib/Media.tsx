"use client";

import { useState } from "react";
import type { CategoryKey } from "./data";
import { categoryOf } from "./data";
import { imageFor } from "./images";

/**
 * Média Shaymae : vraie photo (Unsplash, pertinente par catégorie) posée sur
 * un dégradé thématique. Si l'image échoue, on retombe élégamment sur le
 * dégradé + emoji — jamais d'image cassée.
 */
export function Media({
  category,
  seed,
  label,
  glyph = true,
  className = "",
  rounded = "rounded-3xl",
  width = 800,
  src,
}: {
  category: CategoryKey;
  seed: number;
  label?: string;
  glyph?: boolean;
  className?: string;
  rounded?: string;
  width?: number;
  /** URL explicite (sinon dérivée de catégorie+seed) */
  src?: string;
}) {
  const cat = categoryOf(category);
  const [a, b, c] = cat.grad;
  const angle = (seed * 47) % 360;
  const x1 = 15 + (seed % 70);
  const y1 = 10 + ((seed * 3) % 60);
  const url = src ?? imageFor(category, seed, width);
  const [ok, setOk] = useState(true);

  return (
    <div
      className={`relative overflow-hidden ${rounded} ${className}`}
      style={{
        background: `
          radial-gradient(60% 55% at ${x1}% ${y1}%, ${a} 0%, transparent 60%),
          linear-gradient(${angle}deg, ${b}, ${a})
        `,
      }}
    >
      {ok && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt={label ?? cat.label}
          loading="lazy"
          onError={() => setOk(false)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      {/* repli : emoji + voile, uniquement si l'image n'a pas chargé */}
      {!ok && glyph && (
        <div className="absolute inset-0 grid place-items-center">
          <span className="select-none opacity-30" style={{ fontSize: "min(40%, 5rem)", lineHeight: 1 }}>
            {cat.emoji}
          </span>
        </div>
      )}

      {/* léger voile bas pour la lisibilité des chips */}
      {label && <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/30 to-transparent" />}

      {label && (
        <div className="absolute inset-x-0 bottom-0 p-3">
          <span className="inline-flex items-center gap-1 rounded-full glass px-2.5 py-1 text-[11px] font-medium text-ink shadow-float">
            {cat.emoji} {label}
          </span>
        </div>
      )}
    </div>
  );
}

/** Avatar génératif rond (initiales sur dégradé). */
export function Avatar({
  seed,
  category,
  name,
  size = 48,
  ring = false,
  src,
}: {
  seed: number;
  category: CategoryKey;
  name: string;
  size?: number;
  ring?: boolean;
  src?: string;
}) {
  const cat = categoryOf(category);
  const [a, , c] = cat.grad;
  const [ok, setOk] = useState(!!src);
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
  return (
    <div
      className={`relative grid place-items-center overflow-hidden rounded-full font-display font-semibold text-ink ${
        ring ? "ring-2 ring-champagne ring-offset-2 ring-offset-blanc" : ""
      }`}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.36,
        background: `linear-gradient(135deg, ${a}, ${c})`,
      }}
      aria-label={name}
    >
      <span>{initials}</span>
      {src && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={name}
          loading="lazy"
          onLoad={() => setOk(true)}
          onError={() => setOk(false)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity ${ok ? "opacity-100" : "opacity-0"}`}
        />
      )}
    </div>
  );
}
