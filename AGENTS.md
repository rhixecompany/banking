# AGENTS.md — Banking Project Canonical Reference

**Last Generated:** April 4, 2026 | **Version:** 5.3

---

## Changelog

### April 4, 2026 — v5.3

- Updated Section 12 (DAL): Removed reference to deleted `base.dal.ts`
- Updated Section 19 (Tech Debt): Debt #1, #4, #5, #6 now marked as Resolved (files deleted, N+1 cached)

### April 3, 2026 — v5.2

- Condensed from 2,458 lines to ~900 lines while preserving all critical accuracy
- No content changes; all facts verified against source files in this session

### April 2, 2026 — v5.1

- Added missing `server-action-skill.md` flat file to skills table
- Added known inaccuracy note for `04-auth-testing.md`: `session.user.role` does not exist — correct field is `isAdmin: boolean`
- Confirmed `generate:action`, `generate:component`, `generate:dal`, `generate:feature` exist; confirmed `banking:validate` / `banking:generate` do NOT exist

### April 2, 2026 — v5.0

- Full rewrite correcting session shape, env vars, script names, ESLint rules, schema fields

---

## Table of Contents

1. Tech Stack
2. Commands (All 65 Scripts)
3. Environment Variables
4. PR-Blocking Rules
5. TypeScript & Type Safety
6. ESLint Configuration
7. Prettier Configuration
8. Next.js 16 Patterns
9. Cache Components
10. Suspense & Async APIs
11. Server Actions
12. Data Access Layer
13. Authentication
14. Database Schema
15. Validation (Zod v4)
16. Forms & UI
17. Testing
18. Security
19. Known Technical Debt
20. Integrations
21. Cursor Rules
22. GitHub Copilot Instructions
23. OpenCode Skills & Instructions

---

## 1. Tech Stack

| Technology | Version | Purpose |
| --- | --- | --- |
| **Next.js** | 16.2.2 | App Router, RSC, Cache Components |
| **React** | 19 | UI (React Compiler enabled — no manual memoization) |
| **TypeScript** | 6.0.2 | Strict mode, typed routes |
| **PostgreSQL** | via Neon | Relational database |
| **Drizzle ORM** | 0.45.2 | Type-safe SQL + schema management |
| **NextAuth.js** | v4.24.13 | JWT sessions, OAuth, credentials auth |
| **AES-256-GCM** | — | Symmetric encryption for sensitive fields |
| **shadcn/ui** | latest | Accessible UI components |
| **Tailwind CSS** | v4 | CSS-based config via `@theme` in globals.css |
| **React Hook Form** | latest | Form state management |
| **Zod** | v4.3.6 | Runtime validation + type inference |
| **Vitest** | 4.1.2 | Unit/integration testing (happy-dom) |
| **Playwright** | 1.59.1 | E2E browser automation (Chromium) |
| **bcryptjs** | latest | Password hashing |

**Special features:** React Compiler (auto-memoization), Cache Components (`"use cache"`), Typed Routes, Turbopack (default dev bundler), Security Headers.

**Integrations:** Plaid (bank linking), Dwolla (ACH transfers), Upstash Redis (rate limiting, optional), SMTP (email, optional), GitHub/Google OAuth.

---

## 2. Commands (All 65 Scripts)

### Development

```bash
npm run dev              # Dev server (Turbopack, localhost:3000)
npm run dev:sh           # Dev via shell script
npm run build            # Production build (prebuild: clean + type-check)
npm run build:analyze    # Bundle analyzer (ANALYZE=true)
npm run build:standalone # Standalone output (NEXT_OUTPUT_MODE=standalone)
npm run build:debug      # Debug prerender build
npm run start            # Start production server
npm run clean            # Clean .next out dist build .turbo coverage
npm run clean:all        # Full clean (also removes node_modules + lockfile)
npm run clean:cache      # Cache-only clean
```

> `predev` and `prebuild` both run `clean && type-check` automatically. `postbuild` runs `next-sitemap` automatically after every build. `pretest` runs `clean && type-gen` (next typegen — NOT type-check).

### Validation

