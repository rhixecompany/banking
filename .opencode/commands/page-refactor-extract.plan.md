# Page Refactor & Extract Plan

Last Reviewed: 2026-04-17

## Summary

This plan documents a focused, auditable refactor to harden and extract presentational UI, centralize Zod schemas, enforce Server Action contracts, and prevent N+1 DB queries across the app pages. It covers the pages grouped by layout: (auth) → (admin) → (root) → top-level (Home).

Per repository rules, this plan file is created before making multi-file changes. Implementation will follow the per-page steps defined below. Changes will be made in small commits (one commit per page) and validated with targeted unit tests and type-checking.

## Goals

1. Produce a precise page-by-page inventory (auth → admin → root → top-level) listing files, server/client wrappers, presentational components, server actions, DAL methods, schemas, and tests.
2. Extract presentational components into `components/layouts/<kebab-name>/index.tsx` where wrappers mix fetching + rendering.
3. Centralize shared Zod schemas under `lib/schemas/` and import them in both client and server code to avoid drift.
4. Ensure Server Actions follow the contract: call `auth()` early, validate inputs with Zod, return `Promise<{ ok: boolean; error?: string; ...payload }>` and revalidate caches/tags as needed.
5. Ensure all DB access occurs only via `dal/*` helpers. Add eager-loading helpers (for example `transactionDal.findByUserIdWithWallets`) to prevent N+1 queries.
6. Harden tests: use `autoSubmit` + `initial*` patterns for form-based unit tests, use Plaid/Dwolla short-circuit helpers for deterministic E2E and run DB seeding using the seed-runner helpers.

## Scope

- Pages in-scope: `app/(auth)/*`, `app/(admin)/*`, `app/(root)/*` (dashboard, my-wallets, payment-transfer, settings, transaction-history), and `app/page.tsx` (Home) for verification only (Home must remain static/public).
- Files likely to change: server wrappers, client wrappers, components/layouts additions, `lib/schemas/*`, `dal/*` helpers, and affected tests.

## Risks

- This touches multiple pages and files. Conservative, small commits reduce review overhead and regression risk.
- Tests may break if schema/types drift — run `npm run type-check` frequently.
- Seeding and E2E require test flags and mock helpers — follow `docs/test-context.md` and use `npm run db:seed -- --dry-run` before applying changes that require an environment DB.

## Implementation (per-page checklist)

For each page (repeat):

1. Audit server wrapper
   - Ensure `auth()` is called first when the page is protected.
   - Fetch required data in parallel and pass plain data + server action functions into the client wrapper.

2. Audit Server Actions used by the wrapper
   - Add/ensure Zod validation at top of action with descriptive messages.
   - Call `auth()` early; return `{ ok: false, error: 'Unauthorized' }` when missing.
   - Return a stable shape: `Promise<{ ok: boolean; ...payload?; error?: string }>`.
   - Wrap multi-step writes in `db.transaction(...)` and accept optional `tx` param in DAL writes.

3. Extract presentational UI
   - If wrapper mixes fetching and rendering, extract a presentational `components/layouts/<kebab-name>/index.tsx` that is props-only and add a unit test next to it.

4. Centralize schemas
   - Move duplicated Zod schemas to `lib/schemas/<domain>.ts` and import from both client and server.

5. DAL changes
   - Add/extend eager-loading helpers (e.g., `transactionDal.findByUserIdWithWallets`) to bundle related rows in one query or via batch loads.
   - Ensure DAL write helpers accept an optional `tx` arg.

6. Tests
   - Update unit tests to target the extracted components.
   - Use `autoSubmit` + `initial*` patterns in client wrappers for deterministic tests.
   - Update E2E to use `tests/e2e/helpers/plaid.mock.ts` and seed runner fixtures. Use `seed.user@example.com / P@ssw0rd` for seeded authenticated flows.

7. Validation
   - Run `npx vitest -c vitest.config.ts run path/to/changed/tests` for unit tests.
   - Run `npm run type-check` and `npm run lint:strict`.
   - For E2E, run `npm run db:seed -- --dry-run` and then seed followed by `npm run test:ui`.

## Commit Strategy

- One commit per page. Keep commits small and descriptive: `refactor(page): extract <component> and centralize schema`.
- I will not push or amend commits without your explicit instruction. I will create commits locally if you request, or stage changes and show diffs for review.

## Validation Checklist

- Unit tests for modified components pass.
- Type-check & lint pass.
- E2E flows for modified pages pass with seeded DB and Plaid/Dwolla mocks.
- `scripts/verify-rules.ts` reports no new repo-rule violations.

## Rollback / Mitigation

- Revert the commit for the affected page if tests fail. Do not force-push to remote without approval.

## Provenance — Files read during planning

- app/page.tsx
- app/(auth)/sign-in/page.tsx
- app/(auth)/sign-up/page.tsx
- app/(admin)/admin/page.tsx
- app/(root)/dashboard/page.tsx
- app/(root)/my-wallets/page.tsx
- app/(root)/payment-transfer/page.tsx
- app/(root)/settings/page.tsx
- app/(root)/transaction-history/page.tsx
- components/_-server-wrapper.tsx and _-client-wrapper.tsx for the pages above
- actions/transaction.actions.ts
- actions/wallet.actions.ts
- actions/recipient.actions.ts
- actions/dwolla.actions.ts
- dal/transaction.dal.ts
- dal/wallet.dal.ts
- lib/schemas/transfer.schema.ts
- lib/schemas/profile.schema.ts
- tests/unit/** and tests/e2e/** as referenced in the plan

## Next Steps

1. Implementation: I will now begin making changes. Per the plan I will proceed page-by-page. Please confirm which page or page-group you want me to start with.
   - Options: `auth` (sign-in/sign-up), `admin`, `root` (I can also implement pages within root in order: dashboard → my-wallets → payment-transfer → settings → transaction-history), or `all` (implement across all pages in sequence).

2. I will stage edits for one page, run local unit tests for the touched files, and present the diff for review before committing. Once you approve the commit, I'll continue to the next page.

---

Prepared by: OpenCode agent
