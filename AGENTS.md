Agent Guidelines (short)

This file contains the small set of repo-specific rules, exact commands, and gotchas an automated agent would otherwise miss. Read this before making changes.

- Primary package manager / scripts
  - Install: `npm install` (this repo uses package-lock.json + npm scripts)
  - Dev server: `npm run dev` (Next.js on localhost:3000)
  - Build: `npm run build`
  - Quick validate (recommended before PR): `npm run format && npm run type-check && npm run lint:strict`
  - Full validation (CI-like): `npm run validate` (runs build, lint, tests)

- Tests
  - All tests: `npm run test` (runs Vitest + Playwright suites)
  - Unit (Vitest): `npm run test:browser` or `npm exec vitest run <path-to-test> --config=vitest.config.ts`
  - E2E (Playwright): `npm run test:ui` or `npx playwright test <spec> --project=chromium`
  - IMPORTANT: Free port 3000 before running Playwright/Vitest on CI or locally (PowerShell example):
    ```powershell
    $pids = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
    if ($pids) { $pids | ForEach-Object { Stop-Process -Id $_ -Force } }
    ```

- Database / Drizzle
  - Push schema: `npm run db:push`
  - Generate migrations: `npm run db:generate`
  - Run migrations: `npm run db:migrate`
  - Seed test DB: `npm run db:seed` (uses PLAID_TOKEN_MODE=sandbox)

- Environment & secrets
  - Do NOT commit secrets (.env, tokens). Never add .env files to commits.
  - Prefer the repo env helpers (`app-config.ts` / `lib/env.ts`) instead of reading `process.env` directly in app code.

- Verify rules (repo hygiene)
  - Regenerate the repository rule report with: `node scripts/verify-rules.ts` (or `npm run verify:rules` if available).
  - Report is written to `.opencode/reports/rules-report.json` — check this after changes that touch config, scripts, or many files.
  - The verify-rules script enforces: no direct process.env in app code, Server Action patterns, and other repo policies.

- Small-change / plan rules
  - Keep edits small and reversible. Do not change more than 5 files without user approval.
  - If a change touches many files, create a plan file under `.opencode/commands/<short-kebab-task>.plan.md` before implementing. (Legacy plans may exist under `.cursor/plans/` — preserve them.)

  - For larger refactors, include a short plan file that lists batches (<=7 files per batch), verification steps, and the provenance files read.

- Issue tracking (bd / beads)
  - The repo uses bd (beads) for tracked work. Check ready work: `bd ready --json`.
  - Create/update/close examples:
    - `bd create "Title" -t bug|feature|task -p 0-4 --json`
    - `bd update bd-42 --status in_progress --json`
    - `bd close bd-42 --reason "Completed" --json`
  - Always commit `.beads/issues.jsonl` together with code changes that modify issue state.

- Agent provenance & commit conventions
  - All automated edits should include a one-line provenance in the commit or PR body (what files were read and why the change was made).
  - Commit message convention example:
    - Subject: `chore(ci): sync branch with main`
    - Body: `Provenance: read package.json, AGENTS.md, scripts/utils/run-ci-checks.sh, tests/setup.ts`

- Where to look first (high signal files)
  - package.json (scripts) — canonical commands
  - README.md — quick-start and env examples
  - AGENTS.md (this file), .cursorrules, .cursor/rules/ — agent rules and workflow
  - .opencode/opencode.json — MCP and plugin configuration
  - .github/copilot-instructions.md — Copilot-specific shortcuts and single-test examples
  - actions/, dal/, app-config.ts, next.config.ts, scripts/verify-rules.ts — code entry points and verification logic

Extra quick commands

- Install deps: `npm install` (uses package-lock.json)
- Dev server: `npm run dev` (Next.js on localhost:3000)
- Build: `npm run build`
- Quick local validate before PR: `npm run format && npm run type-check && npm run lint:strict`
- Full validate (CI-like): `npm run validate` (runs build, lint, tests)
- Run verify rules: `node scripts/verify-rules.ts`

- Miscellaneous gotchas
  - Pre-commit hooks: repo uses Husky (`npm run prepare` on first install). Respect lint-staged and pre-PR checks.
  - Playwright tests may be slow — prefer running targeted tests during iterative work.
  - When in doubt, ask the user before committing code changes that modify behavior or touch >5 files.

- Dev server / Playwright port gotcha
  - Playwright and Vitest expect port 3000 free. Free it before running tests (PowerShell example in repo). If the port is occupied, tests or dev server will fail or hang.

References: README.md, package.json, .opencode/opencode.json, .cursorrules, .cursor/rules/\*, .github/copilot-instructions.md
