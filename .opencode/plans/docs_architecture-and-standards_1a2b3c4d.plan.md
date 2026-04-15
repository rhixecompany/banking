---
title: Add documentation: architecture, tech-stack, coding-standards, folder-structure, exemplars
author: adminbot
reviewers: []
created: 2026-04-14
---

Goal

- Add five repository-level documentation files to help contributors follow architecture and coding conventions.

Files to add

- architecture.md (repo root)
- tech-stack.md (repo root)
- coding-standards.md (repo root)
- folder-structure.md (repo root)
- exemplars.md (repo root)

Steps

1. Create the five markdown files at repository root.
2. Add a plan file under `.opencode/plans/` describing the change (this file).
3. Run `npm run format` to ensure formatting consistency for markdown files.
4. Run `npm run type-check` to ensure no inadvertent type issues (docs-only change — should be fine).

Validation

- Check files exist in the repo root and the plan exists under `.opencode/plans/`.

Notes

- Non-code docs only — no production code changes.
- Branch: `docs/architecture-and-standards` (if pushing to remote).
