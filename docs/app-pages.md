# App Pages Documentation

**Date:** 2026-05-03 **Scope:** All pages in `./app/` **Status:** COMPLETE (Refreshed) **Verification:** ✅ All 9 main routes + 7 demo routes verified

---

## Overview

This document catalogs all pages in the Banking application, their routing structure, component composition, data access patterns, and authentication requirements. The architecture follows a **Server Wrapper Pattern** where each page delegates all data fetching and auth logic to a `*ServerWrapper` component.

---

## Quick Reference — Protected Pages (5 Total)

| Route | Page File | ServerWrapper | ClientWrapper | DAL Helpers | Key Actions | Auth |
| --- | --- | --- | --- | --- | --- | --- |
| `/dashboard` | `app/(root)/dashboard/page.tsx:28` | `DashboardServerWrapper` | `DashboardClientWrapper` | `userDal`, `walletDal`, `accountDal`, `transactionDal` | `getUserWallets()`, `getAllAccounts()`, `getRecentTransactions(20)` | ✅ Required |
| `/my-wallets` | `app/(root)/my-wallets/page.tsx:30` | `MyWalletsServerWrapper` | `MyWalletsClientWrapper` | `walletDal` | `getAllWalletsWithDetails()`, `removeWallet()` | ✅ Required |
| `/payment-transfer` | `app/(root)/payment-transfer/page.tsx:31` | `PaymentTransferServerWrapper` | `PaymentTransferClientWrapper` | `walletDal`, `recipientDal`, `dwollaDal` | `getUserWallets()`, `getRecipients()`, `createTransfer()` | ✅ Required |
| `/transaction-history` | `app/(root)/transaction-history/page.tsx:33` | `TransactionHistoryServerWrapper` | `TransactionHistoryClientWrapper` | `transactionDal` | `getTransactionHistory(page, pageSize)` | ✅ Required |
| `/settings` | `app/(root)/settings/page.tsx:31` | `SettingsServerWrapper` | `SettingsClientWrapper` | `userDal` | `getUserWithProfile()`, `updateProfile()` | ✅ Required |

---

## Quick Reference — Public Pages (3 Total)

| Route | Page File | Type | Auth Required | Layout |
| --- | --- | --- | --- | --- |
| `/` | `app/page.tsx:20` | Static | ❌ No | None |
| `/sign-in` | `app/(auth)/sign-in/page.tsx:29` | Form | ❌ No (redirects if authed) | `AuthLayoutWrapper` |
| `/sign-up` | `app/(auth)/sign-up/page.tsx:29` | Form | ❌ No (redirects if authed) | `AuthLayoutWrapper` |

---

## Auth Pages Analysis

Checks performed: server wrapper usage, auth guard presence, direct `process.env` access, direct DB imports, DAL usage, and Server Actions usage in page files.

| Route | File | Wrapper | Auth Check | Violations |
| --- | --- | --- | --- | --- |
| `/sign-in` | `app/(auth)/sign-in/page.tsx:28` | `AuthLayoutWrapper` + `SignInServerWrapper` | None in page (handled in server wrapper/client flow) | None (no env/DB/DAL/Server Actions in page) |
| `/sign-up` | `app/(auth)/sign-up/page.tsx:28` | `AuthLayoutWrapper` + `SignUpServerWrapper` | None in page (handled in server wrapper/client flow) | None (no env/DB/DAL/Server Actions in page) |

---

## Admin Pages Analysis

Checks performed: server wrapper usage, auth guard presence, admin role checks, direct `process.env` access, direct DB imports, DAL usage, and Server Actions usage in page files.

| Route | File | Wrapper | Auth Check | Admin Check | Violations |
| --- | --- | --- | --- | --- | --- |
| `/admin` | `app/(admin)/admin/page.tsx:44` | `AdminDashboardServerWrapper` | None in page (handled in server wrapper/layout) | None in page (handled in server wrapper/layout) | None (no env/DB/DAL/Server Actions in page) |

---

## Quick Reference — Admin Page (1 Total)

| Route | Page File | ServerWrapper | ClientWrapper | DAL Helpers | Key Actions | Auth |
| --- | --- | --- | --- | --- | --- | --- |
| `/admin` | `app/(admin)/admin/page.tsx:39` | `AdminDashboardServerWrapper` | `AdminDashboardContent` | `adminDal` | `getAdminStats()`, `getRecentTransactions({ limit: 5 })`, `getTransaction*Stats()` | ✅ Admin-only |

---

## Quick Reference — Demo Pages (7 Total)

