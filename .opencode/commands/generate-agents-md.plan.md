---
status: complete
phase: 1
updated: 2026-04-24
---

# Generate AGENTS.md and Supporting Root Docs

## Description

Generate repository-accurate AGENTS.md and supporting root documentation (architecture.md, tech-stack.md, coding-standards.md, folder-structure.md, exemplars.md) based on evidence from existing codebase files. Ensure every rule/pattern is directly supported with provenance.

## Personas

- **Implementer** — writes documentation based on code evidence
- **Reviewer** — verifies all rules have file provenance
- **Maintainer** — approves documentation changes

## Actionable Steps

1.1 Read key evidence files:

- Read package.json, tsconfig.json, next.config.ts
- Read lib/env.ts, app-config.ts
- Read actions/register.ts, dal/transaction.dal.ts
- Read scripts/verify-rules.ts
- Read tests/e2e/helpers/plaid.mock.ts, lib/plaid.ts

  1.2 Update AGENTS.md:

- Update version detection from package.json
- Add environment rules with app-config.ts provenance
- Add Server Actions pattern with actions/register.ts evidence
- Add DAL patterns with dal/transaction.dal.ts evidence
- Add testing patterns with plaid.mock.ts evidence
- Add verification tooling provenance

  1.3 Update architecture.md:

- Document Next.js 16 features from next.config.ts
- Document Drizzle ORM usage from dal/ files
- Document process boundaries

  1.4 Update tech-stack.md:

- Sync all versions from package.json
- Include version compatibility matrix

  1.5 Update coding-standards.md:

- Document TypeScript strict mode (tsconfig.json)
- Document environment access (app-config.ts)
- Document Server Actions pattern
- Document DAL patterns
- Document testing approach

  1.6 Update folder-structure.md:

- Document top-level directories
- Document app router structure
- Document components structure
- Document dal/ and actions/ structure

  1.7 Update exemplars.md:

- Add Server Action example (actions/register.ts)
- Add DAL batching example (dal/transaction.dal.ts)
- Add env access example
- Add test shortcuts example
- Add validation tooling example

  1.8 Create plan file (this file)

  1.9 Run validation:

- npm run format
- npm run type-check
- npm run verify:rules

## Verification Checklist

- [x] All documentation files updated
- [x] All rules have file provenance
- [x] Version numbers match package.json
- [x] No introduced code violations
- [x] npm run format passes
- [x] npm run type-check passes
- [x] npm run verify:rules passes (or only docs violations)

## Deliverables

- AGENTS.md (updated)
- architecture.md (updated)
- tech-stack.md (updated)
- coding-standards.md (updated)
- folder-structure.md (updated)
- exemplars.md (updated)
- .opencode/commands/generate-agents-md.plan.md (this plan)

## Status History

- 2026-04-24: Created plan and implemented all documentation updates
