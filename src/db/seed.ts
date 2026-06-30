// Seed du catalogue (créatrices + formations) depuis les données mock.
// Lancer : npm run db:seed
import { db } from "./index";
import { creators as creatorsTable, formations as formationsTable } from "./schema";
import { CREATORS, FORMATIONS } from "../lib/data";

async function main() {
  console.log("→ Nettoyage du catalogue…");
  await db.delete(creatorsTable);
  await db.delete(formationsTable);

  console.log(`→ Insertion de ${CREATORS.length} créatrices…`);
  await db.insert(creatorsTable).values(
    CREATORS.map((c) => ({
      slug: c.slug,
      name: c.name,
      handle: c.handle,
      tagline: c.tagline,
      categories: c.categories,
      rating: c.rating,
      reviews: c.reviews,
      city: c.city,
      region: c.region,
      mode: c.mode,
      address: c.address ?? null,
      zones: c.zones ?? null,
      radiusKm: c.radiusKm ?? null,
      lat: c.lat,
      lng: c.lng,
      bio: c.bio,
      avatarSeed: c.avatarSeed,
      coverSeed: c.coverSeed,
      verified: c.verified ?? false,
      whatsapp: c.whatsapp ?? null,
      instagram: c.instagram ?? null,
      booking: c.booking,
      services: c.services,
      gallery: c.gallery,
      stories: c.stories,
      reviewsList: c.reviewsList,
    }))
  );

  console.log(`→ Insertion de ${FORMATIONS.length} formations…`);
  await db.insert(formationsTable).values(
    FORMATIONS.map((f) => ({
      slug: f.slug,
      title: f.title,
      trainer: f.trainer,
      base: f.base,
      city: f.city,
      region: f.region,
      durationDays: f.durationDays,
      price: f.price,
      rating: f.rating,
      reviews: f.reviews,
      level: f.level,
      certified: f.certified,
      seed: f.seed,
      program: f.program,
    }))
  );

  console.log("✅ Seed terminé.");
}

main().then(() => process.exit(0)).catch((e) => {
  console.error("❌ Seed échoué:", e);
  process.exit(1);
});
