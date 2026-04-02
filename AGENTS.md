# AGENTS.md — Banking Project Canonical Reference

**Last Generated:** April 2, 2026 | **Version:** 5.1 | **Total Sections:** 30

---

## Changelog

### April 2, 2026 — v5.1

- Added missing `server-action-skill.md` flat file to Section 29 skills table (was omitted from v5.0)
- Added known inaccuracy note for `.opencode/instructions/04-auth-testing.md`: it references `session.user.role !== "admin"` which does not exist on the session — `isAdmin: boolean` is the correct field
- All 9 remaining Cursor rules verified against source files; Section 27 confirmed accurate
- Confirmed `generate:action`, `generate:component`, `generate:dal`, `generate:feature` scripts exist in `package.json`; confirmed no `banking:validate` or `banking:generate` scripts exist (references in `.opencode/instructions/06` are incorrect)

### April 2, 2026 — Complete Rewrite v5.0

- Corrected GitHub Copilot instructions file table (v4.0 had fabricated filenames)
- Corrected ESLint rule table: `@typescript-eslint/no-explicit-any` is **"off"** (aspirational only)
- Expanded ESLint section: added all plugins, Zod rules (error), security rules (error), unicorn rules
- Corrected Prettier settings: `printWidth: 80` (not 100), plugins listed accurately
- Added Prettier plugin details: `prettier-plugin-tailwindcss`, `prettier-plugin-organize-imports`, `prettier-plugin-packagejson`, `prettier-plugin-sort-json`
- Added full `package.json` scripts inventory (all 65 scripts)
- Expanded Next.js 16 section: Cache Components, `cacheTag()`, `cacheLife()`, `updateTag()`, Turbopack
- Added Suspense requirement for `cookies()`, `headers()`, `getServerSession()` in Next.js 16
- Added DAL skill patterns: cursor pagination, upsert, soft delete, count with index
- Added Server Action skill patterns: file upload, `useActionState`, optimistic updates
- Added `.copilot-tracking/` task tracking workflow
- Clarified `format:check` is destructive (writes files first, then checks)
- Added `build:analyze`, `build:standalone`, `build:debug`, `dev:sh` commands
- Removed fabricated `.github/instructions/` file table; replaced with accurate listing
- Added `postbuild` runs `next-sitemap` automatically
- v4.0 changelog entries preserved below

### April 2, 2026 — v4.0

- Full replacement of v3.0 (inaccurate schema fields, session shape, env vars, debt status, action signatures)
- Corrected `database/schema.ts`: `user_profiles` has `address/city/state/postalCode/phone/dateOfBirth`
- Corrected `banks` table: includes `accountNumberEncrypted`, `routingNumber`, `sharableId`, `fundingSourceUrl`, `dwollaCustomerUrl`
- Corrected `transactions` table: `senderBankId`/`receiverBankId` FKs, `channel`, `currency`, `status`, `type` columns
- Corrected session shape: `isAdmin: boolean` + `isActive: boolean` — no `role` field on session
- Corrected env vars: 24 total; `DATABASE_URL` optional; `SMTP_PASS` not `SMTP_PASSWORD`
- Corrected `logoutAccount` return type: `Promise<boolean>`
- Corrected `getLoggedInUser` return type: `Promise<{ name?, email? } | undefined>`

---

## Table of Contents

1. Tech Stack Overview
2. Commands Reference (All 65 Scripts)
3. Single Test Execution
4. Environment Variables (24 Total)
5. PR-Blocking Rules (7 Critical)
6. TypeScript & Type Safety
7. ESLint Configuration
8. Prettier Configuration
9. Import Order
10. Naming Conventions
11. Next.js 16 Patterns
12. Cache Components (Next.js 16)
13. Suspense & Async APIs
14. Server Actions
15. Data Access Layer (DAL)
16. Authentication
17. Encryption
18. Database Schema
19. Validation (Zod v4)
20. Forms & UI
21. Testing
22. Port Guard
23. Middleware
24. Security
25. Known Technical Debt
26. Integrations
27. Cursor Rules
28. GitHub Copilot Instructions
29. OpenCode Skills & Instructions
30. External Documentation & Sync Checklist

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

- **React Compiler:** Enabled — automatic memoization; no manual `useMemo`/`useCallback` needed
- **Cache Components:** Enabled — requires Next.js 16+ (`"use cache"` directive)
- **Typed Routes:** Enabled in `tsconfig.json` — compile-time route safety
- **Async Request APIs:** `cookies()`, `headers()`, `params`, `searchParams` are async in Next.js 16
- **Turbopack:** Default dev bundler (`next dev` uses Turbopack automatically)
- **Security Headers:** Configured in `next.config.ts`
- **ESLint `noInlineConfig: true`:** Inline `// eslint-disable` comments have **NO EFFECT** anywhere

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

## 2. Commands Reference (All 65 Scripts)

All commands defined in `package.json` scripts.

### Development

```bash
npm run dev              # Start dev server (localhost:3000) — Turbopack default
npm run dev:sh           # Dev via shell script (./dev.sh)
npm run build            # Production build (type-check runs automatically via prebuild)
npm run build:analyze    # Production build with bundle analyzer (ANALYZE=true)
npm run build:debug      # Debug prerender build
npm run build:standalone # Standalone output build (NEXT_OUTPUT_MODE=standalone)
npm run start            # Start production server
npm run clean            # Clean: .next out dist build .turbo coverage .react-email playwright-report test-results
npm run clean:all        # Full clean: also removes node_modules and package-lock.json
npm run clean:cache      # Cache-only clean: .next/cache playwright-report test-results
```

> **Note:** `predev` and `prebuild` both run `npm run clean && npm run type-check` automatically. `postbuild` runs `next-sitemap --config next-sitemap.config.ts` automatically after every build. `pretest` runs `npm run clean && npm run type-gen` (next typegen — **NOT** type-check).

### Validation (Run Before Every Commit)

