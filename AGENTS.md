# AGENTS — Comprehensive Repository Guide

**This is the single source of truth for all agent and developer guidance.** It consolidates `architecture.md`, `coding-standards.md`, `folder-structure.md`, `exemplars.md`, `.cursorrules`, `.github/copilot-instructions.md`, and `CONTRIBUTING.md`.

---

## 1. Start Here

### Package Manager & Environment

- **Package manager: Bun 1.3.13.** Declared in `package.json`: `"packageManager": "bun@1.3.13"`. Use `bun install`, `bun run <script>`, `bun exec`, `bunx`.
- **Working directory:** `C:\Users\Alexa\Desktop\SandBox\Banking` (Windows; adjust paths for your OS).
- **Repository:** Next.js 16 fintech app (PostgreSQL + Drizzle ORM, NextAuth v4, React 19).

### Essential Commands

| Task | Command | Notes |
| --- | --- | --- |
| **Dev server** | `bun run dev` | Runs on port 3000; MCP auto-enabled |
| **Build** | `bun run build` | Next.js production build |
| **Typecheck** | `bun run type-check` | TypeScript strict mode |
| **Lint** | `bun run lint:strict` | ESLint strict (use for CI) |
| **Format** | `bun run format` | Prettier |
| **Rules check** | `bun run verify:rules` | AST policy enforcement |
| **Unit tests** | `bun run test:browser` | Vitest (unit tests only) |
| **E2E tests** | `bun run test:ui` | Playwright (stateful, 1 worker) |
| **Full validation** | `bun run validate` | Runs all checks (CI-like) |
| **DB push** | `bun run db:push` | Drizzle schema to Postgres |
| **DB seed** | `bun run db:seed` | Load test data |

### Quick Pre-PR Checklist

Before committing or pushing, run **locally** (in order):

```bash
bun run format && bun run type-check && bun run lint:strict && bun run verify:rules
```

This matches CI enforcement. **Do not skip any step.**

---

## 2. Architecture Overview

### Technology Stack

**Core:**
- **Next.js 16.2.4** with App Router; Server Components by default
- **React 19** with React Compiler enabled (`next.config.ts`)
- **TypeScript 6.0.2** in strict mode (no `any` allowed)
- **Bun 1.3.13** package manager

**Database & ORM:**
- **PostgreSQL** (latest; typically v15+)
- **Drizzle ORM 0.45.2** + **drizzle-kit 0.31.10** for migrations
- **postgres 3.4.9** Node.js driver

**Authentication:**
- **NextAuth v4.24.14** with JWT strategy
- **@auth/drizzle-adapter 1.11.1** for session storage

**Testing:**
- **Playwright 1.59.1** for E2E (stateful, 1 worker)
- **Vitest 4.1.2** for unit tests
- **MSW 1.2.1** for network mocking

**Validation & Forms:**
- **Zod ^4.3.6** for schema validation
- **react-hook-form ^7.74.0** with Zod resolvers

**Integrations:**
- **Plaid 42.1.0** for bank linking
- **Dwolla 3.4.0** for ACH transfers
- **@upstash/redis 1.37.0** for caching/rate limiting

**UI & Styling:**
- **Tailwind CSS v4**
- **shadcn/ui** (latest) + **Radix UI 1.4.3**
- **lucide-react 1.14.0** for icons
- **recharts 3.8.0** for charts

**Build & Quality:**
- **ESLint 9.0.0** + **Prettier 3.8.1**
- **Husky 9.1.7** + **lint-staged 16.4.0** for pre-commit hooks
- **tsx 4.21.0** for TypeScript script execution

### Next.js Configuration Highlights

**Key flags in `next.config.ts`:**
- `cacheComponents: true` — Cache Components mode (experimental)
- `typedRoutes: true` — Type-safe route imports
- `reactCompiler: true` — React Compiler enabled
- `output: "standalone"` — Self-contained build

**Important:** These flags are production-ready; do not disable without cause.

### Project Shape

