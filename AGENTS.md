# Opencode Instructions

Comprehensive guidance for automated agents and contributors working in the Banking repository. This file is auto-loaded into agent context on every session.

## Priority Guidelines

When generating code for this repository:

1. **Version Compatibility**: Always detect and respect the exact versions of languages, frameworks, and libraries used in this project
2. **Context Files**: Prioritize patterns and standards defined in the root directory
3. **Codebase Patterns**: When context files don't provide specific guidance, scan the codebase for established patterns
4. **Architectural Consistency**: Maintain our Domain-Driven architectural style and established boundaries
5. **Code Quality**: Prioritize maintainability, performance, security, accessibility, and testability in all generated code

---

## Technology Version Detection

Before generating code, scan the codebase to identify:

### Language Versions

- **TypeScript**: 6.0.2 (detected from package.json)
- **Node.js**: 18+ recommended (check compatibility)
- **React**: 19 (detected from package.json)

### Framework Versions

- **Next.js**: 16.2.2 (App Router, Server Components by default)
- **NextAuth**: v4.24.13
- **Drizzle ORM**: drizzle-orm v0.45.2
- **drizzle-kit**: v0.31.10

### Library Versions (Key Dependencies)

| Library         | Version | Notes         |
| --------------- | ------- | ------------- |
| Zod             | ^4.3.6  | Validation    |
| react-hook-form | ^7.72.1 | Form handling |
| Plaid           | ^41.4.0 | Bank linking  |
| Dwolla          | ^3.4.0  | ACH transfers |
| Playwright      | ^1.59.1 | E2E testing   |
| Vitest          | ^4.1.2  | Unit testing  |
| Tailwind CSS    | v4      | Styling       |

**Never use language/framework features not available in these specific versions.**

---

## Context Files

These files define project standards. Prioritize them in order:

1. **AGENTS.md** (this file) — Master instruction set
2. **architecture.md** — System architecture and high-level design
3. **tech-stack.md** — Exact technology versions
4. **coding-standards.md** — Enforceable code style rules
5. **folder-structure.md** — Directory organization
6. **exemplars.md** — Exemplary code patterns to follow

---

## Quick Commands (Authoritative)

Run these exactly as written:

### Installation & Dev

```bash
npm install              # Install dependencies
npm run dev              # Start dev server (port 3000)
npm run build            # Build (prebuild runs clean + type-check)
npm run validate        # Full validation (format, type-check, lint, test)
```

### Pre-PR Checklist

```bash
npm run format          # Format code
npm run type-check     # TypeScript validation
npm run lint:strict   # ESLint (zero warnings allowed)
npm run verify:rules  # Repository policy checks
```

### Testing

```bash
npm run test           # All tests (E2E then unit)
npm run test:ui       # Playwright E2E (requires DB, browsers)
npm run test:browser  # Vitest unit tests
```

### Database / Drizzle

```bash
npm run db:generate   # Generate migration
npm run db:push     # Apply schema
npm run db:migrate  # Run migrations
npm run db:seed    # Seed local DB
```

---

## Environment / Config Rules (Must Follow)

- **Do NOT read `process.env` directly** in application code. Use:
  - `app-config.ts` (preferred — typed validation)
  - `lib/env.ts` (backward compatibility)
- **Exceptions**: Only `scripts/seed/run.ts` and build helpers intentionally load `.env` before imports.
- Add new env vars to `app-config.ts` for typed validation.
- **Never commit secrets**. Use `.env.example` for documentation.

**Evidence**: `scripts/verify-rules.ts` uses ts-morph AST analysis to detect `process.env` usage in `app/`, `lib/`, `components/`. See `app-config.ts` for typed schema-based config validation.

---

## Server Actions Pattern

All mutations MUST be Server Actions (`"use server"`). Pattern:

```typescript
"use server";

import { z } from "zod";
import { userDal } from "@/dal";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100)
});

export async function createUser(
  input: unknown
): Promise<{ ok: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user) {
    return { ok: false, error: "Unauthorized" };
  }

  const parsed = CreateUserSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.message };
  }

  try {
    await userDal.create(parsed.data);
    revalidatePath("/users");
    return { ok: true };
  } catch {
    return { ok: false, error: "Failed to create user" };
  }
}
```

**Server Actions MUST:**

