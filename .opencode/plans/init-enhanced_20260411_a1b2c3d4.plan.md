# Init-Enhanced Plan

## Goals

- Produce an auditable, implementation-ready plan to sync repository documentation with source code and capture actionable issues for maintainers.
- Run a read-only discovery pass and capture findings.
- Prepare a prioritized issue catalog and small, safe fixes (prepared as patches) and request approval per logical fix before applying.

## Scope

- Read-only discovery across the repository to identify Zod schemas, Server Actions, DAL patterns (N+1), Auth usage, and references to bank/webhook fields.
- Capture baseline validation outputs (format, type-check, lint:strict, unit tests) when authorized.
- Prepare minimal code-fix patches for low-risk items (Zod descriptions, Server Action guards, DAL N+1 fixes). Patches are NOT applied without explicit approval.
- Do NOT run E2E (Playwright) or apply DB migrations without separate explicit approval.

## Target Files / Patterns

- Config / authoritative: package.json, AGENTS.md, app-config.ts, lib/env.ts, types/next-auth.d.ts
- Auth: lib/auth.ts, lib/auth-options.ts, app/api/auth/\*\*, proxy.ts
- Server Actions: actions/** (preferred). Legacy `lib/actions/**` references may remain and are flagged for review.
- DAL / DB: dal/**, database/**, database/schema.ts
- Zod schemas: files containing z.object, z.enum, z.array
- Tests: tests/\*\* (vitest + Playwright configs)
- Docs & rules: .opencode/**, .cursor/**, docs/\*\*, README.md

Search patterns used during discovery (examples):

- rg -n "z\.object\(|z\.enum\(|z\.array\(" --hidden --glob '!.git'
- rg -n '"use server"' --hidden --glob 'actions/**' --glob 'lib/actions/**'
- rg -n 'db\.' --hidden --glob 'lib/\*\*'
- rg -n 'for\s\*\(|forEach\(|\.map\(' --hidden lib
- rg -n 'sharableId|fundingSourceUrl|webhook' --hidden

## Risks

- Running validations may fail because environment variables are missing; I will not add secrets or change envs.
- E2E tests depend on port 3000 and secrets — excluded unless you permit them and provide envs.
- DAL changes (N+1 fixes) can change query shapes and require careful verification.

## Planned Changes (High Level)

PHASE 1 — Discovery (read-only)

- Run Glob + ripgrep searches and collect results into docs/init-enhanced-discovery/
- Produce a short summary (docs/init-enhanced-discovery.md) with counts, representative files, and recommended next actions.

PHASE 2 — Validations (on approval)

- Capture outputs for: format:check, type-check, lint:strict, and unit tests (npm run test:browser).
- Save outputs to docs/validation-outputs/.

PHASE 3 — Issue Catalog

- Produce docs/init-enhanced-issue-catalog.md listing issues with severity, files, and minimal fixes.

PHASE 4 — Checkpoint docs commit

- Create a single docs-only commit containing the plan and discovery + validation outputs (only after you request a commit).

PHASE 5 — Iterative code fixes (Hybrid — approval required per logical fix)

- For each logical fix: prepare a minimal patch; request your approval; on approval apply patch and run focused validation (type-check + lint + related unit tests).

PHASE 6 — Final validation & report

- Re-run validations, optionally run E2E on separate approval, and publish docs/init-enhanced-report.md with results and rollback instructions.

## Validation

- Validation steps (captured when you approve Phase 2):
  - npm run format:check
  - npm run type-check
  - npm run lint:strict
  - npm run test:browser

## Rollback or Mitigation

- Each logical-fix commit is small and reversible via git revert <sha> if needed.
- For any DB schema changes, a rollback (down migration) and backfill plan will be required before applying.

## User-selected options (recorded)

- Plan saved to: .opencode/plans/init-enhanced_20260411_a1b2c3d4.plan.md
- Validations allowed (later): format, type-check, lint:strict, unit tests (no E2E for now)
- Code-fix approach: Hybrid — prepare patches and request approval per logical fix
- Commit strategy: One checkpoint docs commit, then one commit per fix
- Branch strategy: Use current branch (no new branch creation)
- Approval granularity: Approve each logical fix (may span multiple files)

---

Next action (I performed Phase 1 discovery after saving this plan):

- discovery outputs are in docs/init-enhanced-discovery/

When you're ready, approve: "Run Phase 2 validations" or request the first prepared patch for review.