```bash
npm run validate         # format:check + type-check + lint:strict + test
npm run format           # Auto-format with Prettier (WRITES FILES)
npm run format:check     # Runs format (writes!) THEN checks — NOT read-only
npm run type-check       # tsc --noEmit --pretty
npm run type-check:watch # TypeScript watch mode
npm run lint             # ESLint (warnings allowed)
npm run lint:fix         # ESLint auto-fix
npm run lint:fix:all     # ESLint all fix types
npm run lint:strict      # ESLint (zero warnings — PR-blocking)
```

> **CRITICAL:** `format:check` is **destructive** — it runs `format` first (writes files), then checks. It is NOT a read-only check.

### Database

```bash
npm run db:push          # Push schema to DB (no migration file)
npm run db:migrate       # Run pending migrations
npm run db:generate      # Generate migration from schema diff
npm run db:check         # Check schema/migration consistency
npm run db:studio        # Drizzle Studio GUI (localhost:8000)
npm run db:seed          # Seed with test data
npm run db:reset         # db:drop + db:generate + db:push (does NOT seed)
npm run db:drop          # Drop all tables
npm run db:pull          # Introspect DB schema
```

### Testing

```bash
npm run test             # test:browser && test:ui (sequential)
npm run test:browser     # Vitest unit/integration tests
npm run test:ui          # Playwright E2E (Chromium, 1 worker)
npm run test:ui:codegen  # Playwright codegen
npm run test:ui:report   # Show last Playwright HTML report
```

### Code Generation

```bash
npm run type-gen              # next typegen (typed routes)
npm run generate:action       # Scaffold a new Server Action
npm run generate:component    # Scaffold a new React component
npm run generate:dal          # Scaffold a new DAL file
npm run generate:feature      # Scaffold full feature
```

### Single Test Execution

```bash
npm exec vitest run tests/unit/register.test.ts
npm exec playwright test tests/e2e/auth.spec.ts
npm exec playwright test --grep "sign-in"
```

> **Always free port 3000 before running tests** (see Section 21 Cursor Rules).

---

## 3. Environment Variables (24 Total)

All env vars validated via `lib/env.ts`. **Never read `process.env` directly — always import from `lib/env.ts`.**

| # | Variable | Required | Purpose |
| --- | --- | --- | --- |
| 1 | `ENCRYPTION_KEY` | Yes | AES-256-GCM key |
| 2 | `NEXTAUTH_SECRET` | Yes | Session signing key |
| 3 | `NODE_ENV` | Default: `"production"` | Runtime environment |
| 4 | `PORT` | Default: `3000` | HTTP port |
| 5 | `HOSTNAME` | Default: `"0.0.0.0"` | HTTP hostname |
| 6 | `NEXT_PUBLIC_SITE_URL` | Default: `"http://localhost:3000"` | Public URL |
| 7 | `DATABASE_URL` | Optional | PostgreSQL connection string |
| 8 | `PLAID_CLIENT_ID` | Optional | Plaid API client ID |
| 9 | `PLAID_SECRET` | Optional | Plaid API secret |
| 10 | `PLAID_ENV` | Optional | `"sandbox"` or `"production"` |
| 11 | `PLAID_BASE_URL` | Optional | Plaid base URL override |
| 12 | `DWOLLA_KEY` | Optional | Dwolla API key |
| 13 | `DWOLLA_SECRET` | Optional | Dwolla API secret |
| 14 | `DWOLLA_ENV` | Optional | `"sandbox"` or `"production"` |
| 15 | `DWOLLA_BASE_URL` | Optional | Dwolla base URL override |
| 16 | `AUTH_GITHUB_ID` | Optional | GitHub OAuth client ID |
| 17 | `AUTH_GITHUB_SECRET` | Optional | GitHub OAuth secret |
| 18 | `AUTH_GOOGLE_ID` | Optional | Google OAuth client ID |
| 19 | `AUTH_GOOGLE_SECRET` | Optional | Google OAuth secret |
| 20 | `NEXTAUTH_URL` | Optional | Canonical URL for NextAuth callbacks |
| 21 | `SMTP_HOST` | Optional | SMTP hostname |
| 22 | `SMTP_PORT` | Optional | SMTP port |
| 23 | `SMTP_USER` | Optional | SMTP username |
| 24 | `SMTP_PASS` | Optional | SMTP password (**not** `SMTP_PASSWORD`) |

