import { notFound } from "next/navigation";
import Link from "next/link";
import { CREATORS, getCreator, categoryOf } from "@/lib/data";
import { Media, Avatar } from "@/lib/Media";
import { BookingButton } from "@/components/BookingButton";
import { SaveButton } from "@/components/SaveButton";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";

export function generateStaticParams() {
  return CREATORS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = getCreator(slug);
  if (!c) return {};
  return {
    title: `${c.name} · ${c.tagline} — Shaymae`,
    description: c.bio,
  };
}

export default async function ProPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const creator = getCreator(slug);
  if (!creator) notFound();

  const baSeed = creator.gallery.find((g) => g.beforeAfter);

  return (
    <div className="min-h-[100dvh] pb-32">
      {/* Cover */}
      <div className="relative">
        <Media
          category={creator.categories[0]}
          seed={creator.coverSeed}
          rounded=""
          glyph
          className="h-60 w-full"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/20 to-transparent" />
        <Link
          href="/carte"
          className="absolute left-4 top-[max(14px,env(safe-area-inset-top))] grid h-10 w-10 place-items-center rounded-full glass shadow-float text-ink"
          aria-label="Retour"
        >
          ←
        </Link>
        <div className="absolute right-4 top-[max(14px,env(safe-area-inset-top))]">
          <SaveButton id={"pro-" + creator.id} size={40} light />
        </div>
      </div>

      {/* En-tête profil */}
      <div className="relative -mt-12 px-5">
        <div className="rounded-[2rem] border border-white/60 bg-blanc/85 p-5 shadow-soft">
          <div className="flex items-start gap-4">
            <div className="-mt-12 shrink-0">
              <Avatar
                seed={creator.avatarSeed}
                category={creator.categories[0]}
                name={creator.name}
                size={84}
                ring
              />
            </div>
            <div className="min-w-0 flex-1 pt-1">
              <h1 className="flex items-center gap-1.5 font-display text-2xl font-bold text-ink">
                {creator.name}
                {creator.verified && <span className="text-sm">✅</span>}
              </h1>
              <p className="text-[13px] text-ink-soft">{creator.handle}</p>
              <p className="mt-0.5 text-[13px] font-medium text-ink">{creator.tagline}</p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="flex items-center gap-1 rounded-full bg-creme px-3 py-1.5 font-bold text-ink">
              ⭐ {creator.rating}
            </span>
            <span className="rounded-full bg-creme px-3 py-1.5 text-ink-soft">
              {creator.reviews} avis
            </span>
            <span className="rounded-full bg-creme px-3 py-1.5 text-ink-soft">
              {creator.mode === "mobile" ? "🚗 Se déplace" : "🏠 Salon"}
            </span>
          </div>

          {/* Localisation / zone */}
          <div className="mt-3 rounded-2xl bg-sauge/30 px-4 py-3 text-[13px] text-ink">
            {creator.mode === "salon" ? (
              <p>📍 <span className="font-semibold">{creator.address}</span></p>
            ) : (
              <div>
                <p className="font-semibold">🚗 Se déplace dans un rayon de {creator.radiusKm} km</p>
                <p className="mt-1 flex flex-wrap gap-1.5">
                  {creator.zones?.map((z) => (
                    <span key={z} className="rounded-full bg-blanc/80 px-2 py-0.5 text-[11px] font-medium">
                      {z}
                    </span>
                  ))}
                </p>
              </div>
            )}
          </div>

          <p className="mt-4 text-[14px] leading-relaxed text-ink-soft">{creator.bio}</p>

          <div className="mt-4 flex gap-2.5">
            <BookingButton creator={creator} className="flex-1 text-center" />
            {creator.instagram && (
              <a
                href={`https://instagram.com/${creator.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="grid place-items-center rounded-full glass border border-white/60 px-4 shadow-float"
                aria-label="Instagram"
              >
                📸
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Stories du jour */}
      {creator.stories.length > 0 && (
        <section className="px-5 pt-6">
          <h2 className="mb-3 font-display text-xl font-semibold text-ink">À la une</h2>
          <div className="no-scrollbar -mx-5 flex gap-3 overflow-x-auto px-5">
            {creator.stories.map((s) => (
              <div key={s.id} className="relative w-32 shrink-0 overflow-hidden rounded-2xl shadow-float">
                <Media category={s.category} seed={s.seed} rounded="" className="h-44 w-full" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/65 to-transparent" />
                <p className="absolute inset-x-2 bottom-2 text-[11px] font-medium text-white">
                  {s.caption}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Services */}
      <section className="px-5 pt-7">
        <h2 className="mb-3 font-display text-xl font-semibold text-ink">Prestations</h2>
        <div className="overflow-hidden rounded-3xl border border-line bg-blanc/70">
          {creator.services.map((s, i) => (
            <div
              key={s.name}
              className={`flex items-center gap-3 px-4 py-3.5 ${
                i > 0 ? "border-t border-line" : ""
              }`}
            >
              <div className="flex-1">
                <p className="flex items-center gap-2 text-sm font-semibold text-ink">
                  {s.name}
                  {s.popular && (
                    <span className="rounded-full bg-rose px-2 py-0.5 text-[9px] font-bold text-ink">
                      POPULAIRE
                    </span>
                  )}
                </p>
                <p className="text-[12px] text-ink-soft">⏱ {s.duration}</p>
              </div>
              <p className="font-display text-lg font-semibold text-ink">
                {s.price}.–
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Avant / Après */}
      {baSeed && (
        <section className="px-5 pt-7">
          <h2 className="mb-3 font-display text-xl font-semibold text-ink">
            Avant / Après
          </h2>
          <BeforeAfterSlider
            category={baSeed.category}
            seed={baSeed.seed}
            className="h-72 w-full"
          />
          <p className="mt-2 text-center text-[12px] text-ink-soft">
            Glissez le curseur ⇆ pour voir la transformation
          </p>
        </section>
      )}

      {/* Galerie */}
      <section className="px-5 pt-7">
        <h2 className="mb-3 font-display text-xl font-semibold text-ink">Galerie</h2>
        <div className="columns-2 gap-3 lg:columns-3">
          {creator.gallery.map((m, i) => (
            <div
              key={m.id}
              className="relative mb-3 break-inside-avoid overflow-hidden rounded-3xl shadow-float"
            >
              <Media
                category={m.category}
                seed={m.seed}
                rounded=""
                label={m.label}
                className={i % 2 === 0 ? "h-52 w-full" : "h-40 w-full"}
              />
              <div className="absolute right-2.5 top-2.5">
                <SaveButton id={"insp-" + m.id} size={32} light />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Avis */}
      <section className="px-5 pt-7">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-ink">Avis</h2>
          <span className="text-sm font-bold text-ink">⭐ {creator.rating} · {creator.reviews}</span>
        </div>
        <div className="flex flex-col gap-3">
          {creator.reviewsList.map((r, i) => (
            <div key={i} className="rounded-3xl border border-line bg-blanc/70 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-ink">{r.author}</p>
                <p className="text-[12px] text-ink-soft">{r.when}</p>
              </div>
              <p className="mt-0.5 text-sm">
                {"★".repeat(r.rating)}
                <span className="text-line">{"★".repeat(5 - r.rating)}</span>
              </p>
              <p className="mt-1.5 text-[14px] leading-relaxed text-ink-soft">{r.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Catégories */}
      <section className="px-5 pt-6">
        <div className="flex flex-wrap gap-2">
          {creator.categories.map((c) => {
            const cat = categoryOf(c);
            return (
              <span
                key={c}
                className="rounded-full border border-line bg-creme px-3 py-1.5 text-[12px] font-semibold text-ink-soft"
              >
                {cat.emoji} {cat.label}
              </span>
            );
          })}
        </div>
      </section>

      {/* CTA fixe réservation (mobile) */}
      <div className="pointer-events-none fixed inset-x-0 bottom-24 z-30 mx-auto w-full max-w-[480px] px-5 lg:hidden">
        <div className="pointer-events-auto flex items-center gap-3 rounded-full glass border border-white/60 p-2 pl-5 shadow-soft">
          <span className="flex-1 text-sm">
            <span className="font-bold text-ink">Dès {Math.min(...creator.services.map((s) => s.price))}.–</span>
            <span className="text-ink-soft"> · {creator.name}</span>
          </span>
          <BookingButton creator={creator} />
        </div>
      </div>
    </div>
  );
}