```
C:\Users\Alexa\Desktop\SandBox\Banking/
├── app/                    # Next.js App Router pages & layouts
│   ├── (auth)/            # Public: login, register
│   ├── (root)/            # Protected: dashboard, wallets, etc.
│   ├── api/               # API routes (minimal; use Server Actions)
│   ├── page.tsx           # Landing (MUST stay public & static)
│   └── layout.tsx         # Root layout
├── actions/               # Server Actions (mutations)
├── dal/                   # Data Access Layer (all DB reads/writes)
├── database/              # Drizzle schema & DB client
├── components/            # UI components
│   ├── ui/               # shadcn/ui primitives
│   ├── layouts/          # Presentational layouts
│   └── [feature]/        # Feature-specific components
├── lib/                   # Shared libraries
├── scripts/               # Build, seed, verification scripts
├── tests/                 # Unit & E2E tests
│   ├── unit/             # Vitest files
│   └── e2e/              # Playwright specs
├── types/                 # TypeScript type definitions
├── .opencode/            # Agent plans, instructions, reports
├── AGENTS.md             # THIS FILE (single source of truth)
├── architecture.md       # Archived; see AGENTS.md §2
├── coding-standards.md   # Archived; see AGENTS.md §3–4
├── exemplars.md          # Archived; see AGENTS.md §5
├── folder-structure.md   # Archived; see AGENTS.md §2
├── tech-stack.md         # Archived; generated from package.json
├── package.json          # Scripts, dependencies, package manager
├── tsconfig.json         # TypeScript strict mode
├── next.config.ts        # Next.js config (cacheComponents, etc.)
├── vitest.config.ts      # Vitest config (unit tests)
├── playwright.config.ts  # Playwright config (E2E, stateful)
└── bun.lock              # Bun lockfile
```

### Process Boundaries

**Server Components (default in `app/` and `dal/`):**
- Fetch data via DAL helpers
- Call `auth()` for protected routes
- No direct `process.env` reads (use `app-config.ts`)
- No direct DB imports (use `dal/**` helpers)

**Client Components (mark with `"use client"`):**
- Interactivity: forms, modals, animations
- Browser APIs: `localStorage`, `window`, etc.
- User input handling

**Server Actions (`actions/`):**
- `"use server"` directive
- Validate inputs with Zod
- Call `auth()` early for protected actions
- Return `{ ok: boolean; error?: string; ...payload }`
- Use DAL helpers for DB access

---

## 3. Code Patterns & Exemplars

### Pattern 1: Server Actions

**File:** `actions/register.ts`

**Rules:**
1. Start with `"use server"`
2. Validate inputs with Zod `.safeParse()`
3. Call `auth()` early for protected actions
4. Return stable shape: `{ ok: boolean; error?: string; ...payload }`
5. Use DAL helpers for DB access

**Example:**

```typescript
"use server";
import bcrypt from "bcrypt";
import { z } from "zod";

import { userDal } from "@/dal";
import { signUpSchema } from "@/lib/validations/auth";

export async function registerUser(input: unknown): Promise<{
  ok: boolean;
  user?: UserWithProfile;
  error?: string;
}> {
  // Validate input
  const parsed = signUpSchema.safeParse(input);
  if (!parsed.success) {
    const allErrors = parsed.error.issues
      .slice(0, 3)
      .map(issue => issue.message)
      .join("; ");
    return { error: allErrors, ok: false };
  }

  // Use DAL helper for DB operation
  const result = await userDal.create(parsed.data);
  if (!result.ok) {
    return { error: result.error, ok: false };
  }

  return { ok: true, user: result.user };
}
```

### Pattern 2: N+1 Prevention (DAL Batching)

**File:** `dal/transaction.dal.ts`

**Rules:**
1. Fetch base rows first (e.g., transactions)
2. Collect unique IDs from those rows
3. Batch-fetch related data in a single query (e.g., wallets via `IN` clause)
4. Map related data back onto base rows
5. Avoid joins to the same table twice

**Example:**

```typescript
export async function findByUserIdWithWallets(
  userId: string,
  limitVal = 50,
  offsetVal = 0
) {
  // 1. Fetch transactions
  const txns = await db
    .select()
    .from(transactions)
    .where(eq(transactions.userId, userId))
    .limit(limitVal)
    .offset(offsetVal);

  // 2. Collect unique wallet IDs
  const walletIds = new Set<string>();
  for (const t of txns) {
    if (t.senderWalletId) walletIds.add(t.senderWalletId);
    if (t.receiverWalletId) walletIds.add(t.receiverWalletId);
  }

  // 3. Batch fetch wallets (single query, no N+1)
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

  // 4. Map wallets back onto transactions
  return txns.map(txn => ({
    ...txn,
    senderWallet: walletsMap.get(txn.senderWalletId) ?? null,
    receiverWallet: walletsMap.get(txn.receiverWalletId) ?? null
  }));
}
```

