# AGENTS.md — Banking Project

**Version:** 9.0 | **Updated:** April 5, 2026

## Quick Reference

```bash
npm run dev              # localhost:3000 (prebuild: clean + type-check)
npm run build            # Production build (postbuild: next-sitemap)
npm run validate         # build + lint:strict + test (expensive)
npm run lint:strict      # 0 warnings — PR-blocking
npm run type-check       # tsc --noEmit --pretty
npm run db:push          # Push schema to DB
npm run db:studio        # Drizzle Studio (localhost:8000)
npm run db:seed          # Seed (PLAID_TOKEN_MODE=sandbox)
npm run test             # test:ui THEN test:browser (reversed order!)
npm run test:browser     # Vitest (happy-dom, forks pool)
npm run test:ui          # Playwright E2E (Chromium, 1 worker)
npx vitest run tests/unit/auth.test.ts          # Single Vitest test
npx playwright test tests/e2e/auth.spec.ts      # Single Playwright test
```

**Generate scaffolding:**

```bash
npm run generate:feature   # Full feature (DAL + action + component)
npm run generate:dal       # DAL file only
npm run generate:action    # Server Action file only
npm run generate:component # React component only
```

**Free port 3000 before tests (Windows):**

```powershell
$p = Get-NetTCPConnection -LocalPort 3000 -State Listen -EA SilentlyContinue | Select -ExpandProperty OwningProcess -Unique
if ($p) { $p | % { Stop-Process -Id $_ -Force } }
```

---

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

---

## Project Structure

```
app/
├── (auth)/                    # sign-in, sign-up
├── (root)/                    # Protected routes
│   ├── dashboard/
│   ├── my-wallets/
│   ├── transaction-history/
│   ├── payment-transfer/
│   └── settings/
├── api/auth/[...nextauth]/    # NextAuth handler
├── page.tsx                   # Landing page
├── layout.tsx                 # Root layout
actions/                       # Server Actions (mutations only)
dal/                           # Data Access Layer (all DB access here)
database/
├── db.ts                      # Drizzle client (node-postgres pool)
├── schema.ts                  # All table definitions
└── drizzle/                   # Generated migrations
lib/
├── auth.ts                    # auth() → getServerSession()
├── auth-options.ts            # NextAuth config (JWT strategy)
├── env.ts                     # Re-exports from app-config.ts
└── encryption.ts              # AES-256-GCM encrypt/decrypt
types/
└── next-auth.d.ts             # Session/User/JWT type augmentation
app-config.ts                  # Centralized env config (Zod-validated)
proxy.ts                       # Middleware (auth guard + rate limiting)
tests/
├── setup.ts                   # Vitest setup (loads .env.local)
├── unit/                      # Vitest tests
└── e2e/                       # Playwright tests (Chromium, 1 worker)
```

**Stack:** Next.js 16.2.2, React 19, TypeScript 6.0.2 (strict), Drizzle ORM 0.45.2, PostgreSQL (Neon), NextAuth v4.24.13 (JWT), Zod v4.3.6, shadcn/ui, Tailwind CSS v4, Vitest 4.1.2, Playwright 1.59.1

**Integrations:** Plaid (bank linking), Dwolla (ACH transfers), Upstash Redis (rate limiting, optional)

**Key Next.js config:** `reactCompiler: true`, `cacheComponents: true`, `typedRoutes: true`, `output: "standalone"`, `typedEnv: true`

---

## Environment Variables

**Never read `process.env` directly.** Use `app-config.ts` (preferred) or `lib/env.ts`:

```typescript
import { env } from "@/lib/env";
// or preferred:
import { plaid } from "@/app-config";
```

Required (validated at startup in production): `ENCRYPTION_KEY`, `NEXTAUTH_SECRET`  
Optional (gracefully skipped): `DATABASE_URL` / `NEON_DATABASE_URL`, `PLAID_*`, `DWOLLA_*`, `REDIS_URL`, OAuth creds, SMTP

**Note:** `lib/env.ts` re-exports from `app-config.ts` for backward compat. All env vars are Zod-validated in `app-config.ts` with `.optional()` — missing vars return `undefined`, never throw (except required ones in prod).

