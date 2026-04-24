# Architecture

This file documents the high-level architecture for the Banking app based strictly on files present in the repository.

## Overview

- **App type**: Next.js 16 App Router application with Server Components by default. Evidence: next.config.ts, package.json (next 16.2.2).
- **Data access**: Postgres via Drizzle ORM (drizzle-orm + drizzle-kit). Evidence: package.json, database/schema.ts, database/db.ts, dal/\*.
- **Auth**: NextAuth v4 used for session management. Evidence: package.json, app/api/auth/[...nextauth]/route.ts, lib/auth-options.ts.
- **Server Actions**: mutation logic lives in actions/_. Evidence: multiple actions/_ files (register.ts, dwolla.actions.ts, wallet.actions.ts, etc.).
- **Tests**: Playwright E2E (first) then Vitest unit tests. Evidence: package.json scripts (test/test:ui/test:browser) and tests/e2e helpers.

## Technology Version Detection

### Language Versions

- **TypeScript**: 6.0.2 (detected from package.json)
- **Node.js**: 18+ recommended (check compatibility)
- **React**: 19 (detected from package.json)

### Framework Versions

- **Next.js**: 16.2.2 (App Router, Server Components by default)
- **NextAuth**: v4.24.13
- **Drizzle ORM**: drizzle-orm v0.45.2
- **drizzle-kit**: v0.31.10

### Key Library Versions

| Library         | Version | Notes         |
| --------------- | ------- | ------------- |
| Zod             | ^4.3.6  | Validation    |
| react-hook-form | ^7.72.1 | Form handling |
| Plaid           | ^41.4.0 | Bank linking  |
| Dwolla          | ^3.4.0  | ACH transfers |
| Playwright      | ^1.59.1 | E2E testing   |
| Vitest          | ^4.1.2  | Unit testing  |
| Tailwind CSS    | v4      | Styling       |

## Process Boundaries

- **UI**: components under components/ and components/layouts/ should be presentational and not access the DB directly.
- **Server wrappers/pages**: app/(root) pages and server wrappers must call auth() where needed and use DAL helpers for DB access.
- **Scripts**: scripts/ contains many tooling scripts used for seeding, migration, CI helpers, and docs generation. Inspect scripts/\* before running.

## Data Flow

- Requests that mutate state call Server Actions in actions/\_. Server Actions validate with Zod and call DAL helpers in dal/\*. See actions/register.ts and actions/dwolla.actions.ts.
- DAL functions use Drizzle queries and accept an optional tx parameter for transactions. Evidence: dal/\* files.

## Server vs Client Components

### Server Components (Default)

Use for data fetching, heavy logic, and non-interactive UI.

### Client Components

Add "use client" at top for interactivity.

## Next.js 16 Patterns

- Cache Components: "use cache" directive + cacheLife()
- Suspense Boundaries: wrap async content in Suspense
- Async Request APIs: cookies(), headers() are async in Next.js 16

## Deployment

- **Build**: Next.js build via npm run build. next-sitemap runs in postbuild. See package.json.
- **DB migration**: drizzle-kit commands configured in package.json and drizzle.config.ts.

## Files Read For This Doc (provenance)

- package.json — scripts, deps (produce tech stack evidence)
- next.config.ts — Next.js configuration and features
- database/schema.ts & database/db.ts — DB shape and connection helpers
- dal/\* — DAL patterns and optional tx parameter
- actions/\* — Server Action locations and examples
- scripts/\* — seed, mcp-runner, verify-rules and CI helper scripts

---

_Last updated: 2026-04-24_
