# AGENTS.md — Banking Project Canonical Reference

**Last Generated:** April 2, 2026 | **Total Sections:** 28 | **Approx. Lines:** 2000+

---

## Changelog

### April 2, 2026 — Complete Rewrite v3.0

- Full replacement of v2.0 (commit `fef0b87`, 962 lines with inaccuracies)
- Corrected database schema: 10 tables (was 8); added `verificationToken`, `authenticator`, `user_profiles`, `errors`; removed non-existent `auditLogs` and `dwollaCustomers`
- Corrected `BaseDal` architecture: 3 standalone exported functions, not a class hierarchy
- Corrected Cursor rules count: 12 files (was 9) — includes 4 pointer/index files
- Added full Server Action method inventory with signatures (all 9 files, 25+ exported functions)
- Added complete Plaid action methods: `getBankWithDetails`, `removeBank`, `getInstitution`, `refreshAccounts`
- Added complete Dwolla action methods: `createDwollaCustomer`, `createTransfer`, `addFundingSource`, `createFundingSource`, `createOnDemandAuthorization`
- Added `user_profiles` table and `UserWithProfile` type pattern
- Added `logoutAccount` dynamic import pattern for `next-auth/react`
- Added Playwright `webServer` config and `PLAYWRIGHT_PREPARE_DB` env flag
- Added test fixture pattern and seed credentials
- Added plan file standards (`.cursor/plans/`, naming convention, required sections)
- Added standalone External Documentation section (Section 23)
- Added all 28 sections inline — no "see other file" shortcuts

---

## 1. Tech Stack Overview

The Banking project is a Next.js 16 full-stack financial application with TypeScript strict mode, end-to-end encryption, and comprehensive integration with Plaid (bank linking) and Dwolla (ACH transfers).

### Core Stack

| Technology | Version | Purpose |
| --- | --- | --- |
| **Next.js** | 16 | App Router, React Server Components, Cache Components |
| **React** | 19 | UI library (React Compiler enabled for auto-memoization) |
| **TypeScript** | 5.5 | Strict mode enabled, typed routes |
| **PostgreSQL** | via Neon | Relational database |
| **Drizzle ORM** | 0.30+ | Type-safe SQL query builder and schema management |
| **NextAuth.js** | v4 | JWT sessions, OAuth providers, credentials auth |
| **AES-256-GCM** | — | Symmetric encryption for sensitive fields |
| **shadcn/ui** | latest | Pre-built accessible UI components |
| **Tailwind CSS** | v4 | Utility-first CSS (PostCSS) |
| **React Hook Form** | latest | Form state management |
| **Zod** | v4 | Runtime schema validation and type inference |
| **Vitest** | latest | Unit and integration testing (happy-dom) |
| **Playwright** | latest | E2E browser automation (Chromium) |
| **bcryptjs** | latest | Password hashing |
| **npm** | — | Package manager |

### Special Features

- **React Compiler:** Enabled — automatic memoization, no manual `useMemo`/`useCallback` needed
- **Cache Components:** Enabled — requires Next.js 16+ (`"use cache"` directive)
- **Typed Routes:** Enabled in `tsconfig.json` — compile-time route safety
- **Async Request APIs:** `cookies()`, `headers()`, `params`, `searchParams` are async in Next.js 16
- **Security Headers:** Configured in `next.config.ts`

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

All commands defined in `package.json` scripts. Run `npm run` to list all available commands.

### Development

```bash
npm run dev              # Start dev server (localhost:3000)
npm run build            # Production build
npm run start            # Start production server
npm run clean            # Clean build artifacts (.next, dist, etc.)
```

### Validation (Run Before Every Commit)

```bash
npm run validate         # All checks: format:check + type-check + lint:strict + test
npm run format           # Auto-format with Prettier
npm run format:check     # Check formatting without modifying files
npm run type-check       # TypeScript strict mode check
npm run lint             # ESLint (warnings allowed)
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
npm run db:reset         # Full reset: drop + generate + push + seed
```

### Testing

```bash
npm run test             # All tests (Vitest + Playwright)
npm run test:browser     # Vitest unit/integration tests only
npm run test:ui          # Playwright E2E tests only
```

### Single Test Execution

```bash
# Run a single Vitest file
npm exec vitest run tests/unit/register.test.ts

# Run a single Playwright spec
npm exec playwright test tests/e2e/auth.spec.ts
```

### Project-Specific

```bash
npm run banking:validate # All banking-specific validation checks
npm run banking:generate # Generate project documentation
```

---

## 3. Environment Variables (27 Total)

All environment variables are validated and typed via `lib/env.ts` using Zod schemas. **Never read `process.env` directly in app code** — always import from `lib/env.ts`.

### Critical (Required, No Default — App Fails Without These)

| # | Variable | Purpose |
| --- | --- | --- |
| 1 | `ENCRYPTION_KEY` | 32-byte base64 string for AES-256-GCM encryption |
| 2 | `NEXTAUTH_SECRET` | NextAuth.js session signing key (min 32 chars) |
| 3 | `DATABASE_URL` | PostgreSQL connection string (Neon format) |

### Core Optional (Have Defaults)

| # | Variable | Default | Purpose |
| --- | --- | --- | --- |
| 4 | `NODE_ENV` | `"production"` | Runtime environment |
| 5 | `PORT` | `3000` | HTTP server port |
| 6 | `HOSTNAME` | `"0.0.0.0"` | HTTP server hostname |
| 7 | `NEXT_PUBLIC_SITE_URL` | `"http://localhost:3000"` | Public site URL (browser-accessible) |

### External APIs (Optional)

| #   | Variable            | Purpose                                |
| --- | ------------------- | -------------------------------------- |
| 8   | `NEON_DATABASE_URL` | Alternative Neon CLI connection string |
| 9   | `PLAID_CLIENT_ID`   | Plaid API client ID                    |
| 10  | `PLAID_SECRET`      | Plaid API secret                       |
| 11  | `PLAID_ENV`         | `"sandbox"` or `"production"`          |
| 12  | `DWOLLA_KEY`        | Dwolla API key                         |
| 13  | `DWOLLA_SECRET`     | Dwolla API secret                      |
| 14  | `DWOLLA_ENV`        | `"sandbox"` or `"production"`          |

### OAuth Providers (Optional)

| #   | Variable             | Purpose                    |
| --- | -------------------- | -------------------------- |
| 15  | `AUTH_GITHUB_ID`     | GitHub OAuth app client ID |
| 16  | `AUTH_GITHUB_SECRET` | GitHub OAuth app secret    |
| 17  | `AUTH_GOOGLE_ID`     | Google OAuth app client ID |
| 18  | `AUTH_GOOGLE_SECRET` | Google OAuth app secret    |

### Email (Optional)

| #   | Variable        | Purpose                               |
| --- | --------------- | ------------------------------------- |
| 19  | `SMTP_HOST`     | SMTP server hostname                  |
| 20  | `SMTP_PORT`     | SMTP server port                      |
| 21  | `SMTP_USER`     | SMTP username                         |
| 22  | `SMTP_PASSWORD` | SMTP password                         |
| 23  | `SMTP_FROM`     | From email address for outgoing email |

### Caching & Rate Limiting (Optional)

| # | Variable | Purpose |
| --- | --- | --- |
| 24 | `REDIS_URL` | Upstash Redis URL for rate limiting (graceful fallback if absent) |

### Observability (Optional)

| # | Variable | Purpose |
| --- | --- | --- |
| 25 | `SENTRY_DSN` | Sentry error tracking DSN |
| 26 | `ANALYTICS_ID` | Analytics tracking ID |
| 27 | `LOG_LEVEL` | `"debug"` \| `"info"` \| `"warn"` \| `"error"` |

### Usage Pattern

```typescript
// BAD — never do this
const key = process.env.ENCRYPTION_KEY;

// GOOD — always use lib/env.ts
import { env } from "@/lib/env";
const key: string = env.ENCRYPTION_KEY;
```

