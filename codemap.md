# Repository Atlas: Banking

## Project Responsibility

A Next.js 16 banking application with Server Components, Drizzle ORM for PostgreSQL, NextAuth v4 authentication, and integrations with Plaid (bank linking) and Dwolla (ACH transfers).

---

## System Entry Points

| Entry Point | Purpose | Detailed Map |
| --- | --- | --- |
| `app/page.tsx` | Public home page (static, no auth) | [View Map](app/codemap.md) |
| `app-config.ts` | Typed env configuration | [View Map](app-config.md) |
| `package.json` | Scripts, dependencies, build config | [View Map](package.json) |
| `scripts/verify-rules.ts` | Repository policy checks | [View Map](scripts/codemap.md) |
| `drizzle.config.ts` | Drizzle ORM configuration | [View Map](database/codemap.md) |

---

## Directory Map (Aggregated)

| Directory | Responsibility Summary | Detailed Map |
| --- | --- | --- |
| `app/` | Next.js App Router pages and layouts | [View Map](app/codemap.md) |
| `actions/` | Server Actions (mutations) | [View Map](actions/codemap.md) |
| `dal/` | Data Access Layer (Drizzle queries) | [View Map](dal/codemap.md) |
| `database/` | Drizzle schema and DB init | [View Map](database/codemap.md) |
| `components/` | UI components (shadcn/ui) | [View Map](components/codemap.md) |
| `lib/` | Shared helpers (auth, env, Plaid, Dwolla) | [View Map](lib/codemap.md) |
| `scripts/` | Build, seed, verify scripts | [View Map](scripts/codemap.md) |
| `tests/` | Vitest unit + Playwright E2E | [View Map](tests/codemap.md) |
| `.opencode/` | Agent artifacts and plans | [View Map](.opencode/codemap.md) |

---

## Architecture Overview

```text
┌─────────────────────────────────────────────────────────────┐
│                      Next.js 16 App Router                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────┐     ┌─────────┐     ┌─────────┐               │
│  │  Pages │────▶│ Actions │────▶│   DAL   │               │
│  │(app/)  │     │(acts)   │     │ (dal/)  │               │
│  └─────────┘     └─────────┘     └─────────┘               │
│       │                                 │                   │
│       │                                 ▼                   │
│       │                        ┌─────────────┐              │
│       │                        │  database  │              │
│       │                        │(Postgres)  │              │
│       │                        └─────────────┘              │
│       │                                                 │
│       ▼                                                 │
│  ┌─────────┐     ┌─────────┐     ┌─────────┐               │
│  │  UI    │────▶│ Plaid   │────▶│ Dwolla  │               │
│  │(comp/) │     │  API   │     │  API   │               │
│  └─────────┘     └─────────┘     └─────────┘               │
│                                                             │
├──────────────────────────────────���──────────────────────────┤
│     NextAuth v4 Session Management (lib/auth.ts)            │
└─────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

| Technology   | Version  | Notes                         |
| ------------ | -------- | ----------------------------- |
| Next.js      | 16.2.2   | App Router, Server Components |
| React        | 19       | Server Components by default  |
| TypeScript   | 6.0.2    | strict mode enabled           |
| Drizzle ORM  | 0.45.2   | PostgreSQL access             |
| NextAuth     | v4.24.13 | Session management            |
| Plaid        | 41.4.0   | Bank linking                  |
| Dwolla       | 3.4.0    | ACH transfers                 |
| Vitest       | 4.1.2    | Unit testing                  |
| Playwright   | 1.59.1   | E2E testing                   |
| Tailwind CSS | v4       | Styling                       |

---

## Key Patterns

### Server Actions (mutations only)

- Use `"use server"` directive
- Call `auth()` early
- Validate inputs with Zod
- Return `{ ok: boolean; error?: string }`

### Environment Access

- Use `app-config.ts` (not `process.env`)
- Exception: `scripts/seed/run.ts`

### Data Access

- All DB through `dal/*` helpers
- Avoid N+1 queries (use JOINs/batching)

### Testing

- MSW for unit tests
- Mock tokens with `mock*` or `seed*` prefix for deterministic tests

---

## Files Read For This Doc (provenance)

- `package.json` — tech stack evidence
- `app/` — directory structure
- `actions/` — server action files
- `dal/` — data access patterns
- `database/` — Drizzle schema
- `components/` — UI patterns
- `lib/` — shared libraries
- `scripts/` — tooling
- `tests/` — test structure
- `.opencode/` — agent artifacts

---

Last updated: 2026-04-23
