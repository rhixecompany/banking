---
description: Optimize and consolidate agent instruction files (AGENTS.md, instruction files)
status: in-progress
updated: 2026-04-24
---

# Plan: optimize-config

Optimize and consolidate agent instruction files per user priorities.

## Priority Order (User-Selected)

1. ~~Delete deprecated then Consolidate instruction files~~ → (combined below)
2. ~~Optimize-config~~ → (rewrite AGENTS.md concisely)
3. ~~init-enhanced~~ → (update command)
4. ~~Add missing info~~ → (ESLint rules, MCP tools, scripts)

## Strategy

- **Option C**: Reference-only in AGENTS.md, links to specialized instruction files
- **Concise target**: ~200-300 lines for AGENTS.md

## Implementation Steps

### Step 1: DELETE DEPRECATED FILES (COMPLETE)

- [x] Deleted: `agents_quickstart.md`
- [x] Deleted: `09-plan-file-standards.md`
- [x] Deleted: `09-command-plan-steps-rules.md`
- [x] Deleted: `08-command-plan-steps-rules.md`
- [x] Deleted: `06-commands-ref.md`

### Step 2: CONSOLIDATE INSTRUCTION FILES (pending)

### Step 2: CONSOLIDATE INSTRUCTION FILES

- [ ] Review `.opencode/instructions/` for unique content
- [ ] Add cross-reference section to AGENTS.md

### Step 3: OPTIMIZE AGENTS.md (rewrite concisely)

- [ ] Trim to ~200-300 lines
- [ ] Add links to instruction files instead of duplicates
- [ ] Verify all essential info preserved

### Step 4: INIT-ENHANCED (update command file)

- [ ] Review `.opencode/commands/init-enhanced.md`
- [ ] Update if needed

### Step 5: ADD MISSING INFO

- [ ] Add ESLint rules to AGENTS.md
- [ ] Add MCP tools to AGENTS.md
- [ ] Add custom scripts reference

## Files to Delete

| File | Redirects To |
|------|------------|
| `.opencode/instructions/agents_quickstart.md` | AGENTS.md |
| `.opencode/instructions/09-plan-file-standards.md` | plan-workflow.md |
| `.opencode/instructions/09-command_plan_steps_rules.md` | plan-workflow.md |
| `.opencode/instructions/08-command_plan_steps_rules.md` | plan-workflow.md |
| `.opencode/instructions/06-commands-ref.md` | 00-default-rules.md |

## Validation

- [ ] `npm run format` passes
- [ ] `npm run type-check` passes
- [ ] `npm run lint:strict` zero warnings