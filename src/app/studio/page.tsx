"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import {
  CATEGORIES, categoryOf, STUDIO_CLIENTS, STUDIO_STATS, studioAgenda,
  type CategoryKey, type AgendaDay,
} from "@/lib/data";
import { Media, Avatar } from "@/lib/Media";

type Tab = "apercu" | "agenda" | "publications" | "prestations" | "clientes" | "equipe";

const TABS: { key: Tab; label: string }[] = [
  { key: "apercu", label: "Aperçu" },
  { key: "agenda", label: "Agenda" },
  { key: "publications", label: "Publications" },
  { key: "prestations", label: "Prestations" },
  { key: "clientes", label: "Clientes" },
  { key: "equipe", label: "Équipe" },
];

export default function StudioPage() {
  const { user, ready, signOut } = useAuth();
  const [tab, setTab] = useState<Tab>("apercu");

  if (!ready) return null;

  if (!user || user.role !== "creatrice") {
    return (
      <div className="mx-auto flex min-h-[100dvh] max-w-md flex-col items-center justify-center px-8 pb-32 text-center">
        <span className="mb-4 text-6xl">✨</span>
        <h1 className="font-display text-3xl font-semibold text-ink">Espace créatrice</h1>
        <p className="mt-2 max-w-xs text-sm text-ink-soft">
          Connectez-vous en tant que créatrice pour gérer votre agenda, publier vos
          réalisations et recevoir des réservations.
        </p>
        <div className="mt-6 flex w-full max-w-xs flex-col gap-2.5">
          <Link href="/inscription" className="rounded-full bg-gradient-to-r from-rose-deep to-or-rose py-3.5 text-sm font-bold text-white shadow-soft">
            Devenir créatrice Shaymae
          </Link>
          <Link href="/connexion" className="rounded-full glass border border-white/60 py-3.5 text-sm font-bold text-ink shadow-float">
            J&apos;ai déjà un compte
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-[100dvh] max-w-4xl px-5 pb-32 pt-[max(16px,env(safe-area-inset-top))]">
      {/* En-tête */}
      <div className="flex items-center gap-4 rounded-[2rem] border border-white/60 bg-blanc/85 p-5 shadow-soft">
        <Avatar seed={20} category={user.categories?.[0] ?? "maquillage"} name={user.name} size={60} ring />
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-or-rose">Espace créatrice · Premium</p>
          <h1 className="truncate font-display text-2xl font-bold text-ink">{user.name}</h1>
          <p className="truncate text-[12px] text-ink-soft">
            {user.handle} · 📍 {user.city} · {user.mode === "mobile" ? "🚗 Se déplace" : "🏠 Salon"}
          </p>
        </div>
        <button onClick={signOut} className="rounded-full border border-line px-3 py-1.5 text-[11px] font-semibold text-ink-soft">
          Déconnexion
        </button>
      </div>

      {/* Onglets */}
      <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
              tab === t.key ? "bg-ink text-blanc shadow-float" : "bg-blanc/60 text-ink-soft"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-5">
        {tab === "apercu" && <Apercu />}
        {tab === "agenda" && <Agenda />}
        {tab === "publications" && <Publications />}
        {tab === "prestations" && <Prestations />}
        {tab === "clientes" && <Clientes />}
        {tab === "equipe" && <Equipe />}
      </div>
    </div>
  );
}

/* ─── Aperçu / statistiques ─────────────────────────────── */
function Apercu() {
  const s = STUDIO_STATS;
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat value={s.rdvWeek} label="RDV cette semaine" />
        <Stat value={`${s.revenueMonth}.–`} label="CA du mois" />
        <Stat value={`${s.fillRate}%`} label="Taux de remplissage" />
        <Stat value={`${s.cancelRate}%`} label="Taux d'annulation" />
      </div>
      <Card title="Prestations les plus demandées">
        <div className="space-y-2.5">
          {s.topServices.map((t, i) => (
            <div key={t.name}>
              <div className="mb-1 flex justify-between text-[13px]">
                <span className="font-semibold text-ink">{t.name}</span>
                <span className="text-ink-soft">{t.count}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-creme">
                <div className="h-full rounded-full bg-gradient-to-r from-rose-deep to-or-rose" style={{ width: `${100 - i * 22}%` }} />
              </div>
            </div>
          ))}
        </div>
      </Card>
      <Card title="Vos clientes fidèles ⭐">
        <div className="flex flex-wrap gap-2">
          {STUDIO_CLIENTS.filter((c) => c.loyal).map((c) => (
            <span key={c.name} className="rounded-full bg-creme px-3 py-1.5 text-[12px] font-semibold text-ink">
              ⭐ {c.name} · {c.visits} visites
            </span>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ─── Agenda jour / 3 jours / semaine ───────────────────── */
function Agenda() {
  const [fromMs, setFromMs] = useState(0);
  const [view, setView] = useState<1 | 3 | 7>(3);
  useEffect(() => {
    const d = new Date();
    setFromMs(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  }, []);
  const days: AgendaDay[] = fromMs ? studioAgenda(fromMs, view) : [];

  return (
    <div>
      <div className="mb-3 flex gap-2">
        {([1, 3, 7] as const).map((v) => (
          <button key={v} onClick={() => setView(v)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${view === v ? "bg-ink text-blanc" : "bg-blanc/60 text-ink-soft"}`}>
            {v === 1 ? "Jour" : v === 3 ? "3 jours" : "Semaine"}
          </button>
        ))}
      </div>
      <div className={`grid gap-3 ${view === 1 ? "grid-cols-1" : view === 3 ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"}`}>
        {days.map((d) => (
          <div key={d.date} className="rounded-2xl border border-line bg-blanc/70 p-3">
            <p className="mb-2 text-[12px] font-bold text-ink">{d.dayLabel}</p>
            {d.appointments.length === 0 ? (
              <p className="py-3 text-center text-[11px] text-ink-soft">Repos / aucun RDV</p>
            ) : (
              <div className="space-y-1.5">
                {d.appointments.map((a, i) => (
                  <div key={i} className="rounded-xl px-2.5 py-1.5" style={{ background: a.color + "55" }}>
                    <p className="text-[12px] font-bold text-ink">{a.time} · {a.client}</p>
                    <p className="text-[11px] text-ink-soft">{a.service} · {a.collaborator}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <p className="mt-3 rounded-2xl bg-sauge/30 px-3 py-2 text-[12px] text-ink">
        🔔 Notifications auto (confirmation, rappel J-1, liste d&apos;attente) actives — simulé.
      </p>
    </div>
  );
}

/* ─── Publications ──────────────────────────────────────── */
function Publications() {
  const { posts, addPost, removePost } = useAuth();
  const [cat, setCat] = useState<CategoryKey>("cils");
  const [label, setLabel] = useState("");
  const [caption, setCaption] = useState("");

  return (
    <div className="space-y-5">
      <Card title="Publier une réalisation">
        <div className="no-scrollbar mb-3 flex gap-2 overflow-x-auto">
          {CATEGORIES.map((c) => (
            <button key={c.key} onClick={() => setCat(c.key)}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${cat === c.key ? "border-transparent bg-ink text-blanc" : "border-line bg-blanc/60 text-ink-soft"}`}>
              {c.emoji} {c.label}
            </button>
          ))}
        </div>
        <div className="mb-3 overflow-hidden rounded-2xl shadow-float">
          <Media category={cat} seed={(label.length * 13 + caption.length) % 360} className="h-40 w-full" label={label || "Aperçu"} glyph={false} />
        </div>
        <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Titre (ex. Volume russe glamour)"
          className="mb-2 w-full rounded-2xl border border-line bg-creme/50 px-4 py-3 text-sm outline-none focus:border-or-rose focus:bg-blanc" />
        <textarea value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Légende…" rows={2}
          className="mb-2 w-full resize-none rounded-2xl border border-line bg-creme/50 px-4 py-3 text-sm outline-none focus:border-or-rose focus:bg-blanc" />
        <button
          disabled={!label.trim()}
          onClick={() => { addPost({ category: cat, label: label.trim(), caption: caption.trim(), seed: (label.length * 13 + caption.length) % 360 }); setLabel(""); setCaption(""); }}
          className="w-full rounded-full bg-gradient-to-r from-rose-deep to-or-rose py-3 text-sm font-bold text-white shadow-soft disabled:opacity-50">
          Publier ✨
        </button>
      </Card>

      {posts.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {posts.map((p) => (
            <div key={p.id} className="relative overflow-hidden rounded-2xl shadow-float">
              <Media category={p.category} seed={p.seed} className="h-36 w-full" glyph={false} />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
              <p className="absolute inset-x-2 bottom-2 line-clamp-1 text-[12px] font-bold text-white">{p.label}</p>
              <button onClick={() => removePost(p.id)} className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-blanc/90 text-xs shadow-float">🗑</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Prestations & horaires ────────────────────────────── */
function Prestations() {
  const sample = [
    { name: "Volume Russe", duration: "2h15", price: 89 },
    { name: "Rehaussement de cils", duration: "1h", price: 55 },
    { name: "Brow lift", duration: "45 min", price: 49 },
  ];
  const hours = [
    { d: "Lun–Ven", h: "09:00 – 19:00" },
    { d: "Samedi", h: "09:00 – 17:00" },
    { d: "Dimanche", h: "Fermé" },
  ];
  return (
    <div className="space-y-5">
      <Card title="Mes prestations & tarifs">
        <div className="divide-y divide-line">
          {sample.map((s) => (
            <div key={s.name} className="flex items-center justify-between py-2.5">
              <div>
                <p className="text-sm font-semibold text-ink">{s.name}</p>
                <p className="text-[12px] text-ink-soft">⏱ {s.duration}</p>
              </div>
              <p className="font-display text-lg font-semibold text-ink">{s.price}.–</p>
            </div>
          ))}
        </div>
        <button className="mt-3 w-full rounded-full border border-line py-2.5 text-sm font-semibold text-ink-soft">+ Ajouter une prestation</button>
      </Card>
      <Card title="Horaires d'ouverture">
        <div className="space-y-1.5">
          {hours.map((h) => (
            <div key={h.d} className="flex justify-between text-sm">
              <span className="text-ink-soft">{h.d}</span>
              <span className="font-semibold text-ink">{h.h}</span>
            </div>
          ))}
        </div>
      </Card>
      <Card title="Politique d'annulation">
        <p className="text-[13px] text-ink-soft">Annulation gratuite jusqu&apos;à 24h avant. Acompte de 30% pour sécuriser le créneau. Protection contre les RDV non honorés activée.</p>
      </Card>
    </div>
  );
}

/* ─── Historique clientes ───────────────────────────────── */
function Clientes() {
  return (
    <div className="space-y-3">
      {STUDIO_CLIENTS.map((c) => (
        <div key={c.name} className="rounded-2xl border border-line bg-blanc/70 p-4">
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-1.5 text-sm font-bold text-ink">
              {c.name}
              {c.loyal && <span className="rounded-full bg-champagne/30 px-2 py-0.5 text-[10px] font-bold text-ink">⭐ Fidèle</span>}
            </p>
            <span className="text-[12px] text-ink-soft">{c.visits} visites</span>
          </div>
          <p className="mt-1 text-[12px] text-ink-soft">Dernière : {c.lastService} · Préf. : {c.preference}</p>
          <p className="mt-1.5 rounded-xl bg-creme/60 px-3 py-1.5 text-[12px] text-ink">📝 {c.note}</p>
        </div>
      ))}
    </div>
  );
}

/* ─── Équipe / collaborateurs ───────────────────────────── */
function Equipe() {
  const [team, setTeam] = useState(["Vous (admin)", "Sarah — Lash artist"]);
  const [name, setName] = useState("");
  return (
    <div className="space-y-4">
      <Card title="Collaboratrices">
        <div className="space-y-2">
          {team.map((m, i) => (
            <div key={m} className="flex items-center gap-3 rounded-xl bg-creme/50 px-3 py-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-rose to-or-rose text-xs font-bold text-ink">
                {m.split(" ").map((w) => w[0]).slice(0, 2).join("")}
              </span>
              <span className="flex-1 text-sm font-semibold text-ink">{m}</span>
              <span className="text-[11px] text-ink-soft">{i === 0 ? "Tous accès" : "Agenda perso"}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nom de la collaboratrice"
            className="flex-1 rounded-full border border-line bg-creme/50 px-4 py-2.5 text-sm outline-none focus:border-or-rose focus:bg-blanc" />
          <button onClick={() => { if (name.trim()) { setTeam([...team, name.trim()]); setName(""); } }}
            className="rounded-full bg-ink px-4 py-2.5 text-sm font-bold text-blanc">Ajouter</button>
        </div>
        <p className="mt-2 text-[11px] text-ink-soft">Chaque collaboratrice a son agenda ; les données des autres restent privées.</p>
      </Card>
    </div>
  );
}

/* ─── petits composants ─────────────────────────────────── */
function Stat({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="rounded-2xl border border-line bg-blanc/70 p-3.5 text-center">
      <p className="font-display text-2xl font-bold text-ink">{value}</p>
      <p className="text-[11px] text-ink-soft">{label}</p>
    </div>
  );
}
function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-line bg-blanc/70 p-4">
      <h2 className="mb-3 font-display text-lg font-semibold text-ink">{title}</h2>
      {children}
    </section>
  );
}
