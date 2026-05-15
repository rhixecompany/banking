# Custom Components Catalog

## Overview

Components in `./src/components/**` (excluding `./src/components/ui/**`)

---

## Layout Components (`./src/components/layouts/`)

### Core Layout Wrappers

| Component | File | Purpose |
| --- | --- | --- |
| `AuthLayoutWrapper` | `layouts/AuthLayoutWrapper.tsx` | Auth pages wrapper with centered card |
| `RootLayoutWrapper` | `layouts/RootLayoutWrapper.tsx` | Main app wrapper with sidebar/nav |
| `AdminLayoutWrapper` | `layouts/AdminLayoutWrapper.tsx` | Admin wrapper with sidebar |
| `PageShell` | `layouts/PageShell.tsx` | Generic page container |
| `auth-page-wrapper` | `layouts/auth-page-wrapper.tsx` | Auth page layout |
| `admin-sidebar` | `layouts/admin-sidebar.tsx` | Admin navigation sidebar |
| `home-footer` | `layouts/home-footer.tsx` | Landing page footer |

### Feature Layouts

| Component | File | Purpose |
| --- | --- | --- |
| `DashboardClient` | `layouts/dashboard-client/index.tsx` | Dashboard client shell |
| `MyWalletsClient` | `layouts/my-wallets-client/index.tsx` | My wallets client shell |
| `PaymentTransferClient` | `layouts/payment-transfer-client/index.tsx` | Payment transfer client shell |
| `SettingsClient` | `layouts/settings-client/index.tsx` | Settings client shell |
| `TransactionHistoryClient` | `layouts/transaction-history-client/index.tsx` | Transaction history shell |
| `AdminData` | `layouts/admin-data/index.tsx` | Admin data display |
| `AdminDashboard` | `layouts/admin-dashboard/index.tsx` | Admin dashboard layout |

### Generic Reusable Components

| Component | File | Purpose |
| --- | --- | --- |
| `GenericCard` | `layouts/generic-card/index.tsx` | Reusable card wrapper |
| `GenericDataTable` | `layouts/generic-data-table/index.tsx` | Generic table with sorting/pagination |
| `GenericEmptyState` | `layouts/generic-empty-state/index.tsx` | Empty state placeholder |
| `GenericForm` | `layouts/generic-form/index.tsx` | Generic form wrapper |
| `GenericModal` | `layouts/generic-modal/index.tsx` | Modal dialog wrapper |
| `GenericPageShell` | `layouts/generic-page-shell/index.tsx` | Page container shell |
| `GenericSkeleton` | `layouts/generic-skeleton/index.tsx` | Loading skeleton |
| `GenericToast` | `layouts/generic-toast/index.tsx` | Toast notification |
| `FormField` | `layouts/form/index.tsx` | Form field with label/error |
| `Card` | `layouts/card/index.tsx` | Card container |
| `Row` | `layouts/row/index.tsx` | Row container |
| `SectionHeader` | `layouts/section-header/index.tsx` | Section header |
| `StatCard` | `layouts/stat-card/index.tsx` | Statistics card |
| `TotalBalance` | `layouts/total-balance/index.tsx` | Total balance display |
| `WalletCard` | `layouts/wallet-card/index.tsx` | Wallet card |
| `DataTable` | `layouts/data-table/index.tsx` | Data table |
| `PageContainer` | `layouts/page-container/index.tsx` | Page container |

### Form Components

| Component | File | Purpose |
| --- | --- | --- |
| `PaymentTransferForm` | `layouts/payment-transfer-form.tsx` | Payment transfer form |
| `SettingsProfileForm` | `layouts/settings-profile-form.tsx` | Profile settings form |
| `TransferSummary` | `layouts/transfer-summary.tsx` | Transfer summary display |

### Standalone Layout Files

- `layouts/AdminLayoutWrapper.tsx`
- `layouts/AuthLayoutWrapper.tsx`
- `layouts/RootLayoutWrapper.tsx`
- `layouts/admin-dashboard/index.tsx`
- `layouts/admin-data/index.tsx`
- `layouts/admin-sidebar.tsx`
- `layouts/auth-form/index.tsx`
- `layouts/auth-page-wrapper.tsx`
- `layouts/cta-get-started.tsx`
- `layouts/features-grid.tsx`
- `layouts/home-footer.tsx`
- `layouts/page-container/index.tsx`
- `layouts/plaid-provider.tsx`
- `layouts/transaction-list.tsx`
- `layouts/home-footer.tsx`

---

## Feature Components

### Dashboard (`./src/components/dashboard/`)