1. Use `"use server"` directive
2. Call `auth()` early for protected actions
3. Validate inputs with Zod (`.safeParse()`)
4. Return consistent shape: `{ ok: boolean; error?: string }`
5. Use DAL helpers for DB access
6. Revalidate caches/tags where needed

**Evidence**: `actions/register.ts` implements this pattern. `scripts/verify-rules.ts` validates Server Action heuristics via AST analysis.

---

## DAL Patterns

All database access MUST go through `dal/*` helpers:

- Use Drizzle ORM for queries
- **Avoid N+1 queries** — use JOINs or batch queries
- DAL helpers accept optional `tx` parameter for transactions
- Example: `dal/transaction.dal.ts` shows eager-loading via batched wallet fetch

```typescript
// BAD (N+1)
const users = await userDal.findAll();
for (const user of users) {
  user.accounts = await accountDal.findByUserId(user.id);
}

// GOOD (eager loading)
const usersWithAccounts = await userDal.findAllWithAccounts();
```

**Evidence**: `dal/transaction.dal.ts` implements `findByUserIdWithWallets()` using batch wallet fetch to avoid N+1. Uses optional `opts.db` parameter for transaction composition.

---

## Code Quality Standards

### Maintainability

- Write self-documenting code with clear naming
- Follow naming and organization conventions in codebase
- Keep functions focused on single responsibilities
- Limit complexity — match existing patterns

### Performance

- Follow existing patterns for memory/resource management
- Use caching consistently with codebase patterns
- Optimize async operations matching existing approaches
- Apply eager-loading to prevent N+1 queries

### Security

- Validate all inputs with Zod
- Use parameterized queries (Drizzle handles this)
- Never expose secrets in code or logs
- Follow authentication patterns from `lib/auth.ts`

### Accessibility

- Use shadcn/ui components (`components/ui/*`)
- Include ARIA attributes where necessary
- Follow existing accessibility patterns

### Testability

- Use MSW for deterministic network mocks in unit tests
- Use helpers in `tests/e2e/helpers/` for E2E
- Follow existing test structure

**Evidence**: `tests/e2e/helpers/plaid.mock.ts` provides mock Plaid Link injection. `lib/plaid.ts` exports `isMockAccessToken()` for deterministic test shortcuts.

---

## Testing Approach

### Unit Testing (Vitest)

- Match structure and style in `tests/**/*.test.ts`
- Use MSW for network mocking
- Example helpers: `tests/e2e/helpers/plaid.mock.ts`

### E2E Testing (Playwright)

- Run after: `npx playwright install`
- Requires: `PLAYWRIGHT_PREPARE_DB=true`
- Requires: reachable `DATABASE_URL`
- Tests assume port 3000 is free

### Test Isolation

- Free port 3000 before running tests
- Use mock tokens (`mock*`, `seed*`) for deterministic tests
- See `lib/plaid.ts` for `isMockAccessToken()` helper

**Evidence**: `package.json` scripts: `test:browser` (Vitest), `test:ui` (Playwright). `scripts/verify-rules.ts` enforces home page remains static (no auth/DB).

---

## TypeScript Guidelines

- **Strict mode** enabled in `tsconfig.json`
- **Never use `any`** — use `unknown` with type guards
- Prefer explicit return types for exported functions
- Match type definitions with existing patterns

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

**Evidence**: `tsconfig.json` sets `"strict": true`. `scripts/verify-rules.ts` uses ts-morph to detect `any` usage.

---

## Next.js 16 Specific Guidelines

### Server vs Client Components

- **Server Components** (default): Use for data fetching, heavy logic
- **Client Components**: Add `"use client"` at top for interactivity

### Cache Components

```typescript
"use cache";
cacheLife("hours");

export default async function MyPage() {
  const data = await getData();
  return <Display data={data} />;
}
```

### Suspense Boundaries

```tsx
import { Suspense } from "react";
import { Skeleton } from "./skeleton";

export default function Page() {
  return (
    <Suspense fallback={<Skeleton />}>
      <DataComponent />
    </Suspense>
  );
}
```

### Async Request APIs

In Next.js 16, these are async:

```typescript
import { cookies, headers } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const headersList = await headers();
  // ...
}
```

**Evidence**: `next.config.ts` enables `cacheComponents: true` and `reactCompiler: true`. `typedRoutes: true` enabled.

---

## Project Structure

