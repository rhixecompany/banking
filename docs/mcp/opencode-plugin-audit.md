# OpenCode Plugin and MCP Audit (Windows)

This document audits the OpenCode plugin and MCP configuration in this repo (Windows-first). It focuses on:

- What is configured vs what actually loads at runtime
- What requires auth/secrets (env var NAMES only)
- How to verify each plugin/server is functioning

## Sources of Truth

- Project OpenCode config: `.opencode/opencode.json`
- Cursor MCP config: `.cursor/mcp.json`
- Runtime OpenCode debug output: `.opencode/reports/opencode-debug-config.runtime.json`
- Plugin verification output: `.opencode/reports/opencode-plugin-verify.json`
- Plugin catalog: `.opencode/plugins/*.yaml` and `.opencode/registry.json`
- Secrets references (repo docs): `docs/secrets-management.md`, `docs/README.agents.md`

## Plugin Inventory

### Counts

- Expected plugins (aiconfig): 25
- Runtime plugins (opencode debug config): 24
- Missing at runtime: `@mailshieldai/opencode-canvas`

### Runtime Plugin List (24)

From `.opencode/reports/opencode-debug-config.runtime.json`:

- opencode-handoff
- opencode-beads
- @tarquinen/opencode-dcp
- @ramarivera/opencode-model-announcer
- open-plan-annotator
- opencode-ignore
- opencode-synced
- opencode-snippets
- opencode-mystatus
- @gotgenes/opencode-agent-identity
- opencode-agent-memory
- opencode-agent-skills
- opencode-devcontainers
- @zenobius/opencode-background
- opencode-sessions
- @franlol/opencode-md-table-formatter
- @liannnix/opencode-ntfy
- @howaboua/opencode-planning-toolkit
- github:JRedeker/opencode-morph-fast-apply
- opencode-mem
- @slkiser/opencode-quota
- smart-codebase
- superpowers@git+https://github.com/obra/superpowers.git
- octto

### Plugin Matrix

Notes:

- For most plugins, there are no repo-documented env vars.
- Verification actions below prefer built-in OpenCode commands where possible.

| Plugin | Purpose (from local metadata) | Auth/Secrets | Env var names | Verification |
| --- | --- | --- | --- | --- |
| opencode-handoff | Session handoff prompts | No | - | `opencode plugin list` and verify `handoff_session` tool exists |
| opencode-beads | Beads task agent integration | No | - | `opencode plugin list` and verify beads tools exist |
| @tarquinen/opencode-dcp | Dynamic context pruning (token optimization) | No | - | Run until a tool output is pruned; confirm compaction behavior |
| @ramarivera/opencode-model-announcer | Inject current model name into context | No | - | Observe model announcement message in session |
| open-plan-annotator | Annotate plans inline | No | - | Use plan tooling and confirm annotator UI/hooks run |
| opencode-ignore | Ignore files by pattern | No | - | Confirm ignored files do not appear in tool reads/searches |
| opencode-synced | Sync OpenCode config across machines | No | - | `opencode plugin list` and confirm sync commands exist |
| opencode-snippets | Snippet expansion (`#snippet`) | No | - | Use a snippet trigger and confirm expansion |
| opencode-mystatus | Quota status command | No | - | Run `opencode mystatus` (or the configured mystatus command) |
| @gotgenes/opencode-agent-identity | Agent identity + attribution | No | - | Verify identity tooling appears and attribution changes are visible |
| opencode-agent-memory | Agent memory hooks | No | - | Verify memory tools are available and respond |
| opencode-agent-skills | Skill discovery/activation helpers | No | - | Verify skill discovery works and skills list is available |
| opencode-devcontainers | Devcontainer helpers | No | - | Verify devcontainer tools exist (if configured) |
| @zenobius/opencode-background | Background task runner | No | - | Start a background process and read its output |
| opencode-sessions | Session management | No | - | Create/read session via session tooling |
| @franlol/opencode-md-table-formatter | Markdown table formatting | No | - | Format a markdown table and verify output |
| @liannnix/opencode-ntfy | Push notifications via ntfy.sh | Likely | (not documented in repo) | Verify plugin loads; send a test notification if configured |
| @howaboua/opencode-planning-toolkit | Plans/specs tooling | No | - | `bun run plan:ensure` and verify plan tools work |
| github:JRedeker/opencode-morph-fast-apply | Faster apply_patch/morph operations | No | - | Apply a patch and confirm tool behavior |
| opencode-mem | Persistent memory with vector DB | Likely | (not documented in repo) | Verify plugin loads; confirm persistence across sessions if configured |
| @slkiser/opencode-quota | Quota toasts and token tracking | No | - | Trigger quota/status command and confirm reporting |
| smart-codebase | Codebase indexing/search helper | No | - | Verify codebase search tooling works |
| superpowers@git+https://github.com/obra/superpowers.git | Skill pack enforcing workflows | No | - | Confirm required skills are available and invoked |
| octto | Interactive brainstorming UI | No | - | Start an Octto brainstorm session and answer prompts |
| @mailshieldai/opencode-canvas (missing) | Interactive terminal canvases | No | - | Install and confirm it appears in runtime plugin list |

## MCP Inventory

### Configured Servers

From `.opencode/opencode.json`:

- Remote: `context7`, `exa`, `gh_grep`
- Local (bunx): `filesystem`, `github-agentic-workflows`, `hostinger`, `memory`, `next-devtools`, `playwright`, `sequential-thinking`, `shadcn`, `youtube-transcript`

From `.cursor/mcp.json`:

- Remote: `exa`
- Docker gateway: `MCP_DOCKER` runs `docker mcp gateway run --profile adminbot`

### Server Matrix

| Server | Type | Auth required | Env var names (repo-known) | Verification |
| --- | --- | --- | --- | --- |
| context7 | remote | Often | `CONTEXT7_API_KEY` | `opencode mcp debug context7` should show HTTP 200; tool calls may require API key |
| exa | remote | Unknown | (not documented in repo) | `opencode mcp debug exa` should show HTTP 200 |
| gh_grep | remote | No | - | `opencode mcp debug gh_grep` should show HTTP 200 |
| filesystem | local (bunx) | No | - | `filesystem_list_allowed_directories` (worked) |
| github-agentic-workflows | local (bunx) | Yes (PAT) | `GITHUB_PERSONAL_ACCESS_TOKEN` | Call any github-agentic-workflows tool; expect 401/permission errors if token missing |
| hostinger | local (bunx) | Yes | `APITOKEN` | With `APITOKEN` set, call a hostinger tool; without it, expect auth failure |
| memory | local (bunx) | No | - | `memory_search_nodes` (worked) |
| next-devtools | local (bunx) | No | - | Requires a running Next.js dev server; then use next-devtools MCP tools |
| playwright | local (bunx) | No | - | Use Playwright MCP tools to navigate and snapshot a page |
| sequential-thinking | local (bunx) | No | - | `sequential-thinking_sequentialthinking` (worked) |
| shadcn | local (bunx) | No | - | `shadcn_get_project_registries` (worked) |
| youtube-transcript | local (bunx) | No | - | Start server and request a transcript; current environment shows a native crypto assertion crash in logs |
| MCP_DOCKER (adminbot) | docker | Depends on enabled servers | (depends) | `docker mcp gateway run --profile adminbot` (see `docs/mcp/docker-mcp-adminbot.md`) |

### Evidence Collected in This Audit

- `opencode mcp debug context7` returns HTTP 200 and indicates OAuth metadata.
- `opencode mcp debug exa` returns HTTP 200.
- `opencode mcp debug gh_grep` returns HTTP 200.
- Local tool calls succeeded:
  - `filesystem_list_allowed_directories`
  - `shadcn_get_project_registries`
  - `memory_search_nodes`
  - `sequential-thinking_sequentialthinking`

## Minimal “No-Auth” Baseline

If you want the smallest MCP setup that does not require secrets:

- Keep: `filesystem`, `shadcn`, `playwright`, `sequential-thinking`
- Optional (remote, no secrets observed for connection): `gh_grep`

Avoid in no-auth baseline:

- `github-agentic-workflows` (needs `GITHUB_PERSONAL_ACCESS_TOKEN` for real repo access)
- `hostinger` (needs `APITOKEN`)
- `context7` (likely needs `CONTEXT7_API_KEY` for full functionality)
- `exa` (auth requirements not documented in this repo)

## Catalog File (`.opencode/mcp_servers.json`)

This repo includes a baseline `.opencode/mcp_servers.json` seeded from the Docker adminbot profile docs (`docs/mcp/docker-mcp-adminbot.md`).

- The intention is that `scripts/mcp-runner.ts` can diff discovered servers against this catalog.
- The runner remains dry-run by default; use `--apply` to write updates.
