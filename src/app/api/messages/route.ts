import { NextResponse } from "next/server";
import { and, asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { messages } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";

// GET /api/messages           → toutes les conversations de l'utilisateur
// GET /api/messages?slug=xxx  → fil d'une conversation
export async function GET(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ messages: [] });
  const slug = new URL(req.url).searchParams.get("slug");

  if (slug) {
    const rows = await db
      .select()
      .from(messages)
      .where(and(eq(messages.userId, user.id), eq(messages.creatorSlug, slug)))
      .orderBy(asc(messages.createdAt));
    return NextResponse.json({ messages: rows });
  }
  const rows = await db
    .select()
    .from(messages)
    .where(eq(messages.userId, user.id))
    .orderBy(asc(messages.createdAt));
  return NextResponse.json({ messages: rows });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "auth" }, { status: 401 });
  const b = await req.json();
  if (!b.creatorSlug) return NextResponse.json({ error: "creatorSlug requis" }, { status: 400 });

  const [row] = await db
    .insert(messages)
    .values({
      userId: user.id,
      creatorSlug: String(b.creatorSlug),
      fromMe: b.fromMe !== false,
      text: String(b.text ?? ""),
      kind: b.kind === "photo" ? "photo" : "text",
      seed: b.seed ?? null,
    })
    .returning();
  return NextResponse.json({ message: row });
}
