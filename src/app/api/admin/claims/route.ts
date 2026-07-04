import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { claims, creators, users } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== "admin") return NextResponse.json({ error: "auth" }, { status: 403 });

  const rows = await db
    .select({
      id: claims.id, creatorSlug: claims.creatorSlug, status: claims.status, note: claims.note, createdAt: claims.createdAt,
      creatorName: creators.name, userEmail: users.email, userName: users.name,
    })
    .from(claims)
    .leftJoin(creators, eq(claims.creatorSlug, creators.slug))
    .leftJoin(users, eq(claims.userId, users.id))
    .orderBy(desc(claims.createdAt));
  return NextResponse.json({ claims: rows });
}
