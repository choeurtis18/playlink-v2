# Instructions pour Claude Code — Playlink Monorepo

## État du projet (2026-05-02)
Toutes les phases sont terminées et fonctionnelles en local. Ne pas repartir de zéro — lire `context.md` et `architecture.md` pour comprendre les décisions déjà prises.

## Architecture
- **Monorepo** pnpm : `packages/shared`, `packages/api`, `packages/app`, `packages/admin`
- **API** Express + Prisma (port 3002) — routes publiques + admin protégées par Bearer JWT
- **App** Next.js 14, Zustand persist, Framer Motion (port 3000)
- **Admin** Next.js 14, Supabase Auth (port 3001)
- **Shared** Zod schemas + constants, compilé avec tsup (CJS+ESM+DTS)

## Conventions

### Général
- TypeScript strict — toujours `tsc --noEmit` après chaque changement (api + admin + app)
- Tous les messages utilisateur en **français** (UI et erreurs API)
- Pas de commentaires sauf si le WHY est non-évident
- Pas d'abstractions prématurées

### API
- Logique métier dans les controllers uniquement, pas dans les routes
- Erreurs Prisma P2002 (unique constraint) et P2025 (not found) interceptées dans `errorHandler.ts`
- Routes `/games/export` et `/categories/export` déclarées **avant** `/games/:id` pour éviter la collision Express
- Import CSV : `$transaction` Prisma — tout ou rien, jamais partiel

### Admin
- Rafraîchissement des listes : `refresh` counter dans les deps de `useCallback` + `invalidate()` après chaque mutation (create/update/delete/import)
- Token Supabase : intercepteur Axios appelle `supabase.auth.getSession()` à chaque requête
- Auth layout : `onAuthStateChange` uniquement pour les décisions de redirect (évite les faux redirects sur token expiré)
- Dropdowns filtres : toujours `?limit=100` pour éviter la troncature pagination
- Après un fix : **relancer le serveur dev** — refresh navigateur seul ne suffit pas

### App
- `fetchGames` se relance au `visibilitychange` (synchro après modifications en admin)
- Store Zustand : clé `playlink-store`, persiste `games`, `lastSyncAt`, `darkMode` uniquement
- Guard `game/[slug]/page.tsx` : si `activeCategoryId` set mais catégorie introuvable ou deck vide → `resetDeck()`

## CSV Import/Export
- Détection auto séparateur `,` vs `;` (Excel français utilise `;`)
- `active` : case-insensitive (`TRUE`/`true` tous acceptés)
- Tags cartes : séparateur `|` (ex: `mensonge|famille`)
- Export : BOM UTF-8 pour Excel
- Import : upsert — id existant = update, id vide/inconnu = create, erreur = rollback total

## Routes API

### Publiques
- `GET /api/games` — jeux actifs avec catégories
- `GET /api/cards/export` — export complet pour cache offline (5 min cache)

### Admin (Bearer JWT)
- `GET/POST /api/admin/games` + `GET/PUT/DELETE /api/admin/games/:id`
- `GET /api/admin/games/export` + `POST /api/admin/games/import`
- Idem pour `/categories` et `/cards`
- `POST /api/admin/bulk-import` — import texte brut cards (legacy)
- `GET /api/admin/stats` — compteurs dashboard
