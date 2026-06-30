# 📌 Shaymae — État du projet & plan d'action

> Document de synthèse. Pour la vision détaillée : [`SHAYMAE.md`](./SHAYMAE.md) ·
> la roadmap fonctionnelle : [`ROADMAP.md`](./ROADMAP.md) · le démarrage : [`README.md`](./README.md).

🌐 **En ligne :** https://shaymae.vercel.app · **Code :** https://github.com/yasmamou/shaymae

---

## 1. Le projet en une phrase
**Shaymae** = le **Pinterest / TikTok géolocalisé de la beauté** : une plateforme
féminine premium qui réunit **découverte visuelle**, **réservation en ligne**,
**gestion d'activité** pour les pros et **formation** — univers *marron profond,
rose baby, doré*.

## 2. Pile technique
Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 · Leaflet (carte) ·
Motion · déploiement Vercel · auto-déploiement à chaque push GitHub.

> ⚠️ **Statut actuel = démo front-end.** Tout ce qui ressemble à des « données »
> (comptes, réservations, messages, agenda, favoris, langue, stories publiées) est
> simulé dans le **navigateur** (`localStorage`). **Aucun serveur / base de données**
> pour l'instant → rien n'est partagé entre 2 appareils, rien n'est réellement payé
> ou envoyé. C'est le principal chantier restant (voir §4).

---

## 3. ✅ Ce qui est déjà fait

### Côté clientes
- Écran de **bienvenue** (connexion cliente/pro, ou « sans compte »)
- **Accueil épuré** : feed immersif + **Stories qui buzz** en avant + bouton **Suivre**
- **Recherche** affinée : filtre central, recherche de ville + **géolocalisation**, sections (où / domicile-institut / prestation, prix, note, vérifiées)
- **Réservation** : créneaux, coordonnées, acompte, confirmation → `/reserver/[slug]`
- **Mes rendez-vous** (+ « reprendre ») · **Messagerie** (texte/photo) · **Favoris**
- **Caméra + filtre signature « Glow Doré »** (bloom doré, poussière d'étoiles, avant/après, partage story/contacts)
- **Carte rendue secondaire** + bouton « Voir sur la carte » près de l'adresse

### Réseau social
- Publications, **stories**, **réservation depuis le contenu / la story**

### Côté prestataires (`/studio`, base posée)
- Dashboard à onglets : **Aperçu/Stats**, **Agenda** (jour/3j/semaine), **Publications**, **Prestations & horaires**, **Clientes**, **Équipe**

### Confiance & autres
- **Avis vérifiés**, badges **Vérifiée** & **Cliente fidèle**
- **Formations** (liste + détail + inscription) · **Abonnement** (gratuit/Premium)
- **Multilingue** FR/EN/AR (RTL)/ES · **Navigation persistante** (barre du bas + caméra dorée)

---

## 4. ❗ Ce qui manque maintenant (par priorité)

### 🔴 P1 — Finir l'expérience **prestataire** (prochaine étape annoncée)
La partie pro est aujourd'hui une **maquette** : il faut la rendre vraiment utilisable.
- [ ] Édition réelle du **profil pro** (photos de couverture, bio, réseaux)
- [ ] **Prestations / tarifs / durées** modifiables (CRUD) + **horaires & jours travaillés**
- [ ] **Disponibilités** : créneaux réels, blocages, congés
- [ ] **Agenda** alimenté par les vraies réservations clientes (pas des données fictives)
- [ ] **Fiche cliente** réelle (historique, notes privées, produits, préférences)
- [ ] **Collaboratrices** : agendas séparés + accès limité
- [ ] **Stats** calculées sur les vraies données

### 🔴 P2 — Le **backend** (le vrai manque structurel)
Sans lui, la plateforme reste une démo locale.
- [ ] **Auth réelle** (email + mot de passe / OAuth) et rôles cliente/pro
- [ ] **Base de données** (créatrices, prestations, réservations, messages, avis)
- [ ] **Upload média** réel (photos/vidéos des pros) au lieu des photos Unsplash
- [ ] **Paiements** / acomptes (Stripe) + politique d'annulation appliquée
- [ ] **Notifications** réelles : email / SMS / push (confirmation, rappel J-1)
- [ ] **Temps réel** : messagerie et disponibilités (websockets)
- [ ] **Liste d'attente** automatique réellement déclenchée

> Recommandation Vercel : base **Neon Postgres** + **auth (Clerk)** + **Vercel Blob**
> (upload) + **Stripe** + **Resend/Twilio** (notifs). Toutes intégrables via le Marketplace.

### 🟠 P3 — Recherche & découverte « intelligentes »
- [ ] Vrai calcul **distance / temps de trajet** + tri « plus proches / plus dispo »
- [ ] **Suggestions** personnalisées (selon favoris, historique, ville)
- [ ] Recherche par **technique / marque / mot-clé** sur données réelles

### 🟡 P4 — Multilingue complet
- [ ] Traduire **tout le contenu** des pages (aujourd'hui : navigation + libellés clés)
- [ ] Persistance de la langue côté compte + détection navigateur

### 🟡 P5 — Finitions produit & « épure »
- [ ] Onboarding pro guidé (création de profil en 3 étapes)
- [ ] Notifications in-app (cloche) + centre de messages unifié
- [ ] Mode hors-ligne / PWA installable, icônes & splash
- [ ] Accessibilité (contrastes, focus, lecteurs d'écran) + tests
- [ ] Page **légale** (CGU, confidentialité, mentions) avant lancement réel

### ⚪ P6 — Qualité & lancement
- [ ] Tests (unitaires + e2e), analytics, suivi d'erreurs
- [ ] Nom de domaine personnalisé + SEO + Open Graph
- [ ] Modération (avis, photos) & signalement

---

## 5. 🗺️ Plan d'action séquencé

| Phase | Objectif | Contenu |
|------|----------|---------|
| **0 — fait** | Démo front complète | Clientes + social + maquette pro + i18n |
| **1** | **Espace pro réel (local)** | CRUD profil/prestations/horaires/dispos, agenda relié aux réservations locales |
| **2** | **Backend & auth** | DB + auth + rôles → données partagées et persistantes |
| **3** | **Média & paiements** | Upload réel + Stripe (acomptes) + politique d'annulation |
| **4** | **Notifications & temps réel** | Email/SMS/push, messagerie & dispos live, liste d'attente |
| **5** | **Intelligence** | Distance/trajet, suggestions, recherche avancée |
| **6** | **i18n complet + finitions** | Traductions, PWA, accessibilité, légal |
| **7** | **Lancement** | Tests, analytics, domaine, SEO, modération |

---

## 6. 👉 Prochaine étape immédiate
**Phase 1 — rendre l'espace prestataire réellement utilisable** (édition profil,
prestations, horaires, disponibilités, agenda relié aux vraies réservations),
toujours en `localStorage` pour rester rapide, **avant** d'attaquer le backend (Phase 2).
