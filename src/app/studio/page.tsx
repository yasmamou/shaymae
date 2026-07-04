"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { CATEGORIES, type CategoryKey, type Service } from "@/lib/data";
import { DAY_LABELS_FR, type Availability, type DayKey, DEFAULT_AVAILABILITY } from "@/lib/availability";
import { Media, Avatar } from "@/lib/Media";

type Tab = "apercu" | "demandes" | "agenda" | "dispos" | "profil" | "publications" | "clientes";

const TABS: { key: Tab; label: string }[] = [
  { key: "apercu", label: "Aperçu" },
  { key: "demandes", label: "Demandes" },
  { key: "agenda", label: "Agenda" },
  { key: "dispos", label: "Disponibilités" },
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
  firstName: string; lastName: string | null; phone: string | null; status: string;
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

  const patchStatus = async (id: string, status: string) => {
    setResas((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    await fetch(`/api/studio/reservations/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
  };

  if (!ready) return null;

  if (!user || user.role !== "creatrice") {
    return (
      <div className="mx-auto flex min-h-[100dvh] max-w-md flex-col items-center justify-center px-8 pb-32 text-center">
        <span className="mb-4 text-6xl">✨</span>
        <h1 className="font-display text-3xl font-semibold text-ink">Espace créatrice</h1>
        <p className="mt-2 max-w-xs text-sm text-ink-soft">Connectez-vous en tant que créatrice pour gérer votre activité : rendez-vous, planning, profil.</p>
        <div className="mt-6 flex w-full max-w-xs flex-col gap-2.5">
          <Link href="/inscription" className="rounded-full bg-gradient-to-r from-rose-deep to-or-rose py-3.5 text-sm font-bold text-white shadow-soft">Devenir créatrice Shaymae</Link>
          <Link href="/connexion" className="rounded-full glass border border-white/60 py-3.5 text-sm font-bold text-ink shadow-float">J&apos;ai déjà un compte</Link>
        </div>
      </div>
    );
  }

  const pending = resas.filter((r) => r.status === "en attente").length;

  return (
    <div className="mx-auto min-h-[100dvh] max-w-4xl px-5 pb-32 pt-[max(16px,env(safe-area-inset-top))]">
      <div className="flex items-center gap-4 rounded-[2rem] border border-white/60 bg-blanc/85 p-5 shadow-soft">
        <Avatar seed={20} category={user.categories?.[0] ?? "maquillage"} name={user.name} size={60} ring />
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-or-rose">Espace créatrice</p>
          <h1 className="truncate font-display text-2xl font-bold text-ink">{user.name}</h1>
          {profile && <Link href={`/pro/${profile.slug}`} className="text-[12px] font-semibold text-ink-soft underline">Voir ma page publique →</Link>}
        </div>
        <button onClick={signOut} className="rounded-full border border-line px-3 py-1.5 text-[11px] font-semibold text-ink-soft">Déconnexion</button>
      </div>

      <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto">
        {TABS.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`relative shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${tab === t.key ? "bg-ink text-blanc shadow-float" : "bg-blanc/60 text-ink-soft"}`}>
            {t.label}
            {t.key === "demandes" && pending > 0 && (
              <span className="ml-1.5 rounded-full bg-rose-deep px-1.5 py-0.5 text-[10px] font-bold text-white">{pending}</span>
            )}
          </button>
        ))}
      </div>

      <div className="mt-5">
        {tab === "apercu" && <Apercu resas={resas} onGo={setTab} pending={pending} />}
        {tab === "demandes" && <Demandes resas={resas} patch={patchStatus} />}
        {tab === "agenda" && <Agenda resas={resas} />}
        {tab === "dispos" && <Dispos />}
        {tab === "profil" && <Profil profile={profile} onSaved={setProfile} />}
        {tab === "publications" && <Publications />}
        {tab === "clientes" && <Clientes resas={resas} />}
      </div>
    </div>
  );
}

/* ── Aperçu ── */
function Apercu({ resas, onGo, pending }: { resas: Resa[]; onGo: (t: Tab) => void; pending: number }) {
  const active = resas.filter((r) => r.status === "confirmé");
  const done = resas.filter((r) => r.status === "terminé");
  const ca = [...active, ...done].reduce((s, r) => s + r.price, 0);
  const lost = resas.filter((r) => ["annulé", "refusé", "absent"].includes(r.status)).length;
  const cancelRate = resas.length ? Math.round((lost / resas.length) * 100) : 0;
  const byService = new Map<string, number>();
  [...active, ...done].forEach((r) => byService.set(r.serviceName, (byService.get(r.serviceName) ?? 0) + 1));
  const top = [...byService.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3);
  const max = top[0]?.[1] ?? 1;

  return (
    <div className="space-y-5">
      {pending > 0 && (
        <button onClick={() => onGo("demandes")} className="flex w-full items-center justify-between rounded-2xl bg-gradient-to-r from-rose-deep to-or-rose px-4 py-3 text-left text-white shadow-float">
          <span className="text-sm font-bold">🔔 {pending} demande{pending > 1 ? "s" : ""} de RDV en attente</span>
          <span className="text-sm font-bold">Traiter →</span>
        </button>
      )}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat value={active.length} label="RDV à venir" />
        <Stat value={pending} label="En attente" />
        <Stat value={`${ca}.–`} label="CA (confirmé)" />
        <Stat value={`${cancelRate}%`} label="Annulation" />
      </div>
      <Card title="Prestations les plus demandées">
        {top.length === 0 ? (
          <p className="text-sm text-ink-soft">Pas encore de réservation confirmée. Partagez votre profil pour recevoir vos premières demandes ✨</p>
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
    </div>
  );
}

/* ── Demandes de RDV ── */
function Demandes({ resas, patch }: { resas: Resa[]; patch: (id: string, s: string) => void }) {
  const pending = resas.filter((r) => r.status === "en attente");
  const confirmed = resas.filter((r) => r.status === "confirmé");
  return (
    <div className="space-y-6">
      <section>
        <h2 className="mb-3 font-display text-lg font-semibold text-ink">À confirmer {pending.length > 0 && <span className="text-ink-soft">({pending.length})</span>}</h2>
        {pending.length === 0 ? (
          <p className="rounded-3xl border border-dashed border-line bg-blanc/50 p-6 text-center text-sm text-ink-soft">Aucune demande en attente 🎉</p>
        ) : (
          <div className="space-y-3">
            {pending.map((r) => (
              <ResaCard key={r.id} r={r}>
                <button onClick={() => patch(r.id, "confirmé")} className="flex-1 rounded-full bg-gradient-to-r from-rose-deep to-or-rose py-2.5 text-[13px] font-bold text-white">✓ Confirmer</button>
                <button onClick={() => patch(r.id, "refusé")} className="rounded-full border border-line px-4 py-2.5 text-[13px] font-semibold text-ink-soft">Refuser</button>
              </ResaCard>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 font-display text-lg font-semibold text-ink">RDV confirmés</h2>
        {confirmed.length === 0 ? (
          <p className="rounded-3xl border border-dashed border-line bg-blanc/50 p-6 text-center text-sm text-ink-soft">Aucun RDV confirmé pour le moment.</p>
        ) : (
          <div className="space-y-3">
            {confirmed.map((r) => (
              <ResaCard key={r.id} r={r}>
                <button onClick={() => patch(r.id, "terminé")} className="flex-1 rounded-full bg-sauge/70 py-2.5 text-[13px] font-bold text-ink">✓ Terminé</button>
                <button onClick={() => patch(r.id, "absent")} className="rounded-full border border-line px-4 py-2.5 text-[13px] font-semibold text-ink-soft">Absente</button>
                <button onClick={() => patch(r.id, "annulé")} className="rounded-full border border-line px-4 py-2.5 text-[13px] font-semibold text-ink-soft">Annuler</button>
              </ResaCard>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function ResaCard({ r, children }: { r: Resa; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-line bg-blanc/80 p-4 shadow-float">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-bold text-ink">{r.firstName} {r.lastName ?? ""}</p>
          <p className="text-[12px] text-ink-soft">{r.serviceName} · {r.price}.–</p>
          <p className="text-[12px] text-ink-soft">📅 {prettyDate(r.date)} · {r.slot}{r.phone ? ` · 📞 ${r.phone}` : ""}</p>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2">{children}</div>
    </div>
  );
}

/* ── Agenda ── */
function Agenda({ resas }: { resas: Resa[] }) {
  const kept = resas.filter((r) => ["confirmé", "terminé"].includes(r.status));
  const byDate = new Map<string, Resa[]>();
  kept.forEach((r) => { const a = byDate.get(r.date) ?? []; a.push(r); byDate.set(r.date, a); });
  const dates = [...byDate.keys()].sort();
  if (kept.length === 0) return <p className="rounded-3xl border border-dashed border-line bg-blanc/50 p-8 text-center text-sm text-ink-soft">Aucun RDV confirmé. Confirmez vos demandes pour les voir apparaître dans l&apos;agenda.</p>;
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {dates.map((d) => (
        <div key={d} className="rounded-2xl border border-line bg-blanc/70 p-3">
          <p className="mb-2 text-[12px] font-bold text-ink">{prettyDate(d)}</p>
          <div className="space-y-1.5">
            {byDate.get(d)!.sort((a, b) => a.slot.localeCompare(b.slot)).map((r) => (
              <div key={r.id} className="rounded-xl bg-rose/40 px-2.5 py-1.5">
                <p className="text-[12px] font-bold text-ink">{r.slot} · {r.firstName}</p>
                <p className="text-[11px] text-ink-soft">{r.serviceName} · {r.price}.–</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Disponibilités / planning ── */
function Dispos() {
  const [av, setAv] = useState<Availability | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [blockDate, setBlockDate] = useState("");
  useEffect(() => { fetch("/api/studio/availability").then((r) => r.json()).then((d) => setAv(d.availability ?? DEFAULT_AVAILABILITY)).catch(() => {}); }, []);
  if (!av) return <p className="text-sm text-ink-soft">Chargement…</p>;

  const days: DayKey[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
  const save = async () => {
    setSaving(true); setSaved(false);
    const res = await fetch("/api/studio/availability", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(av) });
    setSaving(false);
    if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 2000); }
  };

  return (
    <div className="space-y-4">
      <Card title="Jours travaillés">
        <div className="flex flex-wrap gap-2">
          {days.map((d) => (
            <button key={d} onClick={() => setAv({ ...av, days: { ...av.days, [d]: !av.days[d] } })}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${av.days[d] ? "border-transparent bg-ink text-blanc" : "border-line bg-blanc/60 text-ink-soft"}`}>
              {DAY_LABELS_FR[d]}
            </button>
          ))}
        </div>
      </Card>
      <Card title="Horaires">
        <div className="flex items-center gap-3">
          <label className="flex-1"><span className="mb-1 block text-[12px] font-semibold text-ink">Ouverture</span>
            <input type="time" value={av.from} onChange={(e) => setAv({ ...av, from: e.target.value })} className="w-full rounded-2xl border border-line bg-creme/50 px-3 py-2.5 text-sm outline-none focus:border-or-rose" /></label>
          <label className="flex-1"><span className="mb-1 block text-[12px] font-semibold text-ink">Fermeture</span>
            <input type="time" value={av.to} onChange={(e) => setAv({ ...av, to: e.target.value })} className="w-full rounded-2xl border border-line bg-creme/50 px-3 py-2.5 text-sm outline-none focus:border-or-rose" /></label>
        </div>
        <div className="mt-3">
          <span className="mb-1.5 block text-[12px] font-semibold text-ink">Durée d&apos;un créneau</span>
          <div className="flex gap-2">
            {[30, 60, 90, 120].map((m) => (
              <button key={m} onClick={() => setAv({ ...av, slotMinutes: m })} className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${av.slotMinutes === m ? "border-transparent bg-ink text-blanc" : "border-line bg-blanc/60 text-ink-soft"}`}>{m} min</button>
            ))}
          </div>
        </div>
      </Card>
      <Card title="Jours bloqués (congés)">
        <div className="flex items-center gap-2">
          <input type="date" value={blockDate} onChange={(e) => setBlockDate(e.target.value)} className="flex-1 rounded-2xl border border-line bg-creme/50 px-3 py-2.5 text-sm outline-none focus:border-or-rose" />
          <button onClick={() => { if (blockDate && !av.blocked.includes(blockDate)) { setAv({ ...av, blocked: [...av.blocked, blockDate].sort() }); setBlockDate(""); } }} className="rounded-full bg-ink px-4 py-2.5 text-sm font-bold text-blanc">Bloquer</button>
        </div>
        {av.blocked.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {av.blocked.map((d) => (
              <span key={d} className="flex items-center gap-1.5 rounded-full bg-creme px-3 py-1.5 text-[12px] font-semibold text-ink">
                {prettyDate(d)}
                <button onClick={() => setAv({ ...av, blocked: av.blocked.filter((x) => x !== d) })} className="text-ink-soft">✕</button>
              </span>
            ))}
          </div>
        )}
      </Card>
      <button onClick={save} disabled={saving} className="w-full rounded-full bg-gradient-to-r from-rose-deep to-or-rose py-3.5 text-sm font-bold text-white shadow-soft disabled:opacity-60">
        {saving ? "Enregistrement…" : saved ? "✅ Disponibilités enregistrées" : "Enregistrer mon planning"}
      </button>
      <p className="text-center text-[12px] text-ink-soft">Vos clientes ne pourront réserver que sur ces créneaux.</p>
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
  const setService = (i: number, patch: Partial<Service>) => set({ services: form.services.map((s, k) => (k === i ? { ...s, ...patch } : s)) });
  const save = async () => {
    setSaving(true); setSaved(false);
    const res = await fetch("/api/studio/profile", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const d = await res.json(); setSaving(false);
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
                <button key={m} onClick={() => set({ mode: m })} className={`flex-1 rounded-2xl border px-3 py-2.5 text-sm font-semibold ${form.mode === m ? "border-transparent bg-ink text-blanc" : "border-line bg-creme/40 text-ink-soft"}`}>{m === "salon" ? "🏠 Institut" : "🚗 Je me déplace"}</button>
              ))}
            </div>
          </div>
          {form.mode === "salon"
            ? <Inp label="Adresse" v={form.address ?? ""} on={(v) => set({ address: v })} />
            : <Inp label="Zones (virgules)" v={(form.zones ?? []).join(", ")} on={(v) => set({ zones: v.split(",").map((x) => x.trim()).filter(Boolean) })} />}
          <div>
            <span className="mb-1.5 block text-[12px] font-semibold text-ink">Spécialités</span>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => {
                const on = form.categories.includes(c.key);
                return <button key={c.key} onClick={() => set({ categories: on ? form.categories.filter((x) => x !== c.key) : [...form.categories, c.key] })} className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${on ? "border-transparent bg-ink text-blanc" : "border-line bg-blanc/60 text-ink-soft"}`}>{c.emoji} {c.label}</button>;
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
      <button onClick={save} disabled={saving} className="w-full rounded-full bg-gradient-to-r from-rose-deep to-or-rose py-3.5 text-sm font-bold text-white shadow-soft disabled:opacity-60">{saving ? "Enregistrement…" : saved ? "✅ Enregistré" : "Enregistrer mon profil"}</button>
    </div>
  );
}

/* ── Publications ── */
function Publications() {
  const { posts, addPost, removePost } = useAuth();
  const [cat, setCat] = useState<CategoryKey>("cils");
  const [label, setLabel] = useState("");
  const [caption, setCaption] = useState("");
  return (
    <div className="space-y-5">
      <Card title="Publier une réalisation">
        <div className="no-scrollbar mb-3 flex gap-2 overflow-x-auto">
          {CATEGORIES.map((c) => (<button key={c.key} onClick={() => setCat(c.key)} className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold ${cat === c.key ? "border-transparent bg-ink text-blanc" : "border-line bg-blanc/60 text-ink-soft"}`}>{c.emoji} {c.label}</button>))}
        </div>
        <div className="mb-3 overflow-hidden rounded-2xl shadow-float"><Media category={cat} seed={(label.length * 13 + caption.length) % 360} className="h-40 w-full" label={label || "Aperçu"} glyph={false} /></div>
        <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Titre" className="mb-2 w-full rounded-2xl border border-line bg-creme/50 px-4 py-3 text-sm outline-none focus:border-or-rose focus:bg-blanc" />
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

/* ── Clientes ── */
function Clientes({ resas }: { resas: Resa[] }) {
  const map = new Map<string, { name: string; visits: number; last: string }>();
  resas.filter((r) => ["confirmé", "terminé"].includes(r.status)).forEach((r) => {
    const key = `${r.firstName} ${r.lastName ?? ""}`.trim();
    const e = map.get(key) ?? { name: key, visits: 0, last: r.serviceName };
    e.visits++; map.set(key, e);
  });
  const clients = [...map.values()].sort((a, b) => b.visits - a.visits);
  if (clients.length === 0) return <p className="rounded-3xl border border-dashed border-line bg-blanc/50 p-8 text-center text-sm text-ink-soft">Vos clientes apparaîtront ici après des RDV confirmés.</p>;
  return (
    <div className="space-y-3">
      {clients.map((c) => (
        <div key={c.name} className="rounded-2xl border border-line bg-blanc/70 p-4">
          <p className="flex items-center gap-1.5 text-sm font-bold text-ink">{c.name || "Cliente"}{c.visits >= 3 && <span className="rounded-full bg-champagne/30 px-2 py-0.5 text-[10px] font-bold text-ink">⭐ Fidèle</span>}</p>
          <p className="mt-1 text-[12px] text-ink-soft">{c.visits} RDV · dernière : {c.last}</p>
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
  return d.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });
}
