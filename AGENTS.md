# Agent Guidelines (short)

This file lists the small, repo-specific rules and exact commands an automated agent would otherwise miss. Read before making changes.

High-priority commands

- Install deps: `npm install` (package-lock.json is authoritative)
- Dev server: `npm run dev` (Next.js on http://localhost:3000)
- Build: `npm run build`
- Quick pre-PR validate: `npm run format && npm run type-check && npm run lint:strict` (run lint before tests)
- Full validate / CI local run: `npm run validate` (build + lint + tests)

Tests

- Run all tests: `npm run test` (Vitest + Playwright)
- Unit tests (Vitest): `npm run test:browser` or `npm exec vitest run <path-to-test> --config=vitest.config.ts`
- E2E (Playwright): `npm run test:ui` (this will prepare DB by default) or `npx playwright test <spec> --project=chromium`
- Playwright preconditions: a running Postgres, seeded DB, and environment vars: `DATABASE_URL`, `ENCRYPTION_KEY`, `NEXTAUTH_SECRET`. The test runner uses `PLAYWRIGHT_PREPARE_DB=true` when running via npm script.
- Always free port 3000 before running Playwright/Vitest. Examples:
  - PowerShell:
    ```powershell
    $pids = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
    if ($pids) { $pids | ForEach-Object { Stop-Process -Id $_ -Force } }
    ```
  - Unix:
    ```bash
    lsof -ti tcp:3000 | xargs -r kill -9
    ```

Database / Drizzle

- Push schema: `npm run db:push`
- Generate migrations: `npm run db:generate`
- Run migrations: `npm run db:migrate`
- Seed test DB: `npm run db:seed` (uses `PLAID_TOKEN_MODE=sandbox`)

Environments & secrets

- NEVER commit secrets (.env, tokens). Do not add .env to commits.
- Do not read `process.env` directly from app/ Server Components — use the centralized helpers: `app-config.ts` and `lib/env.ts`.

Server Actions, DAL, and app boundaries (critical)

- Server Actions must follow repository conventions (verified by `scripts/verify-rules.ts`): include `"use server"`, call `auth()` early for protected actions, validate inputs with Zod/shared schemas, and return a shape like `{ ok: boolean, error?: string }`.
- Do NOT import the DB directly inside app/ components or pages. Use the typed DAL in `dal/` which accepts an optional `{ db }` tx override for transactional flows.

Verify-rules & repo hygiene

- Regenerate verification report: `node scripts/verify-rules.ts` (alias: `npm run verify:rules` if present).
- Output: `.opencode/reports/rules-report.json`. The verify-rules script enforces: no direct `process.env` in app code, Server Action patterns, no direct DB imports from app/, and other repo policies.

Small-change / plan rules

- Keep edits small and reversible. Do NOT change more than 5 files without explicit approval.
- For changes touching many files, create a lightweight plan at: `.opencode/commands/<short-kebab-task>.plan.md`. The plan should list batches (<=7 files/batch), verification steps, and provenance (files read).

Issue tracking (bd / beads)

- This repo uses `bd` (beads) for tracked work. Check ready work: `bd ready --json`.
- Example commands:
  - `bd create "Title" -t bug|feature|task -p 0-4 --json`
  - `bd update bd-42 --status in_progress --json`
  - `bd close bd-42 --reason "Completed" --json`
- When you modify issue state, commit the updated `.beads/issues.jsonl` with your change.

Commit / PR provenance and hooks

- All automated edits must include a one-line provenance in the commit or PR body describing which files were read and why (required by agent workflow).
- Example commit message:
  - Subject: `chore(ci): sync branch with main`
  - Body: `Provenance: read package.json, AGENTS.md, scripts/verify-rules.ts, app-config.ts`
- Pre-commit hooks: the repo uses Husky. Run `npm run prepare` after first install to set hooks. Respect lint-staged pre-PR checks.

CI and runtime notes

- CI uses Node 22 (GitHub Actions). Follow package.json scripts for local equivalence.

Where to look first (highest signal)

- package.json (scripts) — canonical commands
- README.md — quick-start + env examples
- scripts/verify-rules.ts and `.opencode/reports/rules-report.json` — repo policy enforcement
- app-config.ts / lib/env.ts — centralized env access
- dal/ — DB access patterns and transaction helpers
- actions/ — server actions that must follow conventions

Quick checklist before opening a PR

1. Run: `npm run format && npm run type-check && npm run lint:strict`
2. Run `node scripts/verify-rules.ts` and address warnings/critical findings
3. Run the unit tests you changed: `npm run test:browser` (or targeted vitest)
4. If you changed runtime behavior, run `npm run test:ui` (E2E) locally after seeding DB

References: README.md, package.json, scripts/verify-rules.ts, app-config.ts, lib/env.ts, dal/, actions/
