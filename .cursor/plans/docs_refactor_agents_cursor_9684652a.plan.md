---
name: Docs refactor AGENTS Cursor
overview: "Refactor [AGENTS.md](AGENTS.md), [.cursorrules](.cursorrules), and [.github/copilot-instructions.md](.github/copilot-instructions.md) so they are accurate, Diátaxis-aligned, and maintainable: one canonical reference, corrected facts and commands, reduced harmful duplication between Cursor and Copilot files, and validation via markdownlint and `npm run validate`."
todos:
  - id: audit-facts
    content: Cross-check package.json scripts, lib paths, and DAL patterns; list concrete edits for AGENTS/copilot/cursorrules
    status: completed
  - id: rewrite-agents
    content: Restructure AGENTS.md (Diátaxis light), fix footer, add accurate pointers to .cursor/rules and schema/README
    status: completed
  - id: dedupe-cursor-copilot
    content: Rewrite .cursorrules and copilot-instructions.md to complement AGENTS, fix db:check and overclaims, reduce duplicate prose
    status: completed
  - id: validate-docs
    content: Run markdownlint + npm run validate; fix any issues
    status: completed
isProject: false
---

# Documentation refactor: AGENTS, Cursor rules, Copilot instructions

## Goals

- Make **[AGENTS.md](AGENTS.md)** the single **authoritative reference** for stack, PR-blocking rules, commands, and core patterns (Reference + concise How-to), aligned with `[.github/instructions/documentation.instructions.md](.github/instructions/documentation.instructions.md)` and real project layout.
- **Stop drift** between [.cursorrules](.cursorrules) and [.github/copilot-instructions.md](.github/copilot-instructions.md): today they are effectively the same long document (~425 lines each) with the same inaccuracies.
- **Fix factual mismatches** so every command, path, and “see also” is verifiable against the repo.

## Key issues found (must address)

| Issue | Evidence | Fix direction |
| --- | --- | --- |
| Overclaiming what AGENTS contains | Copilot/Cursor “See AGENTS.md for: Database schema reference, Deployment guide…” — [AGENTS.md](AGENTS.md) has none of those as dedicated sections | Either add minimal **Reference** pointers (e.g. `database/schema.ts`, `README.md`, `lib/env.ts`) or narrow the bullet list to what actually exists |
| Wrong summary metadata | “~500-line summary” in both files; files are ~215 / ~425 lines | Replace with accurate line count or remove line-based bragging |
| `db:check` description | [package.json](package.json) `"db:check": "drizzle-kit check --config drizzle.config.ts"` | Document as **Drizzle migration/schema check** (not “check DB connection”) |
| N+1 / eager loading wording | Rules cite `.with()`; project may use JOINs / single-query patterns in Drizzle | Phrase rule as: **eager load / batch / JOIN — no per-row queries in loops**; cite real pattern from `lib/dal/` if one exists |
| “DAL eager loading” example | Sequential `user` then `profile` queries in examples | Replace or annotate with a **single-query** or documented join pattern so examples don’t contradict the N+1 rule |
| AGENTS.md footer | Self-link “See AGENTS.md for full documentation” | Remove or replace with links to `.cursor/rules/` pointers and repo docs |
| `format:check` wording | [package.json](package.json) runs `npm run format && prettier --check .` | Match AGENTS description to actual behavior (or note “formats then checks” if documenting honestly) |

## Diátaxis-shaped structure (AGENTS.md)

Apply a light Diátaxis split without exploding length:

1. **Reference** — Critical rules table, commands (from `package.json`), import order, naming, project tree, links to canonical rule files under `[.cursor/rules/](.cursor/rules/)` (e.g. `banking-coding-standards.mdc`, `mutations-via-server-actions.mdc`).
2. **How-to** — Short procedural blocks: “Before commit”, “Add a Server Action”, “Add DAL query without N+1”.
3. **Explanation** — 1–2 short subsections only where it helps agents (why Server Actions for mutations, why `lib/env.ts`).

Avoid duplicating full code blocks three times; **AGENTS** holds full patterns; the other two files **summarize + link**.

## Differentiation: `.cursorrules` vs `copilot-instructions.md`

Recommended split to reduce duplicate maintenance:

- **[.cursorrules](.cursorrules)** — Cursor-specific: pointer to [AGENTS.md](AGENTS.md), mention `[.cursor/rules/*.mdc](.cursor/rules/)` as enforced workspace rules, minimal quick-reference table, **no** full duplicate of sections 6–8 unless necessary.
- **[.github/copilot-instructions.md](.github/copilot-instructions.md)** — GitHub Copilot–oriented: same canonical pointer to AGENTS, PR/merge expectations (`npm run validate`), link to AGENTS + README; keep **one** extended example max if Copilot needs inline context.

If the product requirement is “keep both comprehensive,” then add an explicit **“Source of truth”** note and **sync checklist** (still not ideal, but documented).

## Cross-checks before writing

- Verify paths: `lib/actions/*.ts`, `lib/dal/*.ts`, [lib/actions/bank.actions.ts](lib/actions/bank.actions.ts) (`disconnectBank` exists).
- Confirm stack claims: React Compiler in [next.config.ts](next.config.ts) (`reactCompiler: true`).
- Align command lists with [package.json](package.json) scripts actually present.

## Validation (after implementation)

1. Run markdownlint on the three edited files (project may use `markdownlint-cli` or IDE; follow existing repo convention).
2. Run `npm run validate` per [AGENTS.md](AGENTS.md) / [AGENTS.md](AGENTS.md) quality gates (kill port 3000 per [.cursor/rules/kill-port-3000-before-tests.mdc](.cursor/rules/kill-port-3000-before-tests.mdc) before tests if applicable).
3. **Last Updated:** Set to **2026-03-29** (per user date) with a short **changelog** bullet list in each file.

## Rollback

- Git-restore the three files from `main` (or stash) if validation fails or content is rejected.

## Optional (out of scope unless you ask)

- Broad pass on `docs/*.md` and root `*.md` as mentioned in the prompt — not required to satisfy “three deliverables” in section 4 of the attached prompt.
