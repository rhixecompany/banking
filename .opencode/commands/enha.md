# Implementation Plan: Frontend UI Refactor & 100% Test Coverage

**Version:** 1.0 | **Date:** 2026-04-05 | **Status:** Approved

---

## Current State Summary

| Area | Current | Status |
| --- | --- | --- |
| **Database Tables** | 10 tables, 4 enums | Complete schema |
| **DAL Files** | 7 files (user, wallet, transaction, recipient, dwolla, admin, index) | Well-structured |
| **Server Actions** | 10 files | Functional but missing `.describe()` on many schemas |
| **Pages** | 17 page files (thin wrappers to ServerWrapper components) | Consistent pattern |
| **Components** | 38 directories (~100+ files) | Mix of shadcn/ui + custom |
| **Unit Tests** | 23 files (many "function exists" smoke tests) | Low behavioral coverage |
| **E2E Tests** | 8 specs (mostly redirect/surface tests) | Missing flow tests |
| **Test Helpers** | Plaid/Dwolla helpers written but never used | Dead code |
| **MSW Mock** | Defined but never imported | Dead code |

---

## Phase 1: Schema & Validation Audit (Zod `.describe()` Compliance)

### 1.1 Fix ESLint-violating schemas (missing `.describe()`)

**Files to update:**

- `actions/register.ts` — Add `.describe()` to all 12 fields
- `actions/updateProfile.ts` — Add `.describe()` to all 10 fields
- `actions/admin.actions.ts` — Add `.describe()` to ToggleAdminSchema and SetActiveSchema
- `actions/wallet.actions.ts` — Add `.describe()` to DisconnectWalletSchema
- `actions/dwolla.actions.ts` — Add `.describe()` to all 4 schemas
- `actions/recipient.actions.ts` — Add `.describe()` to RecipientSchema
- `actions/plaid.actions.ts` — Add `.describe()` to all 8 schemas
- `actions/admin-stats.actions.ts` — Add `.describe()` + replace `any` return types with proper interfaces

### 1.2 Create centralized validation schemas

**New file:** `lib/validations/index.ts` (barrel export)

Extract and centralize schemas that are reused:

- `lib/validations/auth.ts` — signInSchema, signUpSchema
- `lib/validations/profile.ts` — updateProfileSchema
- `lib/validations/transfer.ts` — transferSchema
- `lib/validations/wallet.ts` — disconnectWalletSchema
- `lib/validations/recipient.ts` — recipientSchema
- `lib/validations/admin.ts` — toggleAdminSchema, setActiveSchema, getUsersSchema

### 1.3 Add missing typed interfaces for admin-stats actions

Replace all `any` types in `actions/admin-stats.actions.ts`:

- `AdminStats` interface
- `PaginatedUsers` interface
- `AdminTransaction` interface

---

## Phase 2: Component Audit & shadcn/ui Migration

### 2.1 Audit all 38 component directories

For each component, verify:

- Uses shadcn/ui primitives where applicable (Button, Card, Input, Form, Table, Dialog, etc.)
- Follows shadcn composition rules (FieldGroup/Field, CardHeader/CardContent, etc.)
- No raw `div` with `space-y-*` (use `flex flex-col gap-*`)
- Semantic colors (`bg-background`, `text-muted-foreground`)
- Proper Suspense boundaries for async content

### 2.2 Priority component updates

| Component | Issue | Fix |
| --- | --- | --- |
| `auth-form` | Custom input layout | Migrate to shadcn Form + FieldGroup pattern |
| `custom-input` | Reinvents Input | Replace with shadcn Input + proper wrapper |
| `total-balance-box` | Custom card layout | Use shadcn Card composition |
| `wallet-card` | Custom card | Use shadcn Card + Badge |
| `data-table` | Already uses tanstack table | Verify shadcn Table integration |
| `settings/*` | Profile form | Migrate to shadcn Form + zodResolver |
| `payment-transfer/*` | Transfer form | Migrate to shadcn Form pattern |
| `admin/*` | Admin dashboard | Use shadcn Card + Table + Tabs |
| `dashboard/*` | Dashboard widgets | Use shadcn Card composition |
| `my-wallets/*` | Wallet list | Use shadcn Card + Empty states |

