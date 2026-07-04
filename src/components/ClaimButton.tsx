"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";

export function ClaimButton({ slug, name }: { slug: string; name: string }) {
  const { user, ready } = useAuth();
  const router = useRouter();
  const [status, setStatus] = useState<string | null>(null); // null | pending | approved | rejected
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!ready || !user) return;
    fetch(`/api/claims?slug=${slug}`).then((r) => r.json()).then((d) => {
      const mine = (d.claims ?? [])[0];
      if (mine) setStatus(mine.status);
    }).catch(() => {});
  }, [ready, user, slug]);

  if (status === "pending") {
    return <p className="mt-3 rounded-2xl bg-champagne/30 px-4 py-2.5 text-center text-[13px] font-semibold text-ink">⏳ Revendication envoyée — en cours de vérification par l&apos;équipe Shaymae.</p>;
  }
  if (status === "approved") return null;

  const submit = async () => {
    setSending(true);
    const res = await fetch("/api/claims", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ creatorSlug: slug, note }),
    });
    const d = await res.json();
    setSending(false);
    if (res.ok) { setStatus("pending"); setOpen(false); }
    else alert(d.error ?? "Impossible d'envoyer la demande");
  };

  return (
    <>
      <button
        onClick={() => (user ? setOpen(true) : router.push("/connexion"))}
        className="mt-3 w-full rounded-2xl border border-dashed border-champagne bg-creme/40 px-4 py-2.5 text-[13px] font-semibold text-ink"
      >
        ✋ Ce profil m&apos;appartient — le revendiquer
      </button>

      {open && (
        <div className="fixed inset-0 z-[2100] mx-auto flex w-full max-w-[480px] items-end lg:items-center lg:p-6" role="dialog" aria-modal="true">
          <button aria-label="Fermer" className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative w-full animate-float-up rounded-t-[2rem] bg-blanc p-5 pb-[max(24px,env(safe-area-inset-bottom))] shadow-soft lg:rounded-[2rem]">
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-line" />
            <h3 className="font-display text-2xl font-semibold text-ink">Revendiquer {name}</h3>
            <p className="mt-1 text-sm text-ink-soft">
              Ce profil a été référencé automatiquement depuis des informations publiques. Confirmez qu&apos;il est bien le vôtre — l&apos;équipe Shaymae vérifie puis vous le rattache.
            </p>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="Un lien Instagram, un justificatif, un message… (facultatif)"
              className="mt-4 w-full resize-none rounded-2xl border border-line bg-creme/50 px-4 py-3 text-sm outline-none focus:border-or-rose focus:bg-blanc"
            />
            <button onClick={submit} disabled={sending} className="mt-3 w-full rounded-full bg-gradient-to-r from-rose-deep to-or-rose py-3.5 text-sm font-bold text-white shadow-soft disabled:opacity-60">
              {sending ? "Envoi…" : "Envoyer ma demande"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