**Drizzle migrations** read `.env.local` first, then `.env` via `dotenv` in `drizzle.config.ts`.

---

## TypeScript & Type Safety

### Session Shape (from `types/next-auth.d.ts`)

```typescript
interface Session {
  user: {
    id: string;
    name?: null | string;
    email?: null | string;
    isAdmin: boolean; // NO `role` field
    isActive: boolean;
  };
}
```

JWT also carries `id`, `isAdmin`, `isActive` — checked in `proxy.ts` middleware.

### Type Guard Pattern

```typescript
function hasEmail(input: unknown): input is { email: string } {
  return (
    typeof input === "object" &&
    input !== null &&
    "email" in input &&
    typeof (input as { email: string }).email === "string"
  );
}
```

---

## ESLint Configuration

Config: `eslint.config.mts` | **`noInlineConfig: false`** — inline `// eslint-disable` comments work.

### Errors (always enforced)

`curly`, `no-var`, `prefer-const`, `no-debugger`, `security/detect-eval-with-expression`, `security/detect-non-literal-fs-filename`, `zod/no-any-schema`, `zod/prefer-meta`, `zod/require-error-message`, `zod/no-optional-and-default-together`, `unicorn/no-abusive-eslint-disable`

**Drizzle rules** — `drizzle/enforce-delete-with-where` and `drizzle/enforce-update-with-where` are `off` globally, `error` only in `database/**/*.ts` and `dal/**/*.ts` files.

### Warnings (→ errors under `lint:strict`)

`@typescript-eslint/prefer-nullish-coalescing`, `react-hooks/exhaustive-deps`

**Not enforced:** `@typescript-eslint/explicit-function-return-type` is `off`, `import/order` is `off` (conflicts with `perfectionist/sort-imports`), `@typescript-eslint/no-explicit-any` is `off` in ESLint but **enforced by convention** (PR-blocking rule — use `unknown` + type guards).

### Key Overrides

| File Pattern | Rule | Reason |
| --- | --- | --- |
| `tests/e2e/**/*.spec.ts` | `security/detect-non-literal-regexp: off` | Dynamic URL patterns |
| `tests/unit/**/*.tsx` | `@next/next/no-img-element: off` | Mocked images |
| `actions/**/*.ts` | `no-console: off`, `require-await: off` | Error logging, may not always await |
| `proxy.ts` | `n/no-process-env: off` | Edge runtime can't import `lib/env.ts` |
| `database/**/*.ts`, `dal/**/*.ts` | `drizzle/enforce-*-with-where: error` | DB safety |
| `components/ui/**/*.tsx` | Multiple rules off | Generated shadcn components |
| `scripts/**/*.ts` | Relaxed rules | Codegen/validation scripts |

### Other Notable Rules

- `no-secrets/no-secrets`: `warn` with tolerance 4.2 (reduced false positives)
- `better-tailwindcss/enforce-consistent-class-order`: `error`
- `n/no-process-env`: `warn` globally, `off` for config files, proxy.ts, seed scripts, test setup

---

## Next.js 16 Patterns

### Page Component Signature

```typescript
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
}
```

### Server vs Client Components

```tsx
// Server Component (default) — data fetching, no hooks
export default async function Page() { ... }

// Client Component — add "use client"
"use client";
export function Form() {
  const [state, setState] = useState("");
  ...
}
```

### Cache Revalidation

```typescript
import { unstable_updateTag as updateTag } from "next/cache";
updateTag("banks"); // Immediate invalidation
revalidateTag("banks"); // Background stale-while-revalidate
```

---

## Server Actions

All mutations via Server Actions in `actions/`. **Never put mutation logic in API routes.**

```typescript
"use server";
import { auth } from "@/lib/auth";
import {
  revalidatePath,
  unstable_updateTag as updateTag
} from "next/cache";
import { z } from "zod";
import { walletDal } from "@/dal/wallet.dal";

const InputSchema = z.object({
  name: z.string().trim().min(1).max(100).describe("Wallet name")
});

export async function createWallet(
  input: unknown
): Promise<{ ok: boolean; error?: string }> {
  const parsed = InputSchema.safeParse(input);
  if (!parsed.success)
    return { error: parsed.error.message, ok: false };
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized", ok: false };
  try {
    await walletDal.create({
      ...parsed.data,
      userId: session.user.id
    });
    revalidatePath("/my-wallets");
    updateTag("wallets");
    return { ok: true };
  } catch {
    return { error: "Server error", ok: false };
  }
}
```

