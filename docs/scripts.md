# Scripts Inventory

**Last Updated:** 2026-05-03 (Task 0.4: Scan Complete - Corrected)  
**Banking App Scripts Inventory**

This document catalogs all executable scripts in the `scripts/` directory, their purpose, flags, and whether they are orchestrators vs logic.

---

## Overview

Scripts follow the **thin wrapper pattern**: shell scripts (`*.sh`, `*.ps1`, `*.bat`) are minimal orchestrators that call TypeScript implementations (`*.ts`). All business logic resides in TypeScript for cross-platform compatibility and testability.

---

## Script Inventory

### Shell Scripts (Orchestrators)

#### Root Level (.sh)

| Script | Type | Purpose |
| --- | --- | --- |
| `scripts/verify-agents.sh` | Manual Orchestrator | Runs type-check, lint:strict, test:browser, test:ui sequentially |
| `scripts/branch-compare.sh` | Complex Logic | Compares branches with main, generates report |
| `scripts/delete-gone-branches.sh` | Complex Logic | `--apply` (dry-run by default) to delete gone branches |
| `scripts/diagnose-and-fix-git.sh` | Complex Logic | Interactive git repair (checks for index.lock) |
| `scripts/opencode-mcp.sh` | Thin Orchestrator | `--list`, forwards to `scripts/ts/entrypoints/opencode-mcp-cli.ts` |
| `scripts/opencode-plugin-repair.sh` | Complex Orchestrator | `--apply` (dry-run by default), `--print-logs`, `--skip-reinstall`, `--skip-verify` |
| `scripts/opencode-plugin-verify.sh` | Thin Orchestrator | Forwards to `scripts/ts/opencode-plugin-verify.ts` |
| `scripts/orchestrator.sh` | Thin Orchestrator | Forwards to `scripts/orchestrator.ts` |
| `scripts/plan-ensure.sh` | Thin Orchestrator | Forwards to `scripts/plan-ensure.ts` |

#### Root Level (.ps1)

| Script | Type | Purpose |
| --- | --- | --- |
| `scripts/aggressive-capture.ps1` | Complex Logic | Aggressive capture script |
| `scripts/diagnose-and-fix-git.ps1` | Complex Logic | PowerShell version of git repair |
| `scripts/opencode-mcp.ps1` | Thin Orchestrator | PowerShell version |
| `scripts/orchestrator.ps1` | Thin Orchestrator | PowerShell version |
| `scripts/run-verify-and-validate.ps1` | Complex Orchestrator | PowerShell version |
| `scripts/verify-agents.ps1` | Manual Orchestrator | PowerShell version |

#### Root Level (.bat)

| Script                     | Type              | Purpose       |
| -------------------------- | ----------------- | ------------- |
| `scripts/opencode-mcp.bat` | Thin Orchestrator | Batch version |
| `scripts/orchestrator.bat` | Thin Orchestrator | Batch version |

#### Subfolder: cleanup/

| Script | Type | Purpose |
| --- | --- | --- |
| `scripts/cleanup/cleanup-docker.sh` | Thin Orchestrator | Forwards to `scripts/ts/cleanup/cleanup-docker.ts` |
| `scripts/cleanup/cleanup-docker.ps1` | Thin Orchestrator | PowerShell version |
| `scripts/cleanup/cleanup-docker.bat` | Thin Orchestrator | Batch version |
| `scripts/cleanup/cleanup-docs.sh` | Thin Orchestrator | Forwards to `scripts/ts/cleanup/cleanup-docs.ts` |
| `scripts/cleanup/cleanup-docs.ps1` | Thin Orchestrator | PowerShell version |
| `scripts/cleanup/cleanup-docs.bat` | Thin Orchestrator | Batch version |

#### Subfolder: deploy/

| Script | Type | Purpose |
| --- | --- | --- |
| `scripts/deploy/deploy.sh` | Thin Orchestrator | Forwards to `scripts/ts/deploy/deploy.ts` |
| `scripts/deploy/deploy.ps1` | Thin Orchestrator | PowerShell version |
| `scripts/deploy/deploy.bat` | Thin Orchestrator | Batch version |
| `scripts/deploy/generate-htpasswd.sh` | Thin Orchestrator | Forwards to `scripts/ts/deploy/generate-htpasswd.ts` |
| `scripts/deploy/generate-htpasswd.ps1` | Thin Orchestrator | PowerShell version |
| `scripts/deploy/generate-htpasswd.bat` | Thin Orchestrator | Batch version |

