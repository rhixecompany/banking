# Custom Components — Inventory & Guidelines

**Date:** 2026-04-24  
**Scope:** All custom components in `./components/**` (excluding `./components/ui/**`)  
**Status:** IN_PROGRESS

---

## Purpose

Capture conventions for custom components that are referenced directly by pages, excluding the component library under `./components/ui`.

---

## Guidelines

### Structure

- Prefer presentational components to be pure (props-only) and free of fetching logic
- If a component mixes fetching + rendering, extract the presentational part into `components/layouts`
- Components under `components/layouts` should be kebab-cased folders with an `index.tsx` exporting the primary component

### Tests

- Add unit tests for presentational components
- Keep DOM interaction minimal and avoid heavy E2E testing for presentational-only pieces

### Naming

- Components under `components/layouts` should be kebab-cased folders with an `index.tsx`
- Example: `components/layouts/total-balance/index.tsx` + `total-balance.test.tsx`

---

## Inventory

### Layout Components (`components/layouts/`)

| Component | Path | Status | Notes |
| --- | --- | --- | --- |
| **RootLayoutWrapper** | `components/layouts/RootLayoutWrapper.tsx` | ✅ Presentational | Main app shell with header/sidebar |
| **AuthLayoutWrapper** | `components/layouts/AuthLayoutWrapper.tsx` | ✅ Presentational | Auth pages wrapper |
| **AdminLayoutWrapper** | `components/layouts/AdminLayoutWrapper.tsx` | ✅ Presentational | Admin pages wrapper |
| **PageShell** | `components/layouts/PageShell.tsx` | ✅ Presentational | Reusable page container |
| **AuthForm** | `components/layouts/auth-form/index.tsx` | ✅ Presentational | Login/register form template |
| **TotalBalance** | `components/layouts/total-balance/index.tsx` | ✅ Presentational | Balance display with chart |
| **WalletCard** | `components/layouts/wallet-card/index.tsx` | ✅ Presentational | Individual wallet display |
| **TransactionList** | `components/layouts/transaction-list.tsx` | ✅ Presentational | Transaction list renderer |
| **TransactionHistoryClient** | `components/layouts/transaction-history-client/index.tsx` | ✅ Presentational | Transaction table component |
| **PaymentTransferForm** | `components/layouts/payment-transfer-form.tsx` | ✅ Presentational | Transfer form (schema-agnostic) |
| **PaymentTransferClient** | `components/layouts/payment-transfer-client/index.tsx` | ✅ Presentational | Transfer page wrapper |
| **SettingsProfileForm** | `components/layouts/settings-profile-form.tsx` | ✅ Presentational | Profile settings form |
| **SettingsClient** | `components/layouts/settings-client/index.tsx` | ✅ Presentational | Settings page wrapper |
| **MyWalletsClient** | `components/layouts/my-wallets-client/index.tsx` | ✅ Presentational | Wallets page wrapper |
| **DashboardClient** | `components/layouts/dashboard-client/index.tsx` | ✅ Presentational | Dashboard page wrapper |
| **AdminDashboard** | `components/layouts/admin-dashboard/index.tsx` | ✅ Presentational | Admin dashboard wrapper |
| **AdminData** | `components/layouts/admin-data/index.tsx` | ✅ Presentational | Admin data table |
| **AdminSidebar** | `components/layouts/admin-sidebar.tsx` | ✅ Presentational | Admin navigation |
| **TransferSummary** | `components/layouts/transfer-summary.tsx` | ✅ Presentational | Transfer confirmation |
| **HomeFooter** | `components/layouts/home-footer.tsx` | ✅ Presentational | Landing page footer |
| **FeaturesGrid** | `components/layouts/features-grid.tsx` | ✅ Presentational | Landing page features |
| **CtaGetStarted** | `components/layouts/cta-get-started.tsx` | ✅ Presentational | Call-to-action component |
| **DataTable** | `components/layouts/data-table/index.tsx` | ✅ Presentational | Reusable data table |
| **Card** | `components/layouts/card/index.tsx` | ✅ Presentational | Generic card component |
| **Row** | `components/layouts/row/index.tsx` | ✅ Presentational | Row layout component |
| **Form** | `components/layouts/form/index.tsx` | ✅ Presentational | Form utilities |
| **FormField** | `components/layouts/form/form-field.tsx` | ✅ Presentational | Form field component |
| **PlaidProvider** | `components/layouts/plaid-provider.tsx` | ⚠️ Provider | Plaid context provider |
| **AuthPageWrapper** | `components/layouts/auth-page-wrapper.tsx` | ✅ Presentational | Auth page layout |
| **WalletCard (root)** | `components/layouts/wallet-card.tsx` | ⚠️ Legacy | Root-level duplicate - consider removing |

