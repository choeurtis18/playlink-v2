# Playlink v2 — Contexte projet

## Vue d'ensemble

Playlink est une application web de jeux de cartes (type "défis entre amis"). L'utilisateur choisit un jeu, sélectionne une catégorie, puis swipe les cartes une par une. Le projet est un **monorepo pnpm** avec trois packages.

---

## Architecture monorepo

```
playlink-v2/
├── packages/
│   ├── app/        — Next.js 14, port 3000 (app joueur + API Routes)
│   ├── admin/      — Next.js 14, port 3001 (back-office)
│   └── shared/     — Types Zod partagés (compilé avec tsup)
```

**Démarrage dev :**
```bash
pnpm dev   # lance shared en watch + app + admin en parallèle
```

**Vérification TypeScript :**
```bash
pnpm type-check   # lance tsc --noEmit sur tous les packages
```

---

## Stack technique

| Couche | Outil |
|--------|-------|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS v3 |
| Animations | Framer Motion |
| State (app) | Zustand avec `persist` |
| Base de données | Supabase PostgreSQL via Prisma 5 |
| Auth | Supabase JWT (admin seulement) |
| Icônes | Lucide React |
| Validation | Zod |
| Déploiement | Vercel (app + admin + API = même domaine) |

---

## `@playlink/app` — Application joueur

### Pages
- `/` — Liste des jeux (`useGameStore` → `GET /api/games`)
- `/game/[slug]` — Page de jeu : sélection catégorie → swipe de cartes

### State management (`gameStore.ts`)
Zustand persist. Types exportés réutilisés partout :
- `ExportGame` — jeu avec ses catégories imbriquées
- `ExportCategory` — catégorie avec ses cartes
- `ExportCard` — `{ id, text, difficulty?, tags?, order }`

Actions : `fetchGames`, `startDeck(categoryId)`, `next`, `prev`, `resetDeck`, `toggleDark`

### Composants clés
- `PlayCard` — carte swipeable (Framer Motion drag, stack visuelle, AnimatePresence). Swipe droite = **suivant**, swipe gauche = **précédent**. Le bas de la carte affiche "👈 Précédent / 👉 Suivant" en deux colonnes.
- `GameCard` — tuile de sélection de jeu sur la home
- `CategoryPicker` — sélection de catégorie avant de jouer. Chaque catégorie affiche un aperçu d'une carte aléatoire (hook `useRandomCard`, stabilisé par `useMemo` sur `cat.id`).
- `PlayFooter` — boutons nav bas d'écran
- `CardGridModal` — vue grille de toutes les cartes du deck
- `RulesModal` — affiche les règles du jeu (markdown)
- `Header` — header universel avec back, titre, counter, icônes d'action

### Tracking (`useTracking`)
Fire-and-forget vers `POST /api/events`. Types : `game_started`, `card_viewed`, `game_finished`.

---

## API Routes (`packages/app/src/app/api/`)

Toutes les routes sont dans Next.js App Router. **Pas de serveur Express séparé.**

### Routes publiques
| Route | Description |
|-------|-------------|
| `GET /api/health` | Health check |
| `GET /api/games` | Liste des jeux actifs avec catégories + cartes |
| `GET /api/games/[id]` | Jeu par slug |
| `GET /api/games/[id]/rules` | Règles markdown du jeu |
| `GET /api/cards/export` | Export CSV public |
| `POST /api/events` | Tracking analytics (fire-and-forget) |

### Routes admin (protégées `requireAuth`)
```
/api/admin/stats
/api/admin/games          GET/POST
/api/admin/games/[id]     GET/PATCH/DELETE
/api/admin/games/[id]/rules
/api/admin/games/export|import
/api/admin/categories     GET/POST
/api/admin/categories/[id]
/api/admin/categories/export|import
/api/admin/cards          GET/POST
/api/admin/cards/[id]
/api/admin/cards/export|import
/api/admin/bulk-import
/api/admin/analytics/overview|daily|hourly|games|categories|export
```

### Utilitaires partagés (`packages/app/src/lib/api-utils/`)
- `prisma.ts` — singleton Prisma (pattern globalThis pour serverless)
- `auth.ts` — `requireAuth(request: NextRequest)` → throw si token absent/invalide
- `error-handler.ts` — `apiError(err)` + `createError()` → convertit ZodError/PrismaError en `NextResponse`

**Toutes les erreurs API sont en français.**

---

## Schéma Prisma

Fichier : `packages/app/prisma/schema.prisma`

```
User         id, email, role (editor|admin)
Game         id, name, slug, description, icon, colorMain, colorSecondary, active, order
GameRules    id, gameId, rules (markdown)
Category     id, gameId, name, slug, description, icon, order
Card         id, categoryId, text, difficulty (easy|medium|hard), tags[], active, order
AuditLog     id, userId?, action, entity, entityId
Event        id, type, gameId?, categoryId?, metadata (Json)
```

Relations : `Game → Category[] → Card[]`, `Game → GameRules?`

---

## `@playlink/admin` — Back-office

### Auth
- Supabase Auth (`onAuthStateChange` uniquement, pas `getSession` au démarrage)
- Axios interceptor : `supabase.auth.getSession()` à chaque requête pour token frais
- Store : `authStore.ts`

