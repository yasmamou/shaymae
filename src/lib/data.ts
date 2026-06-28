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
  region: "Montpellier" | "Léman";
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
    region: "Léman",
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
    region: "Léman",
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
    region: "Léman",
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
    region: "Léman",
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
    region: "Léman",
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
    region: "Léman",
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
    region: "Léman",
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
    region: "Léman",
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

  // ── Montpellier ──────────────────────────────────────────────
  {
    id: "m1",
    slug: "maison-lila",
    name: "Maison Lila",
    handle: "@maison.lila",
    tagline: "Lash & brow artist · Place de la Comédie",
    categories: ["cils", "sourcils"],
    rating: 4.9,
    reviews: 187,
    city: "Montpellier",
    region: "Montpellier",
    mode: "salon",
    address: "Place de la Comédie 4, Montpellier",
    lat: 43.6085,
    lng: 3.8796,
    bio: "Le repère beauté du regard en plein cœur de Montpellier. Volume russe, rehaussement, brow lamination. Un écrin doux à deux pas de la Comédie.",
    avatarSeed: 18,
    coverSeed: 52,
    verified: true,
    services: [
      { name: "Volume Russe", duration: "2h15", price: 89, popular: true },
      { name: "Rehaussement de cils", duration: "1h", price: 55, popular: true },
      { name: "Brow lamination", duration: "1h", price: 49 },
      { name: "Teinture sourcils", duration: "30 min", price: 25 },
    ],
    gallery: [
      g("maison-lila", 1, "cils", "Volume russe intense", true),
      g("maison-lila", 2, "sourcils", "Brow lamination", true),
      g("maison-lila", 3, "cils", "Rehaussement naturel"),
      g("maison-lila", 4, "sourcils", "Teinture henné"),
      g("maison-lila", 5, "cils", "Effet eyeliner"),
    ],
    stories: [
      { id: "s1", category: "cils", seed: 13, caption: "Volume russe du jour 🪶", kind: "realisation" },
      { id: "s2", category: "sourcils", seed: 24, caption: "Avant / Après lamination", kind: "before-after" },
      { id: "s3", category: "cils", seed: 35, caption: "Créneaux libres samedi", kind: "dispo" },
    ],
    reviewsList: [
      { author: "Manon L.", rating: 5, text: "La meilleure de Montpellier ! Mon regard est sublimé, tenue parfaite.", when: "il y a 2 jours" },
      { author: "Sarah B.", rating: 5, text: "Salon magnifique en plein centre, accueil adorable. Je recommande à 100%.", when: "il y a 1 semaine" },
      { author: "Chloé D.", rating: 4, text: "Très belle pose, ponctuelle. Parfait avant les vacances.", when: "il y a 3 semaines" },
    ],
    booking: ["internal", "whatsapp", "instagram"],
    whatsapp: "33600000011",
    instagram: "maison.lila",
  },
  {
    id: "m2",
    slug: "nails-marianne",
    name: "Nails Studio Marianne",
    handle: "@nails.marianne",
    tagline: "Nail art & gel · Port Marianne",
    categories: ["ongles"],
    rating: 4.8,
    reviews: 156,
    city: "Montpellier",
    region: "Montpellier",
    mode: "salon",
    address: "Avenue Raymond Dugrand 12, Port Marianne, Montpellier",
    lat: 43.6019,
    lng: 3.8967,
    bio: "Studio ongles design à Port Marianne. Gel, chrome, baby boomer et nail art sur-mesure. Hygiène irréprochable, ambiance cosy et moderne.",
    avatarSeed: 210,
    coverSeed: 240,
    verified: true,
    services: [
      { name: "Pose gel + nail art", duration: "1h30", price: 45, popular: true },
      { name: "Baby boomer", duration: "1h20", price: 42 },
      { name: "Chrome glaze", duration: "1h15", price: 40, popular: true },
      { name: "Remplissage", duration: "1h", price: 35 },
    ],
    gallery: [
      g("nails-marianne", 1, "ongles", "Chrome glazed"),
      g("nails-marianne", 2, "ongles", "Baby boomer"),
      g("nails-marianne", 3, "ongles", "Nail art floral"),
      g("nails-marianne", 4, "ongles", "French micro"),
      g("nails-marianne", 5, "ongles", "Rouge intense"),
    ],
    stories: [
      { id: "s1", category: "ongles", seed: 6, caption: "Chrome de la semaine 💅", kind: "realisation" },
      { id: "s2", category: "ongles", seed: 17, caption: "-15% sur le nail art ce mois", kind: "promo" },
    ],
    reviewsList: [
      { author: "Léa P.", rating: 5, text: "Mes ongles tiennent 3 semaines sans broncher, le nail art est canon.", when: "il y a 4 jours" },
      { author: "Inès M.", rating: 4, text: "Très propre, designs au top. Parking facile à Port Marianne.", when: "il y a 2 semaines" },
    ],
    booking: ["internal", "whatsapp"],
    whatsapp: "33600000012",
    instagram: "nails.marianne",
  },
  {
    id: "m3",
    slug: "ines-makeup-mtp",
    name: "Inès Makeup",
    handle: "@ines.makeup.mtp",
    tagline: "MUA mobile · Mariées & soirées",
    categories: ["maquillage", "cils"],
    rating: 5.0,
    reviews: 92,
    city: "Montpellier",
    region: "Montpellier",
    mode: "mobile",
    zones: ["Montpellier", "Castelnau-le-Lez", "Lattes", "Pérols", "Juvignac"],
    radiusKm: 20,
    lat: 43.6112,
    lng: 3.8772,
    bio: "Make-up artist montpelliéraine spécialisée mariées et événements. Je me déplace sur tout le bassin de Thau et l'agglo pour un teint lumineux longue tenue.",
    avatarSeed: 46,
    coverSeed: 64,
    verified: true,
    services: [
      { name: "Maquillage mariée + essai", duration: "2h", price: 220, popular: true },
      { name: "Maquillage soirée", duration: "1h", price: 75 },
      { name: "Pose cils à bande", duration: "20 min", price: 25 },
      { name: "Cours auto-maquillage", duration: "1h30", price: 90 },
    ],
    gallery: [
      g("ines-makeup-mtp", 1, "maquillage", "Teint glowy mariée"),
      g("ines-makeup-mtp", 2, "maquillage", "Bronze soirée"),
      g("ines-makeup-mtp", 3, "cils", "Regard intense"),
      g("ines-makeup-mtp", 4, "maquillage", "Nude lumineux"),
    ],
    stories: [
      { id: "s1", category: "maquillage", seed: 4, caption: "Mariée du week-end 👰", kind: "realisation" },
      { id: "s2", category: "maquillage", seed: 29, caption: "Dispo saison des mariages 2026", kind: "dispo" },
    ],
    reviewsList: [
      { author: "Marine F.", rating: 5, text: "Inès a sublimé mon mariage, tenue toute la journée sous la chaleur de l'Hérault !", when: "il y a 6 jours" },
      { author: "Julie R.", rating: 5, text: "Douce, pro, à l'écoute. Le plus beau teint que j'aie jamais eu.", when: "il y a 1 mois" },
    ],
    booking: ["whatsapp", "instagram", "internal"],
    whatsapp: "33600000013",
    instagram: "ines.makeup.mtp",
  },
  {
    id: "m4",
    slug: "blond-atelier-mtp",
    name: "Blond Atelier",
    handle: "@blond.atelier.mtp",
    tagline: "Coloriste blond & balayage · Écusson",
    categories: ["coiffure"],
    rating: 4.7,
    reviews: 134,
    city: "Montpellier",
    region: "Montpellier",
    mode: "salon",
    address: "Rue Foch 8, Écusson, Montpellier",
    lat: 43.6112,
    lng: 3.8736,
    bio: "Spécialiste du blond dans le quartier historique de l'Écusson. Balayage, blond polaire, ombré et soins sur-mesure pour des cheveux lumineux toute l'année.",
    avatarSeed: 260,
    coverSeed: 290,
    services: [
      { name: "Balayage Blond", duration: "3h", price: 120, popular: true },
      { name: "Coupe & Brushing", duration: "1h", price: 45 },
      { name: "Ombré hair", duration: "2h30", price: 110, popular: true },
      { name: "Soin botanique", duration: "40 min", price: 35 },
    ],
    gallery: [
      g("blond-atelier-mtp", 1, "coiffure", "Balayage blond polaire", true),
      g("blond-atelier-mtp", 2, "coiffure", "Ombré caramel"),
      g("blond-atelier-mtp", 3, "coiffure", "Blond miel"),
      g("blond-atelier-mtp", 4, "coiffure", "Brushing wavy"),
    ],
    stories: [
      { id: "s1", category: "coiffure", seed: 8, caption: "Transformation blond ✨", kind: "before-after" },
    ],
    reviewsList: [
      { author: "Camille V.", rating: 5, text: "Enfin le blond de mes rêves à Montpellier, lumineux et pas abîmé.", when: "il y a 3 jours" },
      { author: "Nawel S.", rating: 4, text: "Super coloriste, salon dans l'Écusson très agréable.", when: "il y a 2 semaines" },
    ],
    booking: ["internal", "instagram"],
    instagram: "blond.atelier.mtp",
  },
  {
    id: "m5",
    slug: "brow-bar-mtp",
    name: "Brow Bar MTP",
    handle: "@browbar.mtp",
    tagline: "Sourcils & maquillage à domicile",
    categories: ["sourcils", "maquillage", "ongles"],
    rating: 4.8,
    reviews: 78,
    city: "Montpellier",
    region: "Montpellier",
    mode: "mobile",
    zones: ["Montpellier", "Lattes", "Pérols", "Mauguio", "Castelnau-le-Lez"],
    radiusKm: 18,
    lat: 43.605,
    lng: 3.889,
    bio: "Le bar à sourcils qui vient à vous. Restructuration, lamination, teinture et maquillage express à domicile — idéal mamans pressées et EVJF montpelliéraines.",
    avatarSeed: 105,
    coverSeed: 135,
    services: [
      { name: "Restructuration + teinture", duration: "50 min", price: 39, popular: true },
      { name: "Brow lamination", duration: "1h", price: 49, popular: true },
      { name: "Maquillage express", duration: "40 min", price: 45 },
      { name: "Forfait EVJF (groupe)", duration: "sur devis", price: 180 },
    ],
    gallery: [
      g("brow-bar-mtp", 1, "sourcils", "Lamination naturelle", true),
      g("brow-bar-mtp", 2, "sourcils", "Teinture henné"),
      g("brow-bar-mtp", 3, "maquillage", "Make-up glowy"),
      g("brow-bar-mtp", 4, "ongles", "Set nude à domicile"),
    ],
    stories: [
      { id: "s1", category: "sourcils", seed: 12, caption: "Lamination à domicile ✨", kind: "realisation" },
      { id: "s2", category: "maquillage", seed: 30, caption: "Tournée Lattes jeudi", kind: "dispo" },
    ],
    reviewsList: [
      { author: "Sofia K.", rating: 5, text: "Elle est venue pour mon EVJF, toutes les filles ont adoré ! Sourcils parfaits.", when: "il y a 5 jours" },
      { author: "Émilie T.", rating: 4, text: "Pratique à domicile, ponctuelle et douce.", when: "il y a 3 semaines" },
    ],
    booking: ["whatsapp", "instagram"],
    whatsapp: "33600000015",
    instagram: "browbar.mtp",
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

const gal = (slug: string, i = 0) => getCreator(slug)!.gallery[i];

export const FEED: FeedItem[] = [
  { id: "fm1", creatorSlug: "maison-lila", media: gal("maison-lila", 0), caption: "Volume russe intense en plein cœur de Montpellier 🪶 Glissez pour l'avant/après.", likes: 1876 },
  { id: "fm2", creatorSlug: "ines-makeup-mtp", media: gal("ines-makeup-mtp", 0), caption: "Teint glowy mariée qui tient sous le soleil de l'Hérault 👰 Je me déplace sur l'agglo.", likes: 2410 },
  { id: "fm3", creatorSlug: "nails-marianne", media: gal("nails-marianne", 0), caption: "Chrome glaze à Port Marianne 💅 La tendance ongles du moment.", likes: 1644 },
  { id: "fm4", creatorSlug: "blond-atelier-mtp", media: gal("blond-atelier-mtp", 0), caption: "Balayage blond polaire dans l'Écusson ✨ Du brun au blond en une séance.", likes: 1320 },
  { id: "fm5", creatorSlug: "brow-bar-mtp", media: gal("brow-bar-mtp", 0), caption: "Brow lamination à domicile à Montpellier 🤎 Sourcils peignés, zéro effort.", likes: 988 },
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

// ── Villes / régions (sélecteur) ─────────────────────────────
export type RegionKey = "all" | "Montpellier" | "Léman";

export interface CityOption {
  key: RegionKey;
  label: string;
  center: [number, number];
  zoom: number;
}

export const CITIES: CityOption[] = [
  { key: "Montpellier", label: "Montpellier", center: [43.61, 3.877], zoom: 13 },
  { key: "Léman", label: "Lac Léman", center: [46.45, 6.35], zoom: 10 },
  { key: "all", label: "Partout", center: [45.0, 5.1], zoom: 6 },
];

export const cityOf = (k: RegionKey) => CITIES.find((c) => c.key === k)!;

// ── Taxonomie des prestations (recherche) ────────────────────
// Chaque prestation pointe vers une catégorie « visuelle » de base
// (pour les images/dégradés), tout en restant cherchable précisément.
export interface Prestation {
  key: string;
  label: string;
  base: CategoryKey;
  emoji: string;
}

export const PRESTATIONS: Prestation[] = [
  { key: "onglerie", label: "Onglerie", base: "ongles", emoji: "💅" },
  { key: "extensions-cils", label: "Extensions de cils", base: "cils", emoji: "🪶" },
  { key: "rehaussement-cils", label: "Rehaussement de cils", base: "cils", emoji: "👁️" },
  { key: "brow-lift", label: "Brow Lift", base: "sourcils", emoji: "🤎" },
  { key: "maquillage-permanent", label: "Maquillage permanent", base: "maquillage", emoji: "✒️" },
  { key: "maquillage", label: "Maquillage", base: "maquillage", emoji: "💄" },
  { key: "coiffure", label: "Coiffure", base: "coiffure", emoji: "💇‍♀️" },
  { key: "extensions-cheveux", label: "Extensions de cheveux", base: "coiffure", emoji: "💁‍♀️" },
  { key: "tape-in", label: "Tape-In", base: "coiffure", emoji: "🎀" },
  { key: "weft", label: "Weft", base: "coiffure", emoji: "🧵" },
  { key: "strass-dentaires", label: "Strass dentaires", base: "maquillage", emoji: "💎" },
  { key: "blanchiment-dentaire", label: "Blanchiment dentaire", base: "maquillage", emoji: "🦷" },
  { key: "regard", label: "Esthétique du regard", base: "cils", emoji: "✨" },
  { key: "formation", label: "Formation", base: "maquillage", emoji: "🎓" },
];

export const prestationOf = (k: string) => PRESTATIONS.find((p) => p.key === k);

// ── Disponibilités (génération déterministe de créneaux) ─────
export interface DaySlots {
  date: string; // ISO yyyy-mm-dd
  dayLabel: string;
  slots: string[]; // ex. "09:30"
}

const DAY_NAMES = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
const ALL_SLOTS = ["09:00", "09:30", "10:30", "11:30", "14:00", "15:00", "16:00", "17:00", "18:00"];

/** Créneaux fictifs mais stables pour une créatrice, à partir d'une date de référence (ms). */
export function availabilityFor(creator: Creator, fromMs: number, days = 7): DaySlots[] {
  const seed = creator.slug.length + creator.reviews;
  const out: DaySlots[] = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(fromMs + i * 86400000);
    const dow = d.getUTCDay();
    // dimanche souvent fermé
    const closed = dow === 0 && (seed + i) % 2 === 0;
    const slots = closed
      ? []
      : ALL_SLOTS.filter((_, k) => (seed + i * 3 + k * 5) % 3 !== 0);
    out.push({
      date: d.toISOString().slice(0, 10),
      dayLabel: `${DAY_NAMES[dow]} ${d.getUTCDate()}`,
      slots,
    });
  }
  return out;
}

/** Première date avec au moins un créneau (libellé court). */
export function nextAvailability(creator: Creator, fromMs: number): string {
  const a = availabilityFor(creator, fromMs, 7).find((d) => d.slots.length > 0);
  return a ? `${a.dayLabel} · ${a.slots[0]}` : "Sur demande";
}

// ── Formations ───────────────────────────────────────────────
export interface Formation {
  id: string;
  slug: string;
  title: string;
  trainer: string;
  base: CategoryKey;
  city: string;
  region: RegionKey;
  durationDays: number;
  price: number;
  rating: number;
  reviews: number;
  level: "Initiation" | "Perfectionnement" | "Expert";
  certified: boolean;
  seed: number;
  program: string[];
}

export const FORMATIONS: Formation[] = [
  {
    id: "fo1", slug: "volume-russe-pro", title: "Volume Russe — Certification Pro",
    trainer: "Maison Lila", base: "cils", city: "Montpellier", region: "Montpellier",
    durationDays: 2, price: 690, rating: 4.9, reviews: 64, level: "Perfectionnement",
    certified: true, seed: 21,
    program: ["Théorie du cil & morphologie", "Hygiène & sécurité", "Création de bouquets 2D-6D", "Pose sur modèle", "Examen & certificat"],
  },
  {
    id: "fo2", slug: "nail-art-avance", title: "Nail Art Avancé & Chrome",
    trainer: "Nails Studio Marianne", base: "ongles", city: "Montpellier", region: "Montpellier",
    durationDays: 1, price: 320, rating: 4.8, reviews: 41, level: "Perfectionnement",
    certified: true, seed: 8,
    program: ["Préparation de l'ongle", "Techniques chrome & glaze", "Nail art freehand", "Pratique sur modèle"],
  },
  {
    id: "fo3", slug: "brow-lift-initiation", title: "Brow Lift & Lamination — Initiation",
    trainer: "The Brow House", base: "sourcils", city: "Lausanne", region: "Léman",
    durationDays: 1, price: 380, rating: 4.7, reviews: 33, level: "Initiation",
    certified: true, seed: 14,
    program: ["Analyse du sourcil", "Produits & temps de pose", "Lamination pas à pas", "Teinture", "Certificat"],
  },
  {
    id: "fo4", slug: "balayage-blond", title: "Balayage Blond & Techniques de lumière",
    trainer: "Blond Atelier", base: "coiffure", city: "Montpellier", region: "Montpellier",
    durationDays: 2, price: 540, rating: 4.8, reviews: 28, level: "Perfectionnement",
    certified: true, seed: 51,
    program: ["Théorie de la couleur", "Mèches & balayage", "Patine & toning", "Pratique sur modèle"],
  },
  {
    id: "fo5", slug: "maquillage-mariee", title: "Maquillage Mariée Longue Tenue",
    trainer: "Glow by Maya", base: "maquillage", city: "Genève", region: "Léman",
    durationDays: 2, price: 620, rating: 5.0, reviews: 47, level: "Expert",
    certified: true, seed: 27,
    program: ["Préparation de peau", "Teint longue tenue", "Regard & cils", "Shooting & portfolio", "Certificat"],
  },
  {
    id: "fo6", slug: "extensions-tape-in", title: "Extensions Tape-In & Weft",
    trainer: "Atelier Hair", base: "coiffure", city: "Morges", region: "Léman",
    durationDays: 1, price: 410, rating: 4.6, reviews: 19, level: "Initiation",
    certified: false, seed: 35,
    program: ["Poses Tape-In", "Technique Weft", "Entretien & dépose", "Conseils client"],
  },
];

export const getFormation = (slug: string) => FORMATIONS.find((f) => f.slug === slug);

// ── Recherche ────────────────────────────────────────────────
export interface SearchFilters {
  query: string;
  base: CategoryKey | "all";
  region: RegionKey;
  mode: "all" | "salon" | "mobile";
  maxPrice: number | null;
  minRating: number;
  verifiedOnly: boolean;
}

// ── Données dashboard prestataire (mock) ─────────────────────
export interface StudioClient {
  name: string;
  visits: number;
  loyal: boolean;
  lastService: string;
  note: string;
  preference: string;
}

export const STUDIO_CLIENTS: StudioClient[] = [
  { name: "Camille R.", visits: 9, loyal: true, lastService: "Volume Russe", note: "Yeux sensibles — patch doux.", preference: "Effet naturel" },
  { name: "Inès B.", visits: 6, loyal: true, lastService: "Rehaussement", note: "Vient toutes les 4 semaines.", preference: "Café offert ☕" },
  { name: "Léa M.", visits: 3, loyal: false, lastService: "Brow lift", note: "Préfère les RDV du soir.", preference: "Sourcils fournis" },
  { name: "Manon L.", visits: 12, loyal: true, lastService: "Volume Russe", note: "Allergie colle classique → colle sensitive.", preference: "Mega volume" },
  { name: "Chloé D.", visits: 1, loyal: false, lastService: "Teinture", note: "Nouvelle cliente.", preference: "—" },
  { name: "Sofia K.", visits: 5, loyal: true, lastService: "Lamination", note: "Toujours ponctuelle.", preference: "Effet peigné" },
];

const AGENDA_NAMES = ["Camille", "Inès", "Léa", "Manon", "Chloé", "Sofia", "Marine", "Julie", "Nawel", "Émilie"];
const AGENDA_SERVICES = [
  { name: "Volume Russe", color: "#e6b3b8" },
  { name: "Rehaussement", color: "#cda86b" },
  { name: "Brow lift", color: "#d3ddcf" },
  { name: "Pose gel", color: "#ddd5ec" },
  { name: "Maquillage", color: "#d9a48a" },
];

export interface Appointment {
  time: string;
  client: string;
  service: string;
  color: string;
  collaborator: string;
}
export interface AgendaDay {
  date: string;
  dayLabel: string;
  appointments: Appointment[];
}

const COLLABS = ["Vous", "Vous", "Vous", "Sarah (collab.)"];

export function studioAgenda(fromMs: number, days = 7): AgendaDay[] {
  const out: AgendaDay[] = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(fromMs + i * 86400000);
    const dow = d.getUTCDay();
    const n = dow === 0 ? 0 : ((i * 7 + 3) % 4) + 1; // 0 le dimanche, 1-4 sinon
    const appts: Appointment[] = [];
    for (let k = 0; k < n; k++) {
      const sIdx = (i * 3 + k * 2) % AGENDA_SERVICES.length;
      const hour = 9 + ((i + k * 3) % 8);
      appts.push({
        time: `${String(hour).padStart(2, "0")}:${k % 2 ? "30" : "00"}`,
        client: AGENDA_NAMES[(i * 2 + k) % AGENDA_NAMES.length],
        service: AGENDA_SERVICES[sIdx].name,
        color: AGENDA_SERVICES[sIdx].color,
        collaborator: COLLABS[(i + k) % COLLABS.length],
      });
    }
    appts.sort((a, b) => a.time.localeCompare(b.time));
    out.push({ date: d.toISOString().slice(0, 10), dayLabel: `${DAY_NAMES[dow]} ${d.getUTCDate()}`, appointments: appts });
  }
  return out;
}

export const STUDIO_STATS = {
  rdvWeek: 18,
  revenueMonth: 4280,
  fillRate: 82,
  cancelRate: 6,
  topServices: [
    { name: "Volume Russe", count: 42 },
    { name: "Rehaussement", count: 28 },
    { name: "Brow lift", count: 19 },
  ],
};

export function searchCreators(f: SearchFilters): Creator[] {
  const q = f.query.trim().toLowerCase();
  return CREATORS.filter((c) => {
    if (f.region !== "all" && c.region !== f.region) return false;
    if (f.base !== "all" && !c.categories.includes(f.base)) return false;
    if (f.mode !== "all" && c.mode !== f.mode) return false;
    if (f.verifiedOnly && !c.verified) return false;
    if (c.rating < f.minRating) return false;
    const minPrice = Math.min(...c.services.map((s) => s.price));
    if (f.maxPrice !== null && minPrice > f.maxPrice) return false;
    if (q) {
      const hay = [
        c.name, c.tagline, c.bio, c.city,
        ...c.services.map((s) => s.name),
        ...c.categories.map((k) => categoryOf(k).label),
        ...(c.zones ?? []),
      ].join(" ").toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}