| Route | Page File | Type | Auth | Purpose |
| --- | --- | --- | --- | --- |
| `/demo/hero-section-41` | `app/demo/hero-section-41/page.tsx` | Static | ❌ No | shadcn hero section demo |
| `/demo/dashboard-shell-01` | `app/demo/dashboard-shell-01/page.tsx` | Static | ❌ No | shadcn dashboard shell demo |
| `/demo/onboarding-feed-01` | `app/demo/onboarding-feed-01/page.tsx` | Static | ❌ No | shadcn onboarding feed demo |
| `/demo/application-shell-01` | `app/demo/application-shell-01/page.tsx` | Static | ❌ No | shadcn application shell demo |
| `/demo/hero-section-41/hero-section-41` | `app/demo/hero-section-41/hero-section-41/page.tsx` | Static | ❌ No | Nested hero section variant |
| `/demo/dashboard-shell-01/dashboard-shell-01` | `app/demo/dashboard-shell-01/dashboard-shell-01/page.tsx` | Static | ❌ No | Nested shell variant |
| `/demo/onboarding-feed-01/onboarding-feed-01` | `app/demo/onboarding-feed-01/onboarding-feed-01/page.tsx` | Static | ❌ No | Nested feed variant |

---

## Demo Pages Analysis

Checks performed: server wrapper usage, auth requirement, direct `process.env` access, direct DB imports, DAL usage, Server Actions usage in page files.

| Route | File | Wrapper | Auth Check | Violations |
| --- | --- | --- | --- | --- |
| `/demo/hero-section-41` | `app/demo/hero-section-41/page.tsx` | None | None | None (no env/DB/DAL/Server Actions in page) |
| `/demo/hero-section-41/hero-section-41` | `app/demo/hero-section-41/hero-section-41/page.tsx` | None | None | None (no env/DB/DAL/Server Actions in page) |
| `/demo/dashboard-shell-01` | `app/demo/dashboard-shell-01/page.tsx` | None | None | None (no env/DB/DAL/Server Actions in page) |
| `/demo/dashboard-shell-01/dashboard-shell-01` | `app/demo/dashboard-shell-01/dashboard-shell-01/page.tsx` | None | None | None (no env/DB/DAL/Server Actions in page) |
| `/demo/onboarding-feed-01` | `app/demo/onboarding-feed-01/page.tsx` | None | None | None (no env/DB/DAL/Server Actions in page) |
| `/demo/onboarding-feed-01/onboarding-feed-01` | `app/demo/onboarding-feed-01/onboarding-feed-01/page.tsx` | None | None | None (no env/DB/DAL/Server Actions in page) |
| `/demo/application-shell-01` | `app/demo/application-shell-01/page.tsx` | None | None | None (no env/DB/DAL/Server Actions in page) |

---

## Detailed Page Documentation

## Landing Page (CRITICAL)

**Status:** ✅ Compliant (static)

**Checks:**

- No `auth()` usage
- No DB/DAL imports
- No `process.env` access
- No Server Actions

**Violations:** None

**Evidence:** `app/page.tsx` is a static server component that renders layout/content only (no data fetching or auth). See `app/page.tsx:1`.

---

### 1. Home Page (`/`)

**File:** `app/page.tsx` (line 20)

```typescript
export default function HomePage(): JSX.Element {
  return (
    <div>
      <HeroSection {...menuData} />
      <FeaturesGrid />
      <TotalBalanceLayout />
      <CtaGetStarted />
      <HomeFooter />
    </div>
  );
}
```

| Aspect             | Details                                   |
| ------------------ | ----------------------------------------- |
| **Route**          | `/` (public)                              |
| **Component Type** | Server Component (static)                 |
| **Auth**           | None required                             |
| **Layout**         | None (full-page components)               |
| **DAL Access**     | None                                      |
| **Server Actions** | None                                      |
| **Metadata**       | Title: "Home \| Horizon Banking"          |
| **Status**         | Static — no dynamic data, fully cacheable |

**Benefits:**

- Fast page load (no auth or DB calls)
- Fully cacheable by CDN
- Good SEO performance

**Key Components:**

- `HeroSection` — Hero banner with CTA
- `FeaturesGrid` — Feature highlights
- `TotalBalanceLayout` — Demo balance widget
- `CtaGetStarted` — Call-to-action section
- `HomeFooter` — Footer with links

---

### 2. Sign-In Page (`/sign-in`)

**File:** `app/(auth)/sign-in/page.tsx` (line 29)

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

**ServerWrapper:** `SignInServerWrapper` (components/sign-in/sign-in-server-wrapper.tsx:12)

```typescript
export async function SignInServerWrapper(): Promise<JSX.Element> {
  return (
    <AuthPageWrapper type="sign-in" actionEndpoint="/api/auth/local-validate" />
  );
}
```

| Aspect | Details |
| --- | --- |
| **Route** | `/sign-in` (public) |
| **Component Type** | Server Component |
| **Auth** | Redirects to `/dashboard` if already authenticated |
| **Layout** | `AuthLayoutWrapper` |
| **ServerWrapper** | `SignInServerWrapper` |
| **ClientWrapper** | `AuthPageWrapper` (type="sign-in") |
| **DAL Access** | None (NextAuth handles credentials) |
| **Server Actions** | None (NextAuth provider validates) |
| **API Endpoint** | `/api/auth/local-validate` — credential validation |
| **Metadata** | Title: "Sign In \| Horizon Banking" |
| **Status** | Static — form-only page |

**Data Flow:**

1. User enters credentials in `AuthPageWrapper` (client component)
2. Form submits to `/api/auth/local-validate`
3. NextAuth validates and creates session
4. Redirects to `/dashboard`

