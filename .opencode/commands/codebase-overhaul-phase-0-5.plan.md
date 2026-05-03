# Codebase Overhaul Plan

## Scope & Constraints

- Skip `./components/ui/` in all component work
- Bash/PowerShell scripts = orchestrators only; all logic in TypeScript
- Use ts-morph for AST-safe script operations (Phase 5)
- All Server Actions return `{ ok: boolean; error?: string; ...payload }`
- Never import DB client in `app/` or `components/`; use DAL helpers
- Use `app-config.ts` — never `process.env` directly
- `app/page.tsx` must remain public and static
- No typecheck/lint/tests until end of Phase 4
- AI-assisted commits: `Co-authored-by: Claude <copilot@opencode>`

---

## Phase 0 — Documentation Refresh

### 0.1 Refresh `docs/custom-components.md`

- Re-scan all component folders (excl. `components/ui/`)
- Update entries for any new, moved, or deleted components
- Add stores/hooks inventory section (11 stores, 6 hooks)

### 0.2 Verify `docs/app-pages.md`

- Confirm all route entries reflect current file structure
- Note demo pages that will move in Phase 1

### 0.3 Verify `docs/test-context.md`

- Already complete (248 lines, 37 Vitest + 10 Playwright specs)
- Spot-check against actual test files; update if stale

---

## Phase 1 — Dead-Code Removal & Structural Cleanup

### 1.1 Delete Superseded Files

| File / Folder | Reason |
| --- | --- |
| `dal/wallets.ts` | Stub returning `[]`; canonical is `dal/wallet.dal.ts` |
| `actions/auth.signup.ts` | Superseded by `actions/register.ts` |
| `components/layouts/datatable/` | Uses `any` (policy violation); superseded by `components/layouts/data-table/` |
| `hooks/use-mobile.ts` | Duplicate of `hooks/use-mobile.tsx` |
| `tests/tmp/*.json` | Dead rollback artifacts |

### 1.2 Move Demo Pages → `app/demo/`

| From                      | To                             |
| ------------------------- | ------------------------------ |
| `app/dashboard-shell-01/` | `app/demo/dashboard-shell-01/` |
| `app/hero-section-41/`    | `app/demo/hero-section-41/`    |
| `app/onboarding-feed-01/` | `app/demo/onboarding-feed-01/` |

Update any internal links/imports referencing old paths.

### 1.3 Component Enhancement Pass (20 folders, excl. `ui/`)

For each component folder under `components/`:

- Ensure props are fully typed (no implicit `any`)
- Add missing JSDoc/TSDoc comments
- Replace inline one-off markup with `components/layouts/` generics where the page is being touched
- Ensure consistent export patterns (named + barrel)

### 1.4 Stores & Hooks — Map + Fill Gaps

**Stores** (11 files in `store/`):

- `filter-store.ts`, `create-filter-store.ts`
- `ui-store.tsx`, `create-ui-store.ts`
- `transfer-store.tsx`, `create-transfer-store.ts`
- `toast-store.tsx`, `create-toast-store.ts`
- `session.tsx`, `providers.tsx`, `index.ts`

**Hooks** (5 files after Phase 1.1 deletion):

- `use-pagination.ts`, `use-mobile.tsx`, `use-wallet-balance.ts`, `use-transaction-filter.ts`, `use-bank-connection.ts`

Actions:

- Audit each store/hook for TypeScript strictness and missing return types
- Add any missing hooks identified during page analysis
- Ensure stores are consumed correctly (no direct `process.env`, no DB imports)

---

## Phase 2 — Test Infrastructure Hardening

### 2.1 Vitest Unit Tests (37 specs)

- Verify each spec in `tests/unit/` maps to a real exported function
- Remove orphaned specs for deleted code (Phase 1.1)
- Fix any broken imports caused by Phase 1 moves
- Ensure MSW mock coverage in `tests/mocks/handlers.ts` covers all DAL/action paths tested

### 2.2 Playwright E2E Specs (10 specs)

- Audit each spec in `tests/e2e/`
- Use `tests/e2e/helpers/auth.ts` for all auth setup
- Use `addMockPlaidInitScript()` from `tests/e2e/helpers/plaid.mock.ts` for Plaid flows
- Seed credentials: `seed-user@example.com` / `Password123!`
- Fix any broken selectors, stale page object refs, or hardcoded waits

### 2.3 Page Fixtures

- Verify/update `tests/fixtures/pages/` after Phase 1 moves

_No test runs in this phase._

---

## Phase 3 — Page Analysis

Analyze every page in order. For each page, document:

- Current state (data fetching, auth guards, component usage)
- Violations of conventions (env reads, DB imports, missing auth, etc.)
- Improvements needed (DRY opportunities, generic component substitutions)

**Order:**

1. `app/(auth)/` — sign-in, sign-up, error pages
2. `app/(admin)/` — admin dashboard, user management
3. `app/(root)/` — dashboard, wallet, transactions, transfers, settings, profile
4. `app/page.tsx` — landing page (must remain static, no auth/DB)
5. `app/demo/` — demo pages (post-move)

---

## Phase 4 — Functionality Pass (per page)

Apply findings from Phase 3 to every page:

- Enforce auth guards (`auth()` early in protected pages)
- Remove any direct `process.env` reads → use `app-config.ts`
- Remove any direct DB imports → use DAL helpers
- Replace one-off markup with `components/layouts/` generics
- Ensure all Server Actions follow the `{ ok, error, ...payload }` contract
- Add `revalidatePath()` where mutations occur

**End of Phase 4 — Full Validation:**

```bash
bun run format && bun run type-check && bun run lint:strict && bun run verify:rules && bun run test:browser && bun run test:ui
```

All checks must pass (zero failures, zero type errors, zero lint errors) before proceeding.

---

## Phase 5 — Scripts Full Pass

### 5.1 Add ts-morph

```bash
bun add -D ts-morph
```

### 5.2 Full Pass — All Scripts in `./scripts/**`

For every script:

- Ensure shell scripts are orchestrators only (no logic — delegate to TypeScript)
- Move any inline logic to `scripts/ts/<domain>/<script>.ts`
- Add `--dry-run` flag to all mutation TypeScript scripts
- Validate each mutation script in dry-run mode
- Use ts-morph for any AST-level transformations

### 5.3 Script Inventory

Document all scripts in `docs/scripts.md` (or update existing) with:

- Purpose, entry point, flags, example invocation

---

## Files Affected Summary

**Delete:**

- `dal/wallets.ts`
- `actions/auth.signup.ts`
- `components/layouts/datatable/` (folder)
- `hooks/use-mobile.ts`
- `tests/tmp/*.json`

**Move:**

- `app/dashboard-shell-01/` → `app/demo/dashboard-shell-01/`
- `app/hero-section-41/` → `app/demo/hero-section-41/`
- `app/onboarding-feed-01/` → `app/demo/onboarding-feed-01/`

**Modify (broad):**

- All component folders (excl. `components/ui/`)
- All store files
- All hook files
- All page files in `app/(auth)/`, `app/(admin)/`, `app/(root)/`, `app/page.tsx`
- All test files in `tests/unit/` and `tests/e2e/`
- All scripts in `scripts/**`
- Docs: `docs/custom-components.md`, `docs/app-pages.md`, `docs/test-context.md`

**Add:**

- `ts-morph` devDependency
- Any missing hooks/stores identified in Phase 1.4
- `docs/scripts.md` (if not existing)

---

**Status:** Saved 2026-05-03 | Plan approved implicitly (submit_plan tool unavailable on Windows)
