---
plan name: plugin-mcp-inventory
plan description: Plugin/MCP Inventory Plan
plan status: done
---

## Idea

Inventory all configured OpenCode plugins and MCP servers from .opencode schema files, classify which work without external auth, and document exact install/config steps (including environment variables) for reproducible setup on Windows.

## Implementation

- 1. Enumerate all configured plugins from opencode.json (plugin array) - 26 total including superpowers, octto
- 2. Enumerate all MCP servers from opencode.json (mcp object) - 14 total including context7, exa, filesystem, gh_grep, github-agentic-workflows
- 3. For each plugin: read YAML file in .opencode/plugins/ to get repo, tagline, description
- 4. For each MCP server: check type (local/remote), check if environment vars are defined in opencode.json
- 5. Classify by auth required: (a) No auth needed, (b) API key/token in env, (c) OAuth flow, (d) External service account
- 6. Document each with: name, source repo, config in opencode.json, auth type, required env vars, install command
- 7. Create markdown report: docs/plans/2026-04-29-plugin-mcp-inventory.md with tables
- 8. Verify by checking that all referenced plugin YAML files exist in .opencode/plugins/ directory

## Required Specs

<!-- SPECS_START -->
<!-- SPECS_END -->
