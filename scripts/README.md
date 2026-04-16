## Scripts README

This folder contains developer scripts used during local development.

report-parser.ts

- Purpose: Parse test reports (Vitest JSON, Playwright JSON, JUnit XML) and produce a normalized summary.
- Usage: `node scripts/report-parser.ts [path] [--dry-run]`
  - If `path` is a file, it will parse that file. If a directory, it will parse _.json, _.xml, \*.csv files in the dir.
  - `--dry-run` prints the parsed results and exits without writing files.

orchestrator.ts

- Purpose: Identify changed files (git diff) and expand one-level dependents to compute affected pages.
- Usage: `node scripts/orchestrator.ts [--diff-base origin/main] [--dry-run]`
  - `--diff-base` sets the git base ref.
  - `--dry-run` prints the JSON summary and exits.

Notes

- These scripts are prototypes. They are intentionally conservative and meant to be safe for local usage.
- If you modify them, add unit tests in `tests/unit/` and fixtures under `tests/fixtures/reports/` for the parser.
