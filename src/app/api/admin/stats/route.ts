import { NextResponse } from "next/server";
import { count, eq, gt, isNotNull, sql } from "drizzle-orm";
import { db } from "@/db";
import { users, creators, reservations, messages, claims, sessions } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";

const c = async (q: Promise<{ n: number }[]>) => (await q)[0]?.n ?? 0;

export async function GET() {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== "admin") return NextResponse.json({ error: "auth" }, { status: 403 });

  const now = new Date();
  const [
    usersTotal, clientes, creatrices, admins,
    creatorsTotal, creatorsOwned,
    resaTotal, resaPending, resaConfirmed,
    msgTotal, claimsPending, activeSessions,
  ] = await Promise.all([
    c(db.select({ n: count() }).from(users)),
    c(db.select({ n: count() }).from(users).where(eq(users.role, "cliente"))),
    c(db.select({ n: count() }).from(users).where(eq(users.role, "creatrice"))),
    c(db.select({ n: count() }).from(users).where(eq(users.role, "admin"))),
    c(db.select({ n: count() }).from(creators)),
    c(db.select({ n: count() }).from(creators).where(isNotNull(creators.ownerUserId))),
    c(db.select({ n: count() }).from(reservations)),
    c(db.select({ n: count() }).from(reservations).where(eq(reservations.status, "en attente"))),
    c(db.select({ n: count() }).from(reservations).where(eq(reservations.status, "confirmé"))),
    c(db.select({ n: count() }).from(messages)),
    c(db.select({ n: count() }).from(claims).where(eq(claims.status, "pending"))),
    c(db.select({ n: count() }).from(sessions).where(gt(sessions.expiresAt, now))),
  ]);

  // 7 derniers jours d'inscriptions
  const signups7 = await db
    .select({ day: sql<string>`to_char(${users.createdAt}, 'YYYY-MM-DD')`, n: count() })
    .from(users)
    .groupBy(sql`to_char(${users.createdAt}, 'YYYY-MM-DD')`)
    .orderBy(sql`to_char(${users.createdAt}, 'YYYY-MM-DD') desc`)
    .limit(7);

  return NextResponse.json({
    users: { total: usersTotal, clientes, creatrices, admins },
    creators: { total: creatorsTotal, owned: creatorsOwned, unclaimed: creatorsTotal - creatorsOwned },
    reservations: { total: resaTotal, pending: resaPending, confirmed: resaConfirmed },
    messages: msgTotal,
    claimsPending,
    activeSessions,
    signups7: signups7.reverse(),
  });
}
