---
plan name: nextjs-page-refactor
plan description: Next.js DRY, Test Hardening
plan status: done
---

## Idea

Comprehensive refactor and hardening pass for all Next.js pages, layouts, components, DAL, actions, tests, and scripts in the Banking repository. The approach prioritizes maximum DRY/generic reuse, test determinism/coverage, and then strict adherence to current architecture. All scripts consolidated into TypeScript, skipped/non-deterministic tests removed, exhaustive agentic documentation.

## Implementation

- Phase 1: Page and Layout Triage - List all Next.js pages (page.tsx) and group by route layout: (auth), (admin), (root), root page. For each group, enumerate all custom components, DAL, actions, tests, and stores used.
- Phase 2: DRY Refactor and Component Enhancement - For each group (starting with (auth)), refactor components, DAL, actions, tests, and stores to maximize DRY and generic component reuse. Validate and document all reusable dynamic/generic components. Update all tests and helpers for DRYness and determinism. Ensure all stores are used for state management where appropriate. Remove dead code and redundant logic. Repeat for (admin), (root), and root page.
- Phase 3: Test Hardening - For all Vitest and Playwright specs: Remove skipped/non-deterministic tests. Standardize assertions and structure. Make all authenticated scenarios deterministic with seeded user. Update docs/test-context.md to reflect new test flows and seed details.
- Phase 4: Script Enhancement - Refactor all scripts in ./scripts/: Move all logic to TypeScript scripts (AST-safe, dry-run support via ts-morph). Bash/PowerShell/bat scripts become thin orchestrators only. Consolidate, update, or delete scripts as needed. Update package.json scripts accordingly. Validate all scripts for correct operation.
- Phase 5: Agentic Documentation Sync - Update .opencode/commands/init-enhanced.md to be exhaustive, covering all agentic tools, flows, and reproducible checklists for documentation sync. Cross-reference with AGENTS.md, README.md, and config files. Ensure all agentic coding tools and flows are documented.
- Phase 6: Verification - After each group/phase: Run typecheck, lint, and all tests. Validate DRYness, determinism, and architectural compliance. Update documentation and test context as needed.

## Required Specs

<!-- SPECS_START -->
<!-- SPECS_END -->
