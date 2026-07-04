"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";

interface Stats {
  users: { total: number; clientes: number; creatrices: number; admins: number };
  creators: { total: number; owned: number; unclaimed: number };
  reservations: { total: number; pending: number; confirmed: number };
  messages: number;
  claimsPending: number;
  activeSessions: number;
  signups7: { day: string; n: number }[];
}
interface Claim {
  id: string; creatorSlug: string; creatorName: string | null; status: string;
  note: string | null; userEmail: string | null; userName: string | null;
}

export default function AdminPage() {
  const { user, ready } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [claims, setClaims] = useState<Claim[]>([]);

  const load = () => {
    fetch("/api/admin/stats").then((r) => r.json()).then((d) => !d.error && setStats(d)).catch(() => {});
    fetch("/api/admin/claims").then((r) => r.json()).then((d) => setClaims(d.claims ?? [])).catch(() => {});
  };
  useEffect(() => { if (ready && user?.role === "admin") load(); }, [ready, user]);

  if (!ready) return null;
  if (!user || user.role !== "admin") {
    return (
      <div className="mx-auto flex min-h-[100dvh] max-w-md flex-col items-center justify-center px-8 pb-32 text-center">
        <span className="mb-4 text-6xl">🔒</span>
        <h1 className="font-display text-3xl font-semibold text-ink">Espace administrateur</h1>
        <p className="mt-2 max-w-xs text-sm text-ink-soft">Réservé à l&apos;équipe Shaymae.</p>
        <Link href="/connexion" className="mt-6 rounded-full bg-gradient-to-r from-rose-deep to-or-rose px-6 py-3 text-sm font-bold text-white shadow-soft">Se connecter</Link>
      </div>
    );
  }

  const act = async (id: string, action: "approve" | "reject") => {
    setClaims((prev) => prev.map((c) => (c.id === id ? { ...c, status: action === "approve" ? "approved" : "rejected" } : c)));
    await fetch(`/api/admin/claims/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action }) });
    load();
  };

  const pending = claims.filter((c) => c.status === "pending");
  const maxSignup = Math.max(1, ...(stats?.signups7.map((s) => s.n) ?? [1]));

  return (
    <div className="mx-auto min-h-[100dvh] max-w-4xl px-5 pb-32 pt-[max(16px,env(safe-area-inset-top))]">
      <header className="mb-4">
        <p className="text-[11px] font-bold uppercase tracking-wider text-or-rose">Administration</p>
        <h1 className="font-display text-3xl font-bold text-ink">Tableau de bord</h1>
        <p className="text-[12px] text-ink-soft">Vue d&apos;ensemble de la plateforme Shaymae</p>
      </header>

      {stats && (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat value={stats.users.total} label="Utilisateurs" />
            <Stat value={stats.activeSessions} label="Sessions actives" />
            <Stat value={stats.reservations.total} label="Réservations" />
            <Stat value={stats.claimsPending} label="Revendications" highlight={stats.claimsPending > 0} />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat value={stats.users.creatrices} label="Créatrices" />
            <Stat value={stats.users.clientes} label="Clientes" />
            <Stat value={stats.creators.unclaimed} label="Profils non revendiqués" />
            <Stat value={stats.messages} label="Messages" />
          </div>

          <section className="mt-5 rounded-3xl border border-line bg-blanc/70 p-4">
            <h2 className="mb-3 font-display text-lg font-semibold text-ink">Inscriptions (7 jours)</h2>
            <div className="flex items-end gap-2" style={{ height: 90 }}>
              {stats.signups7.length === 0 && <p className="text-sm text-ink-soft">Aucune donnée.</p>}
              {stats.signups7.map((s) => (
                <div key={s.day} className="flex flex-1 flex-col items-center gap-1">
                  <div className="w-full rounded-t-lg bg-gradient-to-t from-rose-deep to-or-rose" style={{ height: `${(s.n / maxSignup) * 70 + 4}px` }} />
                  <span className="text-[9px] text-ink-soft">{s.day.slice(8)}</span>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      <section className="mt-5">
        <h2 className="mb-3 font-display text-xl font-semibold text-ink">
          Revendications à valider {pending.length > 0 && <span className="rounded-full bg-rose-deep px-2 py-0.5 text-[11px] font-bold text-white">{pending.length}</span>}
        </h2>
        {pending.length === 0 ? (
          <p className="rounded-3xl border border-dashed border-line bg-blanc/50 p-6 text-center text-sm text-ink-soft">Aucune demande en attente.</p>
        ) : (
          <div className="space-y-3">
            {pending.map((c) => (
              <div key={c.id} className="rounded-3xl border border-line bg-blanc/80 p-4 shadow-float">
                <p className="text-sm font-bold text-ink">{c.creatorName ?? c.creatorSlug}</p>
                <p className="text-[12px] text-ink-soft">Demandé par <b>{c.userName}</b> · {c.userEmail}</p>
                {c.note && <p className="mt-1.5 rounded-xl bg-creme/60 px-3 py-1.5 text-[12px] text-ink">« {c.note} »</p>}
                <div className="mt-3 flex gap-2">
                  <button onClick={() => act(c.id, "approve")} className="flex-1 rounded-full bg-gradient-to-r from-rose-deep to-or-rose py-2.5 text-[13px] font-bold text-white">✓ Valider (rattacher)</button>
                  <button onClick={() => act(c.id, "reject")} className="rounded-full border border-line px-4 py-2.5 text-[13px] font-semibold text-ink-soft">Refuser</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {claims.filter((c) => c.status !== "pending").length > 0 && (
        <section className="mt-6">
          <h2 className="mb-3 font-display text-lg font-semibold text-ink">Historique</h2>
          <div className="space-y-2">
            {claims.filter((c) => c.status !== "pending").map((c) => (
              <div key={c.id} className="flex items-center justify-between rounded-2xl border border-line bg-blanc/60 px-4 py-2.5">
                <span className="text-[13px] text-ink">{c.creatorName ?? c.creatorSlug} · {c.userEmail}</span>
                <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${c.status === "approved" ? "bg-sauge/60 text-ink" : "bg-line text-ink-soft"}`}>
                  {c.status === "approved" ? "Validé" : "Refusé"}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Stat({ value, label, highlight }: { value: number; label: string; highlight?: boolean }) {
  return (
    <div className={`rounded-2xl border p-3.5 text-center ${highlight ? "border-rose-deep bg-rose/30" : "border-line bg-blanc/70"}`}>
      <p className="font-display text-2xl font-bold text-ink">{value}</p>
      <p className="text-[11px] text-ink-soft">{label}</p>
    </div>
  );
}
