# Custom Components — Inventory & Guidelines

Purpose

- Capture conventions for custom components that are referenced directly by pages (excluding the component library under ./components/ui).

Guidelines

- Structure: prefer presentational components to be pure (props-only) and free of fetching logic. If a component mixes fetching + rendering, extract the presentational part into components/layouts.
- Tests: add unit tests for presentational components. Keep DOM interaction minimal and avoid heavy E2E testing for presentational-only pieces.
- Naming: components under components/layouts should be kebab-cased folders with an index.tsx exporting the primary component.

Example

- components/layouts/total-balance/
  - index.tsx
  - total-balance.test.tsx

Inventory

- This document is a living inventory. Use the per-page audits (docs/app-pages.md) and the per-page plan artifacts to keep this list up to date.

Current components (non-ui library) referenced directly by pages

- components/total-balance-box/total-balance-box.tsx — Presentational card showing total balance and chart. Candidate to extract into components/layouts/total-balance with a small unit test.
  - Note: `components/layouts/total-balance` has been added and includes `index.tsx` and `total-balance.test.tsx`.

Helpers & Test notes:

- Added `tests/fixtures/seed-user.json` as the canonical seeded test user.
- Added `tests/mocks/handlers.ts` with a minimal MSW handler and updated `tests/setup.ts` to start an MSW server for unit tests.
- components/shared/wallets-overview.tsx — Presentational list of linked wallets with optional actions. Candidate to split into a pure WalletCard under components/layouts/wallet-card and a wrapper that handles onRemove.
- components/payment-transfer/payment-transfer-client-wrapper.tsx — Client wrapper that contains TransferSchema and form wiring; TransferSchema should be moved to lib/schemas/transfer.schema.ts and the presentational PaymentTransferForm (already under components/layouts) kept schema-agnostic.
- components/payment-transfer/payment-transfer-server-wrapper.tsx — Server wrapper (auth + parallel fetch) that correctly passes createTransfer server action into the client wrapper (pattern is correct).
- components/transaction-history/\* — Client mapping and datatable pieces. Transaction rows should be rendered by a presentational component under components/layouts/transaction-row and DAL should provide eager-loaded wallet metadata to avoid N+1 queries.
- components/settings/\* — Client/server wrappers currently duplicate ProfileSchema and PasswordSchema. Move schemas to lib/schemas/profile.schema.ts and import both server- and client-side where needed.
- components/auth-form/\* — Reusable auth UI used by sign-in and sign-up pages. Keep presentational and behaviour separated; server actions should be injected by the server wrapper.

Actionable Guidelines

- Extraction rule: If a component mixes data fetching or auth with rendering, extract a components/layouts/<kebab-name> presentational component that accepts props only (data + callbacks). Keep server wrappers responsible for fetch/auth and pass props down.
- Schema centralization: All Zod schemas that are shared by server and client must live under lib/schemas/ with explicit .describe() messages per AGENTS.md. Client wrappers should import types from those schemas rather than re-defining them.
- DAL responsibilities: components must not perform DB access. If a page requires joined metadata (for example transactions with wallet names), add a dal helper (e.g., transactionDal.findByUserIdWithWallets) that returns the joined data in one query.
- Tests: Add unit tests for extracted presentational components under the same folder as the component (e.g., components/layouts/total-balance/total-balance.test.tsx). Keep tests fast and deterministic: prefer mocking server actions and using the autoSubmit + initial\* pattern for form-based components in unit tests.
- Naming: components/layouts folders should be kebab-cased and export a single default component via index.tsx. Keep file names small and consistent with existing project conventions.

How to update this file

- When you extract or create a presentational component, add a single-line inventory entry here describing the component, its path, and any migration notes (for example: moved TransferSchema -> lib/schemas/transfer.schema.ts).
- When you add a shared schema under lib/schemas/, add a cross-reference line here to indicate which components/pages consume it.

Maintenance notes

- This file is intended to be low-friction and updated whenever a presentational extraction happens. It helps reviewers quickly identify where UI-only components live and where server wrappers provide data/behaviour.

(End of file)
