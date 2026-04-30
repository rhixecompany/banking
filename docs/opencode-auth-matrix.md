# OpenCode Auth Matrix

**Date:** 2026-04-30  
**Source:** `bunx opencode mcp list`

---

## Summary

| Category  | Count |
| --------- | ----- |
| Connected | 4     |
| Failed    | 8     |
| Total     | 12    |

---

## MCP Servers Detail

### Connected (Working)

| Server | Command/URL | Auth Required | Env Vars | Notes |
| --- | --- | --- | --- | --- |
| context7 | `https://mcp.context7.com/mcp` | No | None | Free tier works |
| exa | `https://mcp.exa.ai/mcp` | Yes | EXA_API_KEY | Requires API key |
| filesystem | `bunx -y @modelcontextprotocol/server-filesystem ~/` | No | None | Local filesystem access |
| gh_grep | `https://mcp.grep.app` | Yes | GREP_API_KEY | Requires API key |

### Failed

| Server | Command | Error | Auth Required | Likely Cause |
| --- | --- | --- | --- | --- |
| github-agentic-workflows | `bunx -y @modelcontextprotocol/server-github` | Request timed out | Yes | GITHUB_TOKEN missing or rate limited |
| hostinger | `bunx -y hostinger-api-mcp` | Connection closed | No | Package not available in npm |
| memory | `bunx -y @modelcontextprotocol/server-memory` | Connection closed | No | Server failed to start |
| next-devtools | `bunx -y next-devtools-mcp@latest` | EUNKNOWN: uv_spawn | No | Binary/executable issue |
| playwright | `bunx -y @playwright/mcp@latest` | Connection closed | No | Server failed to start |
| sequential-thinking | `bunx -y @modelcontextprotocol/server-sequential-thinking` | Connection closed | No | Server failed to start |
| shadcn | `bunx shadcn@latest mcp` | Connection closed | No | Server failed to start |
| youtube-transcript | `bunx -y @kimtaeyoon83/mcp-server-youtube-transcript` | Connection closed | No | Server failed to start |

---

## Recommended No-Auth Baseline

For development without external API keys, use these 2 MCP servers:

1. **context7** - Documentation lookup (free tier)
2. **filesystem** - Local file access

---

## Auth-Required Servers

To enable additional functionality, set these environment variables:

| Server | Env Variable | How to Get |
| --- | --- | --- |
| exa | EXA_API_KEY | https://exa.ai/dashboard |
| gh_grep | GREP_API_KEY | https://grep.app |
| github-agentic-workflows | GITHUB_TOKEN | GitHub Settings > Developer Settings > Personal Access Tokens |

---

## Plugins Status

All 22 plugins load without auth. See docs/plans/2026-04-29-plugin-mcp-inventory.md for full list.

---

**End of Matrix**
