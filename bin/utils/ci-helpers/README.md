# CI Helpers

## Usage

- Parse reports (generate ci-summary.json): bunx tsx bin/utils/ci-helpers/parse-reports.ts

- Orchestrator (run CI wrapper or fallback to npm scripts): bunx tsx bin/utils/ci-helpers/index.ts [--apply]

- Report parser (richer parsing): bunx tsx bin/utils/ci-helpers/report-parser.ts

- Targeted test runner (re-run failing vitest files): bunx tsx bin/utils/ci-helpers/targeted-test-runner.ts [--apply]

- Lint fix wrapper: bunx tsx bin/utils/ci-helpers/lint-fix-wrapper.ts [--apply]

- Seed prep for Playwright: bunx tsx bin/utils/ci-helpers/seed-prep.ts [--apply]

- Git commit helper: bunx tsx bin/utils/ci-helpers/git-commit-helper.ts "commit message" <files...> [--apply]

- Fast-check (run checks only on changed files): bunx tsx bin/utils/ci-helpers/fast-check.ts [--apply]

## Safety

- By default helpers run in read-only/dry-run mode. Pass --apply to allow safe auto-fixes (eslint --fix, seed, git commit, etc.).
