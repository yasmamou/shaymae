# 🎀 Shaymae

> **« Découvrez les meilleures créatrices beauté autour de vous. »**
> Le Pinterest / TikTok géolocalisé de la beauté.

Shaymae réunit l'inspiration visuelle d'Instagram & Pinterest, le format immersif de TikTok
et la dimension locale de Google Maps — dans un univers beauté premium, doux et féminin.

📄 Vision produit & direction artistique complètes : [`SHAYMAE.md`](./SHAYMAE.md)

## ✨ Fonctionnalités

- **Feed immersif** plein écran façon TikTok (`/`) — stories, double-tap, avant/après natif
- **Carte interactive** (`/carte`) — créatrices géolocalisées, filtres catégorie + mode **Salon / Se déplace** (zones & rayon d'action)
- **Stories** — avant/après, réalisations, promos, disponibilités
- **Portfolio** (`/pro/[slug]`) — mini-site : services, galerie, avis, réservation
- **Réservation 1 clic** — WhatsApp · Instagram · Réservation interne
- **Avant / Après** natif avec curseur interactif
- **Tendances** (`/decouvrir`) — prestations populaires près de chez vous
- **Inspiration** (`/favoris`) — board type Pinterest, sauvegarde locale

## 🛠 Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 ·
Leaflet / react-leaflet (carte OSM, sans clé API) · Motion · déploiement Vercel.

Les visuels sont **génératifs** (dégradés thématiques par catégorie) : aucune image externe,
jamais d'image cassée, rendu 100 % « on brand ».

## 🚀 Démarrage

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

> Node ≥ 20.9 requis.

## 🗂 Structure

```
src/
  app/                  routes (feed, carte, decouvrir, favoris, pro/[slug])
  components/           BottomNav, Stories, FeedCard, BeforeAfterSlider,
                        ProMap, ProCard, BookingButton, SaveButton, …
  lib/data.ts           modèle de données + mock (créatrices, feed, tendances)
  lib/Media.tsx         visuels & avatars génératifs
```

---

🤖 Conçu avec [Claude Code](https://claude.com/claude-code)
