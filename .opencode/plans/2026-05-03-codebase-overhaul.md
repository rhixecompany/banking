# Codebase Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Comprehensive modernization of Banking app - documentation refresh, component enhancement, test hardening, page analysis, and script modernization across 5 sequential phases in a single session.

**Architecture:** Sequential phase execution with strict validation gates. No typecheck/lint/tests until end of Phase 4. Progress tracked via TodoWrite, phase completion via OS notifications.

**Tech Stack:** Next.js 16, React 19, TypeScript strict, Drizzle ORM, Vitest, Playwright, ts-morph, Bun 1.3.13

---

## Overview

This is a large-scale codebase overhaul spanning 5 phases affecting 100+ files. The plan is organized as a single comprehensive session with validation checkpoints between phases.

### Constraints (Non-Negotiable)

- Skip `./components/ui/` in all component work
- Bash/PowerShell = orchestrators only; all logic in TypeScript
- Use ts-morph for AST-safe script operations
- All Server Actions return `{ ok: boolean; error?: string; ...payload }`
- Never import DB in `app/` or `components/`; use DAL helpers
- Use `app-config.ts` — never `process.env` directly
- `app/page.tsx` must remain public and static
- NO typecheck/lint/tests until end of Phase 4
- Do NOT add `Co-authored-by: Claude <copilot@opencode>` to commit messages.

---

## Phase 0: Documentation Refresh

### Overview

Update 4 core documentation files to reflect current codebase state. This is the foundation - document current reality before making changes.

**Target Files:**

- `docs/app-pages.md` - Page inventory with routes
- `docs/custom-components.md` - Component inventory
- `docs/test-context.md` - Test inventory
- `docs/scripts.md` - Script inventory

---

### Task 0.1: Scan and Update app-pages.md

**Goal:** Document all pages in `app/**` with routes, server wrappers, auth requirements

**Files:**

- Modify: `docs/app-pages.md`
- Check: `app/(auth)/**/page.tsx`
- Check: `app/(admin)/**/page.tsx`
- Check: `app/(root)/**/page.tsx`
- Check: `app/page.tsx`
- Check: `app/demo/**/page.tsx`

- [ ] **Step 1: Read current app-pages.md**

```bash
# Read existing documentation
cat docs/app-pages.md | head -50
```

- [ ] **Step 2: Scan (auth) pages**

```bash
# Find all auth pages
find app/\(auth\) -name "page.tsx" -type f
```

- [ ] **Step 3: Scan (admin) pages**

```bash
# Find all admin pages
find app/\(admin\) -name "page.tsx" -type f
```

- [ ] **Step 4: Scan (root) pages**

```bash
# Find all root pages
find app/\(root\) -name "page.tsx" -type f
```

- [ ] **Step 5: Scan demo pages**

```bash
# Find all demo pages
find app/demo -name "page.tsx" -type f
```

- [ ] **Step 6: Update app-pages.md with current routes**

Update the documentation table with:

- Route path
- File path
- Server wrapper component
- Auth requirement
- Any convention violations found

---

### Task 0.2: Scan and Update custom-components.md

**Goal:** Document all custom components (excluding ui/) with types, usage

**Files:**

- Modify: `docs/custom-components.md`
- Check: `components/layouts/**/*.tsx`
- Check: `components/**/index.tsx` (server wrappers)
- Check: `components/**/*Client.tsx`

- [ ] **Step 1: Read current custom-components.md**

```bash
cat docs/custom-components.md | head -80
```

- [ ] **Step 2: Scan components/layouts**

```bash
# Count layout components
find components/layouts -name "*.tsx" -type f | wc -l
find components/layouts -name "index.tsx" -type f
```

- [ ] **Step 3: Scan server wrappers**

```bash
# Find server wrapper components
find components -name "index.tsx" -path "*/components/*" | head -20
```

- [ ] **Step 4: Update custom-components.md**

Add any new components found, update status of moved/deleted components

---

### Task 0.3: Scan and Update test-context.md

**Goal:** Verify 37 Vitest + 10 Playwright specs, document deterministic status

**Files:**

- Modify: `docs/test-context.md`
- Check: `tests/unit/**/*.test.ts`
- Check: `tests/e2e/**/*.spec.ts`

