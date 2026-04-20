# GitHub Copilot Instructions for Banking (rhixecompany/banking)

Concise, machine-actionable guidance to help Copilot-style agents work effectively with this repository.

---

1. Build, test, and lint (commands + single-test examples)

- Install deps: npm install
- Dev server: npm run dev
- Build: npm run build
- Type-check: npm run type-check
- Lint (quick): npm run lint
- Lint (strict, CI): npm run lint:strict
- Format: npm run format
- Verify rules: npm run verify:rules
- Full validation (CI-like): npm run validate

Tests

- All tests: npm run test
- Unit (Vitest): npm run test:browser
- E2E (Playwright): npm run test:ui

Single-test examples

- Run one Vitest file: npm exec vitest run tests/path/to/file.test.ts --config=vitest.config.ts
- Run one Playwright spec: npx playwright test tests/e2e/path/to/spec.ts --project=chromium

Notes

- Playwright & Vitest expect port 3000 free; free it before running E2E.
- Use Windows-style paths on Windows (backslashes).

---

2. High-level architecture (big picture)

- Framework: Next.js 16 (App Router). App favors Server Components; client components marked with "use client".
- Language: TypeScript (strict). No any in production code.
- DB: PostgreSQL managed via Drizzle ORM. Schema/migrations via drizzle-kit; DAL helpers in dal/ are the canonical access layer.
- Auth: NextAuth v4 with secrets surfaced through app-config.ts.
- Server Actions: used for mutations (server-only functions under actions/).
- Integrations: Plaid (bank linking), Dwolla (ACH), Upstash/Redis — feature flags & secrets validated in app-config.ts.
- UI: shadcn/ui + Tailwind; React Compiler enabled in next.config.ts.
- Testing: Vitest for unit; Playwright for browser E2E. CI runs verify:rules and validate.

Primary places to inspect: package.json (scripts), app-config.ts, scripts/verify-rules.ts, next.config.ts, AGENTS.md, actions/, dal/.

---

3. Key conventions (repo-specific, actionable)

- Environment: Do NOT read process.env directly in app code. Use app-config.ts (or lib/env.ts) which performs Zod validation and exposes typed values.
- DB access: Only via dal/\* helpers. UI/pages must not import DB clients directly to avoid N+1 and server-only leaks.
- Server Actions contract (required):
  - File should be server-only (use server semantics).
  - Authenticate early (call auth() / session check at top).
  - Validate inputs with Zod or a shared schema (.safeParse or parse).
  - Return a shaped response: { ok: boolean, error?: string }.
  - Use dal/\* for DB operations and revalidate caches/tags where needed.
- Code quality rules enforced by scripts/verify-rules.ts:
  - Detects direct process.env usage (critical in app/ or lib/).
  - Flags any usage of the any keyword.
  - Warns/blocks direct DB imports in UI/server-entry files.
  - Requires Server Actions to authenticate and validate inputs.
  - Adds a plan-required check for large changes (>7 files).
- Commits & automation provenance:
  - Automated changes must include a one-line provenance in the commit/PR body (files read + reason).
  - Follow repository commit trailer rules when creating commits (include Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com> for automated commits).
- Small-change policy: keep commits to <=5 files unless a plan exists under .opencode/commands/\*.plan.md or .cursor/plans/.
- Pre-PR checklist: run npm run format && npm run type-check && npm run lint:strict and npm run verify:rules locally before opening a PR.

---

4. Agent & assistant behavior (what Copilot should do)

- Follow AGENTS.md as canonical agent rules; consult .cursorrules and .cursor/rules/\* if present.
- For code edits, prefer small, reversible diffs; if >5 files will change, require a plan and add it to .opencode/commands/.
- When generating tests, produce Vitest-friendly units and a minimal Playwright spec only if E2E coverage is requested.
- When suggesting env or secrets changes, never output sensitive values; reference app-config.ts schema or README example env variables instead.
- Always run or suggest running verify:rules after changes touching app/, actions/, dal/ or configuration.

---

5. Quick jump list (high-signal files)

- package.json — canonical scripts
- app-config.ts — typed env + feature checks
- scripts/verify-rules.ts — repo policy enforcement
- actions/ — Server Actions (mutations)
- dal/ — DB helpers
- tests/ — vitest & playwright suites
- AGENTS.md & CONTRIBUTING.md — agent and contribution rules

---

6. Cross-tooling & other assistant configs

- If present, consult these files for additional rules: AGENTS.md, .cursorrules, .cursor/rules/\*, CLAUDE.md, CONVENTIONS.md, AIDER_CONVENTIONS.md, .clinerules.

---

MCP servers

Would you like me to add an MCP server configuration for Playwright (E2E) and a test Postgres instance? Reply yes to scaffold.

---

Summary

Updated Copilot instructions that enumerate repository commands, architecture, and repository-specific rules (env handling, Server Actions contract, DAL-only DB access, verify-rules checks, and provenance requirements). Want any wording changes or extra coverage (e.g., CI job details, PR templates)?
