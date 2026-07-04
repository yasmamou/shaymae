import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import * as schema from "./schema";
import type { Creator } from "@/lib/data";

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error("DATABASE_URL manquant. Lancez `vercel env pull` ou vérifiez .env.local.");
}

const sql = neon(url);
export const db = drizzle(sql, { schema });
export * as tables from "./schema";

/** Renvoie l'ownerUserId d'un profil (null si non revendiqué). */
export async function getCreatorOwner(slug: string): Promise<string | null> {
  const rows = await db.select({ owner: schema.creators.ownerUserId }).from(schema.creators).where(eq(schema.creators.slug, slug)).limit(1);
  return rows[0]?.owner ?? null;
}

/** Récupère une créatrice depuis la base et la mappe au type Creator. */
export async function getCreatorBySlug(slug: string): Promise<Creator | null> {
  const rows = await db.select().from(schema.creators).where(eq(schema.creators.slug, slug)).limit(1);
  const r = rows[0];
  if (!r) return null;
  return {
    id: r.slug,
    slug: r.slug,
    name: r.name,
    handle: r.handle,
    tagline: r.tagline,
    categories: r.categories,
    rating: r.rating,
    reviews: r.reviews,
    city: r.city,
    region: r.region as Creator["region"],
    mode: r.mode as Creator["mode"],
    address: r.address ?? undefined,
    zones: r.zones ?? undefined,
    radiusKm: r.radiusKm ?? undefined,
    lat: r.lat,
    lng: r.lng,
    bio: r.bio,
    avatarSeed: r.avatarSeed,
    coverSeed: r.coverSeed,
    verified: r.verified ?? false,
    whatsapp: r.whatsapp ?? undefined,
    instagram: r.instagram ?? undefined,
    booking: r.booking,
    services: r.services,
    gallery: r.gallery,
    stories: r.stories,
    reviewsList: r.reviewsList,
  };
}
