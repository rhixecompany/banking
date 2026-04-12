# AGENTS.md — Banking Project (Canonical Agent Guide)

Version: 11.2 | Updated: 2026-04-12

Purpose

- Canonical guidance for human and automated contributors (agents) working in this repository.
- Provide concise, actionable rules, exact commands, and references agents must follow to make safe, consistent changes.

Quick Commands (exact)

- npm run dev — Start dev server (predev runs clean)
- npm run build — Production build (prebuild: clean + type-check)
- npm run validate — build + lint:strict + test (CI gate; expensive)
- npm run lint:strict — ESLint (zero warnings required for PRs)
- npm run type-check — TypeScript type check (tsc --noEmit)
- npm run db:push — Push Drizzle schema
- npm run db:studio — Open Drizzle Studio (local)
- npm run db:seed — Seed database (PLAID_TOKEN_MODE=sandbox)
- npm run test — Runs test:ui THEN test:browser (order matters)
- npm run test:ui — Playwright E2E (Chromium, single worker). Starts dev server; ensure port 3000 is free.
- npm run test:browser — Vitest unit tests (happy-dom)
- npm run registry:build — Generate README.opencode.md and dist/registry.json

Pre- and Post-hooks

- predev / prebuild: scripts run clean and type-check. Builds assume type-check ran successfully first.
- pretest: runs clean. Tests assume a clean workspace.

Environment variables / config

- Do NOT read process.env directly in app code. Prefer app-config.ts; lib/env.ts is allowed for backward compatibility. Exception: proxy.ts (Edge middleware) may read process.env.
- Required in production: ENCRYPTION_KEY, NEXTAUTH_SECRET.
- Drizzle migrations load .env.local first, then .env via dotenv (drizzle.config.ts).
- Optional env vars should be treated as possibly undefined; app-config uses Zod .optional().

PR-blocking, safety & style rules (must follow)

- No `any` types. Use `unknown` with type guards. TypeScript strict is enforced and type errors are PR-blocking.
- Avoid N+1 queries. Eager load relations with JOINs — never perform DB calls inside loops.
- All mutations must be Server Actions (actions/). Do NOT place write logic in API routes.
- Zero TypeScript errors and zero lint warnings (lint:strict) before opening a PR.
- All tests must pass before merging (npm run test).
- Do NOT commit secrets (.env, tokens). `eslint-plugin-no-secrets` is enabled (warn-level).

Where the important code lives

- Next.js app: app/ (App Router; Server Components by default) -- Server Actions: actions/ (mutations) -- Data Access Layer: dal/ (all DB access)
- Database: database/ (db.ts, schema.ts, drizzle migrations)
- Env / config: app-config.ts (preferred), lib/env.ts (backwards compatibility)
- Auth helpers: lib/auth.ts, lib/auth-options.ts
- UI components: components/ui/ (shadcn/ui generated code)

Testing quirks

- `npm run test` runs E2E first (`test:ui`), then unit (`test:browser`). E2E starts the dev server — ensure port 3000 is available.
- On Windows, free port 3000 before Playwright: PowerShell snippet below.
- Playwright uses a single worker (tests assume stateful DB/session) and runs Chromium.
- Vitest uses the `happy-dom` environment.

PowerShell: free port 3000 before Playwright

```powershell
$p = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue | Select -ExpandProperty OwningProcess -Unique
if ($p) { $p | ForEach-Object { Stop-Process -Id $_ -Force } }
```

ESLint / inline disables

- Source of truth: `eslint.config.mts`. Inline disables are allowed (`linterOptions.noInlineConfig: false`) but `unicorn/no-abusive-eslint-disable` remains enabled — avoid broad disables.
- Check `eslint.config.mts` for file-specific overrides (scripts/, database/, actions/, tests/) before making exceptions.

Zod / validation

- ESLint enforces zod rules: each schema field must include `.describe("...")` and validators must include messages. Do NOT use `z.any()`.

Database & Drizzle

-- All DB access must go through `dal/`. Do NOT query the DB directly from Server Actions or components.

