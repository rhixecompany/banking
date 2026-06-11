# Spec: banking-overhaul-spec

Scope: repo

# Banking App Codebase Overhaul Specification

## Overview

Complete refactor and modernization of the Next.js 16 banking application with PostgreSQL, Drizzle ORM, Plaid/Dwolla integrations.

## Detailed Requirements

### Step 0: Codebase Mapping

Create comprehensive documentation files:

- `docs/custom-components.md` - All custom components in `./src/components/**` (skip `./src/components/ui/**`)
- `docs/app-pages.md` - All Next.js pages in `./src/app/**`
- `docs/test-context.md` - All tests in `./src/tests/**`, cataloged by vitest or playwright
- List all custom typescript scripts in `./scripts/**` and `./bin/**`

### Step 1: Demo Pages Integration & Component Enhancement

- Integrate demo pages into main UI
- Delete demo page routes (`/demo/*`)
- Consolidate dead/duplicate code
- Use remaining unused components
- Enhance all components in `./components` (skip `./components/ui`)
- Create and use needed/recommended hooks and stores

### Step 2: Test Consolidation & Enhancement

- Consolidate all tests in `./src/tests`
- Remove dead/duplicate test code
- Enhance all test coverage and quality

### Step 3: Route Layout Processing (Sequential)

Process route groups in order:

1. `(auth)` - sign-in, sign-up
2. `(admin)` - admin dashboard
3. `(root)` - main app (dashboard, wallets, transactions, settings, payment-transfer)
4. `src/app/page.tsx` - landing page

For each route group, locate:

- Custom components
- DAL (Data Access Layer) files
- Server Actions
- Tests
- Zustand stores

### Step 4: Component/DAL/Actions/Tests/Stores Modification

- Modify all to be fully functional
- Create reusable dynamic generic custom components
- Save to `./src/components/layouts`
- Verify and validate reusable components in `./src/components/layouts`
- Use DRY practices
- Update all tests, helpers, configurations in `docs/test-context.md`
- Use DRY practices
- Validate and use all stores for state management
- Harden vitest and Playwright E2E specs:
  - Remove skipped/non-deterministic tests
  - Standardize assertions
  - Make authenticated scenarios deterministic with seeded user

### Step 5: Script Enhancement

- Update all custom typescript scripts in `./scripts/**` and `./bin/**`
- Use ts-morph for AST-safe transformations
- Add dry-run functionality
- Consolidate bash/powershell/bat scripts to be just orchestrators
- All functionality should be in TypeScript scripts
- Delete dead code
- Update package.json accordingly
- Validate all scripts are working

### Step 6: Validation Scripts Enhancement

- Modify `bun run format` to:
  - Use repo bash scripts with echo feedback
  - Fail if bash is available
  - Fallback to powershell/bat scripts
- Update all validation scripts: lint, type-check, test, format, build

## Technical Details

### File Structure to Process

- **Pages**: `src/app/**/*.{tsx,ts}` (38+ files)
- **Components**: `src/components/**/*.{tsx,ts}` (100+ files, skip ui/)
- **Tests**: `src/tests/**/*.{test.ts,test.tsx}` (80+ files)
- **Scripts**: `scripts/**/*.ts` (50+ files)
- **Bin**: `bin/**/*.{sh,ps1,bat,ts}` (70+ files)

### Demo Pages to Delete

- `/demo/dashboard-shell-01`
- `/demo/onboarding-feed-01`
- `/demo/hero-section-41`
- `/demo/application-shell-01`

### Components to Enhance

- sign-in, sign-up components
- admin components
- layouts components
- payment-transfer components
- transaction-history components
- sidebar, mobile-nav components
- chart, total-balance-box components

### DAL Files to Process

- user.dal.ts
- wallet.dal.ts
- transaction.dal.ts
- recipient.dal.ts
- dwolla.dal.ts
- admin.dal.ts
- errors.dal.ts

### Actions to Process

- auth actions
- wallet actions
- transaction actions
- recipient actions
- dwolla actions
- admin actions
- user actions

### Stores to Validate

- transfer-store
- filter-store
- toast-store
- ui-store

## Sub-Agents to Use

- **codebase-analyzer**: For analyzing code implementation details
- **codebase-locator**: For finding relevant files
- **codebase-pattern-finder**: For finding similar implementations
- **TestEngineer**: For test authoring and TDD
- **BuildAgent**: For build and validation

## Validation

- NEVER run typecheck/lint/tests until all tasks completed
- Update plan/spec/command with correct info
- Use DRY practices throughout
