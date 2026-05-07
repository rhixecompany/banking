# App Pages Inventory

> Phase 2 Route Analysis — Codebase Overhaul v2
> Generated: 2026-05-07

## Overview

| Metric | Count |
| --- | --- |
| Total pages | 16 |
| Route groups | 5 |
| Protected routes | 10 |
| Public routes | 6 |

---

## Route Group Analysis

### 1. (auth) Group — Public Authentication Pages

| Route | Page File | Auth | Violations |
| --- | --- | --- | --- |
| `/sign-in` | `src/app/(auth)/sign-in/page.tsx` | Public | None |
| `/sign-up` | `src/app/(auth)/sign-up/page.tsx` | Public | None |

#### Layout: `(auth)/layout.tsx`

```typescript
// Server wrapper: RootLayoutWrapper (no auth gating)
// Provides: Auth image sidebar, RootProviders
// Auth handled per-page via AuthPageWrapper (client-side redirect if logged in)
```

#### Page Pattern

```typescript
export default function SignInPage(): JSX.Element {
  return (
    <AuthLayoutWrapper>
      <Suspense fallback={<LoadingSpinner />}>
        <SignInServerWrapper />
      </Suspense>
    </AuthLayoutWrapper>
  );
}
```

#### Server Actions Used

- **Auth form submissions**: Via NextAuth API (`/api/auth/local-validate`)
- **No direct Server Actions** in pages

#### Custom Components

- `AuthLayoutWrapper` — Auth page container with image sidebar
- `SignInServerWrapper` — Server component with auth logic
- `SignUpServerWrapper` — Server component with registration logic
- `LoadingSpinner` — Fallback UI

---

### 2. (admin) Group — Protected Admin Dashboard

| Route | Page File | Auth | Violations |
| --- | --- | --- | --- |
| `/admin` | `src/app/(admin)/admin/page.tsx` | Protected + Admin | None |

#### Layout: `(admin)/layout.tsx`

```typescript
// Server wrapper: AdminLayoutWrapper (auth + isAdmin check)
// Provides: AdminSidebar, header with breadcrumbs, footer, language/profile dropdowns
// Auth gating: Explicit isAdmin check in layout
```

#### Auth Pattern

```typescript
// In AdminLayoutWrapper: auth() check + isAdmin guard
const session = await auth();
if (!session?.user?.id || !session.user.isAdmin) {
  redirect("/dashboard");
}
```

#### Page Pattern

```typescript
export default function AdminPage(): JSX.Element {
  return (
    <Suspense fallback={<AdminLoadingFallback />}>
      <AdminDashboardServerWrapper />
    </Suspense>
  );
}
```

#### Server Actions Used

- `getAdminStats()` — User count, wallet count, transaction totals
- `getRecentTransactions({ limit: 5 })` — Latest transactions
- `getTransactionStatusStats({})` — Pending/completed/failed counts
- `getTransactionTypeStats({})` — Credit/debit breakdown
- **Source**: `@/actions/admin-stats.actions`

#### DAL Usage

- **Admin actions use direct DB** (admin-dal.ts pattern expected per AGENTS.md)
- **FIX NEEDED**: Verify admin actions use DAL, not direct `db.select()`

#### Custom Components

- `AdminLayoutWrapper` — Layout with auth/isAdmin check
- `AdminSidebar` — Admin navigation
- `AdminDashboardServerWrapper` — Data fetching wrapper
- `AdminDashboardContent` — Client display component
- `LanguageDropdown`, `ProfileDropdown` — Header components
- Loading skeletons for Suspense fallback

---

### 3. (root) Group — Protected Banking Pages

| Route | Page File | Auth | Violations |
| --- | --- | --- | --- |
| `/dashboard` | `src/app/(root)/dashboard/page.tsx` | Protected | None |
| `/my-wallets` | `src/app/(root)/my-wallets/page.tsx` | Protected | None |
| `/transaction-history` | `src/app/(root)/transaction-history/page.tsx` | Protected | None |
| `/payment-transfer` | `src/app/(root)/payment-transfer/page.tsx` | Protected | None |
| `/settings` | `src/app/(root)/settings/page.tsx` | Protected | None |

