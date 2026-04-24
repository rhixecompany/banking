---
description: Refactor frontend UI following established patterns in AGENTS.md - comprehensive audit, documentation, and enhancement across Actions, Zod, DALs, Pages, Components, Tests, Scripts, and MCP management
status: not-started
phase: 1
updated: 2026-04-24
---

# Frontend UI Refactoring Implementation Plan

## Overview

Comprehensive refactoring of the Banking application frontend UI following patterns in AGENTS.md. Plan spans 12 task groups to be delivered as multiple PRs for risk mitigation.

## Personas

- **Implementer** — performs code changes, validations, test updates
- **Reviewer** — focuses on regressions, security, test coverage
- **Maintainer** — approves merges, runs destructive scripts
- **QA Engineer** — runs E2E and exploratory tests
- **Product Owner** — approves scope and priority changes

---

## Task Groups

### Group 1: Audit & Enhancement (Actions, Zod, DALs)

**Phase:** 1 | **Status:** [PENDING] | **Files Affected:** ~35

#### Steps

1.1 Audit all Server Actions in `./actions/**` for compliance with pattern:

- Verify `"use server"` directive present
- Verify Zod `.safeParse()` validation
- Verify `{ ok: boolean; error?: string }` return shape
- Verify early `auth()` call for protected actions

  1.2 Audit all Zod schemas for best practices:

- Check `.describe()` on fields
- Check explicit error messages
- Identify duplicate/DRY violations

  1.3 Audit all DAL helpers in `./dal/**`:

- Check for N+1 query patterns
- Verify eager loading where applicable
- Check optional `tx` transaction parameter

  1.4 Document findings in `docs/actions-audit.md` and `docs/dal-audit.md`

  1.5 Implement enhancements:

- Fix non-compliant Server Actions
- Extract shared Zod schemas
- Add eager loading to DALs

#### Verification Checklist

- [ ] All 12 Server Actions use `"use server"` directive
- [ ] All Server Actions return `{ ok, error? }` shape
- [ ] All protected actions call `auth()` early
- [ ] All Zod schemas include `.describe()` per field
- [ ] All DAL helpers avoid N+1 queries
- [ ] Pass `npm run type-check`
- [ ] Pass `npm run lint:strict`

#### Deliverables

- `docs/actions-audit.md`
- `docs/dal-audit.md`
- Updated `./actions/*.ts` files
- Updated `./dal/*.ts` files

---

### Group 2: Pages Documentation

**Phase:** 1 | **Status:** [PENDING] | **Files Affected:** ~15

#### Steps

2.1 List all pages in `./app/**`:

```
(app)/(auth)/sign-in/page.tsx       → Sign in page
(app)/(auth)/sign-up/page.tsx       → Sign up page
(app)/(root)/dashboard/page.tsx      → Protected dashboard
(app)/(root)/my-wallets/page.tsx    → Wallet management
(app)/(root)/payment-transfer/page.tsx → Transfer funds
(app)/(root)/transaction-history/page.tsx → Transaction list
(app)/(root)/settings/page.tsx     → User settings
(app)/(admin)/admin/page.tsx       → Admin dashboard
app/page.tsx                       → Landing page
```

2.2 Document each page with:

- Route path
- Server/Client components used
- DAL access patterns
- Server Actions called
- Auth requirements

  2.3 Save to `docs/app-pages.md` in markdownlint format

  2.4 Identify compliance issues:

- Direct DB access in pages (violates DAL-only rule)
- Missing Suspense boundaries
- Missing error boundaries
- Client components that could be server

#### Verification Checklist

- [ ] All 9 pages documented
- [ ] Document includes route, components, DAL, actions
- [ ] Compliance issues identified
- [ ] markdownlint passes on `docs/app-pages.md`

#### Deliverables

- `docs/app-pages.md`

---

### Group 3: Custom Components Documentation

**Phase:** 1 | **Status:** [PENDING] | **Files Affected:** ~60

#### Steps

3.1 List all custom components in `./components/**` excluding `./components/ui/**`:

