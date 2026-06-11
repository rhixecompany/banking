# Spec: audit-findings

Scope: repo

# Audit Findings Spec

## Rules Files Audited

| # | File | Issues Found |
| --- | --- | --- |
| 1 | task-implementation.md | TYPO: `,opencode/` (line 14) |
| 2 | memory-bank.md | TYPO: `,opencode/` (line 7) |
| 3 | playwright-typescript.md | Wrong test cmd: `npx playwright` (line 44) |
| 4 | testing.md | OK - correct |
| 5 | commit-messages.md | Conflicts AGENTS.md (co-author) |
| 6 | code-review.md | OK |
| 7 | documentation.md | OK |
| 8 | github-session-limits.md | Missing frontmatter |
| 9 | nextjs-tailwind.md | OK |
| 10 | performance.md | OK |
| 11 | security.md | OK |
| 12 | tasksync.md | May conflict default behavior |
| 13 | typescript.md | OK |
| 14 | update-docs-on-code-change.md | OK |

## Critical Fixes Required

### Fix 1: task-implementation.md

- Line 14: `,opencode/plans/**` -> `.opencode/plans/**`
- Line 16: `,opencode/commands/**` -> `.opencode/commands/**`

### Fix 2: memory-bank.md

- Line 7: `,opencode/memory-bank/` -> `.opencode/memory-bank/`

### Fix 3: playwright-typescript.md

- Line 44: `npx playwright test --project=chromium` -> `bun run test:ui`

## AGENTS.md Conflicts

- commit-messages.md says NO co-author
- AGENTS.md mentions Co-authored-by: Claude
- Resolution: rules file takes precedence

## Missing from Rules (in AGENTS.md)

- `bun` not `npm` usage rule
- ENCRYPTION_KEY requirement
- predev clean artifact wipe
- Mock tokens for testing
- verify:rules in pre-PR checklist
