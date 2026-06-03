# 🎀 Shaymae

> **« Découvrez les meilleures créatrices beauté autour de vous. »**
>
> Le Pinterest / TikTok géolocalisé de la beauté.

Shaymae n'est pas un annuaire. Pas un Planity. C'est une **marque lifestyle féminine premium**
qui mélange l'inspiration visuelle d'Instagram & Pinterest, le format immersif de TikTok et
la dimension locale de Google Maps — dans un univers beauté doux, luxe et moderne.

---

## 🧭 Positionnement

| Aujourd'hui | Limite |
|---|---|
| Instagram | Visuel mais pas local |
| Google Maps | Local mais peu visuel |
| Planity | Réservation mais peu inspirant |

**Shaymae** réunit les trois : **découverte visuelle locale**.

---

## 🎨 Direction artistique

**Luxe, féminin, doux, premium, moderne. Pas bling-bling.**

| Rôle | Couleur |
|---|---|
| Principales | Rose poudré · Beige nude · Blanc cassé · Crème |
| Accent luxe | Doré champagne · Or rosé |
| Secondaires | Lavande pastel · Vert sauge très léger |

- **Typographie** : un serif display élégant (titres) + un sans-serif doux (texte).
- **Formes** : grands arrondis, ombres soufflées, dégradés poudrés.
- **Media** : visuels génératifs sur-mesure, dégradés thématiques par catégorie (jamais d'image cassée).

---

## ✨ Fonctionnalités

### 1. Écran d'accueil immersif (`/`)
Feed plein écran façon TikTok : extensions de cils, brow lift, ongles, coiffure, maquillage.
Stories en haut, carrousel vertical, double-tap pour aimer, slider avant/après natif.

### 2. Carte interactive (`/carte`) — cœur du produit
Carte Leaflet (OpenStreetMap) avec les créatrices géolocalisées.
Filtres par catégorie. Chaque pro : photo, note, nombre d'avis, distance.
**Deux modes** :
- **Salon** — adresse fixe.
- **Mobile** — « Je me déplace » : la pro définit ses zones (Lausanne, Genève, Nyon…) et son rayon d'action. Elle apparaît dans toute sa zone (vrai besoin du marché des indépendantes).

### 3. Stories
Chaque pro publie : avant/après, réalisations du jour, promos, disponibilités. Format Instagram.

### 4. Portfolio (`/pro/[slug]`)
Chaque profil = un mini-site : services, galerie photos/vidéos, note, avis, stories, CTA réservation.

### 5. Réservation — le moins de clics possible
1 clic → **WhatsApp**, **Instagram** ou **réservation interne**, selon le choix de la pro.

### 6. Avant / Après natif
Curseur interactif `Avant ←→ Après`. Les clientes adorent.

### 7. Tendances (`/decouvrir`)
« Les prestations les plus populaires près de chez vous » : Brow Lift, Russian Volume, Balayage Blond…

### 8. Inspiration (Pinterest intégré, `/favoris`)
La cliente sauvegarde ❤️ ses inspirations, puis les envoie à la professionnelle.

---

## 🗺️ Architecture technique

- **Next.js 16** (App Router) · **React 19** · **TypeScript**
- **Tailwind CSS v4** — design tokens Shaymae
- **Leaflet / react-leaflet** — carte (tuiles OSM, sans clé API)
- **Motion** — micro-animations premium
- **localStorage** — favoris (« Mes inspirations »)
- Couche **mock data** riche (créatrices, services, avis, stories, feed)
- Déploiement **Vercel**

### Routes
| Route | Écran |
|---|---|
| `/` | Feed immersif + Stories |
| `/carte` | Carte interactive + filtres + modes salon/mobile |
| `/decouvrir` | Tendances + grille d'inspiration |
| `/favoris` | Mes inspirations sauvegardées |
| `/pro/[slug]` | Portfolio / mini-site d'une créatrice |

### Composants clés
`BottomNav` · `StoriesBar` / `StoryViewer` · `FeedCard` · `BeforeAfterSlider` ·
`CategoryChips` · `ProCard` · `ProMap` · `BookingSheet` · `SaveButton` · `FavoritesProvider`

---

## 📐 Modèle de données (`src/lib/data.ts`)

```
Creator { id, slug, name, handle, categories[], rating, reviews,
          city, mode: 'salon' | 'mobile', zones[], lat, lng, radiusKm,
          bio, services[], gallery[], stories[], reviewsList[],
          booking { whatsapp?, instagram?, internal? }, tone }
FeedItem { id, creatorSlug, category, caption, kind: 'beforeafter' | 'photo', likes }
```

---

## 🚀 Démarrage

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
```

> Node ≥ 20.9 requis.

---

## 🌸 Roadmap produit (post-MVP)
- Réservation interne avec calendrier & acompte
- Messagerie cliente ↔ créatrice + envoi d'inspirations
- Vrai backend (auth, base de données, upload media, paiements)
- Vidéos natives plein écran (lecture auto)
- Recommandations « tendances près de chez vous » géolocalisées en temps réel
- App mobile (React Native / Expo)
