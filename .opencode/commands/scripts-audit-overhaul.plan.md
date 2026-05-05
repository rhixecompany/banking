# Plan: Scripts Audit & Overhaul

## Overview

Catalog and enhance all TypeScript scripts in `./scripts/**`. Remove dead code, fix npm→bun references, add dry-run support to DB scripts, eliminate shell/bat/ps1 entries from `package.json`, and overhaul the Makefile as the primary project CLI.

## Files Changed

1. `scripts/ts/opencode-plugin-repair.ts.backup` — deleted (dead code)
2. `scripts/ts/opencode-plugin-verify.ts.backup` — deleted (dead code)
3. `scripts/run-verify-and-validate.ts` — deleted (duplicate of scripts/ts/ version)
4. `scripts/ts/run-verify-and-validate.ts` — fixed: npm → bun
5. `scripts/provenance/generate-provenance.ts` — fixed: ts-node → node shebang
6. `scripts/seed/run.ts` — fixed: any cast removed
7. `scripts/db/apply-migrations.ts` — enhanced: dry-run support
8. `scripts/db/apply-select-migrations.ts` — enhanced: dry-run + --files flag
9. `scripts/transform/zod-meta-to-describe.ts` — fixed: any cast, raw fs → fs/promises async
10. `scripts/ts/verify-agents.ts` — rewritten: pure TS, removes shell script dependency
11. `scripts/ts/run-ci-checks.ts` — fixed: wrong script key names
12. `scripts/codemod/run-codemod.ts` — fixed: shebang
13. `package.json` — cleaned: shell/bat/ps1 script entries removed
14. `Makefile` — overhauled: full project lifecycle targets added

## Phases

1. Delete dead/duplicate files
2. Fix code quality issues (any casts, shebangs, npm references)
3. Add dry-run support to DB scripts
4. Remove shell script entries from package.json
5. Overhaul Makefile
6. Run pre-PR validation
