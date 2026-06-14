"use client";

import Link from "next/link";
import { useMessages } from "@/components/MessagesProvider";
import { getCreator } from "@/lib/data";
import { Avatar } from "@/lib/Media";
import { AccountButton } from "@/components/AccountButton";

export default function MessagesPage() {
  const { threads, ready } = useMessages();
  const list = Object.values(threads).filter((t) => t.messages.length > 0);

  return (
    <div className="min-h-[100dvh] px-5 pb-32 pt-[max(16px,env(safe-area-inset-top))]">
      <header className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink">Messages</h1>
          <p className="text-[12px] text-ink-soft">Échangez avec vos créatrices</p>
        </div>
        <span className="lg:hidden"><AccountButton /></span>
      </header>

      {ready && list.length === 0 && (
        <div className="flex flex-col items-center px-6 pt-20 text-center">
          <span className="mb-4 text-6xl">✉️</span>
          <h2 className="font-display text-2xl font-semibold text-ink">Pas encore de conversation</h2>
          <p className="mt-2 max-w-xs text-sm text-ink-soft">
            Contactez une créatrice depuis son profil pour préparer votre rendez-vous.
          </p>
          <Link href="/recherche" className="mt-6 rounded-full bg-gradient-to-r from-rose-deep to-or-rose px-6 py-3 text-sm font-bold text-white shadow-soft">
            Découvrir les créatrices
          </Link>
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        {list.map((t) => {
          const creator = getCreator(t.slug);
          const last = t.messages[t.messages.length - 1];
          return (
            <Link key={t.slug} href={`/messages/${t.slug}`} className="flex items-center gap-3 rounded-2xl border border-line bg-blanc/70 p-3 transition active:scale-[0.99]">
              {creator
                ? <Avatar seed={creator.avatarSeed} category={creator.categories[0]} name={creator.name} size={48} />
                : <span className="grid h-12 w-12 place-items-center rounded-full bg-creme">✨</span>}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-ink">{creator?.name ?? t.slug}</p>
                <p className="truncate text-[12px] text-ink-soft">
                  {last.from === "me" ? "Vous : " : ""}{last.kind === "photo" ? "📷 Photo" : last.text}
                </p>
              </div>
              <span className="text-ink-soft">›</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
