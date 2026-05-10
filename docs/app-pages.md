# App Pages Catalog

## Route Structure

```
src/app/
├── (auth)/                          # Public auth routes
│   ├── layout.tsx                   # AuthLayoutWrapper
│   ├── sign-in/
│   │   ├── page.tsx                 # SignInServerWrapper + Suspense
│   │   ├── error.tsx
│   │   └── loading.tsx
│   └── sign-up/
│       ├── page.tsx                 # SignUpServerWrapper + Suspense
│       ├── error.tsx
│       └── loading.tsx
├── (admin)/                         # Admin routes (protected)
│   ├── layout.tsx                   # AdminLayoutWrapper + auth gating
│   └── admin/
│       ├── page.tsx                 # AdminDashboardServerWrapper
│       ├── error.tsx
│       └── loading.tsx
├── (root)/                          # Protected app routes
│   ├── layout.tsx                   # RootLayoutWrapper + PlaidProvider
│   ├── dashboard/
│   │   ├── page.tsx                 # DashboardServerWrapper + Suspense
│   │   ├── error.tsx
│   │   └── loading.tsx
│   ├── my-wallets/
│   │   ├── page.tsx                 # MyWalletsServerWrapper + Suspense
│   │   ├── error.tsx
│   │   └── loading.tsx
│   ├── payment-transfer/
│   │   ├── page.tsx                # PaymentTransferServerWrapper + Suspense
│   │   ├── error.tsx
│   │   └── loading.tsx
│   ├── settings/
│   │   ├── page.tsx                # SettingsServerWrapper + Suspense
│   │   ├── error.tsx
│   │   └── loading.tsx
│   └── transaction-history/
│       ├── page.tsx                # TransactionHistoryServerWrapper + Suspense
│       ├── error.tsx
│       └── loading.tsx
├── api/                             # API routes
│   ├── auth/
│   │   ├── local-create/route.ts   # Mock auth create
│   │   ├── local-validate/route.ts # Mock auth validate
│   │   └── [...nextauth]/route.ts  # NextAuth handler
│   ├── dwolla/webhook/route.ts     # Dwolla webhook
│   ├── health/route.ts             # Health check
│   └── __playwright__/set-cookie/  # Test cookie setting
├── demo/                           # Demo pages (to be integrated/deleted)
│   ├── application-shell-01/
│   ├── dashboard-shell-01/
│   ├── hero-section-41/
│   └── onboarding-feed-01/
├── global-error.tsx                # Global error boundary
├── globals.css                     # Global styles
├── layout.tsx                      # Root layout (fonts, providers)
├── not-found.tsx                   # 404 page
└── page.tsx                        # Landing page (/)
```

---

## Page Details

### Landing Page (`/`)

**File:** `src/app/page.tsx`

```tsx
// Route: /
export default function HomePage() {
  return <HomeServerWrapper />;
}
```

**Wrapper:** `src/components/home/home-server-wrapper.tsx` **Components:** Hero section from shadcn-studio/hero-section-41 **Auth:** Public

---

### Auth Routes (`/sign-in`, `/sign-up`)

**Layout:** `src/app/(auth)/layout.tsx`

```tsx
export default function AuthLayout({ children }) {
  return <AuthLayoutWrapper>{children}</AuthLayoutWrapper>;
}
```

**Sign-In Page:** `src/app/(auth)/sign-in/page.tsx`

```tsx
export default function SignInPage() {
  return (
    <Suspense fallback={<Loading />}>
      <SignInServerWrapper />
    </Suspense>
  );
}
```

**Sign-Up Page:** `src/app/(auth)/sign-up/page.tsx`

```tsx
export default function SignUpPage() {
  return (
    <Suspense fallback={<Loading />}>
      <SignUpServerWrapper />
    </Suspense>
  );
}
```

**Components:**

- `SignInServerWrapper` → `SignInClientWrapper` → `SignInClient`
- `SignUpServerWrapper` → `SignUpClientWrapper` → `SignUpClient`

**Actions:**

- `auth.signin.ts` - SignInSchema validation
- `register.ts` - signUpSchema validation

---

### Root Routes (`/dashboard`, `/my-wallets`, etc.)

**Layout:** `src/app/(root)/layout.tsx`

```tsx
export default function RootLayout({ children }) {
  // Auth check, redirect to /sign-in if not authenticated
  // Provides: PlaidProvider, Sidebar, MobileNav
}
```

**Dashboard Page:** `src/app/(root)/dashboard/page.tsx`

```tsx
export default function DashboardPage() {
  return (
    <Suspense fallback={<Loading />}>
      <DashboardServerWrapper />
    </Suspense>
  );
}
```

**My Wallets Page:** `src/app/(root)/my-wallets/page.tsx`

