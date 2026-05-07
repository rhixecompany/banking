---
category: execution
source: plan-execution
tags: [execute, plan, codebase, mcp]
date: 2026-05-07
---

# Execute Codebase Overhaul

Use this command to execute the comprehensive codebase overhaul plan.

## When to Use

- Starting the codebase overhaul implementation
- Resuming work on the codebase-overhaul plan
- Running the complete Phase 0-5 overhaul with MCP refactor

## Prerequisites

1. Plan `codebase-overhaul` must exist
2. Spec `codebase-overhaul-v2` must be linked to plan

## How to Execute

### Step 1: Read the Plan and Spec

```bash
/readPlan codebase-overhaul
```

### Step 2: Start Execution

Begin with **Phase 0 - Documentation Refresh**:

1. **Phase 0 - Documentation**: Map codebase to docs using explore agent
   - Update `docs/custom-components.md`
   - Update `docs/app-pages.md`
   - Update `docs/test-context.md`
   - Update `docs/scripts.md`

2. **Phase 1 - Component & Test Cleanup**
   - Phase 1a: Components (skip ui/) - refactoring-specialist
   - Phase 1b: Tests - test-automator

3. **Phase 2 - Route Analysis**
   - Analyze (auth) → (admin) → (root) → app/page.tsx
   - nextjs-developer

4. **Phase 3 - Generic Components & Modifications**
   - Phase 3a: Create 8 generic layout components - frontend-design
   - Phase 3b: Full modifications - fullstack-developer

5. **Phase 4 - Script Enhancement**
   - Phase 4a: ts-morph scripts - tooling-engineer
   - Phase 4b: bun scripts - devops-engineer

6. **Phase 5 - Agent Documentation**
   - Create `.opencode/commands/init-enhanced.md`
   - Make AGENTS.md canonical
   - documentation-engineer

7. **Phase 6 - MCP Server Management**
   - Phase 6a: mcp-runner.ts enhancement
   - Phase 6b: Docker MCP catalog
   - Phase 6c: Custom MCP functions
   - tooling-engineer

8. **Phase 7 - Agent Files Audit**
   - List/triage/fix `.opencode/agent/*.md`
   - documentation-engineer

### Step 3: Full Validation (AFTER ALL TASKS)

```bash
bun run format && bun run type-check && bun run lint:strict && bun run verify:rules && bun run test:browser && bun run test:ui
```

## Key Constraints

- Skip `./components/ui/` in all component work
- Bash/PowerShell = orchestrators only; all logic in TypeScript
- Use ts-morph for AST-safe script operations
- All Server Actions return `{ ok, error, ...payload }`
- Never import DB in app/components; use DAL helpers
- Use `app-config.ts` — never `process.env` directly
- `app/page.tsx` must remain public and static
- **NO typecheck/lint/tests until end of Phase 4**

## Sub-Agent Assignments

| Phase | Agent | Purpose |
|-------|-------|---------|
| Phase 0 | explore | Documentation mapping |
| Phase 1a | refactoring-specialist | Component cleanup |
| Phase 1b | test-automator | Test enhancement |
| Phase 2 | nextjs-developer | Route analysis |
| Phase 3a | frontend-design | Generic components |
| Phase 3b | fullstack-developer | Full modification |
| Phase 4a | tooling-engineer | Script enhancement |
| Phase 4b | devops-engineer | bun scripts |
| Phase 5 | documentation-engineer | Agent docs |
| Phase 6a-c | tooling-engineer | MCP servers |
| Phase 7 | documentation-engineer | Agent files audit |

## Consolidation Notes

This plan consolidates duplicate tasks from run-tasks.txt:
- Tasks 9, 10, 11, 12 → Single Phase 5 (Agent Documentation)
- Task 2 → Phase 0 (Documentation)

## Quick Start

```bash
# Execute from root
opencode /execute-plan codebase-overhaul
```

## Related Files

- Plan: `.opencode/plans/codebase-overhaul.md`
- Spec: `.opencode/specs/codebase-overhaul-v2.md`
- Source: `.opencode/commands/codebase-overhaul-execute.md`