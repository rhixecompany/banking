# Codebase Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Comprehensive modernization of Banking app across 8 sequential phases.

**Architecture:** Sequential phase execution with strict validation gates. No typecheck/lint/tests until end of Phase 4.

**Tech Stack:** Next.js 16, React 19, TypeScript strict, Drizzle ORM, Vitest, Playwright, ts-morph, Bun 1.3.14

---

## Overview

This is a large-scale codebase overhaul spanning 8 phases affecting 100+ files. The plan consolidates all duplicate/obsolete plans from prior work.

---

## Constraints (Non-Negotiable)

- Skip `./components/ui/` in all component work
- Bash/PowerShell = orchestrators only; all logic in TypeScript
- Use ts-morph for AST-safe script operations
- All Server Actions return `{ ok: boolean; error?: string; ...payload }`
- Never import DB in `app/` or `components/`; use DAL helpers
- Use `app-config.ts` — never `process.env` directly
- `app/page.tsx` must remain public and static
- NO typecheck/lint/tests until end of Phase 4

---

## Phase 0: Documentation Refresh

### Goal

Update 4 core documentation files to reflect current codebase state.

### Tasks

- [x] Update `docs/app-pages.md` - Page inventory with routes
- [x] Update `docs/custom-components.md` - Component inventory
- [x] Update `docs/test-context.md` - Test inventory
- [x] Update `docs/scripts.md` - Script inventory

---

## Phase 1: Component & Test Cleanup

### Goal

Component enhancement pass and test infrastructure hardening.

#### Phase 1a: Component Cleanup

- [ ] Enhance all components in `components/layouts/**`
- [ ] Ensure fully typed props (no `any`)
- [ ] Add JSDoc comments
- [ ] Consistent export patterns

#### Phase 1b: Test Enhancement

- [ ] Verify 37 Vitest + 10 Playwright specs
- [ ] Fix broken imports
- [ ] Ensure deterministic behavior

---

## Phase 2: Route Analysis

### Goal

Analyze every page in order, documenting current state, violations, and improvements.

### Tasks

- [ ] Analyze (auth) pages: sign-in, sign-up
- [ ] Analyze (admin) pages: dashboard
- [ ] Analyze (root) pages: dashboard, wallets, transactions, transfers, settings
- [ ] Analyze landing page (app/page.tsx) - MUST remain static
- [ ] Analyze demo pages in app/demo/

---

## Phase 3: Generic Components & Modifications

### Goal

Create reusable generic components and apply Phase 2 findings to modify pages.

#### Phase 3a: Create 8 Generic Layout Components

- [ ] `generic-page-shell` - Page container with title, description, actions
- [ ] `generic-data-table` - Type-safe table with configurable columns
- [ ] `generic-card` - Card with header, body, footer slots
- [ ] `generic-form` - Form wrapper with react-hook-form integration
- [ ] `generic-modal` - Accessible modal with focus management
- [ ] `generic-toast` - Toast notification component
- [ ] `generic-skeleton` - Loading skeleton component
- [ ] `generic-empty-state` - No-data display component

#### Phase 3b: Full Modifications

- [ ] Fix all process.env violations → use app-config.ts
- [ ] Fix all direct DB imports → use DAL helpers
- [ ] Add missing auth guards
- [ ] Replace one-off markup with generic components
- [ ] Verify Server Actions return `{ ok, error, ...payload }`
- [ ] Add revalidatePath() after mutations

---

## Phase 4: Script Enhancement

### Goal

Convert shell scripts to orchestrators, add --dry-run, use ts-morph.

#### Phase 4a: ts-morph Scripts

- [ ] Audit scripts for orchestrator pattern
- [ ] Convert shell scripts with logic to TypeScript
- [ ] Add --dry-run to mutation scripts
- [ ] Replace regex with ts-morph for AST operations

#### Phase 4b: Bun Scripts

- [ ] Ensure all bun scripts follow orchestrator pattern
- [ ] Add proper error handling
- [ ] Standardize CLI flags

---

## Phase 5: Agent Documentation

### Goal

Create proper agent documentation and make AGENTS.md canonical.

### Tasks

- [ ] Create `.opencode/commands/init-enhanced.md`
- [ ] Make AGENTS.md canonical
- [ ] Update skill documentation
- [ ] Document sub-agent patterns

---

## Phase 6: MCP Server Management

### Goal

Enhance MCP server management and Docker integration.

### Tasks

#### Phase 6a: mcp-runner.ts Enhancement

- [ ] Improve MCP server lifecycle management
- [ ] Add health checks
- [ ] Better error handling

#### Phase 6b: Docker MCP Catalog

- [ ] Create Docker MCP catalog
- [ ] Document containerized MCP servers

#### Phase 6c: Custom MCP Functions

- [ ] Implement custom MCP functions
- [ ] Document MCP extension points

---

## Phase 7: Agent Files Audit

### Goal

Audit and fix all `.opencode/agent/*.md` files.

### Tasks

- [ ] List all agent files
- [ ] Triage by priority
- [ ] Fix deprecated/invalid entries
- [ ] Ensure proper structure

---

## Phase 8: Final Validation (CRITICAL GATE)

### Goal

Run full validation - ALL checks must pass before completion.

### Tasks

- [ ] `bun run format`
- [ ] `bun run type-check`
- [ ] `bun run lint:strict`
- [ ] `bun run verify:rules`
- [ ] `bun run test:browser`
- [ ] `bun run test:ui`

---

## Sub-Agent Assignments

| Phase      | Agent                  | Purpose               |
| ---------- | ---------------------- | --------------------- |
| Phase 0    | explore                | Documentation mapping |
| Phase 1a   | refactoring-specialist | Component cleanup     |
| Phase 1b   | test-automator         | Test enhancement      |
| Phase 2    | nextjs-developer       | Route analysis        |
| Phase 3a   | frontend-design        | Generic components    |
| Phase 3b   | fullstack-developer    | Full modification     |
| Phase 4a   | tooling-engineer       | Script enhancement    |
| Phase 4b   | devops-engineer        | bun scripts           |
| Phase 5    | documentation-engineer | Agent docs            |
| Phase 6a-c | tooling-engineer       | MCP servers           |
| Phase 7    | documentation-engineer | Agent files audit     |

---

## Related Files

- **Spec:** `.opencode/specs/codebase-overhaul-v2.md`
- **Command:** `.opencode/commands/codebase-overhaul-execute.md`
