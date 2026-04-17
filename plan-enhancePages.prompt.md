## Plan: Enhance All Next.js Pages and Docs

TL;DR

- Address all current Next.js pages under `app/` sequentially, starting from Home.
- For each page, validate current wrappers, extract or harden presentational components into `components/layouts`, and update unit/E2E coverage.
- Update `docs/custom-components.md`, `docs/test-context.md`, and `docs/app-pages.md` as part of the implementation.
- Do not run typecheck/lint/tests until all pages are enhanced.

Steps

1. Baseline discovery

- Confirmed current page files:
  - `app/page.tsx` (Home)
  - `app/(root)/dashboard/page.tsx`
  - `app/(root)/my-wallets/page.tsx`
  - `app/(root)/payment-transfer/page.tsx`
  - `app/(root)/settings/page.tsx`
  - `app/(root)/transaction-history/page.tsx`
  - `app/(auth)/sign-in/page.tsx`
  - `app/(auth)/sign-up/page.tsx`
  - `app/(admin)/admin/page.tsx`
- Read `docs/custom-components.md`, `docs/test-context.md`, and `docs/app-pages.md` to align with repository conventions.
- Confirmed current wrappers and layout usage for Home, Dashboard, and Payment Transfer.

2. Home page (`app/page.tsx`)

- Validate `components/home/home-server-wrapper.tsx` remains public/static and contains no auth or DAL calls.
- Confirm presentational components are in `components/layouts`: `total-balance`, `features-grid`, `cta-get-started`, and `home-footer`.
- Audit `components/layouts/total-balance/index.tsx` and its unit test.
- If any Home layout component is missing or uses data fetching, extract a props-only component into `components/layouts` and add a dedicated unit test.
- Update docs inventory: add Home component entries and note presentational extraction.

3. Dashboard page

- Validate `app/(root)/dashboard/page.tsx` and `components/dashboard/dashboard-server-wrapper.tsx`.
- Confirm auth via `auth()` and redirects for unauthenticated users.
- Verify the wrapper fetches data through stable actions: `getUserWallets`, `getAllAccounts`, `getRecentTransactions`.
- Ensure the client wrapper is presentational and that any rendering-only components are in `components/layouts`.
- Audit existing tests and add missing unit tests for extracted components, plus deterministic E2E coverage via seed user.

4. My Wallets page

- Validate `app/(root)/my-wallets/page.tsx`, `components/my-wallets/my-wallets-server-wrapper.tsx`, and client wrapper.
- Confirm actions such as `getUserWallets` and DAL helpers in `dal/wallet.dal.ts` are used, not inline fetching.
- Extract card/list components into `components/layouts/wallet-card` if needed.
- Add or harden unit tests and E2E specs.

5. Payment Transfer page

- Validate `app/(root)/payment-transfer/page.tsx` and `components/payment-transfer/payment-transfer-server-wrapper.tsx`.
- Confirm `TransferSchema` is centralized under `lib/schemas/transfer.schema.ts`.
- Ensure `createTransfer` action in `actions/dwolla.actions.ts` performs Zod validation, auth, DAL transaction, and returns `{ ok, error? }`.
- Audit `components/layouts/payment-transfer-form.tsx` and add deterministic unit tests using `autoSubmit` / initial patterns.
- Harden E2E tests with seeded user and mocked Dwolla/Plaid behavior.

6. Settings page

- Validate `app/(root)/settings/page.tsx` and `components/settings/settings-server-wrapper.tsx`.
- Centralize `ProfileSchema` and `PasswordSchema` under `lib/schemas/profile.schema.ts`.
- Confirm `actions/updateProfile.ts` authenticates first, validates input, and returns stable output.
- Add presentational form tests and deterministic authenticated E2E coverage.

7. Transaction History page

- Validate `app/(root)/transaction-history/page.tsx` and `components/transaction-history/transaction-history-server-wrapper.tsx`.
- Ensure `dal/transaction.dal.ts` supports eager-loaded queries with joined wallet metadata to prevent N+1 query patterns.
- Extract list row rendering into `components/layouts/transaction-list` or `transaction-row` as needed.
- Add unit tests for mapping/display logic and strengthen E2E assertions.

