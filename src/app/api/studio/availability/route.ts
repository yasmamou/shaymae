import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { creators } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { DEFAULT_AVAILABILITY, type Availability } from "@/lib/availability";

async function ownedSlug(userId: string) {
  const rows = await db.select({ slug: creators.slug, availability: creators.availability })
    .from(creators).where(eq(creators.ownerUserId, userId)).limit(1);
  return rows[0] ?? null;
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== "creatrice") return NextResponse.json({ availability: DEFAULT_AVAILABILITY });
  const row = await ownedSlug(user.id);
  return NextResponse.json({ availability: row?.availability ?? DEFAULT_AVAILABILITY });
}

export async function PUT(req: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "creatrice") return NextResponse.json({ error: "auth" }, { status: 401 });
  const row = await ownedSlug(user.id);
  if (!row) return NextResponse.json({ error: "Profil introuvable" }, { status: 404 });

  const b = (await req.json()) as Partial<Availability>;
  const av: Availability = {
    days: b.days ?? DEFAULT_AVAILABILITY.days,
    from: b.from ?? DEFAULT_AVAILABILITY.from,
    to: b.to ?? DEFAULT_AVAILABILITY.to,
    slotMinutes: b.slotMinutes ?? DEFAULT_AVAILABILITY.slotMinutes,
    blocked: Array.isArray(b.blocked) ? b.blocked : [],
  };
  await db.update(creators).set({ availability: av }).where(eq(creators.slug, row.slug));
  return NextResponse.json({ availability: av });
}