```bash
npm run validate         # All checks: format:check + type-check + lint:strict + test
npm run format           # Auto-format with Prettier (WRITES FILES)
npm run format:check     # Runs format (writes!) THEN checks — NOT read-only
npm run type-check       # TypeScript strict mode check (tsc --noEmit --pretty)
npm run type-check:watch # TypeScript watch mode
npm run lint             # ESLint (warnings allowed, compact output)
npm run lint:fix         # ESLint with auto-fix
npm run lint:fix:all     # ESLint with all fix types (directive, problem, suggestion, layout)
npm run lint:strict      # ESLint (zero warnings — PR-blocking)
```

> **CRITICAL:** `npm run format:check` is **destructive** — it runs `npm run format` first (which writes files), then runs `prettier --check`. It is NOT a read-only check. Run `npm run format` first to pre-format before checking if you want to avoid surprises.

### Database

```bash
npm run db:push          # Push schema changes to database (no migration file)
npm run db:migrate       # Run pending migrations
npm run db:generate      # Generate new migration file from schema diff
npm run db:check         # Check schema/migration consistency
npm run db:studio        # Open Drizzle Studio GUI at localhost:8000
npm run db:seed          # Seed database with test/dev data
npm run db:reset         # Full reset: db:drop + db:generate + db:push
npm run db:drop          # Drop all tables
npm run db:pull          # Introspect DB schema (drizzle-kit introspect)
```

> **Warning:** `db:reset` does **not** seed. Run `npm run db:seed` separately after reset.

### Testing

```bash
npm run test             # All tests: test:browser && test:ui (sequential)
npm run test:browser     # Vitest unit/integration tests only
npm run test:ui          # Playwright E2E tests (Chromium, 1 worker, PLAYWRIGHT_PREPARE_DB=true)
npm run test:ui:codegen  # Playwright codegen (record new tests)
npm run test:ui:report   # Show last Playwright HTML report
```

### Code Generation

```bash
npm run type-gen          # next typegen (typed routes)
npm run generate:action   # Scaffold a new Server Action
npm run generate:component # Scaffold a new React component
npm run generate:dal      # Scaffold a new DAL file
npm run generate:feature  # Scaffold a full feature (action + DAL + component)
```

### Registry & Website

```bash
npm run registry:build        # generate + export registry
npm run registry:generate     # Generate README from registry
npm run registry:generate:readme # Generate all READMEs
npm run registry:export       # Export registry to dist/registry.json
npm run registry:validate     # Validate registry entries
npm run website:build         # Build main app + website data + website
npm run website:dev           # Serve website data + run website dev server
npm run website:preview       # Preview website build
```

### Markdown & Contributors

```bash
npm run check:markdown    # Run markdownlint-cli2 (read-only check)
npm run fix:markdown      # Run markdownlint-cli2 --fix (auto-fix markdown)
npm run contributors:add  # Add a contributor via all-contributors
npm run contributors:check # Check for missing contributors
npm run contributors:generate # Regenerate contributors section
npm run check-updates     # Check for npm package updates (interactive)
npm run export:data       # Export data via tsx scripts/export-data.ts
npm run upstash           # Run Upstash QStash dev proxy
```

---

## 3. Single Test Execution

```bash
# Run a single Vitest file
npm exec vitest run tests/unit/register.test.ts

# Run Vitest tests matching a pattern
npm exec vitest run --reporter=verbose tests/unit/

# Run a single Playwright spec
npm exec playwright test tests/e2e/auth.spec.ts

# Run Playwright with UI mode
npm exec playwright test --ui

# Run Playwright with headed browser (visible)
npm exec playwright test --headed tests/e2e/auth.spec.ts

# Run Playwright with specific grep pattern
npm exec playwright test --grep "sign-in"
```

> **Always free port 3000 before running tests.** See Section 22 (Port Guard).

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

> **Note:** `DATABASE_URL` is **optional** in `lib/env.ts` — the app does not crash at startup if absent, but all DB operations will fail at runtime.

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

> **Note:** `SMTP_FROM` / `EMAIL_FROM` — verify against current `lib/env.ts` before use.

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

> ESLint enforces this: `no-restricted-syntax` rule bans `process.env` access outside `lib/env.ts` and config files (`next.config.ts`, `eslint.config.mts`, `vitest.config.ts`, etc.).

---

## 5. PR-Blocking Rules (7 Critical)

These rules are enforced by CI/CD. PRs will be blocked if any are violated.

| # | Rule | Violation | Enforcement |
| --- | --- | --- | --- |
| 1 | No `any` types | Use `unknown` + type guards | TypeScript strict + aspirational ESLint |
| 2 | No N+1 queries | Use JOINs / eager loading | Code review |
| 3 | No raw `process.env` | Use `lib/env.ts` | ESLint `no-restricted-syntax` (error) |
| 4 | Mutations via Server Actions only | Never in API routes | Code review |
| 5 | Zero TypeScript errors | `npm run type-check` must pass | CI |
| 6 | Zero lint warnings | `npm run lint:strict` must pass | CI |
| 7 | All tests pass | `npm run test` must pass | CI |

---

## 6. TypeScript & Type Safety

### Compiler Settings (`tsconfig.json`)

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "moduleResolution": "bundler",
    "strict": true,
    "noEmit": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    "paths": { "@/*": ["./*"] }
  }
}
```

Key flags active under `"strict": true`:

- `strictNullChecks` — non-nullable by default
- `noImplicitAny` — implicit `any` is a type error
- `strictFunctionTypes`, `strictBindCallApply`, `strictPropertyInitialization`

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

> **Note on ESLint enforcement:** `@typescript-eslint/no-explicit-any` is set to `"off"` in `eslint.config.mts`. The no-`any` requirement is enforced by TypeScript's `noImplicitAny` (compile-time implicit any) and by code review. Explicit `any` casts are discouraged but not blocked by ESLint. Use `unknown` consistently for new code.

---

## 7. ESLint Configuration

### `noInlineConfig: true` — CRITICAL WARNING

The ESLint config sets `noInlineConfig: true` globally. This means:

- `// eslint-disable-next-line` — **ignored, has absolutely no effect**
- `// eslint-disable` — **ignored, has absolutely no effect**
- `/* eslint-disable @typescript-eslint/no-explicit-any */` — **ignored, has absolutely no effect**
- `reportUnusedDisableDirectives: true` — any leftover disable comments are flagged as errors

**The ONLY way to suppress an ESLint rule is to modify `eslint.config.mts`.**