#### Subfolder: docker/

| Script | Type | Purpose |
| --- | --- | --- |
| `scripts/docker/deploy-checklist.sh` | Thin Orchestrator | Forwards to `scripts/ts/docker/deploy-checklist.ts` |
| `scripts/docker/deploy-checklist.ps1` | Thin Orchestrator | PowerShell version |
| `scripts/docker/deploy-checklist.bat` | Thin Orchestrator | Batch version |
| `scripts/docker/docker-quickstart.sh` | Thin Orchestrator | Forwards to `scripts/ts/docker/docker-quickstart.ts` |
| `scripts/docker/docker-quickstart.ps1` | Thin Orchestrator | PowerShell version |
| `scripts/docker/docker-quickstart.bat` | Thin Orchestrator | Batch version |
| `scripts/docker/entrypoint.sh` | Thin Orchestrator | Docker entrypoint |
| `scripts/docker/generate-env.sh` | Thin Orchestrator | Forwards to `scripts/ts/docker/generate-env.ts` |
| `scripts/docker/generate-env.ps1` | Thin Orchestrator | PowerShell version |
| `scripts/docker/generate-env.bat` | Thin Orchestrator | Batch version |

#### Subfolder: server/

| Script | Type | Purpose |
| --- | --- | --- |
| `scripts/server/gen-certs.sh` | Thin Orchestrator | Forwards to `scripts/ts/server/gen-certs.ts` |
| `scripts/server/gen-certs.ps1` | Thin Orchestrator | PowerShell version |
| `scripts/server/gen-certs.bat` | Thin Orchestrator | Batch version |
| `scripts/server/server-setup.sh` | Thin Orchestrator | Forwards to `scripts/ts/server/server-setup.ts` |
| `scripts/server/server-setup.ps1` | Thin Orchestrator | PowerShell version |
| `scripts/server/server-setup.bat` | Thin Orchestrator | Batch version |
| `scripts/server/vps-setup.sh` | Thin Orchestrator | Forwards to `scripts/ts/server/vps-setup.ts` |
| `scripts/server/vps-setup.ps1` | Thin Orchestrator | PowerShell version |
| `scripts/server/vps-setup.bat` | Thin Orchestrator | Batch version |

#### Subfolder: utils/

| Script | Type | Purpose |
| --- | --- | --- |
| `scripts/utils/build.sh` | Complex Logic | Build script with color output |
| `scripts/utils/build.ps1` | Thin Orchestrator | PowerShell version |
| `scripts/utils/build.bat` | Thin Orchestrator | Batch version |
| `scripts/utils/check-events.ps1` | Thin Orchestrator | Forwards to `scripts/ts/utils/check-events.ts` |
| `scripts/utils/check-events.bat` | Thin Orchestrator | Batch version |
| `scripts/utils/check-events-detail.ps1` | Thin Orchestrator | Forwards to `scripts/ts/utils/check-events-detail.ts` |
| `scripts/utils/check-events-detail.bat` | Thin Orchestrator | Batch version |
| `scripts/utils/disable-extensions.sh` | Thin Orchestrator | Forwards to `scripts/ts/utils/disable-extensions.ts` |
| `scripts/utils/disable-extensions.ps1` | Thin Orchestrator | PowerShell version |
| `scripts/utils/disable-extensions.bat` | Thin Orchestrator | Batch version |
| `scripts/utils/fix-line-endings.sh` | Thin Orchestrator | Forwards to `scripts/ts/utils/fix-line-endings.ts` |
| `scripts/utils/fix-line-endings.ps1` | Thin Orchestrator | PowerShell version |
| `scripts/utils/fix-line-endings.bat` | Thin Orchestrator | Batch version |
| `scripts/utils/read-secrets.sh` | Thin Orchestrator | Forwards to `scripts/ts/read-secrets.ts` |
| `scripts/utils/read-secrets.ps1` | Thin Orchestrator | PowerShell version |
| `scripts/utils/read-secrets.bat` | Thin Orchestrator | Batch version |
| `scripts/utils/run-ci-checks.sh` | Thin Orchestrator | Forwards to `scripts/ts/run-ci-checks.ts` |
| `scripts/utils/run-ci-checks.ps1` | Thin Orchestrator | PowerShell version |
| `scripts/utils/run-ci-checks.bat` | Thin Orchestrator | Batch version |