- `database/**/*.ts` and `dal/**/*.ts` have stricter lint rules (e.g., enforce update/delete with WHERE clauses). Docs should prefer `@/dal` when showing import examples.
- Use `db.transaction(...)` for multi-step operations.
- `lib/encryption.ts` uses `ENCRYPTION_KEY`; encryption format is `iv:authTag:ciphertext` (hex, colon-separated).

Auth / sessions

- Session.user shape (types/next-auth.d.ts): `{ id: string; name?: string | null; email?: string | null; isAdmin: boolean; isActive: boolean }`.
- JWT carries `id`, `isAdmin`, and `isActive`. Use `session.user.isAdmin` (there is NO `role` field).
- Use the `lib/auth()` helper to obtain server sessions inside Server Actions.

Server Actions pattern

- Server Actions ("use server") in `actions/` should return a consistent shape: `Promise<{ ok: boolean; error?: string }>`.
- Validate inputs with Zod before DB or external API calls.
- Use `revalidatePath`, `revalidateTag`, or `updateTag` to refresh cached components after mutations.

Security & secrets

- Never log access tokens, passwords, account numbers, routing numbers, or other sensitive data.
- Hash passwords with `bcrypt` (use the `bcrypt` package, not `bcryptjs`).
- Upstash Redis is optional — `proxy.ts` guards Redis initialization and will skip if env vars are absent.

Docs and agentic artifacts

- Agentic resources are under `.opencode/` and `.cursor/`. Keep them synchronized with `AGENTS.md` and executable sources of truth.
- To refresh the registry: `npm run registry:build` (runs registry:generate → registry:export) and writes `README.opencode.md` and `dist/registry.json`.

Workflow & planning

- If a change touches more than 3 files, create a plan before implementing. Plans live in `.opencode/plans/` and follow the naming `<short-kebab-task>_<8charid>.plan.md`.
- Validation checklist before commit/PR: `npm run format` (or format:check), `npm run type-check`, `npm run lint:strict`. Running tests is recommended but may be expensive.
- `AGENTS.md` is the canonical agentic reference file. When you update it, bump the version/date at the top and record the change in a plan.

Agent Tests (Quick Validate)

- Run these locally before proposing PRs that change behavior or agentic docs:
  - `npm run format` (applies Prettier)
  - `npm run type-check` (tsc --noEmit)
  - `npm run lint:strict` (ESLint zero-warnings)

How to update AGENTS.md or .opencode instructions

- Preserve existing content where possible. If your edits touch more than 3 files, create a plan file in `.opencode/plans/` using the filename format above and include Goals, Scope, Target Files, Risks, Planned Changes, Validation, and Rollback. See `.opencode/instructions/09-plan-file-standards.md` for the template.
- If prose conflicts with executable sources (package.json scripts, eslint.config.mts, app-config.ts, database/schema.ts, scripts/), update the prose to match the executable sources and record the change in a plan.

Note: This update is part of an agentic docs standardization effort. See plan: `.opencode/plans/update-agentic-docs_4f7a8b2c.plan.md`.

What to trust when docs conflict

- Prefer executable sources of truth (in order):
  1. package.json scripts
  2. eslint.config.mts
  3. app-config.ts / lib/env.ts
  4. database/schema.ts
  5. scripts/ (codegen, registry generators)

- If prose in `.opencode/instructions` or legacy docs conflicts with these sources, update the prose to match the executable sources and record the decision in a plan under `.opencode/plans/`.

Short checklist for agents

- Read `package.json` scripts and `eslint.config.mts` before running lint or changing linter settings.
- Before opening a PR run at minimum: `npm run format`, `npm run type-check`, `npm run lint:strict`. Run tests for behavior changes. -- Use Server Actions for stateful mutations; use `dal/` for all DB access.
- Avoid adding broad ESLint disables. Prefer fixing the underlying issue.
- Free port 3000 before running Playwright on Windows (use the PowerShell snippet above).
- Run `npm run registry:build` after modifying `.opencode/` content to regenerate `README.opencode.md` and `dist/registry.json`.

References (high-value files)

- package.json (scripts)
- eslint.config.mts
- app-config.ts, lib/env.ts
- database/schema.ts
- actions/, dal/, .opencode/ (skills & instructions)
- tests/ (tests/setup.ts, e2e/)

If you find a contradiction between documentation and code, fix the documentation and record the change in `.opencode/plans/` with a short rationale.

End.