---

## 4. MCP Servers (6 Total)

Model Context Protocol servers configured in `opencode.json` and managed by `.opencode/mcp-runner.js`.

| # | Server | Purpose |
| --- | --- | --- |
| 1 | **context7** | Context window documentation retrieval |
| 2 | **database-server** | Database query and schema inspection |
| 3 | **github-official** | GitHub API integration (issues, PRs, repos) |
| 4 | **neon** | Neon database CLI operations |
| 5 | **playwright** | E2E testing automation |
| 6 | **shadcn** | shadcn/ui component registry management |

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
- Non-nullable by default — use `| null` explicitly when needed
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

All Server Actions and DAL methods return this shape:

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

## 7. Import Order & File Organization

### Canonical Import Order (enforced by ESLint)

```typescript
// 1. React / core
import * as React from "react";
import { useState, useEffect } from "react";

// 2. Next.js
import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";

// 3. Third-party libraries
import { z } from "zod";
import { eq } from "drizzle-orm";
import { useForm } from "react-hook-form";

// 4. Internal — DAL
import { userDal, bankDal } from "@/lib/dal";

// 5. Internal — Server Actions
import { createUser } from "@/lib/actions/user.actions";

// 6. Internal — Components
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// 7. Type-only imports (always last)
import type { User } from "@/types";
```

### Project Directory Structure

```
banking/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Auth routes (sign-in, sign-up)
│   ├── (root)/             # Protected routes (dashboard, settings, etc.)
│   ├── api/                # API routes (minimal — mutations go in Server Actions)
│   ├── layout.tsx          # Root layout
│   └── middleware.ts       # ⚠️ WRONG LOCATION — should be root middleware.ts
├── components/             # React components
│   └── ui/                 # shadcn/ui components
├── database/               # Drizzle ORM
│   ├── db.ts               # DB connection
│   └── schema.ts           # Schema (10 tables + 1 enum)
├── lib/                    # Core logic
│   ├── actions/            # Server Actions (9 files)
│   ├── dal/                # Data Access Layer (6 DAL files + base)
│   ├── auth.ts             # auth() helper
│   ├── auth-options.ts     # NextAuth.js config
│   ├── encryption.ts       # AES-256-GCM
│   ├── env.ts              # Zod-validated env vars
│   ├── plaid.ts            # Plaid client setup
│   ├── dwolla.ts           # Dwolla client setup
│   └── email.ts            # SMTP email (optional)
├── types/                  # TypeScript types
├── tests/                  # Vitest + Playwright
│   ├── unit/               # Vitest tests
│   ├── e2e/                # Playwright tests
│   ├── fixtures/           # Shared test fixtures
│   └── setup.ts            # Vitest setup (loads .env.local)
├── .cursor/                # Cursor agents, rules, plans
├── .github/                # GitHub instructions, prompts
├── .opencode/              # OpenCode skills, MCP config
├── opencode.json           # MCP server config
├── next.config.ts          # Security headers, feature flags
├── vitest.config.ts        # Vitest config
├── playwright.config.ts    # Playwright config
├── tsconfig.json           # TypeScript config (strict + typed routes)
└── AGENTS.md               # This file
```

---

## 8. Naming Conventions

| Type | Convention | Example |
| --- | --- | --- |
| Files | kebab-case | `user-dal.ts`, `bank.actions.ts` |
| Directories | kebab-case | `my-banks/`, `payment-transfer/` |
| Classes | PascalCase | `UserDal`, `BankDal` |
| Functions | camelCase | `createUser`, `findByEmail` |
| Variables | camelCase | `currentUser`, `bankAccounts` |
| Constants | UPPER_SNAKE_CASE | `MAX_RETRY`, `DEFAULT_LIMIT` |
| Types / Interfaces | PascalCase | `User`, `BankAccount`, `UserWithProfile` |
| Zod Schemas | PascalCase + `Schema` | `CreateUserSchema`, `UpdateBankSchema` |
| React Components | PascalCase | `DashboardPage`, `PaymentForm` |
| Server Actions | camelCase verb | `createUser`, `toggleAdmin`, `logoutAccount` |
| DAL methods | camelCase verb | `findById`, `findByEmail`, `findAllWithBanks` |

---

## 9. Next.js 16 Patterns

### Server vs. Client Components

**Server Components** (default — no directive needed):

- Use for data fetching, heavy logic, and non-interactive UI
- Can be `async` — `await` directly at the top level
- Never import client-only hooks (`useState`, `useEffect`, etc.)

```tsx
// app/(root)/dashboard/page.tsx
import { userDal } from "@/lib/dal";

export default async function DashboardPage() {
  const user = await userDal.findById("123");
  return <div>Welcome, {user?.name}</div>;
}
```

**Client Components** — add `"use client"` at top:

- Required for event handlers, browser APIs, hooks
- Keep as small ("leaf") as possible — push down to where interactivity lives

```tsx
"use client";

import { useState } from "react";

export function ToggleButton() {
  const [on, setOn] = useState(false);
  return (
    <button onClick={() => setOn(!on)}>{on ? "On" : "Off"}</button>
  );
}
```

### Async Request APIs (Next.js 16)

`cookies()`, `headers()`, `params`, and `searchParams` are **async** in Next.js 16:

```typescript
import { cookies, headers } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const headersList = await headers();
  const token = cookieStore.get("token");
  return Response.json({ token });
}
```

Page params and searchParams:

```tsx
// app/(root)/banks/[id]/page.tsx
export default async function BankPage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { id } = await params;
  const { tab } = await searchParams;
  // ...
}
```

### Cache Components (Next.js 16)

Use `"use cache"` directive for memoized server-side caching:

```typescript
"use cache";

import { cacheLife } from "next/cache";

cacheLife("hours");

export default async function MyBanksPage() {
  const banks = await getUserBanks();
  return <BankList banks={banks} />;
}
```

**Cache revalidation:**

```typescript
import {
  revalidateTag,
  unstable_updateTag as updateTag
} from "next/cache";

// Prefer revalidateTag with stale-while-revalidate (background refresh)
revalidateTag("banks", "max");

// Use updateTag in Server Actions for immediate consistency after mutation
updateTag("banks");
```

### Suspense Boundaries

Wrap async content in `Suspense` for streaming:

```tsx
import { Suspense } from "react";
import { BankListSkeleton } from "@/components/skeletons";

export default function Page() {
  return (
    <Suspense fallback={<BankListSkeleton />}>
      <BankList />
    </Suspense>
  );
}
```

### Route Groups

```
app/
├── (auth)/          # Unauthenticated routes — no sidebar/nav
│   ├── sign-in/
│   └── sign-up/
└── (root)/          # Protected routes — full layout with sidebar
    ├── dashboard/
    ├── my-banks/
    ├── payment-transfer/
    ├── transaction-history/
    └── settings/
```

---

## 10. Server Actions

### Architecture Rules

- All mutations go through Server Actions — **never** in API routes
- Every Server Action file starts with `"use server"`
- All accept `input: unknown` and validate with Zod before touching the DB
- All return `{ ok: boolean; data?: T; error?: string }`
- Auth check (`const session = await auth()`) is the first operation in protected actions

### Complete Method Inventory (9 Files, 25+ Functions)

#### `lib/actions/register.ts`

```typescript
export async function registerUser(
  input: unknown
): Promise<{ ok: boolean; error?: string }>;

// Also exported as alias:
export { registerUser as register };
```

#### `lib/actions/user.actions.ts`

```typescript
export async function getLoggedInUser(): Promise<{
  ok: boolean;
  data?: User;
  error?: string;
}>;

// Uses dynamic import to avoid SSR bundling issues:
// const { signOut } = await import("next-auth/react");
export async function logoutAccount(): Promise<{
  ok: boolean;
  error?: string;
}>;
```

#### `lib/actions/admin.actions.ts`

> ⚠️ **Known Debt:** Neither `toggleAdmin` nor `setActive` call `auth()` — no auth check exists.

