<!--
  AGENTS.md — Banking (compact)
  Purpose: one-file, high-signal instructions an automated agent would otherwise miss.
  Keep this short. If in doubt, omit.
-->

Read this first — it is authoritative for automated agents. If you are an agent, ask who you should act as (developer, reviewer, ops, CI) and whether you may modify files or must only propose changes.

## Quick Commands

```
npm run dev
npm run type-check
npm run lint:strict
npm run format
npm run test
npm run test:ui
npm run test:browser
npm run db:generate
npm run db:migrate
npm run db:push
npm run db:seed
npm run db:reset
```

## Technology Versions (exact, detected)

- Next.js: 16.2.2
- React: ^19
- TypeScript: ^6.0.2 (tsconfig target: ES2017)
- Drizzle ORM: drizzle-orm v0.45.2, drizzle-kit v0.31.10
- Playwright: @playwright/test v1.59.1
- Vitest: vitest v4.1.2
- Plaid: plaid v41.4.0
- Dwolla: dwolla-v2 v3.4.0
- Zod: zod v4.3.6

Note: Node engine is not pinned in package.json — do not assume Node version beyond what CI or infra provides.

## Priority Guidelines

When generating or modifying code for this repo:

1. Detect and respect the exact versions listed above. Do not use language or framework features beyond these versions.
2. Prioritize existing root-level context files (architecture.md, tech-stack.md, coding-standards.md, folder-structure.md, exemplars.md).
3. Follow the most-consistent code patterns discovered in nearby files (naming, error handling, validation style).
4. Maintain the App Router / server-action architectural style: keep server-only logic on the server, pass server actions from server-wrapper → client-wrapper (do not import server actions directly in client components).
5. Prioritize the project's code-quality focuses visible in the repository: strong typing, explicit Zod validation, defensive error handling, and deterministic test stubbing.
6. Include all skills and tools you can use.
7. Include all relevant context from the existing codebase.
8. Include all custom TypeScript files, bash scripts, PowerShell scripts, and .bat scripts found in the codebase.

Note: Items 6–8 are explicit requirements — whenever you prepare changes or guidance, surface the list of available skills/tools, the exact contextual files you read, and the custom scripts you considered.

## Context Files (look here first)

- package.json (scripts & dependency versions)
- next.config.ts
- tsconfig.json
- app-config.ts and lib/env.ts (env validation / access)
- database/schema.ts and dal/\*
- actions/\* (Server Actions)
- components/_ (search for `_-server-wrapper.tsx`/`\*-client-wrapper.tsx`)
- playwright.config.ts and tests/e2e/global-setup.ts
- scripts/seed/\* (seed runner and seed-config)
- .opencode/\* (agent skills, docs, and templates)
- scripts/\* (custom bash / powershell / tsx scripts used by CI and developers)

When asked to produce code, list the exact files you scanned (paths + short rationale) and include any scripts you plan to run or reference.

## Architecture & Patterns (observed)

- Next.js App Router (server components + client components).
- Server Actions (`"use server"`) live in `actions/*`. Pattern:
  - Validate inputs with Zod.
  - Authenticate via `auth()` at the top of the action.
  - Return stable shape: `{ ok: boolean; error?: string }` (include payload fields for success).
  - Revalidate cache after mutation (`revalidatePath()`, `revalidateTag()`, `updateTag()`).
- Component wrapper pattern: server-wrapper components fetch data / server actions and pass server actions as props into client-wrapper components. Many components follow `*-server-wrapper.tsx` / `*-client-wrapper.tsx`.
- DAL & DB:
  - All DB access must go through `dal/*`. Do not write ad-hoc DB queries in components or server actions.
  - Avoid N+1: write joins in DAL rather than per-row calls.
  - Use `db.transaction(...)` for multi-step operations that must be atomic.
  - Canonical table name: `wallets` — many DAL methods and tests expect this exact name.

## Plaid & Dwolla Deterministic Testing (observed rules)

