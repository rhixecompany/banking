# AGENTS.md — Banking Project Canonical Reference

**Last Generated:** April 2, 2026 | **Version:** 4.0 | **Total Sections:** 28

---

## Changelog

### April 2, 2026 — Complete Rewrite v4.0

- Full replacement of v3.0 (inaccurate schema fields, session shape, env vars, debt status, action signatures)
- Corrected `database/schema.ts`: `user_profiles` has `address/city/state/postalCode/phone/dateOfBirth` — NOT `bio/avatarUrl/preferences`
- Corrected `banks` table: includes `accountNumberEncrypted`, `routingNumber`, `sharableId`, `fundingSourceUrl`, `dwollaCustomerUrl` — matches actual schema
- Corrected `transactions` table: `senderBankId`/`receiverBankId` FKs, `channel`, `currency`, `status`, `type` columns
- Corrected session shape: `isAdmin: boolean` + `isActive: boolean` — **no `role` field on session** (role is DB-only)
- Corrected env vars: 24 total; `DATABASE_URL` is optional; `SMTP_PASS` not `SMTP_PASSWORD`; added `DWOLLA_BASE_URL`, `PLAID_BASE_URL`, `NEXTAUTH_URL`
- Corrected `logoutAccount` return type: `Promise<boolean>` not `Promise<{ ok: boolean }>`
- Corrected `getLoggedInUser` return type: `Promise<{ name?, email? } | undefined>` not `| null`
- Updated debt table: items #2, #3 resolved; items #6, #7, #8, #9 added
- Added `noInlineConfig: true` ESLint warning — inline disable comments have NO effect
- Added dual auth config debt (#6) — `lib/auth-options.ts` vs `lib/auth-config.ts`
- Auth mock pattern corrected: use `undefined` not `null`
- `db:reset` does NOT seed (runs `db:drop && db:generate && db:push` only)
- `pretest` runs `type-gen` (next typegen), NOT `type-check`

---

## 1. Tech Stack Overview

The Banking project is a Next.js 16 full-stack financial application with TypeScript strict mode, end-to-end encryption, and comprehensive integration with Plaid (bank linking) and Dwolla (ACH transfers).

### Core Stack

| Technology | Version | Purpose |
| --- | --- | --- |
| **Next.js** | 16.2.2 | App Router, React Server Components, Cache Components |
| **React** | 19 | UI library (React Compiler enabled for auto-memoization) |
| **TypeScript** | 6.0.2 | Strict mode enabled, typed routes |
| **PostgreSQL** | via Neon | Relational database |
| **Drizzle ORM** | 0.45.2 | Type-safe SQL query builder and schema management |
| **NextAuth.js** | v4.24.13 | JWT sessions, OAuth providers, credentials auth |
| **AES-256-GCM** | — | Symmetric encryption for sensitive fields |
| **shadcn/ui** | latest | Pre-built accessible UI components |
| **Tailwind CSS** | v4 | Utility-first CSS (PostCSS, configured via `@theme` in globals.css) |
| **React Hook Form** | latest | Form state management |
| **Zod** | v4.3.6 | Runtime schema validation and type inference |
| **Vitest** | 4.1.2 | Unit and integration testing (happy-dom) |
| **Playwright** | 1.59.1 | E2E browser automation (Chromium) |
| **bcryptjs** | latest | Password hashing |
| **npm** | — | Package manager |

### Special Features

- **React Compiler:** Enabled — automatic memoization, no manual `useMemo`/`useCallback` needed
- **Cache Components:** Enabled — requires Next.js 16+ (`"use cache"` directive)
- **Typed Routes:** Enabled in `tsconfig.json` — compile-time route safety
- **Async Request APIs:** `cookies()`, `headers()`, `params`, `searchParams` are async in Next.js 16
- **Security Headers:** Configured in `next.config.ts`
- **ESLint `noInlineConfig: true`:** Inline `// eslint-disable` comments have **NO EFFECT** anywhere in the codebase

### Third-Party Integrations

| Integration | Purpose |
| --- | --- |
| **Plaid API** | Bank account linking, transaction retrieval, balance fetching |
| **Dwolla API** | ACH transfers, recipient management, funding source setup |
| **Upstash Redis** | Rate limiting (optional, graceful fallback if `REDIS_URL` not set) |
| **SMTP** | Email notifications (optional via `lib/email.ts`) |
| **GitHub OAuth** | OAuth provider via NextAuth.js |
| **Google OAuth** | OAuth provider via NextAuth.js |

---

## 2. Commands Reference

All commands defined in `package.json` scripts.

### Development

```bash
npm run dev              # Start dev server (localhost:3000)
npm run build            # Production build
npm run start            # Start production server
npm run clean            # Clean build artifacts (.next, dist, etc.)
```

> **Note:** `predev` and `prebuild` both run `npm run clean && npm run type-check` automatically. `pretest` runs `npm run clean && npm run type-gen` (`next typegen` — NOT type-check).

### Validation (Run Before Every Commit)

```bash
npm run validate         # All checks: format:check + type-check + lint:strict + test
npm run format           # Auto-format with Prettier (writes files)
npm run format:check     # Auto-formats first, then checks (NOT read-only)
npm run type-check       # TypeScript strict mode check
npm run lint             # ESLint (warnings allowed, compact output)
npm run lint:fix         # ESLint with auto-fix
npm run lint:strict      # ESLint (zero warnings — PR-blocking)
```

### Database

```bash
npm run db:push          # Push schema changes to database (no migration file)
npm run db:migrate       # Run pending migrations
npm run db:generate      # Generate new migration file from schema diff
npm run db:check         # Check schema/migration consistency
npm run db:studio        # Open Drizzle Studio GUI at localhost:8000
npm run db:seed          # Seed database with test/dev data
npm run db:reset         # Full reset: db:drop + db:generate + db:push (does NOT seed)
```

> **Warning:** `db:reset` does **not** seed. Run `db:seed` separately after reset if needed.

### Testing

```bash
npm run test             # All tests: test:browser && test:ui
npm run test:browser     # Vitest unit/integration tests only
npm run test:ui          # Playwright E2E tests (Chromium, 1 worker, PLAYWRIGHT_PREPARE_DB=true)
npm run test:ui:codegen  # Playwright codegen (record new tests)
npm run test:ui:report   # Show last Playwright HTML report
```

### Code Generation

```bash
npm run type-gen         # next typegen (typed routes)
npm run generate:*       # Various scaffolding generators
npm run registry:*       # shadcn registry commands
npm run website:*        # Website/docs commands
```

---

## 3. Single Test Execution

```bash
# Run a single Vitest file
npm exec vitest run tests/unit/register.test.ts

# Run a single Playwright spec
npm exec playwright test tests/e2e/auth.spec.ts

# Run Playwright with UI mode
npm exec playwright test --ui

# Run Playwright with headed browser
npm exec playwright test --headed tests/e2e/auth.spec.ts
```

---

## 4. Environment Variables (24 Total)

All environment variables are validated and typed via `lib/env.ts` using Zod schemas. **Never read `process.env` directly in app code** — always import from `lib/env.ts`.

### Required (App fails without these)

| # | Variable | Validation | Purpose |
| --- | --- | --- | --- |
| 1 | `ENCRYPTION_KEY` | `.min(1)` | Key for AES-256-GCM encryption |
| 2 | `NEXTAUTH_SECRET` | `.min(1)` | NextAuth.js session signing key |

### Core Optional (Have Defaults)

| # | Variable | Default | Purpose |
| --- | --- | --- | --- |
| 3 | `NODE_ENV` | `"production"` | Runtime environment |
| 4 | `PORT` | `3000` | HTTP server port |
| 5 | `HOSTNAME` | `"0.0.0.0"` | HTTP server hostname |
| 6 | `NEXT_PUBLIC_SITE_URL` | `"http://localhost:3000"` | Public site URL (browser-accessible) |

### Database (Optional)

| #   | Variable       | Purpose                                    |
| --- | -------------- | ------------------------------------------ |
| 7   | `DATABASE_URL` | PostgreSQL connection string (Neon format) |

> **Note:** `DATABASE_URL` is **optional** in `lib/env.ts` — the app does not crash at startup if absent, but DB operations will fail at runtime.

### External APIs (Optional)

| #   | Variable          | Purpose                       |
| --- | ----------------- | ----------------------------- |
| 8   | `PLAID_CLIENT_ID` | Plaid API client ID           |
| 9   | `PLAID_SECRET`    | Plaid API secret              |
| 10  | `PLAID_ENV`       | `"sandbox"` or `"production"` |
| 11  | `PLAID_BASE_URL`  | Plaid API base URL override   |
| 12  | `DWOLLA_KEY`      | Dwolla API key                |
| 13  | `DWOLLA_SECRET`   | Dwolla API secret             |
| 14  | `DWOLLA_ENV`      | `"sandbox"` or `"production"` |
| 15  | `DWOLLA_BASE_URL` | Dwolla API base URL override  |

### OAuth Providers (Optional)

| #   | Variable             | Purpose                    |
| --- | -------------------- | -------------------------- |
| 16  | `AUTH_GITHUB_ID`     | GitHub OAuth app client ID |
| 17  | `AUTH_GITHUB_SECRET` | GitHub OAuth app secret    |
| 18  | `AUTH_GOOGLE_ID`     | Google OAuth app client ID |
| 19  | `AUTH_GOOGLE_SECRET` | Google OAuth app secret    |

### Auth (Optional)

| #   | Variable       | Purpose                                 |
| --- | -------------- | --------------------------------------- |
| 20  | `NEXTAUTH_URL` | Canonical URL for NextAuth.js callbacks |

### Email (Optional)

| #   | Variable    | Purpose                                 |
| --- | ----------- | --------------------------------------- |
| 21  | `SMTP_HOST` | SMTP server hostname                    |
| 22  | `SMTP_PORT` | SMTP server port                        |
| 23  | `SMTP_USER` | SMTP username                           |
| 24  | `SMTP_PASS` | SMTP password (**not** `SMTP_PASSWORD`) |

> **Note:** `SMTP_FROM` and `EMAIL_FROM` — verify against current `lib/env.ts` before use. One or both may be present.

### Caching & Rate Limiting (Optional)

`REDIS_URL` — Upstash Redis URL. If absent, rate limiting is silently skipped.

### Usage Pattern

```typescript
// BAD — never do this
const key = process.env.ENCRYPTION_KEY;

// GOOD — always use lib/env.ts
import { env } from "@/lib/env";
const key: string = env.ENCRYPTION_KEY;
```

---

## 5. PR-Blocking Rules (7 Critical)

These rules are enforced by CI/CD. PRs will be blocked if any are violated.

| # | Rule | Violation | Enforcement |
| --- | --- | --- | --- |
| 1 | No `any` types | Use `unknown` + type guards | TypeScript strict + ESLint |
| 2 | No N+1 queries | Use JOINs / eager loading | Code review |
| 3 | No raw `process.env` | Use `lib/env.ts` | ESLint rule |
| 4 | Mutations via Server Actions only | Never in API routes | Code review |
| 5 | Zero TypeScript errors | `npm run type-check` must pass | CI |
| 6 | Zero lint warnings | `npm run lint:strict` must pass | CI |
| 7 | All tests pass | `npm run test` must pass | CI |

---

## 6. TypeScript & Type Safety

### Strict Mode Rules

- No `any` — use `unknown` with type guards
- Explicit return types for all exported functions
- Non-nullable by default — use `| null` or `| undefined` explicitly when needed
- Strict property initialization

### Type Guard Pattern

```typescript
type HasEmail = { email: string };

function hasEmail(input: unknown): input is HasEmail {
  return (
    typeof input === "object" &&
    input !== null &&
    "email" in input &&
    typeof (input as HasEmail).email === "string"
  );
}

export function getEmail(input: unknown): string {
  if (!hasEmail(input)) return "";
  return input.email;
}
```

### Result Type Pattern

All Server Actions return this shape:

```typescript
type Result<T = void> =
  | { ok: true; data?: T }
  | { ok: false; error: string };

export async function fetchUser(id: string): Promise<Result<User>> {
  try {
    const user = await userDal.findById(id);
    return user
      ? { ok: true, data: user }
      : { ok: false, error: "Not found" };
  } catch {
    return { ok: false, error: "Server error" };
  }
}
```

### `unknown` Over `any`

```typescript
// BAD
function parse(input: any) {
  return input.value;
}

// GOOD
type WithValue = { value: string };

function hasValue(input: unknown): input is WithValue {
  return (
    typeof input === "object" &&
    input !== null &&
    "value" in input &&
    typeof (input as WithValue).value === "string"
  );
}

export function parse(input: unknown): string {
  if (!hasValue(input)) return "";
  return input.value;
}
```

---

## 7. ESLint Configuration

### `noInlineConfig: true` — CRITICAL WARNING

The ESLint config sets `noInlineConfig: true`. This means:

- `// eslint-disable-next-line` — **ignored, has no effect**
- `// eslint-disable` — **ignored, has no effect**
- `/* eslint-disable @typescript-eslint/no-explicit-any */` — **ignored, has no effect**

**The only way to suppress an ESLint rule is to modify `eslint.config.mts`.**

Use `overrides` in the config to disable rules for specific files:

```typescript
// eslint.config.mts — correct way to disable a rule for a file
{
  files: ["lib/dal/base.dal.ts"],
  rules: {
    "@typescript-eslint/no-explicit-any": "off",
  },
}
```

### Config File

`eslint.config.mts` (flat config format, ESLint v9+)

### Key Rules Enforced

| Rule | Setting | Notes |
| --- | --- | --- |
| `@typescript-eslint/no-explicit-any` | `error` | No `any` types allowed |
| `no-restricted-syntax` (process.env) | `error` | Must use `lib/env.ts` |
| `import/order` | `warn` | Canonical import ordering |
| `@typescript-eslint/explicit-function-return-type` | `warn` | Exported functions need return types |
| `@typescript-eslint/no-unused-vars` | `error` | No unused variables |

### Suppression Pattern (Only Valid Method)

```typescript
// eslint.config.mts
export default [
  // ... other config ...
  {
    files: ["path/to/specific/file.ts"],
    rules: {
      "rule-to-suppress": "off"
    }
  }
];
```

---

## 8. Prettier Configuration

Config file: `.prettierrc.ts`

```typescript
// Key settings (verify against .prettierrc.ts for exact values)
{
  semi: true,
  singleQuote: false,         // double quotes
  trailingComma: "all",
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  bracketSpacing: true,
  arrowParens: "always",
  endOfLine: "lf"
}
```

> **Note:** `format:check` runs `npm run format` (write) **then** `prettier --check .` — it is NOT read-only. Running `npm run format:check` will modify files. Run `npm run format` to pre-format before checking.

---

## 9. Import Order

Enforced by `import/order` ESLint rule (`warn`). Follow this ordering:

```typescript
// 1. React / core Node
import * as React from "react";
import { useState } from "react";

// 2. Next.js
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

// 3. Third-party packages
import { z } from "zod";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";

// 4. Internal — lib/env
import { env } from "@/lib/env";

// 5. Internal — DAL
import { userDal } from "@/lib/dal";

// 6. Internal — Actions
import { createUser } from "@/lib/actions/user.actions";

// 7. Internal — Components
import { Button } from "@/components/ui/button";
import { UserCard } from "@/components/user-card";

// 8. Types
import type { User } from "@/types";
```

---

## 10. Naming Conventions

| Type | Convention | Example |
| --- | --- | --- |
| Files | kebab-case | `user-dal.ts`, `bank-card.tsx` |
| Directories | kebab-case | `my-banks/`, `transaction-history/` |
| Classes | PascalCase | `UserDal`, `BaseDal` |
| Functions | camelCase | `findById`, `createUser` |
| React Components | PascalCase | `BankCard`, `PaymentForm` |
| Variables | camelCase | `currentUser`, `bankList` |
| Constants | UPPER_SNAKE | `MAX_RETRY`, `DEFAULT_CURRENCY` |
| Types / Interfaces | PascalCase | `UserProfile`, `BankAccount` |
| Zod schemas | camelCase + `Schema` suffix | `registerSchema`, `UpdateProfileSchema` |
| Server Actions files | camelCase + `.actions.ts` | `user.actions.ts`, `bank.actions.ts` |
| DAL files | camelCase + `.dal.ts` | `user.dal.ts`, `bank.dal.ts` |

---

## 11. Next.js 16 Patterns

### Server vs Client Components

**Server Components (default)** — use for data fetching, heavy logic, non-interactive UI:

```tsx
// app/(root)/dashboard/page.tsx
import { getUserBanks } from "@/lib/actions/bank.actions";

export default async function DashboardPage() {
  const result = await getUserBanks();
  if (!result.ok) return <div>Error loading banks</div>;
  return <BankList banks={result.banks ?? []} />;
}
```

**Client Components** — add `"use client"` for interactivity, hooks, browser APIs:

```tsx
"use client";

import { useState } from "react";

export function TransferForm() {
  const [amount, setAmount] = useState("");
  return (
    <input value={amount} onChange={e => setAmount(e.target.value)} />
  );
}
```

### Cache Components (Next.js 16)

Use `"use cache"` directive with `cacheLife` for data memoization:

```typescript
"use cache";
import { cacheLife } from "next/dist/server/use-cache/cache-life";

cacheLife("hours");

export async function getCachedBanks(userId: string) {
  return getUserBanks(userId);
}
```

**Cache profiles:** `"seconds"`, `"minutes"`, `"hours"`, `"days"`, `"weeks"`, `"max"`

### Cache Revalidation

```typescript
import { revalidateTag } from "next/cache";
import { unstable_updateTag as updateTag } from "next/cache";

// In Server Actions after mutations — prefer updateTag for immediate consistency
updateTag("banks");

// For background revalidation
revalidateTag("banks");
```

### Async Request APIs (Next.js 16)

`cookies()`, `headers()`, `params`, and `searchParams` are **async** in Next.js 16:

```typescript
import { cookies, headers } from "next/headers";

// In Server Components / Actions
const cookieStore = await cookies();
const headersList = await headers();

// In page components
export default async function Page({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { id } = await params;
  const { page } = await searchParams;
  // ...
}
```

### Suspense Boundaries

Wrap async content:

```tsx
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<BankListSkeleton />}>
      <BankList />
    </Suspense>
  );
}
```

### Project Structure

```
app/
├── (auth)/                    # Unauthenticated routes
│   ├── sign-in/page.tsx
│   └── sign-up/page.tsx
├── (root)/                    # Protected routes (auth required)
│   ├── layout.tsx             # Auth guard layout
│   ├── dashboard/
│   │   ├── page.tsx
│   │   ├── loading.tsx
│   │   └── error.tsx
│   ├── my-banks/
│   ├── payment-transfer/
│   ├── settings/
│   └── transaction-history/
├── api/
│   ├── auth/[...nextauth]/    # NextAuth handler
│   └── health/                # Health check (stub — see debt #7)
├── not-found.tsx
└── layout.tsx

lib/
├── actions/                   # Server Actions (mutations only)
├── dal/                       # Data Access Layer
├── auth.ts                    # re-exports auth() helper
├── auth-options.ts            # NextAuth config (JWT strategy)
├── auth-config.ts             # DEBT #6: conflicting config (database strategy)
├── encryption.ts              # AES-256-GCM helpers
├── email.ts                   # SMTP email sender
├── env.ts                     # Zod-validated env vars
└── rate-limit.ts              # Upstash Redis rate limiting

database/
├── db.ts                      # Drizzle client instance
└── schema.ts                  # All table definitions

components/
├── ui/                        # shadcn/ui components
├── dashboard/
├── payment-transfer/
├── settings/
└── transaction-history/
```

---

## 12. Server Actions

**All mutations must be implemented as Server Actions.** Never place mutation logic in API route handlers.

### Canonical Template

```typescript
"use server";

import { z } from "zod";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

const InputSchema = z.object({
  name: z.string().min(1).max(100)
});

export async function doSomething(
  input: unknown
): Promise<{ ok: boolean; error?: string }> {
  // 1. Auth check
  const session = await auth();
  if (!session?.user) {
    return { ok: false, error: "Unauthorized" };
  }

  // 2. Validate input
  const parsed = InputSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.message };
  }

  // 3. Execute mutation
  try {
    await someDAL.create(parsed.data);
    revalidatePath("/relevant-path");
    return { ok: true };
  } catch {
    return { ok: false, error: "Server error" };
  }
}
```

### Action Inventory

#### `lib/actions/user.actions.ts`

| Function | Signature | Notes |
| --- | --- | --- |
| `getLoggedInUser` | `(): Promise<{ name?: string; email?: string } \| undefined>` | Returns `undefined` (NOT `null`) when unauthenticated |
| `logoutAccount` | `(): Promise<boolean>` | Returns `true` on success, `false` on failure |

#### `lib/actions/register.ts`

| Function | Signature | Notes |
| --- | --- | --- |
| `registerUser` | `(input: unknown): Promise<{ ok: boolean; user?: User; error?: string }>` | Also exported as `register` |

`RegisterSchema` fields: `email`, `name`, `password`, `confirmPassword` `RegisterInput = z.infer<typeof RegisterSchema>`

#### `lib/actions/updateProfile.ts`

| Function | Signature | Notes |
| --- | --- | --- |
| `updateProfile` | `(input: unknown): Promise<{ ok: boolean; error?: string }>` | userId from session only, never from input |

`UpdateProfileSchema` fields: `address?`, `city?`, `email?`, `image?`, `name?`, `newPassword?`, `password?`, `phone?`, `postalCode?`, `state?` `UpdateProfileInput = z.infer<typeof UpdateProfileSchema>`

#### `lib/actions/admin.actions.ts`

| Function | Signature | Notes |
| --- | --- | --- |
| `toggleAdmin` | `(input: unknown): Promise<{ ok: boolean; error?: string }>` | Requires `isAdmin` on session |
| `setActive` | `(input: unknown): Promise<{ ok: boolean; error?: string }>` | Requires `isAdmin` on session |

`ToggleAdminSchema` fields: `userId`, `makeAdmin` `SetActiveSchema` fields: `userId`, `isActive`

#### `lib/actions/bank.actions.ts`

| Function | Signature | Notes |
| --- | --- | --- |
| `getUserBanks` | `(): Promise<{ ok: boolean; banks?: Bank[]; error?: string }>` |  |
| `disconnectBank` | `(bankId: string): Promise<{ ok: boolean; error?: string }>` | Validates BEFORE auth — intentional deviation from template |

#### `lib/actions/plaid.actions.ts`

| Function | Signature | Notes |
| --- | --- | --- |
| `createLinkToken` | `(input: unknown) => Promise<{ ok: boolean; linkToken?: string; error?: string }>` |  |
| `exchangePublicToken` | `(input: unknown) => Promise<{ ok: boolean; bank?: Bank; error?: string }>` |  |
| `getAccounts` | `(input: unknown) => Promise<{ ok: boolean; accounts?: PlaidAccount[]; error?: string }>` |  |
| `getTransactions` | `(input: unknown) => Promise<{ ok: boolean; transactions?: PlaidTransaction[]; totalTransactions?: number; error?: string }>` |  |
| `getBalance` | `(input: unknown) => Promise<{ ok: boolean; balances?: PlaidBalance[]; error?: string }>` |  |
| `getAllBalances` | `() => Promise<{ ok: boolean; balances?: Record<string, PlaidBalance[]>; error?: string }>` | **DEBT #4**: N+1 — calls Plaid per bank in `Promise.all` loop |
| `getInstitution` | `(input: unknown) => Promise<{ ok: boolean; institution?: PlaidInstitution; error?: string }>` |  |
| `getBankWithDetails` | `(input: unknown) => Promise<{ ok: boolean; balances?: PlaidBalance[]; transactions?: PlaidTransaction[]; error?: string }>` |  |
| `removeBank` | `(input: unknown) => Promise<{ ok: boolean; error?: string }>` |  |

#### `lib/actions/dwolla.actions.ts`

| Function | Signature | Notes |
| --- | --- | --- |
| `createDwollaCustomer` | `(input: unknown) => Promise<{ ok: boolean; customerUrl?: string; error?: string }>` |  |
| `createOnDemandAuthorization` | `() => Promise<{ ok: boolean; links?: unknown; error?: string }>` |  |
| `createFundingSource` | `(input: unknown) => Promise<{ ok: boolean; fundingSourceUrl?: string; error?: string }>` |  |
| `createTransfer` | `(input: unknown) => Promise<{ ok: boolean; transferUrl?: string; error?: string }>` |  |
| `addFundingSource` | `(input: unknown) => Promise<{ ok: boolean; fundingSourceUrl?: string; error?: string }>` |  |

#### `lib/actions/transaction.actions.ts`

| Function | Signature | Notes |
| --- | --- | --- |
| `getRecentTransactions` | `(limit?: number) => Promise<{ ok: boolean; transactions?: Transaction[]; error?: string }>` | Default limit: 10 |
| `getTransactionHistory` | `(page?: number, pageSize?: number) => Promise<{ ok: boolean; transactions?: Transaction[]; error?: string }>` | Default page: 1, pageSize: 20 |

#### `lib/actions/recipient.actions.ts`

| Function | Signature | Notes |
| --- | --- | --- |
| `getRecipients` | `() => Promise<{ ok: boolean; recipients?: Recipient[]; error?: string }>` |  |
| `createRecipient` | `(input: unknown) => Promise<{ ok: boolean; recipient?: Recipient; error?: string }>` |  |
| `updateRecipient` | `(input: unknown) => Promise<{ ok: boolean; recipient?: Recipient; error?: string }>` |  |
| `deleteRecipient` | `(input: unknown) => Promise<{ ok: boolean; error?: string }>` |  |

---

## 13. Data Access Layer (DAL)

All database access must go through `lib/dal/`. Never query the database directly from Server Actions or components.

### File Structure

```
lib/dal/
├── base.dal.ts          # Generic base class with findById, findAll, deleteById
├── user.dal.ts          # UserDal — findByEmail, findById, create, update
├── bank.dal.ts          # BankDal — findByUserId, findById, create, delete
├── transaction.dal.ts   # TransactionDal — findByUserId, paginated queries
├── recipient.dal.ts     # RecipientDal — findByUserId, CRUD
├── userProfile.dal.ts   # UserProfileDal — findByUserId, upsert
└── index.ts             # Re-exports all DAL instances
```

### Base DAL

```typescript
// lib/dal/base.dal.ts
// Note: internal `as any` casts are intentional — Drizzle's TableLikeHasEmptySelection
// conditional type cannot be satisfied with a bare generic. ESLint disabled for this file.

import { AnyPgTable, InferSelectModel } from "drizzle-orm/pg-core";
import { eq } from "drizzle-orm";
import { db } from "@/database/db";

export class BaseDal<T extends AnyPgTable> {
  constructor(protected table: T) {}

  async findById(
    id: string
  ): Promise<InferSelectModel<T> | undefined> {
    const rows = await db
      .select()
      .from(this.table as any)
      .where(eq((this.table as any).id, id))
      .limit(1);
    return rows[0] as InferSelectModel<T> | undefined;
  }

  async findAll(): Promise<InferSelectModel<T>[]> {
    return db.select().from(this.table as any) as Promise<
      InferSelectModel<T>[]
    >;
  }

  async deleteById(id: string): Promise<void> {
    await db
      .delete(this.table as any)
      .where(eq((this.table as any).id, id));
  }
}
```

### DAL Usage Pattern

```typescript
// lib/dal/user.dal.ts
import { eq } from "drizzle-orm";
import { db } from "@/database/db";
import { users } from "@/database/schema";
import { BaseDal } from "./base.dal";

export class UserDal extends BaseDal<typeof users> {
  constructor() {
    super(users);
  }

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

### N+1 Prevention

**NEVER query inside a loop.** Use JOINs or batch queries:

```typescript
// BAD — N+1
const banks = await bankDal.findByUserId(userId);
for (const bank of banks) {
  const transactions = await transactionDal.findByBankId(bank.id); // N+1!
}

// GOOD — single JOIN
const banksWithTransactions = await db
  .select({ bank: banks, transaction: transactions })
  .from(banks)
  .leftJoin(transactions, eq(banks.id, transactions.senderBankId))
  .where(eq(banks.userId, userId));
```

### Transactions

```typescript
import { db } from "@/database/db";

await db.transaction(async tx => {
  await tx.insert(banks).values({ ...bankData });
  await tx.insert(transactions).values({ ...txData });
});
```

---

## 14. Authentication

### Auth Config Debt (CRITICAL — See Debt #6)

There are **two conflicting NextAuth config files**:

| File | Strategy | Status |
| --- | --- | --- |
| `lib/auth-options.ts` | JWT | **Active** — used by `lib/auth.ts` |
| `lib/auth-config.ts` | Database sessions | **Conflicting** — should be removed or reconciled |

### Auth Helper

```typescript
// lib/auth.ts — re-exports from auth-options
export { auth } from "@/lib/auth-options";
```

### Session Shape

Defined in `types/next-auth.d.ts`:

```typescript
// Session user shape — CONFIRMED
interface Session {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    isAdmin: boolean; // boolean (NOT role string)
    isActive: boolean; // boolean
    // NO `role` field on session — role enum is DB-only
  };
}

