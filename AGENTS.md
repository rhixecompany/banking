# AGENTS.md — Banking Project (Concise agent guide)

Version: 4.1 | Last Updated: 2026-04-14

Purpose

This is the minimal, high-signal reference for automated agents (and humans) working in this repo. Only include facts an agent would likely miss by default. When in doubt, consult the executable sources-of-truth listed below.

Top sources-of-truth (check these first)

- package.json — scripts and exact commands (single source for what CI runs)
- eslint.config.mts — lint rules that block PRs
- app-config.ts / lib/env.ts — validated environment variables (do NOT read process.env directly)
- database/schema.ts — canonical DB types and constraints
- scripts/validate.ts — canonical repo validation tool used by CI
- tests/ and Playwright config — test ordering and E2E expectations

Quick start facts an agent will miss

- Install: npm install
- Dev server: npm run dev (predev hook runs npm run clean first)
- Build: npm run build (prebuild runs clean + type-check)
- Validate (CI gate): npm run validate (runs `npx tsx scripts/validate.ts --all && npm run build && npm run lint:strict && npm run test`)
- Format: npm run format
- Typecheck: npm run type-check

Non-obvious script behaviors

- npm run dev and npm run build set NODE_OPTIONS to increase memory — run via npm scripts to preserve those flags.
- Many helper scripts are Bash (scripts/\*.sh) or TypeScript under scripts/; on Windows use WSL / Git Bash or run TS scripts via npx tsx. Prefer the package.json scripts rather than invoking internals.
- Destructive or infra scripts must support --dry-run and follow scripts/ patterns (see .opencode/instructions/12-scripts-patterns.md). Do NOT run destructive scripts without explicit human approval and RUN_DESTRUCTIVE=true + --yes.

PR gating & required checks (always run locally before proposing changes)

- npm run format
- npm run type-check (must have ZERO TypeScript errors)
- npm run lint:strict (must produce ZERO ESLint warnings)
- npx tsx scripts/validate.ts --all
- npm run test (note: runs E2E then unit tests)

Testing gotchas (important)

- Test order is deliberate: npm run test runs E2E (Playwright) first, then Vitest unit tests. Do not reorder in CI.
- Run E2E with: npm run test:ui (this sets PLAYWRIGHT_PREPARE_DB=true). Ensure port 3000 is free before running Playwright (Windows: free the port or run inside CI/WSL).
- Playwright is configured to run chromium only and uses a single worker (stateful). Treat Playwright runs as serial and stateful.

DB & migrations

- Use drizzle-kit scripts from package.json: npm run db:generate, npm run db:push, npm run db:migrate, npm run db:seed. Use db:reset for full reset (drop+generate+push).
- All DB access must go through dal/ helpers. Do not run queries in components or Server Actions directly.
- Avoid N+1 queries: prefer JOINs or eager loaders; if you need multiple queries batch them using IN.

Server Actions / Mutations (required pattern)

- Location: actions/ (Server Actions are the canonical place for stateful writes)
- Always at the top of the file: "use server";
- Validate input with Zod. EVERY schema field must include .describe("...") and validators must include explicit error messages (zod rules are enforced by ESLint).
- Auth first: call auth() at the start of protected actions and return { ok: false, error: 'Unauthorized' } if missing.
- Use DAL for DB writes; accept an optional tx for transactions and use db.transaction(...) for atomic multi-step ops.
- Invalidate caches after mutations using next/cache APIs: revalidatePath(), revalidateTag(), updateTag(), refresh().
- Return shape: Promise<{ ok: boolean; error?: string }>.

Type & lint rules agents often miss

- NO use of `any` in committed code. Use unknown + type guards or proper types. PRs block on this.
- Exports (especially public helpers) should have explicit return types.
- Zod schemas: .describe() required on every field (ESLint enforces zod/prefer-meta and zod/require-error-message).

Next.js / App Router specifics (v16+)

- Next.js 16: params and searchParams are async (must await them in pages/layouts/generateMetadata and page handlers).
- Server Components by default. Mark client components with "use client" when you need hooks, state, or browser APIs.
- Use Suspense boundaries for async auth/cookies/headers to avoid blocking routes (see .opencode/instructions/02-nextjs-patterns.md and suspense-skill).
- Use Cache Components when appropriate: add "use cache" at top of cacheable components (Partial Pre-Rendering / PPR). Use next/cache APIs for tag-based invalidation.

Where agents should look first when investigating a problem

1. package.json — exact scripts and CI commands
2. scripts/validate.ts and .opencode/instructions/\*\* — repo-specific validation and agent rules
3. eslint.config.mts — lint blocks that will fail PRs
4. app-config.ts / lib/env.ts — env validation and where secrets are read
5. database/schema.ts and dal/ — DB shape and DAL conventions
6. tests/ (Playwright + Vitest) — test order and fixtures

Change-management rules (must-follow)

- If a change touches > 3 files: create a plan in .opencode/plans/<short>\_<id>.plan.md BEFORE coding. Plan must include Goals, Scope, Target Files, Risks, Validation, Rollback.
- Attach the outputs of these checks to the plan: npx tsx scripts/validate.ts --all ; npm run type-check ; npm run lint:strict ; (optional) npm run test
- Destructive edits (migrations, file deletions, seeding, revealing secrets): require RUN_DESTRUCTIVE=true plus explicit --yes and a human approver.

Agent operational safety (short checklist)

- DO NOT push commits or create PRs without explicit human approval. Agents may prepare patches/commits locally for review but must not push.
- Before asking to push or open a PR, verify the plan (if >3 files) and that all checks above pass.
- Never surface or commit secrets (.env, tokens). Use app-config.ts / lib/env.ts for runtime secret access.

Quick examples (copy-paste)

- Run full validation locally: npx tsx scripts/validate.ts --all
- Run type-check + strict lint: npm run type-check && npm run lint:strict
- Run E2E only (with DB prep): npm run test:ui
- Run unit tests only: npm run test:browser

If something is ambiguous

- Prefer executable sources over prose. If docs conflict with package.json / scripts / eslint.config.mts, trust package.json and follow CI commands.
- If you cannot determine an important convention from the repo, ask one short question to a human reviewer before making changes.

Relevant files to review for any non-trivial change

- package.json, scripts/validate.ts, eslint.config.mts, app-config.ts, lib/env.ts, database/schema.ts, dal/, actions/, .opencode/instructions/

Minimal evidence map

- For any new normative claim added to this file, include a pointer in docs/evidence_map.md (file:line).
