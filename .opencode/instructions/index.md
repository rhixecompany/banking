---
description: Unified index of all instruction files with purposes and priorities
applyTo: "**"
priority: high
canonicalSource: AGENTS.md
lastReviewed: 2026-04-23
---

# Instruction Files Index

This file provides a unified index of all instruction files across the Banking project.

## .opencode/instructions/

| File | Purpose | Priority |
| --- | --- | --- |
| 00-default-rules.md | Always-enforced repository rules | high |
| 00-quickstart-rules.md | Deprecated; replaced by 00-default-rules.md | low |
| 00-task-sync-note.md | Task synchronization for agents and humans | high |
| 01-core-standards.md | Code style, commits, and tests | high |
| 02-nextjs-patterns.md | Next.js patterns, App Router, Server Actions | high |
| 03-dal-patterns.md | DAL patterns and N+1 prevention | high |
| 04-auth-testing.md | Auth testing patterns | high |
| 05-ui-validation.md | UI validation rules | high |
| 07-upstream-error-handling.md | Upstream API error handling | medium |
| 08-alibaba-rate-limit-handling.md | Rate-limit handling | medium |
| 10-apply-patch-verification-fix.md | Apply patch verification | medium |
| 11-documentation-standards.md | Documentation standards | medium |
| 12-scripts-patterns.md | Scripts and destructive ops patterns | medium |
| philosophy.md | Load skills before implementation | high |
| personas-list.md | Personas for plans and PRs | medium |
| plan-workflow.md | Plan workflow standards | high |
| task-implementation.instructions.md | Instructions for implementing task plans with progressive tracking and change record | high |
| tasksync.instructions.md | Allows you to give the agent new instructions or feedback after completing a task using terminal while agent is running | high |
| update-docs-on-code-change.instructions.md | Automatically update README.md and documentation files when application code changes require documentation updates | high |

## .github/instructions/

| File | Purpose | Priority |
| --- | --- | --- |
| code-review.instructions.md | Code review standards | medium |
| documentation.instructions.md | Documentation standards | medium |
| nextjs-tailwind.instructions.md | Next.js + Tailwind standards | medium |
| playwright-typescript.instructions.md | Playwright test writing | medium |
| security.instructions.md | Security guidelines | high |
| testing.instructions.md | Testing guidelines | medium |
| typescript.instructions.md | TypeScript guidelines | medium |
| performance.instructions.md | Performance guidelines | low |

## Other Instruction Entrypoints

| File | Purpose | Priority |
| --- | --- | --- |
| .cursorrules | Cursor/automation summary rules (AGENTS.md remains canonical) | high |
| .github/copilot-instructions.md | GitHub Copilot workspace-wide instructions | high |
| docs/README.instructions.md | External instruction catalog (reference only) | low |

## Usage

- **High priority**: Must read before any implementation
- **Medium priority**: Reference during implementation
- **Low priority**: Optional, for optimization tasks

All instruction files should include YAML frontmatter with `description`, `applyTo`, `priority`, `canonicalSource`, and `lastReviewed`.

Optional frontmatter fields:

- `deprecated`: true/false
- `redirectFrom`: list of paths replaced by this file
- `redirectTo`: path to the replacement file
