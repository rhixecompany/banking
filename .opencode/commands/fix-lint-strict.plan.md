---
status: not-started
phase: 1
updated: 2026-04-23
---

# Implementation Plan

## Goal

Eliminate all production-code lint warnings (app/, lib/, dal/, actions/, components/) from `npm run lint:strict`, document test/JSDoc exceptions, and achieve verify:rules critical=0.

## Context & Decisions

| Decision | Rationale | Source |
| --- | --- | --- |
| Option B: Zero production-code warnings + documented test/JSDoc exceptions | AGENTS.md pattern — `lint:strict` is for production code quality; tests/JSDoc acceptable to leave with documented exceptions | `m0023` |
| Option A: Approve plan file creation and multi-file sweep | Multiple files will be changed; repo policy requires `.opencode/commands/` plan file before multi-file implementation | `m0024` |
| Areas to avoid: scripts/seed/run.ts (intentional env exception), database/migrations/, .next/, build artifacts | AGENTS.md and .cursor rules define intentional exceptions | `m0025` |
| Option B: App/lib first → scripts → components → tests | Production-first review order; highest-risk parts first for faster feedback | `m0026` |
| Reviewers: rhixecompany, alexa | CODEOWNERS not configured; any contributor can review | `m0032` |
| verify:rules uses CI mode JSON at `.opencode/reports/rules-report.json` | scripts/verify-rules.ts output format; CI gate requires machine-readable report | `m0005` |
| ESLint --fix for auto-fixes, manual edits for rules violations | ESLint handles mechanical patterns; manual fixes needed for process.env, server-action issues | `m0020` |
| Small commits with provenance lines per AGENTS.md | Automated edits require one-line provenance in commit/PR body | `m0007` |
| PR ordering: app/lib → scripts → components → tests | Production-first for faster review and reduced risk per Q4 | `m0026` |

## Phase 1: Audit & Triage [PENDING]

- [ ] 1.1 Run `npm run verify:rules -- --ci --output .opencode/reports/rules-report.json` and capture output
- [ ] 1.2 Read `.opencode/reports/rules-report.json` and classify all findings into buckets:
  - Bucket A: production-critical (direct process.env in app/, any in production, server-action violations)
  - Bucket B: production-warn (JSDoc issues, missing returns, type issues in app/, lib/, dal/, actions/, components/)
  - Bucket C: scripts-infra (ESLint issues in scripts/)
  - Bucket D: test-JSDoc (test files and JSDoc warnings — acceptable to document)
- [ ] 1.3 Create triage summary (file count per bucket, rule types, recommended fix per item)
- [ ] 1.4 Identify files needing manual fixes vs auto-fix

## Phase 2: Production-Code Fixes — app/lib/dal/actions/components [PENDING]

- [ ] 2.1 Fix Bucket A critical violations (direct process.env usage in app/ or lib/ — replace with app-config.ts or lib/env.ts)
- [ ] 2.2 Fix `any` usage in production code (replace with unknown + type guards or explicit types)
- [ ] 2.3 Fix server-action contract violations (missing auth(), Zod validation, return shape issues in actions/)
- [ ] 2.4 Fix Bucket B warnings: missing returns, type issues, JSDoc in app/, lib/, dal/, actions/, components/
- [ ] 2.5 Run `npm run type-check` and fix any new type errors
- [ ] 2.6 Run `npm run lint:strict` locally and confirm production warnings removed

## Phase 3: Scripts & Infra Fixes [PENDING]

- [ ] 3.1 Apply `eslint --fix` on scripts/ directory (mechanical fixes — null→undefined, console→logger, etc.)
- [ ] 3.2 Fix any remaining manual violations in scripts/ (empty blocks, fallthrough, etc.)
- [ ] 3.3 Run `npm run type-check` and fix any new type errors
- [ ] 3.4 Run `npm run lint:strict` locally and confirm script warnings removed

## Phase 4: Component Fixes [PENDING]

- [ ] 4.1 Fix lint warnings in components/ (null→undefined, type issues, JSDoc)
- [ ] 4.2 Run `npm run type-check` and `npm run lint:strict` locally
- [ ] 4.3 Confirm component warnings removed

## Phase 5: Test/JSDoc Documentation [PENDING]

- [ ] 5.1 Document accepted test/JSDoc warnings in PR description (list files, rule types, justification)
- [ ] 5.2 Apply targeted test fixes where trivial (null→undefined, ==→===)
- [ ] 5.3 Add targeted `eslint-disable` comments with justification comments where patterns are acceptable in tests
- [ ] 5.4 Document all eslint-disable uses with removal criteria in PR description

