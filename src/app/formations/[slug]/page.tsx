"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getFormation } from "@/lib/data";
import { Media } from "@/lib/Media";
import { useBookings } from "@/components/BookingsProvider";

const SESSIONS = ["Sam 21 juin", "Sam 5 juil.", "Lun 14 juil."];

export default function FormationDetail() {
  const { slug } = useParams<{ slug: string }>();
  const f = getFormation(slug);
  const { book } = useBookings();
  const [session, setSession] = useState(0);
  const [done, setDone] = useState(false);

  if (!f) {
    return <div className="grid min-h-[100dvh] place-items-center px-8 text-center"><p className="text-ink-soft">Formation introuvable. <Link href="/formations" className="underline">Retour</Link></p></div>;
  }

  return (
    <div className="min-h-[100dvh] pb-32">
      <div className="relative">
        <Media category={f.base} seed={f.seed} rounded="" glyph={false} className="h-56 w-full" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/30 to-ink/60" />
        <Link href="/formations" className="absolute left-4 top-[max(14px,env(safe-area-inset-top))] grid h-10 w-10 place-items-center rounded-full glass text-ink shadow-float">←</Link>
        <div className="absolute inset-x-5 bottom-4">
          <span className="rounded-full glass px-2.5 py-1 text-[10px] font-bold text-ink shadow-float">🎓 {f.level}{f.certified ? " · Certifiante" : ""}</span>
          <h1 className="mt-2 font-display text-3xl font-bold leading-tight text-white drop-shadow">{f.title}</h1>
          <p className="text-[13px] text-white/90">par {f.trainer} ✅ · 📍 {f.city}</p>
        </div>
      </div>

      <div className="px-5 pt-5">
        <div className="flex items-center gap-2 text-sm">
          <span className="rounded-full bg-creme px-3 py-1.5 font-bold text-ink">⭐ {f.rating}</span>
          <span className="rounded-full bg-creme px-3 py-1.5 text-ink-soft">{f.reviews} avis</span>
          <span className="rounded-full bg-creme px-3 py-1.5 text-ink-soft">{f.durationDays} jour{f.durationDays > 1 ? "s" : ""}</span>
        </div>

        <section className="mt-6">
          <h2 className="mb-2 font-display text-xl font-semibold text-ink">Programme</h2>
          <ol className="space-y-2">
            {f.program.map((p, i) => (
              <li key={i} className="flex items-start gap-3 rounded-2xl border border-line bg-blanc/70 px-4 py-3">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-ink text-[11px] font-bold text-blanc">{i + 1}</span>
                <span className="text-sm text-ink">{p}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-6 rounded-3xl border border-line bg-sauge/20 p-4">
          <h2 className="mb-1 font-display text-lg font-semibold text-ink">Formatrice vérifiée ✅</h2>
          <p className="text-[13px] text-ink-soft">
            {f.trainer} — identité, activité et certifications validées par Shaymae.
            {f.certified ? " Un certificat reconnu est délivré en fin de formation." : ""}
          </p>
        </section>

        <section className="mt-6">
          <h2 className="mb-2 font-display text-xl font-semibold text-ink">Prochaines sessions</h2>
          <div className="flex flex-wrap gap-2">
            {SESSIONS.map((s, i) => (
              <button key={s} onClick={() => setSession(i)}
                className={`rounded-2xl border px-4 py-2.5 text-sm font-semibold transition ${session === i ? "border-transparent bg-ink text-blanc" : "border-line bg-blanc/60 text-ink"}`}>
                {s}
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* CTA */}
      <div className="fixed inset-x-0 bottom-24 z-30 mx-auto w-full max-w-[480px] px-5 lg:bottom-5">
        <button
          onClick={() => {
            book({
              creatorSlug: f.slug, creatorName: f.trainer, serviceName: `Formation : ${f.title}`,
              price: f.price, deposit: Math.round(f.price * 0.3),
              date: "2026-06-21", slot: "09:00", firstName: "", lastName: "", phone: "",
            });
            setDone(true);
          }}
          className="flex w-full items-center justify-between rounded-full bg-gradient-to-r from-rose-deep to-or-rose px-5 py-4 text-sm font-bold text-white shadow-soft">
          <span>{done ? "✅ Inscription enregistrée" : `Réserver · ${SESSIONS[session]}`}</span>
          <span>{f.price}.–</span>
        </button>
      </div>
    </div>
  );
}
