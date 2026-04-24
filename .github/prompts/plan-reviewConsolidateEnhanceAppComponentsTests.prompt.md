## Plan: Review, Consolidate, and Enhance Next.js App, Components, and Tests

**TL;DR:** Systematically audit all Next.js pages/configs, non-UI components, and tests. Remove dead/duplicate code, enhance and reuse components, introduce needed hooks/stores, and ensure all tests are up-to-date, deduplicated, and improved.

---

**Steps**

### 1. Next.js Pages & Configurations (app/\*\*)

- List all files in `./app/**` (pages, layouts, error boundaries, API routes, configs).
- Triage: categorize by type (page, layout, error, API, config).
- Read and document each file’s purpose, usage, and dependencies.
- Identify dead, duplicate, or deprecated pages/configs.
- Note any missing or recommended Next.js patterns (e.g., Suspense, error boundaries, server/client component usage).

### 2. Components Audit (components/, skip components/ui)

- List all files in `./components` except `./components/ui`.
- Triage: categorize by type (form, layout, feature, shared, etc.).
- Read and document each component’s usage, props, and dependencies.
- Identify dead, duplicate, or unused components.
- For unused but useful components, plan integration or refactor for reuse.
- Enhance components for clarity, maintainability, and repo conventions.
- Create and use any needed hooks or stores to support component logic (state, effects, context, etc.).

### 3. Component Consolidation & Enhancement

- Remove dead or duplicate components.
- Refactor and consolidate similar components.
- Integrate any remaining unused components where appropriate.
- Enhance all components for best practices (naming, typing, documentation, accessibility).
- Ensure all enhancements follow repo patterns (AGENTS.md, shadcn/ui, Zod, etc.).

### 4. Tests Audit (tests/)

- List all test files in `./tests` (Vitest and Playwright).
- Triage: catalog by test type (unit/integration/E2E), framework (Vitest/Playwright), and feature/area.
- Read and document each test’s coverage, dependencies, and relevance.
- Identify dead, duplicate, or obsolete tests.

### 5. Test Consolidation & Enhancement

- Remove dead or duplicate tests.
- Refactor and consolidate similar or overlapping tests.
- Enhance all tests for coverage, clarity, and maintainability.
- Ensure all tests follow repo conventions (test structure, mocks, assertions, etc.).
- Add missing tests for uncovered features/components as needed.

---

**Relevant files**

- `app/**` — All Next.js pages, layouts, configs
- `components/*` (excluding `components/ui`) — All feature/layout/shared components
- `tests/**` — All Vitest and Playwright test files
- `hooks/`, `stores/` — For new or enhanced hooks/stores as needed
- `AGENTS.md`, `codemap.md` — Canonical repo rules and references

---

**Verification**

1. Run `npm run lint:strict`, `npm run type-check`, and `npm run verify:rules` after all changes.
2. Run all tests: `npm run test` (Vitest + Playwright).
3. Manually review component and test usage to confirm no dead/duplicate code remains.
4. Ensure all enhancements align with repo conventions and improve maintainability.

---

**Decisions**

- All dead/duplicate code must be removed.
- Unused but useful components should be integrated or refactored for reuse.
- New hooks/stores should be created where component logic warrants.
- All tests must be up-to-date, deduplicated, and enhanced for coverage and clarity.

---

**Further Considerations**

1. If any area is under-tested, recommend adding new tests.
2. Consider documenting component/test catalog in codemap.md for future maintainability.
3. For large refactors, break work into smaller, verifiable PRs.

---
