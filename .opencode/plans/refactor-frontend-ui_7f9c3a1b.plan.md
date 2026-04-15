---
# Refactor Frontend UI & Infra — Plan

ID: refactor-frontend-ui_7f9c3a1b
Date: 2026-04-13
Author: automated-agent

## Summary

This plan implements the 13-step refactor and hardening requested by the owner. It covers auditing and enhancing the DB schema, Actions, Zod schemas, DALs, pages, components, tests, Plaid integration, and scripts. The plan is staged into phases with explicit tasks, personas, prompts, code samples, and file references. It uses a safe, non-breaking migration strategy (dual-write, backfill, cleanup) and preserves deterministic E2E tests.

Decision highlights already made:
- Plaid item_id will be stored in a normalized table `plaid_items` (separate table). This supports multiple wallets per Plaid Item and simplifies token management.
- Use current working tree for cross-references and audits.
- Normalize DB column names to snake_case via staged dual-write migrations.

## Goals

- Primary: Make the frontend UI and backend access patterns robust, DRY, type-safe, and testable.
- Secondary: Remove flaky tests, fix Plaid duplicate script issue, and make scripts AST-safe with dry-run support.

## Phases & Tasks

Phase 1 — Preparation & Environment (IMPLEMENT NOW)
- Persona: Architect (audit lead) and Implementer (executor)
- Outcome: Produce and persist a complete plan file, produce docs/db-schema-audit.md, confirm local test DB, snapshot working tree, and prepare staging branch for changes.

Tasks:
- 1.1 Confirm local Postgres and seed status (User confirmed: local Postgres ready and seeded).
  - Persona: Implementer
  - Prompt: "Verify local Postgres is running, .env.local contains connection string, and seed script has been executed. Report connection URL (masked) and confirm seeds." 

- 1.2 Save comprehensive plan (this file) to `.opencode/plans/refactor-frontend-ui_7f9c3a1b.plan.md` and create initial audit artifacts.
  - Persona: Architect
  - Prompt: "Create and save a plan file that includes phases, tasks, code samples, and file references for the frontend refactor and DB migrations. Use current working tree." 

- 1.3 Persist DB schema audit to `docs/db-schema-audit.md` (drafted and saved in this run).
  - Persona: Architect
  - Prompt: "Write the DB schema audit report (cross-referenced with DALs and seed scripts) to docs/db-schema-audit.md. Include findings, recommended fixes, migration strategy, and sample SQL/Drizzle snippets." 

- 1.4 Create a feature branch (recommended) or stage commits under current branch. (Manual step; ask before pushing.)
  - Persona: Implementer
  - Prompt: "Create a git branch `feat/refactor-frontend-ui/<id>` and stage plan + docs files. Do not push until reviewed." 

Phase 2 — Schema Audit (COMPLETE — report saved)
- Persona: Architect
- Outcome: `docs/db-schema-audit.md` saved and cross-referenced.

Phase 3 — Schema Migration Plan (PLANNED)
- Persona: Architect + Implementer
- Outcome: Add `plaid_items` table, item_id indices, and normalize column names via dual-write/backfill/remove steps.

Phase 4 — Actions/Zod/DAL Audit (PLANNED)
- Persona: Architect
- Outcome: `docs/actions-dal-audit.md` listing nonconformant files with line references.

Phase 5 — Apply DAL/Actions/Zod fixes (PLANNED)
- Persona: Implementer

Phase 6 — Pages & Components Inventory (PLANNED)
- Persona: Implementer

Phase 7 — UI Refactor into reusable components (PLANNED)
- Persona: Implementer

Phase 8 — Tests Audit & Hardening (PLANNED)
- Persona: Implementer

Phase 9 — Plaid Embed Fix (PLANNED)
- Persona: Implementer

Phase 10 — Scripts Hardening (PLANNED)
- Persona: Implementer

Phase 11 — Validation CI & PRs (PLANNED)

Phase 12 — Rollout & Monitoring (PLANNED)

## Phase 1 Implementation Steps (Detailed)

Step 1.1 Confirm Local Postgres (done by user)
- Evidence: Playwright global-setup previously failed against remote Neon. User confirmed local Postgres is ready and seeded.

Step 1.2 Save Plan & Audit Artifacts (this patch)
- Files created by this phase (this commit):
  - .opencode/plans/refactor-frontend-ui_7f9c3a1b.plan.md (this file)
  - docs/db-schema-audit.md (created in this patch)

Step 1.3 Snapshot Working Tree
- Command to run locally (implementer):
  - git status --porcelain
  - git rev-parse --abbrev-ref HEAD

Step 1.4 Branching recommendation
- Create branch: `git checkout -b feat/refactor-frontend-ui/7f9c3a1b`

## New Information & Findings (extracted)
- Plaid item storage: chosen to use a separate `plaid_items` table (normalized) — supports multiple wallets per item.
- Naming: normalize DB column names to snake_case with dual-write migration approach.
- FK policy: recommend `ON DELETE SET NULL` for ledger-preserving refs (transactions -> wallets) and `ON DELETE CASCADE` for session-like cleanup (sessions, accounts).

## Code Samples (Phase 1 references)

Drizzle migration SQL (add plaid_items)
```sql
-- database/drizzle/20260413_add_plaid_items.sql
CREATE TABLE plaid_items (
  id text PRIMARY KEY,
  item_id varchar(255) NOT NULL,
  access_token_encrypted text NOT NULL,
  created_at timestamp DEFAULT now() NOT NULL,
  updated_at timestamp DEFAULT now() NOT NULL
);
CREATE INDEX plaid_items_item_id_idx ON plaid_items(item_id);
```

Dual-write DAL pattern (example)
```ts
// dal/wallet.dal.ts (create)
const row = {
  account_id: input.accountId,
  item_id: input.itemId ?? null,
  user_id: input.userId,
  // legacy camelCase for transition window (write both)
  accountId: input.accountId,
  itemId: input.itemId ?? null,
};
await db.insert(wallets).values(row).returning();
```

Server Action template (Zod + auth)
```ts
"use server";
import { z } from "zod";
import { auth } from "@/lib/auth";

const Schema = z.object({
  userId: z.string().uuid().describe("User ID"),
}).describe("Example input");

export async function exampleAction(input: unknown): Promise<{ ok: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user) return { ok: false, error: "Unauthorized" };
  const parsed = Schema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.message };

  // ... action logic
  return { ok: true };
}
```

## File references for Phase 1 work
- database/schema.ts
- scripts/seed/seed-data.ts
- components/plaid-context/plaid-context.tsx
- components/plaid-link-button/plaid-link-button.tsx
- tests/e2e/helpers/auth.ts

## Risks & Mitigations (Phase 1)
- Risk: Plan file touches docs and config only — low risk. Migrations will be staged.
- Mitigation: dual-write plan for DB renames; test migrations locally before remote.

## Next Steps after Phase 1 (explicit)
1. Confirm choices for FK delete policy (single choice).
2. Approve implementation: I will generate migration scripts and start implementing Phase 3 changes in small PRs.

---
