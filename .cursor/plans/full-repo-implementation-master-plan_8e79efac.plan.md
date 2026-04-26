---
name: full-repo-implementation-master-plan
overview: Execute a full-repository implementation and hardening pass for app routes, components, tests, and scripts in a single master plan, with strict quality gates and aggressive dead-code removal.
todos:
  - id: phase1-catalog
    content: Catalog and triage app/components/tests/scripts against docs and AGENTS constraints
    status: completed
  - id: phase2-components
    content: Consolidate duplicate/dead non-ui components and establish reusable layouts/hooks/stores
    status: completed
  - id: phase3-auth
    content: Implement and harden (auth) route group and linked dependencies/tests
    status: completed
  - id: phase4-admin
    content: Implement and harden (admin) route group and linked dependencies/tests
    status: completed
  - id: phase5-root
    content: Implement and harden (root) route group and linked dependencies/tests
    status: completed
  - id: phase6-home
    content: Implement and harden app/page.tsx and linked dependencies/tests
    status: completed
  - id: phase7-test-hardening
    content: Consolidate and harden all tests for determinism and assertion consistency
    status: completed
  - id: phase8-scripts
    content: Modernize scripts to TS-first orchestration, consolidate duplicates, and update package scripts
    status: completed
  - id: phase9-validate
    content: Run strict full validation gates and fix regressions until clean
    status: in_progress
isProject: false
---

# Full Repo Implementation Master Plan

## Goals

- Fully implement and harden the feature set described in `run-tasks.txt` items 0-9.
- Process route groups in required order: `(auth)` → `(admin)` → `(root)` → `app/page.tsx`.
- Consolidate duplicate/dead components/tests/scripts aggressively, while preserving behavior.
- Finish with strict validation: format, type-check, lint:strict, verify:rules, unit, e2e, and build.

## Source of Truth and Intake

- Read and reconcile requirements and constraints from:
  - [C:/Users/Alexa/Desktop/SandBox/Banking/docs/custom-components.md](C:/Users/Alexa/Desktop/SandBox/Banking/docs/custom-components.md)
  - [C:/Users/Alexa/Desktop/SandBox/Banking/docs/app-pages.md](C:/Users/Alexa/Desktop/SandBox/Banking/docs/app-pages.md)
  - [C:/Users/Alexa/Desktop/SandBox/Banking/docs/test-context.md](C:/Users/Alexa/Desktop/SandBox/Banking/docs/test-context.md)
  - [C:/Users/Alexa/Desktop/SandBox/Banking/AGENTS.md](C:/Users/Alexa/Desktop/SandBox/Banking/AGENTS.md)
- Build a route/component/test/script catalog baseline before edits.

## Execution Phases

### Phase 1: System Catalog and Triage

- Inventory `app/**` pages, layouts, route handlers, wrappers, and dependencies.
  - Key entry files include:
    - [C:/Users/Alexa/Desktop/SandBox/Banking/app/layout.tsx](C:/Users/Alexa/Desktop/SandBox/Banking/app/layout.tsx)
    - [C:/Users/Alexa/Desktop/SandBox/Banking/app/(auth)/layout.tsx](<C:/Users/Alexa/Desktop/SandBox/Banking/app/(auth)/layout.tsx>)
    - [C:/Users/Alexa/Desktop/SandBox/Banking/app/(admin)/layout.tsx](<C:/Users/Alexa/Desktop/SandBox/Banking/app/(admin)/layout.tsx>)
    - [C:/Users/Alexa/Desktop/SandBox/Banking/app/(root)/layout.tsx](<C:/Users/Alexa/Desktop/SandBox/Banking/app/(root)/layout.tsx>)
    - [C:/Users/Alexa/Desktop/SandBox/Banking/app/page.tsx](C:/Users/Alexa/Desktop/SandBox/Banking/app/page.tsx)
- Inventory `components/**` excluding `components/ui/**`; classify into layout primitives, feature wrappers, shared widgets, and potential duplicates/dead candidates.
- Inventory `tests/**`; catalog by route/feature and by Vitest vs Playwright.
- Inventory `scripts/**`; map TS implementation scripts and shell/PowerShell/BAT wrappers.

### Phase 2: Components Consolidation and Reuse Foundation

- Consolidate or remove duplicate/dead component code aggressively (starting with known overlap candidates in `components/layouts`).
- Create/normalize reusable dynamic generic building blocks under [C:/Users/Alexa/Desktop/SandBox/Banking/components/layouts](C:/Users/Alexa/Desktop/SandBox/Banking/components/layouts).
- Extract repeated client-wrapper patterns into reusable hooks/stores where needed.
- Ensure no regressions in feature wrappers that consume these shared components.

### Phase 3: Route-Group Implementation Sweep (Required Order)

- Implement and harden route group flows in this exact sequence:
  1. `(auth)` pages and wrappers.
  2. `(admin)` pages and wrappers.
  3. `(root)` pages and wrappers.
  4. `app/page.tsx` home entry.
- For each route group, locate and update all linked components, DAL, actions, tests, and stores.
- Enforce architecture rules during edits: no `any`, no direct `process.env` in app code, mutations via server actions, no N+1 query patterns.

### Phase 4: Tests Consolidation and Determinism Hardening

- Remove dead/duplicate tests and improve coverage around edited flows.
- Harden Vitest and Playwright specs:
  - remove skipped/non-deterministic patterns,
  - standardize assertions,
  - make authenticated scenarios deterministic with seeded user setup.
- Update relevant testing helpers/config aligned with [C:/Users/Alexa/Desktop/SandBox/Banking/docs/test-context.md](C:/Users/Alexa/Desktop/SandBox/Banking/docs/test-context.md).
- Keep per-group validation as each route group completes.

### Phase 5: Scripts Modernization (`scripts/**`)

- Move business logic into TypeScript scripts (AST-safe with `ts-morph` where needed), with dry-run support for mutating operations.
- Reduce Bash/PowerShell/BAT scripts to thin orchestrators delegating to TS entrypoints.
- Consolidate duplicated script logic and delete dead scripts.
- Update [C:/Users/Alexa/Desktop/SandBox/Banking/package.json](C:/Users/Alexa/Desktop/SandBox/Banking/package.json) script targets accordingly.

### Phase 6: Full Strict Validation and Final Audit

- Run strict full gate in order:
  - `bun run format`
  - `bun run type-check`
  - `bun run lint:strict`
  - `bun run verify:rules`
  - unit tests (`bun run test:browser`)
  - e2e tests (`bun run test:ui`)
  - `bun run build`
- Before any Vitest/Playwright command, clear port `3000` per workspace rule.
- Resolve all regressions, then produce a final change report (what changed, why, and validation evidence).

## Milestone Exit Criteria

- Every phase exits only when:
  - dead/duplicate candidates in scope are either removed or replaced,
  - touched paths pass targeted checks,
  - route-group behavior and tests are deterministic,
  - no rule violations introduced.
- Project completes only when all strict validation gates pass.

## Risk Controls

- Keep edits focused and incremental to prevent cross-cutting regressions.
- Use aggressive deletion only when references, behavior checks, and tests confirm safety.
- Preserve existing architecture boundaries (`app` routing, `actions` for writes, `dal` for data access) while improving reuse and determinism.
