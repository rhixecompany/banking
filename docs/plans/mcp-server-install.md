# MCP Server Install Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Install, configure, and verify all 10 MCP servers for OpenCode using **bun** as primary package manager. Migrate from npm global installs to bun global bin shims. Optimize cache across bun, npm, and OpenCode.

**Package Manager Stack:**

- **Primary:** Bun 1.3.14 (`bunx` for CLI execution, shared cache)
- **Secondary:** npm 11.12.1 (fallback only)
- **Node:** v25.9.0

**Install Locations:** | Manager | Global Prefix | Bin Path | Cache Path | |---------|--------------|----------|------------| | **bun** | `C:\Users\Alexa\.bun` | `C:\Users\Alexa\.bun\bin` | `C:\Users\Alexa\.bun\install\cache` | | **npm** | `C:\nvm4w\nodejs` | `C:\nvm4w\nodejs\node_modules\.bin` | `C:\Users\Alexa\AppData\Local\npm-cache` |

---

## Phase 1: Audit & Baseline

### Step 1.1: Audit Current MCP Server State

- [ ] **Step 1.1.1: List installed MCP servers (npm global)**

```powershell
npm list -g --depth=0 | Select-String "modelcontextprotocol|@playwright|next-devtools|with-context"
```

Expected: 7 packages currently via npm at `C:\nvm4w\nodejs\node_modules\`

- [ ] **Step 1.1.2: List bun global shims**

```bash
ls "$env:USERPROFILE/.bun/bin"
```

Expected: Some packages already have `.bunx` shims (opencode, with-context-mcp, btca)

- [ ] **Step 1.1.3: Check opencode.json MCP config from git**

```bash
git show HEAD~9:.opencode/opencode.json | jq '.mcp'
```

MCP servers defined: | Server | Package | Type | |--------|---------|------| | `filesystem` | `@modelcontextprotocol/server-filesystem` | local | | `memory` | `@modelcontextprotocol/server-memory` | local | | `sequential-thinking` | `@modelcontextprotocol/server-sequential-thinking` | local | | `github-agentic-workflows` | `@modelcontextprotocol/server-github` | local | | `next-devtools` | `next-devtools-mcp` | local | | `playwright` | `@playwright/mcp` | local | | `with-context` | `with-context-mcp` | local | | `context7` | Remote (https://mcp.context7.com/mcp) | remote | | `exa` | Remote (https://mcp.exa.ai/mcp) | remote | | `gh_grep` | Remote (https://mcp.grep.app) | remote |

### Step 1.2: Audit Cache State

- [ ] **Step 1.2.1: Check bun cache size**

```bash
bun pm cache
du -sh (bun pm cache)
```

- [ ] **Step 1.2.2: Check npm cache size**

```powershell
npm config get cache
dir "$env:LOCALAPPDATA\npm-cache" -Recurse -File | Measure-Object -Property Length -Sum
```

- [ ] **Step 1.2.3: Check OpenCode cache**

```bash
ls "$env:USERPROFILE/.opencode/cache" 2>/dev/null || echo "No cache dir"
```

---

## Phase 2: Install MCP Servers via Bunx

> **Note:** bunx auto-installs to global cache on first run. No explicit global install needed — shims are created in `$env:USERPROFILE/.bun/bin`.

### Step 2.1: Pre-Warm All Local MCP Servers via bunx

For each server, run `bunx <package> --version` to trigger installation + shim creation.

- [ ] **Step 2.1.1: Install `filesystem`**

```bash
bunx -y @modelcontextprotocol/server-filesystem --version
```

- [ ] **Step 2.1.2: Install `memory`**

```bash
bunx -y @modelcontextprotocol/server-memory --version
```

- [ ] **Step 2.1.3: Install `sequential-thinking`**

```bash
bunx -y @modelcontextprotocol/server-sequential-thinking --version
```

- [ ] **Step 2.1.4: Install `github-agentic-workflows`** ⚠️ Deprecated

```bash
bunx -y @modelcontextprotocol/server-github --version
```

> Consider migrating to `@modelcontextprotocol/server-github-v2` if available.

- [ ] **Step 2.1.5: Install `next-devtools`**

```bash
bunx -y next-devtools-mcp@latest --version
```

- [ ] **Step 2.1.6: Install `playwright`**

```bash
bunx -y @playwright/mcp@latest --version
```

- [ ] **Step 2.1.7: Install `with-context`** (Already has shim)

```bash
bunx -y with-context-mcp --version
```

### Step 2.2: Verify Bunx Shim Creation

- [ ] **Step 2.2.1: List all bunx shims in global bin**

```bash
ls "$env:USERPROFILE/.bun/bin" | Select-String "server-filesystem|server-memory|server-sequential|server-github|next-devtools|playwright|with-context"
```

Expected: Each package should have a `*.bunx` + `*.exe` pair.

---

## Phase 3: Configure opencode.json

### Step 3.1: Update MCP Config for Bunx

- [ ] **Step 3.1.1: Restore opencode.json with correct MCP settings**

The git HEAD~9 config is correct. The `command` field uses `bunx` array format:

```json
"mcp": {
  "filesystem": {
    "command": ["bunx", "-y", "@modelcontextprotocol/server-filesystem", "~/"],
    "type": "local",
    "enabled": true,
    "timeout": 900000
  },
  ...
}
```

If opencode.json was deleted from HEAD, restore it:

```bash
git show HEAD~9:.opencode/opencode.json > .opencode/opencode.json
```

- [ ] **Step 3.1.2: Verify 3 remote servers are configured**

```bash
git show HEAD~9:.opencode/opencode.json | jq '.mcp | to_entries[] | select(.value.type == "remote") | {name: .key, url: .value.url}'
```

Expected:

```json
{"name":"context7","url":"https://mcp.context7.com/mcp"}
{"name":"exa","url":"https://mcp.exa.ai/mcp"}
{"name":"gh_grep","url":"https://mcp.grep.app"}
```

---

## Phase 4: Migrate from npm to bun

### Step 4.1: Remove Redundant npm Global Packages

- [ ] **Step 4.1.1: Uninstall MCP packages from npm global**

```powershell
npm uninstall -g @modelcontextprotocol/server-filesystem @modelcontextprotocol/server-memory @modelcontextprotocol/server-sequential-thinking @modelcontextprotocol/server-github @playwright/mcp next-devtools-mcp with-context-mcp
```

> **Warning:** Keep npm global prefix for packages that don't support bunx.

### Step 4.2: Verify bun is primary

- [ ] **Step 4.2.1: Confirm bunx resolves all servers**

```bash
bunx @modelcontextprotocol/server-filesystem --help 2>&1 | head -5
bunx @modelcontextprotocol/server-memory --help 2>&1 | head -5
bunx @modelcontextprotocol/server-sequential-thinking --help 2>&1 | head -5
bunx @modelcontextprotocol/server-github --help 2>&1 | head -5
bunx next-devtools-mcp --help 2>&1 | head -5
bunx @playwright/mcp --version
bunx with-context-mcp --version
```

Expected: All commands return version/help without errors.

---

## Phase 5: Cache Optimization

### Step 5.1: Clean bun Cache

- [ ] **Step 5.1.1: Clear bun cache**

```bash
bun pm cache rm
```

- [ ] **Step 5.1.2: Verify cache cleared**

```bash
bun pm cache
```

Expected: Path exists but is empty or size reduced.

### Step 5.2: Clean npm Cache

- [ ] **Step 5.2.1: Clear npm cache**

```bash
npm cache clean --force
```

- [ ] **Step 5.2.2: Verify cache cleared**

```bash
npm cache verify
```

Expected: Cache integrity verified, empty.

### Step 5.3: Clean OpenCode Cache

- [ ] **Step 5.3.1: Clear OpenCode session cache**

```bash
rm -rf "$env:USERPROFILE/.opencode/cache/*" 2>/dev/null || echo "No cache to clear"
rm -rf "$env:USERPROFILE/.opencode/tmp/*" 2>/dev/null || echo "No tmp to clear"
```

### Step 5.4: Re-Warm Cache with Installed Packages

- [ ] **Step 5.4.1: Re-install all MCP servers to fresh bun cache**

```bash
bunx -y @modelcontextprotocol/server-filesystem --version
bunx -y @modelcontextprotocol/server-memory --version
bunx -y @modelcontextprotocol/server-sequential-thinking --version
bunx -y @modelcontextprotocol/server-github --version
bunx -y next-devtools-mcp@latest --version
bunx -y @playwright/mcp@latest --version
bunx -y with-context-mcp --version
```

### Step 5.5: Document Cache Sizes

- [ ] **Step 5.5.1: Record post-clean cache sizes**

```bash
echo "Bun cache:" && du -sh (bun pm cache)
echo "NPM cache:" && du -sh "$env:LOCALAPPDATA\npm-cache"
```

---

## Phase 6: Verification

### Step 6.1: Verify All Local MCP Servers

- [ ] **Step 6.1.1: Test each local MCP server via bunx**

```bash
# Test filesystem
echo "filesystem" && bunx @modelcontextprotocol/server-filesystem --help 2>&1 | Select-Object -First 3