```typescript
export async function toggleAdmin(
  input: unknown
): Promise<{ ok: boolean; error?: string }>;

export async function setActive(
  input: unknown
): Promise<{ ok: boolean; error?: string }>;
```

#### `lib/actions/bank.actions.ts`

```typescript
export async function getUserBanks(): Promise<{
  ok: boolean;
  data?: Bank[];
  error?: string;
}>;

export async function disconnectBank(
  input: unknown
): Promise<{ ok: boolean; error?: string }>;
```

#### `lib/actions/transaction.actions.ts`

```typescript
export async function getRecentTransactions(): Promise<{
  ok: boolean;
  data?: Transaction[];
  error?: string;
}>;

export async function getTransactionHistory(
  input: unknown
): Promise<{ ok: boolean; data?: Transaction[]; error?: string }>;
```

#### `lib/actions/recipient.actions.ts`

```typescript
export async function getRecipients(): Promise<{
  ok: boolean;
  data?: Recipient[];
  error?: string;
}>;

export async function createRecipient(
  input: unknown
): Promise<{ ok: boolean; data?: Recipient; error?: string }>;

export async function updateRecipient(
  input: unknown
): Promise<{ ok: boolean; error?: string }>;

export async function deleteRecipient(
  input: unknown
): Promise<{ ok: boolean; error?: string }>;
```

#### `lib/actions/plaid.actions.ts`

```typescript
export async function createLinkToken(): Promise<{
  ok: boolean;
  data?: string;
  error?: string;
}>;

export async function exchangePublicToken(
  input: unknown
): Promise<{ ok: boolean; error?: string }>;

export async function getAccounts(): Promise<{
  ok: boolean;
  data?: PlaidAccount[];
  error?: string;
}>;

export async function getTransactions(input: unknown): Promise<{
  ok: boolean;
  data?: PlaidTransaction[];
  error?: string;
}>;

export async function getBalance(
  input: unknown
): Promise<{ ok: boolean; data?: number; error?: string }>;

// ⚠️ Known Debt: Calls getBalance() per bank in a loop — N+1 pattern
export async function getAllBalances(): Promise<{
  ok: boolean;
  data?: BalanceSummary;
  error?: string;
}>;

export async function getInstitution(
  input: unknown
): Promise<{ ok: boolean; data?: Institution; error?: string }>;

export async function getBankWithDetails(
  input: unknown
): Promise<{ ok: boolean; data?: BankWithDetails; error?: string }>;

export async function removeBank(
  input: unknown
): Promise<{ ok: boolean; error?: string }>;
```

#### `lib/actions/dwolla.actions.ts`

```typescript
export async function createDwollaCustomer(
  input: unknown
): Promise<{ ok: boolean; data?: string; error?: string }>;

export async function createOnDemandAuthorization(): Promise<{
  ok: boolean;
  data?: string;
  error?: string;
}>;

export async function createFundingSource(
  input: unknown
): Promise<{ ok: boolean; data?: string; error?: string }>;

export async function createTransfer(
  input: unknown
): Promise<{ ok: boolean; data?: string; error?: string }>;

export async function addFundingSource(
  input: unknown
): Promise<{ ok: boolean; error?: string }>;
```

#### `lib/actions/updateProfile.ts`

> ⚠️ **Known Debt:** Reads `userId` from client-supplied `input` — no `auth()` session check.

```typescript
export async function updateProfile(
  input: unknown
): Promise<{ ok: boolean; error?: string }>;
```

### Canonical Server Action Template

```typescript
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { userDal } from "@/lib/dal";

const InputSchema = z.object({
  name: z.string().min(1).max(100)
});

export async function updateUserName(
  input: unknown
): Promise<{ ok: boolean; error?: string }> {
  // 1. Auth check first
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: "Unauthorized" };
  }

  // 2. Validate input
  const parsed = InputSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.message };
  }

  // 3. Mutate
  try {
    await userDal.update(session.user.id, { name: parsed.data.name });
    revalidatePath("/settings");
    return { ok: true };
  } catch {
    return { ok: false, error: "Failed to update name" };
  }
}
```

---

## 11. Data Access Layer (DAL)

### Architecture

All database access goes through `lib/dal/`. Direct DB calls outside the DAL are not permitted.

### `lib/dal/base.dal.ts` — 3 Standalone Functions

> ⚠️ **Critical:** `BaseDal` is NOT a class. There is no class hierarchy or `extends`. These are 3 standalone exported utility functions that DAL classes use internally.
>
> ⚠️ **Known Debt:** All 3 functions use `table: any` — violates the no-`any` rule. Tracked as technical debt.

```typescript
// lib/dal/base.dal.ts — actual signatures

export async function findById(
  table: any,
  id: string
): Promise<unknown>;

export async function findAll(
  table: any,
  limitVal = 100,
  offsetVal = 0
): Promise<unknown>;

export async function deleteById(
  table: any,
  id: string
): Promise<unknown>;
```

### DAL Files & Method Counts

| File | Class | Exported Instance | Methods |
| --- | --- | --- | --- |
| `lib/dal/user.dal.ts` | `UserDal` | `userDal` | 10 |
| `lib/dal/bank.dal.ts` | `BankDal` | `bankDal` | 7 |
| `lib/dal/transaction.dal.ts` | `TransactionDal` | `transactionDal` | 4 |
| `lib/dal/recipient.dal.ts` | `RecipientDal` | `recipientDal` | 6 |
| `lib/dal/dwolla.dal.ts` | `DwollaDal` | `dwollaDal` | 8 |

All instances are exported from `lib/dal/index.ts`.

### `UserDal` — 10 Methods

```typescript
findById(id: string): Promise<User | null>
findByEmail(email: string): Promise<User | null>
findAll(limit?: number, offset?: number): Promise<User[]>
create(data: NewUser): Promise<User>
update(id: string, data: Partial<User>): Promise<User>
delete(id: string): Promise<void>
findAllWithBanks(): Promise<UserWithBanks[]>
findWithProfile(id: string): Promise<UserWithProfile | null>
updateProfile(id: string, data: Partial<UserProfile>): Promise<void>
countAll(): Promise<number>
```

### `BankDal` — 7 Methods

> Auto-encrypts `accessToken` on write; auto-decrypts on read via `lib/encryption.ts`.

```typescript
findById(id: string): Promise<Bank | null>
findByUserId(userId: string): Promise<Bank[]>
findAll(limit?: number, offset?: number): Promise<Bank[]>
create(data: NewBank): Promise<Bank>
update(id: string, data: Partial<Bank>): Promise<Bank>
delete(id: string): Promise<void>
findByPlaidAccountId(plaidAccountId: string): Promise<Bank | null>
```

### `TransactionDal` — 4 Methods

```typescript
findById(id: string): Promise<Transaction | null>
findByUserId(userId: string): Promise<Transaction[]>
create(data: NewTransaction): Promise<Transaction>
findRecent(userId: string, limit?: number): Promise<Transaction[]>
```

### `RecipientDal` — 6 Methods

```typescript
findById(id: string): Promise<Recipient | null>
findByUserId(userId: string): Promise<Recipient[]>
findAll(limit?: number, offset?: number): Promise<Recipient[]>
create(data: NewRecipient): Promise<Recipient>
update(id: string, data: Partial<Recipient>): Promise<Recipient>
delete(id: string): Promise<void>
```

### `DwollaDal` — 8 Methods

> Auto-encrypts sensitive Dwolla fields on write; auto-decrypts on read.

```typescript
findById(id: string): Promise<DwollaRecord | null>
findByUserId(userId: string): Promise<DwollaRecord | null>
findAll(limit?: number, offset?: number): Promise<DwollaRecord[]>
create(data: NewDwollaRecord): Promise<DwollaRecord>
update(id: string, data: Partial<DwollaRecord>): Promise<DwollaRecord>
delete(id: string): Promise<void>
findByCustomerId(customerId: string): Promise<DwollaRecord | null>
findByFundingSourceId(fundingSourceId: string): Promise<DwollaRecord | null>
```

