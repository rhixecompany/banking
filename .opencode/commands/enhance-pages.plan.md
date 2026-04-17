## Plan: Enhance All Next.js Pages and Docs

### Goals

- Validate and harden all pages under `app/` so they follow repo conventions:
  - Server wrappers authenticate before protected data access.
  - Presentational components live under `components/layouts` and are props-only.
  - Shared Zod schemas centralized under `lib/schemas`.
  - DAL-only DB access; no `process.env` in app code.

### Scope

- Small, focused edits per-page (Home, Dashboard, My Wallets, Payment Transfer, Settings, Transaction History, Sign-in/Sign-up, Admin).
- Update docs: `docs/custom-components.md`, `docs/test-context.md`, `docs/app-pages.md`.

### Target Files

- See the file list in the user's plan: app pages, server wrappers, dal/, actions/, lib/schemas, docs/\*.md

### Risks

- Changes that touch many files may exceed the 7-file plan threshold; keep edits minimal.
- Tests/lint may fail until all edits are complete; will run `npm run validate` at the end.

### Planned Changes

1. Create this plan file under `.opencode/commands/` (done).
2. Inspect each page and its wrappers. For each page:
   - Move presentational-only components into `components/layouts/<kebab-name>` if they mix fetching.
   - Add or centralize Zod schemas under `lib/schemas` where duplicated.
   - Ensure server actions validate with Zod and call `auth()` early.
3. Update `docs/custom-components.md`, `docs/test-context.md`, and `docs/app-pages.md` to reflect new inventory.

### Validation

- After edits, run `npm run format` and `npm run type-check` locally.
- Run `npm run validate` to execute lint and tests.

### Rollback / Mitigation

- Changes will be small commits; revert via normal git if necessary.

### Evidence (Files I will read during implementation)

- app/\* pages and components listed in the plan
- dal/_, actions/_, lib/schemas/\*
- docs/custom-components.md, docs/test-context.md, docs/app-pages.md

---

Created by automated agent as requested. Will now inspect the files referenced and apply minimal edits.
