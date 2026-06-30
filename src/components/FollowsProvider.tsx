"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useAuth } from "./AuthProvider";

interface FollowsCtx {
  slugs: string[];
  isFollowing: (slug: string) => boolean;
  toggle: (slug: string) => void;
  count: number;
}

const Ctx = createContext<FollowsCtx | null>(null);
const KEY = "shaymae:follows";

export function FollowsProvider({ children }: { children: React.ReactNode }) {
  const { user, ready: authReady } = useAuth();
  const [slugs, setSlugs] = useState<string[]>([]);

  useEffect(() => {
    if (!authReady) return;
    if (user) {
      fetch("/api/follows")
        .then((r) => r.json())
        .then((d) => setSlugs(d.slugs ?? []))
        .catch(() => {});
    } else {
      try {
        const raw = localStorage.getItem(KEY);
        setSlugs(raw ? JSON.parse(raw) : []);
      } catch {}
    }
  }, [authReady, user]);

  const toggle = useCallback((slug: string) => {
    setSlugs((prev) => {
      const next = prev.includes(slug) ? prev.filter((s) => s !== slug) : [slug, ...prev];
      if (user) {
        fetch("/api/follows", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug }),
        }).catch(() => {});
      } else {
        try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
      }
      return next;
    });
  }, [user]);

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
