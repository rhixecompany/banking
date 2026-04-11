# AGENTS.md — Banking Project (Compact)

Version: 10.2 | Updated: 2026-04-11

Purpose

- Short reference for agentic contributors (OpenCode / Cursor / automated agents).
- Keep only repo-specific facts an agent would otherwise miss.

Quick Commands (exact)

- npm run dev # Start dev server (predev: clean)
- npm run build # Production build (prebuild: clean + type-check)
- npm run validate # build + lint:strict + test (expensive; CI gate)
- npm run lint:strict # ESLint — zero warnings required for PRs
- npm run type-check # tsc --noEmit
- npm run db:push # Push Drizzle schema
- npm run db:studio # Drizzle Studio (local)
- npm run db:seed # Seed (uses PLAID_TOKEN_MODE=sandbox)
- npm run test # Runs test:ui THEN test:browser (order matters)
- npm run test:ui # Playwright E2E — starts dev server, 1 worker (Chromium)
- npm run test:browser # Vitest unit tests (happy-dom)
- npm run registry:build # Generate README.opencode.md and dist/registry.json
- npx vitest run tests/unit/auth.test.ts # single Vitest test
- npx playwright test tests/e2e/auth.spec.ts # single Playwright test

Pre- and Post-hooks

- predev / prebuild: scripts run clean (rimraf .next ...) and type-check; builds assume they run type-check first.
- pretest: runs clean — tests expect a clean state.

Environment variables / config

- NEVER read process.env directly in app code. Use app-config.ts (preferred) or lib/env.ts. Exception: proxy.ts (Edge middleware) may read process.env.
- Required in production: ENCRYPTION_KEY, NEXTAUTH_SECRET.
- Drizzle migrations: drizzle.config.ts loads .env.local first, then .env via dotenv.
- Treat missing optional env vars as undefined (app-config uses Zod .optional()).

PR-blocking, safety & style rules (must follow)

- No any types — use unknown + type guards (enforced by TypeScript strict + project convention). Fixes are PR-blocking.
- No N+1 DB queries — never query inside loops; use JOINs and Drizzle idioms.
- Mutations must be Server Actions (actions/). Do not place write logic in API routes.
- Zero TypeScript errors and zero lint warnings (lint:strict) before PR.
- All tests must pass before merging (npm run test).
- Do NOT commit secrets (.env, tokens). no-secrets is enabled as a warn-level guard.

Where the important code lives

- Next.js app: app/ (App Router, Server Components by default)
- Server Actions: actions/ (all mutations)
- DAL (all DB access): dal/
- Database: database/ (db.ts, schema.ts, drizzle migrations)
- Env / config: app-config.ts and lib/env.ts
- Auth helpers: lib/auth.ts, lib/auth-options.ts
- UI components: components/ (shadcn/ui generated code under components/ui/)

Testing quirks

- test order: npm run test executes E2E first (test:ui) then unit (test:browser). E2E starts the dev server — it must be able to bind port 3000.
- Free port 3000 before running Playwright on Windows (PowerShell): $p = Get-NetTCPConnection -LocalPort 3000 -State Listen -EA SilentlyContinue | Select -ExpandProperty OwningProcess -Unique
  if ($p) { $p | % { Stop-Process -Id $\_ -Force } }
- Playwright: single worker only (tests assume stateful DB/session). Use Chromium project.
- Vitest: environment = happy-dom; forks pool used.

ESLint / inline disables

- Source of truth: eslint.config.mts. It sets linterOptions.noInlineConfig: false — inline `// eslint-disable` comments DO work for files/configs where allowed by rules. (Note: some docs in .opencode claim a different value; trust eslint.config.mts and the actual linter behavior.)
- However: unicorn/no-abusive-eslint-disable is enabled; do not add broad disables without reason.
- File-specific overrides exist (scripts/, database/, actions/, tests/) — check eslint.config.mts before adding exceptions.

Zod / validation

- ESLint enforces zod rules: every zod schema field MUST include .describe("...") and validators must include messages.
- Do not use z.any().

Database & Drizzle

- All DB access must go through dal/ (no DB calls in Actions or components).
- Drizzle rule files: database/**/\*.ts and lib/dal/**/\*.ts have stronger lint rules (enforce update/delete with where).
- Use db.transaction for multi-step DB operations.
- Encryption helpers: lib/encryption.ts uses ENCRYPTION_KEY; encryption format is iv:authTag:ciphertext (hex:colon-separated).

Auth / sessions

- Session.user shape (types/next-auth.d.ts): { id: string; name?: string | null; email?: string | null; isAdmin: boolean; isActive: boolean }
- JWT carries id/isAdmin/isActive. Use session.user.isAdmin — there is NO role field.
- Use lib/auth() helper to get server session inside server actions.

Server Actions pattern

- "use server" actions in actions/\*.ts return consistent shape: Promise<{ ok: boolean; error?: string }>.
- Validate inputs with Zod before DB or external API calls.
- Call revalidatePath/updateTag/revalidateTag as required to refresh cache/components.

Security & secrets

- Never log access tokens, passwords, account numbers, or routing numbers.
- Hash passwords with bcrypt (bcrypt package, not bcryptjs).
- Upstash Redis optional — proxy.ts guards Redis instantiation (checks env) and will skip if not configured.

Docs and agentic artifacts

- The repository contains OpenCode assets under .opencode/ (skills, instructions, commands). Keep them in sync with AGENTS.md.
- Registry generation: npm run registry:build (registry:generate → registry:export) writes README.opencode.md and dist/registry.json.

Workflow & planning

- If a change touches >3 files, create a plan in .cursor/plans/ per project rules (filename: <task>\_<8-char-id>.plan.md) before implementing.
- Validation checklist before commit: format, type-check, lint:strict, tests (npm run validate recommended).
- Preserve AGENTS.md as the canonical source for agentic guidance. When updating AGENTS.md, update the version/date at the top.

What to trust when docs conflict

- Prefer executable sources of truth:
  1. package.json scripts
  2. eslint.config.mts
  3. app-config.ts / lib/env.ts
  4. database/schema.ts
  5. scripts/\* (codegen, registry generators)
- If prose in .opencode/instructions or older AGENTS.md conflicts with these, update the prose to match the executable source.

Short checklist for agents

- Read package.json scripts & eslint.config.mts before running lint or altering lint rules.
- Run npm run validate locally before opening a PR.
- Use Server Actions for writes; use DAL for DB reads/writes.
- Do not assume inline ESLint disables are forbidden — check eslint.config.mts (it currently sets noInlineConfig: false).
- Free port 3000 before E2E runs (Windows PS snippet above).
- Run registry generation when adjusting .opencode content: npm run registry:build.

References (high-value files)

- package.json (scripts)
- eslint.config.mts
- app-config.ts, lib/env.ts
- database/schema.ts
- actions/, dal/, .opencode/ (skills & instructions)
- tests/ (tests/setup.ts, e2e/)

End.
