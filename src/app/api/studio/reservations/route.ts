import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { creators, reservations } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";

// Réservations reçues par la créatrice connectée (sur son profil).
export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== "creatrice") return NextResponse.json({ reservations: [] });

  const owned = await db.select({ slug: creators.slug }).from(creators).where(eq(creators.ownerUserId, user.id)).limit(1);
  if (!owned.length) return NextResponse.json({ reservations: [] });

  const rows = await db
    .select()
    .from(reservations)
    .where(eq(reservations.creatorSlug, owned[0].slug))
    .orderBy(desc(reservations.date));
  return NextResponse.json({ reservations: rows, slug: owned[0].slug });
}
