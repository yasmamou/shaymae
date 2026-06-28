"use client";

import Link from "next/link";
import { useAuth } from "./AuthProvider";
import { Avatar } from "@/lib/Media";

/**
 * Action d'en-tête (mobile). Connectée → avatar vers le compte.
 * Déconnectée → cœur vers les favoris (la connexion vit uniquement dans l'onglet Compte).
 */
export function AccountButton() {
  const { user, ready } = useAuth();
  if (!ready) return <span className="h-10 w-10" />;

  if (user) {
    return (
      <Link href="/compte" aria-label="Mon compte" className="shrink-0">
        <Avatar seed={20} category={user.categories?.[0] ?? "maquillage"} name={user.name} size={38} ring />
      </Link>
    );
  }
  return (
    <Link
      href="/favoris"
      aria-label="Mes favoris"
      className="grid h-10 w-10 shrink-0 place-items-center rounded-full glass shadow-float text-lg"
    >
      ♡
    </Link>
  );
}