### Pattern 3: Environment & Config Access

**Files:** `app-config.ts` (canonical), `lib/env.ts` (backward compat)

**Rules:**
1. **Never** read `process.env` directly in app code
2. Use `app-config.ts` as the canonical typed source
3. `lib/env.ts` re-exports for backward compatibility
4. **Exception:** `proxy.ts` and `scripts/seed/run.ts` read Upstash env vars directly (verified exceptions)

**Example:**

```typescript
// app-config.ts (canonical)
import { z } from "zod";

const authSchema = z.object({
  NEXTAUTH_SECRET: z.string().trim().min(1),
  NEXTAUTH_URL: z.string().trim().url().optional()
});

export const auth = parseAuthConfig();

// lib/env.ts (backward compat re-export)
export const env = {
  NEXTAUTH_SECRET: auth.NEXTAUTH_SECRET,
  NEXTAUTH_URL: auth.NEXTAUTH_URL
} as const;

// Usage in app code:
import { auth } from "@/app-config";
const secret = auth.NEXTAUTH_SECRET; // ✅ Correct
```

### Pattern 4: Deterministic Testing (Plaid & Dwolla)

**Files:** `lib/plaid.ts`, `tests/e2e/helpers/plaid.mock.ts`

**Rules:**
1. Use `isMockAccessToken()` to detect test tokens (start with `seed-`, `mock-`, `mock_`)
2. Skip network calls for mock tokens
3. Create mock funding-source/transfer URLs instead
4. Inject Plaid Link mock in E2E tests via `addMockPlaidInitScript()`

**Example:**

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
): Promise<void> {
  const script = `(() => {
    window.Plaid = {
      create: function(opts) {
        setTimeout(() => {
          if (opts && typeof opts.onSuccess === 'function') {
            opts.onSuccess(${JSON.stringify(publicToken)}, { metadata: {} });
          }
        }, 0);
        return { open: function() {} };
      }
    };
  })();`;
  await page.addInitScript(script);
}
```

**E2E Seed User:**
- Email: `seed-user@example.com`
- Password: `password123`

---

## 4. Conventions & Rules

### Environment & Secrets

**❌ Critical Rule:** Do not read `process.env` directly in application code.

```typescript
// ❌ WRONG
const secret = process.env.NEXTAUTH_SECRET;

// ✅ CORRECT
import { auth } from "@/app-config";
const secret = auth.NEXTAUTH_SECRET;
```

**Why:** `app-config.ts` provides typed Zod validation and centralizes all env handling. This ensures type safety and prevents runtime surprises.

**Verified Exceptions:**
- `proxy.ts` — reads Upstash Redis env vars directly (required for proxy layer)
- `scripts/seed/run.ts` — intentionally loads `.env` before imports (documented)

**Enforcement:** `scripts/verify-rules.ts` detects direct `process.env` usage in `app/`, `lib/`, `components/`. Violations fail CI (exit code 2).

### Database Access

**❌ Critical Rule:** Do not import DB clients directly in UI/route components.

```typescript
// ❌ WRONG (app/dashboard/page.tsx)
import { db } from "@/database/db";
const users = await db.select().from(usersTable);

// ✅ CORRECT
import { userDal } from "@/dal";
const users = await userDal.findAll();
```

**Why:** DAL helpers enforce N+1 prevention, reuse queries, and provide a consistent interface.

**Enforcement:** `scripts/verify-rules.ts` detects DB imports in `app/`, `components/`. Violations fail CI.

### Home Page Rules

**❌ Critical Rule:** Keep `app/page.tsx` public and static.

```typescript
// ❌ WRONG
export default async function Home() {
  const user = await auth(); // NO
  const data = await userDal.findById(userId); // NO
  process.env.SECRET; // NO
}