// JWT shape
interface JWT {
  id?: string;
  isAdmin?: boolean;
  isActive?: boolean;
}
```

### Auth Check in Server Actions

```typescript
"use server";

import { auth } from "@/lib/auth";

export async function protectedAction(input: unknown) {
  const session = await auth();
  if (!session?.user) {
    return { ok: false, error: "Unauthorized" };
  }
  // session.user.id is available here
  const userId = session.user.id;
  // ...
}
```

### Admin Guard

```typescript
export async function adminOnlyAction(input: unknown) {
  const session = await auth();
  if (!session?.user) {
    return { ok: false, error: "Unauthorized" };
  }
  if (!session.user.isAdmin) {
    return { ok: false, error: "Forbidden: Admin access required" };
  }
  // ...
}
```

### Auth Mock Pattern (Tests)

```typescript
// CORRECT — use undefined, NOT null
vi.mock("@/lib/auth", () => ({
  auth: vi.fn().mockResolvedValue(undefined)
}));

// Authenticated mock
vi.mocked(auth).mockResolvedValue({
  user: {
    id: "user-123",
    email: "test@example.com",
    isAdmin: false,
    isActive: true
  },
  expires: new Date(Date.now() + 86400000).toISOString()
});
```

### NextAuth Route Handler

```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth-options";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

