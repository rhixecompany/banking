---
category: workflow
source: github-prompts
tags: [autonomy, agents, workflow]
date: 2026-05-03
---

# Structured Autonomy Workflow

Guide for autonomous agent work on the Banking app.

## When to Use

- Dispatching subagents for complex tasks
- Running parallel agent sessions
- Breaking down large features

## Workflow Steps

### 1. Understand Requirements

- Read relevant docs (AGENTS.md, exemplars.md)
- Check existing patterns in codebase
- Clarify any ambiguities before starting

### 2. Plan Execution

- Break into independent tasks
- Identify dependencies
- Determine order of execution

### 3. Implement

- Follow AGENTS.md conventions:
  - Server Actions for mutations
  - DAL helpers for DB access
  - `app-config.ts` for env vars
  - Zod validation
  - No `any` types

### 4. Verify

- Run format, typecheck, lint
- Test locally if possible
- Check for regressions

## Autonomy Levels

1. **Research Only** - Gather info, don't modify
2. **Implement with Approval** - Propose, wait for go-ahead
3. **Implement with Constraints** - Follow rules, report issues
4. **Full Autonomy** - Complete end-to-end, notify when done

## For This Project

Follow constraints from AGENTS.md:

- Skip `./components/ui/`
- Shell scripts = orchestrators only
- Server Actions return `{ ok: boolean; error?: string; ... }`
- Never import DB in `app/` or `components/`

See `.github/prompts/structured-autonomy-*.prompt.md` for full details
