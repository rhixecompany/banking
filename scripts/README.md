# Run CI Checks

This folder contains a cross-platform CI runner for the repository that wraps the project's npm scripts and produces per-step reports and a machine-readable ci-summary.json.

## Usage (Bash)

- Make executable: `chmod +x scripts/utils/run-ci-checks.sh`
- Run full checks: `./scripts/utils/run-ci-checks.sh`
- Run a dry-run: `./scripts/utils/run-ci-checks.sh --dry-run --report-dir ./tmp/reports`
- Run targeted checks for specific files: `./scripts/utils/run-ci-checks.sh --only=format-check,lint-fix --file "README.md,src/foo.ts"`

## Behavior

- --file/-f accepts a comma-separated list of files or globs and will attempt to run the underlying tool (prettier, eslint, vitest, playwright, tsc) directly, falling back to `npm run <script>` if the tool is not available on PATH.
- The runner writes per-step text reports into the `--report-dir` (default: `./ci-reports/<timestamp>`).
- A machine-readable `ci-summary.json` is written into the report dir. It contains an array of steps with fields: `name`, `status`, `report`, `exit_code`, `fallback`.
- The runner writes `ci-summary.json` incrementally after each step, so CI consumers can read partial progress while a run is in-flight.

## Windows (PowerShell)

Use the PowerShell shim:

pwsh ./scripts/utils/run-ci-checks.ps1 -ReportDir .\tmp\reports -DryRun

## Notes

- For robust file-argument handling the Bash runner writes the file list to a temporary NUL-separated file and invokes the tool using `xargs -0` so filenames containing spaces or special characters are handled reliably.
- If you need even stronger guarantees for exotic filenames (newlines, control characters) we can replace the xargs invocation with a small Node helper or pass arguments over stdin to the target tool where supported.