// ✅ CORRECT
export default function Home() {
  return <LandingPageContent />;
}
```

**Why:** The landing page should be fast, cacheable, and not require auth or DB access. It's the first impression users see.

**Enforcement:** `scripts/verify-rules.ts` treats auth calls, direct env reads, and DB/DAL access on the home page as critical violations (exit code 2).

### Server Actions Contract

All writes must be Server Actions (not API routes).

```typescript
// ✅ CORRECT (actions/wallet.actions.ts)
"use server";

import { walletDal } from "@/dal";
import { z } from "zod";

export async function createWallet(input: unknown) {
  // 1. Authenticate early
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: "Unauthorized" };
  }

  // 2. Validate input
  const parsed = createWalletSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0].message };
  }

  // 3. Use DAL helper
  const result = await walletDal.create(parsed.data);
  if (!result.ok) {
    return { ok: false, error: result.error };
  }

  // 4. Revalidate caches if needed
  revalidatePath("/dashboard");

  return { ok: true, wallet: result.wallet };
}
```

### N+1 Query Prevention

Always batch related queries using IN clauses or subqueries. Reference `dal/transaction.dal.ts` as the canonical pattern:

```typescript
// ✅ CORRECT: Batch fetch
const userIds = [user1Id, user2Id, user3Id];
const users = await db
  .select()
  .from(usersTable)
  .where(inArray(usersTable.id, userIds));

// ❌ WRONG: Loop & query (N+1)
for (const userId of userIds) {
  const user = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, userId));
}
```

### Commit & Plan Policy

**Small Change (<= 5 files):** Commit directly without a plan.

```bash
git commit -m "fix: correct typo in button label"
```

**Large Change (> 7 files):** Create a plan first under `.opencode/commands/*.plan.md`.

```markdown
# Plan: Add wallet creation UI

## Files Changed
- app/(root)/wallet/create/page.tsx (new)
- actions/wallet.actions.ts
- dal/wallet.dal.ts
- components/forms/CreateWalletForm.tsx (new)
- tests/e2e/wallet.spec.ts
- database/schema.ts
- lib/validations/wallet.ts (new)
- styles (global CSS)

## Phases
1. Schema update
2. DAL implementation
3. Action implementation
4. UI components
5. E2E tests
```

**Enforcement:** `scripts/verify-rules.ts` detects large changes without a plan and exits with code 2 in CI.

### Commit Provenance

When AI agents make changes, include a one-line provenance in the commit message or PR body:

```
Co-authored-by: Claude <copilot@opencode>
```

This helps track automated changes vs. manual edits.

### TypeScript Strict Mode

**❌ Rule:** No `any` in production code.

```typescript
// ❌ WRONG
const data: any = await fetch(...).json();

// ✅ CORRECT
const data: unknown = await fetch(...).json();
const parsed = mySchema.safeParse(data);
if (!parsed.success) throw new Error("Invalid data");
```

**Why:** `any` bypasses the type system. Use `unknown` and narrow with type guards or Zod.

**Enforcement:** `scripts/verify-rules.ts` detects `any` usage and reports violations.

---

## 5. Testing Guide

### Unit Testing (Vitest)

**Config:** `vitest.config.ts` includes **only** `tests/unit/**/*.test.{ts,tsx,js,jsx}`.

**Run one Vitest file:**

```bash
bun exec vitest run tests/unit/path/to/file.test.ts --config=vitest.config.ts
```

**Setup:** `tests/setup.ts` runs before all tests. MSW is configured for network mocking.

**Pattern:**

```typescript
// tests/unit/actions/registerUser.test.ts
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { server } from "@/tests/mocks/server";

beforeAll(() => server.listen());
afterAll(() => server.close());

