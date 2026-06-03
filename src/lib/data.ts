// ──────────────────────────────────────────────────────────────
// Shaymae — couche de données (mock)
// Données fictives riches : créatrices beauté de l'arc lémanique.
// ──────────────────────────────────────────────────────────────

export type CategoryKey =
  | "cils"
  | "sourcils"
  | "ongles"
  | "coiffure"
  | "maquillage";

export interface Category {
  key: CategoryKey;
  label: string;
  emoji: string;
  /** dégradé thématique pour les médias génératifs */
  grad: [string, string, string];
}

export const CATEGORIES: Category[] = [
  { key: "cils", label: "Cils", emoji: "🪶", grad: ["#f4d9d9", "#e6b3b8", "#cda86b"] },
  { key: "sourcils", label: "Sourcils", emoji: "🤎", grad: ["#efe3d6", "#e7d3c4", "#cda86b"] },
  { key: "ongles", label: "Ongles", emoji: "💅", grad: ["#f4d9d9", "#ddd5ec", "#d9a48a"] },
  { key: "coiffure", label: "Coiffure", emoji: "💇‍♀️", grad: ["#efe3d6", "#d9a48a", "#cda86b"] },
  { key: "maquillage", label: "Maquillage", emoji: "💄", grad: ["#f4d9d9", "#e6b3b8", "#ddd5ec"] },
];

export const categoryOf = (k: CategoryKey) =>
  CATEGORIES.find((c) => c.key === k)!;

export type BookingMode = "whatsapp" | "instagram" | "internal";

export interface Service {
  name: string;
  duration: string;
  price: number;
  popular?: boolean;
}

export interface MediaItem {
  id: string;
  category: CategoryKey;
  /** seed pour le dégradé génératif */
  seed: number;
  label: string;
  /** présence d'un avant/après natif */
  beforeAfter?: boolean;
}

export interface Story {
  id: string;
  category: CategoryKey;
  seed: number;
  caption: string;
  kind: "before-after" | "promo" | "dispo" | "realisation";
}

export interface Review {
  author: string;
  rating: number;
  text: string;
  when: string;
}

export interface Creator {
  id: string;
  slug: string;
  name: string;
  handle: string;
  tagline: string;
  categories: CategoryKey[];
  rating: number;
  reviews: number;
  city: string;
  mode: "salon" | "mobile";
  address?: string;
  zones?: string[];
  radiusKm?: number;
  lat: number;
  lng: number;
  bio: string;
  avatarSeed: number;
  coverSeed: number;
  services: Service[];
  gallery: MediaItem[];
  stories: Story[];
  reviewsList: Review[];
  booking: BookingMode[];
  whatsapp?: string;
  instagram?: string;
  verified?: boolean;
}

const g = (slug: string, n: number, category: CategoryKey, label: string, beforeAfter = false): MediaItem => ({
  id: `${slug}-m${n}`,
  category,
  seed: (slug.charCodeAt(1) + n * 37) % 360,
  label,
  beforeAfter,
});

