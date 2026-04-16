# Home Page — Audit & Minimal Change Plan

Files to Open

- app/page.tsx
- components/home/home-server-wrapper.tsx
- components/home/home-client-wrapper.tsx
- components/shared/wallets-overview.tsx
- components/total-balance-box/total-balance-box.tsx
- tests/unit/\* referencing the above

Audit Goals

- Identify any ad-hoc DB queries executed inside React components (client or server). Move these into dal/\*.
- Identify server actions used by Home: ensure they use Zod validation, call auth() if protected, and return { ok, error? }.
- Identify components that mix fetching and presentation. Extract presentational pieces to components/layouts/ if present.

Minimal Change Plan (target <10 files)

1. Extract presentational component for Total Balance into components/layouts/total-balance/index.tsx.
   - Move JSX and props-only logic; add total-balance.test.tsx.

2. Ensure home-server-wrapper imports dal/\* for any DB access. If ad-hoc queries found in components/shared/wallets-overview.tsx, move them to dal/wallets.ts and update imports.

3. Check server actions used by Home. For each action:
   - Wrap inputs in Zod schema with descriptive messages.
   - Call auth() at the action top if the action requires an authenticated user.
   - Return { ok: boolean; error?: string } and avoid throwing unhandled errors.

4. Update docs/app-pages.md and docs/custom-components.md entries for Home.

Verification

- Run unit tests for changed units locally (optional per your preference). Since you chose to defer checks, tests will be run after all pages complete.

Estimated Files Changed

- components/layouts/total-balance/index.tsx (+ test)
- components/home/home-server-wrapper.tsx (edit)
- components/shared/wallets-overview.tsx (edit)
- dal/wallets.ts (new or edit)
- docs/app-pages.md (edit)
- docs/custom-components.md (edit)

Notes

- If dal changes appear large during the audit, add the page to docs/dal-schedule.md and skip heavy DAL work per your preference.

Additional Notes / Constraints:

- Home is a public, static landing page. Do NOT add auth() or any DAL/database calls to app/page.tsx, home-server-wrapper, or home-client-wrapper.
- If the UI needs to demonstrate user-specific data (balances, wallets), render presentational components with static/mock props only and move real user-data wiring to Dashboard.

TODOs (follow-up):

- Explicitly document the static-home constraint in docs/app-pages.md.
- Wire the presentational TotalBalance layout into the HomeServerWrapper with static props so the layout is exercised without introducing auth/DB.
- Add or verify unit tests under tests/unit to cover the TotalBalanceBox and its layout wrapper.
