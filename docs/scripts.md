# Scripts Inventory

## Overview

Generated: 2026-05-07 Source: `scripts/**`

## Shell Scripts (Orchestrators)

| Script | Type | Purpose |
| --- | --- | --- |
| `scripts/verify-agents.sh/ps1` | Orchestrator | Verify OpenCode agents |
| `scripts/opencode-plugin-verify.sh/ps1/bat` | Orchestrator | Verify plugins |
| `scripts/opencode-plugin-repair.sh/ps1/bat` | Orchestrator | Repair plugins |
| `scripts/opencode-mcp.sh/ps1/bat` | Orchestrator | MCP operations |
| `scripts/plan-ensure.sh/ps1/bat` | Orchestrator | Plan validation |
| `scripts/orchestrator.sh/ps1/bat` | Orchestrator | General orchestration |
| `scripts/diagnose-and-fix-git.sh/ps1` | Orchestrator | Git diagnostics |
| `scripts/branch-compare.sh` | Orchestrator | Compare branches |
| `scripts/run-verify-and-validate.ps1` | Orchestrator | Run verification |
| `scripts/delete-gone-branches.sh` | Orchestrator | Cleanup branches |
| `scripts/aggressive-capture.ps1` | Orchestrator | Capture operations |

## TypeScript Scripts (Logic)

| Script                       | Purpose                  | Dry-Run |
| ---------------------------- | ------------------------ | ------- |
| `scripts/mcp-runner.ts`      | MCP server management    | No      |
| `scripts/verify-rules.ts`    | AST policy check         | No      |
| `scripts/validate.ts`        | Configuration validation | No      |
| `scripts/export-json.ts`     | Export registry JSON     | No      |
| `scripts/generate-readme.ts` | Generate README          | No      |
| `scripts/plan-ensure.ts`     | Plan validation          | No      |
| `scripts/debug-pw.ts`        | Debug utilities          | No      |
| `scripts/report-parser.ts`   | Parse CI reports         | No      |
| `scripts/orchestrator.ts`    | Main orchestration       | No      |
| `scripts/validate/`          | Validation helpers       | No      |
| `scripts/seed/`              | Database seeding         | No      |
| `scripts/generate/`          | Code generation          | No      |
| `scripts/ts/tools/`          | Various tools            | Varies  |
| `scripts/ts/utils/`          | Utility functions        | Varies  |
| `scripts/ts/docker/`         | Docker utilities         | No      |
| `scripts/ts/server/`         | Server setup             | No      |
| `scripts/ts/deploy/`         | Deployment scripts       | Yes     |
| `scripts/ts/docs/`           | Documentation            | No      |
| `scripts/ts/cleanup/`        | Cleanup operations       | Yes     |
| `scripts/utils/ci-helpers/`  | CI helper functions      | No      |

## Summary

- **Shell orchestrators**: 11
- **TypeScript scripts**: 100+
- **Total**: 111+ scripts

## Dry-Run Status

- Most mutation scripts should support `--dry-run` flag
- Phase 5 of codebase overhaul will add this
