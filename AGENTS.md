<!--
  AGENTS.md — compact, high-signal guidance for automated agents.
  Only include items an agent would likely miss.
-->

# AGENTS.md — Banking (compact)

Read this first — it is authoritative for automated agents. If you are an agent, ask the user who they are and which persona/role you should act as (developer, reviewer, ops, CI), and whether you have permission to modify files or should only propose changes.

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

## Single-Test Helpers

```
npx playwright test tests/e2e/<spec>.ts --project=chromium
npx vitest run tests/unit/<test>.ts
```

## Validation / Pre-merge

- Quick: `npm run format && npm run type-check && npm run lint:strict`
- Full (CI-like): `npm run validate` (build + lint + tests — slow)

## Database & Migrations (do not guess)

- Canonical/required table name: `wallets` (many DAL methods and tests expect this exact name).
- Migration workflow (follow exactly):
  1. `npm run db:generate` — review generated SQL in `database/migrations`.
  2. `npm run db:migrate` — apply reviewed migrations (recommended for staging/prod).
  3. Use `npm run db:push` only for local/dev/test flows (Playwright global-setup and docker use push).
- `npm run db:reset` = `db:drop` + `db:generate` + `db:push` (local convenience).
- Policy: require review/approval before applying migrations to staging/production. Do NOT run `db:push` against production.

## Playwright / E2E (read before running)

- Test order: Playwright E2E runs first (stateful), then Vitest unit tests. E2E is sequential and shares DB/auth state.
- `playwright.config.ts` uses `fullyParallel: false` and `workers: 1`. The webServer launches `npm run dev` and forwards only a small set of test flags (`PLAYWRIGHT_PREPARE_DB`, `ENABLE_TEST_ENDPOINTS`) to the spawned dev server.
- `npm run test:ui` sets `PLAYWRIGHT_PREPARE_DB=true`. If you start the dev server manually, export `ENABLE_TEST_ENDPOINTS=true` (or `PLAYWRIGHT_PREPARE_DB=true`) so test-only endpoints become available.
- Test-only helper endpoint: `POST ${baseUrl}/__playwright__/set-cookie` — file: `app/__playwright__/set-cookie/route.ts`. This route is intentionally guarded and should be disabled in production.
- Global-setup (`tests/e2e/global-setup.ts`) behavior:
  - Loads `.env`, `.env.local`, `.env.test` from repo root.
  - Validates `DATABASE_URL` is set and reachable.
  - Prefers importing and calling the TypeScript seed runner `scripts/seed/run.ts` (idempotent).
  - If import fails, fallback runs: `npm run db:push && npm run db:seed -- --reset` (destructive fallback). Avoid fallback surprises by ensuring CI tooling is present (see seed runner notes).
  - Performs a dev-server warm-up request to reduce cold-start flakiness.
- Windows: free port `3000` before running Playwright (webServer default).

## Seed Runner (scripts/seed/run.ts) — flags & safety

- Loads `.env.local` before importing app modules (env must be present).
- Usage: `npm run db:seed` (package script runs `tsx --env-file=.env.local scripts/seed/run.ts`).
- Flags:
  - `--reset` — truncates application tables (destructive). Requires `RUN_DESTRUCTIVE=true` and `--yes`.
  - `--dry-run` / `-n` — show planned operations only.
  - `--yes` / `-y` — skip confirmation prompts.
- Production guard: seeding refuses unless `ALLOW_DB_SEED=true`.
- Recommendation: ensure `tsx` is available in CI so global-setup can import the TS seed runner instead of triggering the destructive fallback.

## Env & Secrets (authoritative)

- Use `app-config.ts` or `lib/env.ts` for environment access — do not read `process.env` directly except in sanctioned places.
- Required secrets: `ENCRYPTION_KEY` (AES-256-GCM) and `NEXTAUTH_SECRET`. `validateRequiredConfig()` will throw in production if missing.
- Recommended generators:
  - `ENCRYPTION_KEY`: `openssl rand -hex 32` (32+ bytes)
  - `NEXTAUTH_SECRET`: `openssl rand -base64 32`