## Phase 6: CI Validation & PRs [PENDING]

- [ ] 6.1 Run full CI gate locally: `npm run format && npm run type-check && npm run lint:strict && npm run verify:rules -- --ci`
- [ ] 6.2 Confirm verify:rules critical=0 in `.opencode/reports/rules-report.json`
- [ ] 6.3 Create PRs in order: Phase 2 → Phase 3 → Phase 4 → Phase 5
- [ ] 6.4 Request review from rhixecompany and alexa (per Q5)
- [ ] 6.5 After PR approvals, merge in order and run final CI validation

## Notes

- 2026-04-23: Plan created based on 5 clarifying questions answered by user `m0032`
- Exclusions: scripts/seed/run.ts (intentional exception per AGENTS.md), database/migrations/, .next/, build artifacts
- Auto-generated files (codemap.md) excluded unless manually edited
- Provenance lines required in all commits per AGENTS.md small-change policy
- Test/JSDoc warnings acceptable to document per Option B answer `m0023`

## PR Grouping (per Q4: Option B — production-first)

| PR | Files | Priority | Rationale |
| --- | --- | --- | --- |
| PR-1 | app/, lib/, dal/, actions/ | HIGH | Production code first — highest risk |
| PR-2 | scripts/ | HIGH | Infra/build scripts |
| PR-3 | components/ | MEDIUM | UI components |
| PR-4 | tests/ | LOW | Test files — document exceptions |

## Acceptance Criteria

- verify:rules critical = 0
- npm run lint:strict: no errors in app/, lib/, dal/, actions/, components/
- npm run type-check: PASS
- All commits include provenance lines (files read + reason)
- PRs reviewed by rhixecompany and alexa

## Todo List

```json
[
  {
    "id": "1.1",
    "title": "Run verify:rules CI and capture JSON",
    "status": "pending"
  },
  {
    "id": "1.2",
    "title": "Read rules-report.json and triage findings",
    "status": "pending"
  },
  {
    "id": "1.3",
    "title": "Create triage summary",
    "status": "pending"
  },
  {
    "id": "1.4",
    "title": "Identify auto vs manual fix files",
    "status": "pending"
  },
  {
    "id": "2.1",
    "title": "Fix process.env in app/lib (use app-config.ts)",
    "status": "pending"
  },
  {
    "id": "2.2",
    "title": "Fix any in production code",
    "status": "pending"
  },
  {
    "id": "2.3",
    "title": "Fix server-action violations",
    "status": "pending"
  },
  {
    "id": "2.4",
    "title": "Fix Bucket B warnings in production code",
    "status": "pending"
  },
  { "id": "2.5", "title": "Run type-check", "status": "pending" },
  {
    "id": "2.6",
    "title": "Confirm production lint clean",
    "status": "pending"
  },
  {
    "id": "3.1",
    "title": "Apply eslint --fix on scripts/",
    "status": "pending"
  },
  {
    "id": "3.2",
    "title": "Fix remaining script violations",
    "status": "pending"
  },
  {
    "id": "3.3",
    "title": "Run type-check for scripts/",
    "status": "pending"
  },
  {
    "id": "3.4",
    "title": "Confirm scripts lint clean",
    "status": "pending"
  },
  {
    "id": "4.1",
    "title": "Fix component lint warnings",
    "status": "pending"
  },
  {
    "id": "4.2",
    "title": "Run type-check and lint for components/",
    "status": "pending"
  },
  {
    "id": "4.3",
    "title": "Confirm component warnings removed",
    "status": "pending"
  },
  {
    "id": "5.1",
    "title": "Document test/JSDoc exceptions in PR",
    "status": "pending"
  },
  {
    "id": "5.2",
    "title": "Apply targeted test fixes",
    "status": "pending"
  },
  {
    "id": "5.3",
    "title": "Add eslint-disable with justification",
    "status": "pending"
  },
  {
    "id": "5.4",
    "title": "Document all eslint-disable uses",
    "status": "pending"
  },
  { "id": "6.1", "title": "Run full CI gate", "status": "pending" },
  {
    "id": "6.2",
    "title": "Confirm critical=0 in verify:rules",
    "status": "pending"
  },
  {
    "id": "6.3",
    "title": "Create PRs in order",
    "status": "pending"
  },
  {
    "id": "6.4",
    "title": "Request review from rhixecompany, alexa",
    "status": "pending"
  },
  {
    "id": "6.5",
    "title": "Merge and final CI validation",
    "status": "pending"
  }
]
```
