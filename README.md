# Playlink — Party Card Games App

Playlink is an offline-first web app for social card games designed for 16-35 year-olds. Play with friends at parties, trips, and hangouts without internet.

## Features

- **4 Social Games**: Action ou Vérité, Brise-Glace, Dégât-Débat, Balance ton Pote
- **Offline First**: All content synced at launch, cached in localStorage
- **Mobile Responsive**: Mobile-first design, works on all devices
- **Dark Mode**: System preference detection + manual toggle
- **Admin Panel**: Full CRUD for games, categories, and cards with CSV export/import
- **No Sign-up**: Play anonymously, no user accounts needed (MVP)

## Project Structure

pnpm monorepo with 3 packages:

```
playlink-v2/
├── packages/
│   ├── shared/     # @playlink/shared — Zod schemas, constants, shared types
│   ├── app/        # @playlink/app — Next.js 14 user app + API Routes (port 3000)
│   └── admin/      # @playlink/admin — Next.js 14 admin panel (port 3001)
├── .claude/        # Project memory and context for Claude Code
└── pnpm-workspace.yaml
```

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm (`npm install -g pnpm`)
- Supabase project (for database + auth)

### Install

```bash
pnpm install
# Automatically runs prisma generate for packages/app
```

### Environment variables

```bash
# packages/app — API + user app
cp packages/app/.env.example packages/app/.env.local
# DATABASE_URL — Supabase PostgreSQL connection string
# SUPABASE_URL, SUPABASE_SERVICE_KEY — for JWT verification (server-side)
# NEXT_PUBLIC_API_URL — leave empty in production (same domain), set to http://localhost:3000 in dev

# packages/admin
cp packages/admin/.env.example packages/admin/.env.local
# NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
# NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Database setup

```bash
cd packages/app
pnpm exec prisma generate     # Generate Prisma client
pnpm exec prisma db push      # Push schema to database
pnpm exec prisma db seed      # Seed: 4 games, 150+ cards
```

### Run in development

```bash
pnpm dev
# App + API: http://localhost:3000
# Admin:     http://localhost:3001
```

## Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Run all packages in dev mode |
| `pnpm build` | Build all packages |
| `pnpm lint` | Lint all packages |
| `pnpm type-check` | TypeScript check all packages |

## Tech Stack

| Layer | Tech |
|-------|------|
| User app | Next.js 14, Tailwind CSS, Zustand, Framer Motion |
| Admin panel | Next.js 14, Tailwind CSS, Supabase Auth |
| API | Next.js API Routes, Prisma ORM, Zod |
| Database | PostgreSQL via Supabase |
| Auth | Supabase Auth (JWT) — admin only |
| Shared | TypeScript, Zod schemas, tsup |
| Monorepo | pnpm workspaces |

## API Overview

All API Routes live in `packages/app/src/app/api/`.

### Public

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/games` | List active games |
| GET | `/api/games/:id` | Single game by slug |
| GET | `/api/cards/export` | Full export for offline cache |

### Admin (Bearer JWT required)

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/admin/stats` | Dashboard counts |
| GET/POST | `/api/admin/games` | List / create games |
| GET/PUT/DELETE | `/api/admin/games/:id` | Read / update / delete |
| GET | `/api/admin/games/export` | CSV export |
| POST | `/api/admin/games/import` | CSV upsert import |
| GET/POST | `/api/admin/categories` | List / create |
| GET/PUT/DELETE | `/api/admin/categories/:id` | Read / update / delete |
| GET | `/api/admin/categories/export` | CSV export (filterable by gameId) |
| POST | `/api/admin/categories/import` | CSV upsert import |
| GET/POST | `/api/admin/cards` | List (paginated, searchable) / create |
| GET/PUT/DELETE | `/api/admin/cards/:id` | Read / update / delete |
| GET | `/api/admin/cards/export` | CSV export (filterable) |
| POST | `/api/admin/cards/import` | CSV upsert import |
| POST | `/api/admin/bulk-import` | Text-mode bulk card creation |

## CSV Import/Export

All three tables support CSV export and upsert import.

- Export respects active filters (gameId, categoryId, search)
- Import: row with existing `id` → update; empty or unknown `id` → create
- Validation errors are logged per row (no rollback — tolerates partial imports)
- Tags in cards CSV use `|` as separator (e.g. `mensonge|famille`)
- Auto-detects `,` vs `;` separator (Excel French locale uses `;`)
- Bulk import via text mode: paste raw card text (one per line) with category + difficulty

## Admin Features

- **Multi-select deletion**: Select multiple rows with checkboxes, delete in bulk
- **Real-time filtering**: Filter games by category (cards), filter cards by game + category + search
- **Pagination**: 10 games, 15 categories, 20 cards per page
- **Form pre-selection**: When adding under a filter, the form pre-selects the filtered value
- **CSV import/export**: Full data portability for games, categories, and cards

## How It Works

1. **Admin** manages content via the admin panel (CRUD + CSV import)
2. **API Routes** store content in PostgreSQL via Prisma
3. **App** fetches all content on launch via `GET /api/cards/export`
4. Content is cached in localStorage (Zustand persist)
5. Users play offline — no network needed during gameplay

## Deployment

| Service | Platform | URL |
|---------|----------|-----|
| User app + API | Vercel | playlink.app |
| Admin panel | Vercel | admin.playlink.app |
| Database | Supabase (PostgreSQL) | — |

All three packages (app, admin, shared) are deployed in a single Vercel project.
- `packages/app` → builds to `/` (user app) + `/api/*` (API routes)
- `packages/admin` → separate Vercel project (admin.playlink.app)
- Database connection: Supabase PgBouncer on port 6543 (transaction mode) with connection pooling

## License

MIT
