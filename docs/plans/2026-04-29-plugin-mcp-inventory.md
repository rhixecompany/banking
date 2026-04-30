# OpenCode Plugin and MCP Server Inventory

**Date:** 2026-04-29  
**Platform:** Windows  
**Source:** `.opencode/opencode.json`, `.opencode/mcp_servers.json`, `.opencode/plugins/*.yaml`

---

## Executive Summary

This document inventories all configured OpenCode plugins (22) and MCP servers (11) from the Banking project's OpenCode configuration. Each entry includes the configuration source, authentication requirements, and exact installation steps for reproducible setup on Windows.

---

## Part 1: Configured Plugins (22 Actual)

Located in `.opencode/opencode.json` under `plugin` array.

> **CORRECTION (2026-04-29):** Plan previously claimed 26 plugins. Actual count is 22. Corrections applied below.

| # | Plugin Name | Source Repository | Description | Auth Required |
| --- | --- | --- | --- | --- |
| 1 | opencode-handoff | github:malhashemi/opencode-handoff | Creates focused handoff prompts for continuing work in a new session | No |
| 2 | opencode-beads | github:joshuadavidthomas/opencode-beads | Integration for Steve Yegge's beads issue tracker with /bd-\* commands | No |
| 3 | @tarquinen/opencode-dcp | github:Tarquinen/opencode-dcp | Dynamic Context Pruning - optimizes token usage by pruning obsolete tool outputs | No |
| 4 | @ramarivera/opencode-model-announcer | github:ramarivera/opencode-model-announcer | Automatically injects the current model name into the chat context | No |
| 5 | open-plan-annotator | github:ndom91/open-plan-annotator | Annotate LLM plans like a Google Doc - strikethrough, replace, insert | No |
| 6 | opencode-ignore | github:lgladysz/opencode-ignore | Ignore directory/file based on pattern | No |
| 7 | opencode-synced | github:iHildy/opencode-synced | Sync configs across machines with public/private visibility | No |
| 8 | opencode-snippets | github:JosXa/opencode-snippets | Instant inline text expansion with #snippet transform | No |
| 9 | opencode-mystatus | github:vbgate/opencode-mystatus | Check all AI subscription quotas in one command | No |
| 10 | @gotgenes/opencode-agent-identity | github:gotgenes/opencode-agent-identity | Agent self-identity and per-message attribution for multi-agent sessions | No |
| 11 | opencode-agent-memory | github:joshuadavidthomas/opencode-agent-memory | Letta-inspired persistent memory blocks | No |
| 12 | opencode-agent-skills | github:joshuadavidthomas/opencode-agent-skills | Dynamic skills loader from project/user/plugin directories | No |
| 13 | opencode-devcontainers | github:athal7/opencode-devcontainers | Multi-branch devcontainers with auto-assigned ports | No |
| 14 | @zenobius/opencode-background | github:zenobi-us/opencode-background | Background process management | No |
| 15 | opencode-sessions | github:malhashemi/opencode-sessions | Session management with multi-agent collaboration | No |
| 16 | @franlol/opencode-md-table-formatter | github:franlol/opencode-md-table-formatter | Markdown table formatting | No |
| 17 | @liannnix/opencode-ntfy | github:liannnix/opencode-ntfy | Push notifications through ntfy.sh | Yes - ntfy.sh URL |
| 18 | @howaboua/opencode-planning-toolkit | github:howaboua/opencode-planning-toolkit | Planning tools (createPlan, readPlan, appendSpec) | No |
| 19 | github:JRedeker/opencode-morph-fast-apply | github:JRedeker/opencode-morph-fast-apply | 10,500+ tokens/sec code editing via Morph Fast Apply API | Yes - Morph API key |
| 20 | opencode-mem | github:tickernelz/opencode-mem | Persistent memory with vector database | No |
| 21 | @slkiser/opencode-quota | github:slkiser/opencode-quota | Quota toasts and token tracking | No |
| 22 | superpowers | git+https://github.com/obra/superpowers.git | Complete software dev workflow with skills (brainstorming, TDD, plans) | No |

**Note:** "octto" is referenced in plan but appears as a project definition, not an active plugin in opencode.json.

---

## Part 2: Configured MCP Servers (11 Actual)

Located in `.opencode/opencode.json` under `mcp` object.

> **CORRECTION (2026-04-29):** Plan previously claimed 14 MCP servers. Actual count is 11. Corrections applied below.

### 2.1 Local MCP Servers (Execute via bunx)

| # | Server Name | Command | Timeout | Auth Required |
| --- | --- | --- | --- | --- |
| 1 | filesystem | `bunx -y @modelcontextprotocol/server-filesystem ~/` | 900000 | No |
| 2 | playwright | `bunx -y @playwright/mcp@latest` | 900000 | No |
| 3 | memory | `bunx -y @modelcontextprotocol/server-memory` | 900000 | No |
| 4 | next-devtools | `bunx -y next-devtools-mcp@latest` | 900000 | No |
| 5 | sequential-thinking | `bunx -y @modelcontextprotocol/server-sequential-thinking` | 900000 | No |
| 6 | shadcn | `bunx shadcn@latest mcp` | 900000 | No (uses local shadcn config) |
| 7 | youtube-transcript | `bunx -y @kimtaeyoon83/mcp-server-youtube-transcript` | 900000 | No |
| 8 | github-agentic-workflows | `bunx -y @modelcontextprotocol/server-github` | 900000 | Yes - GITHUB_TOKEN |

### 2.2 Remote MCP Servers (HTTP)

| # | Server Name | URL | Auth Required |
| --- | --- | --- | --- |
| 1 | context7 | `https://mcp.context7.com/mcp` | No (free tier) |
| 2 | exa | `https://mcp.exa.ai/mcp` | Yes - EXA_API_KEY |
| 3 | gh_grep | `https://mcp.grep.app` | Yes - API key |

### Removed from Plan

- **hostinger**: Command exists in opencode.json but is likely not installed (`hostinger-api-mcp` not available in npm registry)

---

## Part 3: Authentication Classification

### 3.1 Plugins/MCP Servers NOT Requiring External Auth

These work out of the box after `bun install`:

- opencode-handoff, opencode-beads, @tarquinen/opencode-dcp
- @ramarivera/opencode-model-announcer, open-plan-annotator
- opencode-ignore, opencode-synced, opencode-snippets
- opencode-mystatus, @gotgenes/opencode-agent-identity
- opencode-agent-memory, opencode-agent-skills, opencode-devcontainers
- @zenobius/opencode-background, opencode-sessions
- @franlol/opencode-md-table-formatter, @howaboua/opencode-planning-toolkit
- opencode-mem, @slkiser/opencode-quota
- superpowers

All local MCP servers (filesystem, playwright, memory, next-devtools, sequential-thinking, shadcn, youtube-transcript).

Remote: context7 (free tier available).

### 3.2 Plugins/MCP Servers Requiring Auth

| Component | Auth Type | Environment Variable | Notes |
| --- | --- | --- | --- |
| @liannnix/opencode-ntfy | ntfy.sh URL | NTFY_URL | Custom ntfy server URL |
| JRedeker/opencode-morph-fast-apply | API key | MORPH_API_KEY | Get from https://morph.sh |
| github-agentic-workflows | GitHub token | GITHUB_TOKEN | Requires repo scope |
| gh_grep | API key | GREP_API_KEY | Get from https://grep.app |
| exa | API key | EXA_API_KEY | Get from https://exa.ai |

---

## Part 4: Installation Steps (Windows)

### 4.1 Prerequisites

```powershell
# Install Bun (required for all MCP servers)
iwr https://bun.sh/install.ps1 | iex

# Verify
bun --version
```

### 4.2 Core Setup (No Auth Required)

```powershell
# Clone/fork the repo, then:
cd C:\Users\Alexa\Desktop\SandBox\Banking

# Install Bun if not present
iwr https://bun.sh/install.ps1 | iex

# Local MCP servers are executed via bunx at runtime - no pre-install needed
# Plugins load automatically from opencode.json entries
```

### 4.3 Optional: Auth-Required Components

**For GitHub MCP:**

```powershell
# Set GitHub token
$env:GITHUB_TOKEN = "ghp_xxxxxxxxxxxx"

# Or create ~/.env:
# GITHUB_TOKEN=ghp_xxx
```

**For Exa:**

```powershell
$env:EXA_API_KEY = "exa-xxx"

# Get free key: https://exa.ai/dashboard
```

**For Morph:**

```powershell
$env:MORPH_API_KEY = "mor_xxx"

# Get key: https://morph.sh/dashboard
```

**For ntfy.sh:**

```powershell
$env:NTFY_URL = "https://ntfy.sh/your-topic"

# Or self-hosted: https://ntfy.sh/docs/install/
```

---

## Part 5: Verification Commands

```powershell
# Start OpenCode and verify plugins load
opencode --status

# Check MCP servers
opencode mcp list

# Test specific server
opencode mcp invoke filesystem --args '{}'
```

---

## References

- Main config: `.opencode/opencode.json`
- MCP servers listing: `.opencode/mcp_servers.json`
- Plugin registry: `.opencode/registry.json`
- Schema definition: `.opencode/schema.json`

---

## Appendix: Quick Reference Table

| Component     | Type         | Auth | Env Vars         |
| ------------- | ------------ | ---- | ---------------- |
| superpowers   | Plugin       | No   | None             |
| context7      | MCP (remote) | No\* | None (free tier) |
| exa           | MCP (remote) | Yes  | EXA_API_KEY      |
| filesystem    | MCP (local)  | No   | None             |
| playwright    | MCP (local)  | No   | None             |
| github        | MCP (local)  | Yes  | GITHUB_TOKEN     |
| next-devtools | MCP (local)  | No   | None             |

**Note:** Additional MCP servers configured: memory, sequential-thinking, shadcn, youtube-transcript, gh_grep (remote)

---

**End of Report**
