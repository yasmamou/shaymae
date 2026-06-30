// Génère les icônes PWA Shaymae (sans police : formes vectorielles uniquement).
// Lancer : node scripts/gen-icons.mjs
import sharp from "sharp";
import { mkdirSync } from "node:fs";

mkdirSync("public", { recursive: true });
mkdirSync("src/app", { recursive: true });

const sparkle = (cx, cy, r, fill, opacity = 1) =>
  `<path d="M${cx} ${cy - r} Q${cx} ${cy} ${cx + r} ${cy} Q${cx} ${cy} ${cx} ${cy + r} Q${cx} ${cy} ${cx - r} ${cy} Q${cx} ${cy} ${cx} ${cy - r} Z" fill="${fill}" opacity="${opacity}"/>`;

function svg({ rounded = true, mainR = 140, extra = true } = {}) {
  const rx = rounded ? 112 : 0;
  return `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#2a1c16"/>
      <stop offset="0.55" stop-color="#5a3f2e"/>
      <stop offset="1" stop-color="#c9a227"/>
    </linearGradient>
    <radialGradient id="rose" cx="0.3" cy="0.22" r="0.7">
      <stop offset="0" stop-color="#f9dde4" stop-opacity="0.5"/>
      <stop offset="1" stop-color="#f9dde4" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="star" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#fbeed2"/>
      <stop offset="1" stop-color="#e6c98f"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="${rx}" fill="url(#bg)"/>
  <rect width="512" height="512" rx="${rx}" fill="url(#rose)"/>
  ${sparkle(256, 256, mainR, "url(#star)")}
  ${extra ? sparkle(388, 150, 40, "#fbeed2", 0.9) : ""}
  ${extra ? sparkle(150, 372, 28, "#fbeed2", 0.8) : ""}
</svg>`;
}

const jobs = [
  { file: "public/icon-512.png", size: 512, opts: { rounded: true, mainR: 140 } },
  { file: "public/icon-192.png", size: 192, opts: { rounded: true, mainR: 140 } },
  { file: "public/icon-maskable-512.png", size: 512, opts: { rounded: false, mainR: 110, extra: false } },
  { file: "public/apple-touch-icon.png", size: 180, opts: { rounded: false, mainR: 125, extra: true } },
  { file: "src/app/icon.png", size: 512, opts: { rounded: true, mainR: 140 } },
];

for (const j of jobs) {
  await sharp(Buffer.from(svg(j.opts))).resize(j.size, j.size).png().toFile(j.file);
  console.log("✓", j.file, `(${j.size})`);
}
console.log("Icônes générées.");
