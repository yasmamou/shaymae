# 🗺️ Shaymae — Roadmap : Plateforme esthétique tout-en-un

> **Vision** : la première plateforme beauté qui réunit **réseau social visuel**,
> **réservation en ligne**, **gestion d'activité** et **formation**, dans une
> expérience simple et moderne — pour les clientes **et** les professionnelles.

**Principe directeur : rester épuré.** Beaucoup de fonctions, mais une interface
calme — onglets, sections claires, pas d'écran surchargé.

> ⚠️ Démo front-end : tout est simulé en `localStorage` (auth, réservations,
> messagerie, agenda…). Aucun backend pour l'instant — voir « Étape backend ».

---

## 1. Espace Cliente
- [x] Recherche de prestations : catégorie, mots-clés, prix, dispo, distance, dates proches, notes, vérifiés → `/recherche`
- [x] Catégories étendues (onglerie, cils, brow lift, rehaussement, maquillage permanent, coiffure, extensions, tape-in, weft, strass & blanchiment dentaires, regard, formation…)
- [x] Réservation simplifiée : nom, prénom, téléphone, créneau temps réel, acompte, confirmation → `/reserver/[slug]`
- [x] Historique des rendez-vous + « Reprendre rendez-vous » → `/rendez-vous`
- [x] Favoris (prestataires, prestations, inspirations) → `/favoris`
- [x] Messagerie intégrée (texte + photo) → `/messages`
- [x] Inspiration beauté (type Pinterest) → `/decouvrir`, `/favoris`

## 2. Réseau social intégré
- [x] Publications : photos, vidéos, avant/après, conseils, promos (feed + studio)
- [x] Stories temporaires (dispos, promos, nouveautés, réalisations)
- [x] Réservation depuis un contenu / une story (« Réserver cette prestation »)

## 3. Gestion Prestataire → `/studio`
- [x] Profil pro, galerie photo/vidéo, prestations, tarifs, horaires
- [x] Agenda : vue jour / 3 jours / semaine, couleurs par prestation
- [x] Disponibilités : jours, horaires, créneaux, blocages
- [x] Comptes secondaires (collaborateurs, agendas séparés, accès limité)
- [x] Historique client (prestations, notes privées, préférences, produits)

## 4. Gestion intelligente des RDV
- [x] Notifications automatiques (confirmation, rappel, modif, annulation) — simulées
- [x] Liste d'attente (alerte si place libérée)
- [x] Gestion des annulations + acomptes + politique configurable

## 5. Avis & confiance
- [x] Avis vérifiés (seuls les clients ayant réservé)
- [x] Badge vérifié (identité, activité, certifications)
- [x] Fidélisation : indicateur ⭐ « Cliente fidèle »

## 6. Statistiques professionnelles → `/studio` (onglet Aperçu)
- [x] RDV, chiffre d'affaires, taux de remplissage, top prestations, clientes fidèles, taux d'annulation

## 7. Moteur de recherche intelligent
- [x] Recherche par prestation, technique, marque, mot-clé, localisation, formation
- [x] Suggestions automatiques de professionnelles adaptées

## 8. Formation → `/formations`
- [x] Recherche, réservation, programme détaillé, formatrices vérifiées, certificats, avis

## 9. Géolocalisation → `/carte`
- [x] Prestataires autour de soi, plus proches/dispo/notés, distance & dispo immédiate

## 10. Multilingue
- [x] FR / EN / AR (RTL) / ES — sélecteur de langue, infrastructure i18n

## 11. Monétisation → `/abonnement`
- [x] Abonnement pro (gratuit limité / premium), mise en avant, commission optionnelle

---

## 🧱 Architecture (front-end, mock)
- **Next.js 16** · React 19 · TypeScript · Tailwind v4 · Leaflet · Motion
- Providers `localStorage` : `Auth`, `Favorites`, `Bookings`, `Messages`, `I18n`
- Données mock riches : `src/lib/data.ts` (créatrices, prestations, formations, créneaux)
- Médias : vraies photos Unsplash (par catégorie) + repli dégradé

## 🚀 Étape backend (post-démo)
Auth réelle + base de données + upload média + paiements (acomptes) + notifications
(email/SMS/push) + temps réel (messagerie, dispos) + i18n contenu + rôles & permissions.

---

### Suivi
Cette roadmap est vivante : chaque case cochée correspond à une surface livrée et
déployée sur https://shaymae.vercel.app. Les fonctions « intelligentes »
(notifications, suggestions, temps réel) sont simulées côté client en attendant le backend.
