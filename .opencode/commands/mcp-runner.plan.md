<!-- Provenance: .opencode/mcp_servers.json — read to list current MCP servers for discovery and planning -->

# MCP Runner Plan

## Goals

- Implement `scripts/mcp-runner.ts` to discover Docker MCP servers, merge new servers into `.opencode/mcp_servers.json`, generate minimal helpers under `scripts/mcp-helpers/`, and optionally sync the `mcpServers` field in `opencode.json`.
- Provide a safe default (dry-run) and require interactive confirmation for destructive Docker operations.

## Scope

- Add: `scripts/mcp-runner.ts`, `tests/unit/mcp-runner.parse.test.ts`, and generated helpers under `scripts/mcp-helpers/`. Include this plan file.
- Update `.opencode/mcp_servers.json` and `opencode.json` only when run with `--apply` (not in dry-run) and create backups before writing.

## Target Files

- scripts/mcp-runner.ts (new)
- scripts/mcp-helpers/\* (new, generated)
- tests/unit/mcp-runner.parse.test.ts (new)
- .opencode/commands/mcp-runner.plan.md (this file)
- .opencode/mcp_servers.json (read; will be written only with --apply)
- opencode.json (read/merge; write only with --apply)

## Risks

- Parsing Docker output may break if format changes — mitigated by tolerant parsing and unit tests.
- Destructive Docker actions — mitigated by dry-run default and interactive confirmation plus a required `--force` flag for non-interactive runs.
- Overwriting helpers — mitigated by creating backups and using checksum checks.

## Planned Changes

1. Implement CLI in `scripts/mcp-runner.ts` with flags: `--dry-run` (default), `--apply`, `--prune`, `--force`, `--helpers-dir`, `--catalog-path`, `--opencode-path`, `--verbose`.
2. Discovery: run `docker mcp gateway run --profile adminbot` (when available) and fall back to `docker ps` output parsing.
3. Parse discovered server names using `parseDockerOutput()` (unit-tested).
4. Merge servers into an in-memory catalog and report differences.
5. Generate minimal helper files in `scripts/mcp-helpers/<server>.ts` (back up existing files when overwriting).
6. Update `.opencode/mcp_servers.json` and `opencode.json` (only with `--apply`), writing backups first.
7. If `--prune` and user confirms, stop and remove Docker MCP servers not in catalog (requires `--force` for non-interactive runs).

## Validation

- Unit tests: parser and dry-run behavior via Vitest.
- Local verification: run `node scripts/mcp-runner.ts --dry-run` to preview changes.
- After apply: run `npm run format`, `npm run type-check`, `npm run lint:strict`, `npm run verify:rules`, `npm run test:browser`.

## Rollback

- Backups are created for any modified files (suffix `.bak.<timestamp>`). Restore from backups if rollback is needed.
- Docker removals cannot be automatically undone; interactive confirmation is required before any destructive action.
