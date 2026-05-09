# Route Analysis Methodology

## Purpose
Analyze Next.js App Router structure for codebase-overhaul Phase 2. Document for each route: path, server wrapper, auth requirement, DAL usage, Server Actions.

## Constraints
- Must NOT modify any code
- Must NOT run typecheck/lint/tests
- `app/page.tsx` must remain public/static (no auth/DB/env)
- Never import DB in app/; use DAL helpers
- Use app-config.ts for env access

## Analysis Approach

### 1. Route Group Discovery
Glob `src/app/**/*.tsx` to find all pages. Count: 16 pages, 4 layouts.

### 2. Group-by-Group Analysis

#### (auth) Group
- `layout.tsx` → `RootLayoutWrapper` (no auth gating)
- `sign-in/page.tsx` → `AuthLayoutWrapper` + `SignInServerWrapper`
- `sign-up/page.tsx` → `AuthLayoutWrapper` + `SignUpServerWrapper`

#### (admin) Group
- `layout.tsx` → `AdminLayoutWrapper` (auth + admin gating)
- `admin/page.tsx` → `AdminPageContent` with admin components

#### (root) Group
- `layout.tsx` → `getUserWithProfile()` auth check, `PlaidProvider`
- `dashboard/page.tsx` → `DashboardServerWrapper`
- `my-wallets/page.tsx` → `MyWalletsServerWrapper`
- `transaction-history/page.tsx` → `TransactionHistoryServerWrapper`
- `payment-transfer/page.tsx` → `PaymentTransferServerWrapper`
- `settings/page.tsx` → `SettingsServerWrapper`

### 3. Server Wrapper Pattern
All protected routes use ServerWrapper pattern:
- Handles auth/data fetching in one place
- Returns auth'd user + data to page component
- Clean separation of concerns

### 4. Auth in Layouts
- (root) auth handled in layout via `getUserWithProfile()` + redirect
- Auth + admin gating in (admin) layout via `AdminLayoutWrapper`

### 5. DAL Usage Identification
Examine ServerWrapper components to find:
- `userDal` - user CRUD
- `walletDal` - wallet operations
- `transactionDal` - transaction operations

### 6. Server Actions Identification
Examine ServerWrapper + page components for invoked actions.

## Demo Pages
- `app/demo/dashboard-shell-01/page.tsx`
- `app/demo/hero-section-41/page.tsx`
- `app/demo/onboarding-feed-01/page.tsx`
- `app/demo/application-shell-01/page.tsx`

## Verification Checklist
- [ ] Landing page (`app/page.tsx`) uses only static content
- [ ] No DB imports in app/ folder
- [ ] All env access via app-config.ts
- [ ] Auth properly gated on protected routes