---
session: ses_2401
updated: 2026-04-24T14:53:43.144Z
---

# Session Summary

## Goal

Optimize and consolidate agent instruction files (AGENTS.md, instruction files) per user priorities: delete deprecated → consolidate → optimize-config → init-enhanced → add missing info

## Constraints & Preferences

- Strategy: Option C (Reference-only in AGENTS.md, links to specialized instruction files)
- Target length: Concise (~200-300 lines for AGENTS.md)
- Delete deprecated files after consolidation
- Priority order: Delete deprecated → Consolidate instruction files → Optimize-config → init-enhanced → Add missing info

## Progress

### Done

- [x] Deleted 5 deprecated redirect files:
  - `agents_quickstart.md`
  - `09-plan-file-standards.md`
  - `09-command-plan-steps-rules.md`
  - `08-command-plan-steps-rules.md`
  - `06-commands-ref.md`
- [x] Updated `.opencode/instructions/index.md` to remove deleted file references

### In Progress

- [ ] **Step 2**: Consolidate instruction files (review unique content, add cross-references to AGENTS.md)
- [ ] **Step 3**: Optimize AGENTS.md (rewrite concisely to ~200-300 lines with links to instruction files)
- [ ] **Step 4**: Update init-enhanced command file
- [ ] **Step 5**: Add missing info (ESLint rules, MCP tools, custom scripts)

### Blocked

- (none)

## Key Decisions

- **Option C for AGENTS.md**: Keep detailed instruction files but add links from AGENTS.md instead of duplicating content
- **Concise target**: Trim AGENTS.md from ~427 lines to ~200-300 lines
- **Delete deprecated first**: Removed all redirect files before consolidation to avoid broken references

## Next Steps

1. Review `.opencode/instructions/` files to identify unique content worth preserving
2. Create cross-reference section in AGENTS.md pointing to instruction files
3. Trim AGENTS.md to concise format (~200-300 lines)
4. Review/update `.opencode/commands/init-enhanced.md`
5. Add missing information to AGENTS.md (ESLint rules, MCP tools, custom scripts)
6. Run validation: `npm run format`, `npm run type-check`, `npm run lint:strict`

## Critical Context

- 18 instruction files remain in `.opencode/instructions/`
- Instruction index exists at `.opencode/instructions/index.md`
- User selected priorities: "Delete deprecated then Consolidate instruction files, then Optimize-config, then init-enhanced, then add missing info"
- init-enhanced command file located at `.opencode/commands/init-enhanced.md`

## File Operations

### Read

- `/root/banking/.opencode/commands/init-enhanced.md`
- `/root/banking/.opencode/instructions/index.md`
- `/root/banking/AGENTS.md`
- `/root/banking/docs/plans/optimize-config.md`

### Modified

- `/root/banking/.opencode/instructions/index.md`
- `/root/banking/docs/patterns/pattern-reference.md`
- `/root/banking/docs/plans/optimize-config.md`

### Deleted

- `agents_quickstart.md`
- `09-plan-file-standards.md`
- `09-command-plan-steps-rules.md`
- `08-command-plan-steps-rules.md`
- `06-commands-ref.md`
