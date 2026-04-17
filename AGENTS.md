# AGENTS — Canonical Agent Guidance

Read this first. This file is the single canonical reference for automated agents working in this repository.

Purpose

- Provide a single authoritative policy for agent contributors (Copilot, Cursor, OpenCode and other automation).
- Be conservative: prefer small, auditable, reversible changes.
- Every change must include provenance: files read + one-line reason.

Quick Commands (exact)

- Dev: npm run dev
- Typecheck: npm run type-check
- Lint (strict): npm run lint:strict
- Format: npm run format
- Verify rules: npm run verify:rules
- Tests (E2E then unit): npm run test
- Unit only (Vitest): npm run test:browser
- DB seed (loads .env.local): npm run db:seed
  - Dry-run: npm run db:seed -- --dry-run
  - Reset: npm run db:seed -- --reset (requires RUN_DESTRUCTIVE=true and --yes)
- Plan scaffold: npm run plan:ensure

Core Rules (must follow)

1. Environment
   - Never read process.env in application code. Use app-config.ts or lib/env.ts instead.
   - Exceptions: scripts that intentionally load env before imports (example scripts/seed/run.ts). Small CLI helpers in scripts/ may use process.env but must be documented.
   - Never commit .env, .env.local, keys, or tokens.

2. Database (DAL)
   - All DB access goes through dal/\* helpers.
   - Do not import the DB client from app/, components, pages, or server wrappers.
   - Prevent N+1: prefer eager-loading DAL helpers for nested data.

3. Server Actions (mutations)
   - Server Actions live in actions/\*.
   - Contract: a) Validate inputs with Zod and provide descriptive messages. b) Authenticate early: call auth() and check session?.user when required. c) Use dal/\* for DB access. Avoid direct db client imports. d) Return Promise<{ ok: boolean; error?: string; ... }> and avoid uncaught throws. e) Revalidate caches/tags after success (revalidatePath / revalidateTag / updateTag).
   - Do not place stateful mutation logic in API routes.

4. App Router / Home
   - app/page.tsx must remain public/static. Do not add auth(), DAL, or DB queries there.

5. Static checks & CI
   - Run npm run verify:rules before PRs. It enforces process.env usage, zod rules, direct-db-imports, Server Action heuristics, and Home constraints.
   - verify:rules writes .opencode/reports/rules-report.json used by CI.

Change & Commit Rules

- Ask for permission BEFORE editing files or committing.
- If a change touches more than seven files, create a plan under .opencode/commands using a short kebab name. Use npm run plan:ensure.
- Make small, focused commits when possible.
- NEVER commit secrets or run destructive scripts without explicit approval and required env flags.
- Include a one-line provenance block in every commit/PR (files read + why).

Where to Inspect First

1. package.json (scripts)
2. next.config.ts (experimental flags)
3. app-config.ts and lib/env.ts (canonical env)
4. scripts/seed/run.ts (env loading order)
5. scripts/verify-rules.ts (what is enforced)
6. actions/_ and dal/_ (Server Actions and DAL helpers)
7. tests/e2e/helpers/plaid.mock.ts (E2E mocking)

Skills & MCP servers (short)

- Skills live under .opencode/skills (each has a SKILL.md). Examples: agent-governance, server-action-skill, validation-skill, dal-skill, db-skill, testing-skill, ui-skill, dwolla-skill, plaid-skill.
- MCP servers are listed in .opencode/mcp_servers.json. Notable entries: next-devtools-mcp, playwright, playwright-mcp-server, neon, apify, elevenlabs, singlestore.

ESLint & formatting

- ESLint config: eslint.config.mts (canonical). See zod/\* rules and no- secrets plugin.
- Prettier configured via .prettierrc.ts.

Provenance requirement (repeat)

- Every change must include a provenance list of files read and why in the PR/commit body.

If uncertain

- Stop and ask one short question. Do not guess about secrets or destructive flags.

End of AGENTS.md