### TypeScript Scripts (Logic)

#### Root Level (`scripts/*.ts`)

| Script                               | Purpose                 |
| ------------------------------------ | ----------------------- |
| `scripts/validate.ts`                | Validation orchestrator |
| `scripts/verify-rules.ts`            | Policy enforcement      |
| `scripts/plan-ensure.ts`             | Plan validation logic   |
| `scripts/orchestrator.ts`            | Main orchestration      |
| `scripts/mcp-runner.ts`              | MCP server runner       |
| `scripts/generate-readme.ts`         | README generation       |
| `scripts/export-json.ts`             | JSON export             |
| `scripts/export-data.ts`             | Data export             |
| `scripts/debug-pw.ts`                | Playwright debug        |
| `scripts/verify-agent-iterations.ts` | Iteration verification  |
| `scripts/report-parser.ts`           | Report parsing          |
| `scripts/mcp-runner-lib.ts`          | MCP library             |

#### Validation (`scripts/validate/*.ts`)

| Script                        | Purpose                  |
| ----------------------------- | ------------------------ |
| `scripts/validate/types.ts`   | Type validation          |
| `scripts/validate/env.ts`     | Environment validation   |
| `scripts/validate/schema.ts`  | Schema validation        |
| `scripts/validate/actions.ts` | Server action validation |

#### Generators (`scripts/generate/*.ts`)

| Script                          | Purpose                    |
| ------------------------------- | -------------------------- |
| `scripts/generate/feature.ts`   | Feature scaffold generator |
| `scripts/generate/dal.ts`       | DAL helper generator       |
| `scripts/generate/component.ts` | Component generator        |
| `scripts/generate/action.ts`    | Action generator           |
| `scripts/generate/docs-gen.ts`  | Documentation generator    |

#### Database (`scripts/db/*.ts`)

| Script                                  | Purpose              |
| --------------------------------------- | -------------------- |
| `scripts/db/apply-migrations.ts`        | Apply migrations     |
| `scripts/db/apply-select-migrations.ts` | Selective migrations |

#### Seed (`scripts/seed/*.ts`)

| Script | Purpose |
| --- | --- |
| `scripts/seed/run.ts` | Main seed orchestration script |
| `scripts/seed/seed-config.ts` | Seed configuration |
| `scripts/seed/seed-ids.ts` | Seed ID generation |
| `scripts/seed/seed-data.ts` | Seed data population |
| `scripts/seed/get-planned-seed-summary.ts` | Seed summary generation |
| `scripts/seed/create-plaid-tokens.ts` | Create Plaid tokens for testing |

#### Maintenance (`scripts/maintenance/*.ts`)

| Script                                     | Purpose             |
| ------------------------------------------ | ------------------- |
| `scripts/maintenance/lint-fix-runner.ts`   | Lint fix automation |
| `scripts/maintenance/analyze-lint-scan.ts` | Lint analysis       |

#### Codemod (`scripts/codemod/*.ts`)

| Script                                | Purpose                |
| ------------------------------------- | ---------------------- |
| `scripts/codemod/run-codemod.ts`      | Code modification      |
| `scripts/codemod/find-process-env.ts` | Find process.env usage |

#### Utils (`scripts/utils/*.ts`)

| Script | Purpose |
| --- | --- |
| `scripts/utils/io.ts` | Centralized IO with dry-run support |
| `scripts/utils/cli.ts` | CLI flag parsing |
| `scripts/utils/validation.ts` | Validation helpers |
| `scripts/utils/yaml.ts` | YAML utilities |
| `scripts/utils/markdown.ts` | Markdown utilities |
| `scripts/utils/template.ts` | Template utilities |
| `scripts/utils/constants.ts` | Shared constants |
| `scripts/utils/date-utils.ts` | Date utilities |
| `scripts/utils/config-parser.ts` | Config parsing |
| `scripts/utils/shutdown.ts` | Graceful shutdown |
| `scripts/utils/get-connection-string.ts` | DB connection string |

#### Utils/CI Helpers (`scripts/utils/ci-helpers/*.ts`)