| Component | File | Purpose |
| --- | --- | --- |
| `DashboardClientWrapper` | `dashboard/dashboard-client-wrapper.tsx` | Client-side dashboard |
| `DashboardServerWrapper` | `dashboard/dashboard-server-wrapper.tsx` | Server-side data fetching |
| `index` | `dashboard/index.ts` | Barrel export |

### My Wallets (`./src/components/my-wallets/`)

| Component | File | Purpose |
| --- | --- | --- |
| `MyWalletsClientWrapper` | `my-wallets/my-wallets-client-wrapper.tsx` | Client wrapper |
| `MyWalletsServerWrapper` | `my-wallets/my-wallets-server-wrapper.tsx` | Server wrapper |
| `index` | `my-wallets/index.ts` | Barrel export |

### Payment Transfer (`./src/components/payment-transfer/`)

| Component | File | Purpose |
| --- | --- | --- |
| `PaymentTransferClientWrapper` | `payment-transfer/payment-transfer-client-wrapper.tsx` | Client wrapper |
| `PaymentTransferServerWrapper` | `payment-transfer/payment-transfer-server-wrapper.tsx` | Server wrapper |
| `index` | `payment-transfer/index.ts` | Barrel export |

### Settings (`./src/components/settings/`)

| Component | File | Purpose |
| --- | --- | --- |
| `SettingsClientWrapper` | `settings/settings-client-wrapper.tsx` | Client wrapper |
| `SettingsServerWrapper` | `settings/settings-server-wrapper.tsx` | Server wrapper |
| `index` | `settings/index.ts` | Barrel export |

### Transaction History (`./src/components/transaction-history/`)

| Component | File | Purpose |
| --- | --- | --- |
| `TransactionHistoryClientWrapper` | `transaction-history/transaction-history-client-wrapper.tsx` | Client wrapper |
| `TransactionHistoryServerWrapper` | `transaction-history/transaction-history-server-wrapper.tsx` | Server wrapper |

### Sign In (`./src/components/sign-in/`)

| Component | File | Purpose |
| --- | --- | --- |
| `SignInClientWrapper` | `sign-in/sign-in-client-wrapper.tsx` | Client wrapper |
| `SignInServerWrapper` | `sign-in/sign-in-server-wrapper.tsx` | Server wrapper |
| `SignInClient` | `sign-in/SignInClient.tsx` | Sign in form |

### Sign Up (`./src/components/sign-up/`)

| Component | File | Purpose |
| --- | --- | --- |
| `SignUpClientWrapper` | `sign-up/sign-up-client-wrapper.tsx` | Client wrapper |
| `SignUpServerWrapper` | `sign-up/sign-up-server-wrapper.tsx` | Server wrapper |
| `SignUpClient` | `sign-up/SignUpClient.tsx` | Sign up form |

### Admin (`./src/components/admin/`)

| Component | File | Purpose |
| --- | --- | --- |
| `AdminDashboardContent` | `admin/admin-dashboard-content.tsx` | Admin content |
| `AdminDashboardServerWrapper` | `admin/admin-dashboard-server-wrapper.tsx` | Server wrapper |
| `AdminData` | `admin/admin-data.tsx` | Admin data display |
| `index` | `admin/index.ts` | Barrel export |

### Shared Components

| Component | File | Purpose |
| --- | --- | --- |
| `WalletsOverview` | `shared/wallets-overview.tsx` | Wallet overview list |
| `index` | `shared/index.ts` | Barrel export |

### Navigation

| Component | File | Purpose |
| --- | --- | --- |
| `Sidebar` | `sidebar/sidebar.tsx` | Main sidebar nav |
| `MobileNav` | `mobile-nav/mobile-nav.tsx` | Mobile navigation |
| `NavDocuments` | `nav-documents/nav-documents.tsx` | Document nav |
| `NavSecondary` | `nav-secondary/nav-secondary.tsx` | Secondary nav |

### Global Error

| Component | File | Purpose |
| --- | --- | --- |
| `GlobalErrorClientWrapper` | `global-error/global-error-client-wrapper.tsx` | Global error handler |
| `index` | `global-error/index.ts` | Barrel export |

### Not Found

| Component | File | Purpose |
| --- | --- | --- |
| `NotFoundServerWrapper` | `not-found/not-found-server-wrapper.tsx` | 404 handler |
| `index` | `not-found/index.ts` | Barrel export |

### Home

| Component | File | Purpose |
| --- | --- | --- |
| `HomeServerWrapper` | `home/home-server-wrapper.tsx` | Home page wrapper |
| `index` | `home/index.ts` | Barrel export |

### Footer

