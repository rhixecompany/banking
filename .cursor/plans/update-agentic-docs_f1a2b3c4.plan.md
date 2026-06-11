# Update Agentic Documentation and Rules

## Goals

- Consolidate and standardize all agentic documentation in the repository so contributors and automated agents have a single, consistent source of truth.
- Ensure AGENTS.md, cursor rules (.mdc), .cursorrules, .github/copilot-instructions.md, all SKILL.md files under .opencode and .cursor, and instruction files (.opencode/instructions/_.md, .github/instructions/_.md) are accurate, consistent, and follow project conventions.

## Scope

This plan covers reading, analyzing, and then creating or updating documentation files listed below. It does NOT include broad code changes beyond documentation, nor running the full test suite unless explicitly requested.

## Target Files

- AGENTS.md
- .cursorrules
- .cursor/rules/\*.mdc
- .github/copilot-instructions.md
- .github/instructions/\*.md
- .opencode/instructions/\*.md
- .opencode/skills/\*\*/SKILL.md
- .cursor/skills/\*\*/SKILL.md
- README.md (top-level)
- package.json (for scripts review and accuracy checks)

Specific existing files discovered during discovery will be enumerated in the implementation step prior to edits.

## Risks

- Documentation drift: edits could accidentally change intent or remove important constraints enforced elsewhere (lint rules, tests, CI).
- Over-writing existing project conventions: large rewrites risk removing historical guidance contributors rely on.
- Markdown lint or CI failures if edits introduce formatting or content rules violations.
- Committing changes without your confirmation — I will not commit changes until you instruct me to.

## Assumptions

- You want a single pass that makes documentation consistent but will review before commits.
- Plan files should be stored in `.cursor/plans/` (project standard). If you prefer `.opencode/plans/`, tell me and I'll use that instead. [FLAG: historical reference — do not change without confirmation]

## Planned Changes (high-level steps)

1. Open and read all target files to build a current-state inventory.
2. Produce a short summary of differences and inconsistencies found (will include exact file references and recommended edits).
3. Ask clarifying questions (below). Wait for answers before applying edits.
4. Create incremental edits that are minimal and focused (prefer smaller, safer changes). For each edit:
   - Update wording to align with AGENTS.md rules and repo executable sources (package.json, eslint.config.mts, app-config.ts, database/schema.ts).
   - Preserve existing examples and important constraints (PR-blocking rules) unless you instruct a rewrite.
   - Add or update headings, summary bullets, and cross-references for contributor clarity.
5. Run markdown-lint on plan files and edited docs, fix warnings.
6. Present a short changelog and request approval to commit.

## Validation

- Run markdown lint on changed files (repo's markdown lint step).
- Confirm package.json scripts referenced in docs match actual package.json content.
- Run `npm run format:check` and `npm run type-check` for modified areas if requested (slower — optional).
- Manual review: I will list all changed files and key diffs for you to inspect before committing.

## Rollback or Mitigation

- I will not commit changes until you approve. If you request commits, I will create a single focused commit per documentation area and include a clear commit message.
- If a post-commit issue appears, revert is simple (git revert) — I will provide a revert plan and, if requested, create the revert commit.

## Questions (required before implementation)

1. Do you prefer "minimal edits" (preserve most existing text, only fix inconsistencies) or a "full rewrite" (rework tone and structure to be uniform across files)? Please pick one.
2. Confirm plan file location: use `.cursor/plans/` (recommended) or `.opencode/plans/`?
3. Should I create a git commit automatically after making documentation changes, or leave edits uncommitted for your review? If commit, provide the branch name to use (or say "current branch").
4. After edits, do you want me to run the full validation pipeline (`npm run validate`) or a narrower subset (markdown lint + type-check)? If narrower, specify.
5. Any additional constraints or style preferences (tone, voice, a particular template to follow)?

## Implementation Timeline

- Read + inventory: 1–2 hours (fast pass)
- Draft changes: depends on answer to Questions; small edits may be done in a single follow-up; larger rewrites will be staged in 1–2 incremental patches.

---

Once you answer the Questions above I will proceed to produce the inventory of current files and a recommended list of edits before making any modifications.