```typescript
// eslint.config.mts — the ONLY valid suppression method
{
  files: ["lib/dal/base.dal.ts"],
  rules: {
    "@typescript-eslint/no-explicit-any": "off",
  },
}
```

### Config File

`eslint.config.mts` (flat config format, ESLint v9+)

### Active Plugins

| Plugin | Package | Purpose |
| --- | --- | --- |
| `@typescript-eslint` | `@typescript-eslint/eslint-plugin` | TypeScript-specific rules |
| `better-tailwindcss` | `eslint-plugin-better-tailwindcss` | Tailwind class ordering |
| `drizzle` | `eslint-plugin-drizzle` | Drizzle ORM safety rules |
| `import-x` | `eslint-plugin-import-x` | Import ordering and resolution |
| `jest` | `eslint-plugin-jest` | Jest-compatible test rules |
| `perfectionist` | `eslint-plugin-perfectionist` | Code ordering rules |
| `playwright` | `eslint-plugin-playwright` | Playwright-specific rules |
| `react` | `eslint-plugin-react` | React rules |
| `react-hooks` | `eslint-plugin-react-hooks` | Hooks rules |
| `react-refresh` | `eslint-plugin-react-refresh` | Fast refresh rules |
| `security` | `eslint-plugin-security` | Security best practices |
| `sonarjs` | `eslint-plugin-sonarjs` | Code smell detection |
| `testing-library` | `eslint-plugin-testing-library` | Testing Library rules |
| `unicorn` | `eslint-plugin-unicorn` | Opinionated best practices |
| `vitest` | `eslint-plugin-vitest` | Vitest-specific rules |
| `zod` | `eslint-plugin-zod` | Zod schema best practices |

### Key Rules — Errors (Blocking)

| Rule | Level | Notes |
| --- | --- | --- |
| `no-var` | error | Use `const`/`let` only |
| `prefer-const` | error | Prefer `const` where possible |
| `curly` | error | Always use braces |
| `no-debugger` | error | No `debugger` statements |
| `no-unreachable` | error | No unreachable code |
| `no-unsafe-negation` | error | Catches `!x in y` mistakes |
| `no-unsafe-optional-chaining` | error | Catches `?.()` misuse |
| `react-hooks/rules-of-hooks` | error | Hooks only in components/hooks |
| `security/detect-eval-with-expression` | error | No `eval()` with expressions |
| `security/detect-non-literal-fs-filename` | error | No dynamic file paths |
| `security/detect-non-literal-require` | error | No dynamic `require()` |
| `security/detect-unsafe-regex` | error | No ReDoS-vulnerable regex |
| `unicorn/no-abusive-eslint-disable` | error | No inline disable comments (redundant with `noInlineConfig`) |
| `unicorn/prefer-includes` | error | Use `.includes()` over `.indexOf() !== -1` |
| `unicorn/prefer-string-slice` | error | Use `.slice()` over `.substring()` |
| `unicorn/throw-new-error` | error | Always `throw new Error(...)` |
| `unicorn/filename-case` | error | camelCase, kebabCase, or pascalCase filenames |
| `zod/no-any-schema` | error | No `z.any()` in Zod schemas |
| `zod/no-empty-custom-schema` | error | No empty `.refine()` calls |
| `zod/no-optional-and-default-together` | error | No `.optional().default()` combo |
| `zod/no-unknown-schema` | error | No `z.unknown()` in schemas |
| `zod/prefer-meta` | error | Add `.describe()` or `.meta()` to schemas |
| `zod/require-error-message` | error | All Zod validations need error messages |
| `drizzle/enforce-delete-with-where` | error | Always use `.where()` on `.delete()` |
| `drizzle/enforce-update-with-where` | error | Always use `.where()` on `.update()` |

> **Drizzle rules** apply only to files matching `**/dal/**/*.ts`, `**/database/**/*.ts`, `**/actions/**/*.ts`, and similar DB-touching paths. Check `eslint.config.mts` for exact file globs.

### Key Rules — Warnings

| Rule | Level | Notes |
| --- | --- | --- |
| `@typescript-eslint/explicit-function-return-type` | warn | Exported functions need return types |
| `import/order` | warn | Canonical import ordering |
| `react-hooks/exhaustive-deps` | warn | Dependency array completeness |

> Warnings become **errors** under `npm run lint:strict` (`--max-warnings=0`).

### File-Scoped Overrides (Notable)

| Files | Override |
| --- | --- |
| `lib/dal/base.dal.ts` | `@typescript-eslint/no-explicit-any: "off"` — intentional for Drizzle generics |
| `lib/env.ts`, `next.config.ts`, config files | `no-restricted-syntax` (process.env) disabled |
| `scripts/seed/**` | Relaxed rules for seed scripts |
| `tests/**` | `jest/*`, `vitest/*`, `playwright/*`, `testing-library/*` rules active |
| `components/ui/**` | Relaxed rules for shadcn/ui generated components |
| `lib/actions/**` | Server Action-specific overrides |

---

## 8. Prettier Configuration

Config file: `.prettierrc.ts`

### Settings

```typescript
{
  printWidth: 80,              // Line wrap at 80 chars (NOT 100)
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: false,          // double quotes
  jsxSingleQuote: false,       // double quotes in JSX
  trailingComma: "all",
  endOfLine: "lf",
  bracketSpacing: true,
  bracketSameLine: false,      // JSX closing > on its own line
  arrowParens: "always",
}
```

### Active Plugins

| Plugin                             | Purpose                     |
| ---------------------------------- | --------------------------- |
| `prettier-plugin-tailwindcss`      | Auto-sort Tailwind classes  |
| `prettier-plugin-organize-imports` | Auto-sort imports on format |
| `prettier-plugin-packagejson`      | Sort `package.json` keys    |
| `prettier-plugin-sort-json`        | Sort JSON files             |

### Tailwind Plugin Config

```typescript
tailwindFunctions: ["clsx", "cn", "cva", "twMerge", "twJoin", "tw"],
tailwindStylesheet: "./app/globals.css",
```

### Per-File Overrides

| Pattern | Override |
| --- | --- |
| `*.md` | `printWidth: 70`, `proseWrap: never`, `trailingComma: none` |
| `*.json` | `printWidth: 70` |
| `*.yaml`, `*.yml` | `tabWidth: 2` |