`REDIS_URL` — Upstash Redis. If absent, rate limiting is silently skipped.

```typescript
// BAD — never do this
const key = process.env.ENCRYPTION_KEY;

// GOOD
import { env } from "@/lib/env";
const key: string = env.ENCRYPTION_KEY;
```

---

## 4. PR-Blocking Rules

| # | Rule | Enforcement |
| --- | --- | --- |
| 1 | No `any` types — use `unknown` + type guards | TypeScript strict + code review |
| 2 | No N+1 queries — use JOINs / eager loading | Code review |
| 3 | No raw `process.env` — use `lib/env.ts` | ESLint `no-restricted-syntax` (error) |
| 4 | Mutations via Server Actions only — never API routes | Code review |
| 5 | Zero TypeScript errors | CI (`npm run type-check`) |
| 6 | Zero lint warnings | CI (`npm run lint:strict`) |
| 7 | All tests pass | CI (`npm run test`) |

---

## 5. TypeScript & Type Safety

Strict mode (`tsconfig.json`): `strictNullChecks`, `noImplicitAny`, `strictFunctionTypes`, etc.

```typescript
// Type guard pattern
interface HasEmail {
  email: string;
}
function hasEmail(input: unknown): input is HasEmail {
  return (
    typeof input === "object" &&
    input !== null &&
    "email" in input &&
    typeof (input as HasEmail).email === "string"
  );
}

// Result type — all Server Actions return this shape
type Result<T = void> =
  | { ok: false; error: string }
  | { ok: true; data?: T };
```

> **ESLint note:** `@typescript-eslint/no-explicit-any` is `"off"`. The no-`any` rule is enforced by TypeScript's `noImplicitAny` and code review. Explicit `any` casts are discouraged but not ESLint-blocked. Use `unknown` for all new code.

---

## 6. ESLint Configuration

**`noInlineConfig: true` — CRITICAL:** Inline `// eslint-disable` comments have **NO EFFECT** anywhere. The only way to suppress a rule is to modify `eslint.config.mts`.

### Key Rules — Errors

`no-var`, `prefer-const`, `curly`, `no-debugger`, `no-unreachable`, `security/detect-eval-with-expression`, `security/detect-non-literal-fs-filename`, `security/detect-unsafe-regex`, `unicorn/prefer-includes`, `unicorn/throw-new-error`, `unicorn/filename-case`, `zod/no-any-schema`, `zod/require-error-message`, `drizzle/enforce-delete-with-where`, `drizzle/enforce-update-with-where`

### Key Rules — Warnings (errors under `lint:strict`)

`@typescript-eslint/explicit-function-return-type`, `import/order`, `react-hooks/exhaustive-deps`

### Active Plugins

`@typescript-eslint`, `better-tailwindcss`, `drizzle`, `import-x`, `jest`, `perfectionist`, `playwright`, `react`, `react-hooks`, `security`, `sonarjs`, `testing-library`, `unicorn`, `vitest`, `zod`

---

## 7. Prettier Configuration

File: `.prettierrc.ts` | `printWidth: 80` | `singleQuote: false` | `trailingComma: "all"` | `endOfLine: "lf"`

Plugins: `prettier-plugin-tailwindcss`, `prettier-plugin-organize-imports`, `prettier-plugin-packagejson`, `prettier-plugin-sort-json`

---

## 8. Next.js 16 Patterns

### Project Structure

