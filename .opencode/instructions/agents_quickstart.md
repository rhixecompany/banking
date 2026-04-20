---
description: Always Enforces this rules
applyTo: "**"
lastReviewed: 2026-04-14
---

# Default Agent Rules (Repo)

This repository uses `AGENTS.md` as the canonical source of truth for agent behavior, workflows, commands, and PR-blocking rules.

## Canonical source of truth

- Read `AGENTS.md` first for repo-specific rules, commands, and patterns.
- If an `.opencode/instructions/*.md` file conflicts with `AGENTS.md`, align the instruction to `AGENTS.md`.

## Session clarification

- Ask clarifying questions **only when needed** (for example: whether you may modify files, whether a change should be committed, or whether to run slow validations).

## Side effects

- Do not start background services or run environment-specific commands (for example Docker gateway profiles) unless explicitly requested by the user or required for the task at hand.

## Skills, tools, and MCP

- Always, list the skills/tools/plugins you can use and which MCP servers are available in this workspace and summarize.