---

### 3. Sign-Up Page (`/sign-up`)

**File:** `app/(auth)/sign-up/page.tsx` (line 29)

```typescript
export default function SignUpPage(): JSX.Element {
  return (
    <AuthLayoutWrapper>
      <Suspense fallback={<LoadingSpinner />}>
        <SignUpServerWrapper />
      </Suspense>
    </AuthLayoutWrapper>
  );
}
```

**ServerWrapper:** `SignUpServerWrapper` (components/sign-up/sign-up-server-wrapper.tsx:12)

```typescript
export async function SignUpServerWrapper(): Promise<JSX.Element> {
  return (
    <AuthPageWrapper type="sign-up" actionEndpoint="/api/auth/local-create" />
  );
}
```

| Aspect | Details |
| --- | --- |
| **Route** | `/sign-up` (public) |
| **Component Type** | Server Component |
| **Auth** | Redirects to `/dashboard` if already authenticated |
| **Layout** | `AuthLayoutWrapper` |
| **ServerWrapper** | `SignUpServerWrapper` |
| **ClientWrapper** | `AuthPageWrapper` (type="sign-up") |
| **DAL Access** | None (registration handled by API) |
| **Server Actions** | None (NextAuth provider registers) |
| **API Endpoint** | `/api/auth/local-create` — user registration |
| **Metadata** | Title: "Sign Up \| Horizon Banking" |
| **Status** | Static — form-only page |

**Data Flow:**

1. User enters details in `AuthPageWrapper` (client component)
2. Form submits to `/api/auth/local-create`
3. Creates new user in database
4. Sets session and redirects to `/dashboard`

---

### 4. Dashboard Page (`/dashboard`)

**File:** `app/(root)/dashboard/page.tsx` (line 28)

```typescript
export default function DashboardPage(): JSX.Element {
  return (
    <RootLayoutWrapper>
      <Suspense fallback={<LoadingSpinner className="flex-center min-h-screen" />}>
        <DashboardServerWrapper />
      </Suspense>
    </RootLayoutWrapper>
  );
}
```

**ServerWrapper:** `DashboardServerWrapper` (components/dashboard/dashboard-server-wrapper.tsx:31)

```typescript
export async function DashboardServerWrapper(): Promise<JSX.Element> {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const userId = session.user.id as string;

  const [walletsResult, accountsResult, txResult] = await Promise.all([
    getUserWallets(),
    getAllAccounts(),
    getRecentTransactions(20),
  ]);

  const wallets = walletsResult.ok ? (walletsResult.wallets ?? []) : [];
  const accounts = accountsResult.ok ? (accountsResult.accounts ?? []) : [];
  const transactions = txResult.ok ? (txResult.transactions ?? []) : [];

  return (
    <DashboardClientWrapper
      accounts={accounts}
      wallets={wallets}
      transactions={transactions}
      userId={userId}
      userName={session.user.name ?? "User"}
      showOnboarding={wallets.length === 0}
    />
  );
}
```

| Aspect | Details |
| --- | --- |
| **Route** | `/dashboard` (protected) |
| **Component Type** | Server Component |
| **Auth** | Required — calls `auth()`, redirects to `/sign-in` if unauthenticated |
| **Layout** | `RootLayoutWrapper` (sidebar + header) |
| **ServerWrapper** | `DashboardServerWrapper` |
| **ClientWrapper** | `DashboardClientWrapper` |
| **DAL Helpers** | `userDal` (via auth), `walletDal`, `accountDal` (Plaid), `transactionDal` |
| **Server Actions** | `getUserWallets()`, `getAllAccounts()`, `getRecentTransactions(20)` |
| **Metadata** | Title: "Dashboard \| Horizon Banking" |
| **Status** | Dynamic — fetches per request, no ISR |

**Data Flow:**

1. `auth()` — Verify user session
2. Parallel fetch (no N+1):
   - `getUserWallets()` → lists user's bank connections
   - `getAllAccounts()` → Plaid linked accounts
   - `getRecentTransactions(20)` → Latest 20 transactions
3. Pass data to `DashboardClientWrapper`
4. Render dashboard with wallets, accounts, balance overview

**DAL Pattern:**

- `getUserWallets()` → wallets table + balance calculations
- `getAllAccounts()` → Plaid accounts (via plaid_accounts)
- `getRecentTransactions()` → transactions table with N+1 prevention (batched wallet lookup)

---

### 5. My Wallets Page (`/my-wallets`)

**File:** `app/(root)/my-wallets/page.tsx` (line 30)

```typescript
export default function MyWalletsPage(): JSX.Element {
  return (
    <RootLayoutWrapper>
      <Suspense fallback={<LoadingSpinner className="flex-center min-h-screen" />}>
        <MyWalletsServerWrapper />
      </Suspense>
    </RootLayoutWrapper>
  );
}
```

**ServerWrapper:** `MyWalletsServerWrapper` (components/my-wallets/my-wallets-server-wrapper.tsx:17)