```
app/
├── (auth)/                    # Unauthenticated routes (sign-in, sign-up)
├── (root)/                    # Protected routes (auth guard layout)
│   ├── dashboard/
│   ├── my-banks/
│   ├── payment-transfer/
│   ├── settings/
│   └── transaction-history/
├── api/auth/[...nextauth]/    # NextAuth handler
└── layout.tsx

lib/
├── actions/                   # Server Actions (mutations only)
├── dal/                       # Data Access Layer
├── auth.ts                    # re-exports auth() helper
├── auth-options.ts            # NextAuth config (JWT — ACTIVE)
├── auth-config.ts             # DEBT #6: conflicting config (database strategy)
├── encryption.ts              # AES-256-GCM
├── email.ts                   # SMTP sender
├── env.ts                     # Zod-validated env vars
└── rate-limit.ts              # Upstash Redis rate limiting

database/
├── db.ts                      # Drizzle client
└── schema.ts                  # All table definitions
```

### Server vs Client Components

```tsx
// Server Component (default) — data fetching, non-interactive UI
export default async function DashboardPage(): Promise<React.JSX.Element> {
  const result = await getUserBanks();
  if (!result.ok) return <div>Error</div>;
  return <BankList banks={result.banks ?? []} />;
}

// Client Component — add "use client" for hooks/interactivity
("use client");
export function TransferForm(): React.JSX.Element {
  const [amount, setAmount] = useState("");
  return (
    <input value={amount} onChange={e => setAmount(e.target.value)} />
  );
}
```

### Page Component Signature (Next.js 16)

```tsx
// params and searchParams are Promises in Next.js 16
export default async function Page({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}): Promise<React.JSX.Element> {
  const { id } = await params;
  const { page } = await searchParams;
  // ...
}
```

---

## 9. Cache Components (Next.js 16)

```typescript
"use cache";
import { cacheLife } from "next/dist/server/use-cache/cache-life";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";

cacheLife("hours"); // profiles: seconds | minutes | hours | days | weeks | max
cacheTag("banks");

export async function getCachedBanks(userId: string) {
  return getUserBanks(userId);
}
```

```typescript
// Revalidation — use updateTag in Server Actions (immediate)
import { unstable_updateTag as updateTag } from "next/cache";
updateTag("banks");

// Use revalidateTag for background (stale-while-revalidate)
import { revalidateTag } from "next/cache";
revalidateTag("banks");
```

Rules: cache functions must be `async`; cannot use `cookies()`/`headers()` directly — pass as arguments; use `updateTag()` after mutations.

---

## 10. Suspense & Async APIs

`cookies()`, `headers()`, `params`, `searchParams`, and `getServerSession()` are **async** in Next.js 16. Wrap in `<Suspense>`.

```tsx
// app/(root)/layout.tsx
async function AuthGuard({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/sign-in");
  return <>{children}</>;
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthGuard>{children}</AuthGuard>
    </Suspense>
  );
}
```

Use `loading.tsx` for automatic Suspense at the route level.

---

## 11. Server Actions

All mutations must be Server Actions. Never put mutation logic in API routes.

```typescript
"use server";
import {
  revalidatePath,
  unstable_updateTag as updateTag
} from "next/cache";
import { z } from "zod";

import { auth } from "@/lib/auth";

const InputSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name too long")
    .meta({ description: "User name" })
});

export async function doSomething(
  input: unknown
): Promise<{ ok: boolean; error?: string }> {
  const parsed = InputSchema.safeParse(input);
  if (!parsed.success)
    return { error: parsed.error.message, ok: false };

  const session = await auth();
  if (!session?.user) return { error: "Unauthorized", ok: false };
  if (!session.user.isAdmin) return { error: "Forbidden", ok: false };

  try {
    await someDAL.create(parsed.data);
    revalidatePath("/relevant-path");
    updateTag("relevant-tag");
    return { ok: true };
  } catch {
    return { error: "Server error", ok: false };
  }
}
```

### Action Inventory (key signatures)

