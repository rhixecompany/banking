---
title: Custom Components Inventory
---

# Custom Components (excluding components/ui)

This file lists custom components found under `components/`, excluding the `components/ui/` library items.

Each entry: path — short description — refactor candidates

- components/dashboard/dashboard-client-wrapper.tsx — Dashboard client wrapper; renders wallet list and onboarding — candidate: split WalletList, OnboardingCard
- components/dashboard/dashboard-server-wrapper.tsx — Server wrapper for dashboard data fetching — OK
- components/my-wallets/my-wallets-client-wrapper.tsx — My Wallets client wrapper — candidate: WalletCard, WalletList
- components/my-wallets/\* — various subcomponents used by my-wallets page — likely candidates to genericize
- components/bank/BankDropdown.tsx — Select dropdown for wallets — candidate: generic Dropdown / SelectItem
- components/bank/BankInfo.tsx — Bank card with balance display — candidate: Card + Meta + Balance components
- components/payment/PaymentTransferForm.tsx — Transfer form including BankDropdown and validations — candidate: FormField primitives, AmountInput
- components/Copy.tsx — Small copy-to-clipboard button — keep as-is or move to components/layouts/primitives
- components/Category.tsx — Category card used on dashboard — candidate: GenericStatCard
- components/BankTabItem.tsx — Tab item for banks list — small, keep

Notes:

- Many components are composite (UI + data mapping). Splitting presentational primitives into `components/layouts` will improve reuse and testability.
- Recommended new layout components: `Card`, `List`, `ListItem`, `Dropdown`, `FormField`, `AmountInput`, `BalanceDisplay`.
