# Spec: bun-migration-spec

Scope: feature

# Bun Migration Specification

## Overview
Migrate all npm/npx commands to bun/bunx across the codebase, validate, and fix issues iteratively until passing.

## Scope
- Shell scripts (.sh, .ps1, .bat)
- Documentation files (.md)
- package.json scripts

## Changes Required

### npx tsx → bunx tsx
- Replace in all shell scripts and documentation
- Verify zero occurrences after replacement

### npm run → bun run
- Replace in all shell scripts and documentation
- Update package.json scripts section
- Verify zero occurrences in relevant files after replacement

## Validation Steps
1. Run bun run validate
2. Save output to validate-report.txt
3. Read report and identify errors
4. Fix issues iteratively
5. Re-run validate until passing

## Success Criteria
- Zero npx tsx occurrences in codebase
- Zero npm run occurrences in scripts/docs
- bun run validate passes with no errors