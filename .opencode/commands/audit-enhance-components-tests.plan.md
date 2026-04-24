## PR Template - feature/audit/<group>-<short>

Title: feat(audit): <short description> — <group>

Summary

- What: Short summary of changes
- Why: Motivation and links to plan `audit-enhance-components-tests`

Files changed

- <file> — <change description>

Verification

- [ ] npm run type-check
- [ ] npm run lint:strict
- [ ] npm run verify:rules
- [ ] npm run test:browser

---

# Plan: audit-enhance-components-tests

## Overview

Systematically audit all Next.js pages, non-UI components, and tests. Remove dead/duplicate code, enhance and reuse components, ensure all tests are up-to-date.

## Status: in-progress

## Phase 1: Components Audit

### 1.1 Delete duplicate component

- [ ] DELETE `components/plaid-link-button/` (duplicate of plaid-link)

### 1.2 Verify unused (then delete)

- [ ] CHECK `components/site-header/` usage, DELETE if unused
- [ ] CHECK `components/right-sidebar/` usage, DELETE if unused

### 1.3 Verify potentially unused

- [ ] CHECK `components/app-sidebar/` usage, DELETE if unused

## Phase 2: Tests Audit

### 2.1 Merge duplicates

- [ ] DELETE `tests/verify-rules/verify-rules.test.ts` (duplicate of tests/verify/rules.test.ts)
- [ ] MERGE `tests/unit/datatable.test.tsx` and `tests/unit/data-table.test.tsx` or DELETE duplicate
- [ ] MERGE `tests/e2e/payment-transfer-flow.spec.ts` into `tests/e2e/payment-transfer.spec.ts` or DELETE

### 2.2 Expand shallow tests

- [ ] EXPAND `tests/unit/admin.actions.test.ts` — add real logic tests
- [ ] EXPAND `tests/unit/admin-dashboard.layout.test.tsx` — add assertions

## Phase 3: Verification

- [ ] npm run type-check
- [ ] npm run lint:strict
- [ ] npm run verify:rules
- [ ] npm run test:browser
- [ ] Verify no dead imports remain

---

## Detailed Findings

### App Directory (40 files) - HEALTHY

| Route Group | Pages | Error/Loading | Pattern |
| --- | --- | --- | --- |
| (auth) | sign-in, sign-up | Yes | Server wrappers |
| (root) | dashboard, settings, payment-transfer, transaction-history, my-wallets | Yes | Server wrappers |
| (admin) | admin | Yes | Server wrappers |

**Verdict:** No cleanup needed. Structure is correct.

### Components (37 folders)

| Component          | Status             | Action          |
| ------------------ | ------------------ | --------------- |
| plaid-link-button/ | DUPLICATE          | DELETE          |
| site-header/       | POTENTIALLY UNUSED | Verify + DELETE |
| right-sidebar/     | POTENTIALLY UNUSED | Verify + DELETE |
| app-sidebar/       | Wrapper            | Keep if used    |

**Verdict:** 1 deletion, 2-3 verify + delete.

### Tests (67 files)

| Issue                                              | Fix          |
| -------------------------------------------------- | ------------ |
| Duplicate: tests/verify-rules/verify-rules.test.ts | DELETE       |
| Duplicate: datatable vs data-table                 | MERGE/DELETE |
| Duplicate: payment-transfer-flow.spec.ts           | MERGE/DELETE |
| Shallow: admin.actions.test.ts                     | EXPAND       |
| Shallow: admin-dashboard.layout.test.tsx           | EXPAND       |

**Verdict:** 2-3 merges, 2-3 expansions.

---

## Execution

### Start: 2026-04-24

### Last Updated: 2026-04-24
