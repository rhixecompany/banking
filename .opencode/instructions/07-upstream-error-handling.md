---
name: "upstream-error-handling"
description: "How to handle transient AI provider rate-limit errors — do NOT add them to AGENTS.md"
applyTo: "**"
lastReviewed: 2026-04-13
---

# Upstream AI Provider Error Handling

## Rule

When you encounter a transient rate-limit or upstream error from the AI provider (e.g., "Request rate increased too quickly", "Upstream error from Alibaba", "Too many requests"), **do NOT add these messages to AGENTS.md or any project documentation.**

## Why

- `AGENTS.md` is the canonical reference for coding standards, commands, patterns, and project-specific facts for agentic contributors
- Adding upstream API error messages creates noise that misleads future sessions
- These errors are operational/transient — they have nothing to do with the codebase

## What To Do Instead

1. **Slow down tool calls** — batch reads together, reduce parallel requests
2. **Retry the operation** — transient errors resolve on retry
3. **Adjust pacing** — space out heavy operations (multiple file writes, large searches)
4. **If persistent** — inform the user about the rate limit and suggest waiting

## What NOT To Do

- Do NOT add error messages to AGENTS.md
- Do NOT create documentation files about rate limits
- Do NOT modify project files to "fix" upstream errors
- Do NOT commit changes that reference provider errors

Agentic note: Do not add transient upstream errors to AGENTS.md — they are operational and not repo facts.
