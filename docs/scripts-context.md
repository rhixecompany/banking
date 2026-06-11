# Scripts Context

**Last Updated:** 2026-05-05  
**Status:** Canonical reference for all executable scripts after the Group A–I overhaul.

---

## Overview

Scripts follow the **thin-wrapper pattern**: shell/PowerShell orchestrators call TypeScript implementations. All business logic lives in TypeScript for cross-platform compatibility and testability.

The project is pure ESM (`"type": "module"` in `package.json`). All scripts use `bunx tsx` as the runner — never `ts-node`, never `npx`.

---

## Locations

| Location | Purpose |
| --- | --- |
| `scripts/ts/` | Build, CI, seeding, and general-purpose utilities |
| `scripts/ts/entrypoints/` | CLI entry points (thin wrappers over logic modules) |
| `scripts/ts/utils/` | Shared helpers (`ast.ts`, `cli.ts`, `fs-safe.ts`, etc.) |
| `scripts/ts/mcp/` | (Empty — MCP runner migrated to `.opencode/tools/`) |
| `.opencode/tools/` | OpenCode-specific tooling (plugin repair/verify, MCP runner) |
| `.opencode/tools/utils/` | Shared helpers for OpenCode tools (`plugin-shared.ts`) |

---

## OpenCode Tools (`.opencode/tools/`)

These scripts manage the OpenCode plugin and MCP runtime. They are intentionally kept outside `scripts/ts/` because they are OpenCode-internal concerns, not general build tooling.

### `plugin-repair.ts`

Restores plugin runtime state by cleaning stale installs and reinstalling all plugins listed across project and global configs.

```bash
# Dry-run (default — safe, no writes)
bunx tsx .opencode/tools/plugin-repair.ts

# Apply changes
bunx tsx .opencode/tools/plugin-repair.ts --apply

# via npm script
bun run opencode:plugins:repair
bun run opencode:plugins:repair:apply

# via Makefile
make plugins-repair
make plugins-repair-apply
```

### `plugin-verify.ts`

Validates that plugins in project config match the runtime. Detects missing plugins, extras, duplicates, and OS incompatibilities.

```bash
bunx tsx .opencode/tools/plugin-verify.ts

# Disk usage only
bunx tsx .opencode/tools/plugin-verify.ts --disk-only

# via npm script
bun run opencode:plugins:verify
bun run opencode:plugins:disk:check

# via Makefile
make plugins-verify
```

### `mcp-runner.ts`

Dry-run tool. Reads `.opencode/reports/pages-map.json` and proposes (but never writes) additions to opencode manifest files.

```bash
bunx tsx .opencode/tools/mcp-runner.ts

# via npm script
bun run opencode-mcp-runner

# via Makefile
make tools-mcp
```

### `utils/plugin-shared.ts`

Shared utilities for `plugin-repair.ts` and `plugin-verify.ts`. Not meant to be run directly.

---

## General Scripts (`scripts/ts/`)

See `docs/scripts.md` for the full inventory of general-purpose scripts. Key highlights:

| Script | Runner | Purpose |
| --- | --- | --- |
| `scripts/ts/build.ts` | `bunx tsx` | Production build orchestrator |
| `scripts/ts/run-ci-checks.ts` | `bunx tsx` | Full CI check suite |
| `scripts/ts/verify-agents.ts` | `bunx tsx` | Verify agent plan files |
| `scripts/ts/entrypoints/deploy-cli.ts` | `bunx tsx` | Deployment CLI entry point |
| `scripts/ts/entrypoints/run-verify-and-validate-cli.ts` | `bunx tsx` | Verify + validate CLI entry point |
| `scripts/ts/utils/ast.ts` | `bunx tsx` | AST-based rule checker |
| `scripts/ts/utils/cli.ts` | `bunx tsx` | CLI argument parsing helpers |
| `scripts/ts/utils/fs-safe.ts` | `bunx tsx` | Safe filesystem helpers |

---

## ESM Conventions

All scripts in this project must follow ESM conventions:

- **Shebang:** `#!/usr/bin/env node` (not `ts-node`)
- **No `require.main === module`** — use `process.argv[1] === fileURLToPath(import.meta.url)` instead
- **Imports:** use `.js` extension in relative imports (resolved by tsx at runtime)
- **No `any`** — use `unknown` and narrow with type guards or Zod

---

## Quick Reference

```bash
# Plugin tools
make plugins-verify          # Verify plugin config
make plugins-repair          # Dry-run repair
make plugins-repair-apply    # Apply repairs
make tools-mcp               # Inspect pages-map.json

# CI / validation
bun run verify:rules         # AST policy enforcement
bun run type-check           # TypeScript strict check
bun run lint:strict          # ESLint (zero warnings)
bun run format               # Prettier

# Full pre-PR check (fast)
bun run format && bun run type-check && bun run lint:strict && bun run verify:rules
```