---

## 15. Encryption

All sensitive fields (account numbers, routing numbers, access tokens) are encrypted at rest using AES-256-GCM via `lib/encryption.ts`.

### API

```typescript
import { encrypt, decrypt } from "@/lib/encryption";
import { env } from "@/lib/env";

// Encrypt before storing
const encrypted = encrypt(plaintext, env.ENCRYPTION_KEY);

// Decrypt after retrieving
const plaintext = decrypt(encrypted, env.ENCRYPTION_KEY);
```

### Encrypted Fields in `database/schema.ts`

| Table   | Column                   | Notes              |
| ------- | ------------------------ | ------------------ |
| `banks` | `accessToken`            | Plaid access token |
| `banks` | `accountNumberEncrypted` | Account number     |

### AES-256-GCM Details

- Algorithm: AES-256-GCM (authenticated encryption)
- Key: derived from `ENCRYPTION_KEY` env var
- Each `encrypt()` call generates a fresh random IV
- Output format: `iv:authTag:ciphertext` (all hex-encoded, colon-separated)
- `decrypt()` accepts the same colon-separated format

---

## 16. Database Schema

Schema defined in `database/schema.ts`. Ten tables + one enum.

### `userRole` Enum

```typescript
export const userRole = pgEnum("user_role", [
  "user",
  "admin",
  "moderator"
]);
```

