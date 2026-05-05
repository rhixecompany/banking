---
plan name: lint-e2e-fix
plan description: Fix lint OOM, markdown, tests, E2E
plan status: done
---

## Idea

Full lint validation chain is broken by three distinct root causes: (1) ESLint OOMs on this Windows machine when processing all files at once — fixed by NODE_OPTIONS heap flag; (2) The eslint.config.mts `globalIgnores(["**/*.md"])` does NOT suppress the explicit `files: ["**/*.md"]` markdown processor block at lines 883–961, so markdown is still parsed causing ~199 virtual-file errors; (3) Two try/catch blocks with conditional `expect` calls remain in transaction.dal.test.ts (lines 97–103 and 165–170) plus a `let` that should be `const` in settings-content.test.tsx:257. After lint is clean, run the full validate suite then Playwright E2E.

## Implementation

- Fix OOM: add NODE_OPTIONS=--max-old-space-size=4096 to lint, lint:strict, lint:fix, and type-check scripts in package.json so the process does not get killed mid-run
- Fix ESLint markdown conflict: remove the markdown processor block (lines 883–890) and the virtual-file rules block (lines 891–961) from eslint.config.mts — globalIgnores already excludes all .md files so those blocks are dead code and actively trigger re-inclusion of ignored files
- Fix remaining conditional expect errors in tests/unit/dal/transaction.dal.test.ts — unwrap the try/catch at lines 97-103 and 165-170 by moving expects outside of catch blocks (same pattern already applied to lines 88-94 and recipient.dal.test.ts)
- Fix prefer-const in tests/unit/components/settings-content.test.tsx:257 — change `let removeGoogleBtn` to `const removeGoogleBtn` since it is never reassigned
- Run bun run lint to confirm 0 errors (warnings acceptable); if new OOM-free errors surface, fix them file by file
- Run bun run type-check to confirm 0 TypeScript errors
- Run bun run verify:rules to confirm 0 policy violations
- Run bun run test:browser (Vitest) to confirm all unit tests still pass after test file edits
- Free port 3000 (per AGENTS.md port guard), then run bun run test:ui (Playwright E2E with PLAYWRIGHT_PREPARE_DB=true) to surface any E2E failures
- Fix any E2E failures found — check console errors, selector mismatches, or DB seed issues
- Run bun run validate (full suite) to confirm all checks pass end-to-end before committing
- Commit all changes with a clear summary message following repo commit conventions

## Required Specs

<!-- SPECS_START -->

- encryption-tests
- enhance-pages-spec
- enhance-pages-v2
- plan-ensure-tests
- root-tests
- settings-content-tests
- skills-catalog
- user-dal-tests
- wallet-dal-tests
- lint-e2e-fix
<!-- SPECS_END -->
