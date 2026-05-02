# Roadmap Playlink — MVP + Admin

## Phase 1: Setup Monorepo & Shared ✓ (Week 1)
- [x] Init pnpm workspace
- [x] Create packages/{shared,api,app,admin}
- [x] Setup .claude folder (instructions, context, architecture)
- [x] Create @playlink/shared package (types, validators, constants)
- [ ] Initialize Git + initial commit
- [ ] Verify pnpm install + structure works

## Phase 2: API Backend (Week 1-2)
- [ ] Express server init + middleware (cors, error handler)
- [ ] Prisma schema + initial migrations
- [ ] Supabase setup (PostgreSQL + Auth)
- [ ] Seed database (4 games, 3-4 categories each, 150+ cards)
- [ ] Public routes (GET /api/games, /api/cards/export)
- [ ] Protected admin routes (POST/PUT/DELETE)
- [ ] Bulk import endpoint (CSV/JSON upload)
- [ ] Test: API running on localhost:3002, endpoints respond

## Phase 3: App Frontend (Week 2-3)
- [ ] Next.js setup + TypeScript config
- [ ] Layout (Header, Footer, dark mode provider)
- [ ] Design tokens (Tailwind config, CSS variables)
- [ ] Game selection page (list 4 games)
- [ ] Category selection component
- [ ] Card display component (animated)
- [ ] Zustand store (game state)
- [ ] API client + useApi hook
- [ ] localStorage persistence + sync on launch
- [ ] Responsive design (mobile-first 370px → desktop)
- [ ] Test: App running on localhost:3000, can play offline

## Phase 4: Admin Back-Office (Week 3-4)
- [ ] Next.js setup + TypeScript config
- [ ] Auth page (Supabase login)
- [ ] Dashboard overview (stats: games, categories, cards)
- [ ] Games CRUD (list, create, edit, delete)
- [ ] Categories CRUD (nested under games)
- [ ] Cards CRUD (searchable table, edit, delete)
- [ ] Bulk import form (CSV/JSON parsing)
- [ ] Card preview (dark/light mode toggle)
- [ ] Error handling + loading states
- [ ] Test: Admin running on localhost:3001, can CRUD games

## Phase 5: Integration & Testing (Week 4-5)
- [ ] App fetches from API on launch
- [ ] Admin creates content → visible in app after sync
- [ ] Offline mode: play without network
- [ ] Mobile responsive (all 3 apps)
- [ ] Dark mode (all 3 apps)
- [ ] Error handling + edge cases
- [ ] Performance audit (Lighthouse)
- [ ] Manual E2E tests: full flow admin → app

## Phase 6: Deployment (Week 5-6)
- [ ] API deploy (Render/Railway)
- [ ] App deploy (Vercel) - playlink.app
- [ ] Admin deploy (Vercel) - admin.playlink.app
- [ ] Supabase setup (production DB, backups)
- [ ] Env setup (secrets management)
- [ ] DNS + domain setup
- [ ] Monitor logs + error tracking
- [ ] Public alpha launch

## Post-MVP (V1.1+)
- [ ] Analytics dashboard (admin)
- [ ] User accounts + game stats
- [ ] Custom card creation (users)
- [ ] Game history + replay
- [ ] Scoring system
- [ ] Mobile native (React Native)
- [ ] Service Worker + offline PWA
- [ ] Multiplayer sync (realtime)

## Known Constraints
- No user accounts MVP (anonymous play)
- No multiplayer sync (single-device for now)
- Content syndication: API → app only
- Storage: 150-200 cards baseline
