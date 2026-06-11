# Scripts Inventory

## Overview

Generated: 2026-05-08 Source: `scripts/**`

## Shell Scripts (.sh)

| Script                                | Purpose                |
| ------------------------------------- | ---------------------- |
| `scripts/verify-agents.sh`            | Verify OpenCode agents |
| `scripts/opencode-plugin-verify.sh`   | Verify plugins         |
| `scripts/opencode-plugin-repair.sh`   | Repair plugins         |
| `scripts/opencode-mcp.sh`             | MCP operations         |
| `scripts/plan-ensure.sh`              | Plan validation        |
| `scripts/orchestrator.sh`             | General orchestration  |
| `scripts/diagnose-and-fix-git.sh`     | Git diagnostics        |
| `scripts/branch-compare.sh`           | Compare branches       |
| `scripts/delete-gone-branches.sh`     | Cleanup branches       |
| `scripts/docker/generate-env.sh`      | Docker env generation  |
| `scripts/docker/docker-quickstart.sh` | Docker quickstart      |
| `scripts/docker/deploy-checklist.sh`  | Deploy checklist       |
| `scripts/docker/entrypoint.sh`        | Docker entrypoint      |
| `scripts/deploy/deploy.sh`            | Deployment             |
| `scripts/deploy/generate-htpasswd.sh` | Generate htpasswd      |
| `scripts/cleanup/cleanup-docs.sh`     | Docs cleanup           |
| `scripts/cleanup/cleanup-docker.sh`   | Docker cleanup         |
| `scripts/server/server-setup.sh`      | Server setup           |
| `scripts/server/vps-setup.sh`         | VPS setup              |
| `scripts/server/gen-certs.sh`         | Generate certificates  |
| `scripts/utils/run-ci-checks.sh`      | CI checks              |
| `scripts/utils/disable-extensions.sh` | Disable extensions     |
| `scripts/utils/build.sh`              | Build utilities        |
| `scripts/utils/read-secrets.sh`       | Read secrets           |
| `scripts/utils/fix-line-endings.sh`   | Fix line endings       |

## PowerShell/Batch Scripts (.ps1/.bat)

| Script                                   | Purpose                |
| ---------------------------------------- | ---------------------- |
| `scripts/verify-agents.ps1`              | Verify OpenCode agents |
| `scripts/opencode-plugin-verify.ps1/bat` | Verify plugins         |
| `scripts/opencode-plugin-repair.ps1/bat` | Repair plugins         |
| `scripts/opencode-mcp.ps1/bat`           | MCP operations         |
| `scripts/plan-ensure.ps1/bat`            | Plan validation        |
| `scripts/orchestrator.ps1/bat`           | General orchestration  |
| `scripts/diagnose-and-fix-git.ps1`       | Git diagnostics        |
| `scripts/run-verify-and-validate.ps1`    | Run verification       |
| `scripts/aggressive-capture.ps1`         | Capture operations     |
| `scripts/docker/*.ps1/bat`               | Docker utilities       |
| `scripts/deploy/*.ps1/bat`               | Deployment scripts     |
| `scripts/cleanup/*.ps1/bat`              | Cleanup operations     |
| `scripts/server/*.ps1/bat`               | Server setup           |
| `scripts/utils/*.ps1/bat`                | Utility functions      |

## TypeScript Scripts (.ts)

### Core Scripts (Root)

| Script | Purpose |
| --- | --- |
| `scripts/mcp-runner.ts` | MCP server management |
| `scripts/mcp-runner-lib.ts` | MCP runner library |
| `scripts/verify-rules.ts` | AST policy check |
| `scripts/validate.ts` | Configuration validation |
| `scripts/export-json.ts` | Export registry JSON |
| `scripts/export-data.ts` | Export data |
| `scripts/generate-readme.ts` | Generate README |
| `scripts/plan-ensure.ts` | Plan validation |
| `scripts/debug-pw.ts` | Debug utilities |
| `scripts/report-parser.ts` | Parse CI reports |
| `scripts/orchestrator.ts` | Main orchestration |
| `scripts/verify-agent-iterations.ts` | Agent iteration verification |

