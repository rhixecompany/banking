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

**Status:** IN PROGRESS — Phase 0 starts now (2026-05-03)

---

# COMPREHENSIVE IMPLEMENTATION PLAN V2

## Overview

This plan consolidates all 5 tasks into a single implementation session with detailed specs, code samples, and file references. Priority starts with **Phase 0 - Documentation** as requested.

**Constraints:**

- Skip `./components/ui/` in all component work
- Bash/PowerShell = orchestrators only; all logic in TypeScript
- Use ts-morph for AST-safe script operations (Phase 5)
- All Server Actions return `{ ok: boolean; error?: string; ...payload }`
- Never import DB in `app/` or `components/`; use DAL helpers
- Use `app-config.ts` — never `process.env` directly
- `app/page.tsx` must remain public and static
- **NO typecheck/lint/tests until end of Phase 4**
- Use opencode-notify for OS notifications when tasks/phases complete
- AI-assisted commits: `Co-authored-by: Claude <copilot@opencode>`

---

## TASK 0: MAP CODEBASE & SAVE TO DOCS

### 0.1 List, triage, read all Next.js pages in `./app/**`

**Files to scan:**

- `app/(auth)/` - sign-in, sign-up
- `app/(admin)/` - admin
- `app/(root)/` - dashboard, my-wallets, payment-transfer, transaction-history, settings
- `app/page.tsx` - landing
- `app/demo/` - demo pages

**For each page, document:**

- Route path
- Server wrapper component
- Auth requirement (protected/public)
- DAL usage
- Server Actions used

### 0.2 List, triage, read all components in `./components` (skip `./components/ui`)

**Component folders to catalog:**

- `components/layouts/` - 26 layout components
- `components/*/index.tsx` - Server wrappers (10)
- `components/*/SignInClient.tsx`, `SignUpClient.tsx` - Client wrappers
- Any new components since last audit

**For each component, document:**

- Component name
- File path
- Props interface (if any)
- Server/Client type
- Usage location

### 0.3 List, triage, catalog tests in `./tests`

**Test files to catalog:**

- Vitest: `tests/unit/` (37 specs)
- Playwright: `tests/e2e/` (10 specs)
- Integration: `tests/integration/`

**For each test, document:**

- Test file path
- Purpose (what it tests)
- Dependencies (MSW handlers, fixtures)
- Deterministic status (yes/no/skipped)

### 0.4 List, triage, catalog all scripts in `./scripts/**`

**Script files to catalog:**

- Shell scripts: `scripts/*.sh`, `scripts/*.ps1`, `scripts/*.bat`
- TypeScript: `scripts/ts/**/*.ts`

**For each script, document:**

- Script path
- Purpose
- Type (orchestrator/logic)
- Dependencies
- Dry-run support (yes/no)

### Documentation Output Files:

| File                        | Content                             |
| --------------------------- | ----------------------------------- |
| `docs/custom-components.md` | Component inventory (update)        |
| `docs/app-pages.md`         | Page inventory with routes (update) |
| `docs/test-context.md`      | Test inventory (update)             |
| `docs/scripts.md`           | Script inventory (update)           |

---

## TASK 1: CONSOLIDATE, DEAD DUPLICATE/CODE, ENHANCE COMPONENTS

### 1.1 Delete Dead Files (already verified - don't exist)

| File | Reason |
| --- | --- |
| `dal/wallets.ts` | Stub returning `[]` |
| `actions/auth.signup.ts` | Superseded by `actions/register.ts` |
| `components/layouts/datatable/` | Uses `any` (violation) |
| `hooks/use-mobile.ts` | Duplicate |
| `tests/tmp/*.json` | Dead artifacts |

### 1.2 Move Demo Pages (already verified - already moved)

| From                      | To                             |
| ------------------------- | ------------------------------ |
| `app/dashboard-shell-01/` | `app/demo/dashboard-shell-01/` |
| `app/hero-section-41/`    | `app/demo/hero-section-41/`    |
| `app/onboarding-feed-01/` | `app/demo/onboarding-feed-01/` |

### 1.3 Component Enhancement Pass (20+ folders)

**Target folders:** All in `components/` except `ui/`

**For each folder:**

```typescript
// Ensure props are fully typed
interface Props {
  // NO implicit any - use explicit types
  title: string;
  items: Array<{ id: string; name: string }>;
  onAction?: (id: string) => void;
}

// Add JSDoc/TSDoc
/**
 * Component description
 * @component
 * @example
 * <Component title="Hello" items={[]} />
 */
```

**Generic components to create:**