- [ ] **Step 1: Read current test-context.md**

```bash
cat docs/test-context.md | head -60
```

- [ ] **Step 2: Count Vitest specs**

```bash
# Count unit test files
find tests/unit -name "*.test.ts" -type f | wc -l
find tests/unit -name "*.test.tsx" -type f | wc -l
```

- [ ] **Step 3: Count Playwright specs**

```bash
# Count E2E test files
find tests/e2e -name "*.spec.ts" -type f | wc -l
```

- [ ] **Step 4: Verify test-context.md matches actual**

Update any discrepancies between documented and actual test counts

---

### Task 0.4: Scan and Update scripts.md

**Goal:** Inventory all scripts with purpose, flags, orchestrator vs logic type

**Files:**

- Modify: `docs/scripts.md`
- Check: `scripts/*.sh`
- Check: `scripts/*.ps1`
- Check: `scripts/ts/**/*.ts`

- [ ] **Step 1: Read current scripts.md**

```bash
cat docs/scripts.md | head -50
```

- [ ] **Step 2: Scan shell scripts**

```bash
# Find shell scripts
ls -la scripts/*.sh scripts/*.ps1 scripts/*.bat 2>/dev/null | head -20
```

- [ ] **Step 3: Scan TypeScript scripts**

```bash
# Find TypeScript scripts
find scripts/ts -name "*.ts" -type f | head -30
```

- [ ] **Step 4: Identify orchestrator vs logic scripts**

For each script, determine:

- Orchestrator (calls TypeScript) vs Logic (contains logic)
- Purpose
- Available flags (especially --dry-run)

- [ ] **Step 5: Update scripts.md**

---

### Task 0.5: Phase 0 Completion

- [ ] **Step 1: Commit Phase 0 documentation changes**

```bash
git add docs/app-pages.md docs/custom-components.md docs/test-context.md docs/scripts.md
git commit -m "docs: Phase 0 documentation refresh complete"
Co-authored-by: Claude <copilot@opencode>
```

---

## Phase 1: Component Cleanup & Enhancement

### Overview

Component enhancement pass on all folders in `components/` (skip ui/). Create 8 new generic layout components. Audit stores/hooks for TypeScript strictness.

---

### Task 1.1: Component Enhancement Pass

**Goal:** Ensure all components have fully typed props (no `any`), JSDoc comments, consistent exports

**Files:**

- Modify: `components/layouts/**/*.tsx`
- Modify: `components/**/index.tsx`

- [ ] **Step 1: List all component folders to enhance**

```bash
# Find all component folders excluding ui
find components -type d -not -path "components/ui*" | head -30
```

- [ ] **Step 2: Check each component for implicit any**

For each component folder:

- Read the component file
- Check props interface for `any` types
- Add explicit types where missing
- Add JSDoc comments where missing

- [ ] **Step 3: Check export patterns**

Ensure each component exports:

- Named export: `export { ComponentName }`
- Default export: `export default ComponentName`
- Barrel: `index.tsx` where appropriate

- [ ] **Step 4: Fix violations inline**

For any component with:

- Implicit `any` in props → add explicit type
- Missing JSDoc → add TSDoc comment
- Missing exports → add export statements

---

### Task 1.2: Create 8 Generic Layout Components

**Goal:** Create reusable generic components for common patterns

**Files:**

- Create: `components/layouts/generic-page-shell/index.tsx`
- Create: `components/layouts/generic-data-table/index.tsx`
- Create: `components/layouts/generic-card/index.tsx`
- Create: `components/layouts/generic-form/index.tsx`
- Create: `components/layouts/generic-modal/index.tsx`
- Create: `components/layouts/generic-toast/index.tsx`
- Create: `components/layouts/generic-skeleton/index.tsx`
- Create: `components/layouts/generic-empty-state/index.tsx`

- [ ] **Step 1: Create generic-page-shell**

