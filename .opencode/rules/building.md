---
description: Implementation workflow and verification steps
applyTo: "**/*"
priority: high
canonicalSource: AGENTS.md
category: process
tags: [building, workflow]
date: 2026-05-05
---

# Building Rule

## Implementation Workflow

1. **Plan first** - Read plan, understand scope
2. **Explore** - Check existing patterns
3. **Implement** - One step at a time
4. **Verify** - Run format, typecheck, lint
5. **Test** - Run relevant tests
6. **Commit** - Clean message, no co-author

## Required Verification (in order)

```bash
bun run format && bun run type-check && bun run lint:strict && bun run verify:rules
```

## Never Skip

- format → typecheck → lint:strict → verify:rules (in order)
- Pre-PR checklist even for small changes
