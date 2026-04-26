# Docker MCP Gateway — adminbot Profile

**Generated:** 2026-04-05 | **Profile:** adminbot | **Catalog:** mcp/docker-mcp-catalog:latest (316 servers)

---

## Overview

The `adminbot` profile loads 9 MCP servers from the Docker MCP catalog with 316 available servers. The gateway exposes **56 tools**, **3 prompts**, and **16 resources** across all servers, plus 9 internal gateway management tools.

---

## Enabled MCP Servers

| # | Server | Tools | Prompts | Resources | Notes |
| --- | --- | --- | --- | --- | --- |
| 1 | `filesystem` | 11 | 0 | 0 | Mounted to project dir, no network |
| 2 | `playwright` | 21 | 0 | 0 | Browser automation |
| 3 | `memory` | 9 | 0 | 0 | Persistent knowledge graph (claude-memory volume) |
| 4 | `next-devtools-mcp` | 5 | 2 | 16 | Next.js runtime diagnostics |
| 5 | `context7` | 2 | 0 | 0 | Library documentation lookup |
| 6 | `time` | 2 | 0 | 0 | Timezone conversion |
| 7 | `youtube_transcript` | 4 | 0 | 0 | YouTube video transcripts |
| 8 | `fetch` | 1 | 1 | 0 | URL fetching |
| 9 | `sequentialthinking` | 1 | 0 | 0 | Chain-of-thought reasoning |

### Totals

56 tools, 3 prompts, and 16 resources.

---

## Internal Gateway Tools

These are provided by the Docker MCP gateway itself for dynamic server management:

| Tool | Purpose |
| --- | --- |
| `mcp-find` | Find MCP servers in the catalog |
| `mcp-add` | Add MCP servers to the registry |
| `mcp-remove` | Remove MCP servers from the registry |
| `mcp-exec` | Execute tools that exist in the current session |
| `mcp-config-set` | Set configuration values for MCP servers |
| `mcp-create-profile` | Create/update profiles with current gateway state |
| `mcp-activate-profile` | Activate saved profiles |
| `code-mode` | Write code that calls other MCPs directly |
| `mcp-discover` | Prompt for learning about dynamic server management |

---

## Server Details

### filesystem (11 tools)

File system operations mounted to the project directory (`C:\Users\Alexa\Desktop\sandbox\Banking`). Runs with `--network none` for security.

**Likely tools:** read, write, edit, list, search, create directory, move, delete, get file info, directory tree, and file metadata operations.

---

### playwright (21 tools)

Full browser automation via Playwright.

**Likely tools:** navigate, click, type, fill form, screenshot, snapshot, evaluate, console messages, network requests, tabs, dialog handling, drag and drop, file upload, hover, select option, press key, resize, wait for, browser close, and code execution.

---

### memory (9 tools)

Persistent knowledge graph stored in `claude-memory` Docker volume.

**Likely tools:** create entities, create relations, add observations, read graph, search nodes, open nodes, delete entities, delete relations, delete observations.

---

### next-devtools-mcp (5 tools, 2 prompts, 16 resources)

Next.js runtime diagnostics and dev server introspection.

**Likely tools:** list tools, call tool, discover servers, get errors, get routes. Provides access to Next.js 16+ MCP endpoint for build diagnostics, route info, and runtime errors.

---

### context7 (2 tools)

Library documentation lookup via Context7 API.

**Likely tools:** resolve-library-id, get-library-docs.

---

### time (2 tools)

Timezone operations.

**Likely tools:** get current time, convert time between timezones.

---

### youtube_transcript (4 tools)

YouTube video transcript retrieval.

**Likely tools:** get transcript, get timed transcript, get video info, get available languages.

---

### fetch (1 tool, 1 prompt)

HTTP URL fetching with markdown extraction.

**Likely tools:** fetch URL (with optional raw HTML mode and length limits).

---

### sequentialthinking (1 tool)

Chain-of-thought reasoning tool for multi-step problem solving.

**Likely tools:** sequential thinking (add thoughts with revision, branching, and dynamic total adjustment).

---

## Docker Configuration

All servers run with security defaults:

- `--security-opt no-new-privileges` — No privilege escalation
- `--cpus 1` — CPU limit per server
- `--memory 2Gb` — Memory limit per server
- `--pull never` — Uses cached images only
- `--init` — Proper signal handling

**Image versions used:**

| Image                    | SHA                |
| ------------------------ | ------------------ |
| `mcp/context7`           | `sha256:1174e6...` |
| `mcp/fetch`              | `sha256:302c62...` |
| `mcp/filesystem`         | `sha256:35fcf0...` |
| `mcp/memory`             | `sha256:db0c2d...` |
| `mcp/next-devtools-mcp`  | `sha256:3064e3...` |
| `mcp/playwright`         | `sha256:64d024...` |
| `mcp/sequentialthinking` | `sha256:cd3174...` |
| `mcp/time`               | `sha256:9c46a9...` |
| `mcp/youtube-transcript` | `sha256:b70b13...` |

---

## Usage

```bash
# Start the adminbot profile
docker mcp gateway run --profile adminbot

# The gateway loads 316 servers from catalog, enables 9, lists 56 tools
# Exits after listing (stdio mode). For interactive use, keep session open.
```

---

## Notes

- OAuth notification monitor failed to connect (expected on local dev without Docker Desktop API pipe)
- Filesystem server mounted with `--network none` for security isolation
- Memory server uses persistent volume `claude-memory` for knowledge graph persistence
- Catalog contains 316 servers total; only 9 enabled by adminbot profile
