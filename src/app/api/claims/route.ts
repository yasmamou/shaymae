import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { claims, creators } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";

// La personne indique « ce profil m'appartient » → crée une demande de revendication.
export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Connectez-vous pour revendiquer ce profil" }, { status: 401 });
  const { creatorSlug, note } = await req.json();
  if (!creatorSlug) return NextResponse.json({ error: "creatorSlug requis" }, { status: 400 });

  const rows = await db.select({ slug: creators.slug, owner: creators.ownerUserId, name: creators.name })
    .from(creators).where(eq(creators.slug, creatorSlug)).limit(1);
  const creator = rows[0];
  if (!creator) return NextResponse.json({ error: "Profil introuvable" }, { status: 404 });
  if (creator.owner) return NextResponse.json({ error: "Ce profil est déjà rattaché à un compte." }, { status: 409 });

  const existing = await db.select().from(claims)
    .where(and(eq(claims.creatorSlug, creatorSlug), eq(claims.userId, user.id), eq(claims.status, "pending"))).limit(1);
  if (existing.length) return NextResponse.json({ claim: existing[0], already: true });

  const [row] = await db.insert(claims).values({ creatorSlug, userId: user.id, note: String(note ?? "") }).returning();
  return NextResponse.json({ claim: row });
}

// Statut de mes revendications (pour un slug donné en query, sinon toutes)
export async function GET(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ claims: [] });
  const slug = new URL(req.url).searchParams.get("slug");
  const rows = slug
    ? await db.select().from(claims).where(and(eq(claims.userId, user.id), eq(claims.creatorSlug, slug)))
    : await db.select().from(claims).where(eq(claims.userId, user.id));
  return NextResponse.json({ claims: rows });
}