### `users` Table

| Column | Type | Constraints | Notes |
| --- | --- | --- | --- |
| `id` | `text` | PK | UUID default |
| `email` | `text` | unique, notNull |  |
| `emailVerified` | `timestamp` | nullable | NextAuth |
| `name` | `text` | nullable |  |
| `password` | `text` | nullable | bcrypt hash |
| `image` | `text` | nullable |  |
| `role` | `userRole` | default `"user"` | DB-only, NOT on session |
| `isAdmin` | `boolean` | default `false` | Reflected on session |
| `isActive` | `boolean` | default `true` | Reflected on session |
| `createdAt` | `timestamp` | default now |  |
| `updatedAt` | `timestamp` | default now |  |

### `account` Table (NextAuth OAuth)

| Column | Type | Constraints |
| --- | --- | --- |
| `provider` | `text` | PK (composite with `providerAccountId`) |
| `providerAccountId` | `text` | PK (composite) |
| `userId` | `text` | FK → users.id |
| `type` | `text` |  |
| `access_token` | `text` | nullable |
| `refresh_token` | `text` | nullable |
| `id_token` | `text` | nullable |
| `expires_at` | `integer` | nullable |
| `token_type` | `text` | nullable |
| `scope` | `text` | nullable |
| `session_state` | `text` | nullable |

