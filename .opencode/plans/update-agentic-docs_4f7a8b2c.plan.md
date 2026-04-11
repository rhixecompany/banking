---
# Update Agentic Documentation And Skills

Version: 1.0
Created: 2026-04-11

## Goals
- Consolidate and standardize agent-facing documentation across the repository so agents and humans have a single, consistent source of truth about agent rules, skills, and workflows.
- Perform an opinionated rewrite of agentic docs (AGENTS.md, .cursorrules, .cursor/rules/*.mdc, .github/copilot-instructions.md, all .opencode/skills/**/SKILL.md, .opencode/instructions/*.md, and selected .github/instructions/*.md).

## Scope
- Read-only discovery already completed.
- Implementation will change documentation files only (markdown and skill docs). No runtime code changes.

## Batches
1. Core canonical sources: AGENTS.md, .cursorrules, .github/copilot-instructions.md
2. TaskSync rewrite: .opencode/instructions/00-task-sync-note.md (safe rewrite)
3. Cursor rules normalization: .cursor/rules/*.mdc
4. SKILL.md standardization: .opencode/skills/**/SKILL.md
5. README sync and selected .github/instructions/*.md

## Validation
- Run: `npm run format`, `npm run type-check`, `npm run lint:strict` after applying patches locally.

## Rollout
- Prepare patches here for review. Do not push until user approval.

## Risks
- Large edits may generate lint/type-check failures. Mitigation: run checks per-batch and keep commits small.

## Plan file location
This file documents the Phase 2 plan and is saved to `.opencode/plans/update-agentic-docs_4f7a8b2c.plan.md`.

---
