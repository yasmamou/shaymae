"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

export interface Reservation {
  id: string;
  creatorSlug: string;
  creatorName: string;
  serviceName: string;
  price: number;
  deposit: number;
  date: string; // yyyy-mm-dd
  slot: string; // HH:MM
  firstName: string;
  lastName: string;
  phone: string;
  status: "confirmé" | "annulé";
  createdAt: number;
}

interface BookingsCtx {
  reservations: Reservation[];
  ready: boolean;
  book: (r: Omit<Reservation, "id" | "status" | "createdAt">) => Reservation;
  cancel: (id: string) => void;
  waitlist: string[]; // "slug|date"
  toggleWaitlist: (key: string) => void;
}

const Ctx = createContext<BookingsCtx | null>(null);
const KEY = "shaymae:reservations";
const WKEY = "shaymae:waitlist";

export function BookingsProvider({ children }: { children: React.ReactNode }) {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [waitlist, setWaitlist] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const r = localStorage.getItem(KEY);
      if (r) setReservations(JSON.parse(r));
      const w = localStorage.getItem(WKEY);
      if (w) setWaitlist(JSON.parse(w));
    } catch {}
    setReady(true);
  }, []);

  const book: BookingsCtx["book"] = useCallback((r) => {
    const res: Reservation = {
      ...r,
      id: "res-" + r.creatorSlug + "-" + r.date + "-" + r.slot.replace(":", ""),
      status: "confirmé",
      createdAt: Date.parse(r.date + "T" + r.slot + ":00Z") || 0,
    };
    setReservations((prev) => {
      const next = [res, ...prev.filter((x) => x.id !== res.id)];
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
    return res;
  }, []);

  const cancel = useCallback((id: string) => {
    setReservations((prev) => {
      const next = prev.map((r) => (r.id === id ? { ...r, status: "annulé" as const } : r));
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const toggleWaitlist = useCallback((key: string) => {
    setWaitlist((prev) => {
      const next = prev.includes(key) ? prev.filter((x) => x !== key) : [key, ...prev];
      localStorage.setItem(WKEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return (
    <Ctx.Provider value={{ reservations, ready, book, cancel, waitlist, toggleWaitlist }}>
      {children}
    </Ctx.Provider>
  );
}

export function useBookings() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useBookings must be used within BookingsProvider");
  return ctx;
}
