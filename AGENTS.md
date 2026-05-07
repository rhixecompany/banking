# AGENTS — Banking Project Reference

> **AI:** Load `SYSTEM.md` first. This file has detailed rules.

---

## Quick Start

### Essential Commands

```bash
bun run dev          # Dev server (port 3000, MCP auto)
bun run build      # Production build
bun run type-check # TypeScript strict
bun run lint:strict # ESLint strict (CI gate)
bun run format     # Prettier format
bun run verify:rules # AST policy enforcement
bun run test:browser # Vitest unit tests
bun run test:ui   # Playwright E2E (1 worker)
bun run db:push   # Drizzle schema to Postgres
bun run db:seed   # Load test data
```

### Pre-PR Checklist

Always run before committing:

```bash
bun run format && bun run type-check && bun run lint:strict && bun run verify:rules
```

---

## Architecture

### Stack

- **Next.js 16.2.4** + React 19 + App Router (Server Components default)
- **PostgreSQL** + **Drizzle ORM 0.45.2**
- **NextAuth v4.24.14** (JWT)
- **Plaid 42.1.0** + **Dwolla 3.4.0**
- **Bun 1.3.14** package manager

### Project Structure (`src/`)

```
src/
├── app/           # Next.js pages/routes
│   ├── (auth)/   # Public: login, register
│   ├── (root)/   # Protected: dashboard, wallets
│   └── (admin)/  # Admin-only
├── actions/      # Server Actions (mutations)
├── dal/          # Data Access Layer
├── database/     # Drizzle schema & client
├── components/   # UI components
├── lib/          # Shared libraries
└── tests/       # Unit/E2E tests
```

### Process Boundaries

| Location | Must Use |
| --- | --- |
| `src/app/`, `src/dal/` | Server Components, DAL helpers |
| UI components | `"use client"` |
| Actions | `"use server"`, Zod, return `{ ok, error, ...payload }` |
| `src/app/page.tsx` | Static, no auth/db/env |

---

## Critical Rules

### 1. Environment Variables

Never read `process.env` directly.

```typescript
// WRONG
const secret = process.env.NEXTAUTH_SECRET;

// CORRECT
import { auth } from "@/app-config";
const secret = auth.NEXTAUTH_SECRET;
```

- Use `app-config.ts` for typed env access
- **Verified exceptions**: `proxy.ts`, `scripts/seed/run.ts`

### 2. Database Access

Never import DB in UI components.

```typescript
// WRONG
import { db } from "@/database/db";
const users = await db.select().from(users);

// CORRECT
import { userDal } from "@/dal";
const users = await userDal.findAll();
```

- DAL enforces N+1 prevention
- `scripts/verify-rules.ts` detects violations

### 3. Home Page

Keep `src/app/page.tsx` **public and static**.

```typescript
// WRONG
export default async function Home() {
  const user = await auth(); // DON'T
}

// CORRECT
export default function Home() {
  return <LandingContent />;
}
```

### 4. Server Actions

All writes via Server Actions:

```typescript
// src/actions/wallet.actions.ts
"use server";
export async function createWallet(input: unknown) {
  const parsed = createWalletSchema.safeParse(input);
  if (!parsed.success)
    return { ok: false, error: parsed.error.message };
  const result = await walletDal.create(parsed.data);
  return result.ok
    ? { ok: true, wallet: result.wallet }
    : { ok: false, error: result.error };
}
```

- Start with `"use server"`
- Validate with Zod
- Return `{ ok, error?, ...payload }`

### 5. N+1 Prevention

Batch queries with IN clauses:

```typescript
// WRONG
for (const id of ids) {
  const w = await db.select().from(wallets).where(eq(wallets.id, id));
}

// CORRECT
const rows = await db
  .select()
  .from(wallets)
  .where(inArray(wallets.id, ids));
```

---

## Testing

### Unit (Vitest)

- Config: `vitest.config.ts` → `src/tests/unit/**/*.test.{ts,tsx}`
- Run: `bun exec vitest run src/tests/unit/path/file.test.ts --config=vitest.config.ts`

### E2E (Playwright)

- Config: `playwright.config.ts` — **stateful** (1 worker)
- Run: `bun run test:ui`
- Seed user: `seed-user@example.com` / `password123`

### Mock Tokens

Use `seed-`, `mock-`, or `mock_` prefixes to skip Plaid/Dwolla API calls:

```typescript
// src/lib/plaid.ts
export function isMockAccessToken(token: string): boolean {
  if (!token) return false;
  return (
    token.toLowerCase().startsWith("seed-") ||
    token.toLowerCase().startsWith("mock-") ||
    token.toLowerCase().startsWith("mock_")
  );
}
```

### Port Guard (before E2E/Vitest)

```powershell
# Windows
$pids = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
if ($pids) { $pids | ForEach-Object { Stop-Process -Id $_ -Force } }
```

```bash
# macOS/Linux
lsof -ti :3000 | xargs kill -9 2>/dev/null || true
```

---

## Local Setup

### First-Time

```bash
bun install
cp .env.example .env.local
# ⚠️ Add ENCRYPTION_KEY to .env.local (NOT in .env.example)
docker-compose up -d postgres redis
bun run db:push
bun run db:seed
bun run dev
```

### Required: ENCRYPTION_KEY

**NOT in `.env.example`** — must add manually to `.env.local`. 32-byte hex key.

Missing = silent E2E failures.

### Hook Side Effects

- `predev`: `bun run clean` — wipes `.next`
- `prebuild`: `bun run clean && bun run type-check`
- `pretest`: `bun run clean`

---

## Common Mistakes

1. **npm instead of bun** → Use `bun`
2. **process.env directly** → Use `app-config.ts`
3. **DB in UI** → Use DAL
4. **N+1 queries** → Batch with IN
5. **Auth in home page** → Keep static
6. **Skip pre-PR checks** → Run full checklist
7. **API routes for writes** → Server Actions
8. **Large changes without plan** → `.opencode/commands/*.plan.md`
9. **validate for quick check** → Use checklist
10. **Missing ENCRYPTION_KEY** → Add to `.env.local`

---

## Skills

| Skill              | Purpose              |
| ------------------ | -------------------- |
| **banking**        | Fintech guidance     |
| **caveman**        | Compressed responses |
| **caveman-commit** | Terse commits        |
| **datadog**        | Observability        |
| **jira**           | Ticket workflow      |

---

## CI/CD

### Pre-commit

- `.husky/pre-commit`: `bun run format:check` only
- **Lint-staged commented out** — CI is real gate

### CI Jobs

1. **Smoke E2E** — Every PR
2. **Full E2E** — main/develop or `/run-e2e`
3. **Type/lint/unit** — All PRs

---

**Last Updated:** 2026-05-06  
**Version:** 3.1 (Optimized)  
**Depends on:** SYSTEM.md
