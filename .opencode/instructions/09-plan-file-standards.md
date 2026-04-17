---
description: Standardize plan creation, naming, and plan quality checks
applyTo: "**"
lastReviewed: 2026-04-13
---

# Plan File Standards

When a task is expected to change more than 7 files, create a plan before implementation.

Agentic note: For this repository, treat `AGENTS.md` as the canonical source of truth for plan thresholds, locations, and required sections. If any instruction in `.opencode/` conflicts with `AGENTS.md`, update the instruction to match `AGENTS.md`.

## Location and Naming

- Save every plan in `.opencode/commands/`.
- Use markdown files with `.plan.md` suffix.
- Use this filename format: `<short-kebab-task>.plan.md`.

Note: Legacy plan artifacts may exist under `.opencode/plans/` or `.cursor/plans/`. Preserve those files for historical provenance — do not move or delete them. Use `.opencode/commands/` for all new user-facing plan files.

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

## Tooling and CI

- Use `npm run plan:ensure` to scaffold or merge plan context when your change touches more than 7 files. It will search for candidate plans under `.opencode/commands/` and `.cursor/plans/`, offer an interactive merge locally, or scaffold a draft plan for you to edit.
- CI will run a non-blocking `plan-check` workflow (pilot) that executes `npm run plan:ensure -- --ci` and `npm run verify:rules:ci -- --require-plan`. In pilot mode the job reports a warning but does not fail the run. Maintainers may opt to make this blocking after the pilot.

-- Canonicalized from docs/AGENTS-CANONICAL.md on 2026-04-17 as part of unify-agent-docs operation.