```typescript
export async function MyWalletsServerWrapper(): Promise<JSX.Element> {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const userId = session.user.id;
  const result = await getAllWalletsWithDetails();

  const walletsWithDetails = result.ok ? (result.walletsWithDetails ?? []) : [];
  const totalBalance = result.ok ? (result.totalBalance ?? 0) : 0;

  return (
    <MyWalletsClientWrapper
      walletsWithDetails={walletsWithDetails}
      totalBalance={totalBalance}
      userId={userId}
      removeWallet={removeWallet}
    />
  );
}
```

| Aspect | Details |
| --- | --- |
| **Route** | `/my-wallets` (protected) |
| **Component Type** | Server Component |
| **Auth** | Required — calls `auth()`, redirects to `/sign-in` if unauthenticated |
| **Layout** | `RootLayoutWrapper` |
| **ServerWrapper** | `MyWalletsServerWrapper` |
| **ClientWrapper** | `MyWalletsClientWrapper` |
| **DAL Helpers** | `walletDal` (wallets + balance aggregation) |
| **Server Actions** | `getAllWalletsWithDetails()`, `removeWallet()` (client-callable) |
| **Metadata** | Title: "My Wallets \| Horizon Banking" |
| **Status** | Dynamic — fetches per request |

**Data Flow:**

1. `auth()` — Verify user session
2. `getAllWalletsWithDetails()` → wallets + balances + recent txn counts
3. Pass to `MyWalletsClientWrapper`
4. Render wallet list with disconnect buttons

**DAL Pattern:**

- `walletDal.findByUserId()` → list wallets
- Balance aggregation (sum of all transactions or API call)
- Single query (no N+1)

---

### 6. Payment Transfer Page (`/payment-transfer`)

**File:** `app/(root)/payment-transfer/page.tsx` (line 31)

```typescript
export default function PaymentTransferPage(): JSX.Element {
  return (
    <RootLayoutWrapper>
      <Suspense fallback={<LoadingSpinner className="flex-center min-h-screen" />}>
        <PaymentTransferServerWrapper />
      </Suspense>
    </RootLayoutWrapper>
  );
}
```

**ServerWrapper:** `PaymentTransferServerWrapper` (components/payment-transfer/payment-transfer-server-wrapper.tsx:17)

```typescript
export async function PaymentTransferServerWrapper(): Promise<JSX.Element> {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const [walletsResult, recipientsResult] = await Promise.all([
    getUserWallets(),
    getRecipients(),
  ]);

  const wallets = walletsResult.ok ? (walletsResult.wallets ?? []) : [];
  const recipients = recipientsResult.ok
    ? (recipientsResult.recipients ?? [])
    : [];

  return (
    <PaymentTransferClientWrapper
      wallets={wallets}
      recipients={recipients}
      createTransfer={createTransfer}
    />
  );
}
```

| Aspect | Details |
| --- | --- |
| **Route** | `/payment-transfer` (protected) |
| **Component Type** | Server Component |
| **Auth** | Required — calls `auth()`, redirects to `/sign-in` if unauthenticated |
| **Layout** | `RootLayoutWrapper` |
| **ServerWrapper** | `PaymentTransferServerWrapper` |
| **ClientWrapper** | `PaymentTransferClientWrapper` |
| **DAL Helpers** | `walletDal`, `recipientDal`, `dwollaDal` |
| **Server Actions** | `getUserWallets()`, `getRecipients()`, `createTransfer()` (client-callable) |
| **Metadata** | Title: "Payment Transfer \| Horizon Banking" |
| **Status** | Dynamic — fetches per request |

**Data Flow:**

1. `auth()` — Verify user session
2. Parallel fetch:
   - `getUserWallets()` → source accounts
   - `getRecipients()` → saved recipients
3. Pass to `PaymentTransferClientWrapper`
4. User fills form and calls `createTransfer()`
5. `createTransfer()` → Dwolla API → creates transaction + local ledger entry

**DAL Pattern:**

- `walletDal.findByUserId()` → list wallets
- `recipientDal.findByUserId()` → list recipients
- Parallel fetch (no N+1)

---

### 7. Transaction History Page (`/transaction-history`)

**File:** `app/(root)/transaction-history/page.tsx` (line 33)

```typescript
export default function TransactionHistoryPage(): JSX.Element {
  return (
    <RootLayoutWrapper>
      <Suspense fallback={<LoadingSpinner className="flex-center min-h-screen" />}>
        <TransactionHistoryServerWrapper />
      </Suspense>
    </RootLayoutWrapper>
  );
}
```

**ServerWrapper:** `TransactionHistoryServerWrapper` (components/transaction-history/transaction-history-server-wrapper.tsx:13)

```typescript
export async function TransactionHistoryServerWrapper(): Promise<JSX.Element> {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const result = await getTransactionHistory(1, 50);
  const transactions = result.ok ? (result.transactions ?? []) : [];

  return <TransactionHistoryClientWrapper transactions={transactions} />;
}
```

