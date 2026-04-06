---
description: "Banking project-specific guidelines for GitHub Copilot agents"
applyTo: "**/*.agent.md"
---

# Banking Project — Agent Guidelines

## Project Context

- **Stack:** Next.js 16.2.2, React 19, TypeScript 6.0.2 (strict), Drizzle ORM 0.45.2, PostgreSQL (Neon), NextAuth v4.24.13 (JWT), Zod v4.3.6, shadcn/ui, Tailwind CSS v4
- **Testing:** Vitest 4.1.2 (unit), Playwright 1.59.1 (E2E)
- **Integrations:** Plaid (bank linking), Dwolla (ACH transfers), Upstash Redis (rate limiting)

## PR-Blocking Rules

| Rule | Enforcement |
| --- | --- |
| No `any` types | TypeScript strict + ESLint |
| No N+1 queries | Use JOINs — never query in loops |
| No raw `process.env` | Use `app-config.ts` (preferred) or `lib/env.ts` |
| Mutations via Server Actions only | API routes forbidden for mutations |
| Zero TypeScript errors | `npm run type-check` |
| Zero lint warnings | `npm run lint:strict` |
| All tests pass | `npm run test` |

## Key Conventions

### File Structure

```
app/                  # App Router pages
actions/              # Server Actions (mutations only)
dal/                  # Data Access Layer (all DB access here)
database/             # Drizzle schema + migrations
lib/                  # Utilities (auth.ts, env.ts, encryption.ts)
components/ui/        # shadcn/ui components
tests/unit/           # Vitest tests
tests/e2e/            # Playwright tests
```

### Environment Variables

Never read `process.env` directly. Use `app-config.ts` (preferred) or `lib/env.ts`:

```typescript
import { env } from "@/lib/env";
// or preferred:
import { plaid } from "@/app-config";
```

### Server Actions Pattern

```typescript
"use server";
import { auth } from "@/lib/auth";
import {
  revalidatePath,
  unstable_updateTag as updateTag
} from "next/cache";
import { z } from "zod";

const Schema = z.object({
  name: z.string().trim().min(1).max(100).describe("Name")
});

export async function myAction(
  input: unknown
): Promise<{ ok: boolean; error?: string }> {
  const parsed = Schema.safeParse(input);
  if (!parsed.success)
    return { error: parsed.error.message, ok: false };
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized", ok: false };
  // ... DAL operations
  revalidatePath("/path");
  updateTag("tag");
  return { ok: true };
}
```

### DAL Pattern

All DB access through `dal/`. Never query inside loops — use JOINs.

```typescript
import { eq } from "drizzle-orm";
import { db } from "@/database/db";
import { users } from "@/database/schema";

export class UserDal {
  async findByEmail(email: string) {
    return db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
  }
}
export const userDal = new UserDal();
```

### Testing Commands

```bash
npm run test             # All tests (E2E first, then unit)
npm run test:browser     # Vitest only
npm run test:ui          # Playwright only
npx vitest run tests/unit/auth.test.ts
npx playwright test tests/e2e/auth.spec.ts
```

## Database Tables (10 total)

`users`, `account`, `session`, `verificationToken`, `authenticator`, `user_profiles`, `wallets`, `transactions`, `recipients`, `errors`

**Note:** Table is named `wallets`, not `banks` (was renamed).

## Auth

- NextAuth v4 with JWT strategy
- Session user has: `id`, `isAdmin`, `isActive` (NO `role` field)
- Password hashing: `bcryptjs` at cost 12
- Protected routes via `proxy.ts` middleware

## Validation

- Zod v4 with `.describe()` on every field (ESLint-enforced)
- `zod/require-error-message` — all validators need message strings
- `zod/no-optional-and-default-together` — prevent combining `.optional()` with `.default()`
