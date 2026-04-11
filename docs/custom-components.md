# Custom Components Inventory

This document lists custom components under components/ excluding components/ui. For each component we record: path, likely client/server, notes and candidate for extraction.

- components/plaid-link/plaid-link.tsx — Client — Plaid link button; candidate for extraction of simple Button wrapper and token-fetching hook.
- components/plaid-context/plaid-context.tsx — Client — Provides Plaid context/provider; central to Plaid embed fix.
- components/site-header/site-header.tsx — Likely Client — header UI
- components/shadcn-studio/... — Mixed — template blocks (keep as-is unless duplication noticed)
- components/site-header/site-header.tsx — Client — header
- components/settings/settings-client-wrapper.tsx — Client
- components/section-cards/section-cards.tsx — Server/Client (depends on props) — candidate for split into Card + Layout
- components/plaid-link-button/plaid-link-button.tsx — Client — simple wrapper around Plaid Link UI
- components/nav-user/nav-user.tsx — Client
- components/app-sidebar/app-sidebar.tsx — Client — layout
- components/data-table/data-table.tsx — Client — candidate for generic table component in components/layouts
- components/home/home-server-wrapper.tsx — Server
- components/home/home-client-wrapper.tsx — Client
- components/dashboard/\* — Mixed — server/client wrappers used in dashboard
- components/my-wallets/\* — Mixed — wallet-specific components; some parts could be extracted to generic WalletCard
- components/payment-transfer/\* — Mixed — contains server & client wrappers
- components/transaction-history/\* — Mixed — server/client wrappers
- components/sign-up/_ and sign-in/_ — Auth form wrappers (split form controls and container)
- components/custom-input/custom-input.tsx — Client — candidate for generic input wrapper
- components/total-balance-box/total-balance-box.tsx — Client — presentational

Notes:

- Many components follow the server-wrapper / client-wrapper pattern; extract presentational components where possible into components/layouts to maximize reusability.
- Plaid components are central to the Plaid embed issue and will be prioritized.
