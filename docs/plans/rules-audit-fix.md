---
plan name: rules-audit-fix
plan description: Complete rules audit and fixes
plan status: done
---

## Idea

Audit all 14 rules files and AGENTS.md for inconsistencies, wrong rules, and issues. Fix critical errors like typoes, verify conflicts, create new rules for planning/building/debugging scenarios, and test by attempting wrong behaviors.

## Implementation

- Read and audit all 14 rules files for inconsistencies and wrong rules
- Cross-reference AGENTS.md with rules files for conflicts
- Fix critical typo: ,opencode/ -> .opencode/ in task-implementation.md (line 14)
- Fix critical typo: ,opencode/ -> .opencode/ in memory-bank.md (line 7)
- Fix test command: npx playwright -> bun run test:ui in playwright-typescript.md (line 44)
- Verify commit-messages.md vs AGENTS.md conflict on co-author attribution
- Audit tasksync.md vs default agent behavior conflict
- Create planning rule: when to enter plan mode, when to ask questions
- Create building rule: implementation workflow and verify steps
- Create debugging rule: systematic debugging approach and tools
- Verify fixes by attempting wrong commands (npx, npm, etc.)
- Document final findings and recommendations

## Required Specs

<!-- SPECS_START -->

- audit-findings
- new-rules
<!-- SPECS_END -->
