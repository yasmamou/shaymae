import type { CategoryKey } from "./data";
import { categoryOf } from "./data";

/**
 * Média génératif Shaymae.
 * Pas d'image externe : on dessine un visuel premium et cohérent à partir
 * d'une catégorie + d'un seed. Jamais d'image cassée, toujours « on brand ».
 */
export function Media({
  category,
  seed,
  label,
  glyph = true,
  className = "",
  rounded = "rounded-3xl",
}: {
  category: CategoryKey;
  seed: number;
  label?: string;
  glyph?: boolean;
  className?: string;
  rounded?: string;
}) {
  const cat = categoryOf(category);
  const [a, b, c] = cat.grad;
  const angle = (seed * 47) % 360;
  const x1 = 15 + (seed % 70);
  const y1 = 10 + ((seed * 3) % 60);
  const x2 = 20 + ((seed * 7) % 70);
  const y2 = 30 + ((seed * 5) % 60);

  return (
    <div
      className={`relative overflow-hidden ${rounded} ${className}`}
      style={{
        background: `
          radial-gradient(60% 55% at ${x1}% ${y1}%, ${a} 0%, transparent 60%),
          radial-gradient(55% 50% at ${x2}% ${y2}%, ${c} 0%, transparent 55%),
          linear-gradient(${angle}deg, ${b}, ${a})
        `,
      }}
    >
      {/* voile soyeux */}
      <div
        className="absolute inset-0 mix-blend-soft-light opacity-70"
        style={{
          background: `linear-gradient(${angle + 90}deg, rgba(255,255,255,0.55), transparent 40%, rgba(0,0,0,0.08))`,
        }}
      />
      {/* grain subtil */}
      <div
        className="absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      {glyph && (
        <div className="absolute inset-0 grid place-items-center">
          <span
            className="select-none opacity-25"
            style={{ fontSize: "min(38%, 5rem)", lineHeight: 1 }}
          >
            {cat.emoji}
          </span>
        </div>
      )}
      {label && (
        <div className="absolute inset-x-0 bottom-0 p-3">
          <span className="inline-flex items-center gap-1 rounded-full glass px-2.5 py-1 text-[11px] font-medium text-ink shadow-float">
            {cat.emoji} {label}
          </span>
        </div>
      )}
    </div>
  );
}

/** Avatar génératif rond */
export function Avatar({
  seed,
  category,
  name,
  size = 48,
  ring = false,
}: {
  seed: number;
  category: CategoryKey;
  name: string;
  size?: number;
  ring?: boolean;
}) {
  const cat = categoryOf(category);
  const [a, , c] = cat.grad;
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
  return (
    <div
      className={`grid place-items-center rounded-full font-display font-semibold text-ink ${
        ring ? "ring-2 ring-champagne ring-offset-2 ring-offset-blanc" : ""
      }`}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.36,
        background: `linear-gradient(135deg, ${a}, ${c})`,
      }}
      aria-label={name}
    >
      {initials}
    </div>
  );
}
