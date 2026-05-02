# 🚀 Prompt de Lancement Complet — Projet Playlink (App + API + Back-Office)

**À copier-coller dans Claude Code CLI ou discussion**

---

## 📋 Contexte & Vision Complète

Tu vas m'aider à lancer **Playlink**, une **app web party/offline de jeux de cartes sociaux** pour 16-35 ans, **avec infrastructure backend complète pour gérer le contenu**.

### Vision
- **Objectif** : L'app party/offline de référence — jeux de cartes sociaux rapides, fun, modulables
- **Cible** : 16-35 ans (amis, couples, groupes) — soirées, apéros, voyages
- **Format** : Web-first (mobile-first responsive) + PWA → iOS/Android futur
- **Particularité** : Jouable complètement offline, sans inscription (content sync du backend)

### Les 4 jeux
1. **Action ou Vérité** : Choix binaire → affiche une carte adaptée
2. **Icebreaker** : 10 questions/partie, tous les joueurs répondent
3. **Dégât-Débat** : 10 questions/partie, tous débattent
4. **Balance Ton Pote** : 10 questions/partie, joueur visé répond

Chaque jeu = paquet de cartes avec identité visuelle propre (3-4 catégories par jeu, ~10-15 cartes/catégorie).

**Total MVP** : 150-180 cartes gérées depuis le back-office.

---

## 🛠️ Stack Technique Proposé

### Frontend App (Playlink-app/)
- **Framework** : Next.js 14+ (React, TypeScript)
- **Styling** : Tailwind CSS (design tokens custom)
- **State management** : Zustand (simple, léger)
- **Animations** : Framer Motion (smooth, performant)
- **API client** : fetch + custom hooks (react-query future)
- **Build** : Vite (rapide)

### Backend API (Playlink-api/)
- **Framework** : Node.js + Express/Fastify + TypeScript
- **Database** : PostgreSQL + Supabase (managed)
- **ORM** : Prisma (type-safe, migrations)
- **Auth** : Supabase Auth (JWT) ou NextAuth.js
- **Validation** : Zod (type-safe schemas)
- **File upload** : Supabase Storage (future: images, exports)
- **API docs** : Swagger/OpenAPI