export const CREATORS: Creator[] = [
  {
    id: "c1",
    slug: "sarah-beauty",
    name: "Sarah Beauty",
    handle: "@sarah.beauty",
    tagline: "Lash artist · Regards sur-mesure",
    categories: ["cils", "sourcils", "ongles"],
    rating: 4.9,
    reviews: 218,
    city: "Lausanne",
    mode: "salon",
    address: "Rue de Bourg 12, Lausanne",
    lat: 46.5205,
    lng: 6.6335,
    bio: "Spécialiste du regard depuis 7 ans. Cils volume russe, rehaussement, et un sens du détail obsessionnel. Mon studio à Lausanne est pensé comme un cocon.",
    avatarSeed: 12,
    coverSeed: 40,
    verified: true,
    services: [
      { name: "Volume Russe", duration: "2h15", price: 145, popular: true },
      { name: "Cil à cil classique", duration: "1h30", price: 110 },
      { name: "Rehaussement de cils", duration: "1h", price: 85, popular: true },
      { name: "Brow lift", duration: "45 min", price: 70 },
      { name: "Pose gel ongles", duration: "1h15", price: 65 },
    ],
    gallery: [
      g("sarah-beauty", 1, "cils", "Volume russe glamour", true),
      g("sarah-beauty", 2, "cils", "Effet eyeliner"),
      g("sarah-beauty", 3, "sourcils", "Brow lift naturel", true),
      g("sarah-beauty", 4, "ongles", "French nude"),
      g("sarah-beauty", 5, "cils", "Mega volume soirée"),
      g("sarah-beauty", 6, "sourcils", "Restructuration"),
    ],
    stories: [
      { id: "s1", category: "cils", seed: 10, caption: "Réalisation du jour 🪶", kind: "realisation" },
      { id: "s2", category: "cils", seed: 22, caption: "Avant / Après volume russe", kind: "before-after" },
      { id: "s3", category: "sourcils", seed: 31, caption: "-20% brow lift cette semaine", kind: "promo" },
    ],
    reviewsList: [
      { author: "Camille R.", rating: 5, text: "Le plus beau regard de ma vie. Sarah est une artiste, le studio est magnifique.", when: "il y a 3 jours" },
      { author: "Inès B.", rating: 5, text: "Volume russe parfait, tenue impeccable 4 semaines. Je ne vais plus ailleurs.", when: "il y a 1 semaine" },
      { author: "Léa M.", rating: 4, text: "Très douce et minutieuse. Petit retard mais résultat sublime.", when: "il y a 2 semaines" },
    ],
    booking: ["internal", "whatsapp", "instagram"],
    whatsapp: "41790000001",
    instagram: "sarah.beauty",
  },
  {
    id: "c2",
    slug: "studio-lumi",
    name: "Studio Lumi",
    handle: "@studio.lumi",
    tagline: "Coiffure & balayage lumière",
    categories: ["coiffure"],
    rating: 4.8,
    reviews: 164,
    city: "Genève",
    mode: "salon",
    address: "Rue du Rhône 65, Genève",
    lat: 46.2041,
    lng: 6.1487,
    bio: "Coloriste passionnée par la lumière dans les cheveux. Balayage, blond polaire, soins botaniques. Un salon baigné de lumière au cœur de Genève.",
    avatarSeed: 80,
    coverSeed: 120,
    verified: true,
    services: [
      { name: "Balayage Blond", duration: "3h", price: 220, popular: true },
      { name: "Coupe & Brushing", duration: "1h", price: 90 },
      { name: "Soin botanique", duration: "45 min", price: 60 },
      { name: "Ombré hair", duration: "2h30", price: 190, popular: true },
    ],
    gallery: [
      g("studio-lumi", 1, "coiffure", "Balayage blond polaire", true),
      g("studio-lumi", 2, "coiffure", "Ombré caramel"),
      g("studio-lumi", 3, "coiffure", "Brushing wavy"),
      g("studio-lumi", 4, "coiffure", "Blond miel"),
    ],
    stories: [
      { id: "s1", category: "coiffure", seed: 5, caption: "Transformation blond ✨", kind: "before-after" },
      { id: "s2", category: "coiffure", seed: 18, caption: "2 créneaux libres demain", kind: "dispo" },
    ],
    reviewsList: [
      { author: "Sophie D.", rating: 5, text: "Mon balayage est exactement ce dont je rêvais. Lumineux et naturel.", when: "il y a 5 jours" },
      { author: "Marie T.", rating: 5, text: "Salon magnifique, accueil au top, café offert. Le blond est parfait.", when: "il y a 2 semaines" },
    ],
    booking: ["internal", "instagram"],
    instagram: "studio.lumi",
  },
  {
    id: "c3",
    slug: "nails-by-jade",
    name: "Nails by Jade",
    handle: "@nailsby.jade",
    tagline: "Nail artist mobile · Je me déplace",
    categories: ["ongles"],
    rating: 4.9,
    reviews: 142,
    city: "Nyon",
    mode: "mobile",
    zones: ["Nyon", "Gland", "Rolle", "Coppet"],
    radiusKm: 12,
    lat: 46.3833,
    lng: 6.2389,
    bio: "Je viens chez vous avec tout mon matériel pour un moment ongles cosy à la maison. Nail art, chrome, baby boomer. Week-ends entre copines bienvenus !",
    avatarSeed: 200,
    coverSeed: 230,
    services: [
      { name: "Pose gel + nail art", duration: "1h30", price: 75, popular: true },
      { name: "Baby boomer", duration: "1h20", price: 70 },
      { name: "Remplissage", duration: "1h", price: 55 },
      { name: "Chrome glaze", duration: "1h15", price: 68, popular: true },
    ],
    gallery: [
      g("nails-by-jade", 1, "ongles", "Chrome glazed donut"),
      g("nails-by-jade", 2, "ongles", "Baby boomer"),
      g("nails-by-jade", 3, "ongles", "Nail art floral"),
      g("nails-by-jade", 4, "ongles", "French micro"),
      g("nails-by-jade", 5, "ongles", "Rouge intense"),
    ],
    stories: [
      { id: "s1", category: "ongles", seed: 7, caption: "Tournée Nyon vendredi 💅", kind: "dispo" },
      { id: "s2", category: "ongles", seed: 14, caption: "Chrome de la semaine", kind: "realisation" },
    ],
    reviewsList: [
      { author: "Aline P.", rating: 5, text: "Trop pratique qu'elle vienne à la maison, et le résultat est canon !", when: "il y a 4 jours" },
      { author: "Noémie K.", rating: 5, text: "Le chrome tient hyper bien, super douce. On a fait ça entre copines.", when: "il y a 10 jours" },
    ],
    booking: ["whatsapp", "instagram"],
    whatsapp: "41790000003",
    instagram: "nailsby.jade",
  },
  {
    id: "c4",
    slug: "brow-house",
    name: "The Brow House",
    handle: "@thebrow.house",
    tagline: "Architecte du regard · Sourcils",
    categories: ["sourcils", "maquillage"],
    rating: 4.7,
    reviews: 98,
    city: "Lausanne",
    mode: "salon",
    address: "Av. de la Gare 33, Lausanne",
    lat: 46.5169,
    lng: 6.6291,
    bio: "Sourcils sur-mesure : restructuration, teinture henné, et maquillage longue tenue. Je dessine le sourcil qui sublime VOTRE visage.",
    avatarSeed: 300,
    coverSeed: 330,
    services: [
      { name: "Restructuration + teinture", duration: "50 min", price: 65, popular: true },
      { name: "Brow lamination", duration: "1h", price: 80, popular: true },
      { name: "Maquillage jour", duration: "45 min", price: 70 },
      { name: "Maquillage soirée", duration: "1h", price: 95 },
    ],
    gallery: [
      g("brow-house", 1, "sourcils", "Lamination naturelle", true),
      g("brow-house", 2, "sourcils", "Teinture henné"),
      g("brow-house", 3, "maquillage", "Make-up glowy"),
      g("brow-house", 4, "maquillage", "Smokey doux"),
    ],
    stories: [
      { id: "s1", category: "sourcils", seed: 9, caption: "Brow lamination ✨", kind: "before-after" },
    ],
    reviewsList: [
      { author: "Clara V.", rating: 5, text: "Mes sourcils n'ont jamais été aussi bien dessinés. Un vrai talent.", when: "il y a 6 jours" },
      { author: "Yasmine A.", rating: 4, text: "Lamination top, effet wahou. Je reviendrai pour le maquillage.", when: "il y a 3 semaines" },
    ],
    booking: ["internal", "whatsapp"],
    whatsapp: "41790000004",
    instagram: "thebrow.house",
  },
  {
    id: "c5",
    slug: "glow-by-maya",
    name: "Glow by Maya",
    handle: "@glow.maya",
    tagline: "MUA mobile · Mariées & événements",
    categories: ["maquillage", "cils"],
    rating: 5.0,
    reviews: 76,
    city: "Genève",
    mode: "mobile",
    zones: ["Genève", "Carouge", "Versoix", "Meyrin"],
    radiusKm: 15,
    lat: 46.2044,
    lng: 6.1432,
    bio: "Make-up artist spécialisée mariées. Je me déplace sur votre lieu le jour J pour un teint lumineux qui tient du matin au dernier slow. Essai inclus.",
    avatarSeed: 44,
    coverSeed: 60,
    verified: true,
    services: [
      { name: "Maquillage mariée + essai", duration: "2h", price: 280, popular: true },
      { name: "Maquillage soirée", duration: "1h", price: 120 },
      { name: "Pose cils bande", duration: "20 min", price: 35 },
      { name: "Cours auto-maquillage", duration: "1h30", price: 150 },
    ],
    gallery: [
      g("glow-by-maya", 1, "maquillage", "Teint glowy mariée"),
      g("glow-by-maya", 2, "maquillage", "Bronze soirée"),
      g("glow-by-maya", 3, "cils", "Regard intense"),
      g("glow-by-maya", 4, "maquillage", "Nude lumineux"),
    ],
    stories: [
      { id: "s1", category: "maquillage", seed: 3, caption: "Mariée du week-end 👰", kind: "realisation" },
      { id: "s2", category: "maquillage", seed: 28, caption: "Dispo pour la saison des mariages", kind: "dispo" },
    ],
    reviewsList: [
      { author: "Élodie F.", rating: 5, text: "Maya a rendu mon mariage parfait. Tenue 14h, zéro retouche. Magique.", when: "il y a 1 semaine" },
      { author: "Sandra L.", rating: 5, text: "Douce, à l'écoute, ultra pro. Le teint le plus beau que j'aie jamais eu.", when: "il y a 1 mois" },
    ],
    booking: ["whatsapp", "instagram", "internal"],
    whatsapp: "41790000005",
    instagram: "glow.maya",
  },
  {
    id: "c6",
    slug: "lash-lab-vevey",
    name: "Lash Lab",
    handle: "@lashlab.vevey",
    tagline: "Extensions de cils · Vevey",
    categories: ["cils", "sourcils"],
    rating: 4.8,
    reviews: 131,
    city: "Vevey",
    mode: "salon",
    address: "Rue du Lac 8, Vevey",
    lat: 46.4612,
    lng: 6.8431,
    bio: "Le laboratoire du cil parfait face au lac. Mega volume, wet look, hybrides. Formations également disponibles pour futures lash artists.",
    avatarSeed: 150,
    coverSeed: 175,
    services: [
      { name: "Mega volume", duration: "2h30", price: 160, popular: true },
      { name: "Hybride", duration: "2h", price: 135 },
      { name: "Wet look", duration: "2h", price: 140, popular: true },
      { name: "Dépose + repose", duration: "2h45", price: 170 },
    ],
    gallery: [
      g("lash-lab-vevey", 1, "cils", "Mega volume", true),
      g("lash-lab-vevey", 2, "cils", "Wet look"),
      g("lash-lab-vevey", 3, "cils", "Hybride doux"),
      g("lash-lab-vevey", 4, "sourcils", "Teinture"),
    ],
    stories: [
      { id: "s1", category: "cils", seed: 11, caption: "Wet look face au lac 🌊", kind: "realisation" },
    ],
    reviewsList: [
      { author: "Tania G.", rating: 5, text: "Wet look sublime, on dirait des faux-cils tellement c'est fourni. Bravo.", when: "il y a 2 jours" },
      { author: "Rania S.", rating: 4, text: "Très belle pose, salon avec vue. Un peu cher mais ça les vaut.", when: "il y a 2 semaines" },
    ],
    booking: ["internal", "instagram"],
    instagram: "lashlab.vevey",
  },
  {
    id: "c7",
    slug: "hair-atelier-morges",
    name: "Atelier Hair",
    handle: "@atelier.hair",
    tagline: "Coiffure responsable · Morges",
    categories: ["coiffure"],
    rating: 4.6,
    reviews: 89,
    city: "Morges",
    mode: "salon",
    address: "Grand-Rue 54, Morges",
    lat: 46.5101,
    lng: 6.4978,
    bio: "Coiffure clean & responsable. Coupes architecturées, colorations végétales, conseils anti-casse. Un atelier engagé et chaleureux à Morges.",
    avatarSeed: 250,
    coverSeed: 280,
    services: [
      { name: "Coupe signature", duration: "1h", price: 85, popular: true },
      { name: "Coloration végétale", duration: "2h", price: 130 },
      { name: "Soin reconstructeur", duration: "40 min", price: 55 },
    ],
    gallery: [
      g("hair-atelier-morges", 1, "coiffure", "Coupe carré"),
      g("hair-atelier-morges", 2, "coiffure", "Couleur végétale"),
      g("hair-atelier-morges", 3, "coiffure", "Wavy naturel"),
    ],
    stories: [
      { id: "s1", category: "coiffure", seed: 16, caption: "Coupe du jour ✂️", kind: "realisation" },
    ],
    reviewsList: [
      { author: "Pauline H.", rating: 5, text: "Enfin une coiffeuse qui écoute. Coupe parfaite, démarche responsable.", when: "il y a 1 semaine" },
    ],
    booking: ["internal", "whatsapp"],
    whatsapp: "41790000007",
    instagram: "atelier.hair",
  },
  {
    id: "c8",
    slug: "belle-mobile",
    name: "Belle à Domicile",
    handle: "@belle.domicile",
    tagline: "Beauté mobile complète · Région",
    categories: ["ongles", "cils", "maquillage"],
    rating: 4.7,
    reviews: 110,
    city: "Gland",
    mode: "mobile",
    zones: ["Gland", "Nyon", "Rolle", "Morges", "Aubonne"],
    radiusKm: 18,
    lat: 46.4189,
    lng: 6.2697,
    bio: "Le salon qui vient à vous. Ongles, cils, maquillage : tout votre rituel beauté à domicile, idéal pour les mamans pressées et les EVJF.",
    avatarSeed: 99,
    coverSeed: 130,
    services: [
      { name: "Pose gel à domicile", duration: "1h30", price: 80, popular: true },
      { name: "Rehaussement cils", duration: "1h", price: 90 },
      { name: "Maquillage express", duration: "40 min", price: 75 },
      { name: "Forfait EVJF (groupe)", duration: "sur devis", price: 250, popular: true },
    ],
    gallery: [
      g("belle-mobile", 1, "ongles", "Set nude à domicile"),
      g("belle-mobile", 2, "cils", "Rehaussement"),
      g("belle-mobile", 3, "maquillage", "Make-up express"),
      g("belle-mobile", 4, "ongles", "Glitter EVJF"),
    ],
    stories: [
      { id: "s1", category: "ongles", seed: 21, caption: "EVJF du week-end 🥂", kind: "realisation" },
      { id: "s2", category: "maquillage", seed: 33, caption: "Tournée Rolle jeudi", kind: "dispo" },
    ],
    reviewsList: [
      { author: "Mélanie C.", rating: 5, text: "Elle est venue pour mon EVJF, toutes les copines étaient ravies !", when: "il y a 5 jours" },
      { author: "Jessica N.", rating: 4, text: "Super pratique à domicile, ponctuelle et soignée.", when: "il y a 3 semaines" },
    ],
    booking: ["whatsapp", "instagram"],
    whatsapp: "41790000008",
    instagram: "belle.domicile",
  },
];

