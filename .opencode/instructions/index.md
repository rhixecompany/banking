---
description: Unified index of all instruction files with purposes and priorities
applyTo: "**"
priority: high
canonicalSource: AGENTS.md
lastReviewed: 2026-04-24
---

# Instruction Files Index

This file provides a unified index of all instruction files across the Banking project.

## .opencode/instructions/

| File | Purpose | Priority |
| ---- | ------- | -------- |
| 00-default-rules.md | Always-enforced repository rules | high |
| 00-task-sync-note.md | Task synchronization for agents and humans | high |
| 01-core-standards.md | Code style, commits, and tests | high |
| 02-nextjs-patterns.md | Next.js patterns, App Router, Server Actions | high |
| 03-dal-patterns.md | DAL patterns and N+1 prevention | high |
| 04-auth-testing.md | Auth testing patterns | high |
| 05-ui-validation.md | UI validation rules | high |
| 06-commands-ref.md | DEPRECATED — redirect to 00-default-rules.md | — |
| 07-upstream-error-handling.md | Upstream API error handling | medium |
| 08-command-plan-steps-rules.md | DEPRECATED — redirect to plan-workflow.md | — |
| 08-alibaba-rate-limit-handling.md | Rate-limit handling | medium |
| 09-plan-file-standards.md | DEPRECATED — redirect to plan-workflow.md | — |
| 09-command-plan-plan-steps-rules.md | DEPRECATED — redirect to plan-workflow.md | — |
| 10-apply-patch-verification-fix.md | Apply patch verification | medium |
| 11-documentation-standards.md | Documentation standards | medium |
| 12-scripts-patterns.md | Scripts and destructive ops patterns | medium |
| philosophy.md | Load skills before implementation | high |
| personas-list.md | Personas for plans and PRs | medium |
| plan-workflow.md | Plan workflow standards | high |
| morph-tools.md | morph_edit tool selection | high |

## .github/instructions/

| File | Purpose | Priority |
| ---- | ------- | -------- |
| code-review.instructions.md | Code review standards | medium |
| documentation.instructions.md | Documentation standards | medium |
| nextjs-tailwind.instructions.md | Next.js + Tailwind standards | medium |
| playwright-typescript.instructions.md | Playwright test writing | medium |
| security.instructions.md | Security guidelines | high |
| testing.instructions.md | Testing guidelines | medium |
| typescript.instructions.md | TypeScript guidelines | medium |
| performance.instructions.md | Performance guidelines | low |

## Usage

- **High priority**: Must read before any implementation
- **Medium priority**: Reference during implementation
- **Low priority**: Optional, for optimization tasks

All instruction files should include YAML frontmatter with `description`, `applyTo`, and `priority` fields.