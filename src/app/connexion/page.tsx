"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { Field } from "@/components/Field";

export default function ConnexionPage() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");

  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-md flex-col justify-center px-6 pb-32 pt-10">
      <Link href="/" className="mb-8 text-center font-display text-4xl font-bold text-gradient-gold">
        Shaymae
      </Link>
      <div className="rounded-[2rem] border border-white/60 bg-blanc/85 p-6 shadow-soft">
        <h1 className="font-display text-3xl font-semibold text-ink">Bon retour ✨</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Connectez-vous pour retrouver vos inspirations et réservations.
        </p>

        <form
          className="mt-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            signIn(email);
            router.push("/");
          }}
        >
          <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="vous@email.com" required />
          <Field label="Mot de passe" type="password" value="" onChange={() => {}} placeholder="••••••••" />
          <button className="w-full rounded-full bg-gradient-to-r from-rose-deep to-or-rose py-3.5 text-sm font-bold text-white shadow-soft">
            Se connecter
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-ink-soft">
          Pas encore de compte ?{" "}
          <Link href="/inscription" className="font-bold text-ink underline">
            Créer un compte
          </Link>
        </p>
      </div>
      <p className="mt-4 text-center text-[11px] text-ink-soft">
        Démo — l&apos;authentification est simulée localement, aucune donnée n&apos;est envoyée.
      </p>
    </div>
  );
}
