# Banking Agent Standards

> **Tech Stack:** Next.js 16 (App Router), TypeScript (strict), Drizzle ORM, PostgreSQL, NextAuth v4, shadcn/UI, Tailwind CSS v4, Zod, Vitest + Playwright
>
> **React Compiler:** Enabled in next.config.ts (`reactCompiler: true`) **Last Updated:** 2026-03-29

---

## Reference

### Critical Rules (PR Blocking)

| Rule | Requirement |
| --- | --- |
| No `any` types | Use `unknown` + type guards |
| No N+1 queries | Always use eager loading / JOIN — no per-row queries in loops |
| No raw `process.env` | Use `lib/env.ts` (Zod validated) |
| All mutations via Server Actions | Never API routes for mutations |
| Zero TypeScript errors | Pass `npm run type-check` |
| Zero lint warnings | Pass `npm run lint:strict` |
| All tests pass | Pass `npm run test` |

### Commands

```bash
# Development
npm run dev                    # Dev server (localhost:3000)
npm run build                  # Production build
npm run start                  # Production server

# Validation (run before commit)
npm run validate               # format + type-check + lint + test
npm run format                 # Prettier format
npm run format:check           # Check formatting
npm run lint:strict            # ESLint (blocks PR at 0 warnings)
npm run type-check             # TypeScript checking

# Database
npm run db:studio              # Drizzle Studio
npm run db:push                # Push schema changes
npm run db:migrate             # Run migrations
npm run db:generate            # Generate migrations
npm run db:check               # Drizzle migration/schema check

# Testing
npm run test                   # All tests (Vitest + Playwright)
npm run test:browser           # Vitest unit/integration tests only
npm run test:ui                # Playwright E2E tests only

# Single test execution
npm exec vitest run tests/unit/register.test.ts --config=vitest.config.ts
npm exec playwright test tests/e2e/sign-in.spec.ts
```

### Import Order

```typescript
// 1. React/core
import * as React from "react";
// 2. Next.js
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
// 3. Third-party
import { z } from "zod";
import { clsx } from "clsx";
// 4. Internal
import { userDal } from "@/lib/dal";
import { db } from "@/database/db";
// 5. UI components
import { Button } from "@/components/ui/button";
```

### Naming Conventions

| Type             | Convention  | Example          |
| ---------------- | ----------- | ---------------- |
| Files            | kebab-case  | `user-dal.ts`    |
| Classes          | PascalCase  | `UserDal`        |
| Functions        | camelCase   | `findById`       |
| Constants        | UPPER_SNAKE | `MAX_RETRY`      |
| Types/Interfaces | PascalCase  | `UserProfile`    |
| DAL instances    | camelCase   | `userDal`        |
| Server Actions   | camelCase   | `disconnectBank` |

### Project Structure

```
app/
├── (auth)/              # sign-in, sign-up
├── (root)/              # dashboard, protected routes
├── api/                 # API routes (minimal use)
components/ui/           # shadcn components
lib/
├── actions/             # Server Actions (*.ts files)
├── dal/                 # Data Access Layer (*.dal.ts files)
├── auth.ts              # auth() helper
├── env.ts               # Zod env validation
└── encryption.ts        # AES-256-GCM
database/
├── db.ts                # DB connection
└── schema.ts            # Drizzle schema
tests/
├── unit/                # Vitest tests
└── e2e/                 # Playwright tests
```

### What AGENTS.md Contains

- Tech stack overview
- Critical PR-blocking rules
- Command reference
- Code style guidelines (imports, naming)
- Project structure
- Server Action pattern
- DAL pattern
- Error handling pattern
- Component patterns (Server/Client)

### What AGENTS.md Does NOT Contain

> See these files for detailed topics:

| Topic | Location |
| --- | --- |
| Database schema reference | `database/schema.ts` |
| Environment variables | `lib/env.ts` |
| Deployment guide | `README.md`, `DEPLOYMENT-MIGRATION.md` |
| Full coding standards | `.cursor/rules/banking-coding-standards.mdc` |
| N+1 query prevention | `.cursor/rules/no-n-plus-one-queries.mdc` |
| Server Action patterns | `.cursor/rules/mutations-via-server-actions.mdc` |
| Env validation rules | `.cursor/rules/env-access-via-lib-env.mdc` |
| TypeScript strict rules | `.cursor/rules/typescript-no-any.mdc` |

---

## How-to

### Before Commit

```bash
npm run validate
```

This runs: format check → type-check → lint → test

### Add a Server Action

1. Create file: `lib/actions/<feature>.actions.ts`
2. Use `"use server"` at top
3. Import `auth` from `@/lib/auth`
4. Validate input with Zod schema
5. Return `{ ok: boolean; error?: string }` shape
6. Call DAL method
7. Use `revalidatePath()` after mutations

Example: See `lib/actions/bank.actions.ts` for `disconnectBank`

### Add DAL Query Without N+1

1. Create file: `lib/dal/<entity>.dal.ts`
2. Export a class with camelCase name (`UserDal`)
3. Export singleton instance (`export const userDal = new UserDal()`)
4. For relations, use JOIN instead of sequential queries:

```typescript
// BAD (N+1)
const users = await db.select().from(users);
for (const user of users) {
  user.profile = await db.select().from(profiles).where(...);
}

// GOOD (JOIN - single query)
const usersWithProfiles = await db
  .select({ ... })
  .from(users)
  .leftJoin(profiles, eq(users.id, profiles.userId));
```

---

## Explanation

### Why Server Actions for Mutations

Server Actions provide:

- Type-safe function calls from client to server
- Automatic request/response handling
- Built-in revalidation hooks
- No need for separate API routes

### Why lib/env.ts

Using `lib/env.ts` ensures:

- Zod-validated environment variables at startup
- Early failure with clear error messages
- Type-safe access to config throughout the app

---

**End of AGENTS.md** — For workspace rules, see [`.cursor/rules/`](.cursor/rules/)
