## Plan: Next.js Page Refactor, DRY, and Test Hardening

This plan details a comprehensive refactor and hardening pass for all Next.js pages, layouts, components, DAL, actions, tests, and scripts in the Banking repository. The approach prioritizes maximum DRY/generic reuse, test determinism/coverage, and then strict adherence to current architecture. All scripts will be consolidated into TypeScript orchestrators, with bash/PowerShell/bat as thin wrappers. Layout wrappers will remain separate but share DRYed logic. All skipped/non-deterministic tests will be removed. Agentic documentation will be exhaustive, covering all tools/flows.

**Steps**

### Phase 1: Page and Layout Triage

1. List all Next.js pages (`page.tsx`) and group by route layout: (auth), (admin), (root), root page.
2. For each group, enumerate all custom components, DAL, actions, tests, and stores used.

### Phase 2: DRY Refactor and Component Enhancement

3. For each group (starting with (auth)), refactor components, DAL, actions, tests, and stores to:
   - Maximize DRY and generic component reuse (move/merge to `components/layouts` as needed)
   - Validate and document all reusable dynamic/generic components
   - Update all tests and helpers for DRYness and determinism
   - Ensure all stores are used for state management where appropriate
   - Remove dead code and redundant logic
   - Repeat for (admin), (root), and root page

### Phase 3: Test Hardening

4. For all Vitest and Playwright specs:
   - Remove skipped/non-deterministic tests
   - Standardize assertions and structure
   - Make all authenticated scenarios deterministic with seeded user
   - Update `docs/test-context.md` to reflect new test flows and seed details

### Phase 4: Script Enhancement

5. Refactor all scripts in `./scripts/**`:
   - Move all logic to TypeScript scripts (AST-safe, dry-run support via ts-morph)
   - Bash/PowerShell/bat scripts become thin orchestrators only
   - Consolidate, update, or delete scripts as needed
   - Update `package.json` scripts accordingly
   - Validate all scripts for correct operation

### Phase 5: Agentic Documentation Sync

6. Update `.opencode/commands/init-enhanced.md` to be exhaustive, covering all agentic tools, flows, and reproducible checklists for documentation sync.
   - Cross-reference with `AGENTS.md`, `README.md`, and config files
   - Ensure all agentic coding tools and flows are documented

### Phase 6: Verification

7. After each group/phase:
   - Run typecheck, lint, and all tests
   - Validate DRYness, determinism, and architectural compliance
   - Update documentation and test context as needed

**Relevant files**

- `app/(auth)/*`, `app/(admin)/*`, `app/(root)/*`, `app/page.tsx` — Next.js pages/layouts
- `components/layouts/*` — Layout and presentational components
- `dal/*`, `actions/*`, `stores/*` — Data, actions, state
- `tests/*` — Vitest and Playwright specs
- `scripts/*` — All scripts
- `docs/test-context.md` — Test and seed context
- `.opencode/commands/init-enhanced.md` — Agentic documentation
- `package.json` — Scripts

**Verification**

1. Run `npm run type-check`, `npm run lint:strict`, and `npm run test` after each group/phase
2. Validate all Playwright E2E and Vitest unit tests pass deterministically
3. Confirm all scripts work as orchestrators and support dry-run
4. Ensure all documentation is up to date and exhaustive for agentic tools/flows

**Decisions**

- DRY/generic reuse and test determinism are top priorities, followed by architecture
- All scripts consolidated to TypeScript orchestrators
- Layout wrappers remain separate but share DRYed logic
- All skipped/non-deterministic tests removed
- Agentic documentation will be exhaustive

**Further Considerations**

1. If new generic layout patterns emerge, consider merging wrappers in a future pass
2. If any scripts require legacy shell compatibility, document exceptions
3. If test determinism is not possible for some flows, document and isolate them
