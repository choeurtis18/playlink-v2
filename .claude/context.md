# Contexte Projet — Playlink Full Stack

## Vision
**Playlink** : App party/offline de référence pour 16-35 ans pour jouer à des jeux de cartes sociaux en groupe + back-office pour gérer le contenu.

## Les 4 Jeux
1. **Action ou Vérité** : Choix binaire → affiche une carte adaptée
2. **Icebreaker** : 10 questions/partie, tous les joueurs répondent
3. **Dégât-Débat** : 10 questions/partie, tous débattent
4. **Balance Ton Pote** : 10 questions/partie, joueur visé répond

Total MVP : 150-180 cartes (3-4 catégories par jeu, ~10-15 cartes/catégorie)

## Cible
- **Âge** : 16-35 ans
- **Context** : Soirées, apéros, voyages, groupes d'amis/couples
- **Format** : Web-first (mobile-first responsive) + PWA → iOS/Android futur
- **Particularité** : Jouable complètement offline, sans inscription

## Content Flow
1. Admin crée/édite cartes via back-office
2. Admin pushes à l'API (PostgreSQL source of truth)
3. App fetch GET /api/cards/export → JSON
4. App stocke en localStorage (offline mode)
5. User joue offline, aucune sync needed (MVP)

## Tech Stack
- **Monorepo** : pnpm workspaces
- **API** : Express + TypeScript + Prisma + PostgreSQL (Supabase)
- **App** : Next.js 14+ + React + TypeScript + Zustand + Tailwind + Framer Motion
- **Admin** : Next.js 14+ + React + TypeScript + Tailwind + Supabase Auth
- **Design** : Tailwind CSS + custom tokens (dark/light mode)

## Success Metrics
- Admin: ease of CRUD, bulk import speed
- App: offline play works, sync on launch
- Content: 150+ cards across 4 games, preview dark/light
- Design: mobile-first responsive, fast animations