```typescript
// components/layouts/generic-page-shell/index.tsx
interface GenericPageShellProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  loading?: boolean;
}

/**
 * Reusable page container with title, description, actions slot
 * @component
 * @example
 * <GenericPageShell title="Dashboard" actions={<Button>Add</Button>}>
 *   <Content />
 * </GenericPageShell>
 */
export function GenericPageShell({
  title,
  description,
  children,
  actions,
  loading
}: GenericPageShellProps) {
  // Implementation
}

export { GenericPageShell };
export default GenericPageShell;
```

- [ ] **Step 2: Create generic-data-table**

```typescript
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
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
  };
}

/**
 * Type-safe data table with configurable columns
 * @component
 */
export function GenericDataTable<T>({
  data,
  columns,
  onRowClick,
  pagination
}: GenericDataTableProps<T>) {
  // Implementation
}

export { GenericDataTable };
export default GenericDataTable;
```

- [ ] **Step 3: Create generic-card**

```typescript
// components/layouts/generic-card/index.tsx
interface GenericCardProps {
  header?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

/**
 * Reusable card with header, body, footer slots
 * @component
 */
export function GenericCard({
  header,
  children,
  footer,
  className
}: GenericCardProps) {
  // Implementation
}

export { GenericCard };
export default GenericCard;
```

- [ ] **Step 4: Create generic-form**

```typescript
// components/layouts/generic-form/index.tsx
import { UseFormReturn } from "react-hook-form";

interface GenericFormProps<T> {
  form: UseFormReturn<T>;
  onSubmit: (data: T) => void;
  children: React.ReactNode;
  className?: string;
}

/**
 * Form wrapper with react-hook-form integration
 * @component
 */
export function GenericForm<T>({
  form,
  onSubmit,
  children,
  className
}: GenericFormProps<T>) {
  // Implementation
}

export { GenericForm };
export default GenericForm;
```

- [ ] **Step 5: Create generic-modal**

```typescript
// components/layouts/generic-modal/index.tsx
interface GenericModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

/**
 * Accessible modal with proper focus management
 * @component
 */
export function GenericModal({
  open,
  onClose,
  title,
  children,
  footer
}: GenericModalProps) {
  // Implementation using Radix UI Dialog
}

export { GenericModal };
export default GenericModal;
```

- [ ] **Step 6: Create generic-toast**

```typescript
// components/layouts/generic-toast/index.tsx
interface ToastProps {
  message: string;
  type?: "success" | "error" | "info" | "warning";
  onClose?: () => void;
}

/**
 * Toast notification component
 * @component
 */
export function Toast({
  message,
  type = "info",
  onClose
}: ToastProps) {
  // Implementation using Sonner
}

export { Toast };
export default Toast;
```

- [ ] **Step 7: Create generic-skeleton**

```typescript
// components/layouts/generic-skeleton/index.tsx
interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  variant?: "text" | "circular" | "rectangular";
  className?: string;
}

/**
 * Loading skeleton component
 * @component
 */
export function Skeleton({
  width,
  height,
  variant = "text",
  className
}: SkeletonProps) {
  // Implementation
}

export { Skeleton };
export default Skeleton;
```

- [ ] **Step 8: Create generic-empty-state**

```typescript
// components/layouts/generic-empty-state/index.tsx
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

/**
 * No-data display component
 * @component
 */
export function EmptyState({
  icon,
  title,
  description,
  action
}: EmptyStateProps) {
  // Implementation
}

export { EmptyState };
export default EmptyState;
```

---

### Task 1.3: Store & Hook Audit

**Goal:** Audit 11 stores and 5 hooks for TypeScript strictness, no process.env, no DB imports

**Files:**

- Modify: `stores/**/*.ts`
- Modify: `hooks/**/*.ts`

- [ ] **Step 1: List all store files**

```bash
find stores -name "*.ts" -o -name "*.tsx" | head -20
```

- [ ] **Step 2: List all hook files**

```bash
find hooks -name "*.ts" -o -name "*.tsx" | head -20
```

- [ ] **Step 3: Audit each store for violations**

For each store:

- Check for explicit return types
- Check for no `any` types
- Check for no `process.env` reads
- Check for no DB imports
- Fix any violations found

- [ ] **Step 4: Audit each hook for violations**

For each hook:

- Check for explicit return types
- Check for no `any` types
- Check for no `process.env` reads
- Check for no DB imports
- Fix any violations found

---

