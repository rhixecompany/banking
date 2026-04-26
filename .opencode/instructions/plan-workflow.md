---
description: Workflow rules for multi-file and agentic changes; plan file format standards for .opencode/commands/
applyTo: ".opencode/commands/*.md, **"
priority: high
canonicalSource: AGENTS.md
lastReviewed: 2026-04-23
---

# Plan Workflow & Standards

Canonical source: AGENTS.md — this file consolidates and references AGENTS.md for agentic workflow and plan requirements.

## Multi-File Change Rules

- For any change affecting **more than 7 files**, a plan must be created in `.opencode/commands/` before implementation.
- Plans should list actionable steps, responsible personas, and expected outcomes.
- Reference the plan in PRs and update as steps are completed.
- All agentic or automated changes must be traceable to a plan file.
- Plans must be reviewed and approved before execution for high-risk or destructive changes.

## Plan File Format

Each plan file must include:

- **Title**: Clear name describing the implementation
- **Description**: 1-3 sentence summary of what the plan covers
- **Personas**: Who is responsible for each step (Implementer, Reviewer, Maintainer, QA Engineer, Product Owner)
- **Actionable steps**: Numbered (1.1, 1.2, 2.1) with clear verbs
- **Verification checklist**: How to validate completion

### Frontmatter

Use YAML frontmatter with:

```yaml
---
status: not-started | in-progress | complete | blocked
phase: 1 | 2 | 3
updated: YYYY-MM-DD
---
```

### Phase Status Markers

| Marker          | Meaning                   |
| --------------- | ------------------------- |
| `[PENDING]`     | Not yet started           |
| `[IN PROGRESS]` | Currently being worked on |
| `[COMPLETE]`    | Finished successfully     |
| `[BLOCKED]`     | Waiting on dependencies   |

### Task Markers

- `[x]` = completed task
- `[ ]` = pending task
- `← CURRENT` = active task (only ONE at a time)

## References

- AGENTS.md — canonical agent rules
- .opencode/instructions/00-default-rules.md — default commands and rules
- .opencode/instructions/01-core-standards.md — code style and standards