### `session` Table (NextAuth Database Sessions)

| Column         | Type        | Constraints   |
| -------------- | ----------- | ------------- |
| `sessionToken` | `text`      | PK            |
| `userId`       | `text`      | FK → users.id |
| `expires`      | `timestamp` | notNull       |

### `verificationToken` Table

| Column       | Type        | Constraints                 |
| ------------ | ----------- | --------------------------- |
| `identifier` | `text`      | PK (composite with `token`) |
| `token`      | `text`      | PK (composite)              |
| `expires`    | `timestamp` | notNull                     |

### `authenticator` Table (WebAuthn)

| Column | Type | Constraints |
| --- | --- | --- |
| `userId` | `text` | PK (composite with `credentialID`), FK → users.id |
| `credentialID` | `text` | PK (composite), unique |
| `credentialPublicKey` | `text` | notNull |
| `counter` | `integer` | notNull |
| `credentialBackedUp` | `boolean` | notNull |
| `credentialDeviceType` | `text` | notNull |
| `transports` | `text` | nullable |

### `user_profiles` Table

> **Corrected from v3.0** — fields are address/city/state/postalCode/phone/dateOfBirth, NOT bio/avatarUrl/preferences.

| Column        | Type   | Constraints                 |
| ------------- | ------ | --------------------------- |
| `id`          | `text` | PK                          |
| `userId`      | `text` | FK → users.id, unique index |
| `address`     | `text` | nullable                    |
| `city`        | `text` | nullable                    |
| `state`       | `text` | nullable                    |
| `postalCode`  | `text` | nullable                    |
| `phone`       | `text` | nullable                    |
| `dateOfBirth` | `text` | nullable                    |

### `banks` Table

| Column | Type | Constraints | Notes |
| --- | --- | --- | --- |
| `id` | `text` | PK |  |
| `userId` | `text` | FK → users.id |  |
| `accessToken` | `text` | notNull | Encrypted Plaid access token |
| `accountId` | `text` | notNull | Plaid account ID |
| `accountNumberEncrypted` | `text` | nullable | AES-256-GCM |
| `accountSubtype` | `text` | nullable | e.g., "checking", "savings" |
| `accountType` | `text` | nullable | e.g., "depository" |
| `institutionId` | `text` | nullable | Plaid institution ID |
| `institutionName` | `text` | nullable |  |
| `routingNumber` | `text` | nullable |  |
| `sharableId` | `text` | unique, notNull | Public-safe identifier |
| `dwollaCustomerUrl` | `text` | nullable |  |
| `dwollaFundingSourceUrl` | `text` | nullable |  |
| `fundingSourceUrl` | `text` | nullable |  |