```typescript
// components/layouts/generic-page-shell/index.tsx
interface GenericPageShellProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  loading?: boolean;
}

// components/layouts/generic-data-table/index.tsx
interface Column<T> {
  key: keyof T;
  header: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
}

interface GenericDataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (row: T) => void;
  pagination?: PaginationState;
}
```

### 1.4 Stores & Hooks Audit

**Stores (11 files):**

- `stores/filter-store.ts`, `stores/create-filter-store.ts`
- `stores/ui-store.tsx`, `stores/create-ui-store.ts`
- `stores/transfer-store.tsx`, `stores/create-transfer-store.ts`
- `stores/toast-store.tsx`, `stores/create-toast-store.ts`
- `stores/session.tsx`, `stores/providers.tsx`, `stores/index.ts`

**Hooks (5 files):**

- `hooks/use-pagination.ts`
- `hooks/use-mobile.tsx`
- `hooks/use-wallet-balance.ts`
- `hooks/use-transaction-filter.ts`
- `hooks/use-bank-connection.ts`

**Audit checklist:**

- [ ] All stores have explicit return types
- [ ] No `any` types in props or return values
- [ ] No direct `process.env` reads in stores
- [ ] No DB imports in stores
- [ ] All hooks properly typed
- [ ] Add missing hooks if identified during page analysis

---

## TASK 2: CONSOLIDATE, DEAD DUPLICATE/CODE, ENHANCE TESTS

### 2.1 Vitest Unit Tests (37 specs)

**Catalog to verify:**

- `tests/unit/actions/*.test.ts` - 13 files
- `tests/unit/dal/*.test.ts` - 7 files
- `tests/unit/stores/*.test.ts` - 4 files
- `tests/unit/*-server-wrapper.test.ts` - 7 files
- `tests/unit/*.test.ts` - 6 files

**Enhancement actions:**

- Remove orphaned specs for deleted code
- Fix broken imports from Phase 1 moves
- Ensure MSW handlers cover all DAL/action paths
- Remove skipped tests or mark as pending with reason

### 2.2 Playwright E2E Tests (10 specs)

**Catalog to verify:**

- `tests/e2e/auth.spec.ts`
- `tests/e2e/dashboard.spec.ts`
- `tests/e2e/my-wallets.spec.ts`
- `tests/e2e/payment-transfer.spec.ts`
- `tests/e2e/transaction-history.spec.ts`
- `tests/e2e/settings.spec.ts`
- `tests/e2e/admin.spec.ts`
- `tests/e2e/wallet-linking.spec.ts`
- `tests/e2e/integration/link-and-transfer.spec.ts`
- `tests/e2e/specs/plaid-script.spec.ts`

**Enhancement actions:**

- Use `tests/e2e/helpers/auth.ts` for all auth setup
- Use `addMockPlaidInitScript()` for Plaid flows
- Seed credentials: `seed-user@example.com` / `password123`
- Fix broken selectors
- Remove hardcoded waits
- Make authenticated scenarios deterministic

### 2.3 Test Helpers

**Verify/update:**

- `tests/e2e/helpers/auth.ts` - Auth helper functions
- `tests/e2e/helpers/plaid.mock.ts` - Plaid mock utilities
- `tests/e2e/helpers/db.ts` - Database helpers
- `tests/fixtures/` - Test fixtures

---

## TASK 3: ANALYZE ROUTE LAYOUTS

### Analysis Order:

1. `(auth)` - sign-in, sign-up
2. `(admin)` - admin dashboard
3. `(root)` - dashboard, wallets, transactions, transfer, settings
4. `app/page.tsx` - landing page
5. `app/demo/` - demo pages

### For Each Route Group, Document:

**Auth Pages (`app/(auth)/`):** | Route | File | Server Wrapper | Auth Check | Issues | | --- | --- | --- | --- | --- | | `/sign-in` | `page.tsx` | `SignInServerWrapper` | Redirect if session | None | | `/sign-up` | `page.tsx` | `SignUpServerWrapper` | Redirect if session | None |

**Admin Pages (`app/(admin)/`):** | Route | File | Server Wrapper | Auth | Admin Check | Issues | | --- | --- | --- | --- | --- | --- | | `/admin` | `page.tsx` | `AdminDashboardServerWrapper` | Required | Required | None |

**Root Pages (`app/(root)/`):** | Route | File | Server Wrapper | Auth | Issues | | --- | --- | --- | --- | --- | | `/dashboard` | `page.tsx` | `DashboardServerWrapper` | Required | None | | `/my-wallets` | `page.tsx` | `MyWalletsServerWrapper` | Required | None | | `/payment-transfer` | `page.tsx` | `PaymentTransferServerWrapper` | Required | None | | `/transaction-history` | `page.tsx` | `TransactionHistoryServerWrapper` | Required | None | | `/settings` | `page.tsx` | `SettingsServerWrapper` | Required | None |

