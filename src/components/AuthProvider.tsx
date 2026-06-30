"use client";

import {
  createContext, useContext, useEffect, useState, useCallback,
} from "react";
import type { CategoryKey } from "@/lib/data";

export type Role = "cliente" | "creatrice";

export interface User {
  id?: string;
  name: string;
  email: string;
  role: Role;
  city?: string | null;
  handle?: string | null;
  categories?: CategoryKey[] | null;
  mode?: "salon" | "mobile" | string | null;
}

export interface StudioPost {
  id: string;
  category: CategoryKey;
  label: string;
  caption: string;
  seed: number;
  createdAt: number;
}

export interface SignUpPayload {
  name: string;
  email: string;
  password: string;
  role: Role;
  city?: string;
  handle?: string;
  categories?: CategoryKey[];
  mode?: "salon" | "mobile";
}

type AuthResult = { ok: true } | { ok: false; error: string };

interface AuthCtx {
  user: User | null;
  ready: boolean;
  signUp: (p: SignUpPayload) => Promise<AuthResult>;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  updateUser: (patch: Partial<User>) => void;
  posts: StudioPost[];
  addPost: (p: Omit<StudioPost, "id" | "createdAt">) => void;
  removePost: (id: string) => void;
}

const Ctx = createContext<AuthCtx | null>(null);
const PKEY = "shaymae:studio-posts";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<StudioPost[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setUser(d.user ?? null))
      .catch(() => {})
      .finally(() => setReady(true));
    try {
      const p = localStorage.getItem(PKEY);
      if (p) setPosts(JSON.parse(p));
    } catch {}
  }, []);

  const signUp = useCallback(async (p: SignUpPayload): Promise<AuthResult> => {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(p),
    });
    const data = await res.json();
    if (!res.ok) return { ok: false, error: data.error ?? "Inscription impossible" };
    setUser(data.user);
    return { ok: true };
  }, []);

  const signIn = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) return { ok: false, error: data.error ?? "Connexion impossible" };
    setUser(data.user);
    return { ok: true };
  }, []);

  const signOut = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  }, []);

  const updateUser = useCallback((patch: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...patch } : prev));
  }, []);

  const addPost = useCallback((p: Omit<StudioPost, "id" | "createdAt">) =>
    setPosts((prev) => {
      const next = [{ ...p, id: "post-" + prev.length + "-" + p.seed, createdAt: prev.length }, ...prev];
      localStorage.setItem(PKEY, JSON.stringify(next));
      return next;
    }), []);

  const removePost = useCallback((id: string) =>
    setPosts((prev) => {
      const next = prev.filter((x) => x.id !== id);
      localStorage.setItem(PKEY, JSON.stringify(next));
      return next;
    }), []);

  return (
    <Ctx.Provider value={{ user, ready, signUp, signIn, signOut, updateUser, posts, addPost, removePost }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
