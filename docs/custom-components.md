# Custom Components (excluding `components/ui`)

Last updated: 2026-04-12

Summary

- Custom components discovered (excluding `components/ui`): 60+ (truncated list below)
- Candidate components for splitting into smaller, reusable units are marked.

| Component | Path | Props (summary) | Used By / Notes | Candidate Split? |
| --- | --- | --- | --- | --- |
| Plaid context/provider | `components/plaid-context/plaid-context.tsx` | `userId`, `onSuccess?`, `children` | Provides Plaid Link token + script; used by protected layout | Yes — keep provider, move to `components/layouts/plaid-provider.tsx` |
| Plaid link | `components/plaid-link/plaid-link.tsx` | `userId`, `onSuccess?`, UI props | Uses `usePlaidLink`; supports provider-backed and local init | Yes — split: `usePlaidClient` hook + `PlaidLinkButton` UI |
| Plaid link button | `components/plaid-link-button/plaid-link-button.tsx` | `onSuccess?`, `variant`, `size` | Simple wrapper that consumes Plaid context | No (keep small) |
| Site header | `components/site-header/site-header.tsx` | — | Top-level header component; contains nav and user menu | Yes — split into `Logo`, `MainNav`, `UserMenu` |
| Data table | `components/data-table/data-table.tsx` | `columns`, `data`, `onSort` | Used in admin and transactions | Yes — split into `GenericTable`, `ColumnDefs`, `RowRenderer` |
| Sidebar(s) | `components/sidebar/sidebar.tsx`, `components/app-sidebar/app-sidebar.tsx` | `user` | App navigation; repeated patterns | Possibly — extract `SidebarNavItem`, `SidebarSection` |
| Total balance / header boxes | `components/total-balance-box`, `components/header-box` | numeric props | UI display components — share animation logic | Yes — extract `useAnimatedNumber` hook and generic card wrapper |
| Chart components | `components/chart-area-interactive`, `components/doughnut-chart` | data, options | Heavy client libs — use dynamic import | Yes — move to `components/layouts/charts/*` and lazy load |
| Server/client wrappers | many `*-server-wrapper.tsx` / `*-client-wrapper.tsx` | children, loader | Good pattern for server/client separation — keep but standardize naming | No |

Recommendations

- Create `components/layouts` (approved): move reusable dynamic generic components there with kebab-case filenames, e.g.:
  - `components/layouts/plaid-provider.tsx` (canonical provider + single-script guard)
  - `components/layouts/generic-table.tsx` (table skeleton + column API)
  - `components/layouts/chart-wrapper.tsx` (dynamic import + suspense)
- Extract shared hooks into `components/layouts/hooks/` or `lib/ui-hooks/`, e.g., `useAnimatedNumber`, `useAsyncButton`.
- Use `next/dynamic` for heavy client-only components (chart.js, react-plaid-link, large chart libs).

Action items

- Implement `PlaidProvider` canonical loader and update all Plaid consumers to prefer provider (many already call `usePlaidSafe`).
- Replace repeated table implementations with a `GenericTable` small API and incremental migration.
- Move chart components to a dynamically imported layouts folder.
