import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { hashPassword, createSession, findUserByEmail, toPublic } from "@/lib/auth";
import type { CategoryKey } from "@/lib/data";

export async function POST(req: Request) {
  let body: {
    email?: string; password?: string; name?: string; role?: string;
    city?: string; handle?: string; categories?: CategoryKey[]; mode?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  const password = body.password ?? "";
  const name = (body.name ?? "").trim();

  if (!email || !email.includes("@")) return NextResponse.json({ error: "Email invalide" }, { status: 400 });
  if (password.length < 6) return NextResponse.json({ error: "Mot de passe trop court (min. 6 caractères)" }, { status: 400 });
  if (!name) return NextResponse.json({ error: "Nom requis" }, { status: 400 });

  if (await findUserByEmail(email)) {
    return NextResponse.json({ error: "Un compte existe déjà avec cet email" }, { status: 409 });
  }

  const role = body.role === "creatrice" ? "creatrice" : "cliente";
  const passwordHash = await hashPassword(password);

  const [user] = await db
    .insert(users)
    .values({
      email, passwordHash, name, role,
      city: body.city ?? null,
      handle: role === "creatrice" ? body.handle ?? null : null,
      categories: role === "creatrice" ? body.categories ?? [] : null,
      mode: role === "creatrice" ? body.mode ?? "salon" : null,
    })
    .returning();

  await createSession(user.id);
  return NextResponse.json({ user: toPublic(user) });
}
