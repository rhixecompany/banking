---
description: Banking application initialization plan documenting project state, conventions, and actionable steps
status: complete
phase: 1
updated: 2026-04-24
---

# Banking Application Initialization Plan

## Project Overview

This document provides a comprehensive initialization plan for the Banking application, documenting the current project state, key conventions to maintain, and actionable steps for understanding and working on the project.

## 1. Project State Summary

### Technology Stack

| Component    | Version  | Purpose                           |
| ------------ | -------- | --------------------------------- |
| Next.js      | 16.2.2   | App Router, RSC, Cache Components |
| React        | 19       | UI Framework                      |
| TypeScript   | 6.0.2    | Type safety with strict mode      |
| Drizzle ORM  | 0.45.2   | Type-safe SQL queries             |
| PostgreSQL   | via Neon | Relational database               |
| NextAuth     | v4.24.13 | Authentication                    |
| Plaid        | 41.4.0   | Bank account linking              |
| Dwolla       | 3.4.0    | ACH transfers                     |
| Zod          | 4.3.6    | Runtime validation                |
| Playwright   | 1.59.1   | E2E testing                       |
| Vitest       | 4.1.2    | Unit testing                      |
| Tailwind CSS | v4       | Styling                           |

### Project Structure

```
banking/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Auth routes (sign-in, sign-up)
│   ├── (root)/            # Protected routes
│   ├── (admin)/          # Admin routes
│   └── api/              # API routes
├── actions/               # Server Actions
├── dal/                   # Data Access Layer
├── database/             # Drizzle schema and config
├── components/            # UI components
│   └── ui/               # shadcn/ui components
├── lib/                   # Shared libraries
├── scripts/               # Build, seed, verify scripts
├── tests/                 # Unit and E2E tests
│   ├── e2e/             # Playwright tests
│   └── unit/             # Vitest tests
└── .opencode/            # Agent artifacts
```

## 2. Key Conventions to Maintain

### Server Actions Pattern

All mutations must use Server Actions with the following pattern:

```typescript
"use server";

import { z } from "zod";
import { userDal } from "@/dal";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100)
});

export async function createUser(
  input: unknown
): Promise<{ ok: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user) {
    return { ok: false, error: "Unauthorized" };
  }

  const parsed = CreateUserSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.message };
  }

  try {
    await userDal.create(parsed.data);
    revalidatePath("/users");
    return { ok: true };
  } catch {
    return { ok: false, error: "Failed to create user" };
  }
}
```

### Environment Access

Access environment variables via `app-config.ts` (preferred) or `lib/env.ts`:

```typescript
// BEST - domain-specific configs
import { plaid, dwolla } from "@/app-config";
const clientId = plaid.PLAID_CLIENT_ID;

// GOOD - backward compat
import { env } from "@/lib/env";
const databaseUrl: string = env.DATABASE_URL;

// BAD - never use process.env directly
const databaseUrl = process.env.DATABASE_URL;
```

### DAL Patterns

Use DAL helpers for all database access to prevent N+1 queries:

```typescript
// BAD (N+1 pattern)
const users = await userDal.findAll();
for (const user of users) {
  user.accounts = await accountDal.findByUserId(user.id);
}

// GOOD (eager loading)
const usersWithAccounts = await userDal.findAllWithAccounts();
```

### Validation Requirements

- Use Zod for all input validation
- Include `.describe()` for each field
- Return consistent shape: `{ ok: boolean; error?: string }`

## 3. Actionable Steps

### For New Contributors

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Fill in required values (Plaid, Dwolla, database)

3. Start development server:

   ```bash
   npm run dev
   ```

4. Verify project health:
   ```bash
   npm run format
   npm run type-check
   npm run lint:strict
   ```

### For Feature Development

1. Create Server Actions in `actions/` directory
2. Use DAL helpers in `dal/` for database access
3. Validate inputs with Zod schemas
4. Return consistent `{ ok, error? }` shape

### For Testing

1. Run unit tests:

   ```bash
   npm run test:browser
   ```

2. Run E2E tests:

   ```bash
   npm run test:ui
   ```

3. Run all tests:
   ```bash
   npm run test
   ```

## 4. Pre-PR Validation Checklist

Before opening a PR, run the following:

- [ ] `npm run format` - Format code
- [ ] `npm run type-check` - TypeScript validation
- [ ] `npm run lint:strict` - ESLint with zero warnings
- [ ] `npm run verify:rules` - Repository policy checks

## 5. Database Commands

```bash
# Push schema to database
npm run db:push

# Generate migrations
npm run db:generate

# Run migrations
npm run db:migrate

# Seed database
npm run db:seed

# Open Drizzle Studio
npm run db:studio
```

## 6. Key Files Reference

| File                   | Purpose                    |
| ---------------------- | -------------------------- |
| `AGENTS.md`            | Canonical agent rules      |
| `app-config.ts`        | Typed environment config   |
| `lib/auth-options.ts`  | NextAuth configuration     |
| `lib/auth.ts`          | Server-side session helper |
| `database/schema.ts`   | Database schema            |
| `dal/*.dal.ts`         | Data access helpers        |
| `actions/*.actions.ts` | Server Actions             |

## 7. Common Issues and Solutions

### Port Already in Use

If port 3000 is in use:

```bash
# Find and kill process on port 3000
$pids = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
if ($pids) { $pids | ForEach-Object { Stop-Process -Id $_ -Force } }
```

### Database Connection Issues

- Verify `DATABASE_URL` is set in `.env.local`
- Check database is running (Neon console, local PostgreSQL)
- Run `npm run db:push` to sync schema

### Authentication Errors

- Verify `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches your environment
- Ensure OAuth credentials are configured in `.env.local`

## 8. Related Plans and Documentation

- Previous work batches: `.opencode/commands/*.plan.md`
- Cursor plans: `.cursor/plans/*.plan.md`
- Agent instructions: `.opencode/instructions/`
- Code philosophy: `.opencode/skills/code-philosophy/`

---

## Status Log

| Date       | Status      | Notes                |
| ---------- | ----------- | -------------------- |
| 2026-04-24 | In Progress | Initial plan created |

## Verification

- [x] Tech stack confirmed from package.json
- [x] Project structure documented
- [x] Conventions identified from AGENTS.md
- [ ] Verification commands tested
- [ ] Database connection validated

---

_Last updated: 2026-04-24_