describe("registerUser", () => {
  it("should create a user with valid input", async () => {
    const result = await registerUser({
      email: "test@example.com",
      password: "SecurePassword123!"
    });
    expect(result.ok).toBe(true);
    expect(result.user?.email).toBe("test@example.com");
  });
});
```

### E2E Testing (Playwright)

**Config:** `playwright.config.ts` is **stateful** (1 worker, no parallel execution).

**Run all E2E tests:**

```bash
bun run test:ui
```

**Run one Playwright spec:**

```bash
bunx playwright test tests/e2e/wallet.spec.ts --project=chromium
```

**Setup:** `tests/e2e/global-setup.ts` and `tests/e2e/global-teardown.ts` manage DB state. If `PLAYWRIGHT_PREPARE_DB=true`, it runs `bun run db:push && bun run db:seed -- --reset`.

**Requirements:**
- PostgreSQL reachable via `DATABASE_URL`
- `ENCRYPTION_KEY` set
- `NEXTAUTH_SECRET` set

**Mock Tokens for E2E:**

Use tokens starting with `seed-`, `mock-`, or `mock_` to skip Plaid/Dwolla API calls:

```typescript
// tests/e2e/wallet.spec.ts
import { addMockPlaidInitScript } from "@/tests/e2e/helpers/plaid.mock";

test("should link a mock bank account", async ({ page }) => {
  await addMockPlaidInitScript(page, "MOCK_PUBLIC_TOKEN");
  await page.goto("/dashboard");
  // Test proceeds without hitting Plaid API
});
```

**E2E Seed User:**
- Email: `seed-user@example.com`
- Password: `password123`

### Port Guard

**Before running E2E/Vitest**, free port 3000:

**Windows (PowerShell):**

```powershell
$pids = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
if ($pids) { $pids | ForEach-Object { Stop-Process -Id $_ -Force } }
```

**macOS/Linux (Bash):**

```bash
lsof -ti :3000 | xargs kill -9 2>/dev/null || true
```

### Network Mocking

**Unit tests:** Use MSW (Mock Service Worker) configured in `tests/mocks/server.ts`.

**E2E tests:** Use helper functions in `tests/e2e/helpers/` (e.g., `plaid.mock.ts`).

**Example (MSW in unit test):**

```typescript
import { http, HttpResponse } from "msw";
import { server } from "@/tests/mocks/server";

server.use(
  http.post("https://api.plaid.com/institutions/search", () => {
    return HttpResponse.json({ institutions: [] });
  })
);
```

---

## 6. Scripts & Tooling

### Script Pattern: Orchestrator + TypeScript

**Rule:** All logic must live in TypeScript under `scripts/ts/`. Shell scripts are orchestrators only.

**Correct pattern:**

```bash
#!/usr/bin/env bash
# scripts/deploy.sh - Orchestrator
cd "$(dirname "$0")/.."
bunx tsx scripts/ts/deploy/deploy.ts "$@"
```

```typescript
// scripts/ts/deploy/deploy.ts - Implementation
import { parseArgs } from "util";

const args = parseArgs({
  options: { dryRun: { type: "boolean" } }
});

async function deploy() {
  // All logic here
}

deploy().catch(err => {
  console.error(err);
  process.exit(1);
});
```

### Key Scripts

| Script | Purpose |
| --- | --- |
| `scripts/verify-rules.ts` | AST-based policy enforcement (same as CI) |
| `scripts/seed/run.ts` | Load test data (intentionally loads .env) |
| `scripts/mcp-runner.ts` | MCP server runner |
| `scripts/plan-ensure.ts` | Plan validation |

**Run verify-rules locally:**

```bash
bun run verify:rules
```

---

## 7. Local Development Setup

### First-Time Setup

```bash
# 1. Install dependencies
bun install

# 2. Set up environment (copy example, fill in secrets)
cp .env.example .env.local

# 3. Start Postgres (Docker or local)
docker-compose up -d postgres redis

# 4. Push schema & seed data
bun run db:push
bun run db:seed

# 5. Start dev server
bun run dev
```

Server runs on `http://localhost:3000`.

### Full Local Verification (matches CI)

```bash
# Install dependencies
bun install

# Start services
docker-compose up -d postgres redis

# Run all checks
bun run validate

# Or run individually:
bun run format && bun run type-check && bun run lint:strict && bun run verify:rules
bun run test:browser  # Unit tests
bun run test:ui       # E2E tests (requires port 3000 free)
```

### Requesting Full E2E for Forked PRs

By default, full E2E runs only on PRs from the main repository. If your PR is from a fork:

1. Ask a maintainer to approve the PR
2. Or comment `/run-e2e` on the PR (authorized users only)

**Authorized maintainers:**
- rhixecompany
- adminbot

---

## 8. Troubleshooting & Common Mistakes

### Mistake 1: Using `npm` Instead of `bun`

