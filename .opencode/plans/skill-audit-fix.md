---
plan name: skill-audit-fix
plan description: Skill audit fix implementation
plan status: active
---

## Idea

Systematically review and fix all .opencode/skills/\*.md files for inconsistencies with repo conventions (AGENTS.md, app structure, naming), then enhance each skill for clarity and completeness.

## Implementation

- 1. List all .opencode/skills/\*_/_.md files (SKILL.md, README.md)
- 2. Categorize skills: core (validation, db, server-action), meta (suggest, simplify), hooks (session-logger)
- 3. For each skill, check: naming, frontmatter, applyTo patterns, lastReviewed dates
- 4. Identify issues: outdated refs (bankDal → walletDal), missing frontmatter, empty files
- 5. Fix critical issue: plaid-skill uses bankDal but repo uses wallets table
- 6. Fix major issues: add missing lastReviewed and applyTo to simplify, code-philosophy, code-review, auth-skill, dal-skill
- 7. Fix minor issues: update paths, add AGENTS.md references where needed
- 8. Run npm run lint:strict, npm run type-check, npm run verify:rules
- 9. Manual verify samples of each skill's usage in codebase

## Required Specs

<!-- SPECS_START -->
<!-- SPECS_END -->
