---
description: Systematic debugging approach and tools
applyTo: "**/*"
priority: high
canonicalSource: AGENTS.md
category: process
tags: [debugging, troubleshooting]
date: 2026-05-05
---

# Debugging Rule

## Systematic Approach

1. **Reproduce** - Confirm the bug exists
2. **Isolate** - Minimal reproduction
3. **Hypothesize** - Root cause theory
4. **Test** - Verify hypothesis
5. **Fix** - Implement solution
6. **Verify** - Bug fixed, no regressions

## Tools

- Browser automation (agent-browser skill)
- Next.js dev tools (nextjs_index, nextjs_call)
- Log analysis
- Test reproduction
- Code inspection

## When to Use

- Any bug, test failure, unexpected behavior
- Before proposing fixes
- After failed tests