- Mock token detection: `lib/plaid.ts` exports `isMockAccessToken(token: string)` that recognizes mock/seed tokens (prefixes like `seed-`, `mock-`, etc.). Server-side flows short-circuit for mock tokens.
- Seed runner: `scripts/seed/seed-config.ts` canonicalizes seed access tokens and returns a mock token when env is not present.
- Playwright E2E: tests inject a Plaid Link stub via `tests/e2e/helpers/plaid.mock.ts`. Use `addMockPlaidInitScript(page, "MOCK_PUBLIC_TOKEN")` before navigation to avoid real network calls.
- Dwolla: server code recognizes mock transfer URLs/strings (e.g., contains `mock`) to short-circuit Dwolla API calls and produce deterministic transfer URLs.
- Tests expecting deterministic behaviour rely on server actions' mock short-circuits. Preserve these guard clauses when refactoring.

Concrete examples (files to consult):

- `lib/plaid.ts` — `isMockAccessToken()`
- `actions/plaid.actions.ts` — mock short-circuit in `exchangePublicToken` and other actions
- `actions/dwolla.actions.ts` — creates deterministic mock transfer URLs when source/destination includes `mock`
- `tests/e2e/helpers/plaid.mock.ts` — Playwright init script helper

## Server Actions — Required Contract (enforced by repo)

- Validate inputs with Zod. Use descriptive messages (e.g., `.min(1, "User ID is required")`).
- Authenticate first: call `const session = await auth()` and check `session?.user?.id`.
- Return shape: `{ ok: boolean; error?: string }` and include additional fields (e.g., `wallet` on success).
- Catch, log, and return stable error shapes — do not throw unhandled exceptions during E2E test runs.
- Revalidate caches after successful mutations: `revalidatePath("/my-wallets")`, `revalidateTag("balances", "minutes")`, `updateTag("balances")`, etc.

## Testing Rules & Playwright E2E

1. Playwright E2E runs first (stateful) then Vitest unit tests.
2. Playwright config uses `fullyParallel: false` and `workers: 1`. Global-setup (`tests/e2e/global-setup.ts`) prepares DB and seeds.
3. Use `npm run test:ui` (it sets `PLAYWRIGHT_PREPARE_DB=true`) to run E2E with automatic seeding.
4. If running the dev server manually for E2E, set `ENABLE_TEST_ENDPOINTS=true` to enable test-only helper endpoints (e.g., `/__playwright__/set-cookie`).
5. Inject Plaid stub before navigation with `page.addInitScript` using `tests/e2e/helpers/plaid.mock.ts` helper.

## Seed Runner & DB Migrations

1. Use Drizzle migration workflow:
   1. `npm run db:generate` — review SQL in `database/migrations`.
   2. `npm run db:migrate` — apply reviewed migrations for staging/prod.
   3. Use `npm run db:push` only for local/dev/test.
2. `scripts/seed/run.ts`:
   - Loads `.env.local` before importing app modules.
   - Flags:
     - `--reset` is destructive; requires `RUN_DESTRUCTIVE=true` and `--yes`.
     - `--dry-run` shows planned operations only.
3. CI must provide required secrets for seeding and building (ENCRYPTION_KEY, NEXTAUTH_SECRET, DATABASE_URL).

## Env & Secrets

- Always use `app-config.ts` / `lib/env.ts` — do not access `process.env` directly except in sanctioned code (seed runner and very small bootstrap code that loads env prior to imports).
- Production requires `ENCRYPTION_KEY` and `NEXTAUTH_SECRET` — `validateRequiredConfig()` will throw if missing.
- Recommended generators:
  1. ENCRYPTION_KEY: `openssl rand -hex 32`
  2. NEXTAUTH_SECRET: `openssl rand -base64 32`

## Lint / Type-Check / Format / CI

- Local pre-merge quick check: `npm run format && npm run type-check && npm run lint:strict`
- Full CI-like validate: `npm run validate` (build + lint + tests — slow)
- Follow ESLint rules; do not silence rules by changing config. Fix code instead.

## Scripts & Custom Tooling (explicit)