### `transactions` Table

| Column | Type | Constraints | Notes |
| --- | --- | --- | --- |
| `id` | `text` | PK |  |
| `userId` | `text` | FK → users.id |  |
| `senderBankId` | `text` | FK → banks.id |  |
| `receiverBankId` | `text` | FK → banks.id |  |
| `amount` | `numeric(12,2)` | notNull |  |
| `name` | `text` | nullable | Transaction description |
| `email` | `text` | nullable | Counterparty email |
| `category` | `text` | nullable | Plaid category |
| `channel` | `text` | nullable | e.g., "online", "in store" |
| `currency` | `text` | default `"USD"` |  |
| `status` | `text` | default `"pending"` |  |
| `type` | `text` | nullable | e.g., "debit", "credit" |
| `plaidTransactionId` | `text` | uniqueIndex, nullable |  |
| `createdAt` | `timestamp` | default now |  |
| `updatedAt` | `timestamp` | default now |  |

### `recipients` Table

| Column          | Type   | Constraints   |
| --------------- | ------ | ------------- |
| `id`            | `text` | PK            |
| `userId`        | `text` | FK → users.id |
| `email`         | `text` | notNull       |
| `name`          | `text` | nullable      |
| `bankAccountId` | `text` | FK → banks.id |

### `errors` Table

| Column      | Type        | Constraints             |
| ----------- | ----------- | ----------------------- |
| `id`        | `text`      | PK                      |
| `userId`    | `text`      | FK → users.id, nullable |
| `message`   | `text`      | notNull                 |
| `path`      | `text`      | nullable                |
| `severity`  | `text`      | default `"error"`       |
| `stack`     | `text`      | nullable                |
| `createdAt` | `timestamp` | default now             |

---

## 17. Validation (Zod v4)

The project uses Zod v4.3.6. All user inputs must be validated before processing.

### Schema Patterns

```typescript
import { z } from "zod";

// String fields
const nameSchema = z.string().min(1, "Required").max(100, "Too long");
const emailSchema = z.string().email("Invalid email");
const urlSchema = z.string().url("Invalid URL");
const uuidSchema = z.string().uuid("Invalid ID");

// Numeric fields (coerce for form inputs)
const amountSchema = z.coerce.number().min(0.01, "Must be positive");
const pageSchema = z.coerce.number().int().min(1).default(1);

// Optional fields
const optionalPhone = z.string().optional();
const nullableField = z.string().nullable();

// Enum
const statusSchema = z.enum(["pending", "completed", "failed"]);

// Object with refinement
const transferSchema = z
  .object({
    senderBankId: z.string().min(1),
    receiverBankId: z.string().min(1),
    amount: z.coerce.number().min(0.01)
  })
  .refine(data => data.senderBankId !== data.receiverBankId, {
    message: "Cannot transfer to same account",
    path: ["receiverBankId"]
  });
```

### Validation in Server Actions

```typescript
"use server";

import { z } from "zod";

const InputSchema = z.object({
  email: z.string().email(),
  amount: z.coerce.number().min(0.01)
});

export async function processPayment(input: unknown) {
  const parsed = InputSchema.safeParse(input);
  if (!parsed.success) {
    // parsed.error.message gives a human-readable summary
    return { ok: false, error: parsed.error.message };
  }
  // parsed.data is fully typed
  const { email, amount } = parsed.data;
  // ...
}
```

### Common Schemas Used in the Project

| Schema | File | Fields |
| --- | --- | --- |
| `RegisterSchema` | `lib/actions/register.ts` | `email`, `name`, `password`, `confirmPassword` |
| `UpdateProfileSchema` | `lib/actions/updateProfile.ts` | `address?`, `city?`, `email?`, `image?`, `name?`, `newPassword?`, `password?`, `phone?`, `postalCode?`, `state?` |
| `ToggleAdminSchema` | `lib/actions/admin.actions.ts` | `userId`, `makeAdmin` |
| `SetActiveSchema` | `lib/actions/admin.actions.ts` | `userId`, `isActive` |

---

## 18. Forms & UI

### shadcn/ui Components

Components live in `components/ui/`. All components are from shadcn/ui and styled with Tailwind CSS v4.

#### Commonly Used Components

```tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
```

### React Hook Form + Zod Pattern

```tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { someAction } from "@/lib/actions/some.actions";

const formSchema = z.object({
  amount: z.coerce.number().min(0.01, "Amount must be positive"),
  recipientEmail: z.string().email("Invalid email")
});

type FormValues = z.infer<typeof formSchema>;

export function PaymentForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { amount: 0, recipientEmail: "" }
  });

  async function onSubmit(values: FormValues) {
    const result = await someAction(values);
    if (!result.ok) {
      form.setError("root", { message: result.error });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input type="number" placeholder="0.00" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {form.formState.errors.root && (
          <p className="text-destructive text-sm">
            {form.formState.errors.root.message}
          </p>
        )}
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Processing..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
```

### Tailwind CSS v4

Tailwind v4 uses CSS-based configuration via `@theme` in `app/globals.css` (not `tailwind.config.js`):

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  --color-primary: oklch(0.6 0.2 240);
  --font-sans: "Inter", sans-serif;
}
```

---

## 19. Testing

### Framework Overview

| Framework | Version | Purpose | Config |
| --- | --- | --- | --- |
| Vitest | 4.1.2 | Unit + integration tests | `vitest.config.ts` |
| Playwright | 1.59.1 | E2E browser tests (Chromium) | `playwright.config.ts` |

### Test Directory Structure

```
tests/
├── unit/
│   ├── register.test.ts
│   ├── bank.actions.test.ts
│   ├── recipient.actions.test.ts
│   ├── transaction.actions.test.ts
│   └── user.actions.test.ts
├── e2e/
│   ├── auth.spec.ts
│   ├── global-setup.ts
│   └── helpers/
│       └── auth.ts          # Replaced deleted tests/helpers/auth.ts
└── fixtures/
    └── auth.ts
```

### Writing Vitest Unit Tests

```typescript
import { describe, it, expect, beforeEach, vi } from "vitest";
import { auth } from "@/lib/auth";
import { getLoggedInUser } from "@/lib/actions/user.actions";

vi.mock("@/lib/auth");
vi.mock("@/lib/dal");

describe("getLoggedInUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns undefined when unauthenticated", async () => {
    vi.mocked(auth).mockResolvedValue(undefined);
    const result = await getLoggedInUser();
    expect(result).toBeUndefined();
  });

  it("returns user data when authenticated", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: {
        id: "user-123",
        name: "Alice",
        email: "alice@example.com",
        isAdmin: false,
        isActive: true
      },
      expires: new Date(Date.now() + 86400000).toISOString()
    });

    const result = await getLoggedInUser();
    expect(result).toEqual({
      name: "Alice",
      email: "alice@example.com"
    });
  });
});
```

### Auth Mock Pattern (Unit Tests)

```typescript
// CORRECT: use undefined, NOT null
vi.mock("@/lib/auth", () => ({
  auth: vi.fn().mockResolvedValue(undefined)
}));

