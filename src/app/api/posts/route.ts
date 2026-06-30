import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ posts: [] });
  const rows = await db.select().from(posts).where(eq(posts.userId, user.id)).orderBy(desc(posts.createdAt));
  return NextResponse.json({ posts: rows });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "auth" }, { status: 401 });
  const b = await req.json();
  if (!b.label) return NextResponse.json({ error: "label requis" }, { status: 400 });

  const [row] = await db
    .insert(posts)
    .values({
      userId: user.id,
      category: String(b.category ?? "maquillage"),
      label: String(b.label),
      caption: String(b.caption ?? ""),
      seed: Number(b.seed) || 0,
    })
    .returning();
  return NextResponse.json({ post: row });
}