- Include and review any custom scripts before running:
  - TypeScript scripts: `scripts/*.ts` (seed, generate, export, validate, etc.)
  - Bash scripts: `scripts/*.sh` and subfolders (deploy, utils, cleanup)
  - PowerShell scripts: (search for `.ps1` in repo)
  - Batch files: (search for `.bat` in repo)
- When producing changes that reference scripts, list the exact scripts consulted and their paths.

## Where To Look First (fast checklist)

- `package.json`, `tsconfig.json`, `next.config.ts`
- `app-config.ts`, `lib/env.ts`
- `database/schema.ts`, `dal/*`
- `actions/*`, `components/*-server-wrapper.tsx`, `components/*-client-wrapper.tsx`
- `scripts/seed/*`, `scripts/*` (custom scripts), `.opencode/*`

## Commit & Code-Change Rules (agent contributor)

1. Ask for permission before modifying files or creating commits.
2. If a change touches more than 7 files, create a plan at `.opencode/commands/<short-kebab-task>.plan.md` before implementing.
3. Branch name (recommended for PR): `chore/docs/agents-md`.
4. Recommended commit message for this file: `chore(docs): update AGENTS.md (auto-detected)`.
5. Do NOT commit secrets (.env, tokens, keys).

## Small examples & snippets (how to behave)

- Plaid E2E stub injection (use helper):
  - `await addMockPlaidInitScript(page, "MOCK_PUBLIC_TOKEN")`
  - Helper is at `tests/e2e/helpers/plaid.mock.ts` and calls `page.addInitScript(...)`.
- Server action pattern (example observed in `actions/plaid.actions.ts`):
  - Auth first, Zod validate, short-circuit mocks, call Plaid, create DB row via `dal`, `revalidatePath(...)`, return `{ ok: true, wallet }`.
- Dwolla transfer: `actions/dwolla.actions.ts` wraps ledger + provider metadata creation in a `db.transaction(...)` and persists `dwolla_transfers` for reconciliation.

## Troubleshooting (high-signal)

- Playwright seed failures:
  1. Ensure `DATABASE_URL` reachable.
  2. Ensure `tsx` present so global-setup can import `scripts/seed/run.ts` instead of falling back to destructive mode.
  3. If fallback runs, it may call `npm run db:push && npm run db:seed -- --reset` — be cautious.
- Test-only endpoints not reachable:
  - If running dev server manually, set `ENABLE_TEST_ENDPOINTS=true`.
- DB migration errors:
  - Check `drizzle.config.ts`, `DATABASE_URL`, and run `npm run db:check`.
- Missing secrets:
  - Add ENCRYPTION_KEY and NEXTAUTH_SECRET in CI securely.

## Final note

Only include guidance based on patterns actually observed in the codebase. When in doubt, prefer consistency with local patterns over external “latest” best practices. Explicitly list the skills/tools, context files, and scripts you used to generate any change.

# AGENTS.md — Banking (compact)

Read this first. Only include details an automated agent would likely miss.

Core commands (exact script names)

- Start dev: npm run dev
- Type check: npm run type-check
- Lint (strict): npm run lint:strict
- Format (all files): npm run format
- Format/markdown check: npm run format:markdown:check
- Run tests (unit + E2E): npm run test
- Playwright E2E (prepare DB): npm run test:ui
- Run unit tests (Vitest only): npm run test:browser
- Run a single Vitest file: npx vitest -c vitest.config.ts run path/to/test/file
- Drizzle SQL generate: npm run db:generate
- Drizzle migrate apply: npm run db:migrate
- Drizzle push (local/dev/test only): npm run db:push
- Seed DB: npm run db:seed

High-signal rules (do not skip)

- Env access: never read process.env directly in application code. Use app-config.ts (preferred) or lib/env.ts. Exception: proxy.ts.
- Secrets: do not commit .env, .env.local, keys, or tokens. Provide CI secrets via secure channels.
- Server Actions (mutations): follow the contract enforced in .cursor/rules/mutations-via-server-actions.mdc:
  1. Zod-validate inputs.
  2. Authenticate first (auth() or session helper).
  3. Return { ok: boolean; error?: string } and include payloads on success.
  4. Catch and log errors; do not throw during E2E.
  5. Revalidate caches/tags after success.