```
Layout components:
- components/layouts/form/*
- components/layouts/wallet-card.tsx
- components/layouts/home-footer.tsx
- components/layouts/features-grid.tsx

Wrapper components:
- components/dashboard/*
- components/settings/*
- components/transaction-history/*
- components/my-wallets/*
- components/sign-in/*
- components/sign-up/*

Feature components:
- components/sidebar/*
- components/header-box/*
- components/section-cards/*
- components/doughnut-chart/*
- components/animated-counter/*
- components/shared/wallets-overview.tsx

Other:
- components/plaid-link-button/*
- components/nav-secondary/*
- components/plaid-context/*
```

3.2 Categorize by type:

- Layout (reusable shell)
- Feature (domain-specific)
- Utility (helper components)

  3.3 Identify split opportunities:

- Components doing too much
- Duplicate props/patterns
- Could be dynamic/generic

  3.4 Save to `docs/custom-components.md` in markdownlint format

  3.5 Prioritize refactoring by:

- High duplication → High priority
- Complex props → Medium priority
- Single use → Low priority

#### Verification Checklist

- [ ] All custom components listed
- [ ] Categories applied
- [ ] Split candidates identified
- [ ] markdownlint passes

#### Deliverables

- `docs/custom-components.md`

---

### Group 4: Component Implementation

**Phase:** 2 | **Status:** [PENDING] | **Files Affected:** ~20

#### Steps

4.1 Create reusable dynamic generic components in `./components/layouts/`:

- **DynamicCard** — generic card with variants
- **StatBox** — metrics display box
- **SectionHeader** — consistent section headers
- **PageContainer** — common page wrapper with padding
- **AuthForm** — login/register form template

  4.2 Update existing custom components to use new reusable components:

- Update `section-cards.tsx` → use `StatBox`
- Update `header-box.tsx` → use `PageContainer`
- Update any duplicate card implementations

  4.3 Update pages to use new reusable components:

- Update dashboard page → use `PageContainer`
- Update settings page → use layout components
- Update any repeated page structure

  4.4 Validate all reusable components:

- Pass type-check
- Pass lint
- Pass format
- Render correctly in browser

  4.5 Apply DRY principles:

- No duplicate prop drilling
- Shared types in `./types/`
- Shared utils where applicable

#### Verification Checklist

- [ ] 5+ new reusable components created
- [ ] All existing components use new reusable
- [ ] All pages use layout components
- [ ] Pass `npm run format`
- [ ] Pass `npm run type-check`
- [ ] Pass `npm run lint:strict`
- [ ] Visual smoke test passes

#### Deliverables

- New `./components/layouts/*.tsx` files
- Updated existing components
- Updated pages

---

### Group 5: Test Documentation

**Phase:** 2 | **Status:** [PENDING] | **Files Affected:** ~50

#### Steps

5.1 List all tests:

**Vitest Unit Tests (37):**

```
tests/unit/dal/*.test.ts          → 4 tests
tests/unit/actions/*.test.ts    → 8 tests
tests/unit/stores/*.test.ts      → 3 tests
tests/unit/*test.ts            → 20+ tests
tests/integration/*.test.ts    → 1 test
tests/verify/**/*.test.ts      → 2 tests
```

**Playwright E2E Tests (10):**

```
tests/e2e/auth.spec.ts
tests/e2e/dashboard.spec.ts
tests/e2e/my-wallets.spec.ts
tests/e2e/payment-transfer.spec.ts
tests/e2e/transaction-history.spec.ts
tests/e2e/settings.spec.ts
tests/e2e/admin.spec.ts
tests/e2e/wallet-linking.spec.ts
tests/e2e/integration/link-and-transfer.spec.ts
tests/e2e/specs/plaid-script.spec.ts
```

5.2 Categorize tests:

- Unit (fast, isolated, mocked)
- Integration (DB-dependent)
- E2E (full browser, slow)

  5.3 Document helpers:

- `tests/e2e/helpers/*`
- `tests/unit/mocks/*`
- `vitest.config.ts`
- `playwright.config.ts`

  5.4 Save to `docs/test-context.md` in markdownlint format

  5.5 Triage for improvements:

- Skipped tests → remove or fix
- Flaky tests → harden
- Missing coverage → add tests