### CRITICAL: `format:check` is Destructive

```bash
# format:check script is:
npm run format && prettier --config .prettierrc.ts --check .
```

It runs `npm run format` (which **writes** files) FIRST, then checks. It is NOT a read-only operation. If you want to see what would change without modifying files, do NOT use `format:check` — use `prettier --check .` directly.

---

## 9. Import Order

Enforced by `import-x` ESLint plugin. Violations are `warn` (become errors under `lint:strict`). `prettier-plugin-organize-imports` also re-sorts on every `format` run.

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

Enforced by `unicorn/filename-case` (error): allows camelCase, kebabCase, and pascalCase.

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
| Zod schemas | camelCase + `Schema` suffix | `registerSchema`, `updateProfileSchema` |
| Server Actions files | camelCase + `.actions.ts` | `user.actions.ts`, `bank.actions.ts` |
| DAL files | camelCase + `.dal.ts` | `user.dal.ts`, `bank.dal.ts` |

---

## 11. Next.js 16 Patterns

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
├── auth-options.ts            # NextAuth config (JWT strategy — ACTIVE)
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

### Server vs Client Components

**Server Components (default)** — use for data fetching, heavy logic, non-interactive UI:

```tsx
// app/(root)/dashboard/page.tsx
import { getUserBanks } from "@/lib/actions/bank.actions";

export default async function DashboardPage(): Promise<React.JSX.Element> {
  const result = await getUserBanks();
  if (!result.ok) return <div>Error loading banks</div>;
  return <BankList banks={result.banks ?? []} />;
}
```

**Client Components** — add `"use client"` for interactivity, hooks, browser APIs:

```tsx
"use client";

import { useState } from "react";

export function TransferForm(): React.JSX.Element {
  const [amount, setAmount] = useState("");
  return (
    <input value={amount} onChange={e => setAmount(e.target.value)} />
  );
}
```

### Page Component Signature (Next.js 16)

`params` and `searchParams` are **Promises** in Next.js 16:

```tsx
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

### Route Handlers

```typescript
// app/api/example/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest
): Promise<NextResponse> {
  return NextResponse.json({ status: "ok" });
}
```

---

## 12. Cache Components (Next.js 16)

Cache Components are enabled in this project. Use the `"use cache"` directive for server-side data memoization. This is the recommended caching strategy over `unstable_cache` (legacy).

### Basic Usage

```typescript
"use cache";
import { cacheLife } from "next/dist/server/use-cache/cache-life";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";

cacheLife("hours");
cacheTag("banks");

export async function getCachedBanks(userId: string) {
  return getUserBanks(userId);
}
```

### Cache Profiles

| Profile     | Stale Time | Revalidate |
| ----------- | ---------- | ---------- |
| `"seconds"` | 1s         | 1s         |
| `"minutes"` | 1min       | 1min       |
| `"hours"`   | 1hr        | 1hr        |
| `"days"`    | 1day       | 1day       |
| `"weeks"`   | 1week      | 1week      |
| `"max"`     | Maximum    | Maximum    |

### Cache Revalidation

```typescript
import { revalidateTag } from "next/cache";
import { unstable_updateTag as updateTag } from "next/cache";

// In Server Actions after mutations — prefer updateTag for immediate consistency
updateTag("banks");

// For background (stale-while-revalidate) revalidation
revalidateTag("banks");
// or
revalidateTag("banks", "max");
```

### Rules for Cache Components

- Functions with `"use cache"` must be **async**
- Cache functions cannot use request-time data (cookies, headers) directly — pass as arguments
- Each `cacheTag()` call registers a tag for later invalidation
- Use `updateTag()` inside Server Actions after mutations (immediate consistency)
- Use `revalidateTag()` for background revalidation

### Legacy: `unstable_cache`

`unstable_cache` is the legacy API. Prefer `"use cache"` for all new code.

---

## 13. Suspense & Async APIs (Next.js 16)

In Next.js 16, several APIs are **async** and reading them suspends the component tree. Always wrap components that use these APIs in `<Suspense>` boundaries.

### Async APIs

```typescript
import { cookies, headers } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

// These are async in Next.js 16:
const cookieStore = await cookies();
const headersList = await headers();
const session = await getServerSession(authOptions);
```

### Suspense for Protected Pages

```tsx
// app/(root)/layout.tsx
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

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

### Suspense for Data-Fetching Components

```tsx
import { Suspense } from "react";

export default function Page(): React.JSX.Element {
  return (
    <Suspense fallback={<BankListSkeleton />}>
      <BankList />
    </Suspense>
  );
}

async function BankList(): Promise<React.JSX.Element> {
  const result = await getUserBanks(); // suspends here
  if (!result.ok) return <div>Error</div>;
  return (
    <ul>
      {result.banks?.map(bank => (
        <BankCard key={bank.id} bank={bank} />
      ))}
    </ul>
  );
}
```

### Loading Files

Use `loading.tsx` for automatic Suspense wrapping at the route level:

```tsx
// app/(root)/dashboard/loading.tsx
export default function DashboardLoading(): React.JSX.Element {
  return <DashboardSkeleton />;
}
```

---

## 14. Server Actions

**All mutations must be implemented as Server Actions.** Never place mutation logic in API routes.

### Canonical Template

```typescript
"use server";

import { z } from "zod";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { unstable_updateTag as updateTag } from "next/cache";

const InputSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name too long")
});

export async function doSomething(
  input: unknown
): Promise<{ ok: boolean; error?: string }> {
  // 1. Validate input FIRST (before auth for public-safe validation)
  const parsed = InputSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.message };
  }

  // 2. Auth check
  const session = await auth();
  if (!session?.user) {
    return { ok: false, error: "Unauthorized" };
  }

  // 3. Authorization check (if admin-only)
  if (!session.user.isAdmin) {
    return { ok: false, error: "Forbidden" };
  }

  // 4. Execute mutation
  try {
    await someDAL.create(parsed.data);
    // 5. Revalidate caches
    revalidatePath("/relevant-path");
    updateTag("relevant-tag");
    return { ok: true };
  } catch {
    return { ok: false, error: "Server error" };
  }
}
```

