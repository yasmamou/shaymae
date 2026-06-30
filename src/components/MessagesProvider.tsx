"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useAuth } from "./AuthProvider";

export interface Message {
  id: string;
  from: "me" | "pro";
  text: string;
  kind: "text" | "photo";
  seed?: number;
}

export interface Thread {
  slug: string;
  messages: Message[];
}

interface MessagesCtx {
  threads: Record<string, Thread>;
  ready: boolean;
  getThread: (slug: string) => Message[];
  send: (slug: string, msg: Omit<Message, "id">) => void;
  ensureThread: (slug: string) => void;
}

const Ctx = createContext<MessagesCtx | null>(null);
const KEY = "shaymae:threads";

type DbMessage = {
  id: string; creatorSlug: string; fromMe: boolean; text: string; kind: string; seed: number | null;
};

const SEED: Record<string, Thread> = {
  "maison-lila": {
    slug: "maison-lila",
    messages: [
      { id: "s1", from: "pro", text: "Bonjour ✨ merci pour votre intérêt ! Quelle prestation vous ferait plaisir ?", kind: "text" },
      { id: "s2", from: "me", text: "Bonjour ! Je voudrais un volume russe pour un mariage 😍", kind: "text" },
      { id: "s3", from: "pro", text: "Parfait, voici un exemple de rendu mariage 👇", kind: "photo", seed: 13 },
    ],
  },
};

export function MessagesProvider({ children }: { children: React.ReactNode }) {
  const { user, ready: authReady } = useAuth();
  const [threads, setThreads] = useState<Record<string, Thread>>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!authReady) return;
    if (user) {
      fetch("/api/messages")
        .then((r) => r.json())
        .then((d: { messages: DbMessage[] }) => {
          const grouped: Record<string, Thread> = {};
          for (const m of d.messages ?? []) {
            (grouped[m.creatorSlug] ??= { slug: m.creatorSlug, messages: [] }).messages.push({
              id: m.id, from: m.fromMe ? "me" : "pro", text: m.text, kind: m.kind === "photo" ? "photo" : "text", seed: m.seed ?? undefined,
            });
          }
          setThreads(grouped);
        })
        .catch(() => {})
        .finally(() => setReady(true));
    } else {
      try {
        const raw = localStorage.getItem(KEY);
        setThreads(raw ? JSON.parse(raw) : SEED);
      } catch { setThreads(SEED); }
      setReady(true);
    }
  }, [authReady, user]);

  const persistLocal = (next: Record<string, Thread>) => {
    if (!user) { try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {} }
  };

  const ensureThread = useCallback((slug: string) => {
    setThreads((prev) => {
      if (prev[slug]) return prev;
      const next = { ...prev, [slug]: { slug, messages: [] } };
      persistLocal(next);
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const send = useCallback((slug: string, msg: Omit<Message, "id">) => {
    setThreads((prev) => {
      const thread = prev[slug] ?? { slug, messages: [] };
      const m: Message = { ...msg, id: "m" + thread.messages.length + "-" + Math.abs((msg.seed ?? 0) + thread.messages.length) };
      const next = { ...prev, [slug]: { slug, messages: [...thread.messages, m] } };
      persistLocal(next);
      return next;
    });
    if (user) {
      fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ creatorSlug: slug, fromMe: msg.from === "me", text: msg.text, kind: msg.kind, seed: msg.seed }),
      }).catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const getThread = useCallback((slug: string) => threads[slug]?.messages ?? [], [threads]);

  return (
    <Ctx.Provider value={{ threads, ready, getThread, send, ensureThread }}>
      {children}
    </Ctx.Provider>
  );
}

export function useMessages() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useMessages must be used within MessagesProvider");
  return ctx;
}
