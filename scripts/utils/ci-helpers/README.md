CI Helpers

Usage:

- Parse reports (generate ci-summary.json): npx tsx scripts/utils/ci-helpers/parse-reports.ts

- Run the orchestrator (runs CI wrapper, parses reports, optionally applies eslint --fix): npx tsx scripts/utils/ci-helpers/index.ts [--apply]

Safety:

- By default the orchestrator runs in read-only mode. Pass --apply to allow safe auto-fixes (currently: eslint --fix).