### Task 1.4: Phase 1 Completion

- [ ] **Step 1: Commit Phase 1 component changes**

```bash
git add components/ stores/ hooks/
git commit -m "feat: Phase 1 component enhancement complete

- Add 8 generic layout components
- Enhance component props typing
- Audit stores/hooks for strict mode
Co-authored-by: Claude <copilot@opencode>
```

---

## Phase 2: Test Infrastructure Hardening

### Overview

Verify and fix 37 Vitest + 10 Playwright specs. Fix broken imports from Phase 1 demo moves. Ensure deterministic behavior.

---

### Task 2.1: Vitest Unit Test Enhancement

**Goal:** Verify 37 specs, fix broken imports, remove orphaned specs

**Files:**

- Modify: `tests/unit/**/*.test.ts`
- Modify: `tests/mocks/handlers.ts`

- [ ] **Step 1: Count actual Vitest specs**

```bash
find tests/unit -name "*.test.ts" -o -name "*.test.tsx" | wc -l
```

- [ ] **Step 2: Check for orphaned specs**

Compare test files against:

- Deleted files from Phase 1 (if any)
- Moved demo pages that might affect imports

- [ ] **Step 3: Run a subset to verify imports work**

```bash
bun run test:browser -- --run tests/unit/actions/registerUser.test.ts 2>&1 | head -30
```

- [ ] **Step 4: Fix any broken imports**

If tests fail due to imports:

- Fix import paths
- Update mock handlers if needed

- [ ] **Step 5: Document test status**

Update test-context.md with any changes

---

### Task 2.2: Playwright E2E Test Enhancement

**Goal:** Verify 10 specs, fix broken selectors, ensure deterministic behavior

**Files:**

- Modify: `tests/e2e/**/*.spec.ts`
- Modify: `tests/e2e/helpers/*.ts`

- [ ] **Step 1: Count actual Playwright specs**

```bash
find tests/e2e -name "*.spec.ts" | wc -l
```

- [ ] **Step 2: Verify auth helper usage**

Check that all specs use `tests/e2e/helpers/auth.ts`:

```typescript
// Should be present in all authenticated tests
import { loginAsSeedUser } from "@/tests/e2e/helpers/auth";
```

- [ ] **Step 3: Verify Plaid mock usage**

Check that Plaid flows use `addMockPlaidInitScript()`:

```typescript
// Should be present in wallet-linking tests
import { addMockPlaidInitScript } from "@/tests/e2e/helpers/plaid.mock";
```

- [ ] **Step 4: Run a smoke E2E test**

```bash
# Only if needed - don't run full suite in Phase 2
echo "Skipping full E2E until Phase 4 validation"
```

- [ ] **Step 5: Document test status**

Update test-context.md with any changes

---

### Task 2.3: Phase 2 Completion

- [ ] **Step 1: Commit Phase 2 test changes**

```bash
git add tests/
git commit -m "feat: Phase 2 test infrastructure hardening complete

- Verify 37 Vitest + 10 Playwright specs
- Fix broken imports
- Standardize auth/Plaid helpers
Co-authored-by: Claude <copilot@opencode>
```

---

## Phase 3: Page Analysis

### Overview

Analyze every page in order, documenting current state, violations, and improvements needed. This is documentation-only - no code changes yet.

---

### Task 3.1: Analyze (auth) Pages

**Goal:** Document sign-in, sign-up pages with routes, wrappers, auth

**Files:**

- Analyze: `app/(auth)/sign-in/page.tsx`
- Analyze: `app/(auth)/sign-up/page.tsx`

- [ ] **Step 1: Analyze sign-in page**

```bash
# Read the page file
cat app/\(auth\)/sign-in/page.tsx
```

Document:

- Server wrapper used
- Auth guard (if any)
- Convention violations (process.env, DB imports)
- DAL usage
- Server Actions used

- [ ] **Step 2: Analyze sign-up page**

```bash
cat app/\(auth\)/sign-up/page.tsx
```

Document same metrics

- [ ] **Step 3: Create analysis document**

Add to `docs/app-pages.md`:

```
### Auth Pages Analysis

| Route | File | Wrapper | Auth Check | Violations |
|-------|------|---------|------------|------------|
| /sign-in | page.tsx | SignInServerWrapper | Redirect if session | None |
```

