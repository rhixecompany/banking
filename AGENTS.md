<!--
  AGENTS.md — Banking (merged from draft-agents.md)
  Purpose: single-file, high-signal instructions an automated agent would otherwise miss.
  This file merges rules from draft-agents.md into the canonical AGENTS.md.
-->

Read this first — it is authoritative for automated agents. If you are an agent, state who you act as (developer, reviewer, ops, CI) and whether you may modify files or only propose changes.

## Agent Role

- Act as a responsible code contributor for this Next.js + Drizzle project.
- Prefer small, focused edits; do not make large refactors without user approval.
- Follow project rules exactly: no raw `process.env` in app code, DAL-only DB access, no server mutations outside `actions/*`, and no `any` types.
- Use existing docs before adding new patterns: `AGENTS.md`, `.github/copilot-instructions.md`, `.cursor/rules/*`, and `README.md`.

## Quick Commands

```
npm run dev
npm run type-check
npm run lint:strict
npm run format
npm run format:markdown:check
npm run test         # runs Playwright E2E then Vitest
npm run test:ui      # Playwright E2E (prepares DB)
npm run test:browser # Vitest (unit)
npx vitest -c vitest.config.ts run path/to/test/file
npm run db:generate
npm run db:migrate
npm run db:push      # local/dev/test only
npm run db:seed
npm run db:reset
```

## Technology Versions (observed)

- Next.js: 16.2.2 (package.json)
- React: ^19 (package.json)
- TypeScript: ^6.0.2 (package.json, tsconfig.json target ES2017)
- Drizzle ORM: drizzle-orm v0.45.2, drizzle-kit v0.31.10 (package.json)
- Playwright: @playwright/test v1.59.1 (package.json)
- Vitest: v4.1.2 (package.json)
- Zod: ^4.x (package.json)

Note: Node is not pinned in package.json; respect CI/runtime constraints when producing code.

## High-signal Rules (must obey)

- Env access: never read process.env directly in application code. Use app-config.ts (preferred) or lib/env.ts. Exceptions: seed runner and tiny bootstrap scripts that intentionally load env before imports.
- Secrets: do not commit .env, .env.local, keys, or tokens. CI must provide ENCRYPTION_KEY and NEXTAUTH_SECRET.
- Server Actions (mutations): live in actions/\* and MUST follow this contract:
  1. Validate inputs with Zod (descriptive messages required).
  2. Authenticate first: const session = await auth(); verify session?.user.
  3. Return Promise<{ ok: boolean; error?: string; ...payload }>. Do not throw uncaught exceptions during E2E.
  4. Revalidate caches/tags after success (revalidatePath / revalidateTag / updateTag).
- DB access: always use dal/\* for database queries. Do not place ad-hoc DB queries in components or actions. Prevent N+1 by eager-loading (joins) in DAL. Use db.transaction(...) for atomic multi-step operations.
- Home page constraint: keep app/page.tsx and Home server wrappers static and public. Do NOT add auth(), DAL, or DB queries there.

## Seed & Migrations (critical)

- scripts/seed/run.ts loads .env.local BEFORE importing app modules — run via the npm script to preserve env loading order.
- Use npm run db:generate to produce SQL (inspect database/migrations) before running npm run db:migrate.
- npm run db:push is local/dev/test only — do NOT use in production.
- Seed flags: --dry-run shows planned operations; --reset is destructive and requires RUN_DESTRUCTIVE=true and --yes.
- CI must supply DATABASE_URL and secrets for seeding. If NODE_ENV === "production", ALLOW_DB_SEED must be "true" to allow seeding.

## Testing & Deterministic Mocks

- Test order: Playwright E2E runs first (stateful), then Vitest unit tests. Use npm run test to run both.
- Playwright config runs single-worker tests (fullyParallel: false). Do not parallelize E2E without ensuring isolated DB state.
- Plaid & Dwolla short-circuit for deterministic E2E:
  - lib/plaid.ts exposes isMockAccessToken(token) (recognises prefixes like seed-/mock-).
  - Use tests/e2e/helpers/plaid.mock.ts helper: await addMockPlaidInitScript(page, "MOCK_PUBLIC_TOKEN") before navigation.
  - Dwolla flows detect "mock" in IDs/URLs to avoid network calls.
- When running E2E manually, set ENABLE_TEST_ENDPOINTS=true to enable test-only helpers (e.g., /**playwright**/set-cookie).

## Lint / Type-check / CI

- Pre-PR local quick-check: npm run format && npm run format:markdown:check && npm run type-check && npm run lint:strict
- Full CI validation: npm run validate (slow — runs tests).
- Do not silence ESLint rules; fix violations.

## Scripts & Tooling

- Inspect custom scripts before running: scripts/_.ts, scripts/_.sh, scripts/**/\*.ps1, scripts/**/\*.bat.
- When referencing scripts in changes, list exact script paths you inspected.

