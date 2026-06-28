"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

interface FollowsCtx {
  slugs: string[];
  isFollowing: (slug: string) => boolean;
  toggle: (slug: string) => void;
  count: number;
}

const Ctx = createContext<FollowsCtx | null>(null);
const KEY = "shaymae:follows";

export function FollowsProvider({ children }: { children: React.ReactNode }) {
  const [slugs, setSlugs] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setSlugs(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(KEY, JSON.stringify(slugs));
  }, [slugs, ready]);

  const toggle = useCallback((slug: string) => {
    setSlugs((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [slug, ...prev]));
  }, []);
  const isFollowing = useCallback((slug: string) => slugs.includes(slug), [slugs]);

  return (
    <Ctx.Provider value={{ slugs, isFollowing, toggle, count: slugs.length }}>
      {children}
    </Ctx.Provider>
  );
}

export function useFollows() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useFollows must be used within FollowsProvider");
  return ctx;
}
