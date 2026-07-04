import { NextResponse } from "next/server";
import { and, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { creators, reservations } from "@/db/schema";
import { computeSlots, DEFAULT_AVAILABILITY } from "@/lib/availability";

// Créneaux disponibles publics d'une créatrice (config − réservations qui tiennent le créneau).
export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const days = Math.min(21, Math.max(1, Number(new URL(req.url).searchParams.get("days")) || 14));

  const rows = await db.select({ availability: creators.availability }).from(creators).where(eq(creators.slug, slug)).limit(1);
  const av = rows[0]?.availability ?? DEFAULT_AVAILABILITY;

  const held = await db
    .select({ date: reservations.date, slot: reservations.slot })
    .from(reservations)
    .where(and(eq(reservations.creatorSlug, slug), inArray(reservations.status, ["en attente", "confirmé"])));
  const booked = new Set(held.map((r) => `${r.date}|${r.slot}`));

  const d = new Date();
  const fromMs = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  return NextResponse.json({ days: computeSlots(av, fromMs, days, booked) });
}
