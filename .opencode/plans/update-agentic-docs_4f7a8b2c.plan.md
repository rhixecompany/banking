# Update Agentic Documentation

## Goals

- Standardize and augment agentic documentation across the repository.
- Ensure AGENTS.md, .opencode/instructions/\*.md, and README.md are consistent and point to authoritative sources.
- Create a permanent plan record for the update.

## Scope

- Update AGENTS.md (version bump + clarifications)
- Update .opencode/instructions/\* for consistency and missing clarifications
- Update README.md agentic contributor notes section
- Create this plan file under .opencode/plans/

## Target Files

- AGENTS.md
- README.md (agentic sections)
- .opencode/instructions/\*.md (all files in that folder)
- .opencode/plans/update-agentic-docs_4f7a8b2c.plan.md (this file)

## Risks

- Minor wording changes could be contested by contributors. Mitigation: Keep edits conservative and preserve original examples.
- Lint or formatting scripts may change files (format). Mitigation: run Quick Validate and adjust.

## Planned Changes

- Bump AGENTS.md version and add Quick Validate checklist.
- Standardize front-matter and add missing clarifications in instruction files.
- Update README.md agentic contributor notes to reference AGENTS.md and plan rules.

## Validation

- Run these locally:
  - `npm run format`
  - `npm run type-check`
  - `npm run lint:strict`

## Rollback or Mitigation

- Use git to revert the commit(s) if needed. Changes are documentation-only; rollbacks are safe.