### Validation (`scripts/validate/`)

| Script                        | Purpose                |
| ----------------------------- | ---------------------- |
| `scripts/validate/types.ts`   | Validation types       |
| `scripts/validate/env.ts`     | Environment validation |
| `scripts/validate/schema.ts`  | Schema validation      |
| `scripts/validate/actions.ts` | Action validation      |

### Database (`scripts/db/`)

| Script                                  | Purpose           |
| --------------------------------------- | ----------------- |
| `scripts/db/apply-migrations.ts`        | Apply migrations  |
| `scripts/db/apply-select-migrations.ts` | Select migrations |

### Seeding (`scripts/seed/`)

| Script                                     | Purpose             |
| ------------------------------------------ | ------------------- |
| `scripts/seed/run.ts`                      | Run seeding         |
| `scripts/seed/seed-data.ts`                | Seed data           |
| `scripts/seed/seed-config.ts`              | Seed configuration  |
| `scripts/seed/seed-ids.ts`                 | Seed IDs            |
| `scripts/seed/get-planned-seed-summary.ts` | Planned summary     |
| `scripts/seed/create-plaid-tokens.ts`      | Create Plaid tokens |

### Code Generation (`scripts/generate/`)

| Script                          | Purpose            |
| ------------------------------- | ------------------ |
| `scripts/generate/feature.ts`   | Generate feature   |
| `scripts/generate/dal.ts`       | Generate DAL       |
| `scripts/generate/component.ts` | Generate component |
| `scripts/generate/action.ts`    | Generate action    |
| `scripts/generate/docs-gen.ts`  | Generate docs      |

### TypeScript Entry Points (`scripts/ts/`)

| Script                                  | Purpose             |
| --------------------------------------- | ------------------- |
| `scripts/ts/verify-agents.ts`           | Verify agents       |
| `scripts/ts/mcp-runner.ts`              | MCP runner          |
| `scripts/ts/plugin-verify.ts`           | Plugin verification |
| `scripts/ts/plugin-repair.ts`           | Plugin repair       |
| `scripts/ts/build.ts`                   | Build               |
| `scripts/ts/branch-compare.ts`          | Branch compare      |
| `scripts/ts/run-verify-and-validate.ts` | Run verification    |
| `scripts/ts/opencode-mcp.ts`            | OpenCode MCP        |
| `scripts/ts/aggressive-capture.ts`      | Aggressive capture  |
| `scripts/ts/sweep-wrap-remaining.ts`    | Sweep wrap          |

### TS: Docker (`scripts/ts/docker/`)

| Script                                   | Purpose           |
| ---------------------------------------- | ----------------- |
| `scripts/ts/docker/docker-quickstart.ts` | Docker quickstart |
| `scripts/ts/docker/deploy-checklist.ts`  | Deploy checklist  |
| `scripts/ts/docker/entrypoint.ts`        | Entrypoint        |
| `scripts/ts/docker/generate-env.ts`      | Generate env      |

### TS: Server (`scripts/ts/server/`)

| Script                              | Purpose        |
| ----------------------------------- | -------------- |
| `scripts/ts/server/server-setup.ts` | Server setup   |
| `scripts/ts/server/gen-certs.ts`    | Generate certs |
| `scripts/ts/server/vps-setup.ts`    | VPS setup      |

### TS: Deploy (`scripts/ts/deploy/`)

| Script                                   | Purpose           |
| ---------------------------------------- | ----------------- |
| `scripts/ts/deploy/deploy.ts`            | Deployment        |
| `scripts/ts/deploy/generate-htpasswd.ts` | Generate htpasswd |

### TS: Cleanup (`scripts/ts/cleanup/`)

| Script                                 | Purpose        |
| -------------------------------------- | -------------- |
| `scripts/ts/cleanup/cleanup-docs.ts`   | Docs cleanup   |
| `scripts/ts/cleanup/cleanup-docker.ts` | Docker cleanup |

