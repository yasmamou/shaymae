"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type Filter = "glow" | "none";

export default function CameraPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<Filter>("glow");
  const [showName, setShowName] = useState(true);
  const [captured, setCaptured] = useState<string | null>(null);
  const [facing, setFacing] = useState<"user" | "environment">("user");

  const startCamera = async () => {
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: facing }, audio: false });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setStreaming(true);
    } catch {
      setError("Caméra indisponible. Vous pouvez tout de même découvrir le filtre Glow Doré sur un exemple ci-dessous.");
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setStreaming(false);
  };

  useEffect(() => () => stopCamera(), []);

  // affichage fugace du nom du filtre
  useEffect(() => {
    if (filter === "glow") {
      setShowName(true);
      const t = setTimeout(() => setShowName(false), 1400);
      return () => clearTimeout(t);
    }
  }, [filter]);

  const capture = () => {
    const v = videoRef.current;
    const c = canvasRef.current;
    if (!v || !c) return;
    c.width = v.videoWidth || 720;
    c.height = v.videoHeight || 1280;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(v, 0, 0, c.width, c.height);
    setCaptured(c.toDataURL("image/jpeg", 0.9));
  };

  return (
    <div className="relative h-[100dvh] overflow-hidden bg-brun-profond text-white">
      {/* En-tête */}
      <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-4 pt-[max(14px,env(safe-area-inset-top))]">
        <Link href="/" className="grid h-10 w-10 place-items-center rounded-full glass-dark text-white">←</Link>
        <p className="font-display text-lg font-semibold text-white">Caméra Glow</p>
        <button onClick={() => { setFacing((f) => (f === "user" ? "environment" : "user")); if (streaming) { stopCamera(); setTimeout(startCamera, 150); } }} className="grid h-10 w-10 place-items-center rounded-full glass-dark text-white" aria-label="Changer de caméra">⟳</button>
      </div>

      {/* Zone visuelle */}
      <div className="relative h-full w-full">
        {captured ? (
          <CapturedView src={captured} filter={filter} />
        ) : (
          <>
            <video
              ref={videoRef}
              playsInline
              muted
              className={`h-full w-full object-cover ${filter === "glow" ? "glow-dore" : ""}`}
              style={{ transform: facing === "user" ? "scaleX(-1)" : undefined }}
            />
            {filter === "glow" && streaming && (
              <>
                <div className="pointer-events-none absolute inset-0 glow-bloom" />
                <GoldDust />
              </>
            )}
            {!streaming && (
              <div className="absolute inset-0 grid place-items-center px-8 text-center">
                <div>
                  <span className="text-5xl">📸</span>
                  <p className="mt-3 max-w-xs text-sm text-white/85">
                    {error || "Activez la caméra pour capturer vos plus belles réalisations avec le filtre signature Glow Doré."}
                  </p>
                  <button onClick={startCamera} className="mt-5 rounded-full bg-gradient-to-r from-champagne to-gold px-6 py-3 text-sm font-bold text-brun-profond shadow-soft">
                    Activer la caméra
                  </button>
                  {error && (
                    <button onClick={() => setCaptured(SAMPLE)} className="mt-3 block w-full text-[13px] font-semibold text-white/70 underline">
                      Voir le filtre sur un exemple →
                    </button>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {/* Nom du filtre en fondu */}
        {showName && filter === "glow" && (
          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            <span className="animate-fade-hold font-display text-4xl font-semibold tracking-wide text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]">
              Glow Doré
            </span>
          </div>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />

      {/* Contrôles bas */}
      <div className="absolute inset-x-0 bottom-0 z-20 space-y-4 px-5 pb-[max(28px,env(safe-area-inset-bottom))]">
        {!captured ? (
          <>
            {/* Sélecteur de filtre */}
            <div className="flex items-center justify-center gap-4">
              <FilterDot active={filter === "none"} label="Original" onClick={() => setFilter("none")} plain />
              <FilterDot active={filter === "glow"} label="Glow Doré" onClick={() => setFilter("glow")} />
            </div>
            {/* Déclencheur doré + voir/masquer filtre */}
            <div className="flex items-center justify-between">
              <span className="w-12 text-center text-[11px] font-semibold text-white/80">{filter === "glow" ? "Filtre ON" : "Filtre OFF"}</span>
              <button
                onClick={streaming ? capture : startCamera}
                aria-label="Prendre une photo"
                className="grid h-20 w-20 place-items-center rounded-full ring-4 ring-white/80"
                style={{ background: "linear-gradient(135deg, #e6c98f, #c9a227)" }}
              >
                <span className="h-14 w-14 rounded-full border-2 border-brun-profond/40" />
              </button>
              <button onClick={() => setFilter((f) => (f === "glow" ? "none" : "glow"))} className="w-12 text-center text-2xl" aria-label="Voir/masquer le filtre">
                {filter === "glow" ? "👁️" : "🚫"}
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="text-center text-[12px] font-medium text-white/80">Glissez pour comparer Avant / Après ✨</p>
            <div className="flex items-center justify-center gap-3">
              <button onClick={() => setCaptured(null)} className="rounded-full glass-dark px-5 py-3 text-sm font-bold text-white">↺ Reprendre</button>
              <button onClick={() => alert("Story Glow publiée ✨ (simulé)")} className="rounded-full bg-gradient-to-r from-champagne to-gold px-5 py-3 text-sm font-bold text-brun-profond shadow-soft">Partager en story</button>
              <button onClick={() => alert("Envoyé à vos contacts 💌 (simulé)")} className="rounded-full glass-dark px-5 py-3 text-sm font-bold text-white">Contacts</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function FilterDot({ active, label, onClick, plain = false }: { active: boolean; label: string; onClick: () => void; plain?: boolean }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1">
      <span
        className={`h-12 w-12 rounded-full transition ${active ? "ring-2 ring-white ring-offset-2 ring-offset-brun-profond" : "opacity-80"}`}
        style={plain ? { background: "rgba(255,255,255,0.18)" } : { background: "radial-gradient(circle at 30% 30%, #f3e3c2, #c9a227 70%)" }}
      />
      <span className={`text-[11px] font-semibold ${active ? "text-white" : "text-white/70"}`}>{label}</span>
    </button>
  );
}

function GoldDust() {
  const dots = Array.from({ length: 14 }, (_, i) => i);
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {dots.map((i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${(i * 37) % 100}%`,
            top: `${(i * 53) % 100}%`,
            width: `${3 + (i % 3) * 2}px`,
            height: `${3 + (i % 3) * 2}px`,
            background: "radial-gradient(circle, #f3e3c2, rgba(212,175,122,0))",
            animation: `sparkle ${2.5 + (i % 4) * 0.6}s ease-in-out ${(i % 5) * 0.3}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

function CapturedView({ src, filter }: { src: string; filter: Filter }) {
  const [pos, setPos] = useState(55);
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef(false);
  const move = (x: number) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    setPos(Math.max(3, Math.min(97, ((x - r.left) / r.width) * 100)));
  };
  return (
    <div
      ref={ref}
      className="relative h-full w-full select-none"
      onPointerDown={(e) => { drag.current = true; move(e.clientX); }}
      onPointerMove={(e) => drag.current && move(e.clientX)}
      onPointerUp={() => (drag.current = false)}
    >
      {/* APRÈS (filtré) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="Après" className={`absolute inset-0 h-full w-full object-cover ${filter === "glow" ? "glow-dore" : ""}`} />
      {filter === "glow" && <div className="pointer-events-none absolute inset-0 glow-bloom" />}
      <span className="absolute right-3 top-16 rounded-full glass-dark px-2.5 py-1 text-[10px] font-bold text-white">APRÈS · Glow Doré</span>

      {/* AVANT (brut) */}
      <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="Avant" className="absolute inset-0 h-full w-full object-cover" />
        <span className="absolute left-3 top-16 rounded-full glass-dark px-2.5 py-1 text-[10px] font-bold text-white">AVANT</span>
      </div>

      {/* poignée dorée */}
      <div className="absolute inset-y-0 flex w-0 items-center justify-center" style={{ left: `${pos}%` }}>
        <div className="absolute inset-y-0 w-0.5" style={{ background: "linear-gradient(#e6c98f,#c9a227)" }} />
        <div className="grid h-10 w-10 place-items-center rounded-full text-brun-profond shadow-soft" style={{ background: "linear-gradient(135deg,#e6c98f,#c9a227)" }}>⇆</div>
      </div>
    </div>
  );
}

// Exemple (dégradé doux encodé) si la caméra est indisponible
const SAMPLE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='720' height='1280'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#f3ccd6'/><stop offset='0.5' stop-color='#e9d8c8'/><stop offset='1' stop-color='#d4af7a'/></linearGradient></defs><rect width='720' height='1280' fill='url(#g)'/><text x='360' y='640' font-family='Georgia' font-size='64' fill='#4a3328' text-anchor='middle' opacity='0.5'>Exemple</text></svg>`
  );
