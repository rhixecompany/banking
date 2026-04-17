# Coding Standards (observed)

This document captures concise, enforceable coding standards that are implemented or enforced in the repository. Each rule below maps to existing code and scripts (see provenance in AGENTS.md).

TypeScript

- `strict` mode is enabled in tsconfig.json. Keep types exact and avoid `any`.
- Use `unknown` for untrusted inputs and narrow with type-guards or Zod.

Environment

- Do not read `process.env` directly in application code. Use `app-config.ts` or `lib/env.ts` (which re-exports app-config). `scripts/seed/run.ts` is an accepted exception because it intentionally loads .env before imports.

Server Actions

- All mutations should be Server Actions ("use server"). Server Actions should:
  - Validate inputs with Zod before doing any work
  - Call `auth()` early for protected actions
  - Return a stable shape: `{ ok: boolean; error?: string; ...payload }`

DAL and Database

- Use `dal/*` helpers for all DB access and prefer batching/eager-loading to avoid N+1 queries. See `dal/transaction.dal.ts` for an example of eager-loading via batched wallet fetch.
- Accept an optional transaction-scoped DB instance (opts.db) in DAL write helpers for composition.

Testing

- Use MSW for deterministic network mocks in unit tests and the provided helpers in `tests/e2e/helpers/plaid.mock.ts` for E2E.

Formatting & Lint

- Use Prettier for formatting (`npm run format`) and enforce ESLint strictly (`npm run lint:strict`).

Security

- Do not commit secrets. Use `app-config.ts` / typed env helpers for secrets and validation. Scripts that require secrets should read them via safe helpers and document required env vars in `.env.example`.

Commit & PR

- Follow small, focused commits. If a change affects >7 files, create a plan under `.opencode/commands/` before implementation.
