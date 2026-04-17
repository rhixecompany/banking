## Plan: Next.js App Pages Refactor & Test Hardening

This plan details a deterministic, machine-executable approach for triaging, grouping, and refactoring all Next.js pages in the `./app` directory, focusing on route layouts, component modularization, and test hardening. It includes explicit requirements for reusable dynamic components, test determinism, and script compliance.

---

goal: Refactor Next.js App Pages, Modularize Layouts, Harden Tests, and Update Scripts version: 1.0 date_created: 2026-04-17 last_updated: 2026-04-17 owner: Platform Engineering Team status: 'Planned' tags: [feature, refactor, test, scripts, nextjs, e2e, vitest, playwright, dal, actions, layouts]

---

# Introduction

![Status: Planned](https://img.shields.io/badge/status-Planned-blue)

This plan provides a deterministic, phase-based implementation for refactoring all Next.js pages in the `./app` directory. It groups pages by route layouts, modularizes and validates all custom components, ensures DRY practices, and hardens all tests and scripts for compliance and reliability.

## 1. Requirements & Constraints

- **REQ-001**: List and group all Next.js pages in `./app` by route layout: `(auth)`, `(admin)`, `(root)`, and `app/page.tsx`.
- **REQ-002**: For each group, locate all pages it contains, page-specific components, custom components, DAL, actions, and tests.
- **REQ-003**: Refactor all components to be fully functional, DRY, and reusable; save dynamic/generic components to `./components/layouts`.
- **REQ-004**: Validate all reusable components in `./components/layouts` for correctness and reusability.
- **REQ-005**: Update all tests, helpers, and configurations in `docs/test-context.md` to reflect changes and DRY practices.
- **REQ-006**: Harden all Vitest and Playwright E2E specs: remove skipped/non-deterministic tests, standardize assertions, and ensure deterministic authenticated scenarios with seeded users.
- **REQ-007**: Sequentially process all Next.js pages, repeating the above for each.
- **REQ-008**: As Reviewer Persona, update all custom scripts in `./scripts` for compliance and enhancements.
- **REQ-009**: As Implementer Persona, update all custom scripts in `./scripts` to be AST-safe and support dry-run functionality.
- **CON-001**: No use of `any` types; use `unknown` + type guards.
- **CON-002**: No N+1 queries; all DB access via DAL.
- **CON-003**: All mutations via Server Actions.
- **CON-004**: Zero TypeScript errors and lint warnings.
- **CON-005**: All tests must pass.
- **PAT-001**: Use DRY and modularization patterns for all components and scripts.
- **PAT-002**: Use Zod for validation, NextAuth for authentication, and Drizzle ORM for DB access.

## 2. Implementation Steps

### Implementation Phase 1

- GOAL-001: Triage and group all Next.js pages by route layout.

| Task | Description | Completed | Date |
| --- | --- | --- | --- |
| TASK-001 | List all Next.js pages in `./app` and group by `(auth)`, `(admin)`, `(root)`, and `app/page.tsx` |  |  |
| TASK-002 | For each group, enumerate all pages it contains, page-specific components, custom components, DAL, actions, and tests |  |  |

### Implementation Phase 2

- GOAL-002: Refactor and modularize all components, DAL, actions, and tests for each group.

| Task | Description | Completed | Date |
| --- | --- | --- | --- |
| TASK-003 | Refactor all group components to be fully functional and DRY |  |  |
| TASK-004 | Create/Update reusable dynamic/generic components in `./components/layouts` |  |  |
| TASK-005 | Validate all components in `./components/layouts` for reusability |  |  |
| TASK-006 | Update all group DAL and actions for compliance and DRY |  |  |
| TASK-007 | Update all group tests, helpers, and `docs/test-context.md` |  |  |

### Implementation Phase 3

- GOAL-003: Harden all Vitest and Playwright E2E specs.

| Task | Description | Completed | Date |
| --- | --- | --- | --- |
| TASK-008 | Remove skipped/non-deterministic tests |  |  |
| TASK-009 | Standardize all assertions |  |  |
| TASK-010 | Ensure all authenticated scenarios are deterministic with seeded users |  |  |

### Implementation Phase 4

- GOAL-004: Update and enhance all custom scripts in `./scripts`.

| Task | Description | Completed | Date |
| --- | --- | --- | --- |
| TASK-011 | As Reviewer Persona, update all scripts for compliance and enhancements |  |  |
| TASK-012 | As Implementer Persona, update all scripts to be AST-safe and support dry-run |  |  |

## 3. Alternatives

- **ALT-001**: Refactor pages and components ad hoc without grouping by route layout (rejected for lack of structure and maintainability).
- **ALT-002**: Only update tests without modularizing components (rejected for not addressing DRY and reusability requirements).

## 4. Dependencies

- **DEP-001**: Next.js 16, TypeScript (strict), Drizzle ORM, PostgreSQL, NextAuth, shadcn/UI, Tailwind CSS v4, Zod, Vitest, Playwright.
- **DEP-002**: Existing DAL, actions, and test helpers.
- **DEP-003**: `docs/test-context.md` for test context updates.

## 5. Files

- **FILE-001**: `app/(auth)/**` — All pages, components, DAL, actions, tests under `(auth)` route.
- **FILE-002**: `app/(admin)/**` — All pages, components, DAL, actions, tests under `(admin)` route.
- **FILE-003**: `app/(root)/**` — All pages, components, DAL, actions, tests under `(root)` route.
- **FILE-004**: `app/page.tsx` — Main app page and its dependencies.
- **FILE-005**: `components/layouts/**` — All reusable dynamic/generic components.
- **FILE-006**: `dal/**` — All DAL helpers.
- **FILE-007**: `actions/**` — All Server Actions.
- **FILE-008**: `tests/**` — All Vitest and Playwright tests.
- **FILE-009**: `docs/test-context.md` — Test context documentation.
- **FILE-010**: `scripts/**` — All custom scripts (TypeScript, bash, PowerShell, bat).

## 6. Testing

- **TEST-001**: All Vitest unit/integration tests must pass and be deterministic.
- **TEST-002**: All Playwright E2E tests must pass and be deterministic.
- **TEST-003**: All new/updated components in `components/layouts` must have coverage.
- **TEST-004**: All scripts must be tested for AST-safety and dry-run functionality.
- **TEST-005**: Validate test context in `docs/test-context.md`.

## 7. Risks & Assumptions

- **RISK-001**: Refactoring may introduce regressions if not fully covered by tests.
- **RISK-002**: Some legacy components may not be easily modularized.
- **ASSUMPTION-001**: All DAL and actions follow project conventions.
- **ASSUMPTION-002**: Test context documentation is up to date.

## 8. Related Specifications / Further Reading

- [AGENTS.md](../AGENTS.md)
- [copilot-instructions.md](../.github/copilot-instructions.md)
- [docs/test-context.md](../docs/test-context.md)
- [Next.js App Router Docs](https://nextjs.org/docs/app/building-your-application/routing)
- [Vitest Docs](https://vitest.dev/)
- [Playwright Docs](https://playwright.dev/)

---

using the question tool ask all clarifying or needed questions then keep asking until you dont have further question then show me the plan with all new and old data.

This plan is ready for autonomous execution by AI agents or humans. All steps are explicit, atomic, and machine-parseable.