```tsx
export default function MyWalletsPage() {
  return (
    <Suspense fallback={<Loading />}>
      <MyWalletsServerWrapper />
    </Suspense>
  );
}
```

**Payment Transfer Page:** `src/app/(root)/payment-transfer/page.tsx`

```tsx
export default function PaymentTransferPage() {
  return (
    <Suspense fallback={<Loading />}>
      <PaymentTransferServerWrapper />
    </Suspense>
  );
}
```

**Settings Page:** `src/app/(root)/settings/page.tsx`

```tsx
export default function SettingsPage() {
  return (
    <Suspense fallback={<Loading />}>
      <SettingsServerWrapper />
    </Suspense>
  );
}
```

**Transaction History Page:** `src/app/(root)/transaction-history/page.tsx`

```tsx
export default function TransactionHistoryPage() {
  return (
    <Suspense fallback={<Loading />}>
      <TransactionHistoryServerWrapper />
    </Suspense>
  );
}
```

**Actions (Root routes):**

- `user.actions.ts` - getLoggedInUser, logoutAccount
- `updateProfile.ts` - UpdateProfileSchema
- `wallet.actions.ts` - DisconnectWalletSchema
- `transaction.actions.ts` - getRecentTransactions, getAllTransactions
- `plaid.actions.ts` - CreateLinkTokenSchema, ExchangeTokenSchema
- `dwolla.actions.ts` - createDwollaCustomer, initiateTransfer
- `recipient.actions.ts` - RecipientSchema

**Stores (Root routes):**

- `transfer-store.tsx` - Transfer wizard state
- `ui-store.tsx` - UI state (sidebar, modals)
- `session.tsx` - Auth session

---

### Admin Routes (`/admin`)

**Layout:** `src/app/(admin)/layout.tsx`

```tsx
export default function AdminLayout({ children }) {
  // Auth check + isAdmin check
  // Provides: AdminSidebar, Breadcrumb, LanguageDropdown, ProfileDropdown
}
```

**Admin Page:** `src/app/(admin)/admin/page.tsx`

```tsx
export default function AdminPage() {
  return <AdminDashboardServerWrapper />;
}
```

**Actions (Admin):**

- `admin.actions.ts` - ToggleAdminSchema, SetActiveSchema
- `admin-stats.actions.ts` - GetAdminStatsSchema, PaginatedUsersSchema

---

## API Routes

### Auth API

- `POST /api/auth/local-create` - Mock user creation
- `POST /api/auth/local-validate` - Mock validation
- `GET/POST /api/auth/[...nextauth]` - NextAuth handler

### Dwolla Webhook

- `POST /api/dwolla/webhook` - Dwolla event handling

### Health Check

- `GET /api/health` - Service health

### Playwright Test Support

- `POST /api/__playwright__/set-cookie` - Set test cookies

---

## Server Actions Mapping

| Action File | Key Functions | Schema |
| --- | --- | --- |
| `auth.signin.ts` | signInUser | SignInSchema |
| `register.ts` | registerUser | signUpSchema |
| `user.actions.ts` | getLoggedInUser, logoutAccount, getUserWithProfile, getAllUsers | - |
| `updateProfile.ts` | updateUserProfile, updateUserPassword | UpdateProfileSchema |
| `wallet.actions.ts` | disconnectWallet | DisconnectWalletSchema |
| `transaction.actions.ts` | getRecentTransactions, getAllTransactions | - |
| `plaid.actions.ts` | createLinkToken, exchangePublicToken, syncTransactions, getWalletBalances | CreateLinkTokenSchema, ExchangeTokenSchema |
| `dwolla.actions.ts` | createDwollaCustomer, initiateTransfer, verifyMicroDeposits | CreateCustomerSchema |
| `admin.actions.ts` | toggleAdmin, setUserActive | ToggleAdminSchema, SetActiveSchema |
| `admin-stats.actions.ts` | getAdminStats, getPaginatedUsers | GetAdminStatsSchema, PaginatedUsersSchema |
| `recipient.actions.ts` | getRecipients, createRecipient, updateRecipient, deleteRecipient | RecipientSchema |

---

## Error Boundaries

Each route group has:

- `error.tsx` - Error boundary for the route
- `loading.tsx` - Loading skeleton

---

## Loading States

Each page uses Suspense with loading component:

```tsx
<Suspense fallback={<Loading />}>
  <*ServerWrapper />
</Suspense>
```

Loading files typically import from `src/components/ui/skeleton.tsx`.

---

## Next.js Configuration

**File:** `next.config.ts`

- React strict mode enabled
- Experimental features for Next.js 16 compatibility
- App router enabled

---

## Global Styles

**File:** `src/app/globals.css`

- Tailwind CSS imports
- Custom CSS variables
- Font setup
