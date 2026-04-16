---
description: Standardize plan creation, naming, and plan quality checks
applyTo: "**"
lastReviewed: 2026-04-13
---

# Plan File Standards

When a task is expected to change more than 3 files, create a plan before implementation.

Agentic note: For this repository, treat `AGENTS.md` as the canonical source of truth for plan thresholds, locations, and required sections. If any instruction in `.opencode/` conflicts with `AGENTS.md`, update the instruction to match `AGENTS.md`.

## Location and Naming

- Save every plan in `.opencode/plans/`.
- Use markdown files with `.plan.md` suffix.
- Use this filename format: `<short-kebab-task>_<8-char-id>.plan.md`.

## Required Plan Sections

Every plan must include these sections:

- `# <Plan Title>`
- `## Goals`
- `## Scope`
- `## Target Files`
- `## Risks`
- `## Planned Changes`
- `## Validation`
- `## Rollback or Mitigation`

## Plan Quality Rules

- Keep plans specific, testable, and implementation-ready.
- Apply DRY in the plan itself: avoid repeating the same step across sections.
- Map each planned change to at least one verification step.
- Call out assumptions and blockers explicitly before coding.

## Markdown Lint Requirement

- Run markdown lint for every plan file.
- Fix markdown lint violations before starting implementation.
