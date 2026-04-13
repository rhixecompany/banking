# AGENTS.md — Banking Project (Canonical Agent Guide)

Version: 4.0 | Last Updated: 2026-04-13

Purpose

This file is the canonical guide for human contributors and automated agents operating on this repository. It prioritizes executable sources-of-truth and documents the exact project conventions, PR-blocking rules, and workflows agents and humans must follow. When docs conflict with code, prefer executable sources of truth (package.json, eslint.config.mts, app-config.ts / lib/env.ts, database/schema.ts, tests/).

Core principles

- App Router & Server Components first (Next.js 16+)
- Data access centralized in dal/
- Mutations via Server Actions (actions/)
- Strict type safety (no any) and Zod validation with .describe() metadata
- Zero ESLint warnings in CI (npm run lint:strict)

Must-know commands (source: package.json)

- npm run dev — Start dev server (predev runs clean)
- npm run build — Production build (prebuild runs clean + type-check)
- npm run start — Start production server
- npm run clean — Clean build artifacts
- npm run validate — build + lint:strict + test (CI gate)
- Scripts policy: See .opencode/instructions/12-scripts-patterns.md — agents must prefer TypeScript scripts in scripts/, always run --dry-run first, and never execute destructive scripts without explicit human approval (RUN_DESTRUCTIVE=true).
- npm run lint:strict — ESLint with ZERO warnings required for PRs
- npm run type-check — TypeScript type checking (tsc --noEmit)
- npm run test — Runs test:ui THEN test:browser (order matters)
- npm run test:ui — Playwright E2E (Chromium, 1 worker); ensure port 3000 free
- npm run test:browser — Vitest unit tests (happy-dom)

Sources of truth (in priority)

1. package.json — scripts and developer commands
2. eslint.config.mts — lint rules and critical enforcement
3. app-config.ts / lib/env.ts — environment validation
4. database/schema.ts — canonical DB types and columns
5. tests/ — test ordering and assumptions

PR-blocking rules (enforced)

1. No use of any — use unknown + type guards (TypeScript strictly enforced)
2. Zero TypeScript errors (npm run type-check) and ZERO ESLint warnings (npm run lint:strict)
3. All DB access must go through dal/ — never query DB from components or Server Actions directly
4. Avoid N+1 queries — use JOINs or eager loading helpers in DALs
5. All stateful writes must be implemented as Server Actions in actions/
6. Never commit secrets (.env, tokens). Use lib/env.ts or app-config.ts to access env values in app code

Server Actions — required pattern

All mutations must follow this pattern:

- Include "use server" at top
- Validate inputs with Zod (schemas must include .describe() for every field and explicit error messages)
- Call auth() first in protected actions; return { ok: false, error: 'Unauthorized' } if missing
- Use DAL helpers for DB writes; accept optional tx for transactions
- After success, revalidate or update cache tags using next/cache APIs (revalidatePath, revalidateTag, updateTag, refresh)
- Return Promise<{ ok: boolean; error?: string }>

Example Server Action

```ts
"use server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

const UpdateSchema = z.object({
  id: z.string().uuid().describe("Entity ID"),
  name: z.string().min(1, "Name required").describe("Name")
});

export async function updateEntity(
  input: unknown
): Promise<{ ok: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user) return { ok: false, error: "Unauthorized" };

  const parsed = UpdateSchema.safeParse(input);
  if (!parsed.success)
    return { ok: false, error: parsed.error.message };

  // call DAL to update entity
  revalidatePath("/entities");
  return { ok: true };
}
```

Data Access Layer (DAL) patterns

- Centralize DB logic in dal/ helpers (export instances or classes). Do not perform DB queries inside components or Server Actions directly.
- Avoid N+1 queries: prefer single SELECT with JOINs or .with() eager loaders. If multiple queries are required, batch them using IN or optimized queries.
- Use db.transaction(...) for multi-step operations that must be atomic

Zod & validation

- All Zod schemas used in Server Actions and public inputs MUST include .describe(...) metadata and explicit validator error messages (zod/prefer-meta and zod/require-error-message rules)
- Avoid z.any(); zod/no-any-schema is enforced

Next.js / App Router conventions

- Use Server Components by default; mark client components with "use client"
- In Next.js 16+, params and searchParams are async; always await them in pages/layouts/generateMetadata
- Use the new "use cache" directive for Cache Components that benefit from PPR
- Implement loading.tsx and error.tsx route-level boundaries

Caching & invalidation

- Use next/cache APIs for granular invalidation: revalidatePath, revalidateTag, updateTag, refresh
- When fetching server-side, set fetch(..., { next: { revalidate: <seconds>, tags: ["tag"] } }) as appropriate

Testing guidance

- Test order: E2E (Playwright) first (npm run test:ui), then unit/integ (Vitest) (npm run test:browser)
- Playwright tests run with 1 worker and Chromium only — ensure port 3000 is free before running E2E
- Use deterministic auth fixtures and test-only endpoints gated by NODE_ENV !== 'production' and ENABLE_TEST_ENDPOINTS

Documentation & plans

- When a change touches more than 3 files create a plan in .opencode/plans/ with Goals, Scope, Target Files, Risks, Planned Changes, Validation, and Rollback
- For any normative claim in AGENTS.md include an evidence pointer in docs/evidence_map.md (file:line)

Formatting & linting

- Run npm run format and npm run lint:strict before opening PRs
- Avoid inline eslint-disable comments; prefer file-level overrides in eslint.config.mts where justified

Operational safety (agents)

- Agents MUST NOT push commits or create PRs without explicit human approval.
- Agents MAY apply working-tree edits directly and MAY create local commits, provided they follow the safety checklist below before any push:
  1. If changes touch more than 3 files, create a plan file in `.opencode/plans/` describing Goals, Scope, Target Files, Risks, Planned Changes, Validation, and Rollback.
  2. Run the validation commands and attach logs to the plan: `npx tsx scripts/validate.ts --all`, `npm run type-check`, and `npm run lint:strict`.
  3. If edits are destructive (file deletions, database migrations, or revealing secrets), require both `RUN_DESTRUCTIVE=true` and an explicit `--yes` flag to execute those operations.
  4. Do NOT push or open a PR until a human reviewer approves the plan and the staged changes.
- Agents may prepare patches or working-tree edits for review, but must wait for human approval to push to remote when the safety checklist is not satisfied.

Quick references

- package.json, eslint.config.mts, app-config.ts, lib/env.ts, database/schema.ts, dal/, actions/, .opencode/, tests/

Evidence & audit

See docs/evidence_map.md for the mapping of claims to file:line evidence used to prepare this AGENTS.md \
Changelog pointer: previous AGENTS.md preserved at commit: (will be filled with git commit hash on finalization)
