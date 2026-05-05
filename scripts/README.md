# Run CI Checks

This folder contains a cross-platform CI runner for the repository that wraps the project's package scripts and produces per-step reports and a machine-readable ci-summary.json.

## Usage (Bash)

- Make executable: `chmod +x scripts/utils/run-ci-checks.sh`
- Run full checks: `./scripts/utils/run-ci-checks.sh`
- Run a dry-run: `./scripts/utils/run-ci-checks.sh --dry-run --report-dir ./tmp/reports`
- Run targeted checks for specific files: `./scripts/utils/run-ci-checks.sh --only=format-check,lint-fix --file "README.md,src/foo.ts"`

## Behavior

- --file/-f accepts a comma-separated list of files or globs and will attempt to run the underlying tool (prettier, eslint, vitest, playwright, tsc) directly, falling back to `bun run <script>` if the tool is not available on PATH.
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

  bunx tsx scripts/run-verify-and-validate.ts --dry-run --report-dir ./tmp/reports

- Inspect what cleanup-docs would change:

  bunx tsx scripts/ts/cleanup/cleanup-docs.ts --dry-run --out=./tmp/manifest.json

- Apply cleanup-docs changes (creates backups):

  bunx tsx scripts/ts/cleanup/cleanup-docs.ts --apply --out=./tmp/manifest.json

- Dry-run the Docker cleanup (Windows):

  powershell -File scripts/cleanup/cleanup-docker.ps1 -- --dry-run

- Apply gen-certs (creates backups for modified cert files):

  bunx tsx scripts/ts/server/gen-certs.ts --apply

## Notes

- Wrapper scripts (sh/ps1/bat) are thin orchestrators and forward arguments to the TS entrypoints. You can call either the wrapper (platform-native) or the TS file directly with `bunx tsx`.
- Backups are created only when `--apply` is used. Dry-run never writes files.

---

# OpenCode Plugin Repair (11-Phase Workflow)

The `opencode-plugin-repair` script manages the complete OpenCode plugin lifecycle: detection, validation, cleanup, and reinstallation across project and global scopes.

## Quick Start

```bash
# Dry-run (default): show what would change without applying
bun run opencode:plugins:repair

# Apply changes (requires sufficient disk space and compatible OS)
bun run opencode:plugins:repair -- --apply

# Skip expensive checks (use cached runtime config)
bun run opencode:plugins:repair -- --use-cached-runtime

# Skip missing plugin fixes
bun run opencode:plugins:repair -- --skip-missing-fix

# Skip extra plugin cleanup
bun run opencode:plugins:repair -- --skip-extra-fix
```

## 11-Phase Workflow

The script executes a comprehensive 11-phase repair cycle:

| Phase | Name | Purpose |
| --- | --- | --- |
| **1** | Load Configs | Read plugins from `.opencode/opencode.json`, `.opencode/tui.json`, `~/.config/opencode/opencode.json`, and `~/.config/opencode/tui.json` |
| **2** | Check Disk Space | Verify sufficient disk space (0.5 GB threshold for `--apply`; 1.0 GB warning threshold) |
| **3** | Load Runtime Config | Execute `bunx opencode debug config` to get live runtime state (or use `--use-cached-runtime` for cached snapshot) |
| **4** | Read Schema & Reports | Parse `docs/schema-design.md` for extension types; read `.opencode/reports/opencode-plugin-verify.json` and `.opencode/reports/opencode-os-compat.json` |
| **5** | Normalize Plugin Specs | Deduplicate and standardize plugin specs across all sources |
| **6** | Detect Missing & Extras | Compare expected plugins (from configs) vs. runtime state; identify plugins that need installation or removal |
| **7** | Identify Cleanup Targets | Locate extra plugin directories that are absent from all 4 config sources |
| **8** | Cleanup Extra Plugins | Remove plugin directories from disk (only if not in any config source; requires `--apply`) |
| **9** | Fix Missing Plugins | Install missing plugins via `bunx opencode plugin <spec> --force` (gated by disk space + OS compatibility; requires `--apply`) |
| **10** | Fix Extra Plugins | Remove orphaned plugin directories (requires `--apply`; safety: only if absent from all 4 configs) |
| **11** | Reinstall Summary | Report counts of global and project plugins; summarize all fixes applied |

### Post-Phases

After phase 11 completes, two additional checks run:

- **Verification**: Re-run detection to confirm all missing plugins are now installed and all extras are removed
- **OS Compatibility Summary**: Cross-reference final plugin list against platform/architecture compatibility map

## Output Report

The script writes `.opencode/reports/opencode-plugin-repair.json` containing:

```json
{
  "mode": "dry-run" | "apply",
  "systemInfo": { "os": "win32" | "darwin" | "linux", "arch": "x64" | "arm64", "nodeVersion": "..." },
  "configSources": { /* 4 config files loaded */ },
  "diskSpace": { "freeGB": 0.5, "status": "warning" | "ok" | "critical" },
  "runtimeConfig": { /* parsed from 'bunx opencode debug config' */ },
  "schemaAnalysis": { /* extension types and config locations */ },
  "verifyReportRead": true | false,
  "osCompatSummary": { /* per-plugin compatibility */ },
  "missingPlugins": [ /* plugins to install */ ],
  "extraPlugins": [ /* plugins to remove */ ],
  "fixedMissing": [ /* successfully installed */ ],
  "fixedExtras": [ /* successfully removed */ ],
  "reinstallSummary": { "globalPlugins": 5, "projectPlugins": 23, "total": 28 },
  "timestamp": "2026-05-05T01:05:35.537Z"
}
```

## Safety Features

- **Disk Space Gating**: Operations abort if free space < 0.5 GB when `--apply` is set; warning if < 1.0 GB
- **OS Compatibility Checking**: Validates each plugin against platform/architecture before installation
- **Extra Plugin Safety**: Only removes plugin directories if absent from **all 4 config sources** (project + global)
- **Dry-run by Default**: Always preview changes before applying with `--apply`
- **Cached Runtime Config**: Use `--use-cached-runtime` to skip expensive `bunx opencode debug config` call

## Cross-Platform Support

- **Windows**: Uses PowerShell `Get-Volume` for disk space detection; batch orchestrator delegates to TypeScript
- **macOS/Linux**: Uses `df -k` for disk space; bash orchestrator delegates to TypeScript
- **All Platforms**: Core logic in `scripts/ts/opencode-plugin-repair.ts`; shell wrappers are thin orchestrators only

## Related Files

- `scripts/ts/opencode-plugin-repair.ts` — Core implementation (11 phases, all validation)
- `scripts/opencode-plugin-repair.sh` — Bash orchestrator (macOS/Linux)
- `scripts/opencode-plugin-repair.ps1` — PowerShell orchestrator (Windows)
- `scripts/opencode-plugin-repair.bat` — Batch orchestrator (Windows)
- `package.json` — npm script `opencode:plugins:repair`
- `.opencode/reports/opencode-plugin-repair.json` — Output report
- `docs/schema-design.md` — Extension types and config locations
