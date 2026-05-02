# Architecture Technique — Playlink Monorepo

## Monorepo Structure
```
playlink/
├── packages/
│   ├── shared/        # @playlink/shared (types, validators, constants)
│   ├── api/          # @playlink/api (Express backend)
│   ├── app/          # @playlink/app (Next.js user app)
│   └── admin/        # @playlink/admin (Next.js admin panel)
├── .claude/          # Instructions, context, architecture
├── pnpm-workspace.yaml
└── package.json
```

## API Architecture

### Routes
```
Public (no auth):
  GET /api/games              # List all games with categories
  GET /api/games/:gameId      # Single game detail
  GET /api/cards/export       # All cards JSON (for app sync)

Protected (JWT required):
  POST   /api/admin/games     # Create game
  PUT    /api/admin/games/:id # Update game
  DELETE /api/admin/games/:id # Delete game

  POST   /api/admin/categories
  PUT    /api/admin/categories/:id
  DELETE /api/admin/categories/:id

  POST   /api/admin/cards
  PUT    /api/admin/cards/:id
  DELETE /api/admin/cards/:id
  GET    /api/admin/cards     # Search + filter

  POST   /api/admin/bulk-import  # CSV/JSON upload
```

### Prisma Schema
- **User** (for admin auth)
- **Game** (4 games with icon, colors, metadata)
- **Category** (nested under games)
- **Card** (questions/dares/truths nested under categories)
- **AuditLog** (optional, v1.1+)

### Database
- Supabase PostgreSQL (managed)
- Migrations via Prisma
- Seeding with 4 games + 150+ cards

## App Architecture

### State (Zustand)
```typescript
interface GameState {
  games: Game[];
  currentGameId: string | null;
  currentCategoryId: string | null;
  currentCardIndex: number;
  settings: { darkMode: boolean };
  // actions: setGame, nextCard, etc
}
```

### Sync Flow
1. App launches → useEffect checks localStorage
2. If cards.json outdated → fetch GET /api/cards/export
3. Decode JSON + update localStorage
4. Reload app state from localStorage
5. Play offline

### Offline Mode
- All card data cached in localStorage
- No network calls during gameplay
- Service Worker for cache-first (v1.1+)

## Admin Architecture

### Auth Pattern
- Supabase Auth session check in middleware
- Protected routes redirect to /login
- JWT in Authorization header for API calls

### CRUD Workflows
- List page: table (searchable, sortable)
- Detail page: form to edit
- Create page: empty form
- Delete: confirm dialog + API call

## Deployment

### Environment Variables

**API**
```
DATABASE_URL=postgresql://...
SUPABASE_URL=...
SUPABASE_KEY=...
JWT_SECRET=...
CORS_ORIGIN=https://playlink.app,https://admin.playlink.app
NODE_ENV=production
```

**App**
```
NEXT_PUBLIC_API_URL=https://api.playlink.app
NEXT_PUBLIC_APP_URL=https://playlink.app
NODE_ENV=production
```

**Admin**
```
NEXT_PUBLIC_API_URL=https://api.playlink.app
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NODE_ENV=production
```

## Key Design Decisions

1. **Monorepo over separate repos** : Shared types, unified CI/CD
2. **Zustand over Redux** : Simpler for MVP, sufficient for game state
3. **Offline-first via localStorage** : No realtime sync needed
4. **Supabase Auth** : Managed auth + PostgreSQL in one platform
5. **Prisma + TypeScript** : Type-safe queries, migrations
6. **Tailwind + custom tokens** : Scalable design system
7. **Next.js for both app + admin** : Shared patterns, faster dev
