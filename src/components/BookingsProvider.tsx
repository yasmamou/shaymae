"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useAuth } from "./AuthProvider";

export interface Reservation {
  id: string;
  creatorSlug: string;
  creatorName: string;
  serviceName: string;
  price: number;
  deposit: number;
  date: string;
  slot: string;
  firstName: string;
  lastName: string | null;
  phone: string | null;
  status: string;
  createdAt: string;
}

export type BookInput = Omit<Reservation, "id" | "status" | "createdAt">;
type BookResult = { ok: true; reservation: Reservation } | { ok: false; error: string };

interface BookingsCtx {
  reservations: Reservation[];
  ready: boolean;
  refresh: () => Promise<void>;
  book: (r: BookInput) => Promise<BookResult>;
  cancel: (id: string) => Promise<void>;
}

const Ctx = createContext<BookingsCtx | null>(null);

export function BookingsProvider({ children }: { children: React.ReactNode }) {
  const { user, ready: authReady } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const r = await fetch("/api/reservations");
      const d = await r.json();
      setReservations(d.reservations ?? []);
    } catch {
      setReservations([]);
    }
  }, []);

  useEffect(() => {
    if (!authReady) return;
    if (user) {
      refresh().finally(() => setReady(true));
    } else {
      setReservations([]);
      setReady(true);
    }
  }, [authReady, user, refresh]);

  const book = useCallback(async (r: BookInput): Promise<BookResult> => {
    const res = await fetch("/api/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(r),
    });
    const data = await res.json();
    if (!res.ok) return { ok: false, error: data.error ?? "Réservation impossible" };
    setReservations((prev) => [data.reservation, ...prev]);
    return { ok: true, reservation: data.reservation };
  }, []);

  const cancel = useCallback(async (id: string) => {
    setReservations((prev) => prev.map((x) => (x.id === id ? { ...x, status: "annulé" } : x)));
    await fetch(`/api/reservations/${id}`, { method: "PATCH" });
  }, []);

  return (
    <Ctx.Provider value={{ reservations, ready, refresh, book, cancel }}>
      {children}
    </Ctx.Provider>
  );
}

export function useBookings() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useBookings must be used within BookingsProvider");
  return ctx;
}