#### Verification Checklist

- [ ] All 37 unit tests listed
- [ ] All 10 E2E specs listed
- [ ] Test helpers documented
- [ ] markdownlint passes

#### Deliverables

- `docs/test-context.md`

---

### Group 6: Test Enhancement

**Phase:** 2 | **Status:** [PENDING] | **Files Affected:** ~25

#### Steps

6.1 Remove skipped/non-deterministic tests:

- Find all `.skip()` or `it.skip`
- Remove or fix with proper mocking
- Document why skipped if cannot fix

  6.2 Standardize assertions:

- Use `expect().toHaveText()` for text
- Use `expect().toBeVisible()` for visibility
- Use auto-retrying assertions
- Avoid hard-coded waits

  6.3 Make authenticated scenarios deterministic:

- Use seeded test user (mock token)
- Ensure consistent state setup
- Add `test.step()` for clarity
- Follow pattern: `tests/e2e/helpers/plaid.mock.ts`

  6.4 Apply DRY to test helpers:

- Extract common `beforeEach`
- Create shared `testUser` fixture
- Centralize mock configurations

  6.5 Harden both suites:

- Remove timing dependencies
- Add proper cleanup
- Ensure isolation between tests
- Run clean test: `npm run test:browser`

#### Verification Checklist

- [ ] No skipped tests remain
- [ ] All assertions use web-first
- [ ] All auth tests use seeded user
- [ ] Test helpers DRY
- [ ] Pass `npm run test:browser`
- [ ] Pass `npm run test:ui`

#### Deliverables

- Updated `tests/unit/**/*.test.ts`
- Updated `tests/e2e/**/*.spec.ts`
- Updated test helpers

---

### Group 7: Scripts Enhancement - Planning

**Phase:** 2 | **Status:** [PENDING] | **Files Affected:** ~15

#### Steps

7.1 List all TypeScript scripts in `./scripts/**`:

```
scripts/verify-rules.ts              → AST-based rule enforcement
scripts/mcp-runner.ts              → MCP server runner
scripts/mcp-runner-lib.ts          → MCP runner library
scripts/plan-ensure.ts            → Plan validation
scripts/orchestrator.ts           → CI orchestration
scripts/report-parser.ts         → Report parsing
scripts/validate.ts                → Validation runner
scripts/generate-readme.ts         → README generation
scripts/export-data.ts             → Data export
scripts/export-json.ts            → JSON export
scripts/run-verify-and-validate.ts → Combined validation
scripts/verify-agent-iterations.ts → Agent iteration tracking
```

7.2 List all bash/PowerShell/bat scripts:

```bash
scripts/deploy/deploy.sh
scripts/deploy/deploy.bat
scripts/deploy/deploy.ps1
scripts/server/gen-certs.sh
scripts/server/server-setup.sh
scripts/server/vps-setup.sh
scripts/utils/run-ci-checks.sh
scripts/utils/run-ci-checks.bat
scripts/utils/run-ci-checks.ps1
scripts/opencode-plugin-repair.sh
scripts/opencode-plugin-verify.sh
scripts/dev.sh
```

7.3 Identify compliance issues:

- Direct file editing without AST safety (ts-morph)
- No dry-run support
- Missing error handling
- No cross-platform fallback

  7.4 Plan AST-safe improvements:

- Use `ts-morph` for all code transformations
- Add `--dry-run` to all scripts
- Add proper error handling
- Add cross-platform support

#### Verification Checklist

- [ ] All TypeScript scripts listed
- [ ] All shell scripts listed
- [ ] Compliance issues identified
- [ ] AST-safe improvement plan documented

#### Deliverables

- `docs/scripts-audit.md`

---

### Group 8: Scripts Enhancement - Implementation

**Phase:** 3 | **Status:** [PENDING] | **Files Affected:** ~15

#### Steps

8.1 Update all custom TypeScript scripts to be AST-safe (ts-morph):

- `scripts/verify-rules.ts` → Use ts-morph for code analysis
- `scripts/generate-*` → Use ts-morph for code generation
- `scripts/export-*` → Use ts-morph for code extraction

  8.2 Add dry-run functionality to all scripts:

- Add `--dry-run` flag
- Show what would change without applying
- Prompt before applying when running

  8.3 Make bash/powershell/bat pure orchestrators:

- Remove logic from shell scripts
- Move logic to TypeScript
- Shell scripts just call tsx scripts

  8.4 Update package.json scripts accordingly:

```json
{
  "verify:rules": "tsx scripts/verify-rules.ts",
  "verify:rules:dry": "tsx scripts/verify-rules.ts --dry-run"
}
```

8.5 Validate all scripts work:

- Run `npm run verify:rules -- --dry-run`
- Verify no regressions
- Test cross-platform (Windows)

#### Verification Checklist

- [ ] All scripts use ts-morph
- [ ] All scripts support --dry-run
- [ ] Shell scripts are orchestrators only
- [ ] package.json updated
- [ ] Scripts execute without error

#### Deliverables

- Updated `./scripts/*.ts`
- Updated package.json scripts

---

### Group 9: npm Scripts Modification

**Phase:** 3 | **Status:** [PENDING] | **Files Affected:** package.json

#### Steps

9.1 Modify `npm run format` to use platform detection:

- Detect OS in wrapper script
- Use bash on Unix-like
- Fallback to PowerShell on Windows

  9.2 Update all validation scripts:

- `npm run lint` → Add proper error handling
- `npm run type-check` → Add --pretty flag
- `npm run test` → Add proper test isolation
- `npm run build` → Add verbose output

  9.3 Ensure proper error handling:

- Exit codes propagate correctly
- Error messages are actionable
- No silent failures

  9.4 Verify cross-platform compatibility:

- Test on Windows
- Test on macOS (if available)
- Test on Linux (if available)

#### Verification Checklist

- [ ] `npm run format` works on Windows
- [ ] `npm run lint:strict` exits correctly
- [ ] `npm run type-check` shows errors
- [ ] `npm run test` isolates properly

#### Deliverables

- Updated `package.json` scripts

---

### Group 10: MCP Server Management

**Phase:** 3 | **Status:** [PENDING] | **Files Affected:** ~5

#### Steps

10.1 Read existing MCP configuration:

- Check for `.opencode/mcp_servers.json`
- Check for `opencode.json`
- Check for any MCP profiles

  10.2 Run Docker MCP gateway:

- `docker mcp gateway run --profile adminbot`
- Get list of running MCP servers
- Document current state

  10.3 Catalog and compare:

- Docker MCPs running
- Configured MCPs in files
- npx versions available

  10.4 Enhance `scripts/mcp-runner.ts`:

- Add profile management
- Add server discovery
- Add install/uninstall

  10.5 Update `opencode.json`:

- Add all MCP servers
- Remove duplicates
- Keep npx versions preferred

  10.6 Remove duplicate Docker MCPs: - Keep npx versions - Remove Docker-only duplicates - Document which MCPs use Docker

#### Verification Checklist

- [ ] Current MCP state documented
- [ ] Docker MCPs vs npx MCPs compared
- [ ] `opencode.json` updated
- [ ] No duplicate MCPs remain

#### Deliverables

- Updated `.opencode/opencode.json`
- Updated `scripts/mcp-runner.ts`

---

### Group 11: Custom MCP Functions

**Phase:** 3 | **Status:** [PENDING] | **Files Affected:** ~10

#### Steps

11.1 Create custom MCP functions:

| Function               | Purpose                 |
| ---------------------- | ----------------------- |
| `mcp-find`             | Find MCP server by name |
| `mcp-add`              | Install new MCP server  |
| `mcp-remove`           | Uninstall MCP server    |
| `mcp-exec`             | Execute MCP command     |
| `mcp-config-set`       | Update MCP config       |
| `mcp-create-profile`   | Create MCP profile      |
| `mcp-activate-profile` | Switch profiles         |
| `code-mode`            | Set code mode           |
| `mcp-discover`         | List available MCPs     |

11.2 Create adminbot profile: - Use `mcp-create-profile adminbot` - Configure preferred MCPs - Use `mcp-activate-profile adminbot`