> **Exception:** `disconnectBank` in `lib/actions/bank.actions.ts` intentionally validates BEFORE auth — this is a documented deviation from the template for that specific action.

### File Upload Action

```typescript
"use server";

import { z } from "zod";
import { auth } from "@/lib/auth";

const UploadSchema = z.object({
  fileName: z.string().min(1, "File name required"),
  fileSize: z.number().max(5 * 1024 * 1024, "Max 5MB"),
  fileType: z.enum(["image/jpeg", "image/png"], {
    message: "Only JPEG or PNG allowed"
  })
});

export async function uploadAvatar(
  formData: FormData
): Promise<{ ok: boolean; url?: string; error?: string }> {
  const session = await auth();
  if (!session?.user) return { ok: false, error: "Unauthorized" };

  const file = formData.get("file") as File | null;
  if (!file) return { ok: false, error: "No file provided" };

  const parsed = UploadSchema.safeParse({
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type
  });
  if (!parsed.success)
    return { ok: false, error: parsed.error.message };

  // ... upload logic
  return { ok: true, url: "/path/to/uploaded-file" };
}
```

### Optimistic Updates with `useActionState`

```tsx
"use client";

import { useActionState } from "react";
import { doSomething } from "@/lib/actions/example.actions";

const initialState = {
  ok: false as boolean,
  error: undefined as string | undefined
};

export function OptimisticForm(): React.JSX.Element {
  const [state, formAction, isPending] = useActionState(
    doSomething,
    initialState
  );

  return (
    <form action={formAction}>
      <input name="name" required />
      {state.error && (
        <p className="text-destructive">{state.error}</p>
      )}
      <button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Save"}
      </button>
    </form>
  );
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

`RegisterSchema` fields: `email`, `name`, `password`, `confirmPassword`

#### `lib/actions/updateProfile.ts`

| Function | Signature | Notes |
| --- | --- | --- |
| `updateProfile` | `(input: unknown): Promise<{ ok: boolean; error?: string }>` | userId from session only |

`UpdateProfileSchema` fields: `address?`, `city?`, `email?`, `image?`, `name?`, `newPassword?`, `password?`, `phone?`, `postalCode?`, `state?`

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
| `disconnectBank` | `(bankId: string): Promise<{ ok: boolean; error?: string }>` | Validates BEFORE auth — intentional |

#### `lib/actions/plaid.actions.ts`

| Function | Signature | Notes |
| --- | --- | --- |
| `createLinkToken` | `(input: unknown) => Promise<{ ok: boolean; linkToken?: string; error?: string }>` |  |
| `exchangePublicToken` | `(input: unknown) => Promise<{ ok: boolean; bank?: Bank; error?: string }>` |  |
| `getAccounts` | `(input: unknown) => Promise<{ ok: boolean; accounts?: PlaidAccount[]; error?: string }>` |  |
| `getTransactions` | `(input: unknown) => Promise<{ ok: boolean; transactions?: PlaidTransaction[]; totalTransactions?: number; error?: string }>` |  |
| `getBalance` | `(input: unknown) => Promise<{ ok: boolean; balances?: PlaidBalance[]; error?: string }>` |  |
| `getAllBalances` | `() => Promise<{ ok: boolean; balances?: Record<string, PlaidBalance[]>; error?: string }>` | **DEBT #4**: N+1 |
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

## 15. Data Access Layer (DAL)

All database access must go through `lib/dal/`. Never query the database directly from Server Actions or components.

### File Structure

```
lib/dal/
├── base.dal.ts          # Generic base class (findById, findAll, deleteById)
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
// Internal `as any` casts are intentional — Drizzle's generic table type cannot be
// satisfied with a bare generic. ESLint disabled for this file in eslint.config.mts.

import type {
  AnyPgTable,
  InferSelectModel
} from "drizzle-orm/pg-core";
import { eq } from "drizzle-orm";
import { db } from "@/database/db";

export class BaseDal<T extends AnyPgTable> {
  constructor(protected table: T) {}

  async findById(
    id: string
  ): Promise<InferSelectModel<T> | undefined> {
    const rows = await db
      .select()
      .from(this.table as Parameters<typeof db.select>[0])
      .where(
        eq(
          (this.table as Record<string, unknown>).id as Parameters<
            typeof eq
          >[0],
          id
        )
      )
      .limit(1);
    return rows[0] as InferSelectModel<T> | undefined;
  }

  async findAll(): Promise<InferSelectModel<T>[]> {
    return db
      .select()
      .from(this.table as Parameters<typeof db.select>[0]) as Promise<
      InferSelectModel<T>[]
    >;
  }

  async deleteById(id: string): Promise<void> {
    await db
      .delete(this.table as Parameters<typeof db.delete>[0])
      .where(
        eq(
          (this.table as Record<string, unknown>).id as Parameters<
            typeof eq
          >[0],
          id
        )
      );
  }
}
```

### DAL Implementation Pattern

```typescript
// lib/dal/user.dal.ts
import { eq } from "drizzle-orm";
import { db } from "@/database/db";
import { users } from "@/database/schema";
import { BaseDal } from "./base.dal";
import type { InferSelectModel } from "drizzle-orm";

type User = InferSelectModel<typeof users>;

export class UserDal extends BaseDal<typeof users> {
  constructor() {
    super(users);
  }

  async findByEmail(email: string): Promise<User[]> {
    return db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
  }

  async create(
    data: Omit<User, "id" | "createdAt" | "updatedAt">
  ): Promise<User> {
    const [user] = await db.insert(users).values(data).returning();
    return user;
  }

  async update(
    id: string,
    data: Partial<User>
  ): Promise<User | undefined> {
    const [updated] = await db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return updated;
  }
}

export const userDal = new UserDal();
```

### N+1 Prevention — CRITICAL

**NEVER query inside a loop.** Use JOINs or batch queries:

```typescript
// BAD — N+1
const banks = await bankDal.findByUserId(userId);
for (const bank of banks) {
  const transactions = await transactionDal.findByBankId(bank.id); // N+1!
}

// GOOD — single JOIN
import { banks, transactions } from "@/database/schema";

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

### Upsert Pattern