### Import Pattern

```typescript
// Always import from the barrel index
import {
  userDal,
  bankDal,
  transactionDal,
  recipientDal,
  dwollaDal
} from "@/lib/dal";
```

### N+1 Prevention — CRITICAL

```typescript
// BAD — N+1 query pattern (never do this)
const users = await userDal.findAll();
for (const user of users) {
  user.banks = await bankDal.findByUserId(user.id); // fires N queries
}

// GOOD — single query with JOIN
const usersWithBanks = await userDal.findAllWithBanks();
```

### Transaction Pattern

```typescript
import { db } from "@/database/db";

await db.transaction(async (tx) => {
  const user = await tx.insert(users).values({ ... }).returning();
  await tx.insert(banks).values({ userId: user[0].id, ... });
});
```

---

## 12. Authentication

### Auth Helper

```typescript
// lib/auth.ts — re-exports auth() from auth-options
import { auth } from "@/lib/auth-options";
export { auth };
```

### Session Shape

```typescript
// Augmented NextAuth session (declared in types/next-auth.d.ts)
interface Session {
  user: {
    id: string;
    email: string;
    name: string;
    role: "user" | "admin" | "moderator";
    image?: string;
  };
}
```

### Checking Auth in Server Actions

```typescript
"use server";

import { auth } from "@/lib/auth";

export async function protectedAction(input: unknown) {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: "Unauthorized" };
  }
  // proceed
}
```

### Checking Role (Admin Gate)

```typescript
export async function adminOnlyAction(input: unknown) {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: "Unauthorized" };
  }
  if (session.user.role !== "admin") {
    return { ok: false, error: "Forbidden: admin access required" };
  }
  // proceed
}
```

### Providers Configured

- **Credentials** — email + password via bcryptjs
- **GitHub OAuth** — requires `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET`
- **Google OAuth** — requires `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET`

### `logoutAccount` — Dynamic Import Pattern

`logoutAccount` uses a dynamic import to avoid bundling `next-auth/react` on the server:

```typescript
// lib/actions/user.actions.ts
export async function logoutAccount(): Promise<{
  ok: boolean;
  error?: string;
}> {
  try {
    const { signOut } = await import("next-auth/react");
    await signOut({ redirect: false });
    return { ok: true };
  } catch {
    return { ok: false, error: "Logout failed" };
  }
}
```

---

## 13. Encryption

### Algorithm

AES-256-GCM symmetric encryption with `scryptSync` key derivation. Implemented in `lib/encryption.ts`.

### Ciphertext Format

```
iv:authTag:ciphertext
```

All three parts are base64-encoded and joined with `:`.

### API

```typescript
import { encrypt, decrypt } from "@/lib/encryption";

// Encrypt a plaintext string
const ciphertext: string = encrypt("sensitive-value");
// Returns: "base64iv:base64authTag:base64ciphertext"

// Decrypt back to plaintext
const plaintext: string = decrypt(ciphertext);
```

### Key Derivation

Encryption key is derived from `env.ENCRYPTION_KEY` using `crypto.scryptSync` with a fixed salt. The derived key is cached in module scope (derived once on first use).

### Where Encryption Is Used

| DAL | Fields Encrypted |
| --- | --- |
| `BankDal` | `accessToken` |
| `DwollaDal` | Dwolla customer ID, funding source URL, and related sensitive fields |

Encryption/decryption is **transparent** — callers read/write plaintext; the DAL layer handles the conversion automatically.

### Do Not Log Encrypted Values

```typescript
// BAD
console.log("accessToken:", bank.accessToken);

// GOOD — never log sensitive fields
```

---

## 14. Middleware

### Current Location (Known Bug)

```
app/middleware.ts     ← WRONG — Next.js does not pick this up
middleware.ts         ← CORRECT — must be at the project root
```

The middleware file is currently at `app/middleware.ts`, which is not the standard Next.js location. The middleware code exists but **does not execute** at runtime. This is tracked as technical debt.

### What the Middleware Does

When placed correctly at the root:

- Protects all `(root)` routes — redirects unauthenticated users to `/sign-in`
- Allows public access to `(auth)` routes and static assets
- Uses NextAuth.js `withAuth` wrapper or `auth` middleware helper

### Correct Pattern (once moved)

```typescript
// middleware.ts (root level)
import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/sign-in"
  }
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sign-in|sign-up).*)"
  ]
};
```

---

## 15. Database Schema

### Summary: 10 Tables + 1 Enum

Defined in `database/schema.ts` using Drizzle ORM.

#### Enum: `userRole`

```typescript
export const userRole = pgEnum("userRole", [
  "user",
  "admin",
  "moderator"
]);
```

### Table Reference

| # | Table | Purpose |
| --- | --- | --- |
| 1 | `users` | Core user identity (NextAuth + app) |
| 2 | `account` | OAuth provider account links (NextAuth) |
| 3 | `session` | Active JWT sessions (NextAuth) |
| 4 | `verificationToken` | Email verification tokens (NextAuth) |
| 5 | `authenticator` | WebAuthn/passkey authenticators (NextAuth) |
| 6 | `user_profiles` | Extended user profile (bio, avatar, preferences) |
| 7 | `banks` | Linked bank accounts (Plaid `accessToken` encrypted) |
| 8 | `transactions` | Transaction history |
| 9 | `recipients` | ACH transfer recipients |
| 10 | `errors` | Application error log |

### Key Table Schemas

#### `users`

```typescript
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name"),
  email: text("email").unique().notNull(),
  emailVerified: timestamp("emailVerified"),
  image: text("image"),
  password: text("password"), // bcryptjs hash; null for OAuth users
  role: userRole("role").default("user").notNull(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull()
});
```

#### `user_profiles`

```typescript
export const user_profiles = pgTable("user_profiles", {
  id: text("id").primaryKey(),
  userId: text("userId")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  bio: text("bio"),
  avatarUrl: text("avatarUrl"),
  preferences: jsonb("preferences"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull()
});
```

#### `banks`

```typescript
export const banks = pgTable("banks", {
  id: text("id").primaryKey(),
  userId: text("userId")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  plaidAccountId: text("plaidAccountId").notNull(),
  accessToken: text("accessToken").notNull(), // AES-256-GCM encrypted
  institutionId: text("institutionId"),
  institutionName: text("institutionName"),
  officialName: text("officialName"),
  mask: text("mask"),
  type: text("type"),
  subtype: text("subtype"),
  dwollaFundingSourceUrl: text("dwollaFundingSourceUrl"),
  dwollaCustomerId: text("dwollaCustomerId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull()
});
```

#### `transactions`

```typescript
export const transactions = pgTable("transactions", {
  id: text("id").primaryKey(),
  userId: text("userId")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  plaidTransactionId: text("plaidTransactionId"),
  accountId: text("accountId"),
  amount: numeric("amount").notNull(),
  isoCurrencyCode: text("isoCurrencyCode"),
  name: text("name"),
  merchantName: text("merchantName"),
  category: text("category"),
  date: date("date").notNull(),
  pending: boolean("pending").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull()
});
```

#### `recipients`

```typescript
export const recipients = pgTable("recipients", {
  id: text("id").primaryKey(),
  userId: text("userId")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(),
  email: text("email"),
  dwollaDestinationUrl: text("dwollaDestinationUrl"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull()
});
```

#### `errors`

```typescript
export const errors = pgTable("errors", {
  id: text("id").primaryKey(),
  userId: text("userId").references(() => users.id, {
    onDelete: "set null"
  }),
  message: text("message").notNull(),
  stack: text("stack"),
  context: jsonb("context"),
  createdAt: timestamp("createdAt").defaultNow().notNull()
});
```

### `UserWithProfile` Type Pattern

