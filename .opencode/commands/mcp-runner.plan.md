<!-- Provenance:
  - docs/mcp/docker-mcp-adminbot.md — read to map adminbot profile and preferred servers
  - .opencode/mcp_servers.json — read to seed existing catalog for merging
  - opencode.json — read for current mcp config (plan-only; no writes without approval)
  - .opencode/commands/mcp-runner.plan.md — original plan read to extend and refine
  Reason: enhance discovery, safety, and auditability for the MCP runner CLI. -->

# MCP Runner Plan (enhanced)

## Goals

- Implement `scripts/mcp-runner.ts` (CLI) and `scripts/mcp-runner-lib.ts` (helpers) to discover Docker MCP servers, merge new servers into `.opencode/mcp_servers.json`, generate minimal helpers under `scripts/mcp-helpers/`, and optionally sync the `mcpServers` field in `opencode.json` (opencode.json changes are plan-only until explicit approval).
- Prefer structured adminbot gateway output when available and fall back to `docker ps`.
- Default to conservative behavior: `--dry-run` by default; require interactive confirmation for destructive actions.

## Scope

- Add/extend the CLI, parsing helpers, unit tests, and generated helpers. Update this plan file in-repo now.
- Only write `.opencode/mcp_servers.json` and helper files when run with `--apply` (not in dry-run). Create backups before overwriting.
- Do not modify `opencode.json` in this step; proposed opencode.json metadata is included in this plan and will be applied only after explicit approval.

## Target Files

- scripts/mcp-runner.ts (new CLI)
- scripts/mcp-runner-lib.ts (new parsing & generation helpers)
- scripts/mcp-helpers/\* (generated helpers)
- tests/unit/mcp-runner.parse.test.ts (new)
- .opencode/commands/mcp-runner.plan.md (this file)
- .opencode/mcp_servers.json (read; write only with --apply)
- opencode.json (read-only for now)

## Risks

- False-positive discovery (noisy tokens) — mitigated by strict parser, denylist, and cross-checking with existing catalog. Unknown-but-valid tokens are flagged for manual review rather than auto-added.
- Destructive Docker operations — mitigated by dry-run default, interactive REMOVE confirmation, and explicit `--force` for non-interactive flows (owner approval required for non-interactive prune).
- Overwriting helpers or metadata — mitigated by checksum checks, backups (`.bak.<timestamp>`), and audit artifacts.

## Planned Changes

1. CLI: `scripts/mcp-runner.ts` with flags: `--dry-run` (default), `--apply`, `--prune`, `--force`, `--helpers-dir`, `--catalog-path`, `--opencode-path`, `--verbose`, `--dry-run-summary-only`.
2. Discovery Strategy (priority):
   - Preferred: run `docker mcp gateway run --profile adminbot` and parse the "Enabled MCP Servers" table to obtain canonical names.
   - Fallback: `docker ps --format '{{.Names}}'` parsing and normalization.
3. Parsing rules (STRICT as chosen):
   - Normalize tokens: trim, toLowerCase(), replace whitespace with `-`.
   - Accept only tokens matching: `^[a-z0-9._:-]+(?:[-_][a-z0-9._:-]+)*$`.
   - Denylist (seeded): [adding, configuration, start, total, those] (case-insensitive).
   - Cross-check discovered names against `.opencode/mcp_servers.json`; if unknown but valid-looking, flag for manual review.
4. Implement `parseGatewayOutput()` and `parseDockerPsOutput()` with unit tests covering adminbot fixtures and noisy samples.
5. Merge servers into an in-memory catalog (include `discoveredVia` and `timestamp`) and present a clear diff on dry-run.
6. Helper generation: `scripts/mcp-helpers/<server>.ts` — minimal template with provenance header, likely tools list (best-effort), and checksum. On `--apply`: write new helpers, backup and overwrite existing if different, skip identical files.
7. Update `.opencode/mcp_servers.json` only on `--apply` (backup first). Provide a clear diff in the audit artifact.
8. Prune: allowed only with `--apply`; present targeted containers and require exact typing of `REMOVE` to proceed. Non-interactive prune requires `--force` plus owner approval (documented), but we will default to interactive-only.

## Validation

- Unit tests (Vitest) for parser, normalization, denylist, and checksum/no-op behavior.
- Local verification: `node scripts/mcp-runner.ts --dry-run` to preview changes.
- Post-apply validations (must be run after `--apply`):
  - `npm run format`
  - `npm run type-check`
  - `npm run lint:strict`
  - `npm run verify:rules`
  - `npm run test:browser`

## Audit & Artifacts

- On any `--apply`, create an audit artifact `mcp-runner-apply-<timestamp>.json` under `.opencode/mcp-audit/` containing:
  - Commands executed (gateway, docker ps), truncated outputs, list of files written/backed up/skipped, and the CLI flags used.
  - Provenance: files read and user decisions.

## Rollback / Mitigation

- Any modified files will have backups with suffix `.bak.<timestamp>` in the same directory. Provide a helper `--rollback --backup <path>` in the CLI to restore from a backup.
- Docker container removals are irreversible; the audit artifact will list removed container names/images to assist manual recovery.

## opencode.json — proposed mcp metadata (plan-only)

- We propose adding a structured `mcp` metadata block (not applied now) that includes `preferredServers` (the adminbot's 9 servers), `discovery` settings (parser: "strict", denylist seeds, helpersDir), `securityDefaults` (no-new-privileges, cpus, memory, pull policy), and `audit` settings. Applying this change requires explicit approval.

## CI Integration

- Add an optional GitHub Actions job (report-only) to run `node scripts/mcp-runner.ts --dry-run` on PRs to surface server drift to reviewers without modifying repo state.

## Deliverables

- scripts/mcp-runner.ts (CLI)
- scripts/mcp-runner-lib.ts (helpers)
- tests/unit/mcp-runner.parse.test.ts (Vitest)
- scripts/mcp-helpers/\* (generated on --apply)
- .opencode/commands/mcp-runner.plan.md (this enhanced plan — updated in-repo)
- Documentation snippet for docs/mcp/ describing safe operator flows (optional)

## Next Steps (implementation flow)

1. I will prepare the implementation patches (CLI, helpers, tests) and run unit tests locally in dry-run mode.
2. Present the exact patches and test outputs for review.
3. On your explicit approval to `--apply`: create backups, write helpers and update `.opencode/mcp_servers.json`, save audit artifact, run validations, and commit with a provenance message that includes files read and the reason.

## User Decisions Incorporated

- Parser policy: Strict (only canonical names; denylist + catalog cross-check).
- Denylist seeds: [Adding, Configuration, Start, Total, Those].
- Helpers generation: Yes — automatically on `--apply` (skip identical files; backup overwritten files).
- Prune: Interactive-only (type `REMOVE`).
- Audit artifacts saved to `.opencode/mcp-audit/`.
- Pre-commit checks on apply: run `format`, `type-check`, `lint:strict`, `verify:rules`, `test:browser`.
- CI: add optional dry-run job for PRs (report-only).

---

(End of plan)
