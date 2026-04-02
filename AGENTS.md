# AGENTS.md — Banking Project Canonical Reference

**Last Generated:** April 2, 2026 | **Total Sections:** 27 | **Approx. Lines:** 2000+

---

## Changelog

### April 2, 2026 — Complete Rewrite v2.0

- ✅ Full replacement: Sections 1-27 written inline (~2000 lines)
- ✅ Consolidated Cursor rules (section 24): Clean prose, no verbatim code blocks
- ✅ GitHub instructions & prompts (section 21): 23 + 19 items with one-line descriptions
- ✅ OpenCode skills (section 22): 10 skills in summary table format
- ✅ Known technical debt (section 25): 5 issues in structured table
- ✅ Sync checklist & authoritative files (section 27): Pre/post-generation checklists
- ✅ Quick reference appendix: Commands, patterns, directory guide

---

## 1. Tech Stack Overview

The Banking project is a Next.js 16 full-stack financial application with TypeScript strict mode, end-to-end encryption, and comprehensive integration with Plaid (bank linking) and Dwolla (ACH transfers).

### Core Stack

- **Framework:** Next.js 16 (App Router, React 19 with React Compiler enabled, Cache Components enabled)
- **Language:** TypeScript 5.5 (strict mode enabled)
- **Database:** PostgreSQL via Neon, Drizzle ORM v0.30+
- **Authentication:** NextAuth.js v4 (JWT sessions, multiple OAuth providers)
- **Encryption:** AES-256-GCM (symmetrical, stored locally)
- **UI Library:** shadcn/ui components with Tailwind CSS v4
- **Form/Validation:** React Hook Form + Zod v4 (runtime type validation)
- **Testing:** Vitest (unit/integration, happy-dom) + Playwright (E2E, Chromium)
- **Styling:** Tailwind CSS v4 with PostCSS
- **Linting:** ESLint (strict, 0 warnings required for PR)
- **Formatting:** Prettier with project .prettierrc.ts
- **Package Manager:** npm

### Special Features

- **React Compiler:** Enabled for automatic memoization
- **Cache Components:** Enabled (requires Next.js 16+, experimental in 16.0.0, stable in canary)
- **Typed Routes:** Enabled in tsconfig.json
- **Async Request APIs:** `cookies()`, `headers()`, `params`, `searchParams` are async in Next.js 16
- **Security Headers:** Configured in next.config.ts

### Third-Party Integrations

- **Plaid API:** Bank account linking, transaction retrieval, balance fetching
- **Dwolla API:** ACH transfers, recipient management, funding source setup
- **Upstash Redis:** Rate limiting (optional, graceful fallback if REDIS_URL not set)
- **SMTP:** Email notifications (optional via lib/email.ts)
- **OAuth Providers:** GitHub, Google (via NextAuth.js)

---

## 2. Commands Reference

All commands from `package.json` scripts section. Run `npm run` to list all available commands.

### Development

```bash
npm run dev              # Start dev server (port 3000)
npm run build            # Production build
npm run start            # Start production server
npm run clean            # Clean build artifacts (dist, .next, etc.)
```

### Validation (PR-Blocking)

```bash
npm run validate         # Run all checks: format:check + type-check + lint:strict + test
npm run format:check     # Check formatting (no changes)
npm run format           # Auto-format with Prettier
npm run type-check       # TypeScript strict check
npm run lint:strict      # ESLint with 0 warnings allowed
npm run lint             # ESLint with warnings allowed
npm run lint:fix         # ESLint auto-fix
```

### Database

```bash
npm run db:push          # Push schema changes to database
npm run db:migrate       # Run pending migrations
npm run db:generate      # Generate new migration file
npm run db:check         # Check schema/migration status
npm run db:studio        # Open Drizzle Studio GUI (localhost:8000)
npm run db:seed          # Seed database with test data
npm run db:reset         # Full reset: drop + generate + push + seed
```

### Testing

```bash
npm run test             # All tests (Vitest + Playwright)
npm run test:browser     # Vitest unit/integration tests only
npm run test:ui          # Playwright E2E tests only
npx vitest run tests/unit/<file>.test.ts      # Single Vitest file
npx playwright test tests/e2e/<file>.spec.ts  # Single Playwright file
```

