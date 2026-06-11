---
plan name: banking-refactor
plan description: Full refactor and modernization
plan status: active
---

## Idea

Complete codebase overhaul with demo integration, consolidation, and script enhancement for Next.js 16 banking app

## Implementation

- Map codebase and create docs: custom-components.md, app-pages.md, test-context.md with all Next.js pages, components (skip ui/), tests, and scripts
- Integrate demo pages into UI, delete demo pages, consolidate dead code, enhance all components in ./components (skip ui/) with reusable hooks and stores
- Consolidate and enhance all tests in ./src/tests
- Process route layouts sequentially: (auth) → (admin) → (root) → page.tsx, locate all custom components/dal/actions/tests/stores
- Modify all components/dal/actions/tests/stores to be fully functional, create reusable generic components in ./src/components/layouts, validate with DRY practices, update test-context.md, harden vitest and Playwright specs
- Update all custom typescript scripts in ./scripts/** and ./bin/** with ts-morph AST-safe transformations, dry-run functionality, consolidate to TypeScript, delete dead code
- Modify bun run format to use bash scripts with echo feedback, fallback to powershell/bat, update all validation scripts (lint/type-check/test/format/build)

## Required Specs

<!-- SPECS_START -->

- banking-overhaul-spec
<!-- SPECS_END -->
