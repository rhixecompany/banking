# Admin group checklist

This checklist covers the work to make admin pages (app/(admin)) DRY, testable, and compliant with repo conventions.

Files:

- app/(admin)/admin/page.tsx
- components/admin/admin-dashboard-server-wrapper.tsx
- components/admin/admin-dashboard-content.tsx
- components/layouts/admin-dashboard/index.tsx
- actions/admin-stats.actions.ts
- dal/admin.dal.ts

Checklist:

1. Verify server wrapper enforces auth() and isAdmin guard (already present).
2. Ensure admin data fetching actions call auth() early and return { ok, ... } shapes (already present).
3. Confirm DAL functions used by admin actions use typed outputs and handle empty states.
4. Add deterministic seed fixtures for admin user (tests/fixtures/seed-admin.json created).
5. Add unit tests for AdminDashboardContent props and behaviors (existing tests should be validated and hardened).
6. Ensure no direct DB imports in components (DAL only).

Use this checklist to track per-file changes and PRs.