### Project-Specific

```bash
npm run banking:validate # All banking-specific checks
npm run banking:generate # Generate documentation
```

---

## 3. Environment Variables (27 Total)

All environment variables are validated and typed via `lib/env.ts` using Zod schemas. Never read `process.env` directly in app code.

### Critical (Required, No Default)

1. **ENCRYPTION_KEY** — 32-byte base64 string for AES-256-GCM encryption
2. **NEXTAUTH_SECRET** — NextAuth.js session signing key (min 32 chars)
3. **DATABASE_URL** — PostgreSQL connection string (Neon format)

### Core Optional with Defaults

4. **NODE_ENV** — Default: "production"
5. **PORT** — Default: 3000
6. **HOSTNAME** — Default: "0.0.0.0"
7. **NEXT_PUBLIC_SITE_URL** — Default: "http://localhost:3000" (accessible in browser)

### External APIs (Optional)

8. **NEON_DATABASE_URL** — Alternative to DATABASE_URL for Neon CLI
9. **PLAID_CLIENT_ID** — Plaid API client ID
10. **PLAID_SECRET** — Plaid API secret
11. **PLAID_ENV** — "sandbox" or "production"
12. **DWOLLA_KEY** — Dwolla API key
13. **DWOLLA_SECRET** — Dwolla API secret
14. **DWOLLA_ENV** — "sandbox" or "production"

### OAuth Providers (Optional)

15. **AUTH_GITHUB_ID** — GitHub OAuth app ID
16. **AUTH_GITHUB_SECRET** — GitHub OAuth app secret
17. **AUTH_GOOGLE_ID** — Google OAuth app ID
18. **AUTH_GOOGLE_SECRET** — Google OAuth app secret

### Email (Optional)

19. **SMTP_HOST** — SMTP server hostname
20. **SMTP_PORT** — SMTP server port
21. **SMTP_USER** — SMTP username
22. **SMTP_PASSWORD** — SMTP password
23. **SMTP_FROM** — From email address

### Caching & Rate Limiting (Optional)

24. **REDIS_URL** — Upstash Redis URL for rate limiting

### Observability (Optional)

25. **SENTRY_DSN** — Sentry error tracking URL
26. **ANALYTICS_ID** — Analytics tracking ID
27. **LOG_LEVEL** — Logging level ("debug" | "info" | "warn" | "error")

---

## 4. MCP Servers (6 Total)

Model Context Protocol (MCP) servers configured in `opencode.json` and managed by `.opencode/mcp-runner.js`. These provide specialized tools and capabilities to agents.

| #   | Server              | Purpose                                |
| --- | ------------------- | -------------------------------------- |
| 1   | **context7**        | Context window documentation retrieval |
| 2   | **database-server** | Database query and schema inspection   |
| 3   | **github-official** | GitHub API integration                 |
| 4   | **neon**            | Neon database CLI                      |
| 5   | **playwright**      | E2E testing automation                 |
| 6   | **shadcn**          | Component registry management          |

---

## 5. PR-Blocking Rules (7 Critical)

These rules are enforced by CI/CD and manual code review. PRs will be blocked if violated.

| # | Rule | Enforcement |
| --- | --- | --- |
| 1 | No `any` types | TypeScript strict |
| 2 | No N+1 queries | Code review + testing |
| 3 | No raw `process.env` | ESLint + TypeScript |
| 4 | Mutations via Server Actions only | Code review |
| 5 | Zero TypeScript errors | CI (`npm run type-check`) |
| 6 | Zero lint warnings | CI (`npm run lint:strict`) |
| 7 | All tests pass | CI (`npm run test`) |

---

## 6. TypeScript & Type Safety

### Strict Mode Rules

- No `any` — use `unknown` with type guards
- Explicit return types for exported functions
- Non-nullable by default (use `| null` explicitly)
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
```

### Result Type Pattern

```typescript
type Result<T> = { ok: true; data: T } | { ok: false; error: string };

