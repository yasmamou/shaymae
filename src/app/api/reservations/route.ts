import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { reservations } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ reservations: [] });
  const rows = await db
    .select()
    .from(reservations)
    .where(eq(reservations.userId, user.id))
    .orderBy(desc(reservations.createdAt));
  return NextResponse.json({ reservations: rows });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Connectez-vous pour réserver" }, { status: 401 });

  let b: Record<string, unknown>;
  try {
    b = await req.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }

  const required = ["creatorSlug", "creatorName", "serviceName", "date", "slot"];
  for (const k of required) {
    if (!b[k]) return NextResponse.json({ error: `Champ manquant: ${k}` }, { status: 400 });
  }

  const [row] = await db
    .insert(reservations)
    .values({
      userId: user.id,
      creatorSlug: String(b.creatorSlug),
      creatorName: String(b.creatorName),
      serviceName: String(b.serviceName),
      price: Number(b.price) || 0,
      deposit: Number(b.deposit) || 0,
      date: String(b.date),
      slot: String(b.slot),
      firstName: String(b.firstName ?? ""),
      lastName: b.lastName ? String(b.lastName) : null,
      phone: b.phone ? String(b.phone) : null,
      status: "en attente",
    })
    .returning();

  return NextResponse.json({ reservation: row });
}
