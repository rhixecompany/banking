# Custom Components Inventory (excluding ./components/ui)

Notes

- This file enumerates non-ui library custom components that warrant audit/refactor.
- Pattern observed: server-wrapper → client-wrapper is common (keep that pattern).
- Target location for extracted reusable dynamic/generic components: `./components/layouts`.

Inventory (selected, prioritized)

1. components/home/home-server-wrapper.tsx
   - Purpose: server fetch + pass server actions to home-client-wrapper
   - Candidate: keep wrapper but ensure server actions use dal/\*, Zod validation for inputs, and return stable shapes.

2. components/home/home-client-wrapper.tsx
   - Purpose: renders home UI using child components
   - Candidate for split: extract header, balances, wallets-overview as isolated presentational components.

3. components/my-wallets/my-wallets-server-wrapper.tsx
   - Purpose: wallet list + plaids
   - Important: interacts with actions/plaid.actions.ts — audit for mock short-circuits and DAL usage.

4. components/payment-transfer/payment-transfer-server-wrapper.tsx
   - Purpose: server prerequisites for transfer page
   - Candidate: keep but validate all inputs with Zod and ensure createTransfer contract follows repo server-action shape.

5. components/payment-transfer/payment-transfer-client-wrapper.tsx
   - Contains: Transfer form schema (z.object used inside client wrapper)
   - Candidate: extract TransferForm (presentational) and TransferFormContainer (form wiring) into reusable parts in components/layouts.

6. components/dashboard/dashboard-server-wrapper.tsx and dashboard-client-wrapper.tsx
   - Purpose: aggregates accounts, recent transactions, wallets
   - Candidate for split: break dashboard into multiple smaller widgets (statistics, transactions table, wallet overview) — already present as shadcn-studio blocks; formalize into reusable widgets under components/layouts.

7. components/transaction-history/\*
   - Candidate: data-table likely generic — ensure data-table is reusable and abstracted from server fetching.

8. components/site-header/site-header.tsx
   - Purpose: navigation + auth controls
   - Candidate: split static layout vs auth state handling (auth calls should be in server wrapper or top-level).

9. components/sidebar/sidebar.tsx and components/layouts/admin-sidebar.tsx
   - Purpose: main navigation
   - Candidate: keep as layout components in `components/layouts` (admin-sidebar already there).

10. components/data-table/data-table.tsx
    - Purpose: generic table used across dashboards & transaction lists
    - Candidate: ensure props are explicit and extract cell renderers; add tests for accessibility & columns API.

11. components/plaid-link-button/plaid-link-button.tsx
    - Purpose: Plaid Link integration
    - Candidate: ensure Plaid mock short-circuit detection is preserved, and the component is pure-presentational with server-action wiring done at wrapper-level.

12. components/shadcn-studio/blocks/\*
    - Many presentational blocks. Candidate: move stable blocks used across pages into components/layouts or components/shared.

Split candidates (high-level criteria)

- Components > 300-400 lines or mixing data fetching + presentation.
- Components that are used in multiple pages (e.g., data-table, wallets-overview, total-balance-box).
- Components that include server actions or direct DAL calls — move those calls into server-wrapper or dal/\*.

Recommendations

- For each candidate component:
  1. Extract presentational pieces (stateless) into components/layouts (or components/shared when appropriate).
  2. Move data fetching to server-wrapper or actions; use dal/\* for DB access.
  3. Add unit tests for extracted presentational components.
  4. Ensure typing (props) is explicit and small surface area to encourage reuse.

Proposed moves into ./components/layouts (examples)

- components/layouts/wallets-overview.tsx (extracted from shared wallet component)
- components/layouts/transfer-form.tsx (presentational)
- components/layouts/transactions-table.tsx (wrapper around data-table)
- components/layouts/header.tsx / components/layouts/navigation.tsx