- DB access: always use dal/\* for queries. Avoid ad-hoc SQL in components or actions. Use joins in DAL to avoid N+1 and db.transaction for atomic multi-step operations.

- Home / root page rule: keep app/page.tsx and any Home server wrapper static and public. Do NOT add auth(), database queries, or DAL calls in app/page.tsx or HomeServerWrapper — the Home route is intentionally non-authenticated and presentational.

Testing / mocks (preserve these behaviors)

- Plaid: lib/plaid.ts exports isMockAccessToken(token). Code/tests short-circuit for mock/seed tokens (start with seed- or mock-). Preserve this logic.
- Playwright: tests that interact with Plaid expect tests/e2e/helpers/plaid.mock.ts — call addMockPlaidInitScript(page, "MOCK_PUBLIC_TOKEN") before navigation in those tests.
- Dwolla: flows short-circuit when Dwolla IDs/URLs include "mock".

Seed runner (scripts/seed/run.ts)

- Loads .env.local BEFORE importing app modules; must be run with tsx (script does this). Do not reorder imports.
- --dry-run / -n: prints planned operations and writes a validation artifact; does not mutate DB.
- --reset is destructive and requires RUN_DESTRUCTIVE=true in env AND --yes/-y flag.
- If NODE_ENV === "production", ALLOW_DB_SEED must equal "true" to allow seeding.

Note: always prefer --dry-run to preview seeding. The seed script relies on .env.local being present and must be executed via the provided npm script to ensure env loading order.

Migrations & schema

- Always inspect SQL generated by npm run db:generate in database/migrations before applying npm run db:migrate.
- Do not run npm run db:push against production — only for local/dev/test.

Quick validations (recommended before opening a PR)

1. npm run format
2. npm run format:markdown:check
3. npm run type-check
4. npm run lint:strict
5. (Optional, slow) npm run test

Testing notes

- npm run test runs Playwright UI tests first (npm run test:ui) and then Vitest. Playwright tests require DB prep — use npm run test:ui when you intend to run E2E.
- To iterate quickly on unit tests, use npm run test:browser (Vitest) or the single-file command above.

Agent contributor conventions

- Ask before pushing to remote. Recommended branch for this file: chore/docs/agents-md.
- If a change touches >7 files, create a short plan at .opencode/commands/<short-kebab-task>.plan.md before implementing.
- Prefer small, surgical edits that are easy to review.

Commit & push policy:

- Do not push changes to main without asking. Prefer feature branches like chore/docs/agents-md for doc work.
- Create small, focused PRs (one area per PR: UI refactor, type fixes, docs). If you must include multiple areas, add a short plan file before implementation.

Where to look (authoritative)

- opencode.json — lists agent-facing instruction files loaded by tools
- .cursor/rules/\*.mdc — enforced project rules (env access, mutations, testing, etc.)
- app-config.ts and lib/env.ts — canonical env validation/access
- scripts/seed/run.ts — seed runner behavior & flags
- lib/plaid.ts — Plaid mock detection
- dal/_ and actions/_ — DAL and Server Action patterns
- tests/e2e/helpers/plaid.mock.ts — Playwright Plaid stub helper

If you want me to act next

1. I can commit documentation changes to branch chore/docs/agents-md and run local validations (prettier on AGENTS.md, markdownlint, npm run type-check). I will not push to remote without your explicit confirmation — reply with "push and open PR" to proceed.

Compact and intentionally minimal. Verify changes against executable sources (scripts, .cursor rules, or code) before updating guidance.

Tools & Skills

- MCP tools: Next.js runtime (MCP_DOCKER / nextjs_runtime) for runtime diagnostics, Playwright automation (MCP_DOCKER browser), and file/IO tools exposed via the MCP gateway.
- shadcn: component registry/tooling used for UI components (see components.json when present).
- Repo skills (high-signal): agent-governance, DBSkill (Drizzle patterns), TestingSkill (Vitest/Playwright), ServerActionSkill, ValidationSkill. See .opencode/skills/\* for details.
