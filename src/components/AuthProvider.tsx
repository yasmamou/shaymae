"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import type { CategoryKey } from "@/lib/data";

export type Role = "cliente" | "creatrice";

export interface User {
  name: string;
  email: string;
  role: Role;
  city?: string;
  handle?: string;
  categories?: CategoryKey[];
  mode?: "salon" | "mobile";
}

export interface StudioPost {
  id: string;
  category: CategoryKey;
  label: string;
  caption: string;
  seed: number;
  createdAt: number;
}

interface AuthCtx {
  user: User | null;
  ready: boolean;
  signUp: (u: User) => void;
  signIn: (email: string) => boolean;
  signOut: () => void;
  updateUser: (patch: Partial<User>) => void;
  posts: StudioPost[];
  addPost: (p: Omit<StudioPost, "id" | "createdAt">) => void;
  removePost: (id: string) => void;
}

const Ctx = createContext<AuthCtx | null>(null);
const UKEY = "shaymae:user";
const PKEY = "shaymae:studio-posts";
const DIRKEY = "shaymae:accounts"; // annuaire email -> User (mock)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<StudioPost[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const u = localStorage.getItem(UKEY);
      if (u) setUser(JSON.parse(u));
      const p = localStorage.getItem(PKEY);
      if (p) setPosts(JSON.parse(p));
    } catch {}
    setReady(true);
  }, []);

  const persistUser = (u: User | null) => {
    setUser(u);
    if (u) {
      localStorage.setItem(UKEY, JSON.stringify(u));
      try {
        const dir = JSON.parse(localStorage.getItem(DIRKEY) || "{}");
        dir[u.email.toLowerCase()] = u;
        localStorage.setItem(DIRKEY, JSON.stringify(dir));
      } catch {}
    } else {
      localStorage.removeItem(UKEY);
    }
  };

  const signUp = useCallback((u: User) => persistUser(u), []);

  const signIn = useCallback((email: string) => {
    try {
      const dir = JSON.parse(localStorage.getItem(DIRKEY) || "{}");
      const found = dir[email.toLowerCase()] as User | undefined;
      if (found) {
        persistUser(found);
        return true;
      }
    } catch {}
    // compte de démo : on accepte et on crée une cliente à la volée
    persistUser({ name: email.split("@")[0], email, role: "cliente" });
    return true;
  }, []);

  const signOut = useCallback(() => persistUser(null), []);

  const updateUser = useCallback(
    (patch: Partial<User>) =>
      setUser((prev) => {
        if (!prev) return prev;
        const next = { ...prev, ...patch };
        persistUser(next);
        return next;
      }),
    []
  );

  const addPost = useCallback(
    (p: Omit<StudioPost, "id" | "createdAt">) =>
      setPosts((prev) => {
        const next = [
          { ...p, id: "post-" + prev.length + "-" + p.seed, createdAt: prev.length },
          ...prev,
        ];
        localStorage.setItem(PKEY, JSON.stringify(next));
        return next;
      }),
    []
  );

  const removePost = useCallback(
    (id: string) =>
      setPosts((prev) => {
        const next = prev.filter((x) => x.id !== id);
        localStorage.setItem(PKEY, JSON.stringify(next));
        return next;
      }),
    []
  );

  return (
    <Ctx.Provider
      value={{ user, ready, signUp, signIn, signOut, updateUser, posts, addPost, removePost }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