```typescript
// Joined type for user + profile
type UserWithProfile = {
  user: typeof users.$inferSelect;
  profile: typeof user_profiles.$inferSelect | null;
};

// Example query
const result = await db
  .select({ user: users, profile: user_profiles })
  .from(users)
  .leftJoin(user_profiles, eq(users.id, user_profiles.userId))
  .where(eq(users.id, userId))
  .limit(1);
```

---

## 16. Validation

### Zod v4 Patterns

All input validation uses Zod. Schema names follow `PascalCase + Schema` convention.

### Common Schema Patterns

```typescript
import { z } from "zod";

// String validations
const name = z.string().min(1, "Required").max(100, "Too long");
const email = z.string().email("Invalid email");
const url = z.string().url("Invalid URL");
const enumVal = z.enum(["user", "admin", "moderator"]);

// Number validations
const amount = z.number().min(0.01, "Must be positive").max(100000);
const pageSize = z.number().int().min(1).max(100).default(20);

// Optional fields
const bio = z.string().max(500).optional();
const image = z.string().url().nullable();

// Object with refinement
const PasswordSchema = z
  .object({
    password: z.string().min(8),
    confirm: z.string()
  })
  .refine(d => d.password === d.confirm, {
    message: "Passwords do not match",
    path: ["confirm"]
  });

// Coercion (for form data strings)
const amountFromForm = z.coerce.number().min(0.01);
const dateFromForm = z.coerce.date();
```

### Server Action Validation Pattern

```typescript
"use server";

import { z } from "zod";

const CreateRecipientSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().optional(),
  dwollaDestinationUrl: z.string().url()
});

export async function createRecipient(
  input: unknown
): Promise<{ ok: boolean; error?: string }> {
  const parsed = CreateRecipientSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.message };
  }
  // proceed with parsed.data (fully typed)
}
```

### Form Validation (Client Side)

```tsx
"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const FormSchema = z.object({
  email: z.string().email(),
  amount: z.coerce.number().min(0.01)
});

type FormData = z.infer<typeof FormSchema>;

export function PaymentForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: { email: "", amount: 0 }
  });

  async function onSubmit(data: FormData) {
    const result = await createPayment(data);
    if (!result.ok) {
      form.setError("root", { message: result.error });
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <input {...form.register("email")} />
      {form.formState.errors.email && (
        <p>{form.formState.errors.email.message}</p>
      )}
    </form>
  );
}
```

---

## 17. Testing

### Test Infrastructure

| Tool | Purpose | Config File |
| --- | --- | --- |
| **Vitest** | Unit & integration tests | `vitest.config.ts` |
| **Playwright** | E2E browser tests | `playwright.config.ts` |
| **happy-dom** | DOM environment for Vitest | `vitest.config.ts` |

### Directory Structure

```
tests/
├── unit/                    # Vitest tests
│   ├── register.test.ts
│   └── auth.test.ts
├── e2e/                     # Playwright tests
│   ├── auth.spec.ts
│   ├── bank-linking.spec.ts
│   ├── global-setup.ts      # DB seeding (PLAYWRIGHT_PREPARE_DB)
│   └── helpers/
│       └── auth.ts          # Seed credentials + sign-in helpers
├── fixtures/
│   └── auth.ts              # base.extend fixture pattern
└── setup.ts                 # Vitest setup — loads .env.local
```

### Running Tests

```bash
npm run test             # All tests (Vitest + Playwright)
npm run test:browser     # Vitest only
npm run test:ui          # Playwright only

# Single file — Vitest
npm exec vitest run tests/unit/register.test.ts

# Single file — Playwright
npm exec playwright test tests/e2e/auth.spec.ts
```

### Port Guard (REQUIRED before any test run)

Before running Playwright or Vitest, always kill any process on port 3000:

```powershell
$pids = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
if ($pids) { $pids | ForEach-Object { Stop-Process -Id $_ -Force } }
```

### Playwright Config — `webServer`

`playwright.config.ts` auto-starts the dev server before tests:

```typescript
webServer: {
  command: "npm run dev",
  url: "http://localhost:3000",
  reuseExistingServer: !process.env["CI"],
}
```

### DB Seeding for E2E

`tests/e2e/global-setup.ts` seeds the database when `PLAYWRIGHT_PREPARE_DB=true`:

```bash
PLAYWRIGHT_PREPARE_DB=true npm run test:ui
```

### Seed Credentials

```typescript
// tests/e2e/helpers/auth.ts
export const SEED_USER = {
  email: "seed-user@example.com",
  password: "password123"
};
```

### Test Fixture Pattern

```typescript
// tests/fixtures/auth.ts
import { test as base } from "@playwright/test";

type AuthFixtures = {
  authenticatedPage: Page;
  unauthenticatedPage: Page;
};

export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ page }, use) => {
    await signInWithSeedUser(page);
    await use(page);
  },
  unauthenticatedPage: async ({ page }, use) => {
    await page.context().clearCookies();
    await use(page);
  }
});
```

### Writing Vitest Unit Tests

```typescript
import { describe, it, expect, beforeEach, vi } from "vitest";

describe("registerUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns ok: false for invalid input", async () => {
    const result = await registerUser({ email: "not-an-email" });
    expect(result.ok).toBe(false);
    expect(result.error).toBeDefined();
  });

  it("returns ok: true for valid input", async () => {
    const result = await registerUser({
      email: "test@example.com",
      password: "securepass123",
      name: "Test User"
    });
    expect(result.ok).toBe(true);
  });
});
```

### Writing Playwright E2E Tests

```typescript
import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies();
  });

  test("redirects unauthenticated users to sign-in", async ({
    page
  }) => {
    await page.goto("/my-banks");
    await expect(page).toHaveURL(/\/sign-in/);
  });

  test("signs in with valid credentials", async ({ page }) => {
    await page.goto("/sign-in");
    await page.fill('[name="email"]', "seed-user@example.com");
    await page.fill('[name="password"]', "password123");
    await page.click('[type="submit"]');
    await expect(page).toHaveURL("/dashboard");
  });
});
```

### Test Best Practices

- Use `data-testid` attributes for reliable selectors — avoid CSS classes
- Always clear cookies in `beforeEach` for auth tests
- Never test implementation details — test observable behavior
- Use `vi.mock` to mock DAL methods, not DB internals
- Use realistic test data matching production shapes

---

## 18. Integrations

### Plaid

**Setup:** `lib/plaid.ts` creates and exports the Plaid client using `env.PLAID_CLIENT_ID`, `env.PLAID_SECRET`, and `env.PLAID_ENV`.

**Flow:**

1. `createLinkToken()` — server generates a link token for PlaidLink UI
2. User completes PlaidLink in browser (client-side)
3. `exchangePublicToken(input)` — server exchanges public token for permanent access token, stores encrypted in `banks` table
4. `getAccounts()` / `getTransactions()` / `getBalance()` — fetch live data via Plaid API

**Sandbox testing:** Set `PLAID_ENV=sandbox` and use Plaid test credentials.

```typescript
// lib/plaid.ts
import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";
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

**Setup:** `lib/dwolla.ts` creates and exports the Dwolla client using `env.DWOLLA_KEY`, `env.DWOLLA_SECRET`, and `env.DWOLLA_ENV`.

**Flow:**

1. `createDwollaCustomer(input)` — registers user as a Dwolla customer
2. `createOnDemandAuthorization()` — obtains authorization for on-demand transfers
3. `createFundingSource(input)` — links bank account as Dwolla funding source
4. `addFundingSource(input)` — attaches funding source to customer
5. `createTransfer(input)` — initiates ACH transfer between accounts

```typescript
// lib/dwolla.ts
import { Client } from "dwolla-v2";
import { env } from "@/lib/env";

