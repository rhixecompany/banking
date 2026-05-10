---
session: ses_1f0d
updated: 2026-05-10T00:30:05.109Z
---

# Session Summary

## Goal

Install, configure, and verify all 10 MCP servers for OpenCode using bun as primary package manager, migrate from npm, optimize caches, and fix/deprecate the deprecated `@modelcontextprotocol/server-github`.

## Constraints & Preferences

- **Primary package manager:** Bun 1.3.14 (`bunx` for CLI execution)
- **Secondary fallback:** npm 11.12.1
- **Node:** v25.9.0
- Use `bunx -y` for all MCP server installation
- Remove redundant npm global packages
- Clean and re-warm caches after migration

## Progress

### Done

- [x] **Audit:** Confirmed 7 local + 3 remote MCP servers from git HEAD~9 config
- [x] **Install via bunx:** All 7 local servers installed (`filesystem`, `memory`, `sequential-thinking`, `github-agentic-workflows`, `next-devtools`, `playwright`, `with-context`)
- [x] **Restore opencode.json:** Restored from git HEAD~9 with correct bunx command format
- [x] **Migrate from npm:** Removed 7 MCP packages from npm global (`server-filesystem`, `server-memory`, `server-sequential-thinking`, `server-github`, `next-devtools-mcp`, `@playwright/mcp`, `with-context-mcp`) — freed 497 packages
- [x] **Cache optimization:** Cleared npm cache (3.4GB→2.7GB), cleared bun cache (`C:\Users\Alexa\.bun\install\cache`), re-warmed with all servers
- [x] **Verify servers:** `memory`, `sequential-thinking`, `github-agentic-workflows`, `playwright`, `with-context` confirmed working via bunx

### In Progress

- [ ] **Remove remaining npm global packages** — current npm global has 6 packages to remove:
  ```
  @ast-grep/cli@0.42.1
  @devcontainers/cli@0.86.0
  @huggingface/transformers@4.1.0
  agent-browser@0.26.0
  hostinger-api-mcp@0.1.37
  opentmux@1.5.7
  ```
- [ ] **Fix/replace deprecated `github-agentic-workflows`** — `@modelcontextprotocol/server-github` is deprecated as of 2025.4.8, need alternative

### Blocked

- `@modelcontextprotocol/server-github` alternatives not yet identified — searched GitHub MCP org, only found deprecated v1 versions (0.2.0 through 2025.4.8)

## Key Decisions

- **Bunx as primary**: bunx auto-installs to shared cache and creates shims in `C:\Users\Alexa\.bun\bin`, no explicit global install needed
- **Preserve non-MCP npm packages**: The 6 remaining npm global packages (@ast-grep, @devcontainers, @huggingface, agent-browser, hostinger-api-mcp, opentmux) are not MCP-related and may need to stay or be moved to project-local deps
- **Restored opencode.json from git**: HEAD~9 commit had correct MCP config with `bunx` command format

## Next Steps

1. **Remove remaining npm global packages** (except npm itself):
   ```bash
   npm uninstall -g @ast-grep/cli @devcontainers/cli @huggingface/transformers agent-browser hostinger-api-mcp opentmux
   ```
2. **Find non-deprecated GitHub MCP server alternative** — check npm for `@modelcontextprotocol/server-github-v2` or `@github/github-mcp` or similar
3. **Update opencode.json** with new GitHub MCP server package name
4. **Re-install new GitHub MCP** via `bunx -y <new-package>`
5. **Verify** all 10 servers work via bunx
6. **Commit** `.opencode/opencode.json` and `docs/plans/mcp-server-install.md`

## Critical Context

- **NPM global prefix:** `C:\nvm4w\nodejs`
- **Bun global bin:** `C:\Users\Alexa\.bun\bin`
- **Bun cache:** `C:\Users\Alexa\.bun\install\cache`
- **NPM cache:** `C:\Users\Alexa\AppData\Local\npm-cache` (2.7GB after cleanup)
- **Git user:** `rhixecompany`
- **Opencode.json MCP config uses array format:**
  ```json
  "command": "bunx",
  "args": ["-y", "@modelcontextprotocol/server-filesystem", "~/"],
  ```
- **MCP servers working via bunx:**
  - `memory` → "Knowledge Graph MCP Server running on stdio"
  - `sequential-thinking` → "Sequential Thinking MCP Server running on stdio"
  - `github` → "GitHub MCP Server running on stdio" (⚠️ deprecated)
  - `playwright` → "Version 0.0.75"
  - `with-context` → "WithContext MCP Server v2.1.0"
- **Remote servers:** `context7`, `exa`, `gh_grep` are always available via HTTPS

## File Operations

### Read

- `C:\Users\Alexa\Desktop\SandBox\Banking\docs\plans\mcp-server-install.md` (comprehensive 7-phase plan)
- `C:\Users\Alexa\.bun\bin` (list of bunx shims)
- `git show HEAD~9:.opencode/opencode.json` (full MCP config)

### Modified

- `C:\Users\Alexa\Desktop\SandBox\Banking\docs\plans\mcp-server-install.md` — updated with 7-phase plan using bun as primary PM, cache optimization, migration steps
- `C:\Users\Alexa\Desktop\SandBox\Banking\.opencode\opencode.json` — restored from git HEAD~9