| Component | File                | Purpose       |
| --------- | ------------------- | ------------- |
| `Footer`  | `footer/footer.tsx` | Site footer   |
| `index`   | `footer/index.ts`   | Barrel export |

### Header Box

| Component   | File                        | Purpose       |
| ----------- | --------------------------- | ------------- |
| `HeaderBox` | `header-box/header-box.tsx` | Header box    |
| `index`     | `header-box/index.ts`       | Barrel export |

### Chart Components

| Component | File | Purpose |
| --- | --- | --- |
| `ChartAreaInteractive` | `chart-area-interactive/chart-area-interactive.tsx` | Interactive chart |
| `DoughnutChart` | `doughnut-chart/doughnut-chart.tsx` | Doughnut chart |

### Animated Counter

| Component | File | Purpose |
| --- | --- | --- |
| `AnimatedCounter` | `animated-counter/animated-counter.tsx` | Animated number |

### Auth Form

| Component  | File                      | Purpose          |
| ---------- | ------------------------- | ---------------- |
| `AuthForm` | `auth-form/auth-form.tsx` | Shared auth form |

### Plaid Components

| Component | File | Purpose |
| --- | --- | --- |
| `PlaidContext` | `plaid-context/plaid-context.tsx` | Plaid provider |
| `PlaidLinkButton` | `plaid-link-button/plaid-link-button.tsx` | Link bank button |

### Section Cards

| Component | File | Purpose |
| --- | --- | --- |
| `SectionCards` | `section-cards/section-cards.tsx` | Section cards display |

### Total Balance Box

| Component | File | Purpose |
| --- | --- | --- |
| `TotalBalanceBox` | `total-balance-box/total-balance-box.tsx` | Total balance display |

---

## Shadcn-Studio Components (`./src/components/shadcn-studio/blocks/`)

These are shadcn/ui demo/starter components - potential sources for enhancement:

| Component | File | Purpose |
| --- | --- | --- |
| `AccountSettings01` | `blocks/account-settings-01/*` | Account settings UI |
| `ApplicationShell01` | `blocks/application-shell-01/application-shell-01.tsx` | App shell |
| `ChartSalesMetrics` | `blocks/chart-sales-metrics.tsx` | Sales chart |
| `DashboardShell01` | `blocks/dashboard-shell-01/dashboard-shell-01.tsx` | Dashboard shell |
| `DatatableTransaction` | `blocks/datatable-transaction.tsx` | Transaction table |
| `DropdownLanguage` | `blocks/dropdown-language.tsx` | Language selector |
| `DropdownProfile` | `blocks/dropdown-profile.tsx` | Profile dropdown |
| `HeroSection41` | `blocks/hero-section-41/*` | Hero section |
| `MenuDropdown` | `blocks/menu-dropdown.tsx` | Menu dropdown |
| `MenuNavigation` | `blocks/menu-navigation.tsx` | Navigation menu |
| `OnboardingFeed01` | `blocks/onboarding-feed-01/onboarding-feed-01.tsx` | Onboarding feed |
| `StatisticsCard01` | `blocks/statistics-card-01.tsx` | Stats card |
| `WidgetProductInsights` | `blocks/widget-product-insights.tsx` | Product insights |
| `WidgetTotalEarning` | `blocks/widget-total-earning.tsx` | Earnings widget |

---

## Demo Pages (To Be Integrated/Deleted)

Located in `./src/app/demo/`:

| Demo | Path | Source For |
| --- | --- | --- |
| `ApplicationShell01` | `demo/application-shell-01/` | Layout patterns |
| `DashboardShell01` | `demo/dashboard-shell-01/` | Dashboard patterns |
| `HeroSection41` | `demo/hero-section-41/` | Landing page patterns |
| `OnboardingFeed01` | `demo/onboarding-feed-01/` | Feed/list patterns |

---

## Component Index Files

All component directories have index.ts barrel exports following the pattern:

```typescript
// Example: src/components/dashboard/index.ts
export { DashboardClientWrapper } from "./dashboard-client-wrapper";
export { DashboardServerWrapper } from "./dashboard-server-wrapper";
```

---

## Existing Generic Components (Target for Enhancement)

The following exist in `./src/components/layouts/` and should be expanded:

- `GenericCard`, `GenericDataTable`, `GenericEmptyState`
- `GenericForm`, `GenericModal`, `GenericPageShell`
- `GenericSkeleton`, `GenericToast`, `GenericForm`
- `FormField`, `Card`, `Row`, `SectionHeader`

---

## Dependencies Graph

```
Page → ServerWrapper → ClientWrapper → Layout Components → Generic Components
                              ↓
                       UI Components (shadcn/ui)
```
