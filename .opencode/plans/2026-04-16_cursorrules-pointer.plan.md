---
name: cursorrules-pointer
overview: Convert .cursorrules to a thin pointer referencing AGENTS.md and .opencode/plans/ standards.
todos:
  - id: create-pointer
    content: "Replace detailed content in .cursorrules with a short pointer to AGENTS.md and note the canonical plan location (.opencode/plans/)."
    status: completed
  - id: run-validations
    content: "Run markdown lint and type-check after change."
    status: completed
isProject: false
---

This plan records the change made to `.cursorrules` to point to `AGENTS.md` as the canonical source of agent rules and to standardize plan location on `.opencode/plans/`.

Change summary:

- Added a short note in `.cursorrules` pointing readers to `AGENTS.md` and `.opencode/plans/`.

Validation:

- markdownlint: passed
- type-check: passed
