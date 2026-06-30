import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { follows } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ slugs: [] });
  const rows = await db.select().from(follows).where(eq(follows.userId, user.id));
  return NextResponse.json({ slugs: rows.map((r) => r.creatorSlug) });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "auth" }, { status: 401 });
  const { slug } = await req.json();
  if (!slug) return NextResponse.json({ error: "slug requis" }, { status: 400 });

  const existing = await db
    .select()
    .from(follows)
    .where(and(eq(follows.userId, user.id), eq(follows.creatorSlug, slug)))
    .limit(1);

  if (existing.length) {
    await db.delete(follows).where(and(eq(follows.userId, user.id), eq(follows.creatorSlug, slug)));
    return NextResponse.json({ following: false });
  }
  await db.insert(follows).values({ userId: user.id, creatorSlug: slug });
  return NextResponse.json({ following: true });
}
