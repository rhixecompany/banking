Plan: Harmonize CI runner helpers and parallel execution

Purpose

- Identify and fix helper scripts used by run-ci-checks runners
- Ensure targeted runs work under project ESM settings
- Make runners use the same helpers (Bash + PowerShell) and support parallel execution

Decisions

- Convert run-with-args.js => run-with-args.ts and invoke via `npx tsx`
- Default runner behavior: parallel-by-default with conservative default concurrency = 3
- CLI flag: --parallel=N to override
- PowerShell runner to reuse the Node helper via `npx tsx`
- Fix TypeScript errors in ci-helpers (all files) so helpers run cleanly
- Prepare patches but do not commit changes automatically

Implementation steps (what will be changed)

1. Add scripts/utils/ci-helpers/run-with-args.ts (ESM/TS) that supports --template and either --tmpfile (NUL-separated) or --files (comma-separated)
2. Update scripts/utils/run-ci-checks.sh to prefer `npx tsx scripts/utils/ci-helpers/run-with-args.ts` for targeted runs and keep robust parallel orchestration
3. Update scripts/utils/run-ci-checks.ps1 to call `npx tsx scripts/utils/ci-helpers/run-with-args.ts` for targeted runs when $File is provided
4. Fix TypeScript errors across scripts/utils/ci-helpers so helpers execute under tsx

Testing

- Dry-run, single step, forced failure via targeted run, skip, trace, continue-on-fail
- Parallel runs with --parallel and default parallel invocation

Provenance: files inspected

- scripts/utils/run-ci-checks.sh (primary)
- scripts/utils/run-ci-checks.ps1 (windows shim)
- scripts/utils/ci-helpers/run-with-args.js (converted)
- package.json (type: module + helper npm scripts)

Next: applying the planned changes now.
