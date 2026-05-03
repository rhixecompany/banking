# Phase 0: Documentation Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refresh and verify all core documentation (custom-components, app-pages, test-context, scripts) to establish single source of truth for Phase 1–5 execution.

**Architecture:** Four parallel documentation tasks (0.1–0.4) executed via subagent-driven development. Each task scans codebase, verifies/updates markdown inventory, adds missing sections, ensures consistency with actual code. Fresh subagent per task with isolated context.

**Tech Stack:** Markdown, TypeScript AST inspection (via grep/glob), Next.js 16, Vitest, Playwright

---

## File Structure

### Primary Documentation Files (to create/update)

- `docs/custom-components.md` — UI & layout components inventory (stores, hooks, layouts, utilities)
- `docs/app-pages.md` — Route structure & page responsibilities (9 pages across groups)
- `docs/test-context.md` — Test suite inventory (37 Vitest + 10 Playwright specs)
- `docs/scripts.md` — Script inventory & orchestrator patterns (to be created)

### Supporting Context

- `.opencode/commands/2026-05-03-phase0-documentation.plan.md` — This plan

---

## Task Overview

| Task | Focus | Deliverable | Files Scanned |
| --- | --- | --- | --- |
| **0.1** | Stores & Hooks Inventory | Complete custom-components.md with all stores/hooks/layouts | `lib/stores/`, `lib/hooks/`, `components/layouts/` |
| **0.2** | App Routes & Pages | Verify & enhance app-pages.md (9 pages) | `app/` folder structure |
| **0.3** | Test Suite Inventory | Verify & enhance test-context.md (37 Vitest + 10 Playwright) | `tests/unit/`, `tests/e2e/` |
| **0.4** | Scripts & Orchestrators | Create scripts.md + inventory all orchestrator patterns | `scripts/`, `scripts/ts/` |

---

## Task 0.1: Stores & Hooks Inventory Enhancement

**Files:**

- Modify: `docs/custom-components.md`
- Scan: `lib/stores/*.ts`, `lib/hooks/*.{ts,tsx}`, `components/layouts/*.tsx`

### Checklist

- [ ] **Step 1: Read current custom-components.md**

Run: `cat docs/custom-components.md | head -100`

Expected: Verify current structure (sections, entry count).

- [ ] **Step 2: Scan lib/stores/ for all store definitions**

Run: `find lib/stores -name "*.ts" -type f | sort`

Expected: List all store files (expected: create-filter-store.ts, create-ui-store.ts, create-transfer-store.ts, create-toast-store.ts, index.ts)

- [ ] **Step 3: Scan lib/hooks/ for all hook definitions**

Run: `find lib/hooks -name "*.{ts,tsx}" -type f | sort`

Expected: List all hook files (expected: use-pagination.ts, use-mobile.tsx, use-wallet-balance.ts, use-transaction-filter.ts, use-bank-connection.ts)

- [ ] **Step 4: Extract store signatures and documentation**

For each store file, extract:

- Export name (e.g., `createFilterStore`)
- Return type/interface
- State shape (key properties)
- Actions available

Example entry:

```
### createFilterStore()
- **File:** `lib/stores/create-filter-store.ts`
- **Returns:** Store<FilterState>
- **State:** { status: "all" | "pending" | "completed"; sortBy: "date" | "amount"; limit: 50 }
- **Actions:** `setStatus()`, `setSortBy()`, `setLimit()`
```

- [ ] **Step 5: Extract hook signatures and documentation**

For each hook file, extract:

- Hook name (e.g., `usePagination`)
- Input params
- Return type
- Use case

Example entry:

```
### usePagination()
- **File:** `lib/hooks/use-pagination.ts`
- **Params:** `{ items: T[]; pageSize: number }`
- **Returns:** `{ currentPage: number; pageItems: T[]; goToPage(n: number): void }`
- **Use:** Paginate lists in client components
```

- [ ] **Step 6: Scan components/layouts/ for all layout components**

Run: `find components/layouts -name "*.tsx" -type f | sort`

Expected: Extract layout component names, props, and purposes.

- [ ] **Step 7: Update custom-components.md with complete inventory**

Sections to add/enhance:

1. **Stores** — All 5 stores with signatures
2. **Hooks** — All 5 hooks with signatures
3. **Layout Components** — All layout components with file paths
4. **Utilities** — Any utility functions in `lib/`
5. **Guidelines** — Inline guidelines for store/hook creation

- [ ] **Step 8: Verify consistency with codebase**

Spot-check 3 random stores and 3 random hooks to ensure documentation matches actual code.

Expected: 100% match

- [ ] **Step 9: Add "Last Updated" timestamp and status**

Add at top of file:

```markdown
> **Last Updated:** 2026-05-03  
> **Status:** ✅ Phase 0.1 Complete — 5 stores, 5 hooks, 8+ layout components inventoried
```

- [ ] **Step 10: Commit**

```bash
git add docs/custom-components.md
git commit -m "docs(phase0): enhance custom-components.md with complete store/hook inventory

- Document all 5 stores (filter, ui, transfer, toast, session)
- Document all 5 hooks (pagination, mobile, wallet-balance, transaction-filter, bank-connection)
- Add layout component inventory
- Add guidelines for store/hook creation
- Verify against codebase (100% match)

Co-authored-by: Claude <copilot@opencode>"
```

---

## Task 0.2: App Pages & Routes Verification

**Files:**

- Modify: `docs/app-pages.md`
- Scan: `app/` folder structure, page.tsx & layout.tsx files

### Checklist

- [ ] **Step 1: Read current app-pages.md**

Run: `cat docs/app-pages.md`

Expected: Review current 9-page inventory structure.

- [ ] **Step 2: Scan app/ folder structure**

Run: `find app -type d | grep -E "^\./app/\([^)]+\)" | sort`

Expected: List all route groups: (auth), (root), (admin), (public), (demo), etc.