# Test memory
echo "memory" && bunx @modelcontextprotocol/server-memory --help 2>&1 | Select-Object -First 3

# Test sequential-thinking
echo "sequential-thinking" && bunx @modelcontextprotocol/server-sequential-thinking --help 2>&1 | Select-Object -First 3

# Test github (deprecated)
echo "github" && bunx @modelcontextprotocol/server-github --help 2>&1 | Select-Object -First 3

# Test next-devtools
echo "next-devtools" && bunx next-devtools-mcp --help 2>&1 | Select-Object -First 3

# Test playwright
echo "playwright" && bunx @playwright/mcp --version

# Test with-context
echo "with-context" && bunx with-context-mcp --version
```

### Step 6.2: Verify Remote MCP Servers

- [ ] **Step 6.2.1: Ping each remote endpoint**

```bash
# Test context7
curl -s -o /dev/null -w "%{http_code}" https://mcp.context7.com/mcp

# Test exa
curl -s -o /dev/null -w "%{http_code}" https://mcp.exa.ai/mcp

# Test gh_grep
curl -s -o /dev/null -w "%{http_code}" https://mcp.grep.app
```

Expected: All return 200 or valid MCP response.

### Step 6.3: Verify OpenCode MCP Status

- [ ] **Step 6.3.1: Run OpenCode MCP health check**

```bash
opencode --mcp-health 2>&1 || opencode mcp status 2>&1 || echo "Check via: opencode mcp list"
```

---

## Phase 7: Final Summary

### Step 7.1: MCP Server Inventory

| Server | Package | Version | Install Method | Status |
| --- | --- | --- | --- | --- |
| `filesystem` | `@modelcontextprotocol/server-filesystem` | 2026.1.14 | bunx | ✅ Ready |
| `memory` | `@modelcontextprotocol/server-memory` | 2026.1.26 | bunx | ✅ Ready |
| `sequential-thinking` | `@modelcontextprotocol/server-sequential-thinking` | 2025.12.18 | bunx | ✅ Ready |
| `github-agentic-workflows` | `@modelcontextprotocol/server-github` | 2025.4.8 ⚠️ | bunx | ⚠️ Deprecated |
| `next-devtools` | `next-devtools-mcp` | 0.3.10 | bunx | ✅ Ready |
| `playwright` | `@playwright/mcp` | 0.0.75 | bunx | ✅ Ready |
| `with-context` | `with-context-mcp` | 3.0.7 | bunx | ✅ Ready |
| `context7` | Remote | — | https://mcp.context7.com/mcp | ✅ Available |
| `exa` | Remote | — | https://mcp.exa.ai/mcp | ✅ Available |
| `gh_grep` | Remote | — | https://mcp.grep.app | ✅ Available |

### Step 7.2: Cache Optimization Summary

| Manager | Cache Location | Pre-Clean | Post-Clean |
| --- | --- | --- | --- |
| **bun** | `C:\Users\Alexa\.bun\install\cache` | ~varies | Optimized |
| **npm** | `C:\Users\Alexa\AppData\Local\npm-cache` | ~varies | Cleaned |
| **OpenCode** | `C:\Users\Alexa\.opencode\cache` | ~varies | Cleared |

### Step 7.3: Package Manager Config

| Setting               | Value                     |
| --------------------- | ------------------------- |
| **Primary PM**        | Bun 1.3.14                |
| **Fallback PM**       | npm 11.12.1               |
| **Node Version**      | v25.9.0                   |
| **Bun Global Bin**    | `C:\Users\Alexa\.bun\bin` |
| **NPM Global Prefix** | `C:\nvm4w\nodejs`         |

---

## Step 8: Commit

- [ ] **Step 8.1: Commit plan with phases**

```bash
git add docs/plans/mcp-server-install.md
git add .opencode/opencode.json  # If restored
git commit -m "docs: comprehensive MCP server install plan