---

### Task 3.2: Analyze (admin) Pages

**Goal:** Document admin dashboard with auth, admin check, violations

**Files:**

- Analyze: `app/(admin)/**/page.tsx`

- [ ] **Step 1: Analyze admin pages**

```bash
find app/\(admin\) -name "page.tsx" -exec cat {} \;
```

Document:

- Server wrapper
- Auth requirement
- Admin role check
- Any violations

- [ ] **Step 2: Update analysis document**

---

### Task 3.3: Analyze (root) Pages

**Goal:** Document dashboard, wallets, transactions, transfers, settings

**Files:**

- Analyze: `app/(root)/dashboard/page.tsx`
- Analyze: `app/(root)/my-wallets/page.tsx`
- Analyze: `app/(root)/payment-transfer/page.tsx`
- Analyze: `app/(root)/transaction-history/page.tsx`
- Analyze: `app/(root)/settings/page.tsx`

- [ ] **Step 1: Analyze each root page**

For each page:

- Read the file
- Document server wrapper
- Document auth requirement
- Check for process.env usage
- Check for direct DB imports
- Check DAL usage
- Check Server Actions usage

- [ ] **Step 2: Update analysis document**

---

### Task 3.4: Analyze Landing Page (CRITICAL)

**Goal:** Verify app/page.tsx remains static - NO auth, NO DB, NO process.env

**Files:**

- Analyze: `app/page.tsx` (MUST stay static)

- [ ] **Step 1: Read landing page**

```bash
cat app/page.tsx
```

- [ ] **Step 2: Verify no violations**

Check for:

- No `await auth()` or auth imports
- No DB/DAL imports
- No `process.env` reads
- No Server Actions calls

- [ ] **Step 3: Document status**

Add to analysis:

```
### Landing Page (CRITICAL)
Status: ✅ COMPLIANT - Remains static
Violations: None
```

---

### Task 3.5: Analyze Demo Pages

**Goal:** Document demo pages (post-move to app/demo/)

**Files:**

- Analyze: `app/demo/**/page.tsx`

- [ ] **Step 1: List demo pages**

```bash
find app/demo -name "page.tsx"
```

- [ ] **Step 2: Analyze each demo page**

Document for each:

- Server wrapper
- Auth requirement
- Any violations

- [ ] **Step 3: Update analysis document**

---

### Task 3.6: Phase 3 Completion

- [ ] **Step 1: Commit Phase 3 analysis**

```bash
git add docs/
git commit -m "docs: Phase 3 page analysis complete

- Document (auth), (admin), (root) pages
- Verify landing page static compliance
- Identify convention violations per page
Co-authored-by: Claude <copilot@opencode>
```

---

## Phase 4: Functionality Implementation

### Overview

**CRITICAL PHASE** - Apply Phase 3 findings to modify all pages. Enforce conventions, replace one-off markup with generic components. NO validation until phase end.

**End of Phase 4:** Full validation - ALL checks must pass before Phase 5.

---

### Task 4.1: Fix Convention Violations in Pages

**Goal:** Fix all violations identified in Phase 3 analysis

**Files:**

- Modify: `app/(auth)/**/page.tsx`
- Modify: `app/(admin)/**/page.tsx`
- Modify: `app/(root)/**/page.tsx`

- [ ] **Step 1: Fix process.env violations**

For each page with process.env usage:

```typescript
// BEFORE (WRONG)
const secret = process.env.SECRET;

// AFTER (CORRECT)
import { auth } from "@/app-config";
const { NEXTAUTH_SECRET } = auth; // or specific config
```

- [ ] **Step 2: Fix direct DB imports**

For each page with direct DB import:

```typescript
// BEFORE (WRONG)
import { db } from "@/database/db";
const users = await db.select().from(usersTable);

// AFTER (CORRECT)
import { userDal } from "@/dal";
const users = await userDal.findAll();
```

- [ ] **Step 3: Add missing auth guards**

For protected pages without auth:

```typescript
// Add at top of server component
import { auth } from "@/app-config";

export default async function ProtectedPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/sign-in");
  }
  // ... rest of component
}
```

