import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { creators } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { DEFAULT_SERVICES, type CategoryKey } from "@/lib/data";

const slugify = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 40) || "studio";

async function ensureProfile(userId: string, user: { name: string; handle?: string | null; city?: string | null; categories?: CategoryKey[] | null; mode?: string | null }) {
  const owned = await db.select().from(creators).where(eq(creators.ownerUserId, userId)).limit(1);
  if (owned.length) return owned[0];

  let slug = slugify((user.handle ?? user.name).replace(/^@/, ""));
  const clash = await db.select({ slug: creators.slug }).from(creators).where(eq(creators.slug, slug)).limit(1);
  if (clash.length) slug = `${slug}-${userId.slice(0, 4)}`;

  const cats = (user.categories && user.categories.length ? user.categories : ["maquillage"]) as CategoryKey[];
  const base = cats[0];
  const seed = Math.abs(slug.charCodeAt(0) + slug.charCodeAt(slug.length - 1)) % 360;
  const [row] = await db.insert(creators).values({
    slug,
    ownerUserId: userId,
    name: user.name,
    handle: user.handle ?? "@" + slug,
    tagline: "Créatrice beauté",
    categories: cats,
    rating: 5.0,
    reviews: 0,
    city: user.city ?? "Montpellier",
    region: "Montpellier",
    mode: user.mode === "mobile" ? "mobile" : "salon",
    address: user.mode === "mobile" ? null : "Montpellier",
    zones: user.mode === "mobile" ? ["Montpellier"] : null,
    radiusKm: user.mode === "mobile" ? 15 : null,
    lat: 43.61, lng: 3.877,
    bio: "Bienvenue sur mon profil ✨",
    avatarSeed: seed, coverSeed: (seed * 7) % 360,
    verified: false,
    booking: ["instagram"],
    services: DEFAULT_SERVICES[base],
    gallery: [1, 2, 3, 4].map((n) => ({ id: `${slug}-m${n}`, category: base, seed: (seed + n * 37) % 360, label: "Réalisation" })),
    stories: [],
    reviewsList: [],
  }).returning();
  return row;
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== "creatrice") return NextResponse.json({ profile: null });
  const profile = await ensureProfile(user.id, user);
  return NextResponse.json({ profile });
}

export async function PUT(req: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "creatrice") return NextResponse.json({ error: "auth" }, { status: 401 });
  const profile = await ensureProfile(user.id, user);
  const b = await req.json();

  const [row] = await db.update(creators).set({
    name: b.name ?? profile.name,
    tagline: b.tagline ?? profile.tagline,
    bio: b.bio ?? profile.bio,
    city: b.city ?? profile.city,
    mode: b.mode === "mobile" ? "mobile" : b.mode === "salon" ? "salon" : profile.mode,
    address: b.address ?? profile.address,
    zones: b.zones ?? profile.zones,
    instagram: b.instagram ?? profile.instagram,
    whatsapp: b.whatsapp ?? profile.whatsapp,
    categories: Array.isArray(b.categories) && b.categories.length ? b.categories : profile.categories,
    services: Array.isArray(b.services) ? b.services : profile.services,
  }).where(eq(creators.slug, profile.slug)).returning();

  return NextResponse.json({ profile: row });
}
