import { NextResponse } from "next/server";
import { and, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { creators, reservations } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";

const ALLOWED = ["en attente", "confirmé", "refusé", "annulé", "terminé", "absent"];

// La créatrice met à jour le statut d'une réservation reçue sur son profil.
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "creatrice") return NextResponse.json({ error: "auth" }, { status: 401 });
  const { id } = await params;
  const { status } = await req.json();
  if (!ALLOWED.includes(status)) return NextResponse.json({ error: "Statut invalide" }, { status: 400 });

  // slugs possédés par la créatrice
  const owned = await db.select({ slug: creators.slug }).from(creators).where(eq(creators.ownerUserId, user.id));
  const slugs = owned.map((o) => o.slug);
  if (!slugs.length) return NextResponse.json({ error: "Aucun profil" }, { status: 404 });

  const [row] = await db
    .update(reservations)
    .set({ status })
    .where(and(eq(reservations.id, id), inArray(reservations.creatorSlug, slugs)))
    .returning();

  if (!row) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  return NextResponse.json({ reservation: row });
}
