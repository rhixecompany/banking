---
plan name: bun-migration-validate
plan description: Migrate npm to bun with validation
plan status: done
---

## Idea

Comprehensive migration from npm/npx to bun/bunx with validation and iterative fixes until passing

## Implementation

- Audit codebase for npx tsx occurrences and document in memory
- Audit codebase for npm run occurrences and document in memory
- Replace all npx tsx with bunx tsx in .sh scripts
- Replace all npx tsx with bunx tsx in .ps1 scripts
- Replace all npx tsx with bunx tsx in .bat scripts
- Replace all npx tsx with bunx tsx in .md documentation files
- Replace all npm run with bun run in .sh scripts
- Replace all npm run with bun run in .ps1 scripts
- Replace all npm run with bun run in .bat scripts
- Replace all npm run with bun run in .md documentation files
- Replace all npm run with bun run in package.json scripts
- Verify no npx tsx remains in codebase (grep)
- Verify no npm run remains in relevant files (grep)
- Run bun run validate and save output to validate-report.txt
- Read validate-report.txt and identify all errors/warnings
- Fix identified issues (type errors, lint errors, etc.)
- Re-run bun run validate and check for remaining issues
- Iterate: repeat fix and validate until no errors remain
- Commit changes with proper commit message

## Required Specs

<!-- SPECS_START -->

- skills-catalog
- bun-migration-spec
<!-- SPECS_END -->
