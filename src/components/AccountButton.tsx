"use client";

import Link from "next/link";
import { useAuth } from "./AuthProvider";
import { Avatar } from "@/lib/Media";

/** Bouton compte pour les en-têtes mobiles (avatar si connecté, sinon connexion). */
export function AccountButton() {
  const { user, ready } = useAuth();
  if (!ready) return <span className="h-9 w-9" />;

  if (user) {
    return (
      <Link href="/compte" aria-label="Mon compte" className="shrink-0">
        <Avatar
          seed={20}
          category={user.categories?.[0] ?? "maquillage"}
          name={user.name}
          size={38}
          ring
        />
      </Link>
    );
  }
  return (
    <Link
      href="/connexion"
      className="shrink-0 rounded-full bg-ink px-3.5 py-2 text-xs font-bold text-blanc"
    >
      Se connecter
    </Link>
  );
}
