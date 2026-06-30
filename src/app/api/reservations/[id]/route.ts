import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { reservations } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";

// Annuler une réservation (scopée à l'utilisateur courant)
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const { id } = await params;

  const [row] = await db
    .update(reservations)
    .set({ status: "annulé" })
    .where(and(eq(reservations.id, id), eq(reservations.userId, user.id)))
    .returning();

  if (!row) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  return NextResponse.json({ reservation: row });
}