#### Layout: `(root)/layout.tsx`

```typescript
// Server wrapper: RootLayoutWrapper + ProtectedLayoutContent
// Provides: Sidebar, MobileNav, PlaidProvider, auth check
// Auth gating: getUserWithProfile() in ProtectedLayoutContent
```

#### Auth Pattern

```typescript
// In ProtectedLayoutContent:
const { ok, user } = await getUserWithProfile();
if (!ok || !user) {
  redirect("/sign-in");
}
```

#### Common Page Pattern

```typescript
// All (root) pages follow identical pattern:
export default function DashboardPage(): JSX.Element {
  return (
    <RootLayoutWrapper>
      <Suspense fallback={<LoadingSpinner />}>
        <DashboardServerWrapper />
      </Suspense>
    </RootLayoutWrapper>
  );
}
```

#### Server Actions by Route

| Route | Actions Used | Source |
| --- | --- | --- |
| `/dashboard` | `getUserWallets()`, `getAllAccounts()`, `getRecentTransactions(20)` | `plaid.actions`, `wallet.actions`, `transaction.actions` |
| `/my-wallets` | `getUserWallets()`, `getAllAccounts()` | `wallet.actions`, `plaid.actions` |
| `/transaction-history` | `getUserTransactions()`, pagination/filter helpers | `transaction.actions` |
| `/payment-transfer` | `createTransfer()`, `createTransaction()`, `getBank()`, `getBankByAccountId()` | `dwolla.actions`, `transaction.actions`, `user.actions` |
| `/settings` | `updateUserProfile()`, `getUserWithProfile()` | `user.actions` |

#### Plaid/Dwolla Actions

- `createLinkToken()` — Create Plaid Link token (passed to PlaidProvider)
- `exchangePublicToken()` — Exchange public token for access token
- `getAllAccounts()` — Fetch all linked bank accounts
- `getBank()`, `getBanks()` — Fetch bank details
- `createTransfer()` — Initiate Dwolla ACH transfer

#### Custom Components (All Routes)

- `RootLayoutWrapper` — Root providers (TooltipProvider, Toaster)
- `PlaidProvider` — Context provider for bank linking (userId, createLinkToken, exchangePublicToken)
- `Sidebar` — Desktop navigation
- `MobileNav` — Mobile navigation
- Loading spinner as Suspense fallback

---

### 4. Root (`app/`) — Landing Page

| Route | Page File | Auth | Violations |
| --- | --- | --- | --- |
| `/` | `src/app/page.tsx` | **Public (static)** | **NONE — Confirmed** |

#### **CRITICAL: Static Page Verification**

```typescript
// ✅ COMPLIANT: No Suspense, no auth, no DB, no process.env
export default function HomePage(): JSX.Element {
  return (
    <div className="flex min-h-screen flex-col">
      <main>...static content...</main>
      <HomeFooter />
    </div>
  );
}
```

**Violations Found**: NONE

**Verification**:
- ❌ No `auth()` or `getUserWithProfile()` calls
- ❌ No DB imports (`@/database/db`)
- ❌ No `process.env` or `@/app-config` access
- ❌ No Suspense boundaries
- ❌ No Server Actions

#### Components Used (All UI-only)

- `HeroSection` — Main hero (demo component)
- `FeaturesGrid` — Feature list
- `CtaGetStarted` — Call-to-action
- `TotalBalanceLayout` — Sample account display (static mock data)
- `HomeFooter` — Footer
- `Container`, UI components from `components/ui/`

---

### 5. Demo (`app/demo/`) — Demo/Showcase Pages

