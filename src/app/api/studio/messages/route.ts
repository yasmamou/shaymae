import { NextResponse } from "next/server";
import { and, asc, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { creators, messages, users } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";

async function ownedSlugs(userId: string) {
  const rows = await db.select({ slug: creators.slug }).from(creators).where(eq(creators.ownerUserId, userId));
  return rows.map((r) => r.slug);
}

// Conversations reçues par la créatrice (groupées par cliente).
export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== "creatrice") return NextResponse.json({ conversations: [] });
  const slugs = await ownedSlugs(user.id);
  if (!slugs.length) return NextResponse.json({ conversations: [] });

  const rows = await db
    .select({
      id: messages.id, userId: messages.userId, creatorSlug: messages.creatorSlug,
      fromMe: messages.fromMe, text: messages.text, kind: messages.kind, seed: messages.seed,
      clientName: users.name,
    })
    .from(messages)
    .leftJoin(users, eq(messages.userId, users.id))
    .where(inArray(messages.creatorSlug, slugs))
    .orderBy(asc(messages.createdAt));

  const map = new Map<string, { key: string; clientUserId: string; clientName: string; creatorSlug: string; messages: typeof rows }>();
  for (const m of rows) {
    const key = `${m.userId}|${m.creatorSlug}`;
    const conv = map.get(key) ?? { key, clientUserId: m.userId, clientName: m.clientName ?? "Cliente", creatorSlug: m.creatorSlug, messages: [] as typeof rows };
    conv.messages.push(m);
    map.set(key, conv);
  }
  return NextResponse.json({ conversations: [...map.values()] });
}

// La créatrice répond (message « pro » dans le fil de la cliente).
export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "creatrice") return NextResponse.json({ error: "auth" }, { status: 401 });
  const { clientUserId, creatorSlug, text } = await req.json();
  if (!clientUserId || !creatorSlug || !text) return NextResponse.json({ error: "champs requis" }, { status: 400 });

  const slugs = await ownedSlugs(user.id);
  if (!slugs.includes(creatorSlug)) return NextResponse.json({ error: "non autorisé" }, { status: 403 });

  const [row] = await db.insert(messages).values({
    userId: clientUserId, creatorSlug, fromMe: false, text: String(text), kind: "text",
  }).returning();
  return NextResponse.json({ message: row });
}