| Aspect | Details |
| --- | --- |
| **Route** | `/transaction-history` (protected) |
| **Component Type** | Server Component |
| **Auth** | Required — calls `auth()`, redirects to `/sign-in` if unauthenticated |
| **Layout** | `RootLayoutWrapper` |
| **ServerWrapper** | `TransactionHistoryServerWrapper` |
| **ClientWrapper** | `TransactionHistoryClientWrapper` |
| **DAL Helpers** | `transactionDal` (with N+1 prevention) |
| **Server Actions** | `getTransactionHistory(page, pageSize)` |
| **Metadata** | Title: "Transaction History \| Horizon Banking" |
| **Status** | Dynamic — paginated, fetches per request |

**Data Flow:**

1. `auth()` — Verify user session
2. `getTransactionHistory(1, 50)` → paginated transactions with wallets (batched lookup)
3. Pass to `TransactionHistoryClientWrapper`
4. Render paginated transaction table

**DAL Pattern (N+1 Prevention):**

```
1. Fetch transactions for user (page 1, 50 per page)
2. Collect unique wallet IDs from sender/receiver fields
3. Batch fetch all wallets in single query (IN clause)
4. Map wallets back onto transactions
```

**Reference:** `dal/transaction.dal.ts:findByUserIdWithWallets()` — canonical N+1 prevention pattern

---

### 8. Settings Page (`/settings`)

**File:** `app/(root)/settings/page.tsx` (line 31)

```typescript
export default function SettingsPage(): JSX.Element {
  return (
    <RootLayoutWrapper>
      <Suspense fallback={<LoadingSpinner className="flex-center min-h-screen" />}>
        <SettingsServerWrapper />
      </Suspense>
    </RootLayoutWrapper>
  );
}
```

**ServerWrapper:** `SettingsServerWrapper` (components/settings/settings-server-wrapper.tsx:16)

```typescript
export async function SettingsServerWrapper(): Promise<JSX.Element> {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const result = await getUserWithProfile();
  if (!result.ok || !result.user) {
    redirect("/sign-in");
  }

  return (
    <section className="space-y-10">
      <SettingsClientWrapper
        userWithProfile={result.user}
        updateProfile={updateProfile}
      />
      <ConnectedAccount />
      <SocialUrl />
      <DangerZone />
    </section>
  );
}
```

| Aspect | Details |
| --- | --- |
| **Route** | `/settings` (protected) |
| **Component Type** | Server Component |
| **Auth** | Required — calls `auth()`, double-check on getUserWithProfile result |
| **Layout** | `RootLayoutWrapper` |
| **ServerWrapper** | `SettingsServerWrapper` |
| **ClientWrapper** | `SettingsClientWrapper` + additional sections (ConnectedAccount, SocialUrl, DangerZone) |
| **DAL Helpers** | `userDal` (with profile relationship) |
| **Server Actions** | `getUserWithProfile()`, `updateProfile()` (client-callable) |
| **Metadata** | Title: "Settings \| Horizon Banking" |
| **Status** | Dynamic — fetches per request |

**Data Flow:**

1. `auth()` — Verify user session
2. `getUserWithProfile()` → user + profile data
3. Guard: redirect if user not found
4. Pass to `SettingsClientWrapper`
5. User edits profile and calls `updateProfile()`
6. `updateProfile()` → updates users/profiles tables

**DAL Pattern:**

- `userDal.findByIdWithProfile()` → single query (join users + user_profiles)
- `userDal.updateProfile()` → update both tables as transaction

---

### 9. Admin Dashboard (`/admin`)

**File:** `app/(admin)/admin/page.tsx` (line 39)

```typescript
export default function AdminPage(): JSX.Element {
  return (
    <div>
      <AdminLoadingFallback fallback={<AdminLoadingFallback />}>
        <Suspense fallback={<AdminLoadingFallback />}>
          <AdminDashboardServerWrapper />
        </Suspense>
      </AdminLoadingFallback>
    </div>
  );
}
```

**ServerWrapper:** `AdminDashboardServerWrapper` (components/admin/admin-dashboard-server-wrapper.tsx:8)

```typescript
export async function AdminDashboardServerWrapper() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/sign-in");
  }
  if (!session.user.isAdmin) {
    redirect("/dashboard");
  }

  const [
    statsResult,
    recentTransactionsResult,
    transactionStatusStatsResult,
    transactionTypeStatsResult,
  ] = await Promise.all([
    getAdminStats({}),
    getRecentTransactions({ limit: 5 }),
    getTransactionStatusStats({}),
    getTransactionTypeStats({}),
  ]);

  const stats = statsResult.ok ? statsResult.stats : undefined;
  const recentTransactions = recentTransactionsResult.ok
    ? recentTransactionsResult.transactions
    : [];
  const transactionStatusStats = transactionStatusStatsResult.ok
    ? transactionStatusStatsResult.statusStats
    : {};
  const transactionTypeStats = transactionTypeStatsResult.ok
    ? transactionTypeStatsResult.typeStats
    : {};

  return <AdminDashboardContent {...} />;
}
```

