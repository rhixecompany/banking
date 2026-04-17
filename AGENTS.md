# AGENTS — Minimal, High-Signal Guidance for Automated Contributors

Short, actionable items an agent would likely miss. Read this first.

## 0. Exact commands to use (copy/paste)

- Dev server: npm run dev
- Typecheck: npm run type-check
- Strict lint: npm run lint:strict
- Format (auto-fix): npm run format
- Verify repository rules (required before PR): npm run verify:rules
- Run both E2E and unit tests (slow): npm run test
- Run Playwright E2E only: npm run test:ui
- Run Vitest only: npm run test:browser
- DB seed (reads .env.local): npm run db:seed
- Dry-run DB seed: npm run db:seed -- --dry-run
- DB seed reset (destructive): npm run db:seed -- --reset (requires RUN_DESTRUCTIVE=true AND explicit approval)

## 1. Environment & secrets (strict)

- Never read process.env directly inside application runtime code. Use app-config.ts or lib/env.ts. (scripts/ may use process.env; check scripts/seed/run.ts for examples.)
- Never commit .env, .env.local, or secrets. If you see secrets in committed files, stop and ask.

## 2. Database & DAL

- All DB access must go through dal/\*. Do NOT import the DB client in app/, components, pages, or server wrappers.
- Prevent N+1 by using DAL helpers that eager-load related data.

## 3. Server Actions & mutations

- Server Actions live under actions/\*. Follow the contract: validate with Zod, authenticate early (auth()/session?.user), use dal/\_ for DB access, return { ok: boolean; error?: string } and avoid uncaught throws, revalidate caches/tags after success.
- Avoid putting stateful mutation logic in API routes — use Server Actions instead.

## 4. App Router entrypoints

- app/page.tsx must remain static/public. Do not add auth(), DB queries, or DAL imports there.

## 5. Static checks and CI

- Always run npm run verify:rules before creating a PR. CI depends on .opencode/reports/rules-report.json (verify:rules:ci writes it).
- Typical local pre-PR checklist: npm run format && npm run type-check && npm run lint:strict (optionally npm run test for behavior changes).

## 6. Tests and Playwright quirks

- Playwright E2E is slow and may prepare a DB. Use test:ui only when necessary. The test command sets PLAYWRIGHT_PREPARE_DB=true for local runs.
- If you modify E2E fixtures or Playwright setup, run the playwright report: npm run test:ui:report
- Always free port 3000 by killing any process currently using it before Ever running any Playwright E2E test

## 7. Dangerous or destructive actions (do not run without approval)

- npm run db:drop, npm run db:reset, npm run db:push (writes DB), and db:seed --reset are destructive. Require explicit human approval and RUN_DESTRUCTIVE env flags as called out in scripts.
- Clean scripts remove many directories: npm run clean (safe), npm run clean:all (removes node_modules + lockfile) — avoid unless instructed.

## 9. Change, commit, and planning rules (must follow)

- Ask the human: do not modify files or create commits without explicit permission.
- If a change will touch >5 files, create a short plan before editing (.opencode/commands/\*.plan.md). Follow .opencode/instructions/09-plan-file-standards.md.
- NEVER commit secrets or run destructive scripts without explicit approval.
- Every commit/PR MUST include a one-line provenance note listing files read and why (one-line). Example: "Provenance: read package.json, app-config.ts — verify commands and env rules." Put this in the commit/PR body.

## 10. Where to inspect first (highest signal files)

- package.json (scripts): exact commands and side-effect notes.
- app-config.ts and lib/env.ts: canonical env access (do NOT use process.env elsewhere).
- scripts/verify-rules.ts: repository checks enforced by verify:rules.
- scripts/seed/run.ts: db seed behavior and .env.local usage.
- actions/\* and dal/\*: mutation and DB patterns.
- next.config.ts and eslint.config.mts: framework flags and lint rules.

## 11. Useful repo facts an agent would miss

- Next.js version: 16.x (App Router, Server Actions, RSC) — watch for Next.js/React-specific patterns.
- This repo uses Drizzle ORM + dal/\* patterns; drizzle CLI scripts exist (db:generate, db:migrate, db:push).
- verify:rules enforces custom rules (no direct process.env in app code, Zod schemas, Server Action heuristics) and writes .opencode/reports/rules-report.json for CI.

## 12. If you need to run commands or edit files

- Ask 1 question first: "May I make edits and commit?" If answer is yes, proceed with small focused commits and include provenance.

Provenance: edits to this file read: package.json, README.md, .opencode/instructions/\* to extract exact scripts, verify:rules, env and DAL guidance.
