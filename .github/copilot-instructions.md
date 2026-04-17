# GitHub Copilot Instructions for Banking

Purpose: concise, machine-friendly guidance for Copilot sessions and automated agents working in this repository. This file augments AGENTS.md and README.md with quick actionable items Copilot should follow.

---

## 1) Build, test, and lint (commands & single-test examples)

- Install: use your platform package manager (npm/yarn) then run npm install.
- Type-check: npm run type-check
- Lint (strict): npm run lint:strict
- Format: npm run format
- Full validation (pre-commit / pre-PR): npm run validate

Testing:

- All tests: npm run test
- Unit (Vitest): npm run test:browser
- E2E (Playwright): npm run test:ui

Single test examples:

- Run one Vitest file: npm exec vitest run tests/unit/register.test.ts --config=vitest.config.ts
- Run one Playwright spec: npx playwright test tests/e2e/sign-in.spec.ts --project=chromium

Notes:

- Use Windows-style paths when running shell commands in this environment (backslashes \\).

---

## 2) High-level architecture (big picture)

- Framework: Next.js 16 (App Router). App uses Server Components by default; client components are annotated with 'use client'.
- Language: TypeScript (strict mode enforced).
- Data layer: Drizzle ORM + PostgreSQL. All DB access must go through dal/ helpers.
- Auth: NextAuth v4 (session-based server-side flows); secrets managed via app-config.ts.
- UI: shadcn/ui + Tailwind CSS v4; React Compiler enabled in next.config.ts.
- Integrations: Plaid, Dwolla, Upstash/Redis — configuration exposed and validated via app-config.ts.
- Testing: Vitest for unit, Playwright for E2E. CI runs verify:rules and validate flows.

Where Copilot should look first for cross-cutting context: package.json (scripts), app-config.ts, next.config.ts, AGENTS.md, actions/_, dal/_, scripts/verify-rules.ts.

---

## 3) Key conventions (repo-specific, actionable)

- No direct process.env in app code — use app-config.ts or lib/env.ts. Scripts may read process.env but must be documented.
- DAL-only DB access: never import DB client from UI components or pages; use dal/\* helpers to avoid N+1 queries.
- Server Actions for all mutations: placed under actions/_. Contract: validate with Zod, authenticate early, use dal/_ for DB, return { ok: boolean, error?: string } and revalidate caches/tags where needed.
- Type safety rules: no any; use unknown + type guards for external input.
- Pre-PR checks: always run npm run verify:rules and npm run validate before opening a PR.
- Provenance: every automated change must include a one-line provenance (files read + why) in commit/PR body.
- Small-change policy: do not change more than 5 files without a plan under .opencode/commands/ and user approval.

---

## 4) AI assistant / agent guidance (files to consult & rules)

- Canonical agent rules: AGENTS.md (must be followed).
- Copilot-specific rules: .cursorrules and .cursor/rules/\* — mirror AGENTS.md where they overlap.
- Documentation rules: .github/instructions/documentation.instructions.md — follow when editing docs.
- Skills & MCP servers: .opencode/skills contains skill manifests (use when available).

When making edits, Copilot should:

- Keep changes small and reversible.
- Include provenance lines in commits/PRs.
- Ask for permission before committing code changes (unless user explicitly requested).

---

## 5) Quick navigation shortcuts (for Copilot sessions)

- package.json — scripts and commands
- app-config.ts — canonical env parsing and validation
- actions/ — Server Actions (mutations)
- dal/ — DB helpers and patterns to avoid N+1
- scripts/verify-rules.ts — repository verification logic
- tests/ — vitest and playwright suites

---

## 6) MCP servers

If configuring MCP servers for local development or CI, consider Playwright (E2E) and a Postgres instance. See .opencode for pre-defined MCP manifests and .opencode/skills for supported skills.

---

Summary: this file collects the essential commands, architecture map, and repo-specific conventions Copilot and other automated agents must respect. For deeper policies and examples refer to AGENTS.md and README.md.

Proposed next step: apply this file as .github/copilot-instructions.md (overwrites existing). Reply "apply" to proceed, or ask to tweak scope or wording.