export const getCreator = (slug: string) =>
  CREATORS.find((c) => c.slug === slug);

// ── Feed immersif ────────────────────────────────────────────
export interface FeedItem {
  id: string;
  creatorSlug: string;
  media: MediaItem;
  caption: string;
  likes: number;
}

export const FEED: FeedItem[] = [
  { id: "f1", creatorSlug: "sarah-beauty", media: CREATORS[0].gallery[0], caption: "Volume russe glamour pour un regard de biche 🦌 Tenue garantie 4 semaines.", likes: 1243 },
  { id: "f2", creatorSlug: "studio-lumi", media: CREATORS[1].gallery[0], caption: "Du brun au blond polaire en une séance ✨ Glissez pour voir la transformation.", likes: 2087 },
  { id: "f3", creatorSlug: "nails-by-jade", media: CREATORS[2].gallery[0], caption: "Chrome glazed donut 🍩 La tendance ongles de la saison, à domicile.", likes: 1762 },
  { id: "f4", creatorSlug: "glow-by-maya", media: CREATORS[4].gallery[0], caption: "Teint glowy mariée qui tient 14h 👰 Essai inclus, je me déplace.", likes: 3019 },
  { id: "f5", creatorSlug: "brow-house", media: CREATORS[3].gallery[0], caption: "Brow lamination : l'effet sourcils peignés sans effort 🤎", likes: 1108 },
  { id: "f6", creatorSlug: "lash-lab-vevey", media: CREATORS[5].gallery[1], caption: "Wet look face au lac 🌊 On dirait des faux-cils, c'est nos extensions.", likes: 1531 },
  { id: "f7", creatorSlug: "belle-mobile", media: CREATORS[7].gallery[3], caption: "Glitter set pour l'EVJF de la team 🥂 La beauté vient à vous.", likes: 942 },
  { id: "f8", creatorSlug: "hair-atelier-morges", media: CREATORS[6].gallery[0], caption: "Coupe carré structuré, coloration 100% végétale 🌿", likes: 718 },
];

// ── Tendances ────────────────────────────────────────────────
export interface Trend {
  rank: number;
  name: string;
  category: CategoryKey;
  growth: string;
  seed: number;
}

export const TRENDS: Trend[] = [
  { rank: 1, name: "Brow Lamination", category: "sourcils", growth: "+128%", seed: 14 },
  { rank: 2, name: "Volume Russe", category: "cils", growth: "+92%", seed: 33 },
  { rank: 3, name: "Balayage Blond", category: "coiffure", growth: "+74%", seed: 51 },
  { rank: 4, name: "Chrome Glaze", category: "ongles", growth: "+66%", seed: 8 },
  { rank: 5, name: "Teint Glowy", category: "maquillage", growth: "+58%", seed: 27 },
  { rank: 6, name: "Wet Look Cils", category: "cils", growth: "+41%", seed: 19 },
];

// ── Inspiration (grille Pinterest) ───────────────────────────
export const INSPIRATIONS: MediaItem[] = CREATORS.flatMap((c) =>
  c.gallery.map((m) => ({ ...m }))
);
