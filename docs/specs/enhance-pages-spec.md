# Spec: enhance-pages-spec

Scope: repo

Spec: enhance-pages-spec Scope: repo

Checks and enforcement:

1. Routes normalization: ensure no path strings include parenthetical group markers in code or tests. (ts-morph check)
2. Layouts: ./components/layouts must exist and export RootLayoutWrapper, AuthLayoutWrapper, AdminLayoutWrapper, PageShell.
3. Stores: all store imports must resolve to files under ./stores or ./lib/stores and must be typed. No 'any' return types in store files.
4. Tests: no skipped tests (it.each/skip) or 'test.skip' in tests/; no nondeterministic waits (use await page.waitForURL / getByRole assertions). E2E tests must use seeded credentials from tests/fixtures/seed-user.json.
5. Scripts: ./scripts must have TS implementations for major actions with --dry-run flag and unit tests for ts scripts.
6. MCP tooling: @scripts/mcp-runner.ts must implement dry-run catalog mode and update .opencode/mcp_servers.json in dry-run by default.

Required verification steps:

- Run ts-morph checks via npm run scripts:validate-ts (new script)
- Run npm run format && npm run type-check && npm run lint:strict
- Run npm run verify:rules and assert zero critical findings
- Run vitest unit tests and targeted Playwright E2E smoke tests using seeded DB and fixtures

If any check fails, the change must be reverted and a follow-up issue created.
