# Plan: lint-e2e-fix

## Overview

Fix lint OOM, markdown processor conflicts, conditional expect errors, and E2E validation issues to get full `bun run validate` chain passing cleanly.

## Files to Modify

1. `package.json` - Add NODE_OPTIONS to prevent OOM
2. `eslint.config.mts` - Remove markdown processor blocks (lines 882-961)
3. `tests/unit/dal/transaction.dal.test.ts` - Fix conditional expect errors (lines 97-103, 165-170)
4. `tests/unit/components/settings-content.test.tsx` - Fix prefer-const (line 257)

## Phases

### Phase 1: Fix OOM Issues

- Add `NODE_OPTIONS=--max-old-space-size=4096` to lint, lint:strict, lint:fix, lint:fix:all, type-check scripts in package.json

### Phase 2: Fix ESLint Markdown Conflict

- Remove markdown processor block (lines 883-890) and virtual-file rules block (lines 891-961) from eslint.config.mts

### Phase 3: Fix Test Errors

- Fix conditional expect in transaction.dal.test.ts (lines 97-103, 165-170)
- Fix prefer-const in settings-content.test.tsx (line 257)

### Phase 4: Validation

- Run `bun run lint`
- Run `bun run type-check`
- Run `bun run verify:rules`
- Run `bun run test:browser`
- Free port 3000
- Run `bun run test:ui`
- Run `bun run validate`

## Status: To Be Implemented
