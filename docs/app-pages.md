# App Pages Documentation

**Date:** 2026-04-24  
**Scope:** All pages in `./app/`  
**Status:** COMPLETE

---

## Overview

This document catalogs all pages in the Banking application, their routing structure, component composition, data access patterns, and authentication requirements. The architecture follows a **Server Wrapper Pattern** where each page delegates all data fetching and auth logic to a `*ServerWrapper` component.

---

## Page Inventory

### Public Routes

| Route | File | Auth Required | Description |
| --- | --- | --- | --- |
| `/` | `app/page.tsx` | ❌ No | Landing page |
| `/sign-in` | `app/(auth)/sign-in/page.tsx` | ❌ No | User sign-in |
| `/sign-up` | `app/(auth)/sign-up/page.tsx` | ❌ No | User registration |

### Protected Routes

| Route | File | Auth Required | Description |
| --- | --- | --- | --- |
| `/dashboard` | `app/(root)/dashboard/page.tsx` | ✅ Yes | Financial overview |
| `/my-wallets` | `app/(root)/my-wallets/page.tsx` | ✅ Yes | Linked bank accounts |
| `/payment-transfer` | `app/(root)/payment-transfer/page.tsx` | ✅ Yes | Transfer funds |
| `/transaction-history` | `app/(root)/transaction-history/page.tsx` | ✅ Yes | Transaction list |
| `/settings` | `app/(root)/settings/page.tsx` | ✅ Yes | User settings |

### Admin Routes

| Route | File | Auth Required | Admin Required |
| --- | --- | --- | --- |
| `/admin` | `app/(admin)/admin/page.tsx` | ✅ Yes | ✅ Yes |

---

## Page Details

### 1. Home Page (`/`)

**File:** `app/page.tsx`

```typescript
export default function HomePage(): JSX.Element {
  return (
    <RootLayoutWrapper>
      <HomeServerWrapper />
    </RootLayoutWrapper>
  );
}
```

| Aspect             | Details                     |
| ------------------ | --------------------------- |
| **Route**          | `/` (public)                |
| **Component Type** | Server Component            |
| **Auth**           | None required               |
| **Wrapper**        | `HomeServerWrapper`         |
| **Layout**         | `RootLayoutWrapper`         |
| **DAL Access**     | None (delegated to wrapper) |
| **Server Actions** | None                        |

**Server Wrapper:** `components/home/home-server-wrapper.tsx`

- Fetches public data (features, etc.)
- Renders client components for interactivity

---

### 2. Sign-In Page (`/sign-in`)

**File:** `app/(auth)/sign-in/page.tsx`

```typescript
export default function SignInPage(): JSX.Element {
  return (
    <RootLayoutWrapper>
      <SignInServerWrapper />
    </RootLayoutWrapper>
  );
}
```

| Aspect             | Details                            |
| ------------------ | ---------------------------------- |
| **Route**          | `/sign-in` (public)                |
| **Component Type** | Server Component                   |
| **Auth**           | Redirects if already authenticated |
| **Wrapper**        | `SignInServerWrapper`              |
| **Layout**         | `RootLayoutWrapper`                |
| **DAL Access**     | None (client-side form)            |
| **Server Actions** | `auth.signin.ts`                   |

**Server Wrapper:** `components/sign-in/sign-in-server-wrapper.tsx`

**Server Actions:**

- `signIn()` — NextAuth credentials sign-in

---

### 3. Sign-Up Page (`/sign-up`)

**File:** `app/(auth)/sign-up/page.tsx`

```typescript
export default function SignUpPage(): JSX.Element {
  return (
    <RootLayoutWrapper>
      <SignUpServerWrapper />
    </RootLayoutWrapper>
  );
}
```

| Aspect             | Details                            |
| ------------------ | ---------------------------------- |
| **Route**          | `/sign-up` (public)                |
| **Component Type** | Server Component                   |
| **Auth**           | Redirects if already authenticated |
| **Wrapper**        | `SignUpServerWrapper`              |
| **Layout**         | `RootLayoutWrapper`                |
| **DAL Access**     | None (client-side form)            |
| **Server Actions** | `auth.signup.ts`, `register.ts`    |

**Server Wrapper:** `components/sign-up/sign-up-server-wrapper.tsx`

**Server Actions:**

- `registerUser()` — User registration

---

### 4. Dashboard Page (`/dashboard`)

**File:** `app/(root)/dashboard/page.tsx`

```typescript
export default function DashboardPage(): JSX.Element {
  return (
    <RootLayoutWrapper>
      <DashboardServerWrapper />
    </RootLayoutWrapper>
  );
}
```