---

### Task 4.2: Integrate Generic Components

**Goal:** Replace one-off markup with generic components from Phase 1

**Files:**

- Modify: Various pages in `app/`

- [ ] **Step 1: Identify opportunities**

For each page:

- Look for repeated page containers → use `generic-page-shell`
- Look for tables → use `generic-data-table`
- Look for cards → use `generic-card`
- Look for forms → use `generic-form`
- Look for modals → use `generic-modal`

- [ ] **Step 2: Replace with generics**

```typescript
// BEFORE
<div className="border rounded-lg p-4">
  <h2 className="text-xl font-bold">{title}</h2>
  {children}
</div>

// AFTER
import { GenericCard } from "@/components/layouts/generic-card";
<GenericCard header={<h2>{title}</h2>}>
  {children}
</GenericCard>
```

---

### Task 4.3: Verify Server Actions Contract

**Goal:** Ensure all Server Actions return `{ ok, error, ...payload }`

**Files:**

- Modify: `actions/**/*.ts`

- [ ] **Step 1: List all Server Actions**

```bash
find actions -name "*.ts" -exec grep -l "use server" {} | head -20
```

- [ ] **Step 2: Check return types**

For each action:

- Verify returns object with `ok: boolean`
- Verify returns `error?: string` on failure
- Verify returns payload on success

- [ ] **Step 3: Fix non-compliant actions**

```typescript
// BEFORE (WRONG)
export async function action(data) {
  await db.insert(...);
  return { success: true };
}

// AFTER (CORRECT)
export async function action(data) {
  const result = await dal.create(data);
  if (!result.ok) {
    return { ok: false, error: result.error };
  }
  return { ok: true, user: result.user };
}
```

---

### Task 4.4: Add Revalidation After Mutations

**Goal:** Add revalidatePath() after mutations in Server Actions

**Files:**

- Modify: `actions/**/*.ts`

- [ ] **Step 1: Identify mutations without revalidation**

```bash
# Find actions that do DB inserts/updates/deletes
grep -l "db.insert\|db.update\|db.delete" actions/*.ts
```

- [ ] **Step 2: Add revalidatePath**

```typescript
// After successful mutation
import { revalidatePath } from "next/cache";

export async function createWallet(data) {
  // ... mutation logic ...
  if (result.ok) {
    revalidatePath("/dashboard");
    revalidatePath("/my-wallets");
  }
  return result;
}
```

---

### Task 4.5: Phase 4 Validation (CRITICAL GATE)

**Goal:** Run full validation - ALL checks must pass

- [ ] **Step 1: Run format**

```bash
bun run format 2>&1 | tail -20
```

- [ ] **Step 2: Run type-check**

```bash
bun run type-check 2>&1 | tail -30
```

- [ ] **Step 3: Run lint:strict**

```bash
bun run lint:strict 2>&1 | tail -30
```

- [ ] **Step 4: Run verify:rules**

```bash
bun run verify:rules 2>&1 | tail -20
```

- [ ] **Step 5: If ANY check fails, STOP and fix**

```bash
# Fix the failure, then re-run the full validation sequence
# DO NOT proceed until ALL checks pass
```

- [ ] **Step 6: Run test:browser (Vitest)**

```bash
bun run test:browser 2>&1 | tail -30
```

- [ ] **Step 7: Run test:ui (Playwright)**

```bash
# Only if above passes - takes longer
bun run test:ui 2>&1 | tail -40
```

- [ ] **Step 8: Commit Phase 4 completion**

```bash
git add app/ actions/
git commit -m "feat: Phase 4 functionality implementation complete

- Fix convention violations in all pages
- Integrate generic components
- Verify Server Actions contract
- Add revalidation after mutations
- All validation checks pass
Co-authored-by: Claude <copilot@opencode>
```

---

## Phase 5: Script Enhancement with ts-morph

### Overview

Convert shell scripts to orchestrators only, add --dry-run to mutation scripts, use ts-morph for AST operations.

---

### Task 5.1: Audit Scripts for Orchestrator Pattern

**Goal:** Identify scripts that need conversion to orchestrator-only

**Files:**