### Server Wrappers (`components/*/`)

| Wrapper | Path | Status | Notes |
| --- | --- | --- | --- |
| **HomeServerWrapper** | `components/home/home-server-wrapper.tsx` | ✅ Pattern | Landing page data |
| **DashboardServerWrapper** | `components/dashboard/dashboard-server-wrapper.tsx` | ✅ Pattern | Dashboard auth + fetch |
| **SettingsServerWrapper** | `components/settings/settings-server-wrapper.tsx` | ✅ Pattern | Settings auth + fetch |
| **PaymentTransferServerWrapper** | `components/payment-transfer/payment-transfer-server-wrapper.tsx` | ✅ Pattern | Transfer auth + fetch |
| **TransactionHistoryServerWrapper** | `components/transaction-history/transaction-history-server-wrapper.tsx` | ✅ Pattern | History auth + fetch |
| **MyWalletsServerWrapper** | `components/my-wallets/my-wallets-server-wrapper.tsx` | ✅ Pattern | Wallets auth + fetch |
| **SignInServerWrapper** | `components/sign-in/sign-in-server-wrapper.tsx` | ✅ Pattern | Sign-in auth check |
| **SignUpServerWrapper** | `components/sign-up/sign-up-server-wrapper.tsx` | ✅ Pattern | Sign-up auth check |
| **AdminDashboardServerWrapper** | `components/admin/admin-dashboard-server-wrapper.tsx` | ✅ Pattern | Admin auth + fetch |
| **NotFoundServerWrapper** | `components/not-found/not-found-server-wrapper.tsx` | ✅ Pattern | 404 page data |

### Client Wrappers (`components/*/`)

| Wrapper | Path | Status | Notes |
| --- | --- | --- | --- |
| **SignInClient** | `components/sign-in/SignInClient.tsx` | ✅ Presentational | Sign-in form UI |
| **SignInClientWrapper** | `components/sign-in/sign-in-client-wrapper.tsx` | ✅ Presentational | Sign-in page wrapper |
| **SignUpClient** | `components/sign-up/SignUpClient.tsx` | ✅ Presentational | Sign-up form UI |
| **SignUpClientWrapper** | `components/sign-up/sign-up-client-wrapper.tsx` | ✅ Presentational | Sign-up page wrapper |
| **MyWalletsClientWrapper** | `components/my-wallets/my-wallets-client-wrapper.tsx` | ✅ Presentational | Wallets page UI |
| **TransactionHistoryClientWrapper** | `components/transaction-history/transaction-history-client-wrapper.tsx` | ✅ Presentational | History page UI |

### Feature Components (`components/`)

| Component | Path | Status | Notes |
| --- | --- | --- | --- |
| **Sidebar** | `components/sidebar/sidebar.tsx` | ✅ Presentational | Navigation sidebar |
| **MobileNav** | `components/mobile-nav/mobile-nav.tsx` | ✅ Presentational | Mobile navigation |
| **TotalBalanceBox** | `components/total-balance-box/total-balance-box.tsx` | ✅ Presentational | Balance display card |
| **WalletsOverview** | `components/shared/wallets-overview.tsx` | ✅ Presentational | Wallet list display |

### Other Components

| Component | Path | Status | Notes |
| --- | --- | --- | --- |
| **RootLayoutWrapperNotice** | `components/layouts/RootLayoutWrapperNotice.tsx` | ⚠️ Legacy | Notice wrapper - check if needed |
| **AdminLayoutWrapperNotice** | `components/layouts/AdminLayoutWrapperNotice.tsx` | ⚠️ Legacy | Admin notice wrapper - check if needed |
| **MobileNav (root)** | `components/mobile-nav/mobile-nav.tsx` | ✅ Presentational | Mobile navigation |

### shadcn-studio Components (Non-production)