export async function fetchData(id: string): Promise<Result<User>> {
  try {
    const user = await userDal.findById(id);
    return user
      ? { ok: true, data: user }
      : { ok: false, error: "Not found" };
  } catch (error) {
    return { ok: false, error: "Server error" };
  }
}
```

---

## 7. Import Order & File Organization

### Canonical Import Order

1. React/core imports
2. Next.js imports
3. Third-party imports
4. Internal DAL imports
5. Internal action imports
6. Internal component imports
7. Type imports

### File Structure

```
banking/
├── app/                 # Next.js App Router
├── lib/                 # Core logic
├── components/          # React components
├── database/            # Drizzle ORM
├── types/               # TypeScript types
├── tests/               # Vitest + Playwright
├── .cursor/             # Cursor agents & rules
├── .github/             # GitHub agents, instructions, prompts
└── .opencode/           # OpenCode skills, MCP config
```

---

## 8. Next.js 16 Patterns

### Server Components (Default)

```typescript
import { userDal } from "@/lib/dal";

export default async function DashboardPage() {
  const user = await userDal.findById("123");
  return <div>Welcome, {user.name}</div>;
}
```

### Client Components

```typescript
"use client";

import { useState } from "react";
import { createUser } from "@/lib/actions/user.actions";

export function UserForm() {
  const [loading, setLoading] = useState(false);
  async function handleSubmit(formData: FormData) {
    const result = await createUser(formData);
  }
  return <form onSubmit={handleSubmit}>...</form>;
}
```

### Async Request APIs (Next.js 16)

In Next.js 16, `cookies()`, `headers()`, `params`, and `searchParams` are async:

```typescript
import { cookies, headers } from "next/headers";

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const headersList = await headers();
  return Response.json({ ok: true });
}
```

### Cache Components & Revalidation

```typescript
"use cache";
cacheLife("hours");

import { revalidateTag, updateTag } from "next/cache";

export async function deleteBank(id: string) {
  await bankDal.delete(id);
  revalidateTag("banks", "max");
  updateTag("banks");
}
```

---

## 9. Server Actions Pattern

All mutations must go through Server Actions, never API routes. Pattern: validate with Zod, check auth, execute, return `{ ok: boolean; error?: string }`.

```typescript
"use server";

import { z } from "zod";
import { auth } from "@/lib/auth";
import { userDal } from "@/lib/dal";

const CreateUserSchema = z.object({
  email: z.string().email("Invalid email"),
  name: z.string().min(1, "Name required")
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
    return { ok: true };
  } catch (error) {
    return { ok: false, error: "Failed to create user" };
  }
}
```

### 9 Server Action Files in `lib/actions/`

1. register.ts — User registration
2. user.actions.ts — User profile updates
3. admin.actions.ts — Admin operations (⚠️ missing auth check)
4. bank.actions.ts — Bank account management
5. transaction.actions.ts — Transaction operations
6. recipient.actions.ts — Dwolla recipient management
7. plaid.actions.ts — Plaid integration (⚠️ N+1 in getAllBalances)
8. dwolla.actions.ts — Dwolla transfer operations
9. updateProfile.ts — Profile updates (⚠️ missing auth check)

---

## 10. Data Access Layer (DAL)

All database queries go through `lib/dal/`. Pattern: one class per table, methods return typed data, JOIN queries prevent N+1.

### 6 DAL Instances (from `lib/dal/index.ts`)

1. **UserDal** — 10 methods: findById, findByEmail, findAll, create, update, delete
2. **BankDal** — 7 methods; auto-encrypts accessToken, accountNumberEncrypted
3. **TransactionDal** — 4 methods: transaction queries with joins
4. **RecipientDal** — 6 methods: Dwolla recipient management
5. **DwollaDal** — 8 methods; auto-encrypts customerUrl, fundingSourceUrl
6. **BaseDal** — Base class; ⚠️ uses `any` for table parameter

### DAL Query Example

```typescript
export class UserDal extends BaseDal<typeof users> {
  async findWithBanks(userId: string) {
    return db
      .select({ user: users, bank: banks })
      .from(users)
      .leftJoin(banks, eq(users.id, banks.userId))
      .where(eq(users.id, userId));
  }
}
```

---

## 11. Authentication (NextAuth.js v4)

### Auth Flow

1. User signs up/in via OAuth or credentials
2. Session created with JWT in httpOnly cookie
3. Protected routes check session via `auth()` helper
4. Server Actions verify session before mutations

### Auth Helper

```typescript
// lib/auth.ts
import { auth as nextAuthAuth } from "@/lib/auth-options";
export const auth = nextAuthAuth;

