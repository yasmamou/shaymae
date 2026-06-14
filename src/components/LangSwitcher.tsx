"use client";

import { useState } from "react";
import { useI18n, LANGS } from "./I18nProvider";

export function LangSwitcher({ compact = false }: { compact?: boolean }) {
  const { lang, setLang } = useI18n();
  const [open, setOpen] = useState(false);
  const current = LANGS.find((l) => l.key === lang)!;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1.5 rounded-full border border-line bg-blanc/70 font-semibold text-ink ${compact ? "px-2.5 py-1.5 text-xs" : "w-full justify-center px-3 py-2.5 text-sm"}`}
      >
        <span>{current.flag}</span>
        {!compact && <span>{current.label}</span>}
        <span className="text-ink-soft">▾</span>
      </button>
      {open && (
        <>
          <button className="fixed inset-0 z-40" aria-hidden onClick={() => setOpen(false)} />
          <div className="absolute bottom-full z-50 mb-2 w-44 overflow-hidden rounded-2xl border border-line bg-blanc shadow-soft">
            {LANGS.map((l) => (
              <button
                key={l.key}
                onClick={() => { setLang(l.key); setOpen(false); }}
                className={`flex w-full items-center gap-2.5 px-4 py-2.5 text-sm transition hover:bg-creme/60 ${l.key === lang ? "font-bold text-ink" : "text-ink-soft"}`}
              >
                <span>{l.flag}</span> {l.label}
                {l.key === lang && <span className="ml-auto text-or-rose">✓</span>}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
