"use client";

import { useEffect, useState } from "react";

interface BIPEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallButton() {
  const [deferred, setDeferred] = useState<BIPEvent | null>(null);
  const [standalone, setStandalone] = useState(false);
  const [help, setHelp] = useState(false);

  useEffect(() => {
    const isStandalone =
      window.matchMedia?.("(display-mode: standalone)").matches ||
      // @ts-expect-error iOS Safari
      window.navigator.standalone === true;
    setStandalone(isStandalone);

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BIPEvent);
    };
    const onInstalled = () => { setDeferred(null); setStandalone(true); };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (standalone) return null; // déjà installée → on masque

  const onClick = async () => {
    if (deferred) {
      await deferred.prompt();
      await deferred.userChoice;
      setDeferred(null);
    } else {
      setHelp(true);
    }
  };

  return (
    <>
      <button
        onClick={onClick}
        className="flex shrink-0 items-center gap-1.5 rounded-full bg-gradient-to-r from-champagne to-gold px-3 py-2 text-[12px] font-bold text-brun-profond shadow-float active:scale-95"
      >
        <span className="text-sm">⤓</span>
        <span>Installer l&apos;appli</span>
      </button>

      {help && <InstallHelp onClose={() => setHelp(false)} />}
    </>
  );
}

function InstallHelp({ onClose }: { onClose: () => void }) {
  const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
  const isIOS = /iphone|ipad|ipod/i.test(ua);
  const isAndroid = /android/i.test(ua);
  const isFirefox = /firefox|fxios/i.test(ua);

  return (
    <div className="fixed inset-0 z-[2100] mx-auto flex w-full max-w-[480px] items-end" role="dialog" aria-modal="true">
      <button aria-label="Fermer" className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full animate-float-up rounded-t-[2rem] bg-blanc p-5 pb-[max(24px,env(safe-area-inset-bottom))] shadow-soft">
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-line" />
        <h3 className="font-display text-2xl font-semibold text-ink">Installer Shaymae 📲</h3>
        <p className="mt-1 text-sm text-ink-soft">
          Ajoutez l&apos;app à votre écran d&apos;accueil pour l&apos;ouvrir en plein écran, comme une vraie application.
        </p>

        <div className="mt-4 space-y-3 text-[14px] text-ink">
          {isIOS && (
            <Step icon="📤" title="Sur iPhone (Safari)">
              Touchez <b>Partager</b> (carré avec flèche ↑) puis <b>« Sur l&apos;écran d&apos;accueil »</b>.
            </Step>
          )}
          {isAndroid && !isFirefox && (
            <Step icon="⋮" title="Sur Android (Chrome)">
              Menu <b>⋮</b> en haut à droite → <b>« Installer l&apos;application »</b>.
            </Step>
          )}
          {isFirefox && (
            <Step icon="🦊" title="Vous êtes sur Firefox">
              Firefox installe mal les apps. Ouvrez plutôt <b>shaymae.vercel.app</b> dans
              <b> Chrome</b> (Android) ou <b>Safari</b> (iPhone), puis réessayez — ou via le menu Firefox
              <b> ⋮ → Ajouter à l&apos;écran d&apos;accueil</b>.
            </Step>
          )}
          {!isIOS && !isAndroid && !isFirefox && (
            <Step icon="💻" title="Sur ordinateur (Chrome/Edge)">
              Cliquez sur l&apos;icône <b>d&apos;installation ⊕</b> dans la barre d&apos;adresse, à droite.
            </Step>
          )}
          {!isFirefox && (
            <p className="rounded-2xl bg-creme/60 px-3 py-2 text-[12px] text-ink-soft">
              💡 Astuce : pour une installation en 1 clic, ouvrez le site dans <b>Chrome</b> ou <b>Safari</b>.
            </p>
          )}
        </div>

        <button onClick={onClose} className="mt-5 w-full rounded-full bg-ink py-3.5 text-sm font-bold text-blanc">
          J&apos;ai compris
        </button>
      </div>
    </div>
  );
}

function Step({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3 rounded-2xl border border-line bg-creme/40 p-3.5">
      <span className="text-xl">{icon}</span>
      <div>
        <p className="text-sm font-bold text-ink">{title}</p>
        <p className="text-[13px] text-ink-soft">{children}</p>
      </div>
    </div>
  );
}