| Action | Return Type | Notes |
| --- | --- | --- |
| `getLoggedInUser()` | `Promise<{ name?, email? } \| undefined>` | Returns `undefined` (not `null`) when unauthenticated |
| `logoutAccount()` | `Promise<boolean>` | `true` on success |
| `registerUser(input)` | `Promise<{ ok, user?, error? }>` | Also exported as `register` |
| `updateProfile(input)` | `Promise<{ ok, error? }>` | userId from session only |
| `toggleAdmin(input)` | `Promise<{ ok, error? }>` | Requires `isAdmin` |
| `setActive(input)` | `Promise<{ ok, error? }>` | Requires `isAdmin` |
| `getUserBanks()` | `Promise<{ ok, banks?, error? }>` |  |
| `disconnectBank(bankId)` | `Promise<{ ok, error? }>` | Validates BEFORE auth — intentional |
| `createLinkToken(input)` | `Promise<{ ok, linkToken?, error? }>` |  |
| `exchangePublicToken(input)` | `Promise<{ ok, bank?, error? }>` |  |
| `createTransfer(input)` | `Promise<{ ok, transferUrl?, error? }>` |  |
| `getRecentTransactions(limit?)` | `Promise<{ ok, transactions?, error? }>` | Default limit: 10 |
| `getTransactionHistory(page?, pageSize?)` | `Promise<{ ok, transactions?, error? }>` | Default: page 1, size 20 |

---

## 12. Data Access Layer

All DB access through `lib/dal/`. Never query from Server Actions or components directly.

```typescript
// lib/dal/user.dal.ts
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

  async create(
    data: Omit<User, "createdAt" | "id" | "updatedAt">
  ): Promise<User> {
    const [user] = await db.insert(users).values(data).returning();
    return user;
  }
}
export const userDal = new UserDal();
```

**N+1 Prevention — CRITICAL:** Never query inside a loop. Use JOINs:

```typescript
// BAD
for (const bank of banks) {
  const txns = await transactionDal.findByBankId(bank.id); // N+1!
}

// GOOD
const banksWithTxns = await db
  .select({ bank: banks, transaction: transactions })
  .from(banks)
  .leftJoin(transactions, eq(banks.id, transactions.senderBankId))
  .where(eq(banks.userId, userId));
```

**Upsert:**

```typescript
await db
  .insert(userProfiles)
  .values({ address, userId })
  .onConflictDoUpdate({
    set: { address, updatedAt: sql`now()` },
    target: userProfiles.userId
  });
```

**Transactions:**

```typescript
await db.transaction(async tx => {
  await tx.insert(banks).values({ ...bankData });
  await tx.insert(transactions).values({ ...txData });
});
```

---

## 13. Authentication

### Auth Config Debt (CRITICAL — See Debt #6)

Two conflicting configs exist: `lib/auth-options.ts` (JWT — **Active**) and `lib/auth-config.ts` (database strategy — **Conflicting**).

### Session Shape (confirmed ground truth)

```typescript
// types/next-auth.d.ts
interface Session {
  user: {
    id: string;
    name?: null | string;
    email?: null | string;
    image?: null | string;
    isAdmin: boolean; // boolean — NO `role` field on session
    isActive: boolean;
  };
}
```

### Auth Check Pattern

```typescript
"use server";
import { auth } from "@/lib/auth";

export async function protectedAction(
  input: unknown
): Promise<{ ok: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized", ok: false };
  if (!session.user.isAdmin) return { error: "Forbidden", ok: false };
  // ...
}
```

### Auth Mock Pattern (Tests)

```typescript
// CORRECT — use undefined, NOT null for unauthenticated
vi.mock("@/lib/auth", () => ({
  auth: vi.fn().mockResolvedValue(undefined)
}));

vi.mocked(auth).mockResolvedValue({
  expires: new Date(Date.now() + 86400000).toISOString(),
  user: {
    email: "test@example.com",
    id: "user-123",
    isActive: true,
    isAdmin: false
  }
});
```

---

## 14. Database Schema

Schema in `database/schema.ts`. Ten tables + `userRole` enum (`"user"`, `"admin"`, `"moderator"`).

> The `role` enum field is on the `users` DB table only — **NOT** on the session. Sessions use `isAdmin: boolean` / `isActive: boolean`.

### Key Tables

**`users`:** `id`, `email` (unique), `name`, `password`, `image`, `role` (DB only), `isAdmin` (default false), `isActive` (default true), `createdAt`, `updatedAt`

**`user_profiles`:** `id`, `userId` (FK), `address`, `city`, `state`, `postalCode`, `phone`, `dateOfBirth`