| Script | Purpose |
| --- | --- |
| `scripts/utils/ci-helpers/index.ts` | CI helpers export |
| `scripts/utils/ci-helpers/targeted-test-runner.ts` | Targeted test runner |
| `scripts/utils/ci-helpers/seed-prep.ts` | Seed preparation |
| `scripts/utils/ci-helpers/git-commit-helper.ts` | Git commit helper |
| `scripts/utils/ci-helpers/report-parser.ts` | Report parsing |
| `scripts/utils/ci-helpers/parse-reports.ts` | Parse multiple reports |
| `scripts/utils/ci-helpers/lint-fix-wrapper.ts` | Lint fix wrapper |
| `scripts/utils/ci-helpers/fast-check.ts` | Fast pre-commit check |
| `scripts/utils/ci-helpers/run-with-args.ts` | Run with arguments |

#### Utils/AST (`scripts/utils/ast/*.ts`)

| Script                                | Purpose          |
| ------------------------------------- | ---------------- |
| `scripts/utils/ast/ts-morph-utils.ts` | AST manipulation |

### TypeScript Scripts (ts/ folder)

#### Entrypoints (`scripts/ts/entrypoints/*.ts`)

| Script | Purpose |
| --- | --- |
| `scripts/ts/entrypoints/opencode-mcp-cli.ts` | OpenCode MCP CLI |
| `scripts/ts/entrypoints/deploy-cli.ts` | Deploy CLI |
| `scripts/ts/entrypoints/run-verify-and-validate-cli.ts` | Verify/Validate CLI |

#### Build (`scripts/ts/build.ts`)

| Script                        | Purpose       |
| ----------------------------- | ------------- |
| `scripts/ts/build.ts`         | Build process |
| `scripts/ts/build-windows.ts` | Windows build |

#### Deploy (`scripts/ts/deploy/*.ts`)

| Script                                   | Purpose             |
| ---------------------------------------- | ------------------- |
| `scripts/ts/deploy/deploy.ts`            | Unix deployment     |
| `scripts/ts/deploy/deploy-windows.ts`    | Windows deployment  |
| `scripts/ts/deploy/generate-htpasswd.ts` | htpasswd generation |

#### Docker (`scripts/ts/docker/*.ts`)

| Script | Purpose |
| --- | --- |
| `scripts/ts/docker/generate-env.ts` | Environment generation |
| `scripts/ts/docker/generate-env-windows.ts` | Windows version |
| `scripts/ts/docker/docker-quickstart.ts` | Quickstart |
| `scripts/ts/docker/docker-quickstart-windows.ts` | Windows version |
| `scripts/ts/docker/deploy-checklist.ts` | Pre-deploy checks |
| `scripts/ts/docker/deploy-checklist-windows.ts` | Windows version |
| `scripts/ts/docker/entrypoint.ts` | Docker entrypoint |

#### Cleanup (`scripts/ts/cleanup/*.ts`)

| Script | Purpose |
| --- | --- |
| `scripts/ts/cleanup/cleanup-docs.ts` | Documentation cleanup |
| `scripts/ts/cleanup/cleanup-docs-windows.ts` | Windows version |
| `scripts/ts/cleanup/cleanup-docker.ts` | Docker cleanup |
| `scripts/ts/cleanup/cleanup-docker-windows.ts` | Windows version |

#### Server (`scripts/ts/server/*.ts`)

| Script                                   | Purpose                |
| ---------------------------------------- | ---------------------- |
| `scripts/ts/server/gen-certs.ts`         | Certificate generation |
| `scripts/ts/server/gen-certs-windows.ts` | Windows version        |
| `scripts/ts/server/server-setup.ts`      | Server setup           |
| `scripts/ts/server/vps-setup.ts`         | VPS setup              |

#### MCP (`scripts/ts/mcp/*.ts`)

| Script                         | Purpose           |
| ------------------------------ | ----------------- |
| `scripts/ts/mcp/mcp-runner.ts` | MCP server runner |

#### Docs (`scripts/ts/docs/*.ts`)

| Script                                         | Purpose          |
| ---------------------------------------------- | ---------------- |
| `scripts/ts/docs/generate-markdown-catalog.ts` | Markdown catalog |

#### Tools (`scripts/ts/tools/*.ts`)

