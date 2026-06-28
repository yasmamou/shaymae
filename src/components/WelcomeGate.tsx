"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "./AuthProvider";

const KEY = "shaymae:welcome-seen";

export function WelcomeGate() {
  const { user, ready } = useAuth();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!ready) return;
    if (user) { setShow(false); return; }
    try {
      setShow(localStorage.getItem(KEY) !== "1");
    } catch {
      setShow(true);
    }
  }, [ready, user]);

  if (!show) return null;

  const dismiss = () => {
    try { localStorage.setItem(KEY, "1"); } catch {}
    setShow(false);
  };

  return (
    <div className="fixed inset-0 z-[2000] flex flex-col justify-end overflow-hidden bg-brun-profond text-white">
      {/* halos dorés */}
      <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full" style={{ background: "radial-gradient(circle, rgba(212,175,122,0.35), transparent 70%)" }} />
      <div className="pointer-events-none absolute -left-24 top-1/3 h-72 w-72 rounded-full" style={{ background: "radial-gradient(circle, rgba(249,221,228,0.25), transparent 70%)" }} />

      <div className="relative flex flex-1 flex-col items-center justify-center px-8 text-center">
        <span className="mb-4 text-5xl">✨</span>
        <h1 className="font-display text-6xl font-bold text-gradient-gold">Glow</h1>
        <p className="mt-3 max-w-xs text-[15px] leading-relaxed text-white/85">
          Votre rituel beauté, sublimé.<br />
          Découvrez, réservez et rayonnez.
        </p>
      </div>

      <div className="relative space-y-3 px-7 pb-[max(28px,env(safe-area-inset-bottom))]">
        <Link
          href="/connexion"
          onClick={dismiss}
          className="block rounded-full bg-gradient-to-r from-champagne to-gold py-4 text-center text-sm font-bold text-brun-profond shadow-soft"
        >
          Se connecter
        </Link>
        <Link
          href="/inscription"
          onClick={dismiss}
          className="block rounded-full border border-white/40 py-4 text-center text-sm font-bold text-white"
        >
          Créer un compte · cliente ou professionnelle
        </Link>
        <button
          onClick={dismiss}
          className="block w-full py-2 text-center text-[13px] font-medium text-white/65"
        >
          Découvrir sans compte →
        </button>
      </div>
    </div>
  );
}