## Commit / Change Rules for Agents

1. Ask for permission before modifying files or making commits. If permitted, prefer small, focused commits.
2. If a change touches > 7 files, create a plan at .opencode/commands/<short-kebab-task>.plan.md with Goals, Scope, Target Files, Risks, Validation. Save plans under the `.opencode/commands/` directory and follow the plan-file template in `.opencode/instructions/09-plan-file-standards.md`.
3. Recommended branch name for docs: chore/docs/agents-md. Do not push to main without explicit instruction.
4. Never commit secrets or embed sensitive values in code.

## Where To Inspect First (authoritative)

- package.json, tsconfig.json, next.config.ts
- app-config.ts, lib/env.ts
- database/schema.ts, dal/\*
- actions/_, components/_-server-wrapper.tsx, components/\*-client-wrapper.tsx
- scripts/seed/_, scripts/_
- .opencode/instructions/\* and tests/e2e/helpers/plaid.mock.ts

## Tools, Skills, and MCP Manifest

This manifest lists concrete tools, scripts, and agent skills that exist in the repository (evidence-backed). Agents may use these tools when performing tasks, subject to the repository rules above.

- Node / JS Tooling (package.json): next@16.2.2, react@^19, typescript@^6.0.2, tsx, prettier, eslint, vitest, playwright.
- DAL & DB: drizzle-orm, drizzle-kit, pg/postgres drivers, database/db.ts and drizzle.config.ts.
- Test & Mocks: Playwright (@playwright/test v1.59.1), Vitest, MSW (msw), tests/e2e/helpers/plaid.mock.ts.
- External API clients: plaid (plaid), dwolla-v2 (dwolla-v2) with short-circuit logic in lib/plaid.ts and actions/dwolla.actions.ts.
- Scripts & Runners: scripts/ (seed/run.ts, mcp-runner.ts, verify-rules.ts, generate/docs-gen.ts, etc.). Always inspect scripts/\* before running.
- DevOps helpers: many shell/PowerShell/BAT scripts under scripts/server, scripts/docker, scripts/deploy and scripts/cleanup for environment setup and deployment tasks.

## MCP Servers

The repository includes an mcp runner script and tooling to interact with Next.js MCP when the dev server is running. Evidence: scripts/mcp-runner.ts, scripts/server/\* and next.config.ts.

If agents need runtime diagnostics for a running Next.js server, prefer using the Next.js MCP endpoint (tools/nextjs_runtime) and scripts/mcp-runner.ts.

## Rules & Enforcement (automated)

- A verification script `scripts/verify-rules.ts` enforces additional repository rules (process.env usage, no `any`, DAL-only DB access heuristics, Server Action contract heuristics, Home page static checks). The script produces a JSON report at `.opencode/reports/rules-report.json` and a console summary.
- Run locally: `npm run verify:rules`. CI runs this on every PR and uploads the JSON artifact.
- Configuration and allowlist: `.opencode/verify-rules.config.json`.
- Pre-commit: a husky pre-commit hook runs staged lint and a quick verify for staged files.

## Minimal Provenance Requirement

Whenever you make a change, include the list of files you read (paths + one-line rationale) that justify the change. This is required for review/audit.

## Troubleshooting (high-signal)

- Playwright seed failures: ensure DATABASE_URL reachable and tsx available so scripts/seed/run.ts is imported safely (else destructive fallback may run).
- DB migration errors: check drizzle.config.ts and run npm run db:check.
- Missing secrets: add ENCRYPTION_KEY and NEXTAUTH_SECRET to CI via secure channels.

## If Uncertain

- Stop and ask one short question. Do not guess about secrets, destructive flags, or push permissions.

## Files I Read To Generate This Document (provenance for this update)

- package.json — detect dependencies, scripts, and exact versions used (Next.js, React, TypeScript, Drizzle, Playwright, Vitest).
- tsconfig.json — compilerOptions and path aliases, strictness level, target ES version.
- next.config.ts — Next.js experimental flags, cacheComponents, reactCompiler and headers/security settings.
- README.md — documented tech-stack, quick-start, and examples referenced by contributors.
- AGENTS.md (existing) — previous agent rules and enforcement patterns; used as the canonical source to expand and keep backward compatible.
- dal/transaction.dal.ts — DAL batching and N+1 prevention exemplar used in AGENTS.md and exemplars.md.
- actions/register.ts — Server Action pattern (Zod validation, stable return shape) used as exemplar.
- actions/dwolla.actions.ts — Transfer short-circuit and server-action transaction patterns used as exemplars.
- lib/env.ts & app-config.ts — canonical env access and typed re-exports.
- scripts/verify-rules.ts — enforcement script that verifies no direct process.env usage, server-action heuristics, etc.
- scripts/seed/run.ts — seed runner and env loading order notes.

End.
