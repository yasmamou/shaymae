"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

interface FavCtx {
  ids: string[];
  has: (id: string) => boolean;
  toggle: (id: string) => void;
  count: number;
}

const Ctx = createContext<FavCtx | null>(null);
const KEY = "shaymae:favoris";

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setIds(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(KEY, JSON.stringify(ids));
  }, [ids, ready]);

  const toggle = useCallback((id: string) => {
    setIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [id, ...prev]
    );
  }, []);

  const has = useCallback((id: string) => ids.includes(id), [ids]);

  return (
    <Ctx.Provider value={{ ids, has, toggle, count: ids.length }}>
      {children}
    </Ctx.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}