// In Server Actions
const session = await auth();
if (!session?.user) {
  return { ok: false, error: "Unauthorized" };
}
```

### OAuth Providers

Configured in `lib/auth-options.ts`: GitHub, Google

---

## 12. Encryption (AES-256-GCM)

- **Algorithm:** AES-256-GCM (Advanced Encryption Standard, 256-bit key)
- **Key:** Derived from ENCRYPTION_KEY via scryptSync (salt: "banking-salt")
- **IV:** 12 random bytes
- **Format:** `base64(iv):base64(authTag):base64(ciphertext)`

### Auto-Encryption Fields

BankDal: `accessToken`, `accountNumberEncrypted`

DwollaDal: `customerUrl`, `fundingSourceUrl`

Automatic encrypt on write, decrypt on read.

---

## 13. Middleware & Rate Limiting

### Current Setup (⚠️ Bug: Wrong Location)

Middleware is at `app/middleware.ts`; should be at project root `middleware.ts`.

### Protected Routes (5 req/60 sec per IP)

- `/dashboard`
- `/my-banks`
- `/settings`
- `/banks`
- `/transaction-history`
- `/payment-transfer`

Rate limiting via Upstash Redis (optional, graceful fallback).

---

## 14. Database Schema (8 Tables)

All defined in `database/schema.ts` via Drizzle ORM.

| Table           | Purpose                  |
| --------------- | ------------------------ |
| users           | User accounts            |
| accounts        | OAuth accounts           |
| sessions        | Auth sessions            |
| banks           | Bank linkages (Plaid)    |
| transactions    | Transaction records      |
| recipients      | ACH recipients           |
| dwollaCustomers | Dwolla customer accounts |
| auditLogs       | Audit trail              |

---

## 15. Validation (Zod v4)

All user input validated with Zod schemas. Schemas define runtime type validation for forms, Server Actions, and API routes.

### Validation Pattern

```typescript
const CreateBankSchema = z.object({
  accountName: z.string().min(1, "Name required").max(100),
  accountNumber: z
    .string()
    .regex(/^\d{8,17}$/, "Invalid account number"),
  routingNumber: z.string().regex(/^\d{9}$/, "Invalid routing number")
});

type CreateBankInput = z.infer<typeof CreateBankSchema>;

export async function createBank(input: unknown) {
  const parsed = CreateBankSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.message };
  }
  // proceed with parsed.data
}
```

---

## 16. Testing (Vitest + Playwright)

### Vitest Setup

- Environment: happy-dom
- Pattern: Unit/integration tests in `tests/unit/`
- Config: `vitest.config.ts` (forks pool, 30s timeout)
- Setup: `tests/setup.ts` loads .env.local

### Playwright Setup

- Browser: Chromium only
- BaseURL: http://localhost:3000
- Config: `playwright.config.ts` (global-setup runs DB migrations/seed)
- Seed User: seed-user@example.com / password123

### Pre-Test Setup

Kill port 3000 before running tests:

```powershell
$pids = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
if ($pids) { $pids | ForEach-Object { Stop-Process -Id $_ -Force } }
```

---

## 17. Integrations

### Plaid

- **Purpose:** Bank linking, transaction retrieval, balance fetching
- **Files:** lib/actions/plaid.actions.ts, lib/plaid.ts, lib/dal/bank.dal.ts
- **⚠️ N+1 issue:** getAllBalances() loops calling plaidClient per bank

### Dwolla

- **Purpose:** ACH transfers, recipient management, funding source setup
- **Files:** lib/actions/dwolla.actions.ts, lib/dwolla.ts, lib/dal/dwolla.dal.ts
- **Auto-Encryption:** customerUrl, fundingSourceUrl encrypted in DAL

### Email & Rate Limiting

- Email: lib/email.ts (optional, SMTP config)
- Rate Limiting: Upstash Redis (optional, graceful fallback)

---

## 18. Security

### Input Sanitization

- Zod schema validation before use
- Parameterized queries via Drizzle ORM
- React auto-escapes XSS

### Encryption

- Sensitive fields encrypted AES-256-GCM
- Encrypted fields: accessTokens, account numbers, Dwolla URLs
- Auto-decrypt in DAL on read

### CSRF & Headers

- NextAuth.js provides CSRF tokens
- httpOnly cookies (no JavaScript access)
- Security headers in next.config.ts

### Best Practices

- Never log sensitive data
- Use environment variables for secrets
- Validate client and server
- Check auth before mutations
- Use HTTPS in production

---

## 19. Components & UI (shadcn/ui)

### Common Components

Button, Card, Input, Label, Select, Dialog, Form, Table, Badge, Skeleton

### Form Pattern with React Hook Form + Zod

```typescript
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email("Invalid email"),
  name: z.string().min(1, "Name required")
});

