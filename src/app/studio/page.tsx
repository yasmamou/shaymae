"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { CATEGORIES, type CategoryKey, type Service } from "@/lib/data";
import { Media, Avatar } from "@/lib/Media";

type Tab = "apercu" | "agenda" | "profil" | "publications" | "clientes";

const TABS: { key: Tab; label: string }[] = [
  { key: "apercu", label: "Aperçu" },
  { key: "agenda", label: "Agenda" },
  { key: "profil", label: "Profil" },
  { key: "publications", label: "Publications" },
  { key: "clientes", label: "Clientes" },
];

interface ProProfile {
  slug: string; name: string; tagline: string; bio: string; city: string;
  mode: string; address: string | null; zones: string[] | null;
  instagram: string | null; whatsapp: string | null;
  categories: CategoryKey[]; services: Service[];
}
interface Resa {
  id: string; serviceName: string; price: number; date: string; slot: string;
  firstName: string; lastName: string | null; status: string;
}

export default function StudioPage() {
  const { user, ready, signOut } = useAuth();
  const [tab, setTab] = useState<Tab>("apercu");
  const [profile, setProfile] = useState<ProProfile | null>(null);
  const [resas, setResas] = useState<Resa[]>([]);

  useEffect(() => {
    if (!ready || !user || user.role !== "creatrice") return;
    fetch("/api/studio/profile").then((r) => r.json()).then((d) => d.profile && setProfile(d.profile)).catch(() => {});
    fetch("/api/studio/reservations").then((r) => r.json()).then((d) => setResas(d.reservations ?? [])).catch(() => {});
  }, [ready, user]);

  if (!ready) return null;

  if (!user || user.role !== "creatrice") {
    return (
      <div className="mx-auto flex min-h-[100dvh] max-w-md flex-col items-center justify-center px-8 pb-32 text-center">
        <span className="mb-4 text-6xl">✨</span>
        <h1 className="font-display text-3xl font-semibold text-ink">Espace créatrice</h1>
        <p className="mt-2 max-w-xs text-sm text-ink-soft">
          Connectez-vous en tant que créatrice pour gérer votre profil, votre agenda et vos publications.
        </p>
        <div className="mt-6 flex w-full max-w-xs flex-col gap-2.5">
          <Link href="/inscription" className="rounded-full bg-gradient-to-r from-rose-deep to-or-rose py-3.5 text-sm font-bold text-white shadow-soft">Devenir créatrice Shaymae</Link>
          <Link href="/connexion" className="rounded-full glass border border-white/60 py-3.5 text-sm font-bold text-ink shadow-float">J&apos;ai déjà un compte</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-[100dvh] max-w-4xl px-5 pb-32 pt-[max(16px,env(safe-area-inset-top))]">
      <div className="flex items-center gap-4 rounded-[2rem] border border-white/60 bg-blanc/85 p-5 shadow-soft">
        <Avatar seed={20} category={user.categories?.[0] ?? "maquillage"} name={user.name} size={60} ring />
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-or-rose">Espace créatrice</p>
          <h1 className="truncate font-display text-2xl font-bold text-ink">{user.name}</h1>
          {profile && (
            <Link href={`/pro/${profile.slug}`} className="text-[12px] font-semibold text-ink-soft underline">
              Voir ma page publique →
            </Link>
          )}
        </div>
        <button onClick={signOut} className="rounded-full border border-line px-3 py-1.5 text-[11px] font-semibold text-ink-soft">Déconnexion</button>
      </div>

      <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto">
        {TABS.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${tab === t.key ? "bg-ink text-blanc shadow-float" : "bg-blanc/60 text-ink-soft"}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-5">
        {tab === "apercu" && <Apercu resas={resas} />}
        {tab === "agenda" && <Agenda resas={resas} />}
        {tab === "profil" && <Profil profile={profile} onSaved={setProfile} />}
        {tab === "publications" && <Publications />}
        {tab === "clientes" && <Clientes resas={resas} />}
      </div>
    </div>
  );
}

/* ── Aperçu / stats (réelles) ── */
function Apercu({ resas }: { resas: Resa[] }) {
  const confirmed = resas.filter((r) => r.status !== "annulé");
  const ca = confirmed.reduce((s, r) => s + r.price, 0);
  const cancelRate = resas.length ? Math.round((resas.filter((r) => r.status === "annulé").length / resas.length) * 100) : 0;
  const byService = new Map<string, number>();
  confirmed.forEach((r) => byService.set(r.serviceName, (byService.get(r.serviceName) ?? 0) + 1));
  const top = [...byService.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3);
  const max = top[0]?.[1] ?? 1;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat value={confirmed.length} label="RDV confirmés" />
        <Stat value={`${ca}.–`} label="CA réservé" />
        <Stat value={resas.length} label="Demandes reçues" />
        <Stat value={`${cancelRate}%`} label="Taux d'annulation" />
      </div>
      <Card title="Prestations les plus demandées">
        {top.length === 0 ? (
          <p className="text-sm text-ink-soft">Pas encore de réservation. Partagez votre profil pour recevoir vos premières demandes ✨</p>
        ) : (
          <div className="space-y-2.5">
            {top.map(([name, n]) => (
              <div key={name}>
                <div className="mb-1 flex justify-between text-[13px]"><span className="font-semibold text-ink">{name}</span><span className="text-ink-soft">{n}</span></div>
                <div className="h-2 overflow-hidden rounded-full bg-creme"><div className="h-full rounded-full bg-gradient-to-r from-rose-deep to-or-rose" style={{ width: `${(n / max) * 100}%` }} /></div>
              </div>
            ))}
          </div>
        )}
      </Card>
      <p className="rounded-2xl bg-sauge/30 px-3 py-2 text-[12px] text-ink">🔔 Notifications auto (confirmation, rappel J-1, liste d&apos;attente) — bientôt par email/SMS.</p>
    </div>
  );
}

/* ── Agenda (réservations réelles) ── */
function Agenda({ resas }: { resas: Resa[] }) {
  const byDate = new Map<string, Resa[]>();
  resas.filter((r) => r.status !== "annulé").forEach((r) => {
    const arr = byDate.get(r.date) ?? [];
    arr.push(r);
    byDate.set(r.date, arr);
  });
  const dates = [...byDate.keys()].sort();

  if (resas.length === 0) {
    return <p className="rounded-3xl border border-dashed border-line bg-blanc/50 p-8 text-center text-sm text-ink-soft">Aucune réservation pour le moment. Vos RDV apparaîtront ici automatiquement.</p>;
  }
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {dates.map((d) => (
        <div key={d} className="rounded-2xl border border-line bg-blanc/70 p-3">
          <p className="mb-2 text-[12px] font-bold text-ink">{prettyDate(d)}</p>
          <div className="space-y-1.5">
            {byDate.get(d)!.sort((a, b) => a.slot.localeCompare(b.slot)).map((r) => (
              <div key={r.id} className="rounded-xl bg-rose/40 px-2.5 py-1.5">
                <p className="text-[12px] font-bold text-ink">{r.slot} · {r.firstName} {r.lastName ?? ""}</p>
                <p className="text-[11px] text-ink-soft">{r.serviceName} · {r.price}.–</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Profil éditable ── */
function Profil({ profile, onSaved }: { profile: ProProfile | null; onSaved: (p: ProProfile) => void }) {
  const [form, setForm] = useState<ProProfile | null>(profile);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  useEffect(() => setForm(profile), [profile]);
  if (!form) return <p className="text-sm text-ink-soft">Chargement du profil…</p>;

  const set = (patch: Partial<ProProfile>) => setForm({ ...form, ...patch });
  const setService = (i: number, patch: Partial<Service>) =>
    set({ services: form.services.map((s, k) => (k === i ? { ...s, ...patch } : s)) });

  const save = async () => {
    setSaving(true); setSaved(false);
    const res = await fetch("/api/studio/profile", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const d = await res.json();
    setSaving(false);
    if (d.profile) { onSaved(d.profile); setSaved(true); setTimeout(() => setSaved(false), 2000); }
  };

  return (
    <div className="space-y-4">
      <Card title="Ma page publique">
        <div className="space-y-3">
          <Inp label="Nom / studio" v={form.name} on={(v) => set({ name: v })} />
          <Inp label="Accroche" v={form.tagline} on={(v) => set({ tagline: v })} />
          <Txt label="Bio" v={form.bio} on={(v) => set({ bio: v })} />
          <div className="grid grid-cols-2 gap-3">
            <Inp label="Ville" v={form.city} on={(v) => set({ city: v })} />
            <Inp label="Instagram (pseudo)" v={form.instagram ?? ""} on={(v) => set({ instagram: v })} />
          </div>
          <Inp label="WhatsApp (indicatif inclus)" v={form.whatsapp ?? ""} on={(v) => set({ whatsapp: v })} />
          <div>
            <span className="mb-1.5 block text-[12px] font-semibold text-ink">Mode</span>
            <div className="flex gap-2">
              {(["salon", "mobile"] as const).map((m) => (
                <button key={m} onClick={() => set({ mode: m })} className={`flex-1 rounded-2xl border px-3 py-2.5 text-sm font-semibold ${form.mode === m ? "border-transparent bg-ink text-blanc" : "border-line bg-creme/40 text-ink-soft"}`}>
                  {m === "salon" ? "🏠 Institut" : "🚗 Je me déplace"}
                </button>
              ))}
            </div>
          </div>
          {form.mode === "salon" ? (
            <Inp label="Adresse" v={form.address ?? ""} on={(v) => set({ address: v })} />
          ) : (
            <Inp label="Zones (séparées par des virgules)" v={(form.zones ?? []).join(", ")} on={(v) => set({ zones: v.split(",").map((x) => x.trim()).filter(Boolean) })} />
          )}
          <div>
            <span className="mb-1.5 block text-[12px] font-semibold text-ink">Spécialités</span>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => {
                const on = form.categories.includes(c.key);
                return (
                  <button key={c.key} onClick={() => set({ categories: on ? form.categories.filter((x) => x !== c.key) : [...form.categories, c.key] })}
                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${on ? "border-transparent bg-ink text-blanc" : "border-line bg-blanc/60 text-ink-soft"}`}>
                    {c.emoji} {c.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </Card>

      <Card title="Mes prestations & tarifs">
        <div className="space-y-2">
          {form.services.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <input value={s.name} onChange={(e) => setService(i, { name: e.target.value })} className="min-w-0 flex-1 rounded-xl border border-line bg-creme/50 px-3 py-2 text-sm outline-none focus:border-or-rose" />
              <input value={s.duration} onChange={(e) => setService(i, { duration: e.target.value })} className="w-20 rounded-xl border border-line bg-creme/50 px-2 py-2 text-sm outline-none focus:border-or-rose" />
              <input type="number" value={s.price} onChange={(e) => setService(i, { price: Number(e.target.value) })} className="w-16 rounded-xl border border-line bg-creme/50 px-2 py-2 text-sm outline-none focus:border-or-rose" />
              <button onClick={() => set({ services: form.services.filter((_, k) => k !== i) })} className="text-ink-soft">🗑</button>
            </div>
          ))}
        </div>
        <button onClick={() => set({ services: [...form.services, { name: "Nouvelle prestation", duration: "1h", price: 50 }] })} className="mt-3 w-full rounded-full border border-line py-2.5 text-sm font-semibold text-ink-soft">+ Ajouter une prestation</button>
      </Card>

      <button onClick={save} disabled={saving} className="w-full rounded-full bg-gradient-to-r from-rose-deep to-or-rose py-3.5 text-sm font-bold text-white shadow-soft disabled:opacity-60">
        {saving ? "Enregistrement…" : saved ? "✅ Enregistré" : "Enregistrer mon profil"}
      </button>
    </div>
  );
}

/* ── Publications (DB) ── */
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
            <button key={c.key} onClick={() => setCat(c.key)} className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold ${cat === c.key ? "border-transparent bg-ink text-blanc" : "border-line bg-blanc/60 text-ink-soft"}`}>{c.emoji} {c.label}</button>
          ))}
        </div>
        <div className="mb-3 overflow-hidden rounded-2xl shadow-float">
          <Media category={cat} seed={(label.length * 13 + caption.length) % 360} className="h-40 w-full" label={label || "Aperçu"} glyph={false} />
        </div>
        <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Titre (ex. Volume russe glamour)" className="mb-2 w-full rounded-2xl border border-line bg-creme/50 px-4 py-3 text-sm outline-none focus:border-or-rose focus:bg-blanc" />
        <textarea value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Légende…" rows={2} className="mb-2 w-full resize-none rounded-2xl border border-line bg-creme/50 px-4 py-3 text-sm outline-none focus:border-or-rose focus:bg-blanc" />
        <button disabled={!label.trim()} onClick={() => { addPost({ category: cat, label: label.trim(), caption: caption.trim(), seed: (label.length * 13 + caption.length) % 360 }); setLabel(""); setCaption(""); }} className="w-full rounded-full bg-gradient-to-r from-rose-deep to-or-rose py-3 text-sm font-bold text-white shadow-soft disabled:opacity-50">Publier ✨</button>
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

/* ── Clientes (depuis les réservations) ── */
function Clientes({ resas }: { resas: Resa[] }) {
  const map = new Map<string, { name: string; visits: number; last: string }>();
  resas.forEach((r) => {
    const key = `${r.firstName} ${r.lastName ?? ""}`.trim();
    const e = map.get(key) ?? { name: key, visits: 0, last: r.serviceName };
    e.visits++; map.set(key, e);
  });
  const clients = [...map.values()].sort((a, b) => b.visits - a.visits);
  if (clients.length === 0) return <p className="rounded-3xl border border-dashed border-line bg-blanc/50 p-8 text-center text-sm text-ink-soft">Vos clientes apparaîtront ici après leurs réservations.</p>;
  return (
    <div className="space-y-3">
      {clients.map((c) => (
        <div key={c.name} className="rounded-2xl border border-line bg-blanc/70 p-4">
          <p className="flex items-center gap-1.5 text-sm font-bold text-ink">
            {c.name || "Cliente"}
            {c.visits >= 3 && <span className="rounded-full bg-champagne/30 px-2 py-0.5 text-[10px] font-bold text-ink">⭐ Fidèle</span>}
          </p>
          <p className="mt-1 text-[12px] text-ink-soft">{c.visits} réservation{c.visits > 1 ? "s" : ""} · dernière : {c.last}</p>
        </div>
      ))}
    </div>
  );
}

/* ── petits composants ── */
function Stat({ value, label }: { value: string | number; label: string }) {
  return <div className="rounded-2xl border border-line bg-blanc/70 p-3.5 text-center"><p className="font-display text-2xl font-bold text-ink">{value}</p><p className="text-[11px] text-ink-soft">{label}</p></div>;
}
function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="rounded-3xl border border-line bg-blanc/70 p-4"><h2 className="mb-3 font-display text-lg font-semibold text-ink">{title}</h2>{children}</section>;
}
function Inp({ label, v, on }: { label: string; v: string; on: (v: string) => void }) {
  return <label className="block"><span className="mb-1 block text-[12px] font-semibold text-ink">{label}</span><input value={v} onChange={(e) => on(e.target.value)} className="w-full rounded-2xl border border-line bg-creme/50 px-4 py-2.5 text-sm outline-none focus:border-or-rose focus:bg-blanc" /></label>;
}
function Txt({ label, v, on }: { label: string; v: string; on: (v: string) => void }) {
  return <label className="block"><span className="mb-1 block text-[12px] font-semibold text-ink">{label}</span><textarea value={v} onChange={(e) => on(e.target.value)} rows={3} className="w-full resize-none rounded-2xl border border-line bg-creme/50 px-4 py-2.5 text-sm outline-none focus:border-or-rose focus:bg-blanc" /></label>;
}
function prettyDate(iso: string) {
  const d = new Date(iso + "T00:00:00Z");
  return d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" });
}