### Pages
- `/login` — Page de connexion Supabase
- `/` (dashboard) — Stats globales
- `/games` — CRUD jeux
- `/categories` — CRUD catégories
- `/cards` — CRUD cartes
- `/game-rules` — Édition règles par jeu
- `/analytics` — Graphiques d'utilisation

### Fonctionnalités
- Pagination server-side sur toutes les listes
- Refresh pattern : compteur `refresh` dans `useCallback` deps force un re-fetch après chaque mutation
- Export CSV (respecte les filtres actifs) + import CSV transactionnel (rollback si erreur) + écran de résultat avec compteurs créés/mis à jour
- Import bulk texte (legacy)
- Emoji picker dans le formulaire jeu (grille de suggestions + paste libre)

### CSV
- Auto-détection séparateur `,` vs `;` (Excel FR)
- Tags séparés par `|`
- Export avec BOM UTF-8. Nom de fichier dynamique via query param `?filename=` + header `Content-Disposition` RFC 5987 (`filename*=UTF-8''...`).
- Champ `active` insensible à la casse (`TRUE`/`true`)
- Champ `difficulty` à l'import est normalisé en minuscules (`.toLowerCase()`) avant validation `easy|medium|hard`

### Gestion d'erreurs admin (`packages/admin/src/lib/api.ts`)
`apiError(err)` affiche en priorité `error.details[].message` (erreurs Zod multi-champs) joints par ` · `, puis `error.message`, puis le fallback générique.

---

## Variables d'environnement

### `@playlink/app`
```env
DATABASE_URL                    # PostgreSQL Supabase
SUPABASE_SERVICE_ROLE_KEY       # Clé service (admin auth côté API)
NEXT_PUBLIC_SUPABASE_URL        # (si utilisé côté client)
NEXT_PUBLIC_API_URL             # Vide en prod (même domaine)
```

### `@playlink/admin`
```env
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_API_URL             # URL de @playlink/app
```

---

## Conventions et règles du projet

1. **Langue** : tout est en français — UI, messages d'erreur API, commentaires si nécessaire.
2. **Commentaires** : aucun sauf si le POURQUOI est non-évident (contrainte cachée, invariant subtil).
3. **TypeScript strict** : `tsc --noEmit` après chaque changement cross-cutting. Zéro erreur toléré.
4. **Erreurs Prisma** → mapper en français : P2002 = conflit, P2025 = non trouvé.
5. **Routes admin** : toujours derrière `requireAuth`.
6. **Import CSV** : toujours transactionnel (tout-ou-rien).
7. **Redémarrer le dev server** après tout changement côté serveur (Next.js ne hot-reload pas les API routes en mémoire).
8. **Pas de `packages/api`** — ce package n'existe plus.

---

## Jeux et catégories en base (état au 2026-06-09)

| # | Jeu | Slug | Couleurs | Catégories |
|---|-----|------|----------|------------|
| 0 | 🧊 **Icebreaker** | `icebreaker` | `#378ADD` / `#85B7EB` | Pour se découvrir (37), Cœur à Cœur (54), Deep Talk (39) |
| 1 | 🎯 **Action ou Vérité** | `action-ou-verite` | `#D4537E` / `#ED93B1` | Vérités légères (33), Vérités Flirt (36), Vérités Spicy (30), Actions légères (29), Actions Flirt (27), Actions Spicy (23) |
| 2 | ⚡ **Dégât-Débat** | `degat-debat` | `#D85A30` / `#F0997B` | Société (38), Perso et Relations (33), Éthique et Morale (35) |
| 3 | 🎮 **Roland Gamos** | `roland-gamos` | `#FF6B35` / `#FFD60A` | Artistes (49), Sports (70), Acteurs (47), Influenceurs/Créateurs de contenu (33) |
| 4 | 🎭 **Mime Inversé** | `mime-inverse` | `#E84B8A` / `#F5A3C7` | Objets du quotidien (25), Actions (25), Métiers (30) |
| 5 | 🎯 **Devine le Mot** | `devine-le-mot` | `#8B5CF6` / `#C4B5FD` | Facile (39), Moyen (39), Difficile (40) |
| 6 | ⚖️ **Dilemme** | `dilemme` | `#0891B2` / `#67E8F9` | Absurde et Fun (19), Relations et Société (24), Identité et Valeurs (17) |
| 7 | 🎤 **Balance Ton Pote** | `balance-ton-pote` | `#639922` / `#97C459` | Personnalité (34), Désir et Attirance (21), Taquineries (26), Secrets et Confessions (33) |

> Les nombres entre parenthèses = nombre de cartes actives dans la catégorie.

---

## Comportements notables

- `fetchGames` se relance sur `visibilitychange` (retour sur l'onglet = sync auto)
- Jeu en mode hors-ligne : données du cache Zustand persist affichées avec bandeau amber
- `startDeck` mélange les cartes (`shuffle`) puis initialise `deck` et `currentIndex`
- Swipe droite = carte suivante (`onNext`), swipe gauche = carte précédente (`onPrev`)
- Seuil de swipe : `offset.x > 80` ou `< -80`
- Fin de deck : `currentIndex >= deck.length` → écran "Partie terminée 🎉"