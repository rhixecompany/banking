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

## Wrapper Notes

- For robust file-argument handling the Bash runner writes the file list to a temporary NUL-separated file and invokes the tool using `xargs -0` so filenames containing spaces or special characters are handled reliably.
- If you need even stronger guarantees for exotic filenames (newlines, control characters) we can replace the xargs invocation with a small Node helper or pass arguments over stdin to the target tool where supported.

## Migration notes

- New pattern: all main logic is in scripts/ts/. Use the sh/ps1/bat wrappers only as thin orchestrators (they forward to tsx entrypoints).
- Each TypeScript script supports `--dry-run` (human summary + JSON) and `--apply` (writes with backups).
- See examples in package.json for updated script commands.

## Dry-run and apply examples

The TypeScript entrypoints follow a standard pattern:

- `--dry-run` (default) prints a short human-readable summary line followed by a JSON object describing what would change. It does not write files.
- `--apply` performs the changes and creates timestamped backups next to any modified file using the pattern: `<file>.bak.<ISO-like-timestamp>` (colons removed, seconds precision). Example backup name:

  myfile.txt.bak.20260420T153012

Examples

- Run the CI runner in dry-run mode (prints summary + JSON):

  npx tsx scripts/run-verify-and-validate.ts --dry-run --report-dir ./tmp/reports

- Inspect what cleanup-docs would change:

  npx tsx scripts/ts/cleanup/cleanup-docs.ts --dry-run --out=./tmp/manifest.json

- Apply cleanup-docs changes (creates backups):

  npx tsx scripts/ts/cleanup/cleanup-docs.ts --apply --out=./tmp/manifest.json

- Dry-run the Docker cleanup (Windows):

  powershell -File scripts/cleanup/cleanup-docker.ps1 -- --dry-run

- Apply gen-certs (creates backups for modified cert files):

  npx tsx scripts/ts/server/gen-certs.ts --apply

## Notes

- Wrapper scripts (sh/ps1/bat) are thin orchestrators and forward arguments to the TS entrypoints. You can call either the wrapper (platform-native) or the TS file directly with `npx tsx`.
- Backups are created only when `--apply` is used. Dry-run never writes files.