### Action Files

| File | Coverage |
| --- | --- |
| `actions/register.ts` | User registration |
| `actions/user.actions.ts` | Auth helpers (getLoggedInUser, logoutAccount, updateProfile) |
| `actions/admin.actions.ts` | Admin toggle |
| `actions/wallet.actions.ts` | Wallet CRUD (getUserWallets, disconnectWallet, createLinkToken, exchangePublicToken) |
| `actions/dwolla.actions.ts` | Transfers (createTransfer) |
| `actions/transaction.actions.ts` | Transaction queries (getRecentTransactions, getTransactionHistory) |
| `actions/plaid.actions.ts` | Plaid integration |
| `actions/recipient.actions.ts` | Recipient management |
| `actions/admin-stats.actions.ts` | Admin statistics |

### Protected Routes (`proxy.ts`)

Middleware guards: `/sign-in`, `/sign-up`, `/dashboard/*`, `/settings/*`, `/my-wallets/*`, `/transaction-history/*`, `/payment-transfer/*`

- Authenticated users redirected away from `/sign-in` and `/sign-up`
- Unauthenticated users redirected to `/sign-in?callbackUrl=<path>`
- Inactive accounts (`isActive === false`) redirected to `/sign-in?error=AccountDeactivated`
- Rate limiting on auth pages: 5 requests per 60s via Upstash Redis (skipped if Redis not configured)

---

## Data Access Layer

All DB access through `dal/`. Never query from Server Actions or components directly.

### DAL Files

| File                     | Coverage               |
| ------------------------ | ---------------------- |
| `dal/user.dal.ts`        | User CRUD              |
| `dal/wallet.dal.ts`      | Wallet/bank operations |
| `dal/transaction.dal.ts` | Transaction queries    |
| `dal/recipient.dal.ts`   | Recipient management   |
| `dal/dwolla.dal.ts`      | Dwolla-related data    |
| `dal/admin.dal.ts`       | Admin operations       |
| `dal/index.ts`           | Barrel export          |

```typescript
// dal/user.dal.ts
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
    data: Omit<
      typeof users.$inferInsert,
      "id" | "createdAt" | "updatedAt"
    >
  ) {
    const [user] = await db.insert(users).values(data).returning();
    return user;
  }
}
export const userDal = new UserDal();
```

### N+1 Prevention — CRITICAL

**Never query inside a loop.** Use JOINs:

```typescript
// BAD — N+1
for (const wallet of wallets) {
  const txns = await transactionDal.findByWalletId(wallet.id);
}

// GOOD — Single JOIN
const walletsWithTxns = await db
  .select({ wallet: wallets, transaction: transactions })
  .from(wallets)
  .leftJoin(
    transactions,
    eq(wallets.id, transactions.senderWalletId)
  );
```

### Transactions

```typescript
await db.transaction(async tx => {
  await tx.insert(wallets).values({ ...data });
  await tx.insert(transactions).values({ ...txData });
});
```

---

## Database Schema

File: `database/schema.ts`  
10 tables + enums:

| Table | Purpose |
| --- | --- |
| `users` | Core auth (id, email, password, isAdmin, isActive, role enum) |
| `account` | NextAuth OAuth/credentials link records |
| `session` | NextAuth session storage (not used with JWT strategy) |
| `verificationToken` | NextAuth email verification tokens |
| `authenticator` | NextAuth WebAuthn/FIDO2 credentials |
| `user_profiles` | Extended user info (address, phone, SSN encrypted, DOB) |
| `wallets` | Linked Plaid bank accounts (NOT `banks` — table was renamed) |
| `transactions` | Financial transactions (Plaid + Dwolla, numeric(12,2)) |
| `recipients` | Saved transfer recipients |
| `errors` | Application error logging |

### Encryption

```typescript
import { encrypt, decrypt } from "@/lib/encryption";
import { env } from "@/lib/env";

const encrypted = encrypt(plaintext, env.ENCRYPTION_KEY);
const plaintext = decrypt(encrypted, env.ENCRYPTION_KEY);
// Format: iv:authTag:ciphertext (hex, colon-separated)
```

