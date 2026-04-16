<!--
  AGENTS.md — Banking (compact)
  Purpose: one-file, high-signal instructions an automated agent would otherwise miss.
  Keep this short. If in doubt, omit.
-->

# AGENTS.md — Banking (compact)

Read this file first. It contains repo-specific commands, guardrails, and gotchas an automated agent will likely miss.

Core commands (use these exact scripts)

- Start dev: npm run dev
- Typecheck: npm run type-check
- Lint (strict): npm run lint:strict
- Format: npm run format
- Run tests (unit + E2E): npm run test
- Run Playwright E2E (with DB prepare): npm run test:ui
- Drizzle migrations: npm run db:generate -> review generated SQL in database/migrations -> npm run db:migrate (Use npm run db:push only for local/dev/test)
- Seed DB: npm run db:seed

Key constraints & gotchas (high-signal, do not miss)

- This app uses Next.js 16 (App Router), React 19, TypeScript, and Drizzle ORM. Use the scripts above exactly.
- Environment access: do not read process.env directly in app code. Use app-config.ts (preferred) or lib/env.ts. Exception: proxy.ts may read process.env.
- Never commit secrets (.env, .env.local, keys, tokens). If secrets are needed for CI, request them via secure channels.

Server Actions (mutations)

- Server Actions live under actions/\*. Follow the contract in every action:
  1. Zod-validate inputs.
  2. Authenticate first: call const session = await auth() (or session helper).
  3. Return shape: always return { ok: boolean; error?: string } (include payload fields on success).
  4. Catch and log errors; do not throw during E2E flows.
  5. Revalidate cache after successful mutations (revalidatePath/revalidateTag/updateTag).

Database & DAL rules

- All DB access must go through dal/\*. Do not run ad-hoc queries from components or server actions.
- Avoid N+1 by writing joins in DAL functions.
- For multi-step operations that must be atomic use db.transaction(...).

Deterministic testing & mocks (preserve these behaviors)

- Plaid: lib/plaid.ts exports isMockAccessToken(token). Server actions and tests short-circuit when tokens look like mocks — preserve this logic.
- Playwright E2E: tests expect a Plaid Link stub. Use tests/e2e/helpers/plaid.mock.ts and call addMockPlaidInitScript(page, "MOCK_PUBLIC_TOKEN") before navigation in tests that interact with Plaid.
- Dwolla: test flows short-circuit when Dwolla IDs/URLs include "mock" — preserve that behavior.

Seed runner (scripts/seed/run.ts)

- Loads .env.local before importing app modules — run via tsx (npm script uses tsx).
- --dry-run: prints planned operations and writes a validation artifact when possible.
- --reset is destructive: requires RUN_DESTRUCTIVE=true (env) AND --yes (or -y) flag to proceed.
- Production safety: if NODE_ENV === "production", ALLOW_DB_SEED must be "true" to run.

Migrations & schema

- Generate SQL: npm run db:generate; review files under database/migrations; then apply: npm run db:migrate.
- Use db:push only for local/dev/test; do not push schema to production without review.

Quick local validation (recommended before opening a PR)

1. npm run format
2. npm run type-check
3. npm run lint:strict (Optional) npm run test — Playwright E2E is slow; run only when needed.

Agent contributor rules

- Ask for permission before committing or pushing changes.
- If a change touches >3 files, create a short plan at .opencode/plans/<task>\_<8char-id>.plan.md before implementing.
- Prefer small, surgical edits. Suggested branch name for small doc changes: chore/docs/agents-md.

Where to look (authoritative sources)

- app-config.ts and lib/env.ts — canonical env validation/access
- scripts/seed/run.ts — seed runner behavior & flags
- lib/plaid.ts — Plaid mock detection and client init
- dal/\* — canonical DB access patterns
- actions/\* — server action examples and contract
- tests/e2e/helpers/plaid.mock.ts — Playwright Plaid stub helper

If you want me to do more

- I can run quick validations after editing: npx prettier --config .prettierrc.ts --write "AGENTS.md" && npm run type-check
- I will not push without your confirmation. To commit & branch: confirm branch name (default: chore/docs/agents-md) and commit message (default: chore(docs): update AGENTS.md).
