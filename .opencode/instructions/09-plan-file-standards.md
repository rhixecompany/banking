---
description: Standardize plan creation, naming, and plan quality checks
applyTo: "**"
lastReviewed: 2026-04-13
---

# Plan File Standards

When a task is expected to change more than 6 files, create a command before implementation.

Agentic note: If changes touch >6 files, create the command BEFORE making code edits. Commands are required for agentic documentation changes.

## Location and Naming

- Save every plan in `.opencode/commands/`.
- Use markdown files with `.prompt.md` suffix.
- Use this filename format: `<short-kebab-command-title>.prompt.md`.

## Required Command Sections

Every command must include these sections:

- `# <Command Title>`
- `## Steps`
- `## Tasks`
- `Sub Tasks`
- `## Goals`
- `## Scope`
- `## Target Files`
- `## Risks`
- `## Planned Changes`
- `## Validation`
- `## Rollback or Mitigation`

## Command Quality Rules

- Keep commands specific, testable, and implementation-ready.
- Apply DRY in the command itself: avoid repeating the same step across sections.
- Map each planned change to at least one verification step.
- Call out assumptions and blockers explicitly before coding.

## Markdown Lint Requirement

- Run markdown lint for every command file.
- Fix markdown lint violations before starting implementation.