export const dwollaClient = new Client({
  key: env.DWOLLA_KEY ?? "",
  secret: env.DWOLLA_SECRET ?? "",
  environment:
    (env.DWOLLA_ENV as "sandbox" | "production") ?? "sandbox"
});
```

### Upstash Redis (Rate Limiting)

Rate limiting is optional. If `REDIS_URL` is not set, the app falls back gracefully (no rate limiting applied).

```typescript
// Graceful fallback pattern
import { env } from "@/lib/env";

let rateLimiter: RateLimiter | null = null;

if (env.REDIS_URL) {
  const { Ratelimit } = await import("@upstash/ratelimit");
  const { Redis } = await import("@upstash/redis");
  rateLimiter = new Ratelimit({
    redis: new Redis({ url: env.REDIS_URL }),
    limiter: Ratelimit.slidingWindow(10, "10 s")
  });
}
```

### Email (SMTP)

Email is optional. Implemented in `lib/email.ts`. Only active when `SMTP_HOST` is configured.

---

## 19. Security

### Security Headers

Configured in `next.config.ts` and applied to all routes:

```typescript
// next.config.ts
const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload"
  },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()"
  }
];
```

### Input Sanitization

- All Server Action inputs go through Zod `safeParse` before any DB operation
- Never trust client-supplied IDs — always resolve user identity from the session
- Use parameterized queries exclusively (Drizzle ORM handles this automatically)

### Password Security

```typescript
import bcryptjs from "bcryptjs";

// Hash on registration (cost factor 12)
const hash = await bcryptjs.hash(password, 12);

// Verify on login
const valid = await bcryptjs.compare(password, storedHash);
```

### Sensitive Data Rules

```typescript
// NEVER log sensitive fields
console.log(user.password); // BAD
console.log(bank.accessToken); // BAD
console.log(dwolla.customerId); // BAD

// NEVER return sensitive fields to the client
return { user }; // BAD if user includes password
return { id: user.id, name: user.name, email: user.email }; // GOOD
```

### CSRF Protection

NextAuth.js provides built-in CSRF protection for its endpoints. Server Actions are protected by Next.js same-origin enforcement — they cannot be called cross-origin.

### Session Security

- Sessions are JWT-signed with `NEXTAUTH_SECRET`
- `session.user.id` is the authoritative identity — never accept user IDs from request bodies
- Session expiry is configured in `lib/auth-options.ts`

### Access Control Checklist

Every Server Action must:

- [ ] Call `auth()` and check `session?.user?.id` before any DB read or write
- [ ] Validate all inputs with `ZodSchema.safeParse(input)`
- [ ] Return `{ ok: false, error: "Unauthorized" }` for missing session
- [ ] Return `{ ok: false, error: "Forbidden" }` for insufficient role
- [ ] Never expose internal error messages to the client — log internally, return generic message

---

## 20. Components & UI

### shadcn/ui Components

All UI components live in `components/ui/` and are managed via the shadcn CLI.

```typescript
// Common component imports
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
```

### Adding New shadcn Components

```bash
npx shadcn@latest add <component-name>
# Example:
npx shadcn@latest add calendar
npx shadcn@latest add data-table
```

### Tailwind CSS v4

This project uses Tailwind CSS v4 (PostCSS). Key differences from v3:

- Configuration is in `app/globals.css` using `@theme` (not `tailwind.config.js`)
- Arbitrary values use the same `[]` syntax
- All design tokens are CSS custom properties

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  --color-primary: oklch(0.45 0.2 265);
  --font-sans: "Inter", sans-serif;
}
```

### Form Pattern (Full Example)

```tsx
"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const schema = z.object({
  amount: z.coerce.number().min(0.01, "Amount must be positive")
});

type FormData = z.infer<typeof schema>;

export function TransferForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { amount: 0 }
  });

  async function onSubmit(data: FormData) {
    const result = await createTransfer(data);
    if (!result.ok) {
      form.setError("root", {
        message: result.error ?? "Transfer failed"
      });
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
                <Input type="number" step="0.01" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {form.formState.errors.root && (
          <p className="text-sm text-destructive">
            {form.formState.errors.root.message}
          </p>
        )}
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Sending..." : "Transfer"}
        </Button>
      </form>
    </Form>
  );
}
```

### Loading Skeletons

Create skeleton components alongside each data-fetching component:

```tsx
// components/skeletons/bank-list-skeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";

export function BankListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-16 w-full rounded-lg" />
      ))}
    </div>
  );
}
```

### React Compiler Note

The React Compiler is enabled — do **not** add manual `useMemo`, `useCallback`, or `React.memo`. The compiler handles memoization automatically. Adding these manually may conflict with the compiler's output.

---

## 21. Naming Conventions (Extended)

This section extends the quick-reference table in Section 8 with additional context.

### File Naming

| Pattern | Convention | Notes |
| --- | --- | --- |
| DAL files | `user.dal.ts` | Dot-separated, not hyphen |
| Action files | `user.actions.ts` | Dot-separated |
| Component files | `bank-card.tsx` | Hyphen-separated |
| Hook files | `use-bank.ts` | Prefixed with `use-` |
| Type files | `index.ts` in `types/` | Central barrel |
| Test files | `register.test.ts` | `.test.ts` for Vitest |
| E2E files | `auth.spec.ts` | `.spec.ts` for Playwright |
| Plan files | `<task>_<8id>.plan.md` | See Section 26 |

### Variable & Function Naming

```typescript
// Server Action — verb first
export async function createRecipient(input: unknown) { ... }
export async function deleteRecipient(input: unknown) { ... }
export async function getRecentTransactions() { ... }

// DAL method — verb first
async findByEmail(email: string) { ... }
async findAllWithBanks() { ... }
async countAll() { ... }

// React component — noun (PascalCase)
export function PaymentTransferForm() { ... }
export function BankAccountCard() { ... }

// Boolean variables — is/has/should prefix
const isLoading = false;
const hasError = !!error;
const shouldRedirect = !session;

// Event handlers — handle prefix
function handleSubmit() { ... }
function handleBankSelect(bankId: string) { ... }
```

### Zod Schema Naming

```typescript
// Always PascalCase + Schema suffix
const RegisterUserSchema = z.object({ ... });
const CreateTransferSchema = z.object({ ... });
const UpdateProfileSchema = z.object({ ... });

// Inferred types — PascalCase without Schema suffix
type RegisterUserInput = z.infer<typeof RegisterUserSchema>;
type CreateTransferInput = z.infer<typeof CreateTransferSchema>;
```

---

## 22. Cursor Rules (12 Files)

All rules live in `.cursor/rules/`. There are 8 canonical enforcement rules and 4 pointer/index rules.

### Canonical Enforcement Rules (8)

| File | Purpose |
| --- | --- |
| `banking-coding-standards.mdc` | Core standards: no `any`, env via `lib/env.ts`, Server Actions for mutations, no N+1 |
| `typescript-no-any.mdc` | Enforce `unknown` + type guards over `any` |
| `env-access-via-lib-env.mdc` | Require `lib/env.ts` for all env var access |
| `mutations-via-server-actions.mdc` | Route all mutations through Server Actions |
| `no-n-plus-one-queries.mdc` | Prevent N+1 with eager loading / JOINs |
| `workflow-and-steps.mdc` | 9-step task workflow; plan threshold (3+ files); validation checklist |
| `plan-file-standards.mdc` | Plan naming, location, required sections, lint requirements |
| `kill-port-3000-before-tests.mdc` | Kill port 3000 before every Playwright/Vitest run |

### Pointer/Index Rules (4)

These files exist only to reference the canonical rules above — they contain no enforcement logic of their own.

| File | Points To |
| --- | --- |
| `project-coding-standards.mdc` | `banking-coding-standards.mdc`, `typescript-no-any.mdc`, `env-access-via-lib-env.mdc`, `mutations-via-server-actions.mdc`, `no-n-plus-one-queries.mdc` |
| `project-documentation-style.mdc` | `workflow-and-steps.mdc`, `plan-file-standards.mdc` |
| `project-testing-validation.mdc` | `workflow-and-steps.mdc`, `AGENTS.md`, `kill-port-3000-before-tests.mdc` |
| `project-workflow-process.mdc` | `workflow-and-steps.mdc` |

