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

### 🟢/🔴 P2 — Le **backend** (en cours)
Base **Neon Postgres** (Vercel) + **Drizzle ORM** posés. Déjà réels & persistants :
- [x] **Base de données** (schéma users/sessions/creators/formations/reservations/messages/follows/favorites/posts) + **seed** du catalogue
- [x] **Auth réelle** (email + mot de passe chiffré bcrypt, session httpOnly) + rôles cliente/pro → `/api/auth/*`
- [x] **Réservations en base** (créer/lister/annuler, scoping par utilisateur) → `/api/reservations`

- [x] **Messages, follows, favoris, publications studio** migrés en DB (API) + repli localStorage hors connexion
- [x] **Espace pro réel** : profil public éditable en base (auto-créé), prestations/tarifs CRUD, agenda alimenté par les vraies réservations, stats/clientes réelles ; profil public `/pro/[slug]` servi depuis la DB
- [x] **Dashboard entreprise** : demandes de RDV (confirmer/refuser/terminer/absente), **planning & disponibilités réelles** (jours, horaires, durée créneau, congés) reliées à la réservation cliente ; RDV créés « en attente », statuts affichés côté cliente
- [x] **9 vraies créatrices Montpellier** (comptes Instagram réels : pseudo + lien) ajoutées au catalogue

Reste à ajouter :
- [ ] **Upload média** réel (photos/vidéos des pros) — Vercel Blob — au lieu des photos génériques
- [ ] **Paiements** / acomptes (Stripe) + politique d'annulation appliquée
- [ ] **Notifications** réelles : email / SMS / push (confirmation, rappel J-1) — Resend/Twilio
- [ ] **Temps réel** : messagerie & disponibilités (websockets / polling)
- [ ] **Liste d'attente** automatique réellement déclenchée

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
| **2a — fait** | **Backend : DB + auth + réservations** | Neon + Drizzle, comptes réels, réservations persistées |
| **2b** | **Backend (suite)** | Migrer messages/follows/favoris/posts en DB, upload média (Blob) |
| **1** | **Espace pro réel** | CRUD profil/prestations/horaires/dispos, agenda relié aux vraies réservations |
| **3** | **Paiements** | Stripe (acomptes) + politique d'annulation |
| **3** | **Média & paiements** | Upload réel + Stripe (acomptes) + politique d'annulation |
| **4** | **Notifications & temps réel** | Email/SMS/push, messagerie & dispos live, liste d'attente |
| **5** | **Intelligence** | Distance/trajet, suggestions, recherche avancée |
| **6** | **i18n complet + finitions** | Traductions, PWA, accessibilité, légal |
| **7** | **Lancement** | Tests, analytics, domaine, SEO, modération |

---

## 6. 👉 Prochaine étape immédiate
Le **socle backend est en place** (Neon + Drizzle + auth + réservations, en prod).
Suite recommandée :
1. **Migrer le reste des données en DB** (messages, follows, favoris, publications studio).
2. **Upload média réel** (Vercel Blob) pour que les pros publient leurs vraies photos.
3. **Espace pro réel** (CRUD prestations/horaires/dispos) relié aux vraies réservations.
4. **Paiements** (Stripe) pour les acomptes.
