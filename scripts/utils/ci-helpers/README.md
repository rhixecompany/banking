# CI Helpers

## Usage

- Parse reports (generate ci-summary.json): npx tsx scripts/utils/ci-helpers/parse-reports.ts
- Parse reports (generate ci-summary.json): npx tsx scripts/utils/ci-helpers/parse-reports.ts

- Orchestrator (run CI wrapper or fallback to npm scripts): npx tsx scripts/utils/ci-helpers/index.ts [--apply]

- Report parser (richer parsing): npx tsx scripts/utils/ci-helpers/report-parser.ts

- Targeted test runner (re-run failing vitest files): npx tsx scripts/utils/ci-helpers/targeted-test-runner.ts [--apply]

- Lint fix wrapper: npx tsx scripts/utils/ci-helpers/lint-fix-wrapper.ts [--apply]

- Seed prep for Playwright: npx tsx scripts/utils/ci-helpers/seed-prep.ts [--apply]

- Git commit helper: npx tsx scripts/utils/ci-helpers/git-commit-helper.ts "commit message" <files...> [--apply]

- Fast-check (run checks only on changed files): npx tsx scripts/utils/ci-helpers/fast-check.ts [--apply]

## Safety

- By default helpers run in read-only/dry-run mode. Pass --apply to allow safe auto-fixes (eslint --fix, seed, git commit, etc.).