```
app/                  # Next.js App Router pages/layouts
├── (auth)/           # Auth routes (login, register)
├── (root)/           # Protected routes
├── api/              # API routes (minimal — prefer Server Actions)
components/           # UI components (presentational only)
├── ui/               # shadcn/ui components
lib/                  # Shared libraries
├── actions/          # Server Actions
├── dal/              # Data Access Layer
database/            # Drizzle schema and DB init
scripts/             # Build, seed, verify scripts
tests/               # Unit and E2E tests
.opencode/           # Agent artifacts
```

---

## Repo Process & Planning Rules

- **Changes >7 files**: Create plan under `.opencode/commands/<name>.plan.md`
- Use `npm run plan:ensure` to scaffold
- Keep edits small and focused
- **Automated edits >5 files**: Require plan existence

---

## CI and Verify Rules

- CI runs: `verify:rules` and `lint:strict`
- Use `npm run verify:rules:ci` for JSON output
- Output: `.opencode/reports/rules-report.json`

**Evidence**: `scripts/verify-rules.ts` uses ts-morph for AST-based rule enforcement. Supports `--ci` mode that exits with code 2 on critical violations.

---

## Repository Map

A full codemap is available at `codemap.md` in the project root.

Before working on any task, read `codemap.md` to understand:

- Project architecture and entry points
- Directory responsibilities and design patterns
- Data flow and integration points

---

## Skills Available

These skills provide specialized workflows:

| Skill               | Purpose                      |
| ------------------- | ---------------------------- |
| server-action-skill | Server Action patterns       |
| dal-skill           | Drizzle ORM & DAL patterns   |
| db-skill            | Schema, migrations, queries  |
| auth-skill          | NextAuth v4 patterns         |
| plaid-skill         | Plaid API integration        |
| dwolla-skill        | Dwolla ACH integration       |
| testing-skill       | Vitest & Playwright patterns |
| ui-skill            | shadcn/ui components         |
| validation-skill    | Zod schema patterns          |
| security-skill      | Encryption & secrets         |
| deployment-skill    | Vercel, Railway, Docker      |
| suspense-skill      | Suspense boundaries          |

---

## MCP Servers

- **Playwright MCP**: Browser automation for E2E testing
- **Next.js MCP**: Available at `/_next/mcp` when dev server runs

---

## Where to Look Next

Priority sources for context:

- `package.json` — scripts, dependencies
- `app-config.ts` — typed env configuration
- `lib/env.ts` — env helpers
- `scripts/verify-rules.ts` — policy enforcement
- `.opencode/instructions/` — agent rules
- `dal/` — data access
- `actions/` — mutations
- `.github/workflows/` — CI jobs

---

## Instruction Files (Detailed References)

This file provides high-level guidance. For detailed, topic-specific instructions, refer to:

| Topic | File | Purpose |
| --- | --- | --- |
| Commands | `.opencode/instructions/00-default-rules.md` | Quick start commands |
| Code Style | `.opencode/instructions/01-core-standards.md` | Format, lint, type-check rules |
| Next.js | `.opencode/instructions/02-nextjs-patterns.md` | Server Actions, Cache Components |
| Database | `.opencode/instructions/03-dal-patterns.md` | DAL patterns, N+1 prevention |
| Auth | `.opencode/instructions/04-auth-testing.md` | Auth testing patterns |
| UI | `.opencode/instructions/05-ui-validation.md` | UI validation rules |
| Plans | `.opencode/instructions/plan-workflow.md` | Plan file standards |
| Code Philosophy | `.opencode/instructions/philosophy.md` | Mandatory philosophy loading |

Full index: `.opencode/instructions/index.md`

---

## Provenance

This file is maintained based on codebase analysis. Evidence sources:

- `package.json` — scripts, dependencies, versions
- `tsconfig.json` — TypeScript strict mode, compiler options
- `next.config.ts` — Next.js 16 features, cache components
- `app-config.ts` — typed env validation
- `lib/env.ts` — env re-exports
- `scripts/verify-rules.ts` — AST-based policy enforcement
- `dal/transaction.dal.ts` — DAL patterns with eager loading
- `actions/register.ts` — Server Action pattern
- `lib/plaid.ts` — mock token detection
- `tests/e2e/helpers/plaid.mock.ts` — E2E mock helpers
- `.opencode/instructions/*` — agent rules

---

## Contributors

This file is maintained and updated based on codebase analysis. Edits should preserve patterns observed in existing code.

_Last updated: 2026-04-24_