### Back-Office Admin (Playlink-admin/)
- **Framework** : Next.js 14+ (React, TypeScript) — même stack que app
- **UI Components** : shadcn/ui (data tables, forms, dialogs)
- **Admin pattern** : Custom CRUD (pas d'over-lib)
- **Auth** : Supabase Auth (protected routes, role-based)
- **API client** : Axios + custom hooks
- **Features** :
  - Create/Edit/Delete games, categories, cards
  - Bulk import cards (CSV/JSON)
  - Preview cartes (dark/light)
  - User management (optionnel MVP)
  - Analytics dashboard (v1.1+)

### Storage & Offline
- **Source of truth** : PostgreSQL (backend)
- **Content distribution** : JSON API endpoint → app syncs
- **Embarqué dans app** : cards.json (refreshed on app launch)
- **LocalStorage** : Game state + user settings only
- **Service Worker** : Offline mode + background sync (v1.1+)

### Design & Assets
- **Design system** : Tailwind + CSS variables (dark/light mode)
- **Responsiveness** : Mobile-first (370px → desktop)
- **Dark mode** : Auto-detect système + toggle user
- **Icons** : Lucide React

### DevOps & Deployment
- **Version control** : Git (GitHub) — **Monorepo** (apps folder)
- **Build** : Next.js (app + admin), Express (API)
- **Deploy** :
  - **App** : Vercel (Playlink.app)
  - **Admin** : Vercel (admin.Playlink.app ou admin-Playlink.vercel.app)
  - **API** : Render/Railway/Supabase (api.Playlink.app)
- **Database** : Supabase PostgreSQL (managed, auto-backups)
- **Environment** : .env.local + secrets (Vercel/Railway)

---

## 📁 Architecture des dossiers (Monorepo)

```
Playlink/                                   # Root monorepo
│
├── .claude/                             # Shared Claude config
│   ├── instructions.md                  # Rules for Claude Code
│   ├── context.md                       # Project context
│   ├── architecture.md                  # Tech decisions
│   └── TODO.md                          # Roadmap
│
├── packages/
│   │
│   ├── shared/                          # Shared code (types, utils)
│   │   ├── src/
│   │   │   ├── types/
│   │   │   │   ├── game.ts              # Game, Category, Card types
│   │   │   │   ├── api.ts              # API request/response types
│   │   │   │   └── index.ts
│   │   │   ├── utils/
│   │   │   │   ├── validators.ts        # Zod schemas (shared)
│   │   │   │   └── constants.ts         # Game IDs, colors, etc
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── api/                             # Backend Express API
│   │   ├── src/
│   │   │   ├── server.ts                # Express app init
│   │   │   ├── middleware/
│   │   │   │   ├── auth.ts              # JWT validation
│   │   │   │   ├── cors.ts
│   │   │   │   └── errorHandler.ts
│   │   │   ├── routes/
│   │   │   │   ├── games.ts             # GET /api/games
│   │   │   │   ├── cards.ts             # GET /api/cards (exported)
│   │   │   │   ├── admin/
│   │   │   │   │   ├── games.ts         # POST/PUT/DELETE games (auth)
│   │   │   │   │   ├── cards.ts         # CRUD cards
│   │   │   │   │   ├── bulk-import.ts   # CSV/JSON upload
│   │   │   │   │   └── index.ts
│   │   │   │   └── index.ts
│   │   │   ├── controllers/
│   │   │   │   ├── gameController.ts
│   │   │   │   ├── cardController.ts
│   │   │   │   └── adminController.ts
│   │   │   ├── db/
│   │   │   │   ├── prisma.ts            # Prisma client
│   │   │   │   └── seed.ts              # Seed DB with initial data
│   │   │   ├── utils/
│   │   │   │   └── validators.ts        # Request validation
│   │   │   └── index.ts
│   │   ├── prisma/
│   │   │   ├── schema.prisma            # DB schema
│   │   │   └── migrations/              # Generated migrations
│   │   ├── .env.example
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── README.md
│   │
│   ├── app/                             # Frontend user app
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── layout.tsx           # Root layout
│   │   │   │   ├── page.tsx             # Home (game selection)
│   │   │   │   ├── game/
│   │   │   │   │   └── [gameId]/
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── play/
│   │   │   │   │   └── [gameId]/[categoryId]/page.tsx
│   │   │   │   ├── api/
│   │   │   │   │   └── sync-cards/route.ts   # Fetch cards from backend
│   │   │   │   └── globals.css
│   │   │   ├── components/
│   │   │   │   ├── layout/
│   │   │   │   │   ├── Header.tsx
│   │   │   │   │   ├── Navigation.tsx
│   │   │   │   │   └── Footer.tsx
│   │   │   │   ├── game/
│   │   │   │   │   ├── GameCard.tsx
│   │   │   │   │   ├── CategorySelect.tsx
│   │   │   │   │   ├── CardDisplay.tsx
│   │   │   │   │   └── GameNav.tsx
│   │   │   │   ├── ui/
│   │   │   │   │   └── [...primitives]
│   │   │   │   └── theme/
│   │   │   │       ├── ThemeProvider.tsx
│   │   │   │       └── useTheme.ts
│   │   │   ├── lib/
│   │   │   │   ├── api.ts               # API client helper
│   │   │   │   ├── storage.ts           # LocalStorage + sync
│   │   │   │   ├── types.ts
│   │   │   │   └── utils.ts
│   │   │   ├── hooks/
│   │   │   │   ├── useGame.ts
│   │   │   │   ├── useApi.ts            # Fetch + cache
│   │   │   │   ├── useStorage.ts
│   │   │   │   └── useTheme.ts
│   │   │   ├── stores/
│   │   │   │   └── gameStore.ts         # Zustand game state
│   │   │   └── styles/
│   │   │       ├── globals.css
│   │   │       ├── tokens.css
│   │   │       └── animations.css
│   │   ├── public/
│   │   │   ├── icons/
│   │   │   └── manifest.json
│   │   ├── .env.example
│   │   ├── next.config.js
│   │   ├── tailwind.config.ts
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── README.md
│   │
│   └── admin/                           # Back-office admin panel
│       ├── src/
│       │   ├── app/
│       │   │   ├── layout.tsx           # Root layout + auth check
│       │   │   ├── page.tsx             # Dashboard (overview)
│       │   │   ├── login/
│       │   │   │   └── page.tsx         # Login page
│       │   │   ├── games/
│       │   │   │   ├── page.tsx         # Games list
│       │   │   │   ├── [gameId]/
│       │   │   │   │   ├── page.tsx     # Edit game
│       │   │   │   │   └── categories/
│       │   │   │   │       ├── [catId]/
│       │   │   │   │       │   └── page.tsx  # Edit category
│       │   │   │   │       └── page.tsx      # Categories list
│       │   │   │   ├── new/
│       │   │   │   │   └── page.tsx     # Create game
│       │   │   │   └── layout.tsx       # Games section layout
│       │   │   ├── cards/
│       │   │   │   ├── page.tsx         # All cards (searchable table)
│       │   │   │   ├── [cardId]/
│       │   │   │   │   └── page.tsx     # Edit card
│       │   │   │   ├── new/
│       │   │   │   │   └── page.tsx     # Create card
│       │   │   │   ├── import/
│       │   │   │   │   └── page.tsx     # Bulk import CSV/JSON
│       │   │   │   └── layout.tsx
│       │   │   ├── api/                 # Client-side API calls
│       │   │   │   └── [...route]/route.ts   # Proxy (optional)
│       │   │   └── globals.css
│       │   ├── components/
│       │   │   ├── layout/
│       │   │   │   ├── Header.tsx
│       │   │   │   ├── Sidebar.tsx      # Admin nav
│       │   │   │   └── Footer.tsx
│       │   │   ├── forms/
│       │   │   │   ├── GameForm.tsx     # Create/Edit game
│       │   │   │   ├── CategoryForm.tsx
│       │   │   │   ├── CardForm.tsx
│       │   │   │   └── BulkImportForm.tsx
│       │   │   ├── tables/
│       │   │   │   ├── GamesTable.tsx
│       │   │   │   ├── CategoriesTable.tsx
│       │   │   │   └── CardsTable.tsx   # Searchable, sortable
│       │   │   ├── ui/
│       │   │   │   ├── Button.tsx
│       │   │   │   ├── Input.tsx
│       │   │   │   ├── Table.tsx
│       │   │   │   ├── Dialog.tsx
│       │   │   │   ├── Toast.tsx
│       │   │   │   └── [...]
│       │   │   └── theme/
│       │   ├── lib/
│       │   │   ├── api.ts               # API client (axios)
│       │   │   ├── auth.ts              # Auth helpers
│       │   │   ├── types.ts
│       │   │   └── utils.ts
│       │   ├── hooks/
│       │   │   ├── useAuth.ts           # Auth hook
│       │   │   ├── useApi.ts            # API calls with error handling
│       │   │   ├── useForm.ts           # Form state
│       │   │   └── useToast.ts
│       │   ├── context/
│       │   │   └── AuthContext.tsx      # Auth provider
│       │   └── styles/
│       ├── public/
│       ├── .env.example
│       ├── next.config.js
│       ├── tailwind.config.ts
│       ├── package.json
│       ├── tsconfig.json
│       └── README.md
│
├── .github/
│   └── workflows/                      # CI/CD (optionnel MVP)
│
├── .gitignore
├── pnpm-workspace.yaml                 # Monorepo config
├── README.md                           # Root docs
└── package.json                        # Root scripts (dev all, build all)
```

---

## 🗄️ Database Schema (Prisma)

```prisma
// prisma/schema.prisma

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// User (for admin auth)
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String   // hashed
  role      String   @default("editor") // editor, admin
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@map("users")
}

// Game (Action ou Vérité, Icebreaker, etc)
model Game {
  id          String       @id @default(cuid())
  name        String       @unique
  slug        String       @unique
  description String?
  icon        String?      // emoji or icon name
  colorMain   String       // #D4537E
  colorSecondary String    // #ED93B1
  active      Boolean      @default(true)
  order       Int          @default(0)
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
  
  categories  Category[]
  
  @@map("games")
}

// Category (Vérités légères, Actions douces, etc)
model Category {
  id        String   @id @default(cuid())
  gameId    String
  game      Game     @relation(fields: [gameId], references: [id], onDelete: Cascade)
  name      String
  slug      String
  description String?
  order     Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  cards     Card[]
  
  @@unique([gameId, slug])
  @@map("categories")
}

// Card (individual question/dare/truth)
model Card {
  id          String   @id @default(cuid())
  categoryId  String
  category    Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  text        String   // "Quel est ton plus grand regret ?"
  difficulty  String?  // "easy", "medium", "hard"
  tags        String[]  // ["introspectif", "sérieux"]
  active      Boolean  @default(true)
  order       Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@map("cards")
}

// Audit log (optional, v1.1+)
model AuditLog {
  id        String   @id @default(cuid())
  userId    String?
  action    String   // "created_card", "deleted_game"
  entity    String   // "card", "game"
  entityId  String
  createdAt DateTime @default(now())
  
  @@map("audit_logs")
}
```

---

## 🔌 API Endpoints

### Public (no auth)
```
GET /api/games                    # List all games with categories & cards
GET /api/games/:gameId            # Get game detail
GET /api/cards/export             # Export all cards as JSON (for app sync)
```

### Protected (JWT auth required)
```
POST   /api/admin/games            # Create game
PUT    /api/admin/games/:id        # Update game
DELETE /api/admin/games/:id        # Delete game

POST   /api/admin/categories       # Create category
PUT    /api/admin/categories/:id   # Update category
DELETE /api/admin/categories/:id   # Delete category

POST   /api/admin/cards            # Create card
PUT    /api/admin/cards/:id        # Update card
DELETE /api/admin/cards/:id        # Delete card
GET    /api/admin/cards?gameId=X   # Search cards

POST   /api/admin/bulk-import      # Bulk import CSV/JSON (multipart)
GET    /api/admin/stats            # Dashboard stats (v1.1+)
```

---

## 🎯 Initialisation du projet

### Étape 1 : Setup Monorepo
```bash
# Créer root directory
mkdir Playlink && cd Playlink

# Init git
git init

# Create pnpm-workspace.yaml
cat > pnpm-workspace.yaml << 'EOF'
packages:
  - 'packages/*'
EOF

# Create root package.json
cat > package.json << 'EOF'
{
  "name": "Playlink-monorepo",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "dev": "pnpm -r --parallel run dev",
    "build": "pnpm -r run build",
    "lint": "pnpm -r run lint",
    "type-check": "pnpm -r run type-check"
  }
}
EOF

# Create packages directory
mkdir packages
cd packages
```

### Étape 2 : Create Shared Package
```bash
# Shared types & utils
mkdir shared && cd shared

cat > package.json << 'EOF'
{
  "name": "@Playlink/shared",
  "version": "0.0.1",
  "private": true,
  "main": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts",
    "./types": "./src/types/index.ts",
    "./utils": "./src/utils/index.ts"
  }
}
EOF

mkdir -p src/{types,utils}

# Types
cat > src/types/game.ts << 'EOF'
export interface Card {
  id: string;
  text: string;
  difficulty?: string;
  tags?: string[];
}

export interface Category {
  id: string;
  name: string;
  cards: Card[];
}

export interface Game {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  colorMain: string;
  colorSecondary: string;
  categories: Category[];
}
EOF

cd ..
```

### Étape 3 : Create API Package
```bash
mkdir api && cd api

# Init Next.js-like structure
npx create-express-app@latest . --typescript

# Add Prisma, Zod, etc
pnpm add prisma @prisma/client zod cors dotenv

# Init Prisma
pnpm exec prisma init

# Create schema.prisma (see above)
# Create src/routes, src/controllers, etc

cd ..
```

### Étape 4 : Create App Package
```bash
mkdir app && cd app

# Init Next.js with TypeScript + Tailwind
npx create-next-app@latest . \
  --typescript \
  --tailwind \
  --eslint \
  --app

# Add client dependencies
pnpm add zustand framer-motion lucide-react axios

cd ..
```

### Étape 5 : Create Admin Package
```bash
mkdir admin && cd admin

# Init Next.js with TypeScript + Tailwind
npx create-next-app@latest . \
  --typescript \
  --tailwind \
  --eslint \
  --app

# Add admin dependencies
pnpm add axios zustand lucide-react @supabase/supabase-js

cd ..
```

### Étape 6 : Setup .claude folder
```bash
cd ../..

mkdir -p .claude

touch .claude/{instructions.md,context.md,architecture.md,TODO.md}
```

---

## 📄 .claude/instructions.md

```markdown
# Instructions pour Claude Code — Playlink Monorepo

## Architecture Globale
- **Monorepo** : packages/shared, packages/api, packages/app, packages/admin
- **Shared** : Types, validators, constants (importés partout)
- **API** : Express + Prisma + Supabase
- **App** : Next.js (user-facing)
- **Admin** : Next.js (content management)

## Conventions Globales
- TypeScript strict mode obligatoire
- Functional components + hooks (React)
- Zod pour validation (API + forms)
- Error handling explicite partout
- Comments: expliquer le WHY, pas le WHAT
- Naming: camelCase (JS), kebab-case (CSS)

## Per-Package Rules

### Shared
- Types export default (interface > type)
- Validators: Zod schemas centralisés
- No dependencies (keep it light)

### API
- Controllers: logic de métier
- Routes: HTTP routing
- Middleware: auth, cors, error handling
- Prisma: queries via models
- No business logic in routes

### App
- Components: single responsibility
- Hooks: state + API calls
- Zustand: global game state only
- API client: centralized fetch helper
- LocalStorage: persistence layer

### Admin
- Forms: React Hook Form + Zod (v1.1+)
- Tables: data-driven, searchable
- Auth: Supabase or custom JWT
- API client: error handling + retry

## Testing (MVP Later)
- Vitest: unit tests
- Cypress: E2E tests

## Git Workflow
- Commits: conventional (feat:, fix:, chore:)
- Branches: feature/*, bugfix/*, admin/*
- No direct push to main

## Code Quality
- ESLint + Prettier
- No console.log en prod
- Error boundaries required
```

---

## 📄 .claude/context.md

```markdown
# Contexte Projet — Playlink Full Stack

## Vision
**Playlink** : App party/offline de référence pour 16-35 ans + back-office pour gérer le contenu.

## Décomposition
- **App (User)** : Sélection jeu → Catégorie → Cartes (offline-first)
- **API** : Source of truth (PostgreSQL) + JSON export
- **Admin** : CRUD games/categories/cards + bulk import + analytics (future)

## Tech Stack
- **Monorepo** : pnpm workspaces
- **API** : Express + Prisma + PostgreSQL (Supabase)
- **App** : Next.js + Zustand + Tailwind
- **Admin** : Next.js + Tailwind + Zod
- **Auth** : Supabase Auth (JWT) pour admin
- **Deploy** : Vercel (app + admin), Render/Railway (API)

## Content Flow
1. Admin crée/édite cartes → API PostgreSQL
2. App fait GET /api/cards/export → JSON
3. App stocke en localStorage (offline mode)
4. User joue offline, aucune sync needed (MVP)

## Success Metrics
- Admin: ease of CRUD, bulk import speed
- App: offline play, sync on launch
- Content: 150+ cards across 4 games
```

---

## 📄 .claude/TODO.md

```markdown
# Roadmap Playlink — MVP + Admin

## Phase 1: Setup Monorepo & Shared (Week 1)
- [ ] Init pnpm workspace
- [ ] Create packages/{shared,api,app,admin}
- [ ] Setup .claude folder
- [ ] Create @Playlink/shared package (types, validators)
- [ ] Setup Git + Github

## Phase 2: API Backend (Week 1-2)
- [ ] Express server init + middleware
- [ ] Prisma schema + migrations
- [ ] Supabase setup (DB + Auth)
- [ ] Seed database (4 games, 150+ cards)
- [ ] Public routes (GET /api/games, /api/cards/export)
- [ ] Protected admin routes (POST/PUT/DELETE)
- [ ] Bulk import endpoint (CSV/JSON)

## Phase 3: App Frontend (Week 2-3)
- [ ] Next.js setup + design tokens
- [ ] Layout + theme provider
- [ ] GameCard + CategorySelect + CardDisplay
- [ ] Zustand store (game state)
- [ ] API client + useApi hook
- [ ] localStorage persistence + sync on launch
- [ ] Responsive design (mobile-first)

## Phase 4: Admin Back-Office (Week 3-4)
- [ ] Auth page (Supabase login)
- [ ] Dashboard overview
- [ ] Games CRUD (create, list, edit, delete)
- [ ] Categories CRUD
- [ ] Cards CRUD (searchable table)
- [ ] Bulk import form (CSV/JSON)
- [ ] Card preview (dark/light mode)

## Phase 5: Integration & Testing (Week 4-5)
- [ ] App fetches from API on launch
- [ ] Admin creates content → visible in app
- [ ] Offline mode works
- [ ] Mobile responsive (all 3 apps)
- [ ] Dark mode (all 3 apps)
- [ ] Error handling + edge cases

## Phase 6: Deployment (Week 5-6)
- [ ] API deploy (Render/Railway)
- [ ] App deploy (Vercel)
- [ ] Admin deploy (Vercel - admin.Playlink.app)
- [ ] DB backups (Supabase)
- [ ] Env setup (secrets)
- [ ] Monitor + logging

## Post-MVP (V1.1+)
- [ ] Analytics dashboard (admin)
- [ ] User accounts + stats
- [ ] Custom card creation (users)
- [ ] Game history + replay
- [ ] Scoring system
- [ ] Mobile native (React Native)

## Known Constraints
- No user accounts MVP
- No multiplayer sync
- Single-device offline play
- Content syndication: API → app only
```

---

## 📄 .claude/architecture.md

```markdown
# Architecture Technique — Playlink Monorepo

## Monorepo Benefits
- Shared types/utils (no duplication)
- Unified versioning
- Easy refactoring (monorepo tools)
- Single CI/CD pipeline

## API Architecture

### Routes
```
/api/public
  GET /games              # List all games
  GET /games/:id          # Game detail
  GET /cards/export       # All cards JSON (for app)

/api/admin (protected)
  POST   /games, PUT /games/:id, DELETE /games/:id
  POST   /categories, PUT /:id, DELETE /:id
  POST   /cards, PUT /:id, DELETE /:id
  GET    /cards?search=   # Search cards
  POST   /bulk-import     # CSV/JSON upload
```

### Data Format (JSON API)
```json
{
  "games": [
    {
      "id": "action-or-truth",
      "name": "Action ou Vérité",
      "colorMain": "#D4537E",
      "colorSecondary": "#ED93B1",
      "categories": [
        {
          "id": "verites-legeres",
          "name": "Vérités légères",
          "cards": [
            {
              "id": "card-1",
              "text": "Quel est ton plus grand regret ?",
              "difficulty": "medium",
              "tags": ["introspectif"]
            }
          ]
        }
      ]
    }
  ]
}
```

## App Architecture

### State (Zustand)
```typescript
interface GameState {
  games: Game[];
  currentGame: string | null;
  currentCategory: string | null;
  currentCardIndex: number;
  settings: { darkMode: boolean };
  // Actions: setGame, nextCard, etc
}
```

### Sync Flow
1. App launches → useEffect
2. Check if cards.json in localStorage is outdated
3. If yes: fetch GET /api/cards/export
4. Update localStorage
5. Reload app state

### Offline Mode
- All card data in localStorage
- No network calls needed during play
- Service Worker for cache-first (v1.1+)

## Admin Architecture

### Auth Pattern
- Supabase Auth session check in middleware
- Protected routes redirect to /login
- API calls include Authorization header (JWT)

### Form Management
- React Hook Form + Zod (v1.1+)
- Custom useApi hook for mutations
- Toast notifications for feedback

### CRUD Pattern
- List page: table with search/sort
- Detail page: form to edit
- Create page: empty form
- Delete: confirm dialog

## Deployment

### API (Render.com or Railway.io)
```
DATABASE_URL=postgresql://...
SUPABASE_URL=...
SUPABASE_KEY=...
JWT_SECRET=...
CORS_ORIGIN=https://Playlink.app,https://admin-Playlink.app
```

### App (Vercel)
```
NEXT_PUBLIC_API_URL=https://api.Playlink.app
```

### Admin (Vercel - admin.Playlink.app)
```
NEXT_PUBLIC_API_URL=https://api.Playlink.app
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```
```

---

## 🚀 Commandes de démarrage

```bash
# Root directory setup
cd Playlink
pnpm install

# Dev mode (all 3 apps)
pnpm dev
# App: http://localhost:3000
# Admin: http://localhost:3001
# API: http://localhost:3002

# Build all
pnpm build

# Deploy (individual)
cd packages/app && pnpm deploy:vercel
cd packages/admin && pnpm deploy:vercel
cd packages/api && pnpm deploy:render
```

---

## 📦 Instructions finales pour Claude Code

**Scope MVP** :
1. Monorepo setup (packages, shared types, workspaces)
2. API core (Express, Prisma schema, public routes)
3. App frontend (layout, game flow, localStorage)
4. Admin basics (auth, games CRUD, cards table)
5. Integration (app fetches from API, offline works)

**Tone** :
- Pragmatique (MVP first, perfection later)
- Explique les choix architecturaux
- Push back si une approche est meilleure
- Suggest optimizations (mais pas de over-engineering)

**Constraints** :
- TypeScript strict
- Mobile-first toujours
- No heavy dependencies
- WCAG 2.1 AA accessible
- Error handling explicit

---

## 🎯 Ton premier job

**"Mets en place le projet Playlink complet (monorepo + API + app + admin). Crée la structure des dossiers, packages, .claude folder, et commence par :"**
1. **Shared** : Types (Game, Category, Card)
2. **API** : Express init + Prisma schema + seed
3. **App** : Next.js init + layout + dark mode
4. **Admin** : Next.js init + auth page + games list

**Ensuite, on intègrera app ↔ API."**

Prêt ? 🚀