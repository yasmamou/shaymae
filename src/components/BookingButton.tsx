"use client";

import { useState } from "react";
import type { Creator } from "@/lib/data";

const OPTIONS = {
  whatsapp: { emoji: "🟢", label: "WhatsApp", hint: "Réponse rapide, à toute heure" },
  instagram: { emoji: "📸", label: "Instagram", hint: "Échangez en DM" },
  internal: { emoji: "📅", label: "Réservation Shaymae", hint: "Créneaux en direct" },
} as const;

export function BookingButton({
  creator,
  variant = "solid",
  className = "",
}: {
  creator: Creator;
  variant?: "solid" | "ghost";
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  const hrefFor = (mode: keyof typeof OPTIONS) => {
    if (mode === "whatsapp" && creator.whatsapp) {
      const msg = encodeURIComponent(
        `Bonjour ${creator.name} ✨ je vous ai trouvée sur Shaymae, j'aimerais réserver une prestation.`
      );
      return `https://wa.me/${creator.whatsapp}?text=${msg}`;
    }
    if (mode === "instagram" && creator.instagram) {
      return `https://instagram.com/${creator.instagram}`;
    }
    return undefined;
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`${className} rounded-full px-5 py-3 text-sm font-bold tracking-wide transition active:scale-[0.98] ${
          variant === "solid"
            ? "bg-gradient-to-r from-rose-deep to-or-rose text-white shadow-soft"
            : "glass border border-white/60 text-ink shadow-float"
        }`}
      >
        Réserver
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 mx-auto flex w-full max-w-[480px] items-end"
          role="dialog"
          aria-modal="true"
        >
          <button
            aria-label="Fermer"
            className="absolute inset-0 bg-ink/30 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="relative w-full animate-float-up rounded-t-[2rem] bg-blanc p-5 pb-[max(24px,env(safe-area-inset-bottom))] shadow-soft">
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-line" />
            <h3 className="font-display text-2xl font-semibold text-ink">
              Réserver chez {creator.name}
            </h3>
            <p className="mb-4 mt-1 text-sm text-ink-soft">
              Choisissez votre moyen préféré — le moins de clics possible.
            </p>
            <div className="flex flex-col gap-2.5">
              {creator.booking.map((mode) => {
                const o = OPTIONS[mode];
                const href = hrefFor(mode);
                const inner = (
                  <div className="flex items-center gap-3.5 rounded-2xl border border-line bg-creme/60 px-4 py-3.5 transition active:scale-[0.99]">
                    <span className="text-2xl">{o.emoji}</span>
                    <span className="flex-1">
                      <span className="block text-sm font-bold text-ink">{o.label}</span>
                      <span className="block text-xs text-ink-soft">{o.hint}</span>
                    </span>
                    <span className="text-ink-soft">→</span>
                  </div>
                );
                return href ? (
                  <a key={mode} href={href} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>
                    {inner}
                  </a>
                ) : (
                  <button
                    key={mode}
                    onClick={() => {
                      setOpen(false);
                      alert(
                        `Réservation Shaymae interne — bientôt disponible ✨\n\nVous pourrez choisir un créneau directement dans l'agenda de ${creator.name}.`
                      );
                    }}
                    className="text-left"
                  >
                    {inner}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