```typescript
import { sql } from "drizzle-orm";

await db
  .insert(userProfiles)
  .values({ userId, address, city })
  .onConflictDoUpdate({
    target: userProfiles.userId,
    set: { address, city, updatedAt: sql`now()` }
  });
```

### Cursor Pagination Pattern

```typescript
export async function findTransactionsCursor(
  userId: string,
  cursor: string | undefined,
  limit: number
): Promise<{ items: Transaction[]; nextCursor: string | undefined }> {
  const conditions = cursor
    ? and(
        eq(transactions.userId, userId),
        lt(transactions.id, cursor)
      )
    : eq(transactions.userId, userId);

  const items = await db
    .select()
    .from(transactions)
    .where(conditions)
    .orderBy(desc(transactions.createdAt))
    .limit(limit + 1);

  const hasMore = items.length > limit;
  return {
    items: hasMore ? items.slice(0, limit) : items,
    nextCursor: hasMore ? items[limit - 1]?.id : undefined
  };
}
```

### Soft Delete Pattern

```typescript
// Instead of hard delete, set a deletedAt timestamp
await db
  .update(someTable)
  .set({ deletedAt: new Date() })
  .where(eq(someTable.id, id));

// Query active records only
const activeRecords = await db
  .select()
  .from(someTable)
  .where(isNull(someTable.deletedAt));
```

---

## 16. Authentication

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
// Session user shape — CONFIRMED (no `role` field on session)
interface Session {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    isAdmin: boolean; // boolean (NOT a role string)
    isActive: boolean; // boolean
    // NOTE: `role` enum is DB-only, NOT on session
  };
}

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

export async function protectedAction(
  input: unknown
): Promise<{ ok: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user) {
    return { ok: false, error: "Unauthorized" };
  }
  const userId = session.user.id;
  // ...
}
```

### Admin Guard

```typescript
export async function adminOnlyAction(
  input: unknown
): Promise<{ ok: boolean; error?: string }> {
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

### NextAuth Route Handler

```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth-options";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

---

## 17. Encryption

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

### Encrypted Fields in Schema

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

## 18. Database Schema

Schema defined in `database/schema.ts`. Ten tables + one enum.

### `userRole` Enum

```typescript
export const userRole = pgEnum("user_role", [
  "user",
  "admin",
  "moderator"
]);
```

> **IMPORTANT:** The `role` enum field exists on the `users` DB table only. It is **NOT** exposed on the NextAuth session. Sessions use `isAdmin: boolean` and `isActive: boolean` instead.

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

> Corrected from v3.0 — fields are address/city/state/postalCode/phone/dateOfBirth.

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

## 19. Validation (Zod v4)

The project uses Zod v4.3.6. All user inputs must be validated before processing.

### ESLint-Enforced Zod Rules

These are **errors** (not warnings) — violating them blocks `lint:strict`:

| Rule | Requirement |
| --- | --- |
| `zod/no-any-schema` | No `z.any()` |
| `zod/no-empty-custom-schema` | No empty `.refine()` |
| `zod/no-optional-and-default-together` | No `.optional().default()` combo |
| `zod/no-unknown-schema` | No `z.unknown()` in schemas |
| `zod/prefer-meta` | Add `.describe()` metadata |
| `zod/require-error-message` | All validations need error messages |

### Schema Patterns

```typescript
import { z } from "zod";

// String fields — always include error messages (required by zod/require-error-message)
const nameSchema = z
  .string()
  .min(1, "Name is required")
  .max(100, "Name too long")
  .describe("User display name");

const emailSchema = z
  .string()
  .email("Invalid email address")
  .describe("User email");

const urlSchema = z
  .string()
  .url("Invalid URL")
  .describe("Resource URL");

const uuidSchema = z
  .string()
  .uuid("Invalid ID")
  .describe("Resource identifier");

// Numeric fields (coerce for form inputs)
const amountSchema = z.coerce
  .number()
  .min(0.01, "Amount must be positive")
  .describe("Transfer amount");

const pageSchema = z.coerce
  .number()
  .int("Must be integer")
  .min(1, "Min page 1")
  .default(1);

// Optional fields
const optionalPhone = z
  .string()
  .optional()
  .describe("Phone number (optional)");

// Enum
const statusSchema = z
  .enum(["pending", "completed", "failed"], {
    message: "Invalid status"
  })
  .describe("Transaction status");

// Object with refinement
const transferSchema = z
  .object({
    senderBankId: z
      .string()
      .min(1, "Sender bank required")
      .describe("Sender bank ID"),
    receiverBankId: z
      .string()
      .min(1, "Receiver bank required")
      .describe("Receiver bank ID"),
    amount: z.coerce
      .number()
      .min(0.01, "Amount must be positive")
      .describe("Transfer amount")
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
  email: z
    .string()
    .email("Invalid email")
    .describe("Recipient email"),
  amount: z.coerce
    .number()
    .min(0.01, "Amount must be positive")
    .describe("Payment amount")
});

export async function processPayment(
  input: unknown
): Promise<{ ok: boolean; error?: string }> {
  const parsed = InputSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.message };
  }
  const { email, amount } = parsed.data; // fully typed
  // ...
}
```

### Common Schemas

| Schema | File | Fields |
| --- | --- | --- |
| `RegisterSchema` | `lib/actions/register.ts` | `email`, `name`, `password`, `confirmPassword` |
| `UpdateProfileSchema` | `lib/actions/updateProfile.ts` | `address?`, `city?`, `email?`, `image?`, `name?`, `newPassword?`, `password?`, `phone?`, `postalCode?`, `state?` |
| `ToggleAdminSchema` | `lib/actions/admin.actions.ts` | `userId`, `makeAdmin` |
| `SetActiveSchema` | `lib/actions/admin.actions.ts` | `userId`, `isActive` |

---

## 20. Forms & UI

### shadcn/ui Components

Components live in `components/ui/`. All styled with Tailwind CSS v4.

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
  amount: z.coerce
    .number()
    .min(0.01, "Amount must be positive")
    .describe("Transfer amount"),
  recipientEmail: z
    .string()
    .email("Invalid email")
    .describe("Recipient email address")
});

type FormValues = z.infer<typeof formSchema>;

export function PaymentForm(): React.JSX.Element {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { amount: 0, recipientEmail: "" }
  });

  async function onSubmit(values: FormValues): Promise<void> {
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
        <FormField
          control={form.control}
          name="recipientEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Recipient Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="user@example.com"
                  {...field}
                />
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
          {form.formState.isSubmitting
            ? "Processing..."
            : "Send Payment"}
        </Button>
      </form>
    </Form>
  );
}
```