| Script | Purpose |
| --- | --- |
| `scripts/ts/tools/discover-app-pages.ts` | Page discovery |
| `scripts/ts/tools/generate-inventory.ts` | Inventory generation |
| `scripts/ts/tools/create-issues-from-catalog.ts` | Issue creation |

#### Utils (`scripts/ts/utils/*.ts`)

| Script | Purpose |
| --- | --- |
| `scripts/ts/utils/cli.ts` | CLI flag parsing |
| `scripts/ts/utils/ast.ts` | AST utilities |
| `scripts/ts/utils/fs-safe.ts` | Safe filesystem ops |
| `scripts/ts/utils/check-events.ts` | Check events |
| `scripts/ts/utils/check-events-detail.ts` | Detailed event check |
| `scripts/ts/utils/fix-line-endings.ts` | Line ending fixes |
| `scripts/ts/utils/disable-extensions.ts` | Disable extensions |
| `scripts/ts/utils/disable-extensions-wrapper.ts` | Wrapper for disable-extensions |
| `scripts/ts/utils/read-secrets-helpers.ts` | Read secrets helpers |
| `scripts/ts/utils/read-secrets-wrapper.ts` | Read secrets wrapper |
| `scripts/ts/utils/run-ci-checks-wrapper.ts` | Run CI checks wrapper |
| `scripts/ts/utils/ci-helpers/git-commit-helper-wrapper.ts` | Git helper wrapper |
| `scripts/ts/utils/check-events-detail.ts` | Detail check events |
| `scripts/ts/read-secrets.ts` | Secrets reading |
| `scripts/ts/read-secrets-windows.ts` | Windows version |
| `scripts/ts/run-ci-checks.ts` | CI checks (Unix) |
| `scripts/ts/run-ci-checks-windows.ts` | CI checks (Windows) |

#### Verify (`scripts/ts/verify-agents.ts`)

| Script                        | Purpose            |
| ----------------------------- | ------------------ |
| `scripts/ts/verify-agents.ts` | Agent verification |

#### Other (`scripts/ts/*.ts`)

| Script                                    | Purpose             |
| ----------------------------------------- | ------------------- |
| `scripts/ts/opencode-mcp.ts`              | OpenCode MCP        |
| `scripts/ts/opencode-plugin-verify.ts`    | Plugin verification |
| `scripts/ts/branch-compare.ts`            | Branch comparison   |
| `scripts/ts/diagnose-and-fix-git.ts`      | Git diagnosis       |
| `scripts/ts/diagnose-and-fix-git-unix.ts` | Unix-specific       |
| `scripts/ts/run-verify-and-validate.ts`   | Verify and validate |
| `scripts/ts/sweep-wrap-remaining.ts`      | Sweep wrapper       |
| `scripts/ts/aggressive-capture.ts`        | Aggressive capture  |

---

## Dry-Run Mode

Most destructive scripts support `--dry-run` (default) and `--apply` flags.

### Usage

```bash
# Preview changes (default)
bunx tsx scripts/some-mutation-script.ts

# Apply changes explicitly
bunx tsx scripts/some-mutation-script.ts --apply
```

### Environment Variables

- `DRY_RUN=1` - Force dry-run mode
- `__SCRIPTS_DRY_RUN` - Global dry-run flag

---

## Shell Wrapper Pattern

Thin orchestrators follow this template:

```bash
#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR=$(dirname "$(realpath "$0")")
REPO_ROOT=$(realpath "$SCRIPT_DIR/..")
cd "$REPO_ROOT"
bunx tsx scripts/ts/implementation.ts "$@"
```

Complex orchestrators may include additional logic for multi-step operations.

---

## Script Counts

| Category                               | Count |
| -------------------------------------- | ----- |
| Shell Scripts (.sh)                    | 14    |
| PowerShell Scripts (.ps1)              | 23    |
| Batch Scripts (.bat)                   | 20    |
| TypeScript Logic (root `scripts/*.ts`) | 40+   |
| TypeScript Logic (`scripts/ts/*.ts`)   | 54+   |

---

## Common Commands

```bash
# Run all CI checks
bun run validate

# Verify rules
bun run verify:rules

# Seed database
bun run db:seed

# Build
bun run build
```

**Last Verified:** 2026-05-03  
**Task:** Task 0.4 (Phase 0 Documentation Refresh)
