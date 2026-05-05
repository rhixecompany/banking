---
plan name: fix-execfile-regression
plan description: Revert exec() shell injection risks
plan status: active
---

## Idea

Fix exec() injection bug reintroduced in 8dc554c2 by reverting runCommand() to safe execFile() pattern while retaining async/memory improvements from that commit. Commit a60da5e2 had correct execFile() implementation; 8dc554c2 replaced it with vulnerable exec() + shell string building.

## Implementation

- Read opencode-plugin-verify.ts (L119-135) to understand current broken exec() pattern
- Revert runCommand() to use execFile() with args array directly (no shell string building), preserve async + env override functionality
- Update checkDiskSpace() to properly quote REPO_ROOT on Windows (use backticks in PowerShell or escape for shell)
- Add bounds checking in loadProjectConfigs() to handle missing/invalid config paths gracefully
- Run type-check and lint:strict to verify no TypeScript or style regressions
- Execute scripts/ts/opencode-plugin-verify.ts manually with special char args to verify execFile safety
- Create git commit with security fix + test verification
- Verify all 8 verification steps still work end-to-end in CI context

## Required Specs

<!-- SPECS_START -->
<!-- SPECS_END -->
