import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { claims, creators, users } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";

// Admin valide ou refuse une revendication.
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== "admin") return NextResponse.json({ error: "auth" }, { status: 403 });
  const { id } = await params;
  const { action } = await req.json();

  const rows = await db.select().from(claims).where(eq(claims.id, id)).limit(1);
  const claim = rows[0];
  if (!claim) return NextResponse.json({ error: "Introuvable" }, { status: 404 });

  if (action === "approve") {
    // rattache le profil au compte + passe le compte en créatrice
    await db.update(creators).set({ ownerUserId: claim.userId, verified: true }).where(eq(creators.slug, claim.creatorSlug));
    await db.update(users).set({ role: "creatrice" }).where(eq(users.id, claim.userId));
    await db.update(claims).set({ status: "approved" }).where(eq(claims.id, id));
    return NextResponse.json({ ok: true, status: "approved" });
  }
  if (action === "reject") {
    await db.update(claims).set({ status: "rejected" }).where(eq(claims.id, id));
    return NextResponse.json({ ok: true, status: "rejected" });
  }
  return NextResponse.json({ error: "Action invalide" }, { status: 400 });
}
