# Spec: new-rules

Scope: feature

# New Rules: Planning, Building, Debugging

## planning.md - When to Enter Plan Mode

### Triggers

- User asks to "plan", "create a plan", or "break down"
- Multi-step task (>3 files or >2 phases)
- Unfamiliar territory (new library, new pattern)
- Ambiguous request

### Process

1. Explore: Check files, docs, recent commits
2. Clarify: Ask questions one at a time
3. Design: Present approach with options
4. Plan: Write implementation steps
5. Verify: Get user approval

### When to Ask Questions

- Unclear requirements
- Conflicting instructions
- Missing context
- Unknown unknowns

---

## building.md - Implementation Workflow

### Process

1. **Plan first** - Read plan, understand scope
2. **Explore** - Check existing patterns
3. **Implement** - One step at a time
4. **Verify** - Run format, typecheck, lint
5. **Test** - Run relevant tests
6. **Commit** - Clean message, no co-author

### Required Verification (in order)

```bash
bun run format && bun run type-check && bun run lint:strict && bun run verify:rules
```

### Never Skip

- format → typecheck → lint:strict → verify:rules (in order)
- Pre-PR checklist even for small changes

---

## debugging.md - Systematic Debugging

### Approach

1. **Reproduce** - Confirm the bug exists
2. **Isolate** - Minimal reproduction
3. **Hypothesize** - Root cause theory
4. **Test** - Verify hypothesis
5. **Fix** - Implement solution
6. **Verify** - Bug fixed, no regressions

### Tools

- Browser automation (agent-browser skill)
- Next.js dev tools (nextjs_index, nextjs_call)
- Log analysis
- Test reproduction
- Code inspection

### When to Use

- Any bug, test failure, unexpected behavior
- Before proposing fixes
- After failed tests

---

## File Locations

- `.opencode/rules/planning.md`
- `.opencode/rules/building.md`
- `.opencode/rules/debugging.md`

## Frontmatter Template

```yaml
---
description: [rule description]
applyTo: "**/*"
priority: high
canonicalSource: AGENTS.md
category: process
tags: [planning, workflow]
date: 2026-05-05
---
```

## Integration

These rules complement:

- task-implementation.md (existing)
- verify:rules enforcement
- AGENTS.md workflows
