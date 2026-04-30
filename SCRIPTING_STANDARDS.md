---
description: Script orchestration patterns and standards for the Banking app
applyTo: "scripts/**/*.ts"
priority: high
canonicalSource: AGENTS.md
lastReviewed: 2026-04-30
---

# Script Orchestration Standards

## Overview

All shell scripts (`.sh`, `.ps1`, `.bat`) in `scripts/` MUST be orchestrators that call TypeScript implementations. All logic lives in `scripts/ts/`.

## Orchestrator Pattern

### Definition

An orchestrator is a shell script that:

- Only contains shebang, comments, and parameter parsing
- Delegates to a TypeScript implementation via `bunx tsx`, `npx tsx`, or `node`
- Contains NO embedded business logic

### ✅ Correct (Orchestrator)

```bash
#!/usr/bin/env bash
# Deployment orchestrator - calls TypeScript implementation
set -e
cd "$(dirname "$0")/.."
bunx tsx scripts/ts/deploy/deploy.ts "$@"
```

```powershell
# Deployment orchestrator - calls TypeScript implementation
param(
    [switch]$DryRun,
    [Parameter(ValueFromRemainingArguments = $true)]$RemainingArgs
)
$ProjectRoot = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
Set-Location $ProjectRoot
bunx tsx scripts/ts/deploy/deploy-windows.ts @RemainingArgs
```

### ❌ Incorrect (Embedded Logic)

```bash
#!/usr/bin/env bash
# WRONG: Contains logic that should be in TypeScript
for file in src/**/*.ts; do
    tsc --noEmit "$file" || exit 1
done
```

## Conversion Rules

### Phase 1: Identify

Categorize each script:

- **Orchestrator (OK)**: Only calls TS/CLI
- **Has embedded logic**: Contains code that should be TS
- **Missing TS**: Shell exists but no TS version
- **Duplicate**: Same script in both `.sh` and `.ps1`

### Phase 2: Convert

1. Create `scripts/ts/<category>/<script>.ts`
2. Move logic to TypeScript
3. Rewrite shell as orchestrator calling TS

### Phase 3: Update package.json

```json
// Before
"deploy:run": "bash scripts/deploy/deploy.sh"

// After
"deploy:run": "bunx tsx scripts/ts/deploy/deploy.ts"
```

## Cross-Platform Guidelines

| Platform | Tool | Command                              |
| -------- | ---- | ------------------------------------ |
| Unix     | bun  | `bunx tsx scripts/ts/...`            |
| Windows  | bun  | `bunx tsx scripts/ts/...-windows.ts` |
| Both     | node | `node scripts/ts/...`                |

### File Naming

- Unix TS: `scripts/ts/deploy/deploy.ts`
- Windows TS: `scripts/ts/deploy/deploy-windows.ts`
- Shell: `scripts/deploy/deploy.sh` + `scripts/deploy/deploy.ps1`

## Exceptions

Scripts that CAN contain embedded shell logic:

- `fix-line-endings.sh` - uses `sed`/`find` (unavailable in cross-platform TS)
- `diagnose-and-fix-git.sh` - git porcelain commands
- `server/vps-setup.sh` - system-level installation

## Verification

```bash
# Verify all scripts are orchestrators
find scripts -name "*.sh" -o -name "*.ps1" | xargs grep -l "bunx tsx\|npx tsx"

# Check package.json references
grep "tsx scripts/ts" package.json
```

## Evidence

- `scripts/ts/` - TypeScript implementations
- `package.json` scripts block - TS references
- `scripts/codemap.md` - documentation
