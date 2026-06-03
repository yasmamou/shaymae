"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth, type Role } from "@/components/AuthProvider";
import { CATEGORIES, type CategoryKey } from "@/lib/data";
import { Field } from "@/components/Field";

export default function InscriptionPage() {
  const { signUp } = useAuth();
  const router = useRouter();
  const [role, setRole] = useState<Role>("cliente");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("Montpellier");
  const [handle, setHandle] = useState("");
  const [mode, setMode] = useState<"salon" | "mobile">("salon");
  const [cats, setCats] = useState<CategoryKey[]>([]);

  const toggleCat = (k: CategoryKey) =>
    setCats((p) => (p.includes(k) ? p.filter((x) => x !== k) : [...p, k]));

  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-md flex-col justify-center px-6 pb-32 pt-10">
      <Link href="/" className="mb-6 text-center font-display text-4xl font-bold text-gradient-gold">
        Shaymae
      </Link>
      <div className="rounded-[2rem] border border-white/60 bg-blanc/85 p-6 shadow-soft">
        <h1 className="font-display text-3xl font-semibold text-ink">Créer un compte</h1>
        <p className="mt-1 text-sm text-ink-soft">Rejoignez la communauté beauté Shaymae.</p>

        {/* Choix du rôle */}
        <div className="mt-5 grid grid-cols-2 gap-2.5">
          {(
            [
              { k: "cliente", title: "Je suis cliente", desc: "Découvrir & réserver", emoji: "💗" },
              { k: "creatrice", title: "Je suis créatrice", desc: "Publier & être réservée", emoji: "✨" },
            ] as const
          ).map((r) => (
            <button
              key={r.k}
              type="button"
              onClick={() => setRole(r.k)}
              className={`rounded-2xl border p-3.5 text-left transition ${
                role === r.k
                  ? "border-transparent bg-gradient-to-br from-rose to-or-rose/70 shadow-float"
                  : "border-line bg-creme/40"
              }`}
            >
              <span className="text-xl">{r.emoji}</span>
              <p className="mt-1 text-sm font-bold text-ink">{r.title}</p>
              <p className="text-[11px] text-ink-soft">{r.desc}</p>
            </button>
          ))}
        </div>

        <form
          className="mt-5 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            signUp({
              name,
              email,
              role,
              city,
              ...(role === "creatrice"
                ? { handle: handle || "@" + name.toLowerCase().replace(/\s/g, ""), categories: cats, mode }
                : {}),
            });
            router.push(role === "creatrice" ? "/studio" : "/");
          }}
        >
          <Field label={role === "creatrice" ? "Nom / Nom du studio" : "Prénom"} value={name} onChange={setName} placeholder={role === "creatrice" ? "Sarah Beauty" : "Camille"} required />
          <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="vous@email.com" required />
          <Field label="Mot de passe" type="password" value="" onChange={() => {}} placeholder="••••••••" />
          <Field label="Ville" value={city} onChange={setCity} placeholder="Montpellier" />

          {role === "creatrice" && (
            <>
              <Field label="Identifiant public" value={handle} onChange={setHandle} placeholder="@sarah.beauty" />
              <div>
                <span className="mb-1.5 block text-[12px] font-semibold text-ink">Spécialités</span>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c.key}
                      type="button"
                      onClick={() => toggleCat(c.key)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                        cats.includes(c.key)
                          ? "border-transparent bg-ink text-blanc"
                          : "border-line bg-blanc/60 text-ink-soft"
                      }`}
                    >
                      {c.emoji} {c.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <span className="mb-1.5 block text-[12px] font-semibold text-ink">Mode</span>
                <div className="flex gap-2">
                  {(["salon", "mobile"] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMode(m)}
                      className={`flex-1 rounded-2xl border px-3 py-2.5 text-sm font-semibold transition ${
                        mode === m ? "border-transparent bg-ink text-blanc" : "border-line bg-creme/40 text-ink-soft"
                      }`}
                    >
                      {m === "salon" ? "🏠 Salon" : "🚗 Je me déplace"}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <button className="w-full rounded-full bg-gradient-to-r from-rose-deep to-or-rose py-3.5 text-sm font-bold text-white shadow-soft">
            {role === "creatrice" ? "Créer mon espace créatrice" : "Créer mon compte"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-ink-soft">
          Déjà inscrite ?{" "}
          <Link href="/connexion" className="font-bold text-ink underline">
            Se connecter
          </Link>
        </p>
      </div>
      <p className="mt-4 text-center text-[11px] text-ink-soft">
        Démo — données simulées localement, aucun serveur.
      </p>
    </div>
  );
}
