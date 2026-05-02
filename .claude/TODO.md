# Roadmap Playlink — MVP + Admin

## Phase 1: Setup Monorepo & Shared ✓ (Week 1)
- [x] Init pnpm workspace
- [x] Create packages/{shared,api,app,admin}
- [x] Setup .claude folder (instructions, context, architecture)
- [x] Create @playlink/shared package (types, validators, constants)
- [x] Initialize Git + initial commit
- [x] Verify pnpm install + structure works

## Phase 2: API Backend ✓ (Week 1-2)
- [x] Express server init + middleware (cors, error handler)
- [x] Prisma schema + initial migrations
- [x] Supabase setup (PostgreSQL + Auth)
- [x] Seed database (4 games, 3-4 categories each, 150+ cards)
- [x] Public routes (GET /api/games, /api/cards/export)
- [x] Protected admin routes (POST/PUT/DELETE)
- [x] Bulk import endpoint (CSV/JSON upload)
- [x] Test: API running on localhost:3002, endpoints respond

## Phase 3: App Frontend ✓ (Week 2-3)
- [x] Next.js setup + TypeScript config
- [x] Layout (Header, Footer, dark mode provider)
- [x] Design tokens (Tailwind config, CSS variables)
- [x] Game selection page (list 4 games)
- [x] Category selection component
- [x] Card display component (animated)
- [x] Zustand store (game state)
- [x] API client + useApi hook
- [x] localStorage persistence + sync on launch
- [x] Responsive design (mobile-first 370px → desktop)
- [x] UI Design implementation (Lilita One font, gradients, frosted glass)
- [x] Test: App running on localhost:3000, can play offline

## Phase 4: Admin Back-Office ✓ (Week 3-4)
- [x] Next.js setup + TypeScript config
- [x] Auth page (Supabase login)
- [x] Dashboard overview (stats: games, categories, cards)
- [x] Games CRUD (list, create, edit, delete)
- [x] Categories CRUD (nested under games)
- [x] Cards CRUD (searchable table, edit, delete)
- [x] Bulk import form (CSV/JSON parsing)
- [x] Card preview (dark/light mode toggle)
- [x] Error handling + loading states
- [x] Emoji picker for category icons
- [x] Test: Admin running on localhost:3001, can CRUD games

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
