# Banking Agent Standards

<!-- markdownlint-disable MD013 -->

> **Tech Stack:** Next.js 16 (App Router), TypeScript (strict), Drizzle ORM, PostgreSQL, NextAuth v4, shadcn/UI, Tailwind CSS v4, Zod, Vitest + Playwright
>
> **React Compiler:** Enabled (`reactCompiler: true`)
> **Cache Components:** Enabled (`cacheComponents: true`)
> **Last Updated:** 2026-03-31

<!-- markdownlint-enable MD013 -->

---

## Quick Start

1. Run `npm install` to install dependencies
2. Set up `.env.local` with required environment variables (see `lib/env.ts`)
3. Run `npm run dev` to start development server
4. Run `npm run validate` before committing

---

## Critical PR-Blocking Rules

> ⚠️ **These rules MUST pass before any PR can be merged.**

| # | Rule | Requirement | Enforcement |
|---|------|-------------|-------------|
| 1 | No `any` types | Use `unknown` + type guards | TypeScript strict |
| 2 | No N+1 queries | Always eager load / JOIN | Code review |
| 3 | No raw `process.env` | Use `lib/env.ts` | ESLint + TypeScript |
| 4 | Mutations via Server Actions | Never API routes | Code review |
| 5 | Zero TypeScript errors | Pass `npm run type-check` | CI |
| 6 | Zero lint warnings | Pass `npm run lint:strict` | CI |
| 7 | All tests pass | Pass `npm run test` | CI |

---

## Tech Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Framework | Next.js | 16.x (App Router) |
| Language | TypeScript | strict mode |
| ORM | Drizzle | latest |
| Database | PostgreSQL | latest |
| Auth | NextAuth | v4 |
| UI | shadcn/UI | latest |
| Styling | Tailwind CSS | v4 |
| Validation | Zod | latest |
| Testing | Vitest + Playwright | latest |

### Key Characteristics

- **Server Components by default** - Use `
use
client` only when needed
- **DAL Pattern** - All database access through `lib/dal/`
- **Server Actions** - All mutations via Server Actions, never API routes
- **React Compiler enabled** - `reactCompiler: true` in next.config.ts
- **Cache Components** - Next.js 16 caching enabled

---

## Environment Variables

**NEVER use `process.env` directly.** Use `lib/env.ts`:

```typescript
// BAD
const apiKey = process.env.API_KEY;

// GOOD
import { env } from "@/lib/env";
const apiKey = env.API_KEY;
```

Required variables in `lib/env.ts`:

```bash
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=your-secret-min-32-chars
NEXTAUTH_URL=http://localhost:3000
PLAID_CLIENT_ID=...
PLAID_SECRET=...
DWOLLA_KEY=...
DWOLLA_SECRET=...
```

---

## Commands

```bash
# Development
npm run dev              # Dev server
npm run build           # Production build
npm run start           # Start production

# Validation (Required Before Commit)
npm run validate        # All checks
npm run format         # Format code
npm run lint:strict    # ESLint (0 warnings)
npm run type-check     # TypeScript errors
npm run test           # All tests

# Database
npm run db:push        # Push schema
npm run db:migrate      # Run migrations
npm run db:seed         # Seed data
npm run db:studio       # Drizzle Studio
```

---

## Project Structure

```
app/
├── (auth)/           # Auth routes (sign-in, sign-up)
├── (root)/            # Protected routes
│   ├── dashboard/
│   ├── settings/
│   ├── my-banks/
│   └── transaction-history/
├── api/               # API routes (minimal use)
└── layout.tsx

lib/
├── actions/            # Server Actions
├── dal/               # Data Access Layer
├── auth.ts            # auth() helper
├── env.ts             # Zod env validation
└── utils.ts          # Utilities

components/
├── ui/                # shadcn components
└── ...                # App components

database/
├── db.ts              # DB connection
└── schema.ts          # Drizzle schema
```

---

