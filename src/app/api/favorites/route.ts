import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { favorites } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ ids: [] });
  const rows = await db.select().from(favorites).where(eq(favorites.userId, user.id));
  return NextResponse.json({ ids: rows.map((r) => r.itemId) });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "auth" }, { status: 401 });
  const { itemId } = await req.json();
  if (!itemId) return NextResponse.json({ error: "itemId requis" }, { status: 400 });

  const existing = await db
    .select()
    .from(favorites)
    .where(and(eq(favorites.userId, user.id), eq(favorites.itemId, itemId)))
    .limit(1);

  if (existing.length) {
    await db.delete(favorites).where(and(eq(favorites.userId, user.id), eq(favorites.itemId, itemId)));
    return NextResponse.json({ saved: false });
  }
  await db.insert(favorites).values({ userId: user.id, itemId });
  return NextResponse.json({ saved: true });
}
