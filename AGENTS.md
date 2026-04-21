Purpose

This file is a concise, high-signal checklist for automated agents (OpenCode / OpenAI sessions). Only include repo-specific facts an agent would likely miss without help.

Read first

- README.md (project overview; env examples)
- package.json (scripts are the single source of truth)
- .opencode/\* (agent policies, plan rules, instructions)
- .github/workflows/\* (CI runs full validation)

High-signal rules (read before editing)

- Do NOT commit secrets (.env, API keys, tokens). Add logs/ and .env to .gitignore if you create them.
- Do NOT read process.env directly; use app-config.ts or lib/env.ts. (proxy.ts is an explicit exception in this repo.)
- If a change touches >7 files, create a plan: .opencode/commands/<short-kebab-task>.plan.md (see .opencode/instructions).
- This repo uses husky hooks — edits may be auto-formatted or rejected by pre-commit.

Essential commands (exact)

- Install: npm install
- Dev server: npm run dev
- Build: npm run build (prebuild runs clean + type-check)

Quick local validation (run before creating PRs)

- npm run format
- npm run type-check
- npm run lint:strict
- Full pipeline (slow): npm run validate # runs scripts/validate.ts --all, build, lint:strict, and tests including Playwright

Tests (shortcuts)

- Vitest (unit/headless): npm run test:browser
  - Single file: npx vitest path/to/test --run
- Playwright (E2E/UI): npm run test:ui
  - Uses cross-env PLAYWRIGHT_PREPARE_DB=true and chromium project. Playwright tests may require browsers and a Postgres DATABASE_URL.
  - Install browsers: npx playwright install

Database / Drizzle

- Generate migration: npm run db:generate
- Push schema: npm run db:push
- Run migrations: npm run db:migrate
- Drizzle Studio: npm run db:studio
- Seed local DB (reads .env.local): npm run db:seed

Code & infra conventions worth checking

- All DB writes must go through dal/ helpers (see dal/ and database/schema.ts). Avoid DB calls in loops (watch for N+1).
- Server Actions are the place for stateful mutations. Validate input with Zod, guard with auth(), use DAL, and revalidate caches (see actions/ and server-action-skill).
- Sensitive API integrations (Plaid, Dwolla) expect tokens encrypted via lib/encryption.ts and environment keys via app-config.ts.

CI gotchas

- CI is authoritative; local passes do not guarantee CI passes. See .github/workflows/ci.yml and verify-agents.yml.
- If CI fails due to missing lockfile: run npm install --package-lock-only to regenerate.

- Do NOT create commits on behalf of the user unless explicitly requested.
- When asked to commit: run Quick local validation, create a plan for large changes, then commit.

Fast troubleshooting

1. npm install
2. npm run format && npm run type-check && npm run lint:strict
3. If behavior changed: npm run test:browser (only run Playwright if DB and browsers are available)

When in doubt

- Ask one short question (missing env for CI, branch policy, test prerequisites). Check .opencode/instructions and backupopencode.json first.

Minimum context sources

- app-config.ts, lib/env.ts, database/schema.ts, dal/, actions/, .opencode/instructions, package.json, .github/workflows/

Keep edits small, verify quickly, and follow the plan-file rule for large edits.
