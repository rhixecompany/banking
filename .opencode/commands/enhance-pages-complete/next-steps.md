Next steps (implementation phase)

1. Create feature branches (one per group)

- feature/enhance/auth-layouts
- feature/enhance/admin-layouts
- feature/enhance/root-layouts
- feature/enhance/home

2. For each branch (example: auth):

- Refactor components used by pages in the group to follow components/layouts patterns
- Convert any direct DAL usage in server wrappers to dal/\* helpers
- Ensure Server Actions have "use server", auth() early, Zod validation, and consistent {ok:boolean} return
- Update unit tests to use seeded mocks or the seeded DB (run per-group unit tests only)
- Run local verification for modified modules
- Commit, push branch, open draft PR using pr-template

3. Scripts modernization (parallel work):

- Consolidate script functions into TypeScript modules in scripts/ts
- Ensure ts-morph utilities are used for code edits
- Add --dry-run to destructive scripts and unit tests for scripts

4. Finalization (after all groups merged):

- Run full pipeline: format -> type-check -> lint:strict -> verify:rules -> test
- Address any errors and finalize PRs for merge

Notes:

- Keep changes small and focused (<=5-file automated edits per PR where possible). If a change must touch >7 files, create a plan under .opencode/commands/ as required.