## TypeScript Strict Rules

### No `any` Types

```typescript
// BAD
function parseInput(input: any) { ... }

// GOOD - unknown + type guard
function hasValue(input: unknown): input is HasValue { ... }
```

### Explicit Return Types

```typescript
export function getUser(id: string): Promise<User | null> {
  return db.query.users.findFirst({ where: eq(users.id, id) });
}
```

---

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Files | kebab-case | `user-dal.ts` |
| Classes | PascalCase | `UserDal` |
| Functions | camelCase | `findById` |
| Variables | camelCase | `currentUser` |
| Constants | UPPER_SNAKE | `MAX_RETRY` |
| Types | PascalCase | `UserProfile` |

---

## Server Actions Pattern

All mutations via Server Actions, never API routes:

```typescript
"use server";

import { z } from "zod";
import { userDal } from "@/lib/dal";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

export async function createUser(
  input: unknown
): Promise<{ ok: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user) return { ok: false, error: "Unauthorized" };

  const parsed = CreateUserSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.message };

  try {
    await userDal.create(parsed.data);
    revalidatePath("/users");
    return { ok: true };
  } catch { return { ok: false, error: "Failed to create" }; }
}
```

---

## DAL Pattern

All database access through `lib/dal/`:

```typescript
// lib/dal/user.dal.ts
export class UserDal extends BaseDal<typeof users> {
  async findByEmail(email: string) {
    return db.select().from(users).where(eq(users.email, email)).limit(1);
  }
}
export const userDal = new UserDal();
```

### N+1 Prevention

```typescript
// BAD - N+1
for (const user of users) {
  user.accounts = await accountDal.findByUserId(user.id);
}

// GOOD - JOIN
const usersWithAccounts = await db
  .select({ user: users, account: accounts })
  .from(users)
  .leftJoin(accounts, eq(users.id, accounts.userId));
```

---

## Security

- Sanitize all user input
- Hash passwords before storage
- Never log sensitive data
- Use parameterized queries (Drizzle does this)
- Prefer server-side authorization
- Never trust client input

---

## Testing

```bash
npm run test           # All tests
npm run test:browser   # Vitest only
npm run test:ui        # Playwright only
```

---

## OpenCode Usage

For detailed patterns, see `.opencode/instructions/`:

| File | Purpose |
|------|---------|
| `01-core-standards.md` | Critical rules, TypeScript |
| `02-nextjs-patterns.md` | Next.js, Server Actions |
| `03-dal-patterns.md` | Drizzle, N+1 prevention |
| `04-auth-testing.md` | Auth, Vitest, Playwright |
| `05-ui-validation.md` | shadcn, Zod forms |
| `06-commands-ref.md` | Commands, workflows |

### OpenCode Agents

- `plan` - Review and plan changes
- `build` - Implement features
- `review` - Review code changes

### OpenCode Commands

- `/validate` - Run all checks
- `/test` - Run tests
- `/build` - Build project

---

## Cursor Rules

Rules are automatically loaded from `.cursor/rules/`:

- `banking-coding-standards.mdc`
- `no-n-plus-one-queries.mdc`
- `mutations-via-server-actions.mdc`
- `env-access-via-lib-env.mdc`
- `typescript-no-any.mdc`

---

## Pre-Commit Checklist

```bash
npm run validate
```

---

## Related Files

| Topic | Location |
|-------|----------|
| Database Schema | `database/schema.ts` |
| Environment Variables | `lib/env.ts` |
| Server Actions | `lib/actions/*.actions.ts` |
| DAL | `lib/dal/*.dal.ts` |
| Auth | `lib/auth.ts` |

---

## External References

- [Next.js Docs](https://nextjs.org/docs/app)
- [TypeScript](https://www.typescriptlang.org/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [NextAuth](https://next-auth.js.org/)
- [Zod](https://zod.dev/)
- [Vitest](https://vitest.dev/)
- [Playwright](https://playwright.dev/)

