# Plan: Frontend Refactor — Banking App

**TL;DR:** Refactor the frontend UI of the Banking Next.js app by creating `components/<PageName>/` folders for all 8 pages, fully implementing two stub pages (`payment-transfer`, `transaction-history`), completing the `settings` profile form, fixing known bugs, adding route-level loading/error/not-found files, and overhauling the test suite.

**shadcn-studio decision:** Wire `datatable-transaction.tsx`, `chart-sales-metrics.tsx`, and `statistics-card-01.tsx` into the real page implementations (confirmed by user).

---

## Discoveries

### Pages — Current State

| Page | File | State | Issues |
| --- | --- | --- | --- |
| Home/Landing | `app/(root)/page.tsx` | Full (304 LOC) | No metadata export |
| Dashboard | `app/(root)/dashboard/page.tsx` | Full (35 LOC) | Double auth bug, no metadata |
| My Banks | `app/(root)/my-banks/page.tsx` | Full (83 LOC) | Inline `BankWithDetails` duplicate, no metadata |
| Payment Transfer | `app/(root)/payment-transfer/page.tsx` | Stub — `<div>` only | No auth guard, no metadata |
| Transaction History | `app/(root)/transaction-history/page.tsx` | Stub — `<div>` only | No auth guard, no metadata |
| Settings | `app/(root)/settings/page.tsx` | Minimal (30 LOC) | Header only, no form, no metadata |
| Sign In | `app/(auth)/sign-in/page.tsx` | Full | No metadata |
| Sign Up | `app/(auth)/sign-up/page.tsx` | Full | No metadata |

### Components — Current State

- `components/` is **flat** — no page-named subfolders exist yet
- `components/DashboardClient.tsx` — 192 LOC, `"use client"`, uses PlaidProvider, PlaidLinkButton, stats cards
- `components/MyBanksClient.tsx` — 275 LOC, `"use client"`, has inline `BankWithDetails` duplicate

### Known Bugs

| # | Location | Bug |
| --- | --- | --- |
| 1 | `app/(root)/my-banks/page.tsx` + `components/MyBanksClient.tsx` | `BankWithDetails` interface defined inline in both files (duplicate) |
| 2 | `app/(auth)/layout.tsx` | Default export named `RootLayout` — conflicts with root `RootLayout` |
| 3 | `app/(root)/dashboard/page.tsx` | Calls both `getLoggedInUser()` AND `auth()` — double auth |
| 4 | All 7 pages | Missing `export const metadata` |

### Test Suite — Current State

| File | State |
| --- | --- |
| `tests/helpers/auth.ts` | **Dead code** (80 LOC) — not imported anywhere; distinct from `tests/e2e/helpers/auth.ts` which IS active |
| `tests/e2e/auth-flow.spec.ts` | **Duplicate** (18 LOC, 1 test) — fully covered by `auth.spec.ts` |
| `tests/fixtures/auth.ts` | Exists but never used by any spec — wire up |
| `tests/unit/` | Missing tests for `user.actions`, `bank.actions`, `transaction.actions`, `recipient.actions` |

### shadcn-studio Demo Blocks (to wire in)

- `components/shadcn-studio/datatable-transaction.tsx` → `TransactionHistoryClient`
- `components/shadcn-studio/chart-sales-metrics.tsx` → `DashboardClient`
- `components/shadcn-studio/statistics-card-01.tsx` → `DashboardClient`

---

## Do Not Re-Touch

These files were fixed in a prior session — leave them alone:

- `lib/dal/base.dal.ts`
- `lib/actions/admin.actions.ts`
- `lib/actions/updateProfile.ts`
- `lib/actions/plaid.actions.ts`
- `app/middleware.ts` (deleted — do not recreate; use `proxy.ts` at root instead)
- `eslint.config.mts`
- `opencode.json` + `.opencode/mcp-runner.ts`

---

## Phase 1 — Bug Fixes

### 1.1 Extract `BankWithDetails` into `types/bank.ts`

- Add `export interface BankWithDetails extends Bank { balances: PlaidBalance[]; transactions: PlaidTransaction[] }` to `types/bank.ts`
- Remove inline `BankWithDetails` interface from `app/(root)/my-banks/page.tsx`
- Remove inline `BankWithDetails` interface from `components/MyBanksClient.tsx`
- Import from `@/types/bank` in both files

### 1.2 Rename `RootLayout` → `AuthLayout` in `app/(auth)/layout.tsx`

- Change `export default function RootLayout` → `export default function AuthLayout`

### 1.3 Fix double auth in `app/(root)/dashboard/page.tsx`

- Remove `getLoggedInUser()` call and its import
- Use `session.user.name` from the existing `auth()` call for the user name displayed

### 1.4 Add `export const metadata` to all pages missing it

Pages to update:

- `app/(auth)/sign-in/page.tsx`
- `app/(auth)/sign-up/page.tsx`
- `app/(root)/dashboard/page.tsx`
- `app/(root)/my-banks/page.tsx`
- `app/(root)/payment-transfer/page.tsx`
- `app/(root)/transaction-history/page.tsx`
- `app/(root)/settings/page.tsx`

---

## Phase 2 — Component Folder Structure

Create the following files (all 8 pages get a server + client component):

