---
name: banking
description: "Next.js 16 fintech banking app with PostgreSQL, Drizzle ORM, NextAuth v4, Plaid/Dwolla integrations. Use when developing features, fixing bugs, or performing code reviews. Keywords: banking, fintech, wallet, transfer, ACH, plaid, dwolla, drizzle, postgres, NextAuth, soft-delete, idempotency."
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

**MANDATORY - READ ENTIRE FILE**: Before implementing ANY batch query pattern, you MUST read [`dal-patterns.md`](./reference/dal-patterns.md) (~250 lines) completely. Do NOT proceed without understanding the 4-step batch-fetch pattern.

**Do NOT load** `validations.md` or `testing.md` for N+1 queries.

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

**MANDATORY - READ ENTIRE FILE**: Before writing any Server Action that mutates data, read [`validations.md`](./reference/validations.md) (~150 lines) completely. Understand the Server Actions flow: validate → check existing → use DAL → return result.

**Do NOT load** `dal-patterns.md` or `testing.md` for mutations.

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

**Error Handling Pattern:**

- **Validation fails** → Return `{ ok: false, error: "..." }` (client shows validation UI)
- **DB constraint fails** → Return `{ ok: false, error: "Email exists" }` (client retries or shows retry prompt)
- **External API fails** (Plaid/Dwolla timeout) → Return `{ ok: false, error: "Service unavailable" }` with retry-able flag
- **Unexpected error** → Log to error service, return `{ ok: false, error: "Technical error, please retry" }`

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

**MANDATORY - READ ENTIRE FILE**: Before implementing Plaid/Dwolla mocking or testing, you MUST read [`testing.md`](./reference/testing.md) (~180 lines) completely. Understand mock token detection (`seed-*`, `mock-*`) and E2E Plaid mock injection.

**Do NOT load** `validations.md` or `dal-patterns.md` for testing.

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
  const script = `window.Plaid = {
    create: opts => {
      setTimeout(() => opts?.onSuccess?.("${publicToken}", { metadata: {} }), 0);
      return { open: () => {} };
    }
  };`;
  await page.addInitScript(script);
}
```

**E2E Seed User:** `seed-user@example.com` / `password123`

### Plaid/Dwolla Anti-Patterns

**NEVER** do these when integrating Plaid or Dwolla:

- **❌ NEVER skip error boundaries on Plaid Link** — Plaid's hosted flow can fail silently. Always wrap with try-catch and show user fallback UI. Why: Without fallback, users can't add accounts and support gets blind tickets.
- **❌ NEVER use Plaid access tokens in client components** — Tokens are valid for months and can be replayed. Why: Exposes token to XSS; use mock tokens in tests only, real tokens server-only.
- **❌ NEVER process Dwolla transfers without idempotency keys** — Network failures can cause double-transfers. Why: Financial data corruption; use UUID-based idempotency keys on all transfer mutations.
- **❌ NEVER store Plaid Item ID in plaintext** — Plaid Item IDs identify bank links. Why: If leaked, attacker can query your user's transaction history via Plaid API.
- **❌ NEVER skip decimal precision in Dwolla amounts** — Using floating point (e.g., `0.1 + 0.2 = 0.30000000000000004`) causes fund loss. Why: Dwolla expects integers (cents), rounding errors compound across millions of transactions.

## Payment Flow Decision Framework

Before implementing any transfer, payment, or funding flow, ask yourself:

1. **Atomicity**: Can this transaction fail partway? If yes, add rollback logic.
2. **Idempotency**: If the request is retried, will we double-charge? If yes, use idempotency keys.
3. **Precision**: Are we using floating-point math on currency amounts? If yes, switch to `Decimal` or cent-based integers.
4. **Error Handling**: If Plaid/Dwolla times out, what's the fallback? Must return clear error to user, not silent failure.
5. **Audit Trail**: Does the server action log all state changes? Required for PCI/financial compliance.

## Financial Data Safety

### Currency Precision Pattern

**NEVER** use floating point for currency. Use cent-based integers:

```typescript
// ❌ WRONG: Floating point causes rounding errors
const amount = 10.5; // May be 10.499999999 in memory

// ✅ CORRECT: Use integers (cents)
const amountCents = 1050; // Represents $10.50
const transferred = Math.floor(amountCents * 0.01); // Always exact
```

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
| `app-config.ts` | Typed env config (auth, plaid, dwolla, redis, email) | When accessing secrets |
| `dal/user.dal.ts` | User CRUD with soft-delete, transactions | When implementing user features |
| `dal/transaction.dal.ts` | N+1 prevention pattern | When writing batch queries |
| `actions/register.ts` | Server Action pattern | When writing mutations |
| `lib/plaid.ts` | Mock token detection, Plaid client setup | When testing Plaid integration |
| `database/schema.ts` | Drizzle schema (users, wallets, transactions, etc.) | When modifying DB structure |
| `next.config.ts` | Next.js 16 flags (cacheComponents, typedRoutes, reactCompiler) | When troubleshooting build issues |
| `scripts/verify-rules.ts` | AST policy enforcement | When debugging pre-PR failures |

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

## Critical Rules Summary

1. **Never read `process.env` directly** — use `app-config.ts`
2. **Never import DB in UI** — use DAL helpers
3. **Batch N+1 queries** — collect IDs, batch fetch with IN clause
4. **Use Server Actions** — not API routes for mutations
5. **Keep home page static** — no auth/DB/env calls in `app/page.tsx`
6. **Use mock tokens** — `seed-*`, `mock-*`, `mock_` for testing
7. **Use cent-based integers for currency** — never floating point
8. **Add idempotency keys to transfers** — prevent double-charges
9. **Pre-PR checks** — format, type-check, lint, verify:rules