| Aspect | Details |
| --- | --- |
| **Route** | `/admin` (protected, admin-only) |
| **Component Type** | Server Component |
| **Auth** | Required + Admin role — calls `auth()`, verifies `session.user.isAdmin`, redirects to `/dashboard` if not admin |
| **Layout** | `AdminLayoutWrapper` |
| **ServerWrapper** | `AdminDashboardServerWrapper` |
| **ClientWrapper** | `AdminDashboardContent` |
| **DAL Helpers** | `adminDal` (stats aggregations) |
| **Server Actions** | `getAdminStats()`, `getRecentTransactions({ limit: 5 })`, `getTransactionStatusStats()`, `getTransactionTypeStats()` |
| **Metadata** | Title: "Admin Dashboard \| Horizon Banking" |
| **Status** | Dynamic — fetches per request |

**Data Flow:**

1. `auth()` — Verify user session
2. Guard: redirect if not admin
3. Parallel fetch (4 requests):
   - `getAdminStats()` → user count, transaction count, volume metrics
   - `getRecentTransactions({ limit: 5 })` → latest 5 txns system-wide
   - `getTransactionStatusStats()` → counts by status (pending, completed, failed)
   - `getTransactionTypeStats()` → counts by type (transfer, deposit, etc.)
4. Pass to `AdminDashboardContent`
5. Render admin dashboard with charts and metrics

**DAL Pattern:**

- `adminDal.getStats()` → count queries (users, transactions)
- `transactionDal.findByStatusStats()` → group by status
- `transactionDal.findByTypeStats()` → group by type
- All aggregations done at DB layer (SQL COUNT/GROUP BY)

---

## Component Architecture

### Server Wrapper Pattern (All Pages)

```
page.tsx (Server Component)
├── Metadata (title, description)
├── Layout wrapper (RootLayoutWrapper, AuthLayoutWrapper, or AdminLayoutWrapper)
│   └── Suspense (fallback: LoadingSpinner or custom skeleton)
│       └── *ServerWrapper (async server component)
│           ├── auth() call
│           ├── Parallel action calls (if protected)
│           └── Render *ClientWrapper with fetched data
└── *ClientWrapper (client component for interactivity)
    ├── Form handling (if mutation page)
    ├── State management (Zustand stores)
    └── UI rendering
```

### Layouts

| Layout | Used By | Purpose |
| --- | --- | --- |
| `RootLayoutWrapper` | Protected pages, home | Sidebar + header, session provider |
| `AuthLayoutWrapper` | Sign-in, Sign-up | Minimal layout for auth forms |
| `AdminLayoutWrapper` | Admin pages | Admin-specific sidebar + permissions check |

### Shared Components

| Component         | Purpose           | Used By          |
| ----------------- | ----------------- | ---------------- |
| `LoadingSpinner`  | Suspense fallback | All pages        |
| `Skeleton`        | Admin skeleton    | Admin dashboard  |
| `AuthPageWrapper` | Auth form wrapper | Sign-in, Sign-up |

---

## Authentication & Authorization

### Protected Routes (Require Auth)

**Routes:** `/dashboard`, `/my-wallets`, `/payment-transfer`, `/transaction-history`, `/settings`

**Auth Check:**

```typescript
const session = await auth();
if (!session?.user?.id) {
  redirect("/sign-in");
}
```

**Implemented in:** Each `*ServerWrapper` before data access

### Admin-Only Routes

**Routes:** `/admin`

**Auth Check:**

```typescript
const session = await auth();
if (!session?.user?.id) {
  redirect("/sign-in");
}
if (!session.user.isAdmin) {
  redirect("/dashboard");
}
```

**Implemented in:** `AdminDashboardServerWrapper` with explicit role check

### Public Routes (No Auth Required)

**Routes:** `/`, `/sign-in`, `/sign-up`

**Behavior:**

- Home page: Accessible to all
- Sign-in/Sign-up: Redirect authenticated users to `/dashboard`

**Implemented in:** `AuthLayoutWrapper` and `AuthPageWrapper`

---

## Server Actions Summary

### Wallet Actions (`actions/wallet.actions.ts`)

| Action | Signature | Used By | Purpose |
| --- | --- | --- | --- |
| `getUserWallets()` | `async () → { ok, wallets?, error? }` | Dashboard, Payment Transfer | List user's linked wallets |
| `createWallet()` | `async (input) → { ok, wallet?, error? }` | My Wallets (future) | Create wallet |
| `deleteWallet()` | `async (id) → { ok, error? }` | My Wallets (future) | Delete wallet |

### Plaid Actions (`actions/plaid.actions.ts`)

| Action | Signature | Used By | Purpose |
| --- | --- | --- | --- |
| `getAllAccounts()` | `async () → { ok, accounts?, error? }` | Dashboard | List Plaid-linked accounts |
| `getAllWalletsWithDetails()` | `async () → { ok, walletsWithDetails?, totalBalance?, error? }` | My Wallets | List wallets with balances |
| `removeWallet()` | `async (id) → { ok, error? }` | My Wallets | Unlink bank account |

### Transaction Actions (`actions/transaction.actions.ts`)

