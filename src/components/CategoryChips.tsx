"use client";

import { CATEGORIES, type CategoryKey } from "@/lib/data";

export function CategoryChips({
  value,
  onChange,
  allLabel = "Tout",
}: {
  value: CategoryKey | "all";
  onChange: (v: CategoryKey | "all") => void;
  allLabel?: string;
}) {
  const items: { key: CategoryKey | "all"; label: string; emoji: string }[] = [
    { key: "all", label: allLabel, emoji: "✨" },
    ...CATEGORIES.map((c) => ({ key: c.key, label: c.label, emoji: c.emoji })),
  ];
  return (
    <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5">
      {items.map((it) => {
        const active = value === it.key;
        return (
          <button
            key={it.key}
            onClick={() => onChange(it.key)}
            className={`shrink-0 whitespace-nowrap rounded-full border px-3.5 py-2 text-sm font-semibold transition active:scale-95 ${
              active
                ? "border-transparent bg-ink text-blanc shadow-float"
                : "border-line bg-blanc/70 text-ink-soft"
            }`}
          >
            <span className="mr-1">{it.emoji}</span>
            {it.label}
          </button>
        );
      })}
    </div>
  );
}
