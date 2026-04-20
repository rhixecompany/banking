# Agent guidelines (short)

Concise, high-signal rules an automated agent would otherwise miss. Read this before making edits, running CI, or opening PRs.

High-priority commands (exact)

- Install deps: npm install (package-lock.json is authoritative)
- Dev server: npm run dev (Next.js dev on http://localhost:3000)
- Build: npm run build (use npm run build:standalone only when explicitly needed)
- Quick pre-PR validate: npm run format && npm run type-check && npm run lint:strict
- Full local CI: npm run validate (runs codegen/validate, build, lint, tests)
- Rules check: npm run verify:rules (CI: npm run verify:rules:ci -> writes .opencode/reports/rules-report.json)
- Install git hooks (first setup): npm run prepare (Husky). Do not bypass hooks unless authorized.

Tests & Playwright (gotchas)

- Run all tests: npm run test (this runs test:ui then test:browser).
- Unit tests: npm run test:browser (or npm exec vitest run <path> --config=vitest.config.ts).
- E2E: npm run test:ui (this sets PLAYWRIGHT_PREPARE_DB=true and will try to prepare/seed the DB).
- Playwright requires: a running Postgres, a seeded DB (npm run db:seed), and env vars: DATABASE_URL, ENCRYPTION_KEY, NEXTAUTH_SECRET.
- Free port 3000 before running Playwright/Vitest. On Unix: lsof -ti tcp:3000 | xargs -r kill -9. On Windows PowerShell: stop the process listening on TCP:3000.

Database / Drizzle

- Drizzle commands (drizzle.config.ts is authoritative):
  - npm run db:push
  - npm run db:generate
  - npm run db:migrate
  - npm run db:seed (uses PLAID_TOKEN_MODE=sandbox)

Environments & secrets (do not miss)

- NEVER commit secrets (.env, tokens). Git hooks and eslint/no-secrets help but are not a substitute.
- Do not read process.env directly from app/ Server Components — use app-config.ts and lib/env.ts. verify-rules flags direct reads and CI may fail.

Server Actions, DAL, and app boundaries (critical)

- Server Action conventions (scripts/verify-rules.ts enforces these):
  - include "use server" at the top
  - call auth() early for protected actions
  - validate inputs with Zod/shared schemas
  - return { ok: boolean, error?: string } for actions
- Do NOT import the DB directly from app/ components or pages. Use the typed DAL in dal/.
- DAL methods accept an optional { db } transaction override — pass a tx when composing multi-table operations.

Verify-rules & repo hygiene

- Run npm run verify:rules locally; CI runs verify:rules:ci and writes .opencode/reports/rules-report.json for review.
- verify-rules looks for: direct process.env in app/, server-action rule violations (missing auth/Zod/shape), direct DB imports from app/, and other repo policies. Fix critical findings before opening PRs.

Small-change / plan rules (read before making multi-file edits)

- Keep edits small & reversible. Default safe target: <= 5 files.
- If you plan to change >5 files, get explicit approval (comment or reviewer sign-off) before pushing.
- If the change touches _more than 7 files_ or is cross-cutting, create a plan file: .opencode/commands/<short-kebab-task>.plan.md. Use npm run plan:ensure to scaffold/validate plans.
  - Plans must list batches (<=7 files per batch), verification steps, and provenance (files inspected).

Issue tracking (bd / beads)

- Use bd (beads) for tracked work. Example: bd create "Short title" -t bug|feature|task -p 0-4 --json
- If you change issue state, commit the updated .beads/issues.jsonl alongside your change.

Commit / PR provenance and hooks

- All automated edits (or agent-made changes) must include a one-line provenance in the commit or PR body listing files read and why.
  - Example commit body: Provenance: read package.json, AGENTS.md, scripts/verify-rules.ts, app-config.ts
- Respect Husky pre-commit hooks (npm run prepare). Do not use --no-verify unless explicitly authorized.
- Do not force-push main/master. Ask before any force push.

CI & runtime notes

- CI uses Node 22 (GitHub Actions). Match this locally when reproducing CI issues.
- Next.js 16 (App Router + Server Actions) and Drizzle ORM are core. Follow the Server Action and DAL rules above.

Where to look first (highest signal)

- package.json (scripts)
- README.md and .env.example
- .opencode/opencode.json and .opencode/instructions/\* (agent rules & plan standards)
- scripts/verify-rules.ts and .opencode/reports/rules-report.json
- app-config.ts and lib/env.ts (centralized env access)
- dal/ (DB access patterns) and database/schema.ts
- actions/ and app/api/\* (Server Actions and API wiring)
- .github/copilot-instructions.md and .opencode/commands/ (plan policy)

Quick checklist before opening a PR

1. npm run format && npm run type-check && npm run lint:strict
2. npm run verify:rules — fix critical findings
3. Run unit tests you changed (npm run test:browser or targeted vitest)
4. If runtime behavior changed, run E2E (npm run test:ui) after seeding DB
5. Add one-line provenance to commit/PR body; commit .beads/issues.jsonl if you changed issues

References (canonical files to read)

- package.json, README.md, scripts/verify-rules.ts, app-config.ts, lib/env.ts, .opencode/instructions/09-plan-file-standards.md, .github/copilot-instructions.md