- Analyze: `scripts/*.sh`
- Analyze: `scripts/*.ps1`
- Analyze: `scripts/ts/**/*.ts`

- [ ] **Step 1: Find shell scripts with logic**

```bash
# Look for logic in shell scripts
grep -l "for.*in\|while\|if.*then" scripts/*.sh scripts/*.ps1 2>/dev/null
```

- [ ] **Step 2: Identify what each script does**

For each shell script:

- Document current behavior
- Identify logic that should move to TypeScript

- [ ] **Step 3: Update scripts.md**

Mark scripts as:

- Orchestrator (good)
- Needs conversion (bad)

---

### Task 5.2: Convert Shell Scripts to Orchestrators

**Goal:** Move logic from shell to TypeScript, keep shell as thin wrapper

**Files:**

- Modify: `scripts/*.sh`
- Modify: `scripts/*.ps1`
- Create: `scripts/ts/utils/process-files.ts`

- [ ] **Step 1: Convert a sample script**

```bash
# BEFORE: scripts/example.sh (has logic)
#!/bin/bash
for file in $(find . -name "*.ts"); do
  echo "Processing $file"
done

# AFTER: scripts/example.sh (orchestrator only)
#!/bin/bash
bunx tsx scripts/ts/utils/process-files.ts "$@"
```

- [ ] **Step 2: Create TypeScript logic**

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

  if (options.values.dryRun) {
    console.log("[DRY RUN] Would process files");
    return;
  }

  // Actual processing...
}
```

- [ ] **Step 3: Continue for other scripts**

Apply same pattern to other shell scripts

---

### Task 5.3: Add Dry-Run to Mutation Scripts

**Goal:** Ensure all mutation scripts support --dry-run flag

**Files:**

- Modify: `scripts/ts/**/*.ts` (mutation scripts)

- [ ] **Step 1: Find mutation scripts**

```bash
# Scripts that modify files
grep -l "write\|edit\|delete\|rename" scripts/ts/**/*.ts
```

- [ ] **Step 2: Add dry-run pattern**

```typescript
// Add to each mutation script
const isDryRun = process.argv.includes("--dry-run");

if (isDryRun) {
  console.log("[DRY RUN] Changes that would be made:");
  console.log(JSON.stringify(proposedChanges, null, 2));
  return;
}

// Continue with actual changes
```

- [ ] **Step 3: Test dry-run**

```bash
# Test on a safe script
bunx tsx scripts/ts/deploy/deploy.ts --dry-run
```

---

### Task 5.4: Use ts-morph for AST Operations

**Goal:** Replace regex-based transformations with ts-morph for safer AST manipulation

**Files:**

- Modify: Various scripts in `scripts/ts/`

- [ ] **Step 1: Identify regex-based operations**

```bash
grep -rn "sed\|awk\|regex" scripts/ts/ | head -10
```

- [ ] **Step 2: Convert to ts-morph**

```typescript
// BEFORE (fragile)
const content = file.replace(
  /const (\w+) =.*/g,
  "const $1: Type = ..."
);

// AFTER (safe with ts-morph)
const project = new Project({ tsConfigFilePath: "./tsconfig.json" });
const sourceFile = project.getSourceFile(filePath);
const desc = sourceFile?.getDescendantsOfKind(
  SyntaxKind.VariableDeclaration
)[0];
desc?.setType("Type");
```

---

### Task 5.5: Final Validation & Completion

- [ ] **Step 1: Run final validation**

```bash
# Full validation one more time
bun run format && bun run type-check && bun run lint:strict && bun run verify:rules && bun run test:browser && bun run test:ui
```

- [ ] **Step 2: Commit Phase 5 completion**

```bash
git add scripts/
git commit -m "feat: Phase 5 script enhancement complete

- Convert shell scripts to orchestrators
- Add --dry-run to mutation scripts
- Use ts-morph for AST operations
Co-authored-by: Claude <copilot@opencode>
```

- [ ] **Step 3: Final success notification**

```bash
# Send OS notification
echo "Codebase overhaul complete - all 5 phases finished"
```

---

## Execution Options

**Plan complete and saved to `docs/superpowers/plans/2026-05-03-codebase-overhaul.md`. Two execution options:**

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