**❌ WRONG:**

```bash
npm run dev
npm install
```

**✅ CORRECT:**

```bash
bun run dev
bun install
```

**Why:** Bun is 3–4x faster and is the declared package manager.

---

### Mistake 2: Reading `process.env` Directly

**❌ WRONG:**

```typescript
const secret = process.env.NEXTAUTH_SECRET;
```

**✅ CORRECT:**

```typescript
import { auth } from "@/app-config";
const secret = auth.NEXTAUTH_SECRET;
```

---

### Mistake 3: Querying DB in UI Components

**❌ WRONG:**

```typescript
// app/dashboard/page.tsx
import { db } from "@/database/db";

export default async function Dashboard() {
  const users = await db.select().from(usersTable);
  return <UserList users={users} />;
}
```

**✅ CORRECT:**

```typescript
// app/dashboard/page.tsx
import { userDal } from "@/dal";

export default async function Dashboard() {
  const users = await userDal.findAll();
  return <UserList users={users} />;
}
```

---

### Mistake 4: N+1 Queries in DAL

**❌ WRONG:**

```typescript
for (const walletId of walletIds) {
  const wallet = await db
    .select()
    .from(wallets)
    .where(eq(wallets.id, walletId));
}
```

**✅ CORRECT:**

```typescript
const walletsMap = new Map();
if (walletIds.size > 0) {
  const rows = await db
    .select()
    .from(wallets)
    .where(inArray(wallets.id, Array.from(walletIds)));
  for (const row of rows) {
    walletsMap.set(row.id, row);
  }
}
```

---

### Mistake 5: Auth Calls in Home Page

**❌ WRONG:**

```typescript
// app/page.tsx
export default async function Home() {
  const session = await auth();
  if (!session) return <SignInPrompt />;
  return <Dashboard />;
}
```

**✅ CORRECT:**

```typescript
// app/page.tsx
export default function Home() {
  return <LandingPageContent />;
}

// app/(root)/dashboard/page.tsx (protected)
export default async function Dashboard() {
  const session = await auth();
  if (!session) redirect("/sign-in");
  return <DashboardContent />;
}
```

---

### Mistake 6: Skipping Pre-PR Checks

**❌ WRONG:**

```bash
git commit -m "feature: new wallet"
git push origin feature/new-wallet
# No format, type-check, or lint
```

**✅ CORRECT:**

```bash
bun run format && bun run type-check && bun run lint:strict && bun run verify:rules
git commit -m "feature: new wallet"
git push origin feature/new-wallet
```

---

### Mistake 7: Using API Routes Instead of Server Actions

**❌ WRONG:**

```typescript
// app/api/wallet/create.ts
export async function POST(req: Request) {
  const data = await req.json();
  // Validation, DB write
  return Response.json({ ok: true });
}
```

**✅ CORRECT:**

```typescript
// actions/wallet.actions.ts
"use server";

export async function createWallet(input: unknown) {
  const parsed = createWalletSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error };
  const result = await walletDal.create(parsed.data);
  return { ok: true, wallet: result.wallet };
}
```

---

### Mistake 8: Large Changes Without a Plan

**❌ WRONG:**

```
git commit -m "refactor: entire auth system"
# Touch 12 files, no .opencode/commands/*.plan.md
# CI fails: "Large change detected but no plan found"
```

**✅ CORRECT:**

```markdown
# .opencode/commands/refactor-auth.plan.md

## Overview
Migrate NextAuth v4 to Auth.js (v5 compatible)

## Files Changed
1. lib/auth-options.ts
2. app/api/auth/[...nextauth]/route.ts
... (12 files total)

## Phases
1. Update providers
2. Migrate session storage
...
```

Then commit normally.

---

## 9. Agent Behavior Rules

### When to Ask Questions

- ❓ **Ambiguous request?** Ask for clarification with a question tool.
- ❓ **>7 files affected?** Ask user to approve the plan.
- ❓ **Uncertain about a pattern?** Consult exemplars.md or canonical files.

### Before Implementing

1. **Understand the scope** — Read `architecture.md`, `folder-structure.md`, or `codemap.md` if unsure.
2. **Check exemplars** — Reference `exemplars.md` for proven patterns.
3. **Run verify-rules** — After changes, run `bun run verify:rules` to catch policy violations early.
4. **No skipping checks** — Always run `format && type-check && lint:strict && verify:rules` before committing.

