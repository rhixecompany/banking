---
name: banking
description: Next.js 16 fintech banking app with PostgreSQL, Drizzle ORM, NextAuth v4, Plaid/Dwolla integrations. Use when developing features, fixing bugs, or performing code reviews on the banking application.
---

## Core Patterns

### Environment & Config Access

All environment variables must be accessed via `app-config.ts` — never read `process.env` directly in app code.

```typescript
// Correct: use app-config.ts
import { auth, plaid, dwolla } from "@/app-config";
const secret = auth.NEXTAUTH_SECRET;

// Also correct: lib/env.ts re-exports (backward compat)
import { env } from "@/lib/env";
const clientId = env.PLAID_CLIENT_ID;

// WRONG: direct process.env access
const secret = process.env.NEXTAUTH_SECRET;
```

**Verified Exceptions:** `proxy.ts` and `scripts/seed/run.ts` read Upstash env vars directly.

### Database Access (DAL Pattern)

Never import DB client directly in UI/route components. Use DAL helpers from `@/dal/`:

```typescript
// WRONG: in app/dashboard/page.tsx
import { db } from "@/database/db";
const users = await db.select().from(usersTable);

// CORRECT: use DAL helper
import { userDal } from "@/dal";
const users = await userDal.findAll();
```

**DAL Files:**

- `dal/user.dal.ts` — User/Profile CRUD
- `dal/wallet.dal.ts` — Wallet management
- `dal/transaction.dal.ts` — Transactions with N+1 prevention
- `dal/recipient.dal.ts` — Transfer recipients
- `dal/dwolla.dal.ts` — Dwolla integration
- `dal/admin.dal.ts` — Admin operations

### N+1 Query Prevention

Always batch fetch related data. Reference `dal/transaction.dal.ts`:

```typescript
// 1. Fetch base rows
const txns = await db.select().from(transactions).where(...);

// 2. Collect unique IDs
const walletIds = new Set<string>();
for (const t of txns) {
  if (t.senderWalletId) walletIds.add(t.senderWalletId);
  if (t.receiverWalletId) walletIds.add(t.receiverWalletId);
}

// 3. Batch fetch (single query, no N+1)
const walletsMap = new Map<string, Wallet>();
if (walletIds.size > 0) {
  const rows = await db
    .select()
    .from(wallets)
    .where(inArray(wallets.id, Array.from(walletIds)));
  for (const row of rows) {
    walletsMap.set(row.id, row);
  }
}

// 4. Map related data back
return txns.map(txn => ({
  ...txn,
  senderWallet: walletsMap.get(txn.senderWalletId) ?? null,
  receiverWallet: walletsMap.get(txn.receiverWalletId) ?? null
}));
```

### Server Actions Contract

All mutations use Server Actions (not API routes):

```typescript
// actions/register.ts
"use server";
import { z } from "zod";
import { userDal } from "@/dal";
import { signUpSchema } from "@/lib/validations/auth";

export async function registerUser(input: unknown): Promise<{
  ok: boolean;
  user?: UserWithProfile;
  error?: string;
}> {
  // 1. Validate input
  const parsed = signUpSchema.safeParse(input);
  if (!parsed.success) {
    const errors = parsed.error.issues
      .slice(0, 3)
      .map(i => i.message)
      .join("; ");
    return { error: errors, ok: false };
  }

  // 2. Check existing
  const existing = await userDal.findByEmail(parsed.data.email);
  if (existing) {
    return { error: "Email already registered", ok: false };
  }

  // 3. Use DAL helper
  const result = await userDal.create(parsed.data);
  return { ok: true, user: result.user };
}
```

### Home Page Rules

`app/page.tsx` must stay public and static — no auth, DB, or env access:

```typescript
// WRONG
export default async function Home() {
  const user = await auth(); // NO
  await userDal.findById(id); // NO
  process.env.SECRET; // NO
}

// CORRECT
export default function Home() {
  return <LandingPageContent />;
}
```

### Mock Token Testing (Plaid/Dwolla)

Use mock tokens for deterministic testing:

```typescript
// lib/plaid.ts
export function isMockAccessToken(token: string): boolean {
  if (!token) return false;
  const t = token.toLowerCase();
  return (
    t.startsWith("seed-") ||
    t.startsWith("mock-") ||
    t.startsWith("mock_")
  );
}

// tests/e2e/helpers/plaid.mock.ts
export async function addMockPlaidInitScript(
  page: Page,
  publicToken = "MOCK_PUBLIC_TOKEN"
) {
  const script = `(() => {
    window.Plaid = {
      create: function(opts) {
        setTimeout(() => {
          if (opts?.onSuccess) opts.onSuccess(${JSON.stringify(publicToken)}, { metadata: {} });
        }, 0);
        return { open: function() {} };
      }
    };
  })();`;
  await page.addInitScript(script);
}
```

**E2E Seed User:** `seed-user@example.com` / `password123`

### Soft Delete Pattern

Database uses soft delete via `deletedAt` timestamp:

```typescript
// DAL automatically filters soft-deleted
async findById(id: string) {
  const [user] = await db.select().from(users).where(eq(users.id, id));
  return user?.deletedAt === null ? user : undefined;
}

// Soft delete
await db.update(users).set({ deletedAt: new Date() }).where(eq(users.id, id));
```

### Zustand Stores

State management via Zustand in `stores/`:

- `stores/ui-store.tsx` — UI state (modals, sidebar)
- `stores/toast-store.tsx` — Toast notifications
- `stores/transfer-store.tsx` — Transfer form state
- `stores/filter-store.tsx` — Filter state
- `stores/session.tsx` — Auth session state

### Validation Schemas

Zod schemas in `lib/validations/`:

- `lib/validations/auth.ts` — signUpSchema, signInSchema
- `lib/validations/transfer.ts` — transferSchema
- `lib/validations/admin.ts` — admin schemas

---

## Reference Files

| File | Content | When to Load |
| --- | --- | --- |
| `AGENTS.md` | Single source of truth for all agent guidance | Always first |
| `app-config.ts` | Typed env config (auth, plaid, dwolla, redis, email) | Env access |
| `dal/user.dal.ts` | User CRUD with soft-delete, transactions | DB patterns |
| `dal/transaction.dal.ts` | N+1 prevention pattern | Batch queries |
| `actions/register.ts` | Server Action pattern | Action patterns |
| `lib/plaid.ts` | Mock token detection, Plaid client setup | Plaid integration |
| `database/schema.ts` | Drizzle schema (users, wallets, transactions, etc.) | DB structure |
| `next.config.ts` | Next.js 16 flags (cacheComponents, typedRoutes, reactCompiler) | Config reference |
| `scripts/verify-rules.ts` | AST policy enforcement | CI rules |

---

## Key Workflows

### Local Development Setup

```bash
bun install
cp .env.example .env.local
docker-compose up -d postgres redis
bun run db:push
bun run db:seed
bun run dev
```

### Pre-PR Validation

```bash
bun run format && bun run type-check && bun run lint:strict && bun run verify:rules
```

### Run Tests

```bash
bun run test:browser  # Unit tests (Vitest)
bun run test:ui       # E2E tests (Playwright)
```

### Database Operations

```bash
bun run db:push    # Push schema to Postgres
bun run db:seed    # Load test data
bun run db:studio  # Open Drizzle Studio
```

---

## Tech Stack Summary

- **Framework:** Next.js 16.2.4 (App Router, Server Components by default)
- **React:** 19 with React Compiler
- **TypeScript:** 6.0.2 strict mode (no `any`)
- **Package Manager:** Bun 1.3.13
- **Database:** PostgreSQL + Drizzle ORM
- **Auth:** NextAuth v4.24.14 with JWT
- **Testing:** Vitest (unit) + Playwright (E2E, stateful)
- **Integrations:** Plaid (bank linking), Dwolla (ACH transfers), Upstash Redis
- **UI:** Tailwind CSS v4, shadcn/ui, Radix UI, Zustand

---

## Critical Rules Summary

1. **Never read `process.env` directly** — use `app-config.ts`
2. **Never import DB in UI** — use DAL helpers
3. **Batch N+1 queries** — collect IDs, batch fetch with IN clause
4. **Use Server Actions** — not API routes for mutations
5. **Keep home page static** — no auth/DB/env calls in `app/page.tsx`
6. **Use mock tokens** — `seed-*`, `mock-*`, `mock_` for testing
7. **Pre-PR checks** — format, type-check, lint, verify:rules