```
components/
├── home/
│   ├── HomeServer.tsx       # async server component — data fetching
│   └── HomeClient.tsx       # "use client" — interactive parts
├── sign-in/
│   ├── SignInServer.tsx
│   └── SignInClient.tsx
├── sign-up/
│   ├── SignUpServer.tsx
│   └── SignUpClient.tsx
├── dashboard/
│   ├── DashboardServer.tsx  # move data-fetch logic from page.tsx here
│   └── DashboardClient.tsx  # move from components/DashboardClient.tsx
├── my-banks/
│   ├── MyBanksServer.tsx    # move data-fetch logic from page.tsx here
│   └── MyBanksClient.tsx    # move from components/MyBanksClient.tsx
├── payment-transfer/
│   ├── PaymentTransferServer.tsx
│   └── PaymentTransferClient.tsx
├── transaction-history/
│   ├── TransactionHistoryServer.tsx
│   └── TransactionHistoryClient.tsx
└── settings/
    ├── SettingsServer.tsx
    └── SettingsClient.tsx
```

Each `app/(root)/*/page.tsx` and `app/(auth)/*/page.tsx` becomes a **thin orchestrator** — imports from its component folder, passes data as props, wraps with `<Suspense>`.

---

## Phase 3 — Full Page Implementations

### PaymentTransferClient

- Bank selector (source account — from user's linked banks)
- Recipient selector (from `getRecipients()`)
- Amount input (validated with Zod: positive number, max 100,000)
- Memo / note input (optional)
- Submit → calls `createTransfer()` from `lib/actions/dwolla.actions.ts`
- Success/error toast feedback
- Uses shadcn/ui: `Form`, `Select`, `Input`, `Button`, `Card`

### TransactionHistoryClient

- Wire in `components/shadcn-studio/datatable-transaction.tsx` as the data table
- Date range filter (start date / end date)
- Bank account filter (dropdown)
- Pagination (page size selector)
- Data source: `getTransactionHistory(page, pageSize)` from `lib/actions/transaction.actions.ts`

### SettingsClient

- Profile form: name (editable), email (read-only), bio (textarea)
- Save button → calls `updateProfile()` from `lib/actions/updateProfile.ts`
- Uses React Hook Form + Zod validation
- Success/error feedback

### DashboardClient (enhancement)

- Integrate `components/shadcn-studio/chart-sales-metrics.tsx` for spending chart
- Integrate `components/shadcn-studio/statistics-card-01.tsx` for balance summary cards
- Keep existing PlaidLinkButton and linked banks list

---

## Phase 4 — Route-Level Files

| File | Purpose |
| --- | --- |
| `app/(root)/loading.tsx` | Full-screen loading spinner for protected routes |
| `app/(root)/error.tsx` | `"use client"` error boundary with retry button for protected routes |
| `app/(auth)/loading.tsx` | Centered loading spinner for auth routes |
| `app/not-found.tsx` | Global 404 page |

---

## Phase 5 — Test Suite Overhaul

### Deletions

- Delete `tests/helpers/auth.ts` — confirmed dead code, not imported by any file

### Merges

- Merge the single test in `tests/e2e/auth-flow.spec.ts` into `tests/e2e/auth.spec.ts`
- Delete `tests/e2e/auth-flow.spec.ts` after merge

### New E2E Specs

- `tests/e2e/transaction-history.spec.ts` — filter, pagination, table rendering
- `tests/e2e/settings.spec.ts` — profile form load, edit, save

### New Unit Tests

- `tests/unit/user.actions.test.ts`
- `tests/unit/bank.actions.test.ts`
- `tests/unit/transaction.actions.test.ts`
- `tests/unit/recipient.actions.test.ts`

### Fixture Wiring

- Wire `tests/fixtures/auth.ts` (`authenticatedPage` / `unauthenticatedPage`) into E2E specs that currently call `signInWithSeedUser` manually

---

## Phase 6 — Validation

Run in order — all must pass before done:

```bash
npm run type-check
npm run lint:strict
npm run test
```

---

## Relevant Files

### Pages

- `app/(root)/page.tsx`
- `app/(root)/dashboard/page.tsx`
- `app/(root)/my-banks/page.tsx`
- `app/(root)/payment-transfer/page.tsx`
- `app/(root)/transaction-history/page.tsx`
- `app/(root)/settings/page.tsx`
- `app/(auth)/layout.tsx`
- `app/(auth)/sign-in/page.tsx`
- `app/(auth)/sign-up/page.tsx`

### Components

- `components/DashboardClient.tsx` → moves to `components/dashboard/DashboardClient.tsx`
- `components/MyBanksClient.tsx` → moves to `components/my-banks/MyBanksClient.tsx`
- `components/shadcn-studio/datatable-transaction.tsx`
- `components/shadcn-studio/chart-sales-metrics.tsx`
- `components/shadcn-studio/statistics-card-01.tsx`

### Types

- `types/bank.ts` — add `BankWithDetails` interface

### Actions

- `lib/actions/user.actions.ts`
- `lib/actions/bank.actions.ts`
- `lib/actions/transaction.actions.ts`
- `lib/actions/recipient.actions.ts`
- `lib/actions/dwolla.actions.ts`
- `lib/actions/updateProfile.ts`

### Tests

- `tests/helpers/auth.ts` — DELETE
- `tests/e2e/auth-flow.spec.ts` — MERGE then DELETE
- `tests/e2e/auth.spec.ts`
- `tests/e2e/protected-pages.spec.ts`
- `tests/e2e/payment-transfer.spec.ts`
- `tests/fixtures/auth.ts`
- `tests/e2e/helpers/auth.ts`
