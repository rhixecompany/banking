# Spec: mcp-plugin-audit

Scope: feature

# Spec: mcp-plugin-audit

Scope: feature

## Goal

Create a reproducible, Windows-focused audit of the repo's OpenCode plugins and MCP servers, clearly separating:

- what is configured vs what is actually available at runtime
- what works with no external authentication
- what is blocked by missing/misconfigured credentials vs missing binaries vs OS limitations

## In Scope

- Inventory configured plugins and runtime plugin state using:
  - `.opencode/reports/opencode-plugin-verify.json`
  - `.opencode/reports/opencode-plugin-normalize.json`
  - `.opencode/reports/opencode-debug-config.runtime.json`
- Inventory MCP servers configured in:
  - `.opencode/opencode.json`
  - `.cursor/mcp.json`
- For each MCP server and plugin, document:
  - Purpose / what it enables
  - Whether it is local vs remote
  - Windows compatibility notes (pathing, shells, required runtimes)
  - Required secrets (env var names only; no values)
  - Minimal verification action (command + expected signal)
- Run `mcp-cli` discovery + tool inspection for each configured MCP server and record the outcome:
  - working
  - blocked by auth
  - misconfigured
  - missing binary/runtime
- Provide a recommended minimal "no-auth baseline" configuration that still enables useful local tooling.

## Out of Scope

- Adding new plugins/MCP servers not already referenced in repo config
- Committing any credentials or copying secret values into docs
- Refactoring app code unrelated to plugin/MCP setup

## Deliverables

- A single canonical audit document checked into the repo (location chosen by the implementer) containing:
  - Summary of working vs blocked components
  - A matrix/table for plugins and MCP servers
  - Exact setup steps for Windows (prereqs, install commands, env var names)
  - Verification steps per component
- Optional: a short "quickstart" section for the minimal no-auth baseline.

## Acceptance Criteria

- Every configured runtime plugin and every configured MCP server appears in the audit matrix.
- Each matrix row includes: name, type (plugin/MCP), purpose, auth required (yes/no), required env var names (if any), and a verification action.
- Failures are classified with a reason (auth vs misconfig vs missing binary) and include the concrete error/output snippet location.
- The minimal no-auth baseline is runnable on Windows and includes at least one verification step demonstrating success.
- No secrets are introduced into git (env var values, tokens, keys).

## Verification

- `mcp-cli` results recorded for each server (discovery + at least one tool call where applicable).
- A reviewer can follow the documented Windows steps on a fresh machine and reproduce:
  - the minimal no-auth baseline
  - at least one auth-required component after setting env vars