- [ ] **Step 3: Enumerate all page.tsx files in app/**

Run: `find app -name "page.tsx" -o -name "layout.tsx" | sort`

Expected: Complete list of all routes.

- [ ] **Step 4: For each page group, extract:**

- Group name (e.g., `(auth)`, `(root)`)
- Protection status (public/protected/admin)
- Routes contained
- Primary components used
- Key Server Actions called

Example entry:

```markdown
### (auth) — Authentication Routes

**Protection:** Public (accessible without session)

**Routes:**

- `/sign-in` — Sign-in form (credentials & OAuth)
- `/sign-up` — Registration form
- `/reset-password` — Password reset flow

**Components:** SignInForm, OAuthButtons, PasswordResetForm **Actions:** `signIn()`, `register()`, `resetPassword()` **DAL:** userDal.findByEmail(), userDal.create()
```

- [ ] **Step 5: Verify 9-page count and coverage**

Expected pages (verify exist):

1. `/` — Landing (public, static)
2. `/sign-in` — Auth (public)
3. `/sign-up` — Auth (public)
4. `/dashboard` — Protected (authenticated)
5. `/wallets` — Protected
6. `/transfers` — Protected
7. `/settings` — Protected
8. `/admin` — Admin only
9. One additional page (verify which)

- [ ] **Step 6: Add missing sections to app-pages.md**

If not present:

- Database access patterns (which DAL helpers used per page)
- Server Actions invoked per page
- Client-side state (stores/hooks used)
- Protected routes & auth checks
- Middleware/layout wrappers

- [ ] **Step 7: Verify auth() calls on protected pages**

Spot-check 3 protected pages: ensure `auth()` called and session checked.

Expected: All protected pages call `auth()` and redirect if no session.

- [ ] **Step 8: Add "Last Updated" timestamp**

```markdown
> **Last Updated:** 2026-05-03  
> **Status:** ✅ Phase 0.2 Complete — 9 pages inventoried and verified
```

- [ ] **Step 9: Commit**

```bash
git add docs/app-pages.md
git commit -m "docs(phase0): verify & enhance app-pages.md with complete route inventory

- Enumerate all 9 page routes with protection status
- Document all route groups ((auth), (root), (admin), etc)
- Add DAL & Server Action references per page
- Verify auth() calls on protected pages
- Document component & store dependencies

Co-authored-by: Claude <copilot@opencode>"
```

---

## Task 0.3: Test Suite Inventory Verification

**Files:**

- Modify: `docs/test-context.md`
- Scan: `tests/unit/`, `tests/e2e/`

### Checklist

- [ ] **Step 1: Read current test-context.md**

Run: `cat docs/test-context.md | head -50`

Expected: Review current test inventory structure.

- [ ] **Step 2: Count all Vitest unit tests**

Run: `find tests/unit -name "*.test.{ts,tsx}" -type f | wc -l`

Expected: ≥ 37 test files

- [ ] **Step 3: Count all Playwright E2E specs**

Run: `find tests/e2e -name "*.spec.ts" -type f | wc -l`

Expected: ≥ 10 spec files

- [ ] **Step 4: For each test file, extract:**

- File path
- Test suite name (describe blocks)
- Individual test count
- Mock setup (MSW, Plaid mock, etc.)
- Focus areas (DAL, actions, UI, etc.)

Example entry:

```markdown
### actions/registerUser.test.ts

- **Location:** `tests/unit/actions/registerUser.test.ts`
- **Test Count:** 4
- **Suites:** "registerUser()"
- **Mocks:** MSW (HTTP mocking)
- **Coverage:**
  - Valid registration
  - Duplicate email error
  - Validation error
  - Database error handling
```

- [ ] **Step 5: Enumerate all Vitest test suites**

By category:

- DAL tests (user, wallet, transaction, recipient, dwolla, admin)
- Action tests (auth, register, transfer, etc.)
- Hook tests (pagination, mobile, wallet-balance, etc.)
- Utility tests (formatters, validators, etc.)

- [ ] **Step 6: Enumerate all Playwright E2E specs**

By feature:

- Authentication flow
- Wallet creation & linking
- Transfer flow
- Balance viewing
- Admin operations
- (List all 10)

- [ ] **Step 7: Add deterministic mocking notes**

Document:

- Plaid mock tokens (seed-, mock-)
- Dwolla mock setup
- MSW handlers used
- Seed user credentials (seed-user@example.com / password123)

- [ ] **Step 8: Add test execution commands**

Include:

```bash
# Run all Vitest tests
bun run test:browser

# Run all Playwright E2E
bun run test:ui

# Run single test file
bun exec vitest run tests/unit/path/to/file.test.ts

# Run single Playwright spec
bunx playwright test tests/e2e/path/to/file.spec.ts
```

- [ ] **Step 9: Update test-context.md with complete inventory**

Sections:

1. **Unit Tests (Vitest)** — 37+ tests by category
2. **E2E Tests (Playwright)** — 10+ specs by feature
3. **Mocking Setup** — MSW, Plaid, Dwolla deterministic patterns
4. **Test Execution** — Commands to run tests
5. **Seed Data** — Credentials for testing

- [ ] **Step 10: Add "Last Updated" timestamp**

```markdown
> **Last Updated:** 2026-05-03  
> **Status:** ✅ Phase 0.3 Complete — 37 Vitest + 10 Playwright specs inventoried
```

- [ ] **Step 11: Commit**

```bash
git add docs/test-context.md
git commit -m "docs(phase0): verify & enhance test-context.md with complete test inventory

- Enumerate all 37 Vitest unit test suites
- Enumerate all 10 Playwright E2E specs
- Document deterministic mocking (Plaid, Dwolla, MSW)
- Add test execution commands
- Document seed user credentials for testing

Co-authored-by: Claude <copilot@opencode>"
```

---

## Task 0.4: Scripts & Orchestrator Inventory

**Files:**

- Create: `docs/scripts.md`
- Scan: `scripts/`, `scripts/ts/`, shell orchestrators

### Checklist

- [ ] **Step 1: Enumerate all shell orchestrators**

Run: `find scripts -maxdepth 1 -name "*.sh" -type f | sort`

Expected: List all orchestrator shell scripts (e.g., deploy.sh, seed.sh, etc.)

- [ ] **Step 2: Enumerate all TypeScript implementations**

Run: `find scripts/ts -name "*.ts" -type f | sort`

Expected: List all TypeScript implementation files.

- [ ] **Step 3: For each orchestrator, extract:**

- Script name (e.g., `verify-rules.ts`)
- Purpose (one-liner)
- Invocation (how to run)
- Key dependencies (what it calls)
- Output/side effects

Example entry:

```markdown
### verify-rules.ts

- **Purpose:** AST-based policy enforcement (same as CI)
- **Location:** `scripts/verify-rules.ts`
- **Invocation:** `bun run verify:rules`
- **Checks:**
  - No direct `process.env` in app/, lib/, components/
  - No DB imports in app/, components/
  - Home page (app/page.tsx) is static + public only
  - Large changes (>7 files) have .opencode/commands/\*.plan.md
- **Exit codes:**
  - 0 = all pass
  - 1 = warnings (non-fatal)
  - 2 = critical violations
```

- [ ] **Step 4: Verify orchestrator pattern compliance**

For each shell script:

- Verify it's orchestrator-only (no logic)
- Verify it calls `bunx tsx scripts/ts/<name>.ts`
- Document pattern in scripts.md

Example pattern:

```bash
#!/usr/bin/env bash
# scripts/verify-rules.sh - Orchestrator
cd "$(dirname "$0")/.."
bunx tsx scripts/ts/verify-rules.ts "$@"
```

- [ ] **Step 5: Document script categories**

Sections:

1. **Validation Scripts** — verify-rules.ts, type-check, lint:strict
2. **Database Scripts** — db:push, db:seed, migrations
3. **Build & Deploy Scripts** — build, deploy-to-\*, dev
4. **Utility Scripts** — plan-ensure, mcp-runner, seed/run.ts
5. **Testing Scripts** — test:browser, test:ui

- [ ] **Step 6: Add execution environment notes**

Document:

- Which scripts require clean git state (codemods)
- Which scripts require env vars (NEXTAUTH_SECRET, DATABASE_URL, etc.)
- Which scripts require running services (PostgreSQL, Redis)
- Port requirements (3000 for dev, etc.)

- [ ] **Step 7: Create docs/scripts.md with complete inventory**

Structure:

```markdown
# Scripts Inventory

> **Last Updated:** 2026-05-03  
> **Status:** ✅ Phase 0.4 Complete — All scripts documented

## Orchestrator Pattern

All scripts follow the pattern: `scripts/<name>.sh` orchestrator calls `scripts/ts/<name>.ts` implementation.

## Scripts by Category

### Validation Scripts

...

### Database Scripts

...

[etc.]
```

- [ ] **Step 8: Verify all scripts exist and are executable**

Run: `chmod +x scripts/*.sh` to ensure all are executable.

Expected: All shell orchestrators marked executable.

- [ ] **Step 9: Add "Last Updated" timestamp & commit**

```bash
git add docs/scripts.md
git commit -m "docs(phase0): create scripts.md with complete orchestrator inventory

- Document all shell orchestrators and TypeScript implementations
- Verify orchestrator pattern compliance
- Organize scripts by category (validation, db, build, utilities)
- Document environment requirements and exit codes
- Add execution examples and port requirements

Co-authored-by: Claude <copilot@opencode>"
```

---

## Self-Review Checklist

Before dispatch:

- [ ] All 4 tasks cover Phase 0 scope (custom-components, app-pages, test-context, scripts)
- [ ] Each task produces a concrete markdown file or enhancement
- [ ] Each step includes exact file paths, commands, expected output
- [ ] No placeholders ("TBD", "similar to", "add validation")
- [ ] Tasks can execute independently (no cross-task dependencies)
- [ ] Commits are atomic and follow convention
- [ ] Execution is subagent-driven-development (fresh subagent per task)

---

## Execution Strategy

This plan is designed for **subagent-driven development** with:

- **Fresh subagent per task** (Task 0.1, 0.2, 0.3, 0.4)
- **Two-stage review per task:** (1) Spec compliance (docs match code), (2) Commit quality
- **Isolated context:** Each subagent has its own session; no history bleed
- **Two-minute tasks:** Most steps take 2–5 minutes per-step, allowing rapid iteration

**Total Phase 0 execution time:** ~2–3 hours (with review gates)

After Task 0.4 completion, Phase 1 (Dead-Code Removal) can proceed with high-fidelity documentation as reference.
