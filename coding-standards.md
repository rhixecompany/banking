# Coding Standards (observed)

This document captures concise, enforceable coding standards that are implemented or enforced in the repository. Each rule below maps to existing code and scripts (see provenance).

## TypeScript

- `strict` mode is enabled in tsconfig.json. Keep types exact and avoid `any`.
- Use `unknown` for untrusted inputs and narrow with type-guards or Zod.

**Evidence**: `tsconfig.json` sets `"strict": true`. `scripts/verify-rules.ts` uses ts-morph to detect `any` usage.

## Environment

- Do not read `process.env` directly in application code. Use `app-config.ts` or `lib/env.ts` (which re-exports app-config). `scripts/seed/run.ts` is an accepted exception because it intentionally loads .env before imports.

**Evidence**: `scripts/verify-rules.ts` uses ts-morph AST analysis to detect `process.env` usage in `app/`, `lib/`, `components/`. `app-config.ts` provides typed schema-based config validation with Zod.

## Server Actions

- All mutations should be Server Actions ("use server"). Server Actions should:
  - Validate inputs with Zod before doing any work
  - Call `auth()` early for protected actions
  - Return a stable shape: `{ ok: boolean; error?: string; ...payload }`

**Evidence**: `actions/register.ts` implements this pattern. `scripts/verify-rules.ts` validates Server Action heuristics via AST analysis.

## DAL and Database

- Use `dal/*` helpers for all DB access and prefer batching/eager-loading to avoid N+1 queries. See `dal/transaction.dal.ts` for an example of eager-loading via batched wallet fetch.
- Accept an optional transaction-scoped DB instance (opts.db) in DAL write helpers for composition.

**Evidence**: `dal/transaction.dal.ts` implements `findByUserIdWithWallets()` using batch wallet fetch to avoid N+1. Uses optional `opts.db` parameter for transaction composition.

## Testing

- Use MSW for deterministic network mocks in unit tests and the provided helpers in `tests/e2e/helpers/plaid.mock.ts` for E2E.
- Use mock tokens (`mock*`, `seed*`) for deterministic tests. See `lib/plaid.ts` for `isMockAccessToken()` helper.

**Evidence**: `tests/e2e/helpers/plaid.mock.ts` provides mock Plaid Link injection. `lib/plaid.ts` exports `isMockAccessToken()` for deterministic test shortcuts.

## Formatting & Lint

- Use Prettier for formatting (`npm run format`) and enforce ESLint strictly (`npm run lint:strict`).
- Run `npm run verify:rules` before PRs to catch policy violations.

**Evidence**: `package.json` scripts: `format`, `lint:strict`, `verify:rules`. `scripts/verify-rules.ts` produces `.opencode/reports/rules-report.json`.

## Security

- Do not commit secrets. Use `app-config.ts` / typed env helpers for secrets and validation. Scripts that require secrets should read them via safe helpers and document required env vars in `.env.example`.

**Evidence**: `app-config.ts` provides typed configuration with Zod validation. `lib/env.ts` re-exports with backward compatibility.

## Commit & PR

- Follow small, focused commits. If a change affects >7 files, create a plan under `.opencode/commands/` before implementation.
- Run pre-PR checklist: `npm run format && npm run type-check && npm run lint:strict && npm run verify:rules`

**Evidence**: `scripts/verify-rules.ts` supports `--require-plan-for-large-changes` flag to enforce plan existence for CI.

## Provenance

All rules are enforced by `scripts/verify-rules.ts` (AST-based policy enforcement) and map to concrete files in the repository.

Last updated: 2026-04-24