// Unauthenticated
vi.mocked(auth).mockResolvedValue(undefined);

// Authenticated (non-admin)
vi.mocked(auth).mockResolvedValue({
  user: {
    id: "user-123",
    email: "test@example.com",
    isAdmin: false,
    isActive: true
  },
  expires: new Date(Date.now() + 86400000).toISOString()
});

// Authenticated (admin)
vi.mocked(auth).mockResolvedValue({
  user: {
    id: "admin-1",
    email: "admin@example.com",
    isAdmin: true,
    isActive: true
  },
  expires: new Date(Date.now() + 86400000).toISOString()
});
```

### Writing Playwright E2E Tests

```typescript
// tests/e2e/auth.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies();
  });

  test("redirects unauthenticated users to sign-in", async ({
    page
  }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/sign-in/);
  });

  test("allows sign-in with valid credentials", async ({ page }) => {
    await page.goto("/sign-in");
    await page.getByLabel("Email").fill("seed@example.com");
    await page.getByLabel("Password").fill("password123");
    await page.getByRole("button", { name: "Sign In" }).click();
    await expect(page).toHaveURL("/dashboard");
  });
});
```

### Playwright Configuration Notes

- Browser: Chromium only (`--project=chromium`)
- Workers: 1 (sequential, no parallelism)
- DB preparation: `PLAYWRIGHT_PREPARE_DB=true` — runs seed script before tests
- Retries: 0 (no automatic retries)
- Global setup: `tests/e2e/global-setup.ts`

### Vitest Configuration Notes

- Environment: `happy-dom`
- Config: `vitest.config.ts`
- `pretest` runs `next typegen` (NOT type-check) before tests

---

## 20. Port Guard

**Before running any test command, free port 3000.**

```powershell
# PowerShell — kill any process on port 3000
$pids = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue |
  Select-Object -ExpandProperty OwningProcess -Unique
if ($pids) { $pids | ForEach-Object { Stop-Process -Id $_ -Force } }
```

```bash
# Bash / Linux equivalent
fuser -k 3000/tcp 2>/dev/null || true
```

**Applies to ALL test commands:**

- `npm run test`
- `npm run test:ui`
- `npm run test:browser`
- `npx playwright test ...`
- `vitest ...`

---

## 21. Middleware

### Current State (Debt #5)

`app/middleware.ts` was **deleted**. The middleware now lives at `proxy.ts` at the project root.

**Impact:** Route-level auth protection is handled by `proxy.ts` at the edge. A fallback server-side auth check also exists in `app/(root)/layout.tsx`.

### Intended Middleware Pattern (When Re-implemented)

```typescript
// proxy.ts (root — NOT in app/)
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Custom middleware logic
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    }
  }
);

export const config = {
  matcher: ["/((?!api/auth|sign-in|sign-up|_next|favicon.ico).*)"]
};
```

> **Note:** Middleware must live at the **project root** (`proxy.ts`), NOT inside `app/`. The deleted file was `app/middleware.ts` — this location is incorrect regardless.

---

## 22. Security

### Input Sanitization

All user input must pass through Zod validation before any database or external API call. Never trust raw form data.

```typescript
// Always validate before use
const parsed = SomeSchema.safeParse(input);
if (!parsed.success)
  return { ok: false, error: parsed.error.message };
```

### Password Hashing

Use `bcryptjs` — never store plaintext passwords:

```typescript
import bcrypt from "bcryptjs";

// Hash on registration
const hash = await bcrypt.hash(password, 12);

// Verify on login
const match = await bcrypt.compare(candidatePassword, storedHash);
```

### Sensitive Data Logging

- **Never log** access tokens, passwords, account numbers, or routing numbers
- Use structured logging and redact sensitive fields at the logger level
- The `errors` table captures stack traces — ensure no secrets appear in `stack` or `message`

### Security Headers

Configured in `next.config.ts` via `headers()`. Headers include:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` (limited feature access)

### Rate Limiting

Via `lib/rate-limit.ts` using Upstash Redis. Gracefully skipped if `REDIS_URL` is absent. Apply to auth routes and sensitive mutations.

### CSRF Protection

NextAuth.js handles CSRF automatically for auth endpoints. For custom Server Actions, rely on the same-origin constraint of `fetch` + `credentials: "include"`.

---

## 23. Known Technical Debt

| # | Location | Issue | Severity | Status |
| --- | --- | --- | --- | --- |
| 1 | `lib/dal/base.dal.ts` | Generic rewrite done; internal `as any` casts remain (intentional, ESLint disabled for file) | Low | Substantially resolved |
| 2 | `lib/actions/admin.actions.ts` | Auth + isAdmin guard added; signature changed to `input: unknown` | — | **RESOLVED** |
| 3 | `lib/actions/updateProfile.ts` | userId now sourced from session only | — | **RESOLVED** |
| 4 | `lib/actions/plaid.actions.ts` | `getAllBalances()` N+1 — calls Plaid per bank in `Promise.all` loop | Medium | Open |
| 5 | `proxy.ts` | `app/middleware.ts` deleted; no root middleware — routes unprotected at edge | Critical | Partially resolved |
| 6 | `lib/auth-options.ts` + `lib/auth-config.ts` | Two conflicting auth configs (JWT vs database strategy); `auth-config.ts` should be removed | Critical | Open |
| 7 | `app/api/health/route.ts` | DB/Redis health checks always return `true` (stub, not real) | Low | Open |
| 8 | `types/index.d.ts` | Legacy types with numeric `id` conflict with Drizzle string IDs | Medium | Open |
| 9 | `app/(root)/layout.tsx` | `user as unknown as User` unsafe cast — legacy type mismatch | Low | Open |

---

## 24. Integrations

### Plaid

Configured via `PLAID_CLIENT_ID`, `PLAID_SECRET`, `PLAID_ENV`, `PLAID_BASE_URL`.

- **Link flow:** `createLinkToken` → user completes Plaid Link → `exchangePublicToken`
- **Data:** `getAccounts`, `getTransactions`, `getBalance`, `getInstitution`
- **Remove:** `removeBank` deletes item from Plaid and `banks` table

```typescript
// Plaid client configured in lib/plaid.ts (or lib/actions/plaid.actions.ts)
import { PlaidApi, PlaidEnvironments, Configuration } from "plaid";
import { env } from "@/lib/env";

const configuration = new Configuration({
  basePath: PlaidEnvironments[env.PLAID_ENV ?? "sandbox"],
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": env.PLAID_CLIENT_ID,
      "PLAID-SECRET": env.PLAID_SECRET
    }
  }
});

export const plaidClient = new PlaidApi(configuration);
```

### Dwolla

Configured via `DWOLLA_KEY`, `DWOLLA_SECRET`, `DWOLLA_ENV`, `DWOLLA_BASE_URL`.

- **Customer setup:** `createDwollaCustomer` → store `customerUrl` on bank record
- **Funding source:** `createFundingSource` / `addFundingSource` → store `fundingSourceUrl`
- **Transfer:** `createOnDemandAuthorization` → `createTransfer`

### Upstash Redis (Rate Limiting)

Configured via `REDIS_URL`. If absent, `lib/rate-limit.ts` silently skips all rate limit checks.

