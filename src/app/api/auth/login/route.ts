import { NextResponse } from "next/server";
import { verifyPassword, createSession, findUserByEmail, toPublic } from "@/lib/auth";

export async function POST(req: Request) {
  let body: { email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }
  const email = (body.email ?? "").trim().toLowerCase();
  const password = body.password ?? "";

  const user = await findUserByEmail(email);
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return NextResponse.json({ error: "Email ou mot de passe incorrect" }, { status: 401 });
  }

  await createSession(user.id);
  return NextResponse.json({ user: toPublic(user) });
}