11.3 Remove specified MCP servers: - Use `mcp-remove <server-name>` - Document removals

11.4 Install remote npx versions: - Use `mcp-runner.ts` - Document installations

#### Verification Checklist

- [ ] 9 custom MCP functions available
- [ ] adminbot profile created
- [ ] Duplicate MCPs removed
- [ ] npx versions installed

#### Deliverables

- Custom MCP functions in `scripts/mcp-*.ts`
- Updated `mcp-runner.ts`

---

### Group 12: Documentation Sync

**Phase:** 3 | **Status:** [PENDING] | **Files Affected:** ~5

#### Steps

12.1 Read and update `init-enhanced.md`:

- Check current state
- Identify gaps
- Update accordingly

  12.2 Create comprehensive documentation sync:

- All agentic tools documented
- Cross-references complete
- Examples updated

  12.3 Use question tool to ask clarifying:

- Ask maintainers about priority
- Ask about timeline
- Ask about blockers

  12.4 Collect actionable issues:

- Document for maintainers
- Create follow-up issues
- Assign priorities

#### Verification Checklist

- [ ] `init-enhanced.md` updated
- [ ] All agentic tools documented
- [ ] Cross-references working
- [ ] Actionable issues logged

#### Deliverables

- Updated `docs/init-enhanced.md`
- Issue list for maintainers

---

## Implementation Sequence

### Recommended Order

1. **Start with Pages** (Group 2) — understand route layouts
2. **Then Components** (Group 3-4) — build reusable after knowing needs
3. **Then Actions/DALs** (Group 1) — fix foundation before tests
4. **Then Tests** (Group 5-6) — tests reflect current state
5. **Then Scripts** (Group 7-9) — tooling improvements
6. **Then MCP** (Group 10-11) �� final integration
7. **Then Documentation** (Group 12) — sync last

### Per PR Flow

For each task group:

1. **Branch per group**: `refactor/group-{N}-{name}`
2. **Implementation in group**
3. **Validation**: `npm run format && npm run type-check && npm run lint:strict`
4. **Test**: `npm run test` (if affected)
5. **PR**: Link to this plan, request review

---

## Quality Gates

All groups must pass:

- [ ] `npm run format` — Prettier formatting
- [ ] `npm run type-check` — TypeScript strict
- [ ] `npm run lint:strict` — Zero warnings
- [ ] `npm run test` — All tests pass
- [ ] No skipped tests (Group 6)
- [ ] All auth tests use seeded user (Group 6)
- [ ] DRY principles applied (Groups 1, 4, 6, 8)

---

## References

- **AGENTS.md** — canonical agent rules
- `.opencode/instructions/00-default-rules.md` — default commands
- `.opencode/instructions/plan-workflow.md` — plan standards
- `.opencode/instructions/01-core-standards.md` — code style
- `.opencode/instructions/02-nextjs-patterns.md` — Server Actions pattern

---

## Notes

- This is a large refactoring; take it incrementally
- Each group = one PR = safer delivery
- Run validation after each group
- Update this plan as you learn more
- Ask clarifying questions early

---

## Related Plans

- None currently — this plan is self-contained

---

\_Last updated: 2026-04-24_rettier formatting

- [ ] `npm run type-check` — TypeScript strict
- [ ] `npm run lint:strict` — Zero warnings
- [ ] `npm run test` — All tests pass
- [ ] No skipped tests (Group 6)
- [ ] All auth tests use seeded user (Group 6)
- [ ] DRY principles applied (Groups 1, 4, 6, 8)

---

## References

- **AGENTS.md** — canonical agent rules
- `.opencode/instructions/00-default-rules.md` — default commands
- `.opencode/instructions/plan-workflow.md` — plan standards
- `.opencode/instructions/01-core-standards.md` — code style
- `.opencode/instructions/02-nextjs-patterns.md` — Server Actions pattern

---

## Notes

- This is a large refactoring; take it incrementally
- Each group = one PR = safer delivery
- Run validation after each group
- Update this plan as you learn more
- Ask clarifying questions early

---

## Related Plans

- None currently — this plan is self-contained

---

_Last updated: 2026-04-24_ _Last updated: 2026-04-24_
