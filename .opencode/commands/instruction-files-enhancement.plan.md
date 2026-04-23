---
status: in-progress
phase: 5
updated: 2026-04-23
---

# Instruction Files Enhancement & DRY Consolidation

## Goal

Consolidate, DRY-ify, and standardize the 40+ instruction/reference files in the repo's opencode.json instructions array, eliminating redundancy, standardizing frontmatter metadata (lastReviewed dates), and clarifying canonical sources — without changing production code.

## Context & Decisions

| Decision | Rationale | Source |
| -------- | --------- | ------ |
| AGENTS.md is canonical source-of-truth for agent rules | Already designated as the master instruction set | `ref:canonical-agent-rules.plan.md` |
| Consolidate plan workflow into 1 file (plan-workflow.md) | 08 + 09 + 09-plan split causes confusion and drift | `ref:init-enhanced.md audit findings` |
| Merge 06-commands-ref.md into 00-default-rules.md | Commands reference duplicates 00-default-rules.md content | `ref:init-enhanced.md audit findings` |
| Preserve morph-tools.md (unique tool-routing policy) | Tool-specific routing is unique; no duplication elsewhere | `ref:init-enhanced.md audit findings` |
| All instruction files update lastReviewed to 2026-04-23 | Standardize metadata; many files had stale 2026-04-14 dates | `ref:init-enhanced.md audit findings` |

## Phase 1: Audit & Triage [COMPLETE]

- [x] 1.1 Enumerate all files in opencode.json instructions array
- [x] 1.2 Read and audit every instruction file for overlaps, gaps, and stale metadata
- [x] 1.3 Identify consolidation targets (plan workflow, commands ref, orphaned files)
- [x] 1.4 Write audit findings to .opencode/commands/init-enhanced.md

## Phase 2: Consolidation & Standardization [COMPLETE]

- [x] 2.1 Create .opencode/instructions/plan-workflow.md - MERGED from 08, 09, 09-plan
- [x] 2.2 Merge .opencode/instructions/06-commands-ref.md into 00-default-rules.md - DEPRECATED with redirect
- [x] 2.3 Update all .opencode/instructions/*.md files with lastReviewed: 2026-04-23
- [x] 2.4 Add "Canonical source: AGENTS.md" header to instruction files

## Phase 3: Cursor & GitHub Instructions DRY [COMPLETE]

- [x] 3.1 Reviewed and updated 11 .cursor/rules/*.mdc files with canonical source header
- [x] 3.2 Updated all cursor rules with AGENTS.md as canonical source
- [x] 3.3 Reviewed and updated 8 .github/instructions/*.md files
- [x] 3.4 Added canonical source headers to github instructions

## Phase 4: Orphan Handling [COMPLETE]

- [x] 4.1 Deprecated agents_quickstart.md - redirects to AGENTS.md
- [x] 4.2 Verified morph-tools.md is unique tool-routing policy
- [x] 4.3 Updated .opencode/tools/philosophy.md with consistent frontmatter

## Phase 5: Verification [IN PROGRESS]

- [ ] 5.1 Verify all instruction files are readable and frontmatter is valid
- [ ] 5.2 Check for circular or broken references between instruction files
- [ ] 5.3 Run any available markdown lint/format checks
- [ ] 5.4 Produce final artifact listing changes made

## Notes

- 2026-04-23: Plan created based on full audit of 40+ instruction/reference files
- This is documentation-only — no production code changes
- Keep original files with deprecation notices until verification passes
- Related plans: canonical-agent-rules.plan.md (related rewrite), update-agentic-docs.plan.md (related consolidation)