### TS: Tools (`scripts/ts/tools/`)

| Script | Purpose |
| --- | --- |
| `scripts/ts/tools/discover-app-pages.ts` | Discover app pages |
| `scripts/ts/tools/generate-inventory.ts` | Generate inventory |
| `scripts/ts/tools/create-issues-from-catalog.ts` | Create issues |

### TS: Utils (`scripts/ts/utils/`)

| Script                                    | Purpose             |
| ----------------------------------------- | ------------------- |
| `scripts/ts/utils/cli.ts`                 | CLI utilities       |
| `scripts/ts/utils/spawn-safe.ts`          | Safe spawn          |
| `scripts/ts/utils/ast.ts`                 | AST utilities       |
| `scripts/ts/utils/fs-safe.ts`             | Safe filesystem     |
| `scripts/ts/utils/fix-line-endings.ts`    | Fix line endings    |
| `scripts/ts/utils/disable-extensions.ts`  | Disable extensions  |
| `scripts/ts/utils/check-events.ts`        | Check events        |
| `scripts/ts/utils/check-events-detail.ts` | Check events detail |
| `scripts/ts/utils/plugin-shared.ts`       | Plugin shared       |
| `scripts/ts/utils/read-secrets.ts`        | Read secrets        |

### TS: Utils - CI Helpers (`scripts/ts/utils/ci-helpers/`)

| Script | Purpose |
| --- | --- |
| `scripts/ts/utils/ci-helpers/git-commit-helper-wrapper.ts` | Git commit wrapper |

### Utils (`bin/utils/`)

| Script | Purpose |
| --- | --- |
| `bin/utils/ci-helpers/targeted-test-runner.ts` | Targeted test runner |
| `bin/utils/ci-helpers/seed-prep.ts` | Seed prep |
| `bin/utils/ci-helpers/index.ts` | CI helpers index |
| `bin/utils/ci-helpers/git-commit-helper.ts` | Git commit helper |
| `bin/utils/ci-helpers/report-parser.ts` | Report parser |
| `bin/utils/ci-helpers/parse-reports.ts` | Parse reports |
| `bin/utils/ci-helpers/lint-fix-wrapper.ts` | Lint fix wrapper |
| `bin/utils/ci-helpers/fast-check.ts` | Fast check |
| `bin/utils/ci-helpers/run-with-args.ts` | Run with args |

### Maintenance (`scripts/maintenance/`)

| Script                                     | Purpose           |
| ------------------------------------------ | ----------------- |
| `scripts/maintenance/lint-fix-runner.ts`   | Lint fix runner   |
| `scripts/maintenance/analyze-lint-scan.ts` | Analyze lint scan |

### Provenance (`scripts/provenance/`)

| Script                                      | Purpose             |
| ------------------------------------------- | ------------------- |
| `scripts/provenance/generate-provenance.ts` | Generate provenance |

### Codemod (`scripts/codemod/`)

| Script                           | Purpose     |
| -------------------------------- | ----------- |
| `scripts/codemod/run-codemod.ts` | Run codemod |

### Transform (`scripts/transform/`)

| Script                                      | Purpose       |
| ------------------------------------------- | ------------- |
| `scripts/transform/zod-meta-to-describe.ts` | Zod transform |

### TS: Entrypoints (`scripts/ts/entrypoints/`)

| Script | Purpose |
| --- | --- |
| `scripts/ts/entrypoints/deploy-cli.ts` | Deploy CLI |
| `scripts/ts/entrypoints/run-verify-and-validate-cli.ts` | Verify CLI |

### Types (`scripts/types/`)

| Script                   | Purpose          |
| ------------------------ | ---------------- |
| `scripts/types/index.ts` | Type definitions |

## Summary

- **Shell scripts (.sh)**: 26
- **PowerShell/Batch (.ps1/.bat)**: 46
- **TypeScript scripts (.ts)**: 100+
- **Total**: 172+ scripts

## Dry-Run Status

- Most mutation scripts should support `--dry-run` flag
- Phase 5 of codebase overhaul will add this