### Mistakes to Avoid

- ❌ Using `npm` instead of `bun`
- ❌ Reading `process.env` directly
- ❌ Importing DB clients in UI
- ❌ N+1 queries (batch fetch instead)
- ❌ Auth calls in home page
- ❌ API routes instead of Server Actions
- ❌ Large changes without a plan
- ❌ Skipping pre-PR validation
- ❌ Committing secrets

### How to Contribute

1. **Understand current state** — Run `bun run dev` to start the server.
2. **Create a branch** — Follow existing naming convention (e.g., `feature/wallet-linking`).
3. **Implement with patterns** — Use Server Actions, DAL helpers, Zod validation.
4. **Test thoroughly** — Run unit and E2E tests locally.
5. **Pre-PR validation** — `bun run format && bun run type-check && bun run lint:strict && bun run verify:rules`
6. **Commit with provenance** — Include `Co-authored-by: Claude <copilot@opencode>` if AI-assisted.
7. **Push & open PR** — CI will run full validation.

---

## 10. Key Resources

| Resource | Purpose |
| --- | --- |
| **AGENTS.md** (this file) | Single source of truth for all guidance |
| **exemplars.md** | Concrete code patterns (archived; see §3 above) |
| **architecture.md** | Tech stack details (archived; see §2 above) |
| **coding-standards.md** | Coding rules (archived; see §4 above) |
| **folder-structure.md** | Directory layout (archived; see §2 above) |
| **codemap.md** | Module responsibilities & entry points |
| **package.json** | Scripts, dependencies, package manager declaration |
| **tsconfig.json** | TypeScript strict mode configuration |
| **next.config.ts** | Next.js flags (cacheComponents, reactCompiler, etc.) |
| **vitest.config.ts** | Vitest unit test configuration |
| **playwright.config.ts** | Playwright E2E configuration (stateful) |
| **.cursorrules** | Cursor.ai-specific rules (largely superseded by AGENTS.md) |
| `.opencode/commands/` | Implementation plans for large changes |
| `.opencode/skills/` | Agent skill definitions |

---

## 11. CI/CD & Deployment

### Pre-PR Local Validation

Run **before** pushing:

```bash
bun run format && bun run type-check && bun run lint:strict && bun run verify:rules
```

This matches CI enforcement exactly.

### CI Jobs (GitHub Actions)

1. **Smoke E2E** — Runs on every PR (fast, small suite)
2. **Full E2E** — Runs on main/develop PRs or when approved (`/run-e2e` comment)
3. **Type-check, lint, unit tests** — Run on all PRs

### Deployment

- **Build:** `bun run build` generates optimized Next.js artifacts
- **Output:** `output: "standalone"` in `next.config.ts` creates self-contained deployments
- **DB migrations:** Use `bun run db:push` before deploying new schema

---

## 12. Notes & Conventions

### Learned Repository Preferences

1. **Respect provided plans** — If a user provides a `.opencode/commands/*.plan.md` with todos, execute the plan as written without editing it.
2. **Progress existing todos** — Work through listed items in order.
3. **Port 3000 guard** — Playwright/Vitest automatically free port 3000; do not bypass.

### File Modification Rules

- **Do not edit:** `AGENTS.md` is this file. To update it, edit this file directly.
- **Do not deprecate:** `.cursorrules`, `.github/copilot-instructions.md`, `architecture.md`, etc. remain as reference (not auto-loaded after this update).
- **Do use:** `AGENTS.md` as the single source of truth for all agent & developer guidance.

### When in Doubt

1. Check `exemplars.md` for concrete patterns
2. Read canonical reference files (see table in §3)
3. Ask clarifying questions before implementing
4. Run `bun run verify:rules` to catch policy violations early

---

**Last Updated:** 2026-05-03  
**Version:** 2.0 (Comprehensive Consolidation)  
**Sources Consolidated:** `architecture.md`, `coding-standards.md`, `folder-structure.md`, `exemplars.md`, `.cursorrules`, `.github/copilot-instructions.md`, `CONTRIBUTING.md`, `SCRIPTING_STANDARDS.md`
