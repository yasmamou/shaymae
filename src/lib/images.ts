import type { CategoryKey } from "./data";

// ──────────────────────────────────────────────────────────────
// Pools d'images réelles (Unsplash), vérifiées 200, par catégorie.
// Sujet pertinent : cils, sourcils, ongles, coiffure, maquillage.
// On choisit une image de façon déterministe à partir d'un seed.
// ──────────────────────────────────────────────────────────────

const POOLS: Record<CategoryKey, string[]> = {
  cils: [
    "photo-1589710751893-f9a6770ad71b",
    "photo-1639629509821-c54cdd984227",
    "photo-1548902378-2ec44c906391",
    "photo-1492618269284-653dce58fd6d",
    "photo-1493422884938-abd42cfa0f29",
    "photo-1590005298234-fdc7ff540468",
    "photo-1567629307995-b9f33097bd30",
  ],
  sourcils: [
    "photo-1519415387722-a1c3bbef716c",
    "photo-1595550912256-b24059bb08e8",
    "photo-1620508467736-0140acd17ce4",
    "photo-1565113521364-cb12a3ec0f28",
    "photo-1588683301867-c442a9ed1389",
    "photo-1616896590968-94d9a6e413a3",
  ],
  ongles: [
    "photo-1632345031435-8727f6897d53",
    "photo-1610992015762-45dca7fa3a85",
    "photo-1690749138086-7422f71dc159",
    "photo-1630843599725-32ead7671867",
    "photo-1610992015836-7c249d75782d",
    "photo-1519014816548-bf5fe059798b",
    "photo-1604902396830-aca29e19b067",
    "photo-1610992015732-2449b76344bc",
    "photo-1599206676335-193c82b13c9e",
  ],
  coiffure: [
    "photo-1560869713-7d0a29430803",
    "photo-1554519934-e32b1629d9ee",
    "photo-1629397685944-7073f5589754",
    "photo-1619367901998-73b3a70b3898",
    "photo-1605980625600-88b46abafa8d",
    "photo-1647462741268-e5724e5886c0",
    "photo-1562259920-47afc3030ba2",
    "photo-1629397662600-50ad523ef4fb",
  ],
  maquillage: [
    "photo-1596462502278-27bfdc403348",
    "photo-1512496015851-a90fb38ba796",
    "photo-1594465919760-441fe5908ab0",
    "photo-1516975080664-ed2fc6a32937",
    "photo-1596704017254-9b121068fb31",
    "photo-1622336889416-8d790ad807d7",
    "photo-1583784561105-a674080f391e",
    "photo-1551723454-7565a1f5b161",
  ],
};

const base = (id: string, w: number, q = 72) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=${q}`;

/** URL d'image réelle, déterministe selon (catégorie, seed). */
export function imageFor(
  category: CategoryKey,
  seed: number,
  width = 800,
  offset = 0
): string {
  const pool = POOLS[category];
  const idx = (Math.abs(seed) + offset) % pool.length;
  return base(pool[idx], width);
}

/** Deux images distinctes de la même catégorie : avant / après. */
export function beforeAfterFor(
  category: CategoryKey,
  seed: number,
  width = 800
): { before: string; after: string } {
  return {
    after: imageFor(category, seed, width, 0),
    before: imageFor(category, seed, width, 1),
  };
}
