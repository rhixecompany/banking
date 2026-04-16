# Banking Project - GitHub Copilot Agent Rules

<!-- markdownlint-disable MD013 -->

> **Project:** Next.js 16, TypeScript (strict), Drizzle ORM, PostgreSQL, NextAuth, shadcn/UI, Tailwind CSS v4
>
> **Last Updated:** 2026-04-05

<!-- markdownlint-enable MD013 -->

---

## Source of Truth

This file is a quick reference for GitHub Copilot. For detailed patterns, see:

- **[AGENTS.md](../AGENTS.md)** — Stack, PR-blocking rules, commands, core patterns (Reference + How-to)
- **[README.md](../README.md)** — Project overview, setup, deployment

### Sync Checklist

When updating this file, verify alignment with:

- `AGENTS.md` — commands, rules, project structure
- `.cursorrules` — overlapping content should match
- package.json — scripts must match actual commands

---

## Technology Stack

| Layer      | Technology                  |
| ---------- | --------------------------- |
| Framework  | Next.js 16 (App Router)     |
| Language   | TypeScript (strict mode)    |
| ORM        | Drizzle ORM                 |
| Database   | PostgreSQL                  |
| Auth       | NextAuth v4                 |
| UI         | shadcn/UI + Tailwind CSS v4 |
| Validation | Zod                         |
| Testing    | Vitest + Playwright         |
| Encryption | AES-256-GCM                 |

### Key Characteristics

- **Server Components by default** — Use `'use client'` only when needed
- **DAL Pattern** — All database access through `dal/` (docs: prefer `@/dal` imports in examples)
- **Server Actions** — All mutations via Server Actions
- **React Compiler enabled** — `reactCompiler: true` in next.config.ts

---

## Critical Rules (PR Blocking)

| Rule | Requirement |
| --- | --- |
| No `any` types | Use `unknown` + type guards for external data |
| No N+1 queries | Eager load / JOIN — no per-row queries in loops |
| No raw `process.env` | Use `app-config.ts` (preferred) or `lib/env.ts` (backward compat) |
| All mutations via Server Actions | Never API routes for mutations |
| Zero TypeScript errors | Must pass `npm run type-check` |
| Zero lint warnings | Must pass `npm run lint:strict` |
| All tests pass | Must pass `npm run test` |

### Pre-Commit Checklist

```bash
npm run validate
```

---

## Available Commands

### Development

```bash
npm run dev              # Dev server (localhost:3000)
npm run build           # Production build
npm run start           # Start production server
```

### Validation (required before commit)

```bash
npm run validate        # Run all checks (format, type-check, lint, test)
npm run format          # Format code with Prettier
npm run format:check    # WARNING: destructive — runs format (writes files) first, then checks
npm run lint:strict     # Strict ESLint (blocks PR)
npm run type-check      # TypeScript type checking
```

### Database

```bash
npm run db:studio      # Drizzle Studio
npm run db:push        # Push schema changes to DB
npm run db:migrate     # Run migrations
npm run db:generate    # Generate migrations
npm run db:check       # Drizzle migration/schema check
```

### Testing

```bash
npm run test           # All tests (Vitest + Playwright)
npm run test:browser   # Vitest unit/integration tests
npm run test:ui        # Playwright E2E tests

# Single test execution
npm exec vitest run tests/unit/register.test.ts --config=vitest.config.ts
npm exec playwright test tests/e2e/sign-in.spec.ts
```

---

## Patterns (canonical links)

For detailed examples and up-to-date structure, follow `AGENTS.md` (canonical):

- Server Action contract (`"use server"`, auth-first, Zod validation, stable `{ ok, error? }` return shape, cache revalidation)
- DAL-only database access and avoiding N+1 queries
- Env access rules (`app-config.ts` / `lib/env.ts`) and exceptions
- Testing workflow (Playwright + Vitest) and deterministic Plaid/Dwolla behavior

---

**End of copilot-instructions.md** — See [AGENTS.md](./AGENTS.md) for full documentation.

Note: This file was reviewed and synchronized as part of the agentic docs standardization. See `AGENTS.md` for the canonical agent rules. Plans related to documentation changes should be saved under `.opencode/commands/` per repository guidance (for example: `.opencode/commands/<short-kebab-task>.plan.md`).