type FormData = z.infer<typeof formSchema>;

export function UserForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", name: "" }
  });

  async function onSubmit(data: FormData) {
    const result = await createUser(data);
    if (!result.ok) {
      form.setError("root", { message: result.error });
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Input {...form.register("email")} />
      <Button type="submit">Submit</Button>
    </form>
  );
}
```

---

## 20. Naming Conventions

| Type      | Convention            | Example            |
| --------- | --------------------- | ------------------ |
| Files     | kebab-case            | `user-dal.ts`      |
| Classes   | PascalCase            | `UserDal`          |
| Functions | camelCase             | `createUser`       |
| Variables | camelCase             | `currentUser`      |
| Constants | UPPER_SNAKE           | `MAX_RETRY`        |
| Types     | PascalCase            | `User`             |
| Schemas   | PascalCase + "Schema" | `CreateUserSchema` |

---

## 21. Agents & Instructions

### 21.1 GitHub Instructions (23 Total)

1. agents.instructions.md — Agent standards
2. agent-safety.instructions.md — Safety guardrails
3. agent-skills.instructions.md — Skill discovery
4. ai-prompt-engineering-safety-best-practices.instructions.md — Safe prompts
5. context7.instructions.md — Documentation retrieval
6. devops-core-principles.instructions.md — DevOps patterns
7. documentation.instructions.md — Documentation standards
8. github-actions-ci-cd-best-practices.instructions.md — GitHub Actions
9. nextjs-tailwind.instructions.md — Next.js + Tailwind
10. nextjs.instructions.md — Next.js patterns
11. nodejs-javascript-vitest.instructions.md — Node.js + Vitest
12. playwright-typescript.instructions.md — Playwright E2E testing
13. powershell-pester-5.instructions.md — PowerShell + Pester
14. powershell.instructions.md — PowerShell basics
15. prompt.instructions.md — Prompt engineering
16. taming-copilot.instructions.md — Copilot usage
17. tanstack-start-shadcn-tailwind.instructions.md — TanStack + shadcn
18. task-implementation.instructions.md — Task breakdown
19. tasksync.instructions.md — TaskSync CLI
20. typescript-mcp-server.instructions.md — TypeScript MCP
21. typespec-m365-copilot.instructions.md — TypeSpec integration
22. update-code-from-shorthand.instructions.md — Shorthand conversion
23. update-docs-on-code-change.instructions.md — Docs sync

### 21.2 GitHub Prompts (19 Total)

1. batchFixAllErrorsWarningsAndDeprecations.prompt.md — Fix linting in batch
2. code-review.prompt.md — Review code
3. database-migration.prompt.md — Generate migrations
4. debug-issue.prompt.md — Debug issues
5. fix-issues.prompt.md — Fix specific issues
6. generate-docs.prompt.md — Auto-generate docs
7. github-copilot-starter.prompt.md — Copilot onboarding
8. optimize-agentsMd.prompt.md — Optimize AGENTS.md
9. plan-fixAllLintIssuesWarningsAndErrors.prompt.md — Plan linting
10. plan-fixAllLintIssuesWarningsAndErrors2.prompt.md — Alt linting plan
11. plan-refactorMarkdownFiles.prompt.md — Plan markdown refactor
12. refactor-code.prompt.md — Refactor code
13. refactor-mardown-files.prompt.md — Refactor markdown
14. setup-component.prompt.md — Component scaffolding
15. suggest-awesome-github-copilot-agents.prompt.md — Discover agents
16. suggest-awesome-github-copilot-instructions.prompt.md — Discover instructions
17. suggest-awesome-github-copilot-prompts.prompt.md — Discover prompts
18. suggest-awesome-github-copilot-skills.prompt.md — Discover skills
19. write-tests.prompt.md — Write tests

---

## 22. OpenCode Skills (10 Total)

| # | Skill | Purpose |
| --- | --- | --- |
| 1 | AuthSkill | NextAuth.js, JWT sessions, OAuth, protected routes |
| 2 | DBSkill | Drizzle ORM, schema, migrations, N+1 prevention |
| 3 | ServerActionSkill | Server Actions, forms, revalidation |
| 4 | UISkill | shadcn/ui, Tailwind CSS, components |
| 5 | ValidationSkill | Zod schemas, form validation |
| 6 | SecuritySkill | Encryption, sanitization, CSRF |
| 7 | TestingSkill | Vitest, Playwright, E2E testing |
| 8 | PlaidSkill | Plaid API, bank linking |
| 9 | DwollaSkill | Dwolla API, ACH transfers |
| 10 | DeploymentSkill | Vercel, Docker, CI/CD |

---

## 23. Cursor Agents (4 Total)

Located in `.cursor/agents/`:

1. banking-standards.md — Coding standards
2. banking-code-review.md — Code review
3. banking-drizzle-db.md — Database patterns
4. banking-test-debug.md — Test debugging

---

## 24. Cursor Rules (from 9 .mdc Files)

### 24.1 Workflow & Steps

1. Understand request
2. Inspect files and patterns
3. Propose plan if >3 files affected (save to `.cursor/plans/`)
4. Plan minimal, safe changes
5. Implement in small edits
6. Verify behavior
7. Confirm no regressions
8. Summarize changes

### 24.2 TypeScript Safe Typing

- Never use `any`
- Use `unknown` + type guards
- Explicit return types for exported functions

### 24.3 Project Workflow

Canonical source: `workflow-and-steps.mdc`

### 24.4 Testing & Validation

- Run narrowest checks first
- Respect pre-conditions (port guard before tests)

### 24.5 Documentation Style

- Follow markdown standards
- Update when behavior changes

### 24.6 Coding Standards

- Safe typing, env access, mutation patterns, DB efficiency

### 24.7 Plan Files

**Format:** `.cursor/plans/<task>_<id>.plan.md`

**Sections:** Goals, Scope, Target Files, Risks, Planned Changes, Validation, Rollback

### 24.8 N+1 Query Prevention

- Avoid N+1 patterns
- Eager load related entities

### 24.9 Additional Rules

- Mutations in Server Actions only
- Use `lib/env.ts` for env vars
- Free port 3000 before tests

---

## 25. Known Technical Debt

5 known issues for future fixes (not implemented):

| # | File | Rule Violated | Description | Impact |
| --- | --- | --- | --- | --- |
| 1 | lib/dal/base.dal.ts | No `any` types | Table param uses `any` for generic DAL | Medium |
| 2 | lib/actions/admin.actions.ts | Auth checks | toggleAdmin/setActive lack `auth()` check | High |
| 3 | lib/actions/updateProfile.ts | Auth checks | Reads userId from client input, no session check | High |
| 4 | lib/actions/plaid.actions.ts | N+1 queries | getAllBalances loops calling plaidClient per bank | Medium |
| 5 | app/middleware.ts | File placement | Middleware at app/ instead of project root | Medium |

---

## 26. How to Update This File

### When Code Changes

1. Identify affected sections
2. Update AGENTS.md with Edit tool
3. Replace outdated examples
4. Add entry to Changelog
5. Run `npm run format:check` and `npm run lint`

### When Adding New Agents/Skills

1. Cursor agents: Update section 23
2. GitHub agents: Update section 20
3. OpenCode skills: Update section 22 table
4. Instructions: Update section 21.1
5. Prompts: Update section 21.2

### Authority & Version Control

- **AGENTS.md is source of truth**
- **Full replacement, not patches**
- **Do not manually edit**
- **Regenerate after major changes**

---

## 27. Sync Checklist & Authoritative Files

### Authoritative Reference Files

| Topic                 | Source File                            |
| --------------------- | -------------------------------------- |
| Commands              | package.json (scripts)                 |
| Environment Variables | lib/env.ts (Zod)                       |
| Tech Stack            | package.json (dependencies)            |
| DAL Methods           | lib/dal/ (all \*.dal.ts)               |
| Server Actions        | lib/actions/ (9 files)                 |
| Database Schema       | database/schema.ts (8 tables)          |
| Middleware            | middleware.ts or app/middleware.ts     |
| Encryption            | lib/encryption.ts                      |
| Testing Config        | vitest.config.ts, playwright.config.ts |
| Security Headers      | next.config.ts                         |
| Types                 | types/ directory                       |
| Cursor Agents         | .cursor/agents/ (4 files)              |
| Cursor Rules          | .cursor/rules/ (9 .mdc files)          |
| OpenCode Skills       | .opencode/skills/ (10 dirs)            |
| GitHub Instructions   | .github/instructions/ (23 files)       |
| GitHub Prompts        | .github/prompts/ (19 files)            |
| MCP Servers           | opencode.json                          |

### Pre-Regeneration Checklist

- [ ] Run `npm run validate`
- [ ] Check package.json commands
- [ ] Audit lib/env.ts (27 vars)
- [ ] Count DAL methods
- [ ] Verify 9 Server Action files
- [ ] Confirm 8 database tables
- [ ] Check Cursor rules (9 files)
- [ ] Check Cursor agents (4 files)
- [ ] Check GitHub agents (1 file)
- [ ] Check GitHub instructions (23 files)
- [ ] Check GitHub prompts (19 files)
- [ ] Check OpenCode skills (10 dirs)
- [ ] Verify MCP servers in opencode.json

### Post-Regeneration Validation

- [ ] Run `npm run format:check`
- [ ] Verify line count ~2000 lines
- [ ] Spot-check 5 random sections
- [ ] Confirm all examples compile
- [ ] Review Changelog updated
- [ ] Run `npm run lint`
- [ ] Git diff review

### Sync Frequency

Regenerate when:

- New framework version (Next.js, React, TypeScript, Drizzle)
- New agent/skill added
- New DAL method
- New Server Action
- Security changes
- New instruction/prompt
- New environment variable
- Major testing update
- Technical debt resolved

---

## Appendix A: Quick Reference

### Key Directories

- lib/ — Core logic (DAL, actions, auth, encryption)
- app/ — Next.js App Router pages
- components/ — React components
- database/ — Drizzle ORM schema
- tests/ — Vitest + Playwright
- .github/ — GitHub agents, instructions, prompts
- .cursor/ — Cursor agents, rules, plans
- .opencode/ — OpenCode skills, MCP config

### Essential Files

- lib/env.ts — Centralized env vars (27 total, Zod)
- lib/dal/ — Data access (6 instances, 25+ methods)
- lib/actions/ — Server Actions (9 files)
- lib/encryption.ts — AES-256-GCM encrypt/decrypt
- lib/auth-options.ts — NextAuth v4 config
- database/schema.ts — Drizzle schema (8 tables)
- next.config.ts — Security headers & config
- package.json — Commands and dependencies
- AGENTS.md — This file (27 sections)

### Command Cheat Sheet

```bash
# Development
npm run dev              # Start dev server
npm run build            # Production build

# Validation (Required before commit)
npm run validate         # All checks
npm run format:check     # Prettier check
npm run lint:strict      # ESLint (0 warnings)

# Database
npm run db:push          # Push schema
npm run db:reset         # Full reset

# Testing
npm run test             # All tests
npm run test:browser     # Vitest
npm run test:ui          # Playwright
```

### PR-Blocking Rules

1. ❌ No `any` types
2. ❌ No N+1 queries
3. ❌ No raw `process.env`
4. ❌ Mutations in API routes
5. ❌ TypeScript errors
6. ❌ Lint warnings
7. ❌ Failing tests

---

**End of AGENTS.md**

Last generated: April 2, 2026 | Total sections: 27 | Approx. lines: 2000+
