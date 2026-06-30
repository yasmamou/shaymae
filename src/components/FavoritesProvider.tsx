"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useAuth } from "./AuthProvider";

interface FavCtx {
  ids: string[];
  has: (id: string) => boolean;
  toggle: (id: string) => void;
  count: number;
}

const Ctx = createContext<FavCtx | null>(null);
const KEY = "shaymae:favoris";

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { user, ready: authReady } = useAuth();
  const [ids, setIds] = useState<string[]>([]);

  // Source des données : DB si connectée, sinon localStorage.
  useEffect(() => {
    if (!authReady) return;
    if (user) {
      fetch("/api/favorites")
        .then((r) => r.json())
        .then((d) => setIds(d.ids ?? []))
        .catch(() => {});
    } else {
      try {
        const raw = localStorage.getItem(KEY);
        setIds(raw ? JSON.parse(raw) : []);
      } catch {}
    }
  }, [authReady, user]);

  const toggle = useCallback((id: string) => {
    setIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [id, ...prev];
      if (user) {
        fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ itemId: id }),
        }).catch(() => {});
      } else {
        try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
      }
      return next;
    });
  }, [user]);

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
