# 🎮 Playlink — Party Card Games App

Playlink is an offline-first web app for social card games designed for 16-35 year-olds. Play with friends at parties, trips, and hangouts without internet.

## 🎯 Features

- **4 Social Games**: Action or Truth, Icebreaker, Damage Debate, Balance Your Friend
- **Offline First**: All content synced at launch, play without internet
- **Mobile Responsive**: Works on all devices (mobile-first design)
- **Dark Mode**: System preference detection + manual toggle
- **Admin Panel**: Manage content (games, categories, cards) with bulk import
- **No Sign-up**: Play anonymously, no user accounts needed (MVP)

## 📁 Project Structure

This is a **pnpm monorepo** with 4 packages:

```
playlink/
├── packages/
│   ├── shared/     # @playlink/shared — Types, validators, constants
│   ├── api/        # @playlink/api — Express + Prisma backend
│   ├── app/        # @playlink/app — Next.js user app
│   └── admin/      # @playlink/admin — Next.js admin panel
├── .claude/        # Claude Code instructions & context
└── pnpm-workspace.yaml
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- pnpm (install via `npm install -g pnpm`)
- Supabase account (for database)

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables (see .env.example in each package)
# Update DATABASE_URL, Supabase keys, etc.

# Dev mode (all 3 apps)
pnpm dev
# App: http://localhost:3000
# Admin: http://localhost:3001
# API: http://localhost:3002
```

### Database Setup

```bash
# Generate Prisma client
cd packages/api
pnpm exec prisma generate

# Push schema to database (first time)
pnpm exec prisma db push

# Seed with initial data (4 games, 150+ cards)
pnpm exec prisma db seed
```

## 📦 Commands

- `pnpm dev` — Run all apps in development mode
- `pnpm build` — Build all packages
- `pnpm lint` — Lint all packages
- `pnpm type-check` — TypeScript check all packages

Per-package commands in respective `package.json`.

## 🏗️ Tech Stack

| Layer | Tech |
|-------|------|
| **Frontend (User App)** | Next.js 14, React, TypeScript, Zustand, Tailwind, Framer Motion |
| **Backend (API)** | Express, Prisma, TypeScript |
| **Admin** | Next.js 14, React, TypeScript, Tailwind |
| **Database** | PostgreSQL (Supabase) |
| **Auth** | Supabase Auth (JWT) |
| **Monorepo** | pnpm workspaces |

## 📚 Documentation

- [Instructions](.claude/instructions.md) — Conventions, per-package rules
- [Context](.claude/context.md) — Project vision, tech decisions
- [Architecture](.claude/architecture.md) — System design, API routes
- [TODO](.claude/TODO.md) — Development roadmap

## 🎮 How It Works

1. **Admin** creates/edits content (games, categories, cards) via the admin panel
2. **API** stores content in PostgreSQL
3. **App** fetches all content on launch via `GET /api/cards/export`
4. **App** caches content in localStorage
5. **User** plays offline — no network needed during gameplay

## 🚢 Deployment

- **App**: Vercel (playlink.app)
- **Admin**: Vercel (admin.playlink.app)
- **API**: Render/Railway (api.playlink.app)
- **Database**: Supabase (managed PostgreSQL)

## 📝 License

MIT

---

Made with ❤️ for party lovers everywhere
