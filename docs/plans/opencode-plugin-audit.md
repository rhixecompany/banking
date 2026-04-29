---
plan name: opencode-plugin-audit
plan description: Audit plugins and MCP auth
plan status: active
---

## Idea

Produce a Windows-focused plan to inventory all configured OpenCode plugins and MCP servers from the repo schema/report/runtime config files, classify which ones function without external auth, and document the exact install/config steps (including required environment variables) to make the setup reproducible.

## Implementation

- Inventory plugin sources and counts by re-reading `.opencode/reports/opencode-plugin-verify.json`, `.opencode/reports/opencode-plugin-normalize.json`, and `.opencode/reports/opencode-debug-config.runtime.json` and extracting: configured list, runtime list, and origin paths.
- Inventory MCP servers from `.opencode/opencode.json` and `.cursor/mcp.json` and classify each server as local vs remote and whether it needs API keys/tokens to be useful (context7/exa/gh_grep/hostinger/etc).
- For each runtime plugin, create a matrix: plugin name, purpose, Windows compatibility notes, required secrets (if any), and a concrete verification action (command/tool output) to prove it is working.
- Run `mcp-cli` discovery and tool inspection for each configured MCP server; record failures and which ones are blocked by auth vs misconfiguration vs missing binaries (bunx/docker).
- Document installation + configuration steps to reproduce the working set on Windows: package manager prerequisites (Bun), plugin install commands (where applicable), required `.opencode/opencode.json` / `aiconfig.json` settings, and environment variables needed for auth-required components, with a recommended minimal "no-auth" baseline config.

## Required Specs

<!-- SPECS_START -->

- enhance-pages-spec
- enhance-pages-v2
- root-tests
- mcp-plugin-audit
<!-- SPECS_END -->
