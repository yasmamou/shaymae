import "server-only";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { db } from "@/db";
import { users, sessions, type DbUser } from "@/db/schema";

const COOKIE = "shaymae_session";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 jours

// Emails ayant automatiquement le rôle admin (propriétaire de la plateforme).
export const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "yasmamou@hotmail.fr")
  .split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);

export const isAdminEmail = (email: string) => ADMIN_EMAILS.includes(email.toLowerCase());

export type PublicUser = Omit<DbUser, "passwordHash">;

export function toPublic(u: DbUser): PublicUser {
  // on retire le hash du mot de passe
  const { passwordHash: _omit, ...rest } = u;
  void _omit;
  return rest;
}

export async function hashPassword(pw: string) {
  return bcrypt.hash(pw, 10);
}
export async function verifyPassword(pw: string, hash: string) {
  return bcrypt.compare(pw, hash);
}

export async function createSession(userId: string) {
  const token = crypto.randomUUID() + crypto.randomUUID().replace(/-/g, "");
  const expiresAt = new Date(Date.now() + MAX_AGE * 1000);
  await db.insert(sessions).values({ token, userId, expiresAt });
  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
  return token;
}

export async function destroySession() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (token) {
    await db.delete(sessions).where(eq(sessions.token, token));
    jar.delete(COOKIE);
  }
}

export async function getCurrentUser(): Promise<PublicUser | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  const rows = await db
    .select()
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(eq(sessions.token, token))
    .limit(1);
  const row = rows[0];
  if (!row) return null;
  if (new Date(row.sessions.expiresAt).getTime() < Date.now()) {
    await db.delete(sessions).where(eq(sessions.token, token));
    return null;
  }
  return toPublic(row.users);
}

export async function findUserByEmail(email: string) {
  const rows = await db.select().from(users).where(eq(users.email, email.toLowerCase())).limit(1);
  return rows[0] ?? null;
}