**`banks`:** `id`, `userId` (FK), `accessToken` (encrypted Plaid token), `accountId`, `accountNumberEncrypted` (AES-256-GCM), `accountSubtype`, `accountType`, `institutionId`, `institutionName`, `routingNumber`, `sharableId` (unique), `dwollaCustomerUrl`, `dwollaFundingSourceUrl`, `fundingSourceUrl`

**`transactions`:** `id`, `userId` (FK), `senderBankId` (FK banks), `receiverBankId` (FK banks), `amount` (numeric 12,2), `name`, `email`, `category`, `channel`, `currency` (default USD), `status` (default pending), `type`, `plaidTransactionId` (uniqueIndex), `createdAt`, `updatedAt`

**`recipients`:** `id`, `userId` (FK), `email`, `name`, `bankAccountId` (FK banks)

**`errors`:** `id`, `userId` (FK nullable), `message`, `path`, `severity` (default error), `stack`, `createdAt`

Also: `account` (NextAuth OAuth), `session` (NextAuth DB sessions), `verificationToken`, `authenticator` (WebAuthn)

### Encryption

```typescript
import { encrypt, decrypt } from "@/lib/encryption";
import { env } from "@/lib/env";

const encrypted = encrypt(plaintext, env.ENCRYPTION_KEY);
const plaintext = decrypt(encrypted, env.ENCRYPTION_KEY);
// Format: iv:authTag:ciphertext (hex, colon-separated)
```

---

## 15. Validation (Zod v4)

ESLint-enforced Zod rules (all errors): `zod/no-any-schema`, `zod/no-empty-custom-schema`, `zod/no-optional-and-default-together`, `zod/no-unknown-schema`, `zod/prefer-meta` (add `.describe()`), `zod/require-error-message`.

```typescript
const transferSchema = z
  .object({
    amount: z.coerce
      .number()
      .min(0.01, "Amount must be positive")
      .describe("Transfer amount"),
    senderBankId: z
      .string()
      .min(1, "Sender bank required")
      .describe("Sender bank ID")
  })
  .refine(d => d.senderBankId !== d.receiverBankId, {
    message: "Cannot transfer to same account",
    path: ["receiverBankId"]
  });
```

### Common Schemas

| Schema | File | Fields |
| --- | --- | --- |
| `RegisterSchema` | `lib/actions/register.ts` | `email`, `name`, `password`, `confirmPassword` |
| `UpdateProfileSchema` | `lib/actions/updateProfile.ts` | `address?`, `city?`, `email?`, `image?`, `name?`, `newPassword?`, `password?`, `phone?`, `postalCode?`, `state?` |
| `ToggleAdminSchema` | `lib/actions/admin.actions.ts` | `userId`, `makeAdmin` |
| `SetActiveSchema` | `lib/actions/admin.actions.ts` | `userId`, `isActive` |

---

## 16. Forms & UI

```tsx
"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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

const formSchema = z.object({
  amount: z.coerce
    .number()
    .min(0.01, "Amount must be positive")
    .describe("Transfer amount")
});

export function PaymentForm(): React.JSX.Element {
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: { amount: 0 },
    resolver: zodResolver(formSchema)
  });

  async function onSubmit(
    values: z.infer<typeof formSchema>
  ): Promise<void> {
    const result = await someAction(values);
    if (!result.ok) form.setError("root", { message: result.error });
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
        <Button type="submit" disabled={form.formState.isSubmitting}>
          Submit
        </Button>
      </form>
    </Form>
  );
}
```

Tailwind v4 uses CSS-based config (`@theme` in `app/globals.css`) — no `tailwind.config.js`.

---

## 17. Testing

| Framework | Version | Purpose | Config |
| --- | --- | --- | --- |
| Vitest | 4.1.2 | Unit + integration (happy-dom) | `vitest.config.ts` |
| Playwright | 1.59.1 | E2E (Chromium only, 1 worker) | `playwright.config.ts` |

