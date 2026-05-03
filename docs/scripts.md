# Scripts Inventory

**Last Updated:** 2026-05-03 (Task 0.4: Scan Complete)  
**Banking App Scripts Inventory**

This document catalogs all executable scripts in the `scripts/` directory, their purpose, flags, and whether they are orchestrators vs logic.

---

## Overview

Scripts follow the **thin wrapper pattern**: shell scripts (`*.sh`, `*.ps1`, `*.bat`) are minimal orchestrators that call TypeScript implementations (`*.ts`). All business logic resides in TypeScript for cross-platform compatibility and testability.

---

## Script Inventory

### Shell Scripts (Orchestrators)

| Script | Type | Purpose | Flags |
|--------|------|---------|-------|
| `scripts/verify-agents.sh` | Manual Orchestrator | Runs type-check, lint:strict, test:browser, test:ui sequentially |
| `scripts/plan-ensure.sh` | Thin Orchestrator | `--help`, forwards to `scripts/plan-ensure.ts` |
| `scripts/orchestrator.sh` | Thin Orchestrator | `--help`, forwards to `scripts/orchestrator.ts` |
| `scripts/orchestrator.ps1` | Thin Orchestrator | PowerShell version |
| `scripts/orchestrator.bat` | Thin Orchestrator | Batch version |
| `scripts/opencode-mcp.sh` | Thin Orchestrator | `--list`, forwards to `scripts/ts/entrypoints/opencode-mcp-cli.ts` |
| `scripts/opencode-mcp.ps1` | Thin Orchestrator | PowerShell version |
| `scripts/opencode-mcp.bat` | Thin Orchestrator | Batch version |
| `scripts/opencode-plugin-verify.sh` | Thin Orchestrator | Forwards to `scripts/ts/opencode-plugin-verify.ts` |
| `scripts/opencode-plugin-repair.sh` | Complex Orchestrator | `--apply` (dry-run by default), `--print-logs`, `--skip-reinstall`, `--skip-verify` |
| `scripts/diagnose-and-fix-git.sh` | Complex Logic | Interactive git repair (checks for index.lock) |
| `scripts/diagnose-and-fix-git.ps1` | Complex Logic | PowerShell version |
| `scripts/branch-compare.sh` | Complex Logic | Compares branches with main, generates report |
| `scripts/delete-gone-branches.sh` | Complex Logic | `--apply` (dry-run by default) to delete gone branches |
| `scripts/utils/run-ci-checks.sh` | Thin Orchestrator | Forwards to `scripts/ts/run-ci-checks.ts` |
| `scripts/utils/disable-extensions.sh` | Thin Orchestrator | Forwards to `scripts/ts/utils/disable-extensions.ts` |
| `scripts/utils/fix-line-endings.sh` | Thin Orchestrator | Forwards to `scripts/ts/utils/fix-line-endings.ts` |
| `scripts/utils/build.sh` | Complex Logic | Build script with color output |
| `scripts/verify-agents.ps1` | Manual Orchestrator | PowerShell version |
| `scripts/run-verify-and-validate.ps1` | Complex Orchestrator | PowerShell version |

### TypeScript Scripts (Logic)

#### Root Level (`scripts/*.ts`)

| Script | Purpose | Flags |
|--------|---------|-------|
| `scripts/validate.ts` | Validation orchestrator | `--schema`, `--env`, `--types`, `--actions`, `--all` |
| `scripts/verify-rules.ts` | Policy enforcement | `--ci`, `--output <path>` |
| `scripts/plan-ensure.ts` | Plan validation logic | `--help`, `--plan <name>` |
| `scripts/orchestrator.ts` | Main orchestration | `--help`, subcommands for tasks |
| `scripts/mcp-runner.ts` | MCP server runner | Various MCP tool execution |
| `scripts/generate-readme.ts` | README generation | `--all` |
| `scripts/export-json.ts` | JSON export | `--pretty`, `--output <path>` |
| `scripts/export-data.ts` | Data export | JSON backup |
| `scripts/debug-pw.ts` | Playwright debug | Debug E2E issues |
| `scripts/verify-agent-iterations.ts` | Iteration verification | Verify agent work |
| `scripts/report-parser.ts` | Report parsing | CI report parsing |
| `scripts/mcp-runner-lib.ts` | MCP library | MCP tooling |

#### Validation (`scripts/validate/*.ts`)

| Script | Purpose |
|--------|---------|
| `scripts/validate/types.ts` | Type validation |
| `scripts/validate/env.ts` | Environment validation |
| `scripts/validate/schema.ts` | Schema validation |
| `scripts/validate/actions.ts` | Server action validation |

#### Generators (`scripts/generate/*.ts`)

| Script | Purpose |
|--------|---------|
| `scripts/generate/feature.ts` | Feature scaffold generator |
| `scripts/generate/dal.ts` | DAL helper generator |
| `scripts/generate/component.ts` | Component generator |
| `scripts/generate/action.ts` | Action generator |
| `scripts/generate/docs-gen.ts` | Documentation generator |

#### Database (`scripts/db/*.ts`)

| Script | Purpose |
|--------|---------|
| `scripts/db/apply-migrations.ts` | Apply migrations |
| `scripts/db/apply-select-migrations.ts` | Selective migrations |

#### Maintenance (`scripts/maintenance/*.ts`)

