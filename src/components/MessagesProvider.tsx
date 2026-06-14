"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

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

// quelques conversations de démo
const SEED: Record<string, Thread> = {
  "maison-lila": {
    slug: "maison-lila",
    messages: [
      { id: "s1", from: "pro", text: "Bonjour ✨ merci pour votre intérêt ! Quelle prestation vous ferait plaisir ?", kind: "text" },
      { id: "s2", from: "me", text: "Bonjour ! Je voudrais un volume russe pour un mariage 😍", kind: "text" },
      { id: "s3", from: "pro", text: "Parfait, voici un exemple de rendu mariage 👇", kind: "photo", seed: 13 },
    ],
  },
  "ines-makeup-mtp": {
    slug: "ines-makeup-mtp",
    messages: [
      { id: "s1", from: "pro", text: "Coucou ! Je me déplace sur toute l'agglo de Montpellier 🚗", kind: "text" },
    ],
  },
};

export function MessagesProvider({ children }: { children: React.ReactNode }) {
  const [threads, setThreads] = useState<Record<string, Thread>>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      setThreads(raw ? JSON.parse(raw) : SEED);
    } catch {
      setThreads(SEED);
    }
    setReady(true);
  }, []);

  const persist = (next: Record<string, Thread>) => {
    setThreads(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  };

  const ensureThread = useCallback((slug: string) => {
    setThreads((prev) => {
      if (prev[slug]) return prev;
      const next = { ...prev, [slug]: { slug, messages: [] } };
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const send = useCallback((slug: string, msg: Omit<Message, "id">) => {
    setThreads((prev) => {
      const thread = prev[slug] ?? { slug, messages: [] };
      const m: Message = { ...msg, id: "m" + thread.messages.length + "-" + Math.abs((msg.seed ?? 0) + thread.messages.length) };
      const next = { ...prev, [slug]: { slug, messages: [...thread.messages, m] } };
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }, []);

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