```typescript
// Unit test pattern
import { describe, it, expect, beforeEach, vi } from "vitest";

import { auth } from "@/lib/auth";

vi.mock("@/lib/auth");

describe("getLoggedInUser", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns undefined when unauthenticated", async () => {
    vi.mocked(auth).mockResolvedValue(undefined);
    expect(await getLoggedInUser()).toBeUndefined();
  });
});
```

```typescript
// E2E test pattern
import { test, expect } from "@playwright/test";

test("redirects unauthenticated to sign-in", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/sign-in/);
});
```

**Before any test run — free port 3000 (PowerShell):**

```powershell
$pids = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue |
  Select-Object -ExpandProperty OwningProcess -Unique
if ($pids) { $pids | ForEach-Object { Stop-Process -Id $_ -Force } }
```

---

## 18. Security

- Sanitize all input through Zod before any DB or external API call
- Hash passwords with bcrypt (`bcrypt.hash(password, 12)`)
- Never log access tokens, passwords, account numbers, or routing numbers
- Security headers configured in `next.config.ts` (`X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`, `Referrer-Policy`, `Permissions-Policy`)
- Rate limiting via `lib/rate-limit.ts` (Upstash Redis, gracefully skipped if `REDIS_URL` absent)
- ESLint security rules (all errors): `security/detect-eval-with-expression`, `security/detect-non-literal-fs-filename`, `security/detect-non-literal-require`, `security/detect-unsafe-regex`

---

## 19. Known Technical Debt

| # | Location | Issue | Severity | Status |
| --- | --- | --- | --- | --- |
| 1 | `lib/dal/base.dal.ts` | File deleted (unused) | — | **Resolved** |
| 4 | `lib/actions/plaid.actions.ts` | `getAllBalances()` N+1 — now has `"use cache"` | — | **Resolved** |
| 5 | `app/middleware.ts` | Deleted - routes now protected via Next.js | — | **Resolved** |
| 6 | `lib/auth-config.ts` | Deleted - only JWT strategy used | — | **Resolved** |
| 7 | `app/api/health/route.ts` | Health checks always return `true` (stub) | Low | Open |
| 8 | `types/index.d.ts` | Legacy types with numeric `id` conflict with Drizzle string IDs | Medium | Open |
| 9 | `app/(root)/layout.tsx` | `user as unknown as User` unsafe cast | Low | Open |

---

## 20. Integrations

### Plaid

Flow: `createLinkToken` → user completes Plaid Link UI → `exchangePublicToken` → bank record created.

### Dwolla

Flow: `createDwollaCustomer` → store `customerUrl` → `createFundingSource` → store `fundingSourceUrl` → `createOnDemandAuthorization` → `createTransfer`.

### Upstash Redis

```typescript
export const ratelimit = env.REDIS_URL
  ? new Ratelimit({
      limiter: Ratelimit.slidingWindow(10, "10 s"),
      redis: new Redis({ url: env.REDIS_URL })
    })
  : null;
```

---

## 21. Cursor Rules

`.cursor/rules/` (12 `.mdc` files):

| File | Summary |
| --- | --- |
| `banking-coding-standards.mdc` | Core 5 rules: no any, no process.env, server actions, no N+1, strict TS |
| `typescript-no-any.mdc` | unknown + type guards, explicit return types |
| `env-access-via-lib-env.mdc` | Ban process.env — use lib/env.ts |
| `mutations-via-server-actions.mdc` | Write ops in Server Actions; `{ ok, error? }` shape |
| `no-n-plus-one-queries.mdc` | Eager loading required; never query inside loops |
| `workflow-and-steps.mdc` | 9-step workflow; plan required for >3 file changes |
| `plan-file-standards.mdc` | Plans in `.cursor/plans/`, `.plan.md` suffix, 8 required sections |
| `kill-port-3000-before-tests.mdc` | Free port 3000 before any test run |
| `project-coding-standards.mdc` | Index pointer to canonical coding rules |
| `project-workflow-process.mdc` | Pointer to workflow-and-steps.mdc |
| `project-testing-validation.mdc` | Pointer to testing/validation requirements |
| `project-documentation-style.mdc` | Pointer to documentation standards |

### 9-Step Workflow