| Script | Purpose |
|--------|---------|
| `scripts/maintenance/lint-fix-runner.ts` | Lint fix automation |
| `scripts/maintenance/analyze-lint-scan.ts` | Lint analysis |

#### Codemod (`scripts/codemod/*.ts`)

| Script | Purpose |
|--------|---------|
| `scripts/codemod/run-codemod.ts` | Code modification |
| `scripts/codemod/find-process-env.ts` | Find process.env usage |

#### Utils (`scripts/utils/*.ts`)

| Script | Purpose |
|--------|---------|
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
|--------|---------|
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

| Script | Purpose |
|--------|---------|
| `scripts/utils/ast/ts-morph-utils.ts` | AST manipulation |

### TypeScript Scripts (ts/ folder)

#### Entrypoints (`scripts/ts/entrypoints/*.ts`)

| Script | Purpose |
|--------|---------|
| `scripts/ts/entrypoints/opencode-mcp-cli.ts` | OpenCode MCP CLI |
| `scripts/ts/entrypoints/deploy-cli.ts` | Deploy CLI |
| `scripts/ts/entrypoints/run-verify-and-validate-cli.ts` | Verify/Validate CLI |

#### Build (`scripts/ts/build.ts`)

| Script | Purpose | Flags |
|--------|---------|-------|
| `scripts/ts/build.ts` | Build process | `--profile=<name>` |
| `scripts/ts/build-windows.ts` | Windows build | |

#### Deploy (`scripts/ts/deploy/*.ts`)

| Script | Purpose | Flags |
|--------|---------|-------|
| `scripts/ts/deploy/deploy.ts` | Unix deployment | `--dry-run`, `--apply` |
| `scripts/ts/deploy/deploy-windows.ts` | Windows deployment | |
| `scripts/ts/deploy/generate-htpasswd.ts` | htpasswd generation | Interactive |

#### Docker (`scripts/ts/docker/*.ts`)

| Script | Purpose |
|--------|---------|
| `scripts/ts/docker/generate-env.ts` | Environment generation |
| `scripts/ts/docker/generate-env-windows.ts` | Windows version |
| `scripts/ts/docker/docker-quickstart.ts` | Quickstart |
| `scripts/ts/docker/docker-quickstart-windows.ts` | Windows version |
| `scripts/ts/docker/deploy-checklist.ts` | Pre-deploy checks |
| `scripts/ts/docker/deploy-checklist-windows.ts` | Windows version |
| `scripts/ts/docker/entrypoint.ts` | Docker entrypoint |

#### Cleanup (`scripts/ts/cleanup/*.ts`)

| Script | Purpose |
|--------|---------|
| `scripts/ts/cleanup/cleanup-docs.ts` | Documentation cleanup |
| `scripts/ts/cleanup/cleanup-docs-windows.ts` | Windows version |
| `scripts/ts/cleanup/cleanup-docker.ts` | Docker cleanup |
| `scripts/ts/cleanup/cleanup-docker-windows.ts` | Windows version |

#### Server (`scripts/ts/server/*.ts`)

| Script | Purpose |
|--------|---------|
| `scripts/ts/server/gen-certs.ts` | Certificate generation |
| `scripts/ts/server/gen-certs-windows.ts` | Windows version |
| `scripts/ts/server/server-setup.ts` | Server setup |
| `scripts/ts/server/vps-setup.ts` | VPS setup |

#### MCP (`scripts/ts/mcp/*.ts`)

| Script | Purpose |
|--------|---------|
| `scripts/ts/mcp/mcp-runner.ts` | MCP server runner |

#### Docs (`scripts/ts/docs/*.ts`)

| Script | Purpose | Flags |
|--------|---------|-------|
| `scripts/ts/docs/generate-markdown-catalog.ts` | Markdown catalog | `--write` |

#### Tools (`scripts/ts/tools/*.ts`)

| Script | Purpose |
|--------|---------|
| `scripts/ts/tools/discover-app-pages.ts` | Page discovery |
| `scripts/ts/tools/generate-inventory.ts` | Inventory generation |
| `scripts/ts/tools/create-issues-from-catalog.ts` | Issue creation |

#### Utils (`scripts/ts/utils/*.ts`)

| Script | Purpose |
|--------|---------|
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

| Script | Purpose |
|--------|---------|
| `scripts/ts/verify-agents.ts` | Agent verification |

#### Other (`scripts/ts/*.ts`)

| Script | Purpose |
|--------|---------|
| `scripts/ts/opencode-mcp.ts` | OpenCode MCP |
| `scripts/ts/opencode-plugin-verify.ts` | Plugin verification |
| `scripts/ts/branch-compare.ts` | Branch comparison |
| `scripts/ts/diagnose-and-fix-git.ts` | Git diagnosis |
| `scripts/ts/diagnose-and-fix-git-unix.ts` | Unix-specific |
| `scripts/ts/run-verify-and-validate.ts` | Verify and validate |
| `scripts/ts/sweep-wrap-remaining.ts` | Sweep wrapper |
| `scripts/ts/aggressive-capture.ts` | Aggressive capture |

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

| Category | Count |
|----------|-------|
| Shell Orchestrators (.sh) | 18 |
| Shell Orchestrators (.ps1) | 6 |
| Shell Orchestrators (.bat) | 3 |
| TypeScript Logic (root) | 40+ |
| TypeScript Logic (ts/) | 54+ |

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