### 2.3 Add missing shadcn components if needed

Check and add any missing shadcn/ui components used by the refactor.

---

## Phase 3: Page Functionality Enhancement

### 3.1 Verify and enhance each ServerWrapper component

| Page | Current State | Needed Enhancements |
| --- | --- | --- |
| `/` (Landing) | HomeServerWrapper | Verify CTA buttons, feature sections, animations |
| `/sign-in` | SignInServerWrapper | Verify OAuth buttons, form validation, error display |
| `/sign-up` | SignUpServerWrapper | Verify all profile fields, validation, success flow |
| `/dashboard` | DashboardServerWrapper | Verify balance aggregation, recent transactions, charts, category breakdown |
| `/my-wallets` | MyWalletsServerWrapper | Verify wallet list, disconnect flow, add bank flow, empty state |
| `/transaction-history` | TransactionHistoryServerWrapper | Verify pagination, filtering, wallet tabs, empty state |
| `/payment-transfer` | PaymentTransferServerWrapper | Verify recipient selection, source wallet dropdown, form validation, transfer flow, success/error states |
| `/settings` | SettingsServerWrapper | Verify profile edit form, password change, validation, success toast |
| `/admin` | AdminDashboardServerWrapper | Verify stats cards, user management table (search, pagination, toggle admin/active), recent transactions |

### 3.2 Create missing Server Actions

| Action | Purpose | File |
| --- | --- | --- |
| `logError` | Centralized error logging to `errors` table | `actions/error.actions.ts` |
| `getAdminDashboardData` | Single call for all admin stats + users + transactions | `actions/admin-stats.actions.ts` (enhance) |
| `getTransactionCategories` | Get spending categories for dashboard chart | `actions/transaction.actions.ts` (enhance) |
| `getDashboardOverview` | Single call for balance + wallet count + recent txns | `actions/transaction.actions.ts` (enhance) |

### 3.3 Create missing DAL methods

| Method | Purpose | File |
| --- | --- | --- |
| `ErrorDal.logError()` | Insert error record | `dal/error.dal.ts` (new) |
| `TransactionDal.getCategories()` | Get spending categories by user | `dal/transaction.dal.ts` (enhance) |
| `TransactionDal.getCount()` | Get total count for pagination | `dal/transaction.dal.ts` (enhance) |
| `WalletDal.getCountByUser()` | Get wallet count for user | `dal/wallet.dal.ts` (enhance) |

---

## Phase 4: Test Infrastructure Improvements

### 4.1 Fix dead test infrastructure

- **MSW Mock Server:** Either integrate into unit tests or remove
- **E2E Plaid helpers:** Integrate `completePlaidFlow()` into wallet-linking.spec.ts
- **E2E Dwolla helpers:** Integrate `completeDwollaTransfer()` into payment-transfer.spec.ts
- **E2E fixtures:** Ensure all page objects are used by specs

### 4.2 Add missing unit tests

| Test File | Coverage | Priority |
| --- | --- | --- |
| `tests/unit/user.dal.test.ts` | findByEmail, findById, create, update, createWithProfile, toggleAdmin, toggleActive, softDelete, hardDelete | HIGH |
| `tests/unit/admin.dal.test.ts` | getStats, getTransactionStatusStats, getTransactionTypeStats, getRecentTransactions, getUsersPaginated | HIGH |
| `tests/unit/dwolla.actions.test.ts` | createTransfer, createFundingSource, createDwollaCustomer, addFundingSource | HIGH |
| `tests/unit/plaid.actions.test.ts` | Happy-path tests with mocked Plaid responses | HIGH |
| `tests/unit/register.test.ts` | Full registration flow (mocked DB) | MEDIUM |
| `tests/unit/updateProfile.test.ts` | Profile update, password change, email change, validation | MEDIUM |
| `tests/unit/admin.actions.test.ts` | toggleAdmin behavior, setActive behavior, auth checks | MEDIUM |
| `tests/unit/user.actions.test.ts` | getLoggedInUser authenticated, logoutAccount behavior | MEDIUM |
| `tests/unit/encryption.test.ts` | encrypt/decrypt round-trip, key validation | MEDIUM |
| `tests/unit/utils.test.ts` | formatAmount, cn, formUrlQuery, encryptId/decryptId | MEDIUM |
| `tests/unit/proxy.test.ts` | Rate limiting, auth redirects, inactive account redirect | MEDIUM |
| `tests/unit/app-config.test.ts` | Zod validation, missing vars, required vs optional | LOW |
| `tests/unit/error.dal.test.ts` | logError, query errors | LOW |

