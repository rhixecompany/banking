---
plan name: codebase-overhaul
plan description: Codebase overhaul + MCP refactor
plan status: done
---

## Idea

Execute comprehensive codebase overhaul (Phases 0-5) consolidating duplicate tasks, updating docs, enhancing components/tests/scripts, creating init-enhanced.md, and managing MCP servers - all in priority order with best sub-agents assigned.

## Implementation

- Phase 0 - Documentation Refresh: Map codebase to docs/custom-components.md, docs/app-pages.md, docs/test-context.md, docs/scripts.md using explore agent
- Phase 1a - Component Cleanup: Consolidate, remove dead duplicate code, enhance all components in ./components (skip ui/) using refactoring-specialist
- Phase 1b - Test Enhancement: Consolidate, remove dead duplicate code, enhance all tests in ./tests using test-automator
- Phase 2 - Route Analysis: Analyze route groups in order (auth) → (admin) → (root) → app/page.tsx, locate all custom components, DAL, actions, tests, stores using nextjs-developer
- Phase 3a - Create Generic Layout Components: Create reusable dynamic generic custom components in ./components/layouts/ (page-shell, data-table, card, form, modal, toast, skeleton, empty-state) using frontend-design
- Phase 3b - Modify All Components/DAL/Actions/Tests/Stores: Update all to be fully functional with DRY practices, validate reusable components, update docs/test-context.md, harden vitest/playwright specs using fullstack-developer
- Phase 4a - Script Enhancement: Update all custom typescript scripts in ./scripts/\*\* with ts-morph AST-safe operations, dry-run functionality, consolidate/delete dead code - ensure bash/powershell/bat are orchestrators only using tooling-engineer
- Phase 4b - npm Scripts: Modify npm run format and validation scripts (lint/type-check/test/format/build) to use repo bash scripts with echo then fallback to powershell using devops-engineer
- Phase 5 - Agent Documentation (CONSOLIDATED): Create .opencode/commands/init-enhanced.md, make AGENTS.md canonical source of truth, standardize .opencode/commands/ and .opencode/specs/ locations, rewrite overlapping instructions to prevent drift using documentation-engineer
- Phase 6a - MCP Runner Enhancement: Modify scripts/mcp-runner.ts to be custom handler for installing MCP servers in OpenCode/Copilot/Cursor using tooling-engineer
- Phase 6b - Docker MCP Server Catalog: Run docker mcp gateway run --profile adminbot to get server list, confer with .opencode/mcp_servers.json, catalog found servers, create helpers, update opencode.json, delete found servers from docker using tooling-engineer
- Phase 6c - Custom MCP Typecheck Functions: Create custom typecheck functions extending docker MCP tools (mcp-find, mcp-add, mcp-remove, mcp-exec, mcp-config-set, mcp-create-profile, mcp-activate-profile, code-mode, mcp-discover), create adminbot profile, remove specified local MCP servers (context7, fetch, filesystem, memory, next-devtools-mcp, playwright, sequentialthinking, time, youtube-transcript), install npx remote versions using tooling-engineer
- Phase 7 - Agent Files Audit: List, triage, read .opencode/agent/\*.md files, identify inconsistencies with repo, fix all, enhance for repo using documentation-engineer
- Full Validation (AFTER ALL TASKS): Run bun run format && bun run type-check && bun run lint:strict && bun run verify:rules && bun run test:browser && bun run test:ui

## Required Specs

<!-- SPECS_START -->

- codebase-overhaul-v2
<!-- SPECS_END -->