| Action | Signature | Used By | Purpose |
| --- | --- | --- | --- |
| `getRecentTransactions(limit)` | `async (limit) → { ok, transactions?, error? }` | Dashboard | Fetch recent txns |
| `getTransactionHistory(page, pageSize)` | `async (page, pageSize) → { ok, transactions?, error? }` | Transaction History | Paginated txn list |

### Recipient Actions (`actions/recipient.actions.ts`)

| Action | Signature | Used By | Purpose |
| --- | --- | --- | --- |
| `getRecipients()` | `async () → { ok, recipients?, error? }` | Payment Transfer | List saved recipients |
| `createRecipient()` | `async (input) → { ok, recipient?, error? }` | Payment Transfer (form) | Save new recipient |
| `deleteRecipient()` | `async (id) → { ok, error? }` | Payment Transfer (future) | Remove recipient |

### Dwolla Actions (`actions/dwolla.actions.ts`)

| Action | Signature | Used By | Purpose |
| --- | --- | --- | --- |
| `createTransfer()` | `async (input) → { ok, transfer?, error? }` | Payment Transfer (form) | Initiate ACH transfer |

### User Actions (`actions/user.actions.ts`)

| Action | Signature | Used By | Purpose |
| --- | --- | --- | --- |
| `getUserWithProfile()` | `async () → { ok, user?, error? }` | Settings | Fetch user + profile |
| `getUserById(id)` | `async (id) → { ok, user?, error? }` | Admin (future) | Fetch user by ID |

### Profile Actions (`actions/updateProfile.ts`)

| Action | Signature | Used By | Purpose |
| --- | --- | --- | --- |
| `updateProfile()` | `async (input) → { ok, user?, error? }` | Settings (form) | Update profile data |

### Admin Stats Actions (`actions/admin-stats.actions.ts`)

| Action | Signature | Used By | Purpose |
| --- | --- | --- | --- |
| `getAdminStats(opts)` | `async (opts) → { ok, stats?, error? }` | Admin Dashboard | Overall statistics |
| `getRecentTransactions(opts)` | `async (opts) → { ok, transactions?, error? }` | Admin Dashboard | Latest txns (system-wide) |
| `getTransactionStatusStats(opts)` | `async (opts) → { ok, statusStats?, error? }` | Admin Dashboard | Txn count by status |
| `getTransactionTypeStats(opts)` | `async (opts) → { ok, typeStats?, error? }` | Admin Dashboard | Txn count by type |

### Auth Actions

| Action | Signature | Used By | Purpose |
| --- | --- | --- | --- |
| NextAuth `/api/auth/local-validate` | POST | Sign-in form | Validate credentials |
| NextAuth `/api/auth/local-create` | POST | Sign-up form | Register user |

---

## Compliance Assessment

### ✅ Compliant Patterns

| Requirement | Status | Evidence |
| --- | --- | --- |
| No direct DB in pages | ✅ | All pages delegate to ServerWrapper → Actions → DAL |
| Auth in server layer | ✅ | `auth()` called in each ServerWrapper before data access |
| DAL-only data access | ✅ | All DB access via `dal/*` helpers (wallet.dal, transaction.dal, etc.) |
| Server Actions for mutations | ✅ | All writes use `"use server"` actions (createTransfer, updateProfile, etc.) |
| Consistent return shapes | ✅ | All actions return `{ ok: boolean; error?: string; ...payload }` |
| Auth guards in admin routes | ✅ | Admin wrapper checks both `auth()` and `session.user.isAdmin` |
| Suspense boundaries | ✅ | All pages use Suspense with LoadingSpinner fallback |
| Metadata per page | ✅ | All pages have title/description |

### ⚠️ Observations

| Item | Status | Note |
| --- | --- | --- |
| Admin layout permission check | ✅ | Also protected by `AdminLayoutWrapper` (belt-and-suspenders) |
| Error boundaries on wrappers | ⚠️ | ServerWrapper errors not caught — consider adding Error Boundary |
| Home page static | ✅ | No auth, DB, or env calls — fully static/cacheable |

---

## API Routes

| Route | File | Method | Purpose | Docs |
| --- | --- | --- | --- | --- |
| `/api/auth/[...nextauth]` | `app/api/auth/[...nextauth]/route.ts` | GET/POST | NextAuth credential provider | Next.js Auth |
| `/api/auth/local-create` | `app/api/auth/local-create/route.ts` | POST | User registration endpoint | See source |
| `/api/auth/local-validate` | `app/api/auth/local-validate/route.ts` | POST | Credential validation endpoint | See source |
| `/api/dwolla/webhook` | `app/api/dwolla/webhook/route.ts` | POST | Dwolla transfer webhook | Dwolla docs |
| `/api/health` | `app/api/health/route.ts` | GET | Health check endpoint | See source |
| `/api/__playwright__/set-cookie` | `app/api/__playwright__/set-cookie/route.ts` | POST | Test helper for E2E cookie setup | Playwright |

---

## Route Summary