### Tailwind CSS v4

Tailwind v4 uses CSS-based configuration via `@theme` in `app/globals.css`:

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  --color-primary: oklch(0.6 0.2 240);
  --font-sans: "Inter", sans-serif;
}
```

> No `tailwind.config.js` — configuration is in CSS only. The `tailwindStylesheet` Prettier plugin option points to `./app/globals.css` for class sorting.

---

## 21. Testing

### Framework Overview

| Framework | Version | Purpose | Config |
| --- | --- | --- | --- |
| Vitest | 4.1.2 | Unit + integration tests (happy-dom) | `vitest.config.ts` |
| Playwright | 1.59.1 | E2E browser tests (Chromium only) | `playwright.config.ts` |

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
│       └── auth.ts
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
- `pretest` runs `npm run clean && npm run type-gen` (next typegen — NOT type-check)

### Auth Mock Pattern — CONFIRMED PATTERN

```typescript
// CORRECT: use undefined, NOT null
vi.mock("@/lib/auth", () => ({
  auth: vi.fn().mockResolvedValue(undefined)
}));
```

---

## 22. Port Guard

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

## 23. Middleware

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

> **Note:** Middleware must live at the **project root** (`proxy.ts`), NOT inside `app/`.

---

## 24. Security

### Input Sanitization

All user input must pass through Zod validation before any DB or external API call:

```typescript
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

Configured in `next.config.ts` via `headers()`:

| Header                   | Value                             |
| ------------------------ | --------------------------------- |
| `X-Content-Type-Options` | `nosniff`                         |
| `X-Frame-Options`        | `DENY`                            |
| `X-XSS-Protection`       | `1; mode=block`                   |
| `Referrer-Policy`        | `strict-origin-when-cross-origin` |
| `Permissions-Policy`     | Limited feature access            |

### ESLint Security Rules (Errors)

- `security/detect-eval-with-expression` — no `eval()` with dynamic input
- `security/detect-non-literal-fs-filename` — no dynamic file paths
- `security/detect-non-literal-require` — no dynamic `require()`
- `security/detect-unsafe-regex` — no ReDoS-vulnerable regex patterns

### Rate Limiting

Via `lib/rate-limit.ts` using Upstash Redis. Gracefully skipped if `REDIS_URL` is absent. Apply to auth routes and sensitive mutations:

```typescript
import { ratelimit } from "@/lib/rate-limit";
import { headers } from "next/headers";

export async function sensitiveAction(input: unknown) {
  if (ratelimit) {
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") ?? "127.0.0.1";
    const { success } = await ratelimit.limit(ip);
    if (!success) return { ok: false, error: "Too many requests" };
  }
  // ...
}
```

### CSRF Protection

NextAuth.js handles CSRF automatically for auth endpoints. For custom Server Actions, rely on the same-origin constraint of `fetch` + `credentials: "include"`.

---

## 25. Known Technical Debt

| # | Location | Issue | Severity | Status |
| --- | --- | --- | --- | --- |
| 1 | `lib/dal/base.dal.ts` | Internal `as any` casts remain (intentional, ESLint disabled for file) | Low | Substantially resolved |
| 2 | `lib/actions/admin.actions.ts` | Auth + isAdmin guard added; signature changed to `input: unknown` | — | **RESOLVED** |
| 3 | `lib/actions/updateProfile.ts` | userId now sourced from session only | — | **RESOLVED** |
| 4 | `lib/actions/plaid.actions.ts` | `getAllBalances()` N+1 — calls Plaid per bank in `Promise.all` loop | Medium | Open |
| 5 | `proxy.ts` | `app/middleware.ts` deleted; no root middleware — routes unprotected at edge | Critical | Partially resolved |
| 6 | `lib/auth-options.ts` + `lib/auth-config.ts` | Two conflicting auth configs (JWT vs database strategy) | Critical | Open |
| 7 | `app/api/health/route.ts` | DB/Redis health checks always return `true` (stub, not real) | Low | Open |
| 8 | `types/index.d.ts` | Legacy types with numeric `id` conflict with Drizzle string IDs | Medium | Open |
| 9 | `app/(root)/layout.tsx` | `user as unknown as User` unsafe cast — legacy type mismatch | Low | Open |

---

## 26. Integrations

### Plaid

Configured via `PLAID_CLIENT_ID`, `PLAID_SECRET`, `PLAID_ENV`, `PLAID_BASE_URL`.

Flow: `createLinkToken` → user completes Plaid Link UI → `exchangePublicToken` → bank record created.

```typescript
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

Flow: `createDwollaCustomer` → store `customerUrl` → `createFundingSource` → store `fundingSourceUrl` → `createOnDemandAuthorization` → `createTransfer`.

### Upstash Redis (Rate Limiting)

Configured via `REDIS_URL`. If absent, `lib/rate-limit.ts` silently skips all rate limit checks:

```typescript
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { env } from "@/lib/env";

export const ratelimit = env.REDIS_URL
  ? new Ratelimit({
      redis: new Redis({ url: env.REDIS_URL }),
      limiter: Ratelimit.slidingWindow(10, "10 s")
    })
  : null;
```

### SMTP Email

Configured via `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`. Optional:

```typescript
import { sendEmail } from "@/lib/email";