### Workflow Rule Summary (`workflow-and-steps.mdc`)

The 9-step required sequence for every task:

1. Understand the request and define the expected outcome
2. Inspect relevant files and existing patterns before editing
3. If the change touches more than 3 files, propose a plan first
4. Save that plan in `.cursor/plans/` before implementation
5. Plan minimal, safe changes aligned with project standards
6. Implement changes in small, focused edits
7. Verify behavior with targeted checks or tests
8. Confirm no regressions in touched areas
9. Summarize what changed, why it changed, and how it was validated

### Plan File Standards (`plan-file-standards.mdc`)

When a task touches more than 3 files, create a plan before coding.

**Location:** `.cursor/plans/`

**Naming:** `<short-kebab-task>_<8-char-id>.plan.md`

**Required sections:**

```markdown
# <Plan Title>

## Goals

## Scope

## Target Files

## Risks

## Planned Changes

## Validation

## Rollback or Mitigation
```

**Quality rules:**

- Specific, testable, implementation-ready
- Each planned change maps to at least one verification step
- Call out assumptions and blockers before coding
- Run markdown lint on every plan file before starting

---

## 23. External Documentation

Quick reference links for all major dependencies.

### Framework & Runtime

| Technology     | Documentation URL                   |
| -------------- | ----------------------------------- |
| Next.js 16     | https://nextjs.org/docs             |
| React 19       | https://react.dev                   |
| TypeScript 5.5 | https://www.typescriptlang.org/docs |

### Database & ORM

| Technology | Documentation URL |
| --- | --- |
| Drizzle ORM | https://orm.drizzle.team/docs/overview |
| Drizzle Kit (migrations) | https://orm.drizzle.team/kit-docs/overview |
| Neon Postgres | https://neon.tech/docs/introduction |

### Authentication

| Technology | Documentation URL |
| --- | --- |
| NextAuth.js v4 | https://next-auth.js.org/getting-started/introduction |
| NextAuth.js Providers | https://next-auth.js.org/providers |

### Financial APIs

| Technology | Documentation URL |
| --- | --- |
| Plaid API | https://plaid.com/docs |
| Plaid Quickstart | https://plaid.com/docs/quickstart |
| Dwolla API | https://developers.dwolla.com/docs |
| Dwolla Transfers | https://developers.dwolla.com/docs/balance/send-money |

### UI & Styling

| Technology           | Documentation URL                     |
| -------------------- | ------------------------------------- |
| shadcn/ui            | https://ui.shadcn.com/docs            |
| shadcn/ui Components | https://ui.shadcn.com/docs/components |
| Tailwind CSS v4      | https://tailwindcss.com/docs          |

### Validation & Forms

| Technology          | Documentation URL                            |
| ------------------- | -------------------------------------------- |
| Zod v4              | https://zod.dev                              |
| React Hook Form     | https://react-hook-form.com/docs             |
| @hookform/resolvers | https://github.com/react-hook-form/resolvers |

### Testing

| Technology | Documentation URL                 |
| ---------- | --------------------------------- |
| Vitest     | https://vitest.dev/guide          |
| Playwright | https://playwright.dev/docs/intro |

### Caching & Rate Limiting

| Technology | Documentation URL |
| --- | --- |
| Upstash Redis | https://upstash.com/docs/redis/overall/getstarted |
| Upstash Ratelimit | https://upstash.com/docs/redis/sdks/ratelimit/overview |

---

## 24. GitHub Instructions & Prompts

Configuration files for GitHub Copilot and Copilot Chat reside in `.github/`.

### Instructions (23 Files — `.github/instructions/`)

These files provide context and rules to GitHub Copilot agents for specific file patterns and task types.

| Category | File Pattern | Purpose |
| --- | --- | --- |
| Core Standards | `coding-standards.instructions.md` | No `any`, env via lib/env.ts, PR-blocking rules |
| Next.js | `nextjs-patterns.instructions.md` | App Router, async APIs, Cache Components |
| Server Actions | `server-actions.instructions.md` | Mutation patterns, auth checks, Zod validation |
| DAL | `dal-patterns.instructions.md` | DAL usage, N+1 prevention, transactions |
| Auth | `auth-patterns.instructions.md` | NextAuth v4, session checks, role gates |
| Encryption | `encryption.instructions.md` | AES-256-GCM, sensitive field handling |
| Database | `database-schema.instructions.md` | 10 tables, Drizzle ORM patterns |
| Validation | `validation.instructions.md` | Zod v4 schemas, form validation |
| Testing | `testing.instructions.md` | Vitest, Playwright, fixture patterns |
| UI | `ui-components.instructions.md` | shadcn/ui, Tailwind v4, form patterns |
| Security | `security.instructions.md` | Headers, CSRF, password hashing |
| Plaid | `plaid-integration.instructions.md` | PlaidLink, token exchange, account sync |
| Dwolla | `dwolla-integration.instructions.md` | ACH transfers, funding sources |
| Naming | `naming-conventions.instructions.md` | File, variable, schema naming |
| TypeScript | `typescript-strict.instructions.md` | Strict mode, type guards, return types |
| Import Order | `import-order.instructions.md` | Canonical import ordering |
| Middleware | `middleware.instructions.md` | Known bug + correct pattern |
| Environment | `environment-variables.instructions.md` | 27 vars, lib/env.ts usage |
| Workflow | `workflow-process.instructions.md` | 9-step task sequence, plan threshold |
| Components | `component-patterns.instructions.md` | Server vs client, Suspense, skeletons |
| Cursor Rules | `cursor-rules.instructions.md` | 12 rule files index |
| MCP | `mcp-servers.instructions.md` | 6 MCP servers, opencode.json |
| General | `general.instructions.md` | Project overview, tech stack summary |

### Prompts (19 Files — `.github/prompts/`)

Reusable prompt templates for common development workflows.

| File | Purpose |
| --- | --- |
| `create-server-action.prompt.md` | Scaffold a new Server Action with auth + Zod |
| `create-dal-method.prompt.md` | Add a new DAL method to an existing class |
| `create-component.prompt.md` | Scaffold a new React component (server or client) |
| `create-form.prompt.md` | Full form with React Hook Form + Zod + shadcn/ui |
| `create-test.prompt.md` | Vitest unit test for a Server Action or DAL method |
| `create-e2e-test.prompt.md` | Playwright E2E test for a user flow |
| `fix-type-error.prompt.md` | Resolve TypeScript strict mode errors |
| `fix-lint-error.prompt.md` | Fix ESLint warnings for PR compliance |
| `add-auth-check.prompt.md` | Add session + role check to an existing action |
| `add-zod-validation.prompt.md` | Add Zod schema to an unvalidated input |
| `fix-n-plus-one.prompt.md` | Refactor N+1 query to use JOIN or eager loading |
| `encrypt-sensitive-field.prompt.md` | Add AES encryption to a new sensitive DB field |
| `add-plaid-integration.prompt.md` | Extend Plaid integration with a new API call |
| `add-dwolla-integration.prompt.md` | Extend Dwolla integration with a new operation |
| `add-shadcn-component.prompt.md` | Install and wire up a new shadcn/ui component |
| `write-migration.prompt.md` | Generate Drizzle migration for schema changes |
| `write-plan.prompt.md` | Draft a plan file for a multi-file task |
| `review-pr.prompt.md` | Review a PR against project coding standards |
| `debug-session.prompt.md` | Debug authentication and session issues |

---

## 25. OpenCode Skills (10 Total)

Skills are loaded by OpenCode to inject domain-specific instructions at task time. Located in `.opencode/skills/`.