### 4.3 Enhance E2E tests

| Spec File | New Tests |
| --- | --- |
| `auth.spec.ts` | Full sign-in flow, full sign-up flow, OAuth button visibility, logout flow |
| `dashboard.spec.ts` | Balance display, wallet count, recent transactions table, navigation links |
| `my-wallets.spec.ts` | Disconnect wallet flow, empty state, add bank button behavior |
| `transaction-history.spec.ts` | Pagination (next/prev), wallet tab switching, empty state, transaction row content |
| `payment-transfer.spec.ts` | Full transfer flow (select source, select recipient, enter amount, submit), form validation, success message, error message |
| `settings.spec.ts` | Profile update flow, password change flow, validation errors, success toast |
| `admin.spec.ts` | Admin user stats display, user table pagination, user search, toggle admin, toggle active |
| `wallet-linking.spec.ts` | Full Plaid Link flow (using helpers), institution selection, success verification |

---

## Phase 5: Verification & Quality Gates

### 5.1 Run all quality checks

```bash
npm run type-check      # Zero TypeScript errors
npm run lint:strict     # Zero ESLint warnings
npm run test:browser    # All Vitest tests pass
npm run test:ui         # All Playwright tests pass
npm run build           # Production build succeeds
```

### 5.2 Coverage targets

| Area | Target |
| --- | --- |
| Unit test behavioral coverage | All actions and DAL methods tested for happy + sad paths |
| E2E flow coverage | Every user journey tested end-to-end |
| Zod schema compliance | 100% `.describe()` on all schema fields |
| shadcn/ui compliance | All forms use Form/FieldGroup pattern, all cards use Card composition |
| No `any` types | Replace all `any` in admin-stats.actions.ts and DAL files |

---

## Execution Order

1. **Phase 1** (Schemas) — Quick wins, unblocks lint:strict
2. **Phase 2** (Components) — Visual/UX improvements, unblocks E2E tests
3. **Phase 3** (Pages/Actions/DAL) — Functional completeness
4. **Phase 4** (Tests) — Comprehensive coverage
5. **Phase 5** (Verification) — Final quality gates

Each phase should pass `npm run type-check` and `npm run lint:strict` before proceeding to the next.

---

## Risk & Tradeoffs

| Risk | Mitigation |
| --- | --- |
| Large number of files to change | Phase-by-phase approach, each phase independently verifiable |
| E2E tests require running dev server + DB | Use existing global-setup.ts pattern, seed data already exists |
| Plaid/Dwolla sandbox credentials needed for full E2E | Use MSW mocks for unit tests, sandbox mode for E2E |
| shadcn migration may break existing styles | Incremental migration, verify each component visually |
| 100% coverage is ambitious | Focus on behavioral coverage over line-count metrics |

---

## Do Not Re-Touch

These files were intentionally left as-is or fixed in prior sessions:

- `actions/updateProfile.ts` — direct `db` calls acceptable (user decision)
- `proxy.ts` — middleware placement is separate concern
- `eslint.config.mts` — already finalized
- `opencode.json` + `.opencode/mcp-runner.ts` — infrastructure, out of scope

---

## Estimated Scope

~50+ files touched across 5 phases. Each phase is independently testable and commitable.
