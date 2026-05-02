# Instructions pour Claude Code — Playlink Monorepo

## Architecture Globale
- **Monorepo** : packages/shared, packages/api, packages/app, packages/admin
- **Shared** : Types, validators, constants (importés partout)
- **API** : Express + Prisma + Supabase PostgreSQL
- **App** : Next.js (user-facing party/offline games)
- **Admin** : Next.js (content management back-office)

## Conventions Globales
- TypeScript strict mode obligatoire
- Functional components + hooks (React)
- Zod pour validation (API + forms)
- Error handling explicite partout
- Comments: expliquer le WHY, pas le WHAT
- Naming: camelCase (JS), kebab-case (CSS)

## Per-Package Rules

### Shared
- Types export via interfaces (prefer interface > type)
- Validators: Zod schemas centralisés
- Constants: game IDs, colors, difficulty levels
- No external dependencies except zod

### API
- Controllers: business logic isolation
- Routes: HTTP routing + middleware chain
- Middleware: auth, cors, error handling
- Prisma: queries via models
- No business logic in route handlers

### App
- Components: single responsibility
- Hooks: state + API calls
- Zustand: global game state only
- API client: centralized fetch helper
- LocalStorage: offline persistence layer

### Admin
- Forms: structured validation with Zod
- Tables: data-driven, searchable
- Auth: Supabase JWT
- API client: error handling + retry logic

## Deployment
- App (Vercel): https://playlink.app
- Admin (Vercel): https://admin.playlink.app
- API (Render/Railway): https://api.playlink.app

## Testing Strategy
- MVP: dev + manual testing
- Phase 2+: Vitest (unit), Cypress (E2E)

## Code Quality Standards
- No console.log in production code
- Error boundaries in React components
- Explicit error handling at system boundaries
- Type-safe API client with proper error types