---

## Validation (Zod v4)

ESLint-enforced: `zod/no-any-schema`, `zod/require-error-message`, `zod/prefer-meta`  
Every schema field **must** include `.describe("...")`.

```typescript
const transferSchema = z
  .object({
    amount: z.coerce
      .number()
      .min(0.01, "Amount must be positive")
      .describe("Transfer amount"),
    senderWalletId: z
      .string()
      .min(1, "Sender wallet required")
      .describe("Sender wallet ID"),
    receiverWalletId: z
      .string()
      .min(1, "Receiver wallet required")
      .describe("Receiver wallet ID")
  })
  .refine(d => d.senderWalletId !== d.receiverWalletId, {
    message: "Cannot transfer to same account",
    path: ["receiverWalletId"]
  });
```

---

## Forms & UI

```tsx
"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Input,
  Button
} from "@/components/ui/form";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email().describe("Recipient email"),
  amount: z.coerce.number().min(0.01).describe("Transfer amount")
});

export function PaymentForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: { email: "", amount: 0 },
    resolver: zodResolver(formSchema)
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const result = await createTransfer(values);
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="recipient@example.com"
                  {...field}
                />
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

**Tailwind v4:** CSS-based config (`@theme` in `app/globals.css`) — no `tailwind.config.js`

---

## Testing

### Vitest Setup

- Config: `vitest.config.ts`
- Environment: `happy-dom`
- Pool: `forks`
- Setup file: `tests/setup.ts` (loads `.env.local`, runs `cleanup` after each test)
- Include: `tests/unit/**/*.test.{ts,tsx,js,jsx}`

### Auth Mock Pattern (Vitest)

```typescript
// Unauthenticated
vi.mocked(auth).mockResolvedValue(undefined);

// Authenticated
vi.mocked(auth).mockResolvedValue({
  expires: new Date(Date.now() + 86400000).toISOString(),
  user: {
    id: "user-123",
    email: "test@example.com",
    isAdmin: false,
    isActive: true
  }
});
```

### Playwright Config Notes

- **1 worker only** — app is stateful (auth sessions, shared DB)
- **Chromium only** — other browsers commented out
- `forbidOnly: true` in CI
- `retries: 2` in CI only (0 locally)
- Web server auto-started via `npm run dev` (180s timeout)
- `reuseExistingServer: true` locally, `false` in CI
- `globalSetup` / `globalTeardown` in `tests/e2e/`

### Test Run Order

`npm run test` runs **`test:ui` first, then `test:browser`** (reversed from typical convention). The E2E tests start the dev server, so they must run first.

---

## Security

- Sanitize all input through Zod before DB or external API calls
- Hash passwords with bcrypt (`bcrypt.hash(password, 12)`) — uses `bcrypt` package, not `bcryptjs`
- **Never log:** access tokens, passwords, account numbers, routing numbers
- Rate limiting via `proxy.ts` (Upstash Redis, gracefully skipped if unavailable)
- Security headers in `next.config.ts` (HSTS, X-Frame-Options, CSP, etc.)
- `proxy.ts` guards Upstash `Redis.fromEnv()` call — throws on Windows if env vars absent, so it checks for `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` before instantiating

---

## Terminology Note

This project uses "bank" and "wallet" interchangeably:

- `banks` table = connected bank accounts
- UI text: "My Wallets", "Connect Banks" button
- Code: `walletDal`, `getUserBanks()`, etc.

---

## Skills & Instructions

For domain-specific patterns, see:

| Location | Coverage |
| --- | --- |
| `.opencode/skills/` | AuthSkill, DBSkill, DwollaSkill, PlaidSkill, SecuritySkill, ServerActionSkill, TestingSkill, UISkill, ValidationSkill |
| `.opencode/instructions/` | Core standards, Next.js patterns, DAL patterns, Auth/testing, UI/validation, Commands |
| `.cursor/rules/` | coding-standards, no-n-plus-one, server-actions, typescript-no-any, etc. |

---

_This file is the canonical reference for agentic contributors. Keep high-signal, repo-specific facts here._