| Component | Path | Status | Notes |
| --- | --- | --- | --- |
| MenuNavigation | `components/shadcn-studio/blocks/menu-navigation.tsx` | ⚠️ Demo | Demo component |
| WidgetTotalEarning | `components/shadcn-studio/blocks/widget-total-earning.tsx` | ⚠️ Demo | Demo component |
| WidgetProductInsights | `components/shadcn-studio/blocks/widget-product-insights.tsx` | ⚠️ Demo | Demo component |
| StatisticsCard01 | `components/shadcn-studio/blocks/statistics-card-01.tsx` | ⚠️ Demo | Demo component |
| OnboardingFeed01 | `components/shadcn-studio/blocks/onboarding-feed-01/onboarding-feed-01.tsx` | ⚠️ Demo | Demo component |
| MenuDropdown | `components/shadcn-studio/blocks/menu-dropdown.tsx` | ⚠️ Demo | Demo component |
| HeroSection41 | `components/shadcn-studio/blocks/hero-section-41/hero-section-41.tsx` | ⚠️ Demo | Demo component |

---

## Categorization Summary

| Category                 | Count | Status             |
| ------------------------ | ----- | ------------------ |
| **Layout Components**    | 30    | ✅ Well-organized  |
| **Server Wrappers**      | 10    | ✅ Correct pattern |
| **Client Wrappers**      | 6     | ✅ Presentational  |
| **Feature Components**   | 4     | ✅ Clean           |
| **Other**                | 2     | ✅ OK              |
| **shadcn-studio (Demo)** | 7     | ⚠️ Non-production  |
| **Total Custom**         | ~52   | ✅ Good shape      |

---

## Compliance Assessment

### ✅ Compliant Patterns

| Requirement | Status | Evidence |
| --- | --- | --- |
| Server wrappers handle auth | ✅ | All 10 use `auth()` pattern |
| Server wrappers do data fetching | ✅ | Parallel `Promise.all()` for efficiency |
| Presentational components are pure | ✅ | Props-only, no DB access |
| Folder structure follows convention | ✅ | `components/layouts/*/index.tsx` |
| Client/server separation | ✅ | Clear `-server-wrapper.tsx` / `-client-wrapper.tsx` |

### ⚠️ Issues Identified

| Issue | Location | Priority | Notes |
| --- | --- | --- | --- |
| Duplicate wallet-card | `components/layouts/wallet-card.tsx` + `wallet-card/index.tsx` | Low | Consider removing root-level duplicate |
| Legacy notice wrappers | `RootLayoutWrapperNotice.tsx`, `AdminLayoutWrapperNotice.tsx` | Low | Verify if still needed |
| shadcn-studio demo components | `components/shadcn-studio/` | Low | Non-production, can ignore |
| Missing Suspense boundaries | All pages | Medium | Could add loading states |

---

## Refactoring Candidates

### High Priority

None identified — current architecture is clean.

### Medium Priority

| Candidate | Issue | Suggestion |
| --- | --- | --- |
| All pages | No Suspense boundaries | Add `<Suspense>` wrappers for loading states |

### Low Priority

| Candidate | Issue | Suggestion |
| --- | --- | --- |
| Duplicate WalletCard | Two locations | Remove `wallet-card.tsx`, keep `wallet-card/index.tsx` |
| Notice wrappers | Unclear purpose | Audit and either remove or document |

---

## Schema Cross-Reference

All shared Zod schemas should live in `lib/schemas/`. Current schemas:

| Schema | Path | Used By |
| --- | --- | --- |
| TransferSchema | `lib/schemas/transfer.schema.ts` | `payment-transfer-form.tsx`, `createTransfer` action |

---

## Recommendations

1. **Add Suspense boundaries** — Wrap server components in pages with Suspense for loading states
2. **Remove duplicates** — Clean up legacy `wallet-card.tsx` at root level
3. **Document notice wrappers** — Determine if `RootLayoutWrapperNotice` and `AdminLayoutWrapperNotice` are still needed
4. **Keep current pattern** — Server wrapper + client wrapper separation is excellent

---

## Verification Checklist

- [x] All custom components listed
- [x] Categories applied
- [x] Split candidates identified
- [ ] Compliance issues resolved (optional)
- [ ] markdownlint passes

---

## References

- `docs/app-pages.md` — Per-page component usage
- `AGENTS.md` — Canonical component patterns
- `.opencode/instructions/02-nextjs-patterns.md` — Next.js patterns