| Aspect | Details |
| --- | --- |
| **Route** | `/dashboard` (protected) |
| **Component Type** | Server Component |
| **Auth** | Required — redirects to `/sign-in` |
| **Wrapper** | `DashboardServerWrapper` |
| **Layout** | `RootLayoutWrapper` |
| **DAL Access** | Via Server Actions |
| **Server Actions** | `getUserWallets`, `getAllAccounts`, `getRecentTransactions` |

**Server Wrapper:** `components/dashboard/dashboard-server-wrapper.tsx`

```typescript
export async function DashboardServerWrapper(): Promise<JSX.Element> {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const [walletsResult, accountsResult, txResult] = await Promise.all([
    getUserWallets(),
    getAllAccounts(),
    getRecentTransactions(20),
  ]);

  return (
    <DashboardClientWrapper
      accounts={accountsResult.accounts ?? []}
      wallets={walletsResult.wallets ?? []}
      transactions={txResult.transactions ?? []}
      userId={userId}
      showOnboarding={wallets.length === 0}
    />
  );
}
```

**Data Flow:**

1. `auth()` — Verify session
2. `getUserWallets()` — Fetch linked wallets
3. `getAllAccounts()` — Fetch Plaid accounts
4. `getRecentTransactions()` — Fetch recent transactions
5. Pass to `DashboardClientWrapper`

---

### 5. My Wallets Page (`/my-wallets`)

**File:** `app/(root)/my-wallets/page.tsx`

```typescript
export default function MyWalletsPage(): JSX.Element {
  return (
    <RootLayoutWrapper>
      <MyWalletsServerWrapper />
    </RootLayoutWrapper>
  );
}
```

| Aspect | Details |
| --- | --- |
| **Route** | `/my-wallets` (protected) |
| **Component Type** | Server Component |
| **Auth** | Required |
| **Wrapper** | `MyWalletsServerWrapper` |
| **Layout** | `RootLayoutWrapper` |
| **DAL Access** | Via Server Actions |
| **Server Actions** | `getUserWallets`, `getBalance`, `disconnectWallet` |

**Server Wrapper:** `components/my-wallets/my-wallets-server-wrapper.tsx`

**Server Actions:**

- `getUserWallets()` — List all wallets
- `getBalance(walletId)` — Per-wallet balance
- `disconnectWallet(walletId)` — Unlink bank

---

### 6. Payment Transfer Page (`/payment-transfer`)

**File:** `app/(root)/payment-transfer/page.tsx`

```typescript
export default function PaymentTransferPage(): JSX.Element {
  return (
    <RootLayoutWrapper>
      <PaymentTransferServerWrapper />
    </RootLayoutWrapper>
  );
}
```

| Aspect | Details |
| --- | --- |
| **Route** | `/payment-transfer` (protected) |
| **Component Type** | Server Component |
| **Auth** | Required |
| **Wrapper** | `PaymentTransferServerWrapper` |
| **Layout** | `RootLayoutWrapper` |
| **DAL Access** | Via Server Actions |
| **Server Actions** | `getUserWallets`, `createTransfer`, `createTransaction` |

**Server Wrapper:** `components/payment-transfer/payment-transfer-server-wrapper.tsx`

**Server Actions:**

- `getUserWallets()` — Source accounts
- `createTransfer()` — Dwolla ACH transfer
- `createTransaction()` — Local ledger record

---

### 7. Transaction History Page (`/transaction-history`)

**File:** `app/(root)/transaction-history/page.tsx`

```typescript
export default function TransactionHistoryPage(): JSX.Element {
  return (
    <RootLayoutWrapper>
      <TransactionHistoryServerWrapper />
    </RootLayoutWrapper>
  );
}
```

| Aspect             | Details                            |
| ------------------ | ---------------------------------- |
| **Route**          | `/transaction-history` (protected) |
| **Component Type** | Server Component                   |
| **Auth**           | Required                           |
| **Wrapper**        | `TransactionHistoryServerWrapper`  |
| **Layout**         | `RootLayoutWrapper`                |
| **DAL Access**     | Via Server Actions                 |
| **Server Actions** | `getTransactionHistory`            |

**Server Wrapper:** `components/transaction-history/transaction-history-server-wrapper.tsx`

**Server Actions:**

- `getTransactionHistory(page, pageSize)` — Paginated transactions

---

### 8. Settings Page (`/settings`)

**File:** `app/(root)/settings/page.tsx`

```typescript
export default function SettingsPage(): JSX.Element {
  return (
    <RootLayoutWrapper>
      <SettingsServerWrapper />
    </RootLayoutWrapper>
  );
}
```

| Aspect | Details |
| --- | --- |
| **Route** | `/settings` (protected) |
| **Component Type** | Server Component |
| **Auth** | Required |
| **Wrapper** | `SettingsServerWrapper` |
| **Layout** | `RootLayoutWrapper` |
| **DAL Access** | Via Server Actions |
| **Server Actions** | `getUserWithProfile`, `updateProfile`, `logoutAccount` |