| # | Skill | File | When to Load |
| --- | --- | --- | --- |
| 1 | **AuthSkill** | `auth-skill/SKILL.md` | Working with auth, sessions, login flows |
| 2 | **DBSkill** | `db-skill/SKILL.md` | Database schema, Drizzle ORM, migrations, N+1 |
| 3 | **DeploymentSkill** | `deployment-skill/SKILL.md` | Vercel, Docker, Railway, CI/CD pipelines |
| 4 | **DwollaSkill** | `dwolla-skill/SKILL.md` | ACH transfers, payment processing, Dwolla API |
| 5 | **PlaidSkill** | `plaid-skill/SKILL.md` | PlaidLink, bank connections, financial data |
| 6 | **SecuritySkill** | `security-skill/SKILL.md` | Encryption, input sanitization, CSRF, headers |
| 7 | **ServerActionSkill** | `server-action-skill/SKILL.md` | Server Actions, mutations, form handling |
| 8 | **shadcn** | `shadcn/SKILL.md` | shadcn/ui components, component registry |
| 9 | **TestingSkill** | `testing-skill/SKILL.md` | Vitest, Playwright, unit and E2E tests |
| 10 | **UISkill** | `ui-skill/SKILL.md` | shadcn/ui patterns, Tailwind CSS, forms |
| 11 | **ValidationSkill** | `validation-skill/SKILL.md` | Zod schemas, form validation, type-safe data |

> Note: 11 skills exist in the directory (UISkill and ValidationSkill are separate); the registry lists 10 primary skills.

### OpenCode Configuration

```json
// opencode.json (partial)
{
  "model": "github-copilot/claude-sonnet-4.6",
  "mcp": { ... }
}
```

**OpenCode Model:** `github-copilot/claude-sonnet-4.6`

---

## 26. Cursor Agents (4 Total)

Cursor agent configurations live in `.cursor/agents/`. These define specialized agent personas for different task types.

| # | Agent | Purpose |
| --- | --- | --- |
| 1 | **plan** | Review requirements, inspect codebase, produce implementation plan |
| 2 | **build** | Implement features following project standards and the current plan |
| 3 | **review** | Review code changes against PR-blocking rules and coding standards |
| 4 | **debug** | Diagnose runtime errors, type errors, and failed tests |

### Agent Usage in Cursor

Agents are invoked by selecting them from the Cursor agent picker or by referencing them in the `@agent` mention syntax.

---

## 27. Known Technical Debt

All items below are tracked issues that violate project standards but have not yet been resolved.

| # | Location | Issue | Severity |
| --- | --- | --- | --- |
| 1 | `lib/dal/base.dal.ts` | All 3 base functions use `table: any` — violates no-`any` rule | Medium |
| 2 | `lib/actions/admin.actions.ts` | `toggleAdmin` and `setActive` have no `auth()` check — unauthenticated callers can invoke them | **Critical** |
| 3 | `lib/actions/updateProfile.ts` | `updateProfile` reads `userId` from client-supplied `input` instead of the session | **Critical** |
| 4 | `lib/actions/plaid.actions.ts` | `getAllBalances()` calls `getBalance()` per bank in a loop — N+1 pattern | Medium |
| 5 | `app/middleware.ts` | Middleware is at `app/middleware.ts` instead of root `middleware.ts` — does not execute | **Critical** |

### Debt Item Details

#### Debt #1 — `base.dal.ts` uses `any`

```typescript
// Current (violates no-any rule)
export async function findById(
  table: any,
  id: string
): Promise<unknown>;

// Required fix: replace table: any with proper Drizzle generic type
```

#### Debt #2 — `admin.actions.ts` missing auth check

```typescript
// Current — no auth guard
export async function toggleAdmin(input: unknown) {
  const parsed = ToggleAdminSchema.safeParse(input);
  // immediately proceeds to DB mutation
}

// Required fix: add auth() check + admin role gate at the top
```

#### Debt #3 — `updateProfile.ts` trusts client userId

```typescript
// Current — userId comes from client input, not session
export async function updateProfile(input: unknown) {
  const parsed = UpdateProfileSchema.safeParse(input);
  await userDal.updateProfile(parsed.data.userId, ...); // userId from client ← insecure
}

// Required fix: extract userId from auth() session, ignore input.userId
```

#### Debt #4 — `getAllBalances()` N+1

```typescript
// Current — calls getBalance() for each bank
for (const bank of banks) {
  const balance = await getBalance({ bankId: bank.id }); // N queries
}

// Required fix: batch fetch balances in a single Plaid call where possible
```

#### Debt #5 — Middleware wrong location

```
// Current
app/middleware.ts        ← not loaded by Next.js

// Required fix: move to
middleware.ts            ← project root
```

---

## 28. Sync Checklist

Use this checklist when updating `AGENTS.md` to keep it accurate with the codebase.

### When to Update AGENTS.md

- [ ] New table added to `database/schema.ts`
- [ ] New Server Action file or exported function added
- [ ] New DAL file or method added
- [ ] New environment variable added to `lib/env.ts`
- [ ] New Cursor rule file added to `.cursor/rules/`
- [ ] New OpenCode skill added to `.opencode/skills/`
- [ ] New GitHub instruction or prompt file added to `.github/`
- [ ] New MCP server added to `opencode.json`
- [ ] Known technical debt resolved (remove from Section 27)
- [ ] New known debt introduced (add to Section 27)
- [ ] `package.json` scripts changed
- [ ] Auth providers changed in `lib/auth-options.ts`

### Sections Most Likely to Drift

| Section | Drift Source | Verification Command |
| --- | --- | --- |
| Section 2 — Commands | `package.json` scripts | `npm run` |
| Section 3 — Env Vars | `lib/env.ts` | Read `lib/env.ts` directly |
| Section 10 — Server Actions | `lib/actions/**` | Count exported functions |
| Section 11 — DAL | `lib/dal/**` | Count public methods |
| Section 15 — Schema | `database/schema.ts` | Count table exports |
| Section 22 — Cursor Rules | `.cursor/rules/` | `ls .cursor/rules/*.mdc` |
| Section 27 — Known Debt | Code review / bug tracker | Manual audit |

### Validation Before Committing AGENTS.md

```bash
# Ensure markdown formatting is clean
npm run format:check

# Confirm section count matches header
grep "^## [0-9]" AGENTS.md | wc -l
# Expected: 28
```

---

## Appendix A — Quick Reference

### Most-Used Import Paths

```typescript
import { env } from "@/lib/env";
import { auth } from "@/lib/auth";
import { db } from "@/database/db";
import {
  userDal,
  bankDal,
  transactionDal,
  recipientDal,
  dwollaDal
} from "@/lib/dal";
import { encrypt, decrypt } from "@/lib/encryption";
import { plaidClient } from "@/lib/plaid";
import { dwollaClient } from "@/lib/dwolla";
```

### Result Type — Copy-Paste Template

```typescript
type Result<T = void> =
  | { ok: true; data?: T }
  | { ok: false; error: string };
```

### Server Action — Minimum Viable Template

```typescript
"use server";

import { z } from "zod";
import { auth } from "@/lib/auth";

const Schema = z.object({ id: z.string().min(1) });

export async function myAction(
  input: unknown
): Promise<{ ok: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "Unauthorized" };

  const parsed = Schema.safeParse(input);
  if (!parsed.success)
    return { ok: false, error: parsed.error.message };

  try {
    // mutation here
    return { ok: true };
  } catch {
    return { ok: false, error: "Operation failed" };
  }
}
```

### Schema — 10 Tables at a Glance

```
users              → Core identity (NextAuth + app)
account            → OAuth provider links (NextAuth)
session            → JWT sessions (NextAuth)
verificationToken  → Email verification (NextAuth)
authenticator      → WebAuthn/passkeys (NextAuth)
user_profiles      → Extended profile (bio, avatar, prefs)
banks              → Linked accounts (accessToken encrypted)
transactions       → Transaction history
recipients         → ACH transfer recipients
errors             → App error log
```

### Port Guard — One-Liner

```powershell
$pids = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique; if ($pids) { $pids | ForEach-Object { Stop-Process -Id $_ -Force } }
```