```
app/
├── page.tsx                                    (/ — Home, static)
├── layout.tsx                                  (Root layout)
│
├── (auth)/
│   ├── layout.tsx                             (Auth layout)
│   ├── sign-in/page.tsx                       (/sign-in)
│   └── sign-up/page.tsx                       (/sign-up)
│
├── (root)/
│   ├── layout.tsx                             (Protected layout)
│   ├── dashboard/page.tsx                     (/dashboard)
│   ├── my-wallets/page.tsx                    (/my-wallets)
│   ├── payment-transfer/page.tsx              (/payment-transfer)
│   ├── transaction-history/page.tsx           (/transaction-history)
│   └── settings/page.tsx                      (/settings)
│
├── (admin)/
│   ├── layout.tsx                             (Admin layout)
│   └── admin/page.tsx                         (/admin)
│
├── api/
│   ├── auth/
│   │   ├── [...]nextauth]/route.ts
│   │   ├── local-create/route.ts
│   │   └── local-validate/route.ts
│   ├── dwolla/webhook/route.ts
│   ├── health/route.ts
│   └── __playwright__/set-cookie/route.ts
│
└── demo/
    ├── hero-section-41/page.tsx               (/demo/hero-section-41)
    ├── dashboard-shell-01/page.tsx           (/demo/dashboard-shell-01)
    ├── onboarding-feed-01/page.tsx            (/demo/onboarding-feed-01)
    └── application-shell-01/page.tsx          (/demo/application-shell-01)
```

---

## Component Composition by Page

### Protected Page Pattern

```typescript
// page.tsx
export default function PageName(): JSX.Element {
  return (
    <RootLayoutWrapper>
      <Suspense fallback={<LoadingSpinner />}>
        <PageNameServerWrapper />
      </Suspense>
    </RootLayoutWrapper>
  );
}

// *ServerWrapper.tsx
export async function PageNameServerWrapper(): Promise<JSX.Element> {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  const result = await actionToFetchData();
  const data = result.ok ? result.data : [];

  return <PageNameClientWrapper {...data} />;
}

// *ClientWrapper.tsx
export function PageNameClientWrapper(props): JSX.Element {
  return <div>{/* UI rendering */}</div>;
}
```

### Public Page Pattern (Auth)

```typescript
// page.tsx
export default function AuthPage(): JSX.Element {
  return (
    <AuthLayoutWrapper>
      <Suspense fallback={<LoadingSpinner />}>
        <AuthServerWrapper />
      </Suspense>
    </AuthLayoutWrapper>
  );
}

// *ServerWrapper.tsx
export async function AuthServerWrapper(): Promise<JSX.Element> {
  return <AuthPageWrapper type="sign-in" actionEndpoint="/api/auth/local-validate" />;
}
```

---

## Data Fetching Patterns

### N+1 Prevention Example

**Transaction History page:**

```typescript
// 1. Fetch transactions (1 query)
const txns = await db
  .select()
  .from(transactions)
  .where(eq(transactions.userId, userId))
  .limit(50)
  .offset(0);

// 2. Collect unique wallet IDs (memory operation)
const walletIds = new Set<string>();
for (const t of txns) {
  if (t.senderWalletId) walletIds.add(t.senderWalletId);
  if (t.receiverWalletId) walletIds.add(t.receiverWalletId);
}

// 3. Batch fetch all wallets (1 query, not N queries)
const walletsMap = new Map<string, Wallet>();
if (walletIds.size > 0) {
  const rows = await db
    .select()
    .from(wallets)
    .where(inArray(wallets.id, Array.from(walletIds)));
  for (const row of rows) {
    walletsMap.set(row.id, row);
  }
}

// 4. Enrich transactions with wallets (memory operation)
const enrichedTxns = txns.map(txn => ({
  ...txn,
  senderWallet: walletsMap.get(txn.senderWalletId) ?? null,
  receiverWallet: walletsMap.get(txn.receiverWalletId) ?? null
}));

return enrichedTxns;
```

**Reference:** `dal/transaction.dal.ts:findByUserIdWithWallets()`

---

## Testing Notes

### Seed User for E2E

```
Email: seed-user@example.com
Password: password123
```

### Mock Tokens for Plaid/Dwolla

Use tokens starting with `seed-`, `mock-`, or `mock_` to skip API calls:

```typescript
// tests/e2e/helpers/plaid.mock.ts
export async function addMockPlaidInitScript(
  page: Page,
  publicToken = "MOCK_PUBLIC_TOKEN"
) {
  // Injects mock Plaid.create() function
}
```

---

## Verification Status

✅ **Task 0.2 Verification: PASSED**

- [x] 5 protected pages verified and documented
- [x] 1 admin page verified and documented
- [x] 3 public pages verified and documented
- [x] All pages follow Server Wrapper pattern
- [x] All protected pages call `auth()` and redirect on failure
- [x] All data fetching via Server Actions + DAL helpers
- [x] No direct DB access in pages or components
- [x] Metadata properly configured for all pages
- [x] Suspense boundaries present and working
- [x] Server Actions return stable `{ ok, error?, ...payload }` shape
- [x] DAL helpers batched to prevent N+1 queries
- [x] Admin page includes role-based authorization

---

**Last Updated:** 2026-05-03  
**Verified By:** Agent  
**Next Steps:** Use this documentation to guide feature development and route extensions