```typescript
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { env } from "@/lib/env";

// Only instantiate if REDIS_URL is present
export const ratelimit = env.REDIS_URL
  ? new Ratelimit({
      redis: new Redis({ url: env.REDIS_URL }),
      limiter: Ratelimit.slidingWindow(10, "10 s")
    })
  : null;
```

### SMTP Email

Configured via `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`. Optional — app functions without it.

```typescript
import { sendEmail } from "@/lib/email";

await sendEmail({
  to: "user@example.com",
  subject: "Transfer Complete",
  html: "<p>Your transfer was completed.</p>"
});
```

---

## 25. Cursor Rules

Cursor rules live in `.cursor/rules/` (12 files). They are enforced during Cursor AI sessions.

| File | Scope | Summary |
| --- | --- | --- |
| `banking-coding-standards.mdc` | All files | Core standards — no `any`, no `process.env`, Server Actions for mutations, no N+1 |
| `typescript-no-any.mdc` | All files | Disallow `any`, require `unknown` + type guards |
| `env-access-via-lib-env.mdc` | All files | Ban `process.env` — use `lib/env.ts` |
| `mutations-via-server-actions.mdc` | All files | Write ops in Server Actions only |
| `no-n-plus-one-queries.mdc` | All files | Eager loading required |
| `workflow-and-steps.mdc` | All files | 9-step implementation workflow; plan required for >3 file changes |
| `plan-file-standards.mdc` | All files | Plans in `.cursor/plans/`, 8 required sections, markdown lint required |
| `kill-port-3000-before-tests.mdc` | All files | Free port 3000 before any test run |
| `project-coding-standards.mdc` | All files | Index pointer to coding rules |
| `project-workflow-process.mdc` | All files | Pointer to workflow-and-steps |
| `project-testing-validation.mdc` | All files | Pointer to testing/validation requirements |
| `project-documentation-style.mdc` | All files | Pointer to documentation standards |

---

## 26. GitHub Copilot Instructions

Main file: `.github/copilot-instructions.md`

Additional scoped instructions in `.github/instructions/` (23 files):

| File | Purpose |
| --- | --- |
| `01-project-overview.instructions.md` | Stack, architecture summary |
| `02-typescript-strict.instructions.md` | No `any`, explicit types |
| `03-nextjs-patterns.instructions.md` | Server/Client components, Cache Components |
| `04-server-actions.instructions.md` | Mutation pattern and template |
| `05-dal-patterns.instructions.md` | DAL usage, N+1 prevention |
| `06-auth-patterns.instructions.md` | NextAuth session, guards |
| `07-validation-zod.instructions.md` | Zod v4 patterns |
| `08-forms-ui.instructions.md` | React Hook Form + shadcn/ui |
| `09-database-schema.instructions.md` | Drizzle schema reference |
| `10-encryption.instructions.md` | AES-256-GCM usage |
| `11-env-vars.instructions.md` | lib/env.ts pattern |
| `12-testing-vitest.instructions.md` | Vitest unit test patterns |
| `13-testing-playwright.instructions.md` | Playwright E2E patterns |
| `14-error-handling.instructions.md` | Result type, error surfaces |
| `15-plaid-integration.instructions.md` | Plaid API patterns |
| `16-dwolla-integration.instructions.md` | Dwolla ACH patterns |
| `17-rate-limiting.instructions.md` | Upstash Redis usage |
| `18-security.instructions.md` | Security headers, sanitization |
| `19-import-order.instructions.md` | Import ordering rules |
| `20-naming-conventions.instructions.md` | Naming patterns |
| `21-eslint-config.instructions.md` | ESLint rules + noInlineConfig warning |
| `22-prettier-config.instructions.md` | Prettier settings |
| `23-technical-debt.instructions.md` | Current debt table |

---

## 27. OpenCode Skills & Instructions

### Skills (`.opencode/skills/`)

| Skill | Trigger | Coverage |
| --- | --- | --- |
| `AuthSkill` | Auth, sessions, OAuth | NextAuth v4, session shape, protected routes |
| `DBSkill` | Database, schema, DAL | Drizzle ORM, migrations, N+1 prevention |
| `DeploymentSkill` | Deploy, CI/CD | Vercel, Docker, Railway |
| `DwollaSkill` | Transfers, ACH | Dwolla API integration |
| `PlaidSkill` | Bank linking, transactions | Plaid API, PlaidLink |
| `SecuritySkill` | Security, encryption | AES-256-GCM, CSRF, headers |
| `ServerActionSkill` | Forms, mutations | Server Action template, revalidation |
| `TestingSkill` | Tests, Vitest, Playwright | Unit + E2E patterns |
| `UISkill` | UI, components, forms | shadcn/ui + Tailwind v4 |
| `ValidationSkill` | Zod, schemas, forms | Zod v4 patterns |

### Instructions (`.opencode/instructions/`)

| File | Priority | Summary |
| --- | --- | --- |
| `00-task-sync-note.md` | 0 | TaskSync protocol note — not compatible with OpenCode Docker |
| `01-core-standards.md` | 1 | PR-blocking rules, type safety, env vars, security essentials |
| `02-nextjs-patterns.md` | 2 | Server/Client components, Cache Components, Suspense |
| `03-dal-patterns.md` | 3 | DAL usage, N+1 prevention, transactions |
| `04-auth-testing.md` | 4 | NextAuth patterns, Vitest + Playwright |
| `05-ui-validation.md` | 5 | shadcn/ui components, React Hook Form, Zod patterns |
| `06-commands-ref.md` | 6 | Full command reference |

---

## 28. External Documentation & Sync Checklist

### Key External Docs

| Resource | URL |
| --- | --- |
| Next.js 16 Docs | https://nextjs.org/docs |
| Drizzle ORM | https://orm.drizzle.team/docs/overview |
| NextAuth.js v4 | https://next-auth.js.org/getting-started/introduction |
| Plaid API | https://plaid.com/docs/ |
| Dwolla API | https://developers.dwolla.com/ |
| Upstash Redis | https://upstash.com/docs/redis/overall/getstarted |
| Zod v4 | https://zod.dev |
| shadcn/ui | https://ui.shadcn.com/docs |
| Tailwind CSS v4 | https://tailwindcss.com/docs |
| Vitest | https://vitest.dev/guide/ |
| Playwright | https://playwright.dev/docs/intro |

### AGENTS.md Sync Checklist

When any of the following change, update the relevant section(s) in this file:

- [ ] `database/schema.ts` — update Section 16
- [ ] `lib/env.ts` — update Section 4 (env var count, required/optional status)
- [ ] `lib/actions/*.ts` — update Section 12 (action inventory)
- [ ] `types/next-auth.d.ts` — update Section 14 (session shape)
- [ ] `lib/dal/*.ts` — update Section 13
- [ ] `package.json` scripts — update Sections 2, 3
- [ ] `eslint.config.mts` — update Section 7
- [ ] `.prettierrc.ts` — update Section 8
- [ ] Technical debt resolved — update Section 23
- [ ] New test files added — update Section 19

### Version Bump Protocol

When updating AGENTS.md:

1. Increment version number in the header (e.g., `4.0` → `4.1`)
2. Update `Last Generated` date
3. Add a changelog entry at the top describing what changed and why
4. Re-verify all affected sections against the actual source files before writing
