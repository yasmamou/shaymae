"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getCreator, availabilityFor, type DaySlots } from "@/lib/data";
import { Avatar } from "@/lib/Media";
import { useBookings } from "@/components/BookingsProvider";
import { useAuth } from "@/components/AuthProvider";

export default function ReserverPage() {
  return (
    <Suspense fallback={<div className="grid min-h-[100dvh] place-items-center text-sm text-ink-soft">Chargement…</div>}>
      <ReserverInner />
    </Suspense>
  );
}

function ReserverInner() {
  const { slug } = useParams<{ slug: string }>();
  const search = useSearchParams();
  const router = useRouter();
  const creator = getCreator(slug);
  const { book } = useBookings();
  const { user } = useAuth();

  const [fromMs, setFromMs] = useState<number | null>(null);
  const [serviceIdx, setServiceIdx] = useState(0);
  const [date, setDate] = useState<string>("");
  const [slot, setSlot] = useState<string>("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [done, setDone] = useState<null | { date: string; slot: string }>(null);

  useEffect(() => {
    const d = new Date();
    setFromMs(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const presetService = search.get("service");
    if (presetServiceIndex(presetService, creator) >= 0)
      setServiceIdx(presetServiceIndex(presetService, creator));
    if (user) {
      const parts = (user.name ?? "").split(" ");
      setFirstName(parts[0] ?? "");
      setLastName(parts.slice(1).join(" "));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const days: DaySlots[] = useMemo(
    () => (creator && fromMs ? availabilityFor(creator, fromMs, 7) : []),
    [creator, fromMs]
  );

  if (!creator) {
    return (
      <div className="grid min-h-[100dvh] place-items-center px-8 text-center">
        <p className="text-ink-soft">Créatrice introuvable. <Link href="/carte" className="underline">Retour</Link></p>
      </div>
    );
  }

  const service = creator.services[serviceIdx];
  const deposit = Math.round(service.price * 0.3);
  const canConfirm = date && slot && firstName.trim() && phone.trim();

  if (done) {
    return (
      <div className="mx-auto flex min-h-[100dvh] max-w-md flex-col items-center justify-center px-6 pb-32 text-center">
        <span className="mb-3 text-6xl">🎉</span>
        <h1 className="font-display text-3xl font-semibold text-ink">Réservation confirmée</h1>
        <p className="mt-2 text-sm text-ink-soft">
          {service.name} chez <b>{creator.name}</b><br />
          {prettyDate(done.date)} à {done.slot}
        </p>
        <div className="mt-5 w-full rounded-3xl border border-line bg-blanc/80 p-4 text-left text-sm shadow-float">
          <Line label="Prestation" value={service.name} />
          <Line label="Durée" value={service.duration} />
          <Line label="Prix" value={`${service.price}.–`} />
          <Line label="Acompte versé" value={`${deposit}.– (simulé)`} />
          <Line label="Au nom de" value={`${firstName} ${lastName}`.trim()} />
        </div>
        <p className="mt-3 text-[12px] text-ink-soft">
          📩 Confirmation et rappel envoyés (simulé). Annulation gratuite jusqu&apos;à 24h avant.
        </p>
        <div className="mt-6 flex w-full flex-col gap-2.5">
          <Link href="/rendez-vous" className="rounded-full bg-gradient-to-r from-rose-deep to-or-rose py-3.5 text-sm font-bold text-white shadow-soft">
            Voir mes rendez-vous
          </Link>
          <button onClick={() => router.push(`/messages/${creator.slug}`)} className="rounded-full glass border border-white/60 py-3.5 text-sm font-bold text-ink shadow-float">
            Envoyer un message à {creator.name.split(" ")[0]}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-[100dvh] max-w-2xl px-5 pb-40 pt-[max(14px,env(safe-area-inset-top))]">
      <Link href={`/pro/${creator.slug}`} className="text-sm text-ink-soft">← Retour au profil</Link>

      <div className="mt-3 flex items-center gap-3 rounded-3xl border border-white/60 bg-blanc/80 p-4 shadow-float">
        <Avatar seed={creator.avatarSeed} category={creator.categories[0]} name={creator.name} size={48} ring />
        <div className="min-w-0">
          <h1 className="font-display text-xl font-bold text-ink">Réserver chez {creator.name}</h1>
          <p className="text-[12px] text-ink-soft">📍 {creator.city} · ⭐ {creator.rating} ({creator.reviews})</p>
        </div>
      </div>

      {/* 1. Prestation */}
      <Section step={1} title="Choisissez la prestation">
        <div className="flex flex-col gap-2">
          {creator.services.map((s, i) => (
            <button
              key={s.name}
              onClick={() => setServiceIdx(i)}
              className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition ${
                i === serviceIdx ? "border-or-rose bg-rose/30" : "border-line bg-blanc/60"
              }`}
            >
              <span className="flex-1">
                <span className="block text-sm font-bold text-ink">{s.name}</span>
                <span className="block text-[12px] text-ink-soft">⏱ {s.duration}</span>
              </span>
              <span className="font-display text-lg font-semibold text-ink">{s.price}.–</span>
            </button>
          ))}
        </div>
      </Section>

      {/* 2. Date & créneau */}
      <Section step={2} title="Choisissez un créneau">
        {!fromMs ? (
          <p className="text-sm text-ink-soft">Chargement des disponibilités…</p>
        ) : (
          <>
            <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
              {days.map((d) => {
                const dispo = d.slots.length > 0;
                return (
                  <button
                    key={d.date}
                    disabled={!dispo}
                    onClick={() => { setDate(d.date); setSlot(""); }}
                    className={`shrink-0 rounded-2xl border px-3.5 py-2 text-center transition ${
                      date === d.date ? "border-transparent bg-ink text-blanc"
                      : dispo ? "border-line bg-blanc/60 text-ink" : "border-line bg-creme/40 text-ink-soft opacity-50"
                    }`}
                  >
                    <span className="block text-[11px] font-semibold">{d.dayLabel}</span>
                    <span className="block text-[10px]">{dispo ? `${d.slots.length} dispo` : "Complet"}</span>
                  </button>
                );
              })}
            </div>
            {date && (
              <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
                {days.find((d) => d.date === date)?.slots.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSlot(s)}
                    className={`rounded-xl border py-2.5 text-sm font-semibold transition ${
                      slot === s ? "border-transparent bg-gradient-to-r from-rose-deep to-or-rose text-white" : "border-line bg-blanc/60 text-ink"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
            {date && !days.find((d) => d.date === date)?.slots.length && (
              <p className="mt-2 text-sm text-ink-soft">Aucun créneau ce jour.</p>
            )}
          </>
        )}
      </Section>

      {/* 3. Coordonnées */}
      <Section step={3} title="Vos coordonnées">
        <div className="grid grid-cols-2 gap-3">
          <Input label="Prénom" value={firstName} onChange={setFirstName} placeholder="Camille" />
          <Input label="Nom" value={lastName} onChange={setLastName} placeholder="Durand" />
        </div>
        <div className="mt-3">
          <Input label="Téléphone" value={phone} onChange={setPhone} placeholder="06 12 34 56 78" type="tel" />
        </div>
        <div className="mt-3 flex items-center gap-2 rounded-2xl bg-sauge/30 px-4 py-3 text-[13px] text-ink">
          💳 Acompte demandé : <b>{deposit}.–</b> <span className="text-ink-soft">(simulé · sécurise le créneau)</span>
        </div>
      </Section>

      {/* CTA sticky */}
      <div className="fixed inset-x-0 bottom-24 z-30 mx-auto w-full max-w-[480px] px-5 lg:bottom-5 lg:max-w-2xl lg:px-0">
        <button
          disabled={!canConfirm}
          onClick={() => {
            book({
              creatorSlug: creator.slug, creatorName: creator.name,
              serviceName: service.name, price: service.price, deposit,
              date, slot, firstName, lastName, phone,
            });
            setDone({ date, slot });
          }}
          className="flex w-full items-center justify-between rounded-full bg-gradient-to-r from-rose-deep to-or-rose px-5 py-4 text-sm font-bold text-white shadow-soft disabled:opacity-50 lg:mx-auto lg:max-w-md"
        >
          <span>{canConfirm ? `Confirmer · ${prettyShort(date)} ${slot}` : "Complétez votre réservation"}</span>
          <span>{service.price}.–</span>
        </button>
      </div>
    </div>
  );
}

function presetServiceIndex(name: string | null, creator: ReturnType<typeof getCreator>) {
  if (!name || !creator) return -1;
  return creator.services.findIndex((s) => s.name.toLowerCase() === name.toLowerCase());
}

function Section({ step, title, children }: { step: number; title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6">
      <h2 className="mb-3 flex items-center gap-2 font-display text-xl font-semibold text-ink">
        <span className="grid h-7 w-7 place-items-center rounded-full bg-ink text-[12px] font-bold text-blanc">{step}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function Input({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[12px] font-semibold text-ink">{label}</span>
      <input type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-line bg-creme/50 px-4 py-3 text-sm outline-none focus:border-or-rose focus:bg-blanc" />
    </label>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1 text-sm">
      <span className="text-ink-soft">{label}</span>
      <span className="font-semibold text-ink">{value}</span>
    </div>
  );
}

function prettyDate(iso: string) {
  const d = new Date(iso + "T00:00:00Z");
  return d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" });
}
function prettyShort(iso: string) {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00Z");
  return d.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", timeZone: "UTC" });
}
