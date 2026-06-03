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
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(id);
      }}
      aria-label={saved ? "Retirer des inspirations" : "Sauvegarder"}
      aria-pressed={saved}
      className={`grid place-items-center rounded-full transition active:scale-90 ${
        light ? "glass shadow-float" : "bg-blanc/90 shadow-float"
      }`}
      style={{ width: size, height: size }}
    >
      <span className={saved ? "animate-pop" : ""} style={{ fontSize: size * 0.5 }}>
        {saved ? "❤️" : "🤍"}
      </span>
    </button>
  );
}
