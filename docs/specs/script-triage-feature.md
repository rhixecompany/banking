# Spec: script-triage-feature

Scope: feature

# Script Triage and Orchestrator Conversion - FEATURE Spec

## Overview

Convert all shell scripts (`.sh`, `.ps1`, `.bat`) in `scripts/` directory to orchestrator pattern - shell scripts only call TypeScript or CLI tools, all logic moved to TypeScript, duplicates cleaned up.

## Acceptance Criteria

### Phase 1: Survey and Categorization (Complete before conversion)

- [ ] All `.sh`, `.ps1`, `.bat` files in `scripts/` directory identified and cataloged
- [ ] Each script categorized as:
  - **Orchestrator (OK)**: Only calls `tsx`, `bunx`, `node`, `npm`, `yarn`, or `bun` - no embedded logic
  - **Has embedded logic**: Contains actual code that should be in TypeScript
  - **Missing TS version**: Shell script exists but no corresponding TypeScript version
  - **Duplicate**: Same functionality exists in both `.sh` and `.ps1`/`.bat` with one being redundant
- [ ] Score by issue count: embedded logic (high) > missing TS (medium) > duplicate (low)

### Phase 2: Conversion

- [ ] Scripts with embedded logic converted: create new `.ts` file, move logic, shell becomes orchestrator
- [ ] Scripts missing TS version: create new `.ts` file that either wraps shell or re-implements logic
- [ ] Duplicate cleanup: keep both `.sh` and `.ps1`/`.bat` for cross-platform only if both are orchestrators

### Phase 3: Package.json Updates

- [ ] All `package.json` scripts that call shell (e.g., `bash scripts/foo.sh`) changed to call TS directly (e.g., `bunx tsx scripts/ts/foo.ts`)
- [ ] No regressions - all existing npm scripts still work after changes

### Phase 4: Documentation Updates

- [ ] AGENTS.md updated: document orchestrator pattern requirement for scripts/
- [ ] New `SCRIPTING_STANDARDS.md` created in project root with:
  - Definition of orchestrator pattern
  - Conversion rules and examples
  - Cross-platform handling guidelines
- [ ] codemap.md updated: add scripts/ section documenting orchestrator pattern

### Phase 5: Verification

- [ ] All converted scripts tested and working
- [ ] No regressions in npm scripts
- [ ] All shell scripts in scripts/ are now orchestrators only

## Test Scenarios

### Orchestrator Pattern Test
- Verify each `.sh`, `.ps1`, `.bat` in scripts/ only contains:
  - `#!/usr/bin/env` or shebang
  - Comments and documentation
  - Calls to `bunx tsx`, `npx tsx`, `npm run`, `yarn`, or `node`
  - NO: embedded logic, complex conditionals, direct file operations

### Cross-Platform Test
- Verify both `.sh` and `.ps1`/`.bat` versions of same script exist
- Verify both are orchestrators (call same TS or CLI)

### Package.json Test
- Run `npm run` to see all available scripts - all should work
- Verify no scripts reference deleted shell wrappers

### Documentation Test
- Check AGENTS.md mentions orchestrator pattern for scripts/
- Check SCRIPTING_STANDARDS.md exists and documents the pattern
- Check codemap.md includes scripts/ section

## File Conversion Mapping (Prioritized by Issue Count)

### High Priority (Embedded Logic - Needs Conversion)

| Shell Script | Issue | Action |
|--------------|-------|--------|
| scripts/utils/check-events.ps1 | Embedded PowerShell logic | Convert to TS, create orchestrator |
| scripts/utils/check-events.sh | Embedded bash logic | Convert to TS, create orchestrator |
| scripts/utils/check-events-detail.ps1 | Embedded PowerShell logic | Convert to TS, create orchestrator |
| scripts/utils/check-events-detail.sh | Embedded bash logic | Convert to TS, create orchestrator |
| scripts/cleanup/cleanup-docker.ps1 | Embedded Docker logic | Convert to TS, create orchestrator |
| scripts/cleanup/cleanup-docker.sh | Embedded Docker logic | Convert to TS, create orchestrator |
| scripts/deploy/deploy.ps1 | Embedded deploy logic | Convert to TS, create orchestrator |
| scripts/deploy/deploy.sh | Embedded deploy logic | Convert to TS, create orchestrator |

### Medium Priority (Missing TS Version - Needs Creation)

| Shell Script | Missing | Action |
|--------------|---------|--------|
| scripts/opencode-plugin-verify.sh | No TS version | Create TS wrapper |
| scripts/opencode-plugin-repair.sh | No TS version | Create TS wrapper |
| scripts/diagnose-and-fix-git.sh | No TS version | Create TS wrapper |
| scripts/diagnose-and-fix-git.ps1 | No TS version | Create TS wrapper |
| scripts/delete-gone-branches.sh | No TS version | Create TS wrapper |
| scripts/branch-compare.sh | No TS version | Create TS wrapper |

### Low Priority (Already Orchestrators - Verify OK)

| Shell Script | Status | Notes |
|--------------|--------|-------|
| scripts/utils/disable-extensions.sh | OK | Already orchestrator calling tsx |
| scripts/utils/fix-line-endings.sh | OK | Already orchestrator |
| scripts/utils/fix-line-endings.ps1 | OK | Already orchestrator |
| scripts/utils/build.sh | OK | Already orchestrator calling npm |
| scripts/verify-agents.sh | OK | Already orchestrator calling npm |
| scripts/orchestrator.sh | OK | Entry point, calls other scripts |
| scripts/opencode-mcp.sh | OK | Already orchestrator calling tsx |
| scripts/docker/entrypoint.sh | OK | Docker entry, minimal logic |
| scripts/docker/generate-env.sh | OK | Already has TS version |
| scripts/server/server-setup.sh | OK | Has TS version |
| scripts/server/vps-setup.sh | OK | Has TS version |

### Package.json Updates Required

| Old Script Reference | New TS Reference |
|---------------------|------------------|
| bash scripts/utils/fix-line-endings.sh | bunx tsx scripts/ts/utils/fix-line-endings.ts |
| bash scripts/server/gen-certs.sh | bunx tsx scripts/ts/server/gen-certs.ts |
| bash scripts/server/server-setup.sh | bunx tsx scripts/ts/server/server-setup.ts |
| bash scripts/deploy/deploy.sh | bunx tsx scripts/ts/deploy/deploy.ts |
| powershell scripts/deploy/deploy.ps1 | bunx tsx scripts/ts/deploy/deploy.ts |
| bash scripts/opencode-plugin-verify.sh | bunx tsx scripts/ts/opencode-plugin-verify.ts (create) |

## Scope Exclusions

- `.github/hooks/` - not in scope
- `.husky/` - not in scope
- Test infrastructure (Playwright/Vitest configs) - included per user request

## Success Metrics

- 0 shell scripts with embedded logic in scripts/
- 100% of shell scripts are orchestrators (call TS or CLI only)
- All package.json scripts use TS versions
- AGENTS.md documents orchestrator pattern
- SCRIPTING_STANDARDS.md created and complete
- codemap.md updated with scripts/ documentation