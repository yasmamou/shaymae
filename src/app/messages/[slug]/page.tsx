"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useMessages } from "@/components/MessagesProvider";
import { getCreator } from "@/lib/data";
import { Media, Avatar } from "@/lib/Media";

const REPLIES = [
  "Avec plaisir ✨ je vous réserve ce créneau !",
  "Très bonne idée, ça va être sublime 😍",
  "Je vous envoie un petit aperçu juste après 👌",
  "Oui c'est tout à fait possible, on en parle au rendez-vous ?",
];

export default function ThreadPage() {
  const { slug } = useParams<{ slug: string }>();
  const { getThread, send, ensureThread } = useMessages();
  const creator = getCreator(slug);
  const [text, setText] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const messages = getThread(slug);

  useEffect(() => { ensureThread(slug); }, [slug, ensureThread]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages.length]);

  const sendText = () => {
    if (!text.trim()) return;
    const t = text.trim();
    send(slug, { from: "me", text: t, kind: "text" });
    setText("");
    setTimeout(() => send(slug, { from: "pro", text: REPLIES[t.length % REPLIES.length], kind: "text" }), 900);
  };

  return (
    <div className="flex h-[100dvh] flex-col">
      {/* En-tête */}
      <header className="sticky top-0 z-20 glass border-b border-white/50 px-4 py-3 pt-[max(12px,env(safe-area-inset-top))]">
        <div className="flex items-center gap-3">
          <Link href="/messages" className="text-ink-soft">←</Link>
          {creator && <Avatar seed={creator.avatarSeed} category={creator.categories[0]} name={creator.name} size={38} />}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-ink">{creator?.name ?? slug}</p>
            <p className="text-[11px] text-ink-soft">En ligne récemment</p>
          </div>
          {creator && (
            <Link href={`/reserver/${creator.slug}`} className="rounded-full bg-gradient-to-r from-rose-deep to-or-rose px-3.5 py-2 text-[12px] font-bold text-white shadow-float">
              Réserver
            </Link>
          )}
        </div>
      </header>

      {/* Fil */}
      <div className="flex-1 space-y-2.5 overflow-y-auto px-4 py-4">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
            {m.kind === "photo" ? (
              <div className="overflow-hidden rounded-2xl shadow-float">
                <Media category={creator?.categories[0] ?? "maquillage"} seed={m.seed ?? 10} rounded="" glyph={false} className="h-44 w-44" />
              </div>
            ) : (
              <p className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm shadow-float ${
                m.from === "me" ? "bg-gradient-to-r from-rose-deep to-or-rose text-white" : "bg-blanc text-ink"
              }`}>
                {m.text}
              </p>
            )}
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* Saisie */}
      <div className="border-t border-line bg-blanc/80 px-3 py-2.5 pb-[max(12px,env(safe-area-inset-bottom))] lg:pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => send(slug, { from: "me", text: "", kind: "photo", seed: (text.length + messages.length) * 7 })}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-creme text-lg"
            aria-label="Envoyer une photo"
          >
            📷
          </button>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendText()}
            placeholder="Votre message…"
            className="flex-1 rounded-full border border-line bg-creme/50 px-4 py-2.5 text-sm outline-none focus:border-or-rose focus:bg-blanc"
          />
          <button onClick={sendText} className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink text-blanc" aria-label="Envoyer">
            ↑
          </button>
        </div>
      </div>
    </div>
  );
}