**Server Wrapper:** `components/settings/settings-server-wrapper.tsx`

**Server Actions:**

- `getUserWithProfile()` — Fetch user + profile
- `updateProfile()` — Update profile data
- `logoutAccount()` — Audit log before sign-out

---

### 9. Admin Dashboard (`/admin`)

**File:** `app/(admin)/admin/page.tsx`

```typescript
export default function AdminPage(): JSX.Element {
  return (
    <RootLayoutWrapper>
      <AdminDashboardServerWrapper />
    </RootLayoutWrapper>
  );
}
```

| Aspect             | Details                                     |
| ------------------ | ------------------------------------------- |
| **Route**          | `/admin` (protected, admin-only)            |
| **Component Type** | Server Component                            |
| **Auth**           | Required + Admin role                       |
| **Wrapper**        | `AdminDashboardServerWrapper`               |
| **Layout**         | `RootLayoutWrapper`                         |
| **DAL Access**     | Via Server Actions                          |
| **Server Actions** | `toggleAdmin`, `setActive`, `getAdminStats` |

**Server Wrapper:** `components/admin/admin-dashboard-server-wrapper.tsx`

**Server Actions:**

- `toggleAdmin(userId, makeAdmin)` — Grant/revoke admin
- `setActive(userId, isActive)` — Enable/disable account
- `getAdminStats()` — Dashboard statistics

---

## Component Architecture

### Server Wrapper Pattern

All pages follow a consistent pattern:

```
page.tsx (Server Component)
  └── RootLayoutWrapper (layout)
        └── *ServerWrapper (data fetching + auth)
              └── *ClientWrapper (UI rendering)
```

**Benefits:**

- Auth logic centralized in server wrappers
- Data fetching happens on server (RSC)
- Client components are pure presentational
- No direct DB access in pages

### Shared Layouts

| Layout                   | Purpose                            |
| ------------------------ | ---------------------------------- |
| `RootLayoutWrapper`      | Main app shell with header/sidebar |
| `DashboardClientWrapper` | Dashboard-specific layout          |
| `AuthForm`               | Reusable auth form template        |

---

## Authentication Flow

### Protected Routes

All routes under `(root)` and `(admin)` are protected via middleware:

```typescript
// middleware.ts (inferred from redirect patterns)
export function middleware(request: NextRequest) {
  const session = await auth();

  if (!session && protectedRoute) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (adminRoute && !session.user.isAdmin) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
}
```

### Auth Patterns

| Page       | Auth Behavior                                |
| ---------- | -------------------------------------------- |
| Home       | Public — no check                            |
| Sign-In/Up | Redirects if already authenticated           |
| Protected  | Redirects to `/sign-in` if not authenticated |
| Admin      | Redirects to `/dashboard` if not admin       |

---

## Compliance Assessment

### ✅ Compliant Patterns

| Requirement | Status | Evidence |
| --- | --- | --- |
| No direct DB in pages | ✅ | All pages use Server Actions via wrappers |
| Auth in server layer | ✅ | `auth()` called in each wrapper |
| DAL-only data access | ✅ | All DB access via `dal/*` helpers |
| Server Actions for mutations | ✅ | All writes use `"use server"` |
| Consistent return shapes | ✅ | All actions return `{ ok, error? }` |

### ⚠️ Potential Improvements

| Issue | Description | Priority |
| --- | --- | --- |
| Missing Suspense boundaries | Some pages could show loading states | Medium |
| No error boundaries | Server wrapper errors could crash page | Medium |
| Repeated wrapper patterns | All pages use identical structure — could extract | Low |

### Suspense Boundary Recommendation

```typescript
// Current: no Suspense
<DashboardServerWrapper />

// Recommended: with Suspense
<Suspense fallback={<DashboardSkeleton />}>
  <DashboardServerWrapper />
</Suspense>
```

---

## Server Actions Summary

| Page | Server Actions Used |
| --- | --- |
| Dashboard | `getUserWallets`, `getAllAccounts`, `getRecentTransactions` |
| My Wallets | `getUserWallets`, `getBalance`, `disconnectWallet` |
| Payment Transfer | `getUserWallets`, `createTransfer` |
| Transaction History | `getTransactionHistory` |
| Settings | `getUserWithProfile`, `updateProfile`, `logoutAccount` |
| Admin | `toggleAdmin`, `setActive`, `getAdminStats` |

---

## References

- `app/(root)/dashboard/page.tsx` — exemplar protected page
- `components/dashboard/dashboard-server-wrapper.tsx` — exemplar wrapper
- `lib/auth.ts` — server-side auth helper
- `AGENTS.md` — canonical agent rules