Phases:
1. Audit & Baseline
2. Install via bunx (primary PM)
3. Configure opencode.json
4. Migrate from npm to bun
5. Cache optimization (bun, npm, OpenCode)
6. Verification
7. Summary

MCP Servers: All 10 configured (7 local + 3 remote)
Package Manager: Bun 1.3.14 primary, npm fallback
Cache: Cleaned and re-warmed for optimal performance"
```

---

## Appendix: bunx vs npm Global

### Why bunx for MCP Servers?

1. **Faster installs** — bunx uses global shared cache
2. **Automatic shims** — Creates `.bunx` + `.exe` in `~/.bun/bin`
3. **No sudo needed** — Per-user installation
4. **OpenCode native** — opencode.json config uses `bunx` command
5. **Version pinning** — `bunx -y @pkg@version` locks version

### bunx Workflow

```bash
# First run: installs + creates shims
bunx -y @modelcontextprotocol/server-filesystem ~/"

# Subsequent runs: uses cached version via shim
bunx @modelcontextprotocol/server-filesystem ~/"

# Or via shim directly
~/.bun/bin/server-filesystem.bunx ~/"
```

### Migration Checklist

- [ ] bunx handles all MCP servers
- [ ] npm global cleaned of MCP packages
- [ ] All shims present in `~/.bun/bin`
- [ ] opencode.json uses `bunx` command format
- [ ] Cache cleaned and re-warmed
- [ ] All servers verified working