1. Understand request and define expected outcome
2. Inspect relevant files and existing patterns before editing
3. If touching >3 files, propose a plan first
4. Save plan as `.cursor/plans/<short-kebab-task>_<8-char-id>.plan.md`
5. Plan minimal, safe changes aligned with project standards
6. Implement in small, focused edits
7. Verify behavior with targeted checks or tests
8. Confirm no regressions in touched areas
9. Summarize what changed, why, and how it was validated

---

## 22. GitHub Copilot Instructions

Main file: `.github/copilot-instructions.md` — quick-reference that defers to `AGENTS.md`.

### `.github/instructions/` (Banking-specific files)

| File | Purpose |
| --- | --- |
| `agents.instructions.md` | Banking agent entry point, defers to AGENTS.md |
| `nextjs.instructions.md` | Next.js 16 best practices for this project |
| `task-implementation.instructions.md` | Task workflow via `.copilot-tracking/` |

Other 20 files in `.github/instructions/` are generic tooling guides (Playwright, PowerShell, TypeScript, GitHub Actions, etc.) and require no Banking-specific changes.

---

## 23. OpenCode Skills & Instructions

### Skills (`.opencode/skills/`)

| Skill | File | Coverage |
| --- | --- | --- |
| `AuthSkill` | `auth-skill/SKILL.md` | NextAuth v4, session shape, protected routes |
| `DBSkill` | `db-skill/SKILL.md` | Drizzle ORM, migrations, N+1 prevention |
| `DeploymentSkill` | `deployment-skill/SKILL.md` | Vercel, Docker, Railway |
| `DwollaSkill` | `dwolla-skill/SKILL.md` | Dwolla API integration |
| `PlaidSkill` | `plaid-skill/SKILL.md` | Plaid API, PlaidLink |
| `SecuritySkill` | `security-skill/SKILL.md` | AES-256-GCM, CSRF, headers |
| `ServerActionSkill` | `server-action-skill/SKILL.md` | Server Action template, revalidation, file upload |
| `TestingSkill` | `testing-skill/SKILL.md` | Unit + E2E patterns |
| `UISkill` | `ui-skill/SKILL.md` | shadcn/ui + Tailwind v4 |
| `ValidationSkill` | `validation-skill/SKILL.md` | Zod v4 patterns |
| DAL Skill | `dal-skill.md` | N+1 prevention, cursor pagination, upsert |
| Server Action Skill (flat) | `server-action-skill.md` | Server Action flat-file reference |
| Suspense Skill | `suspense-skill.md` | Suspense boundaries, async APIs |

### Instructions (`.opencode/instructions/`)

| File | Priority | Summary |
| --- | --- | --- |
| `00-task-sync-note.md` | 0 | TaskSync not compatible with OpenCode Docker |
| `01-core-standards.md` | 1 | PR-blocking rules, type safety, env vars, security |
| `02-nextjs-patterns.md` | 2 | Server/Client components, Cache Components, Suspense |
| `03-dal-patterns.md` | 3 | DAL usage, N+1 prevention, transactions |
| `04-auth-testing.md` | 4 | NextAuth patterns, Vitest + Playwright |
| `05-ui-validation.md` | 5 | shadcn/ui, React Hook Form, Zod patterns |
| `06-commands-ref.md` | 6 | Full command reference |

---

## AGENTS.md Sync Checklist

Update the relevant section(s) when any of the following change:

- [ ] `database/schema.ts` → Section 14
- [ ] `lib/env.ts` → Section 3
- [ ] `lib/actions/*.ts` → Section 11 (action inventory)
- [ ] `types/next-auth.d.ts` → Section 13 (session shape)
- [ ] `lib/dal/*.ts` → Section 12
- [ ] `package.json` scripts → Section 2
- [ ] `eslint.config.mts` → Section 6
- [ ] `.prettierrc.ts` → Section 7
- [ ] Technical debt resolved → Section 19
- [ ] `.cursor/rules/` changes → Section 21
- [ ] `.github/instructions/` changes → Section 22
- [ ] `.opencode/skills/` changes → Section 23

**Version bump protocol:** Increment version, update date, add changelog entry, verify affected sections against source files.
