Files changed in admin bundle:

- app/(admin)/layout.tsx — changed non-admin redirect from "/dashboard" to "/" per policy.
- components/layouts/admin-dashboard/index.tsx — new re-export so presentational admin content follows components/layouts convention.
- components/admin/admin-dashboard-server-wrapper.tsx — updated import to use the new re-export path.
- tests/unit/admin-dashboard.layout.test.tsx — new smoke test to assert the layout re-export resolves and renders with minimal props.

Additional minor additions:

- components/layouts/admin-data/index.tsx — re-export of admin-data presentational constants.

Files read (provenance):

- app/(admin)/layout.tsx — to locate the admin guard and modify redirect target.
- components/admin/admin-dashboard-server-wrapper.tsx — to change import to new layout re-export.
- components/admin/admin-dashboard-content.tsx — to learn prop types before creating matching unit test props.
- actions/admin.actions.ts — inspected to confirm server actions enforce session + isAdmin checks.
- dal/admin.dal.ts (grep) — to confirm DAL has admin helpers (no edits made).

Rationale and testing notes:

This patch enforces the repo policy to redirect non-admins to the site root. It also begins the extraction of admin presentational components into components/layouts by re-exporting the existing AdminDashboardContent. Adding the re-export and updating server wrapper imports is a minimal, reversible change that keeps behavior identical while moving toward the target structure. The unit test ensures the re-export can be resolved by tests and that prop shapes are understood.
