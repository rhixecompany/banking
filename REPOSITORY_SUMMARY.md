# REPOSITORY_SUMMARY.md — Banking

> Generated from actual git history and repository files. Evidence-based; nothing fabricated.

## Overview

**Banking** is a full-stack fintech banking application. It provides a banking dashboard where users link real bank accounts, view balances and transaction history, and move money via ACH transfers. The repo is a real code submodule (not a stub) with a substantive `src/` tree, `docs/`, `database/`, `scripts/`, and `compose/` directories, plus an extensive supporting-doc suite (`AGENTS.md`, `ARCHITECTURE.md`, `API_REFERENCE.md`, `DATABASE_SCHEMA.md`, `SECURITY.md`, `DEVELOPMENT_GUIDE.md`, etc.).

The product combines **Next.js 16** (App Router) with **PostgreSQL via Drizzle ORM**, and integrates two fintech providers:
- **Plaid** — for bank-account linking and retrieving account data
- **Dwolla** — for ACH money transfers

Status per `README.md`: **Active**. License: **Private** (no license specified).

## Architecture

- **Framework:** Next.js 16.2.4 (App Router), React 19, server components by default
- **Language:** TypeScript 6.0.3 (strict)
- **UI:** Tailwind CSS 4.x, shadcn/ui (Radix primitives), Zustand 5.x for client state
- **Data display:** TanStack React Table, Recharts, Chart.js
- **Database:** PostgreSQL via Drizzle ORM 0.45.x
- **Auth:** NextAuth.js v4 (credentials provider) + bcryptjs
- **Fintech integrations:** Plaid 42.x (bank linking), Dwolla v2 (ACH transfers)
- **Caching / rate limiting:** Upstash Redis
- **Testing:** Vitest (unit), Playwright (E2E)
- **Deployment:** Vercel and Docker (compose profiles in `compose/`)

### Layer map (from `ARCHITECTURE.md`)
```
Browser → Next.js App Router → Server Actions / API Routes
        → DAL (src/dal/*) → Drizzle ORM → PostgreSQL
        → Plaid/Dwolla (external) + Upstash Redis (cache)
```

## Key Components

- **Database Schema** (`src/database/schema.ts`): 12 tables including `users`, `user_profiles`, `banks`, `transactions`, `recipients`, plus enums (`user_role`, `transaction_status`, `transaction_type`, `transaction_channel`). Soft-delete pattern via `deletedAt`.
- **Data Access Layer** (`src/dal/`): `user.dal.ts`, `wallet.dal.ts`, `transaction.dal.ts`, `recipient.dal.ts`, `dwolla.dal.ts`, `admin.dal.ts`.
- **Server Actions** (`src/actions/`): `auth.signin.ts`, `register.ts`, `plaid.actions.ts`, `dwolla.actions.ts`, `wallet.actions.ts`, `transaction.actions.ts`, `recipient.actions.ts`.
- **API Routes** (`src/app/api/`): `/api/auth/[...nextauth]`, `/api/auth/local-create`, `/api/auth/local-validate`, `/api/dwolla/webhook`, `/api/health`.
- **Zustand Stores** (`src/stores/`): `useUIStore.ts` (UI state), `useBankStore.ts` (bank data cache).
- **App routes** (`src/app/`): route groups `(auth)`, `(root)`, `(admin)`, plus `api/`, `components/ui/`, `constants/`, `lib/` (auth, plaid, dwolla, utils), `hooks/`, `types/`, `assets/`.
- **Pages:** `/dashboard`, `/transactions`, `/transfer`, `/connect-bank`, `/settings`.
- **Infra/config:** `next.config.ts`, `drizzle.config.ts`, `lib/auth-options.ts`, `database/drizzle/` (migrations), `compose/` (Docker Compose profiles), `.envs/`.

## Technologies

See `technology-stack.md` for the full pin list. Highlights:
- Next.js 16.2.4, React 19.2.5, TypeScript 6.0.3, Tailwind CSS 4.2.4, shadcn/ui ^4.6.0, Zustand 5.0.12, Zod 4.4.3, TanStack Table 8.21.3, Recharts 3.8.1
- Backend: Drizzle ORM 0.45.2, NextAuth.js 4.24.14, Upstash Redis 1.37.0
- Integrations: Plaid 42.2.0, Dwolla (dwolla-v2 3.4.0), Resend (email)
- Dev/quality: Bun 1.3.14 (package manager), ESLint 10.3.0, Prettier 3.8.3, Vitest 4.1.5, Playwright 1.59.1, Husky 9.1.7, lint-staged 16.4.0, Drizzle Kit 0.31.10

## Data Flow

- **Authentication:** Login page → `/api/auth/local-validate` → `signin` action → bcrypt verify → NextAuth session (JWT, httpOnly cookies).
- **Connect bank:** Wallets page → Plaid Link UI → `createPlaidLinkToken` → `exchangeToken` (stores encrypted `access_token`) → `getAccounts`.
- **Transfer money:** Payment form → `transferMoney` action → Zod validate → idempotency key → Dwolla API → Dwolla webhook (`/api/dwolla/webhook`) updates `transaction_status`.

## Team

Git contributor statistics (`git shortlog -sn`):
- **Total contributors:** 1
- **Contributor:** `rhixecompany <rhixecompany@gmail.com>` — 5 commits (100%)

> Note: All commits carry the same author identity. The commit history reflects repository setup/maintenance activity rather than the original upstream development history (see `THE_STORY_OF_THIS_REPO.md` for the honest interpretation).

## Evidence Appendix (git)

- `git rev-list --count HEAD` = **5** commits total (all within the last year).
- Commit dates span **2026-06-12 → 2026-07-16**, all authored by `rhixecompany`.
- Files present confirm a real, sizable Next.js project (e.g. `bun.lock` at ~600 KB, `package.json` at 13.5 KB, `src/` application tree).
