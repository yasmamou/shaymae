"use client";

import { useFavorites } from "./FavoritesProvider";

export function SaveButton({
  id,
  size = 40,
  light = false,
}: {
  id: string;
  size?: number;
  light?: boolean;
}) {
  const { has, toggle } = useFavorites();
  const saved = has(id);
  const icon = Math.round(size * 0.5);
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(id);
      }}
      aria-label={saved ? "Retirer des inspirations" : "Sauvegarder l'inspiration"}
      aria-pressed={saved}
      className={`grid place-items-center rounded-full transition active:scale-90 ${
        light ? "glass shadow-float" : "bg-blanc/90 shadow-float"
      }`}
      style={{ width: size, height: size }}
    >
      <svg
        width={icon}
        height={icon}
        viewBox="0 0 24 24"
        className={saved ? "animate-pop" : ""}
        fill={saved ? "#c9a227" : "none"}
        stroke={saved ? "#c9a227" : "#4a3328"}
        strokeWidth="2"
        strokeLinejoin="round"
      >
        <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" />
      </svg>
    </button>
  );
}