**Landing Page (`app/page.tsx`):** | Route | File | Server Wrapper | Auth | Issues | | --- | --- | --- | --- | --- | | `/` | `page.tsx` | `HomeServerWrapper` | None (must stay static) | Verify no auth/DB/env |

---

## TASK 4: MODIFY ALL COMPONENTS, DAL, ACTIONS, TESTS, STORES

### 4.1 Generic Layout Components to Create

**Target:** `components/layouts/`

```typescript
// components/layouts/generic-page-shell/index.tsx
// Reusable page container with title, description, actions slot

// components/layouts/generic-data-table/index.tsx
// Reusable table with type-safe columns

// components/layouts/generic-card/index.tsx
// Reusable card with header, body, footer slots

// components/layouts/generic-form/index.tsx
// Reusable form with validation support

// components/layouts/generic-modal/index.tsx
// Reusable modal with accessible patterns

// components/layouts/generic-toast/index.tsx
// Reusable toast notification component

// components/layouts/generic-skeleton/index.tsx
// Reusable loading skeleton

// components/layouts/generic-empty-state/index.tsx
// Reusable empty state component
```

### 4.2 Component Modification Checklist

For each component in `components/` (skip `ui/`):

- [ ] Props fully typed (no `any`)
- [ ] JSDoc/TSDoc comments added
- [ ] Uses generic components from `components/layouts` where applicable
- [ ] Exports both named + barrel (index.ts)
- [ ] Server Actions follow `{ ok, error, ...payload }` contract

### 4.3 DAL Verification

For each DAL file in `dal/`:

- [ ] All queries use proper typing
- [ ] N+1 prevention via batch fetching
- [ ] Soft delete pattern implemented
- [ ] No direct `process.env` reads (use `app-config.ts`)

### 4.4 Server Actions Verification

For each action in `actions/`:

- [ ] Returns `{ ok: boolean; error?: string; ...payload }`
- [ ] Input validated with Zod
- [ ] Uses DAL helpers (not direct DB)
- [ ] Auth check for protected actions
- [ ] `revalidatePath()` after mutations

### 4.5 Store Modification Checklist

For each store in `stores/`:

- [ ] Explicit return types
- [ ] No `any` types
- [ ] No `process.env` reads
- [ ] No DB imports
- [ ] Proper Zustand patterns

---

## TASK 5: UPDATE ALL SCRIPTS WITH TS-MORPH

### 5.1 Install ts-morph

```bash
bun add -D ts-morph
```

### 5.2 Script Inventory to Audit

**Shell scripts (should be orchestrators only):**

- `scripts/*.sh`
- `scripts/*.ps1`
- `scripts/*.bat`

**TypeScript scripts:**

- `scripts/ts/**/*.ts`

### 5.3 Script Enhancement Pattern

**Before (Shell with logic - BAD):**

```bash
#!/bin/bash
# BAD - logic in shell
for file in $(find . -name "*.ts"); do
  echo "Processing $file"
done
```

**After (Shell = orchestrator - GOOD):**

```bash
#!/bin/bash
# GOOD - orchestrator only
bunx tsx scripts/ts/utils/process-files.ts "$@"
```

```typescript
// scripts/ts/utils/process-files.ts
import { Project } from "ts-morph";
import { parseArgs } from "util";

interface Options {
  dryRun: boolean;
  verbose: boolean;
}

export async function processFiles(args: string[]): Promise<void> {
  const options = parseArgs({
    options: {
      "dry-run": { type: "boolean", default: false },
      verbose: { type: "boolean", default: false }
    },
    args
  });

  const project = new Project({
    tsConfigFilePath: "./tsconfig.json"
  });
  const sourceFiles = project.getSourceFiles("**/*.ts");

  if (options.values.dryRun) {
    console.log(
      "[DRY RUN] Would process:",
      sourceFiles.length,
      "files"
    );
    return;
  }

  // Process files...
}
```

### 5.4 Add Dry-Run to All Mutation Scripts

```typescript
// All mutation scripts must support --dry-run
const isDryRun = process.argv.includes("--dry-run");

if (isDryRun) {
  console.log("[DRY RUN] Changes that would be made:");
  // Log what would change without making changes
} else {
  // Actually make the changes
}
```

### 5.5 Script Inventory Documentation

Update `docs/scripts.md` with:

| Script | Type | Purpose | Flags |
| --- | --- | --- | --- |
| `scripts/db:push` | Orchestrator | Push DB schema | None |
| `scripts/db:seed` | Orchestrator | Seed test data | `--reset` |
| `scripts/verify-rules` | Logic | AST policy check | `--verbose` |
| `scripts/ts/deploy/deploy.ts` | Logic | Deploy logic | `--dry-run` |

---

## PHASE 5 EXTRAS: CREATE init-enhanced.md

### File: `.opencode/commands/init-enhanced.md`

````markdown
---
category: initialization
description: Initialize enhanced agent documentation and rules
---

# Initialize Enhanced Agent Documentation

## Purpose

Update Agentic Documentation and Rules for the Banking app repository.

## When to Use

- User asks to "mine prior chats", "maintain AGENTS.md", or "run continual-learning loop"
- New agent sessions need current context
- Documentation needs refresh

## Process

### 1. Make AGENTS.md the Canonical Source

- All agent docs should point to `AGENTS.md` as single source of truth
- Remove duplicate guidance in `.cursorrules`, `.github/copilot-instructions.md`
- Update instruction files to reference AGENTS.md

### 2. Standardize Plan Location

- All plans in `.opencode/commands/*.plan.md`
- Update all agent docs to use this path

### 3. Rewrite Overlapping Instructions

- Merge similar rules from multiple files
- Create small set of canonical rules/instructions
- Ensure no drift between files

### 4. Use OS Notifications

- Install/configure opencode-notify plugin
- Send notifications on:
  - Task completion
  - Phase completion
  - Step completion
  - Session end

### 5. Maintain AGENTS.md

- Update with new patterns discovered
- Keep tech stack current
- Document new conventions

## Example

```bash
# After phase/task completion
opencode-notify --title "Phase Complete" --message "Phase 0 documentation complete"
```
````

## Reference

- AGENTS.md - Single source of truth
- .opencode/commands/ - Plan location
- docs/custom-components.md - Component inventory
- docs/app-pages.md - Page inventory
- docs/test-context.md - Test inventory

````

---

## IMPLEMENTATION SEQUENCE

### Phase 0: Documentation (PRIORITY)
1. [ ] Scan all pages in `app/**` → update `docs/app-pages.md`
2. [ ] Scan all components in `components/**` (skip ui/) → update `docs/custom-components.md`
3. [ ] Scan all tests in `tests/**` → update `docs/test-context.md`
4. [ ] Scan all scripts in `scripts/**` → update `docs/scripts.md`
5. [ ] Send notification: "Phase 0 documentation complete"

### Phase 1: Component Cleanup
1. [ ] Verify dead files are gone
2. [ ] Verify demo pages moved
3. [ ] Run component enhancement pass
4. [ ] Audit stores/hooks
5. [ ] Send notification: "Phase 1 component cleanup complete"

### Phase 2: Test Enhancement
1. [ ] Verify 37 Vitest specs
2. [ ] Verify 10 Playwright specs
3. [ ] Fix broken imports
4. [ ] Remove skipped/non-deterministic
5. [ ] Send notification: "Phase 2 test enhancement complete"

### Phase 3: Page Analysis
1. [ ] Analyze (auth) pages
2. [ ] Analyze (admin) pages
3. [ ] Analyze (root) pages
4. [ ] Analyze app/page.tsx
5. [ ] Analyze demo pages
6. [ ] Send notification: "Phase 3 page analysis complete"

### Phase 4: Functionality Pass
1. [ ] Modify components per analysis
2. [ ] Create 8 generic layout components
3. [ ] Verify DAL patterns
4. [ ] Verify Server Actions contract
5. [ ] Verify stores follow conventions
6. [ ] Send notification: "Phase 4 functionality pass complete"

### Phase 5: Script Enhancement
1. [ ] Install ts-morph
2. [ ] Convert shell scripts to orchestrators
3. [ ] Add --dry-run to mutation scripts
4. [ ] Create init-enhanced.md
5. [ ] Final notification: "All tasks complete!"

### End: Full Validation (AFTER ALL TASKS)
```bash
bun run format && bun run type-check && bun run lint:strict && bun run verify:rules && bun run test:browser && bun run test:ui
````

---

## Implementation Notes

### Phase 0: STARTING NOW

- Need to scan and update all 4 doc files
- Current state: partial docs exist, need comprehensive update

### Key Decisions Made:

- Plan file: UPDATE existing (codebase-overhaul-phase-0-5.plan.md)
- Timeline: ONE SESSION
- Priority: Phase 0 (Documentation)
- Notifications: opencode-notify