8. Sign-in and Sign-up pages

- Validate `app/(auth)/sign-in/page.tsx`, `components/sign-in/sign-in-server-wrapper.tsx`, `app/(auth)/sign-up/page.tsx`, and `components/sign-up/sign-up-server-wrapper.tsx`.
- Confirm `components/auth-form/*` remains presentational and only receives server actions from wrappers.
- Ensure `actions/register.ts` and any auth actions use Zod validation and stable returns.
- Harden E2E auth flows with seeded user credentials and deterministic page navigation.

9. Admin page

- Validate `app/(admin)/admin/page.tsx` and `components/admin/admin-dashboard-server-wrapper.tsx`.
- Confirm admin guard logic is enforced and `admin.actions.ts` checks `isAdmin` on auth.
- Add or harden admin E2E coverage using seeded admin user or deterministic test hooks.

10. Cross-cutting docs updates

- `docs/custom-components.md`: update inventory entries for all extracted layout components, including Home and pages that now use `components/layouts`.
- `docs/test-context.md`: update seeded user details, mock helper guidance, and deterministic Playwright/Vitest patterns.
- `docs/app-pages.md`: update page audit entries with current page list, page wrappers, components, actions, DAL methods, schemas, and tests.

11. Validation gating

- Do not run `npm run type-check`, `npm run lint`, or `npm run test` until all page enhancements are complete.
- After implementation, validate with `npm run validate` and inspect any rule reports.

Relevant files

- `app/page.tsx`
- `app/(root)/dashboard/page.tsx`
- `app/(root)/my-wallets/page.tsx`
- `app/(root)/payment-transfer/page.tsx`
- `app/(root)/settings/page.tsx`
- `app/(root)/transaction-history/page.tsx`
- `app/(auth)/sign-in/page.tsx`
- `app/(auth)/sign-up/page.tsx`
- `app/(admin)/admin/page.tsx`
- `components/home/home-server-wrapper.tsx`
- `components/dashboard/dashboard-server-wrapper.tsx`
- `components/payment-transfer/payment-transfer-server-wrapper.tsx`
- `components/settings/settings-server-wrapper.tsx`
- `components/transaction-history/transaction-history-server-wrapper.tsx`
- `components/my-wallets/my-wallets-server-wrapper.tsx`
- `actions/wallet.actions.ts`
- `actions/transaction.actions.ts`
- `actions/dwolla.actions.ts`
- `actions/recipient.actions.ts`
- `actions/updateProfile.ts`
- `actions/register.ts`
- `actions/admin.actions.ts`
- `dal/wallet.dal.ts`
- `dal/transaction.dal.ts`
- `dal/recipient.dal.ts`
- `dal/admin.dal.ts`
- `lib/schemas/profile.schema.ts`
- `lib/schemas/transfer.schema.ts`
- `docs/custom-components.md`
- `docs/test-context.md`
- `docs/app-pages.md`

Verification

1. Confirm `app/` page list covers all current routes and wrapper files.
2. Confirm that each page’s custom components are extracted into `components/layouts` as presentational units.
3. Confirm server wrappers call `auth()` before protected data fetches and server actions use Zod validation.
4. Confirm docs files are updated to reflect the new inventory and deterministic test context.
5. After completion, run a full validation sweep with the project scripts.

Decisions

- Follow repository conventions from `docs/custom-components.md` and `docs/test-context.md`.
- Keep Home page static/public and move any user-data or auth logic out of `app/page.tsx`.
- Use `components/layouts` for reusable presentational components and unit tests.
- Use seeded deterministic E2E paths for authenticated scenarios.

Further considerations

1. Inspect current E2E specs for skipped or flaky tests and convert them to seeded deterministic flows.
2. Where presentational components already exist, verify their tests instead of recreating them unnecessarily.
3. If any page uses raw DB access or runtime `process.env`, remediate it under the project rules before validation.