await sendEmail({
  to: "user@example.com",
  subject: "Transfer Complete",
  html: "<p>Your transfer was completed.</p>"
});
```

---

## 27. Cursor Rules

Cursor rules live in `.cursor/rules/` (12 files, `.mdc` format). They are enforced during Cursor AI sessions but apply broadly as coding standards.

| File | Summary |
| --- | --- |
| `banking-coding-standards.mdc` | Core: no `any`, no `process.env`, Server Actions for mutations, no N+1 |
| `typescript-no-any.mdc` | Disallow `any`, require `unknown` + type guards, explicit return types |
| `env-access-via-lib-env.mdc` | Ban `process.env` — use `lib/env.ts` exclusively |
| `mutations-via-server-actions.mdc` | Write ops in Server Actions only; `{ ok, error? }` return shape |
| `no-n-plus-one-queries.mdc` | Eager loading required; never query inside loops |
| `workflow-and-steps.mdc` | 9-step implementation workflow; plan required for >3 file changes |
| `plan-file-standards.mdc` | Plans in `.cursor/plans/`, 8 required sections, markdown lint required |
| `kill-port-3000-before-tests.mdc` | Free port 3000 before any test run |
| `project-coding-standards.mdc` | Index pointer to the four coding rule files |
| `project-workflow-process.mdc` | Pointer to `workflow-and-steps.mdc` |
| `project-testing-validation.mdc` | Pointer to testing/validation requirements |
| `project-documentation-style.mdc` | Pointer to documentation and markdown standards |

### Workflow (from `workflow-and-steps.mdc`)

For every task:

1. Understand the request and define the expected outcome
2. Inspect relevant files and existing patterns before editing
3. If the change touches >3 files, propose a plan first
4. Save that plan as `.cursor/plans/<short-kebab-task>_<8-char-id>.plan.md`
5. Plan minimal, safe changes aligned with project standards
6. Implement changes in small, focused edits
7. Verify behavior with targeted checks or tests
8. Confirm no regressions in touched areas
9. Summarize what changed, why, and how it was validated

### Plan File Requirements (from `plan-file-standards.mdc`)

Every plan must include:

- `# <Plan Title>`
- `## Goals`
- `## Scope`
- `## Target Files`
- `## Risks`
- `## Planned Changes`
- `## Validation`
- `## Rollback or Mitigation`

---

## 28. GitHub Copilot Instructions

Main file: `.github/copilot-instructions.md` — concise quick-reference that defers to `AGENTS.md`.

### Actual `.github/instructions/` File Listing

> **Correction from v4.0:** The v4.0 table had fabricated filenames (`01-project-overview.instructions.md`, etc.) that do not exist. Below are the actual files present in `.github/instructions/`.

| File | Purpose |
| --- | --- |
| `agents.instructions.md` | How to create GitHub Copilot custom agent files (`.agent.md` format, frontmatter schema, handoffs, sub-agent orchestration, variable extraction) |
| `agent-safety.instructions.md` | Agent safety principles: fail closed, least privilege, policy-as-config, append-only audit, content safety, multi-agent safety |
| `agent-skills.instructions.md` | How to create SKILL.md files: frontmatter, resource bundling (`scripts/`, `references/`, `assets/`, `templates/`), progressive loading |
| `task-implementation.instructions.md` | Task plan implementation via `.copilot-tracking/` workflow: read plan → implement → track in changes file → mark complete |
| `nextjs.instructions.md` | Next.js 16 best practices: Server vs Client, caching with `"use cache"`, `cacheTag()`, `cacheLife()`, `revalidateTag()`, `updateTag()`, Turbopack |
| `nextjs-tailwind.instructions.md` | Next.js + Tailwind CSS standards: App Router, strict TypeScript, Zod validation, Server Components default, React Suspense |

### `.copilot-tracking/` Task Tracking Workflow

When implementing a task plan:

1. Read the plan from `.cursor/plans/` (or wherever it lives)
2. Create a changes file in `.copilot-tracking/` to track progress
3. Implement tasks systematically, one at a time
4. Mark tasks complete in the changes file as you finish them
5. Do not skip steps or batch-mark completions

---

## 29. OpenCode Skills & Instructions

### Skills (`.opencode/skills/`)

| Skill | Subdirectory / File | Coverage |
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
| DAL Skill | `dal-skill.md` | N+1 prevention, cursor pagination, upsert, transactions |
| Server Action Skill (flat) | `server-action-skill.md` | Server Action flat-file reference (mirrors `server-action-skill/SKILL.md`) |
| Suspense Skill | `suspense-skill.md` | Suspense boundaries, async `cookies()`, `headers()` |

### Instructions (`.opencode/instructions/`)

| File | Priority | Summary |
| --- | --- | --- |
| `00-task-sync-note.md` | 0 | TaskSync protocol note — not compatible with OpenCode Docker |
| `01-core-standards.md` | 1 | PR-blocking rules, type safety, env vars, security essentials |
| `02-nextjs-patterns.md` | 2 | Server/Client components, Cache Components, Suspense |
| `03-dal-patterns.md` | 3 | DAL usage, N+1 prevention, transactions |
| `04-auth-testing.md` | 4 | NextAuth patterns, Vitest + Playwright — **⚠ KNOWN INACCURACY**: references `session.user.role !== "admin"` which does not exist on session; correct field is `session.user.isAdmin: boolean` |
| `05-ui-validation.md` | 5 | shadcn/ui components, React Hook Form, Zod patterns |
| `06-commands-ref.md` | 6 | Full command reference |

---

## 30. External Documentation & Sync Checklist

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
| React Hook Form | https://react-hook-form.com/docs |
| bcryptjs | https://github.com/dcodeIO/bcrypt.js |

### AGENTS.md Sync Checklist

When any of the following change, update the relevant section(s) in this file:

- [ ] `database/schema.ts` — update Section 18
- [ ] `lib/env.ts` — update Section 4 (env var count, required/optional status)
- [ ] `lib/actions/*.ts` — update Section 14 (action inventory)
- [ ] `types/next-auth.d.ts` — update Section 16 (session shape)
- [ ] `lib/dal/*.ts` — update Section 15
- [ ] `package.json` scripts — update Sections 2, 3
- [ ] `eslint.config.mts` — update Section 7
- [ ] `.prettierrc.ts` — update Section 8
- [ ] Technical debt resolved — update Section 25
- [ ] New test files added — update Section 21
- [ ] `.cursor/rules/` changes — update Section 27
- [ ] `.github/instructions/` changes — update Section 28
- [ ] `.opencode/skills/` changes — update Section 29

### Version Bump Protocol

When updating AGENTS.md:

1. Increment version number in the header (e.g., `5.0` → `5.1`)
2. Update `Last Generated` date
3. Add a changelog entry at the top describing what changed and why
4. Re-verify all affected sections against the actual source files before writing
