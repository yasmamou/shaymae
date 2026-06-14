"use client";

import Link from "next/link";
import { useBookings } from "@/components/BookingsProvider";
import { getCreator } from "@/lib/data";
import { Avatar } from "@/lib/Media";
import { AccountButton } from "@/components/AccountButton";

export default function RendezVousPage() {
  const { reservations, ready, cancel } = useBookings();

  return (
    <div className="min-h-[100dvh] px-5 pb-32 pt-[max(16px,env(safe-area-inset-top))]">
      <header className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink">Mes rendez-vous</h1>
          <p className="text-[12px] text-ink-soft">Historique, rappels et reprise de RDV</p>
        </div>
        <span className="lg:hidden"><AccountButton /></span>
      </header>

      {ready && reservations.length === 0 && (
        <div className="flex flex-col items-center px-6 pt-20 text-center">
          <span className="mb-4 text-6xl">📅</span>
          <h2 className="font-display text-2xl font-semibold text-ink">Aucun rendez-vous</h2>
          <p className="mt-2 max-w-xs text-sm text-ink-soft">
            Réservez votre première prestation et retrouvez tout votre historique ici.
          </p>
          <Link href="/recherche" className="mt-6 rounded-full bg-gradient-to-r from-rose-deep to-or-rose px-6 py-3 text-sm font-bold text-white shadow-soft">
            Trouver une prestation
          </Link>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {reservations.map((r) => {
          const creator = getCreator(r.creatorSlug);
          const cancelled = r.status === "annulé";
          return (
            <div key={r.id} className={`rounded-3xl border border-line bg-blanc/80 p-4 shadow-float ${cancelled ? "opacity-60" : ""}`}>
              <div className="flex items-center gap-3">
                {creator && <Avatar seed={creator.avatarSeed} category={creator.categories[0]} name={creator.name} size={44} />}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-ink">{r.serviceName}</p>
                  <p className="truncate text-[12px] text-ink-soft">{r.creatorName} · {prettyDate(r.date)} · {r.slot}</p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${cancelled ? "bg-line text-ink-soft" : "bg-sauge/60 text-ink"}`}>
                  {cancelled ? "Annulé" : "Confirmé"}
                </span>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <Link
                  href={`/reserver/${r.creatorSlug}?service=${encodeURIComponent(r.serviceName)}`}
                  className="flex-1 rounded-full bg-ink py-2.5 text-center text-[13px] font-bold text-blanc"
                >
                  🔁 Reprendre rendez-vous
                </Link>
                {creator && (
                  <Link href={`/messages/${creator.slug}`} className="rounded-full glass border border-white/60 px-4 py-2.5 text-[13px] font-bold text-ink shadow-float">
                    ✉
                  </Link>
                )}
                {!cancelled && (
                  <button onClick={() => cancel(r.id)} className="rounded-full border border-line px-4 py-2.5 text-[13px] font-semibold text-ink-soft">
                    Annuler
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function prettyDate(iso: string) {
  const d = new Date(iso + "T00:00:00Z");
  return d.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });
}