- NEVER commit `.env` or secret files to the repo.

## CI / Test Env Vars (documented)

- `PLAYWRIGHT_PREPARE_DB` — when `true` Playwright global-setup will prepare/seed the DB.
- `ENABLE_TEST_ENDPOINTS` — enables test-only routes when running dev server manually.
- `PLAYWRIGHT_BASE_URL` — override Playwright base URL if not localhost.
- `RUN_DESTRUCTIVE` — required by seed runner when performing destructive resets.
- `ALLOW_DB_SEED` — permits seeding in production when explicitly allowed.
- CI must set required secrets (`ENCRYPTION_KEY`, `NEXTAUTH_SECRET`, `DATABASE_URL`) securely.

## DAL & Server Actions (must-follow)

- All DB access must go through `dal/*`. Do not run ad-hoc DB queries in components or server actions.
- Prevent N+1 by writing JOINs in DAL rather than per-row calls.
- Server Actions (`actions/*`):
  - Validate inputs with Zod.
  - Return the shape `{ ok: boolean; error?: string }`.
  - Call `revalidatePath()` after successful mutations.

## CI / Pre-merge

- CI runs: `npm run type-check`, `npm run lint:strict`, `npm run test` (Playwright + Vitest).
- For fast iteration: run `npm run type-check && npm run lint:strict` locally and run E2E only when needed.

## Agent contributor rules

- Read this AGENTS.md first — it is the canonical source for agent behavior and repo gotchas.
- If a change touches more than 3 files, create a plan at `.opencode/plans/<task>_<8char-id>.plan.md` before implementing.
- For single-file doc edits (AGENTS.md), a plan is not required.
- Branch name (recommended for PR): `chore/docs/agents-md`.
- DO NOT commit secrets (.env, tokens, keys).

## Where To Look First

- `package.json` (scripts)
- `playwright.config.ts` and `tests/e2e/global-setup.ts`
- `scripts/seed/run.ts`
- `app-config.ts` and `lib/env.ts`
- `database/schema.ts` and `dal/*`
- `actions/*`
- `app/__playwright__/set-cookie/route.ts`

## Troubleshooting (extended, high-signal)

- Playwright seed failures
  - Symptom: global-setup errors or tests fail during setup.
  - Check: `DATABASE_URL` reachable, `tsx` installed in CI, `npm run db:generate` works locally.
  - If seed import fails, global-setup falls back to `npm run db:push && npm run db:seed -- --reset` — this can be destructive. Ensure CI provides `RUN_DESTRUCTIVE=true` and `--yes` if that path is expected, or ensure `tsx` is present so the safer seed-runner is imported.
  - Inspect Playwright and global-setup logs (Playwright output and `playwright-report`) for the exact failure step.
- Test-only endpoints not reachable
  - If you run `npm run dev` manually, set `ENABLE_TEST_ENDPOINTS=true` to enable `app/__playwright__/set-cookie`.
  - `test:ui` sets `PLAYWRIGHT_PREPARE_DB=true` automatically when Playwright starts the dev server; prefer running `npm run test:ui` instead of manual sequences.
- DB push / migrate errors
  - If `drizzle-kit` commands fail, check `drizzle.config.ts`, `DATABASE_URL`, and Postgres connectivity. Run `npm run db:check` to validate Drizzle config.
  - `npm run db:generate` writes SQL under `database/migrations` — always review those files before committing.
- Missing ENCRYPTION_KEY / NEXTAUTH_SECRET
  - Startup in production will throw. Add secrets to CI/env store securely (do not commit).
  - Example: `ENCRYPTION_KEY=$(openssl rand -hex 32)`
- Cold-start / flaky E2E
  - Global-setup does a warm-up request; if your environment is slow increase Playwright timeouts or run a warm build first.
- Local Windows specifics
  - Ensure port 3000 is free before running Playwright (default webServer url).
- Dry-run seeding
  - Use `npm run db:seed -- --dry-run` to verify planned operations without mutating the DB.
- If you’re unsure, stop and ask: “May I modify files / run commands?” — don’t proceed without explicit permission.