| Route | Page File | Auth |
| --- | --- | --- |
| `/demo/dashboard-shell-01` | `src/app/demo/dashboard-shell-01/...` | Public |
| `/demo/hero-section-41` | `src/app/demo/hero-section-41/...` | Public |
| `/demo/onboarding-feed-01` | `src/app/demo/onboarding-feed-01/...` | Public |
| `/demo/application-shell-01` | `src/app/demo/application-shell-01/page.tsx` | Public |

#### Characteristics

- All **public** (no auth required)
- No **DAL** usage (static demo content)
- No **Server Actions**
- Use shadcn/ui studio components for demos

---

## Summary: Server Action Usage by Group

| Group | Actions | Violations |
| --- | --- | --- |
| `(auth)` | NextAuth API only | None |
| `(admin)` | `admin-stats.actions.ts` | **Check DAL usage** |
| `(root)` | `plaid.actions`, `wallet.actions`, `transaction.actions`, `dwolla.actions`, `user.actions` | None |
| `app/page.tsx` | None | **NONE — Static** |
| `app/demo/` | None | None |

---

## Violations Checklist

| Route Group | process.env Direct | DB Direct Import | Missing Auth | Notes |
| --- | --- | --- | --- | --- |
| `(auth)` | ✅ None | ✅ None | ✅ N/A | Public |
| `(admin)` | ✅ None | ⚠️ Check admin actions | ✅ Layout + wrapper | Verify DAL in Phase 3 |
| `(root)` | ✅ None | ✅ Server Actions use DAL | ✅ Layout + wrapper | Compliant |
| `/` | ✅ None | ✅ None | ✅ N/A | **Static** |
| `demo/` | ✅ None | ✅ None | ✅ N/A | Demo only |

---

## Phase 3 Recommendations

1. **Verify admin actions use DAL** — Audit `admin-stats.actions.ts` for direct DB access
2. **Standardize wrapper pattern** — All protected routes follow identical pattern (RootLayoutWrapper + Suspense + ServerWrapper)
3. **Landing page** — Remains static, no changes needed

---

## Server Actions by File

| Action File | Routes Using |
| --- | --- |
| `actions/plaid.actions.ts` | dashboard, my-wallets |
| `actions/wallet.actions.ts` | dashboard, my-wallets |
| `actions/transaction.actions.ts` | dashboard, transaction-history, payment-transfer |
| `actions/dwolla.actions.ts` | payment-transfer |
| `actions/user.actions.ts` | settings, payment-transfer |
| `actions/admin-stats.actions.ts` | admin |
| `actions/register.ts` | sign-up (via form) |
| `actions/auth.ts` | sign-in (via NextAuth) |

---

## Custom Components by Route Group

| Group | Layout Wrapper | Server Wrapper | Client Components |
| --- | --- | --- | --- |
| `(auth)` | AuthLayoutWrapper | SignInServerWrapper, SignUpServerWrapper | AuthForm |
| `(admin)` | AdminLayoutWrapper | AdminDashboardServerWrapper | AdminDashboardContent, AdminSidebar |
| `(root)` | RootLayoutWrapper + ProtectedLayoutContent | DashboardServerWrapper, MyWalletsServerWrapper, etc. | Sidebar, MobileNav, PlaidProvider |
| `/` | None | None | HeroSection, FeaturesGrid, HomeFooter |
| `demo/` | None | None | shadcn/studio components |

---

## Auth Guard Locations

| Route | Guard Location | Method |
| --- | --- | --- |
| `/sign-in`, `/sign-up` | Client | AuthPageWrapper (redirect if logged in) |
| `/admin` | Layout + ServerWrapper | AdminLayoutWrapper + isAdmin check |
| `/dashboard` | Layout | ProtectedLayoutContent (getUserWithProfile) |
| `/my-wallets` | Layout | Same as dashboard |
| `/transaction-history` | Layout | Same as dashboard |
| `/payment-transfer` | Layout | Same as dashboard |
| `/settings` | Layout | Same as dashboard |
| `/` | None | Public |
| `/demo/*` | None | Public |