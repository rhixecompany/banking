# Update Agentic Documentation — Full Rewrite

## Goals

- Consolidate and standardize all agentic documentation so contributors and automated agents have a single, consistent source of truth. Align wording, tone, and enforcement rules to AGENTS.md.
- Make targeted edits that preserve existing constraints (PR-blocking rules, gating for test endpoints, secret handling) while improving clarity and reducing duplication.

## Scope

- Files to read, analyze, and edit (see Target Files). This is a documentation-only change — no production code changes.
- Produce a minimal, reviewable set of patches grouped by area (core agent rules, cursor rules, GitHub/copilot guidance, skills docs, instructions).

## Plan Location

.opencode/commands/update-agentic-docs.plan.md (this file)

Note: Legacy plan artifacts may exist under `.opencode/plans/` or `.cursor/plans/`. Preserve those files for historical provenance — do not move or delete them. Use `.opencode/commands/` for all new user-facing plan files.

## Assumptions

- Follow the repository canonical tone: AGENTS.md is authoritative. Use the AGENTS.md tone for edits.
- Full rewrite was requested (not minimal edits). Changes will therefore be broader but will try to remain minimal per file.
- Edits will be created but not committed. I will produce patches and wait for your confirmation before creating any commits.

## Target Files (initial inventory)

- AGENTS.md — canonical agent rules, source-of-truth for agents
- .cursorrules — cursor quick rules summary
- .cursor/rules/\*.mdc — rule files used by cursor agents (workflow, plan-file-standards, no-n-plus-one, etc.)
- .github/copilot-instructions.md — Copilot quick reference and sync checklist
- .github/instructions/\*.md — assorted instruction fragments (many; pick only those that overlap agentic guidance)
- .opencode/instructions/\*.md — repo-specific instruction files referenced by agents
- .opencode/skills/\*\*/SKILL.md — skill frontmatter and descriptions under .opencode/skills
- .cursor/skills/\*\*/SKILL.md — cursor skill files (if any)
- README.md — top-level README agent-contributor notes and agentic contributor sections
- package.json — scripts referenced by docs and copilot instructions

Files inspected during discovery (provenance):

- AGENTS.md — authoritative rules and agent workflow (read to capture canonical tone and PR-blocking rules)
- .cursorrules — concise agent quick rules (read to sync enforcement keys)
- .cursor/rules/workflow-and-steps.mdc — workflow enforcement guidance (read to align execution steps)
- .github/copilot-instructions.md — Copilot guidance and sync checklist (read to align cross references)
- .opencode/instructions/00-default-rules.md — default instructions that reference AGENTS.md (read to ensure no conflicts)
- .opencode/instructions/09-plan-file-standards.md — plan file format used by repo (read because changes will create plans)
- .opencode/skills/agent-governance/SKILL.md — sample skill (read to ensure skill frontmatter pattern)
- .opencode/skills/\* (list truncated) — multiple skill files read for consistency checks
- .cursor/skills/banking-agent-standards/SKILL.md — cursor skill set (read for local conventions)
- README.md — top-level contributor / agent notes (read to sync language)
- package.json — scripts referenced in docs and lint/validate commands (read to validate script names)

Rationale: these reads provide the minimal provenance required to justify edits and to ensure we do not contradict the canonical AGENTS.md.

## Problems Found (high-level summary)

1. Overlap and minor inconsistencies between AGENTS.md and .cursorrules / .cursor rules: some enforcement keys are duplicated but phrased differently (e.g., where plan files live: `.opencode/plans/` vs `.cursor/plans/`).
2. .github/copilot-instructions.md references a plan (`.opencode/plans/update-agentic-docs_4f7a8b2c.plan.md`) that may be stale or inconsistent with AGENTS.md.
3. Many .opencode/instructions/\*.md files already mirror AGENTS.md, but formatting and lastReviewed dates differ; some files refer to `.opencode/plans/` while .cursorrules mentions `.opencode/commands/` — we need a single canonical path.
4. Several SKILL.md files vary in frontmatter style and the presence/format of `lastReviewed` / `description` fields.
5. README agentic contributor notes overlap AGENTS.md but contain different plan thresholds (e.g., change touches >3 files vs >7 in AGENTS.md). This is a potential policy contradiction.

## Proposed Changes (planned edits)

1. Canonicalize plan location: choose `.opencode/commands/` (user chose `.opencode/commands/`). Update references across AGENTS.md, .cursorrules, .cursor rules, and README to point to `.opencode/commands/`.
2. Full rewrite of .cursorrules and a small set of .cursor/rules/\*.mdc files to follow AGENTS.md wording exactly for enforcement keys and numeric thresholds (plan-needed-threshold: 7). Preserve short machine-friendly format.
3. Update .github/copilot-instructions.md to reference AGENTS.md and `.opencode/commands/` consistently and remove stale plan references.
4. Normalize SKILL.md frontmatter across .opencode/skills/** and .cursor/skills/** to include: name, description (short + bullets), lastReviewed (ISO date), and applyTo (where relevant). Do not rewrite skill body content except to fix formatting, YAML frontmatter consistency, and add a one-line 'lastReviewed' if missing.
5. Update .opencode/instructions/\*.md headers to include canonical frontmatter where missing and add cross-references to AGENTS.md.
6. Change README agentic contributor note to align thresholds and language with AGENTS.md (replace ">3 files" with AGENTS.md's 7-file threshold and prefer `.opencode/commands/`). Add a short pointer to .opencode/commands/ for plans.
7. Add a short deprecation note in files that previously suggested `.cursor/plans/` if found, instructing authors to use `.opencode/commands/` going forward.

Edits will be grouped into small patches per area: (A) canonical rules & cursorrules, (B) copilot & github instructions, (C) SKILL frontmatter normalization, (D) README sync, (E) instruction files sync. Each patch will modify <= 7 files where possible; if a patch would exceed 7 files I will create a supplemental plan before proceeding.

## Validation

- Run markdown lint for edited files: `npm run format:markdown:check` (or `npx markdownlint-cli2 -c .markdownlintrc.json` for a focused run).
- Run `npm run type-check` to ensure there are no type issues introduced in instruction TypeScript examples.
- Verify package.json scripts referenced in docs match actual `package.json` entries.
- Manual review: I will list all changed files and diffs for your approval before any commit.

## Rollback / Mitigation

- I will not commit changes automatically. I will provide patches for review. If you later ask me to commit and a problem appears, we can revert with a single `git revert` commit.

## Next Steps (what I will do next after you approve)

1. Produce a focused patch for area (A): canonicalize AGENTS.md & .cursorrules and update references to `.opencode/commands/` in the smallest number of files required. Provide the patch for review.
2. After your review and approval apply area (B) patch for GitHub/copilot docs.
3. Proceed through (C)-(E) as separate patches, running markdown lint + type-check after each patch and sharing diffs for review.

## Questions / Approval

I will not modify any files beyond adding this plan file until you confirm. Please confirm:

1. Approve this plan and the use of `.opencode/commands/` as the canonical plan location? (Yes/No)
2. Proceed to apply the first patch (area A: AGENTS.md + .cursorrules canonicalization)? (Yes/No)

If you approve, I will prepare the first small patch and run markdown lint + type-check locally for the changed files, then present the patch for review.

---

Provenance (files read to prepare this plan):

- AGENTS.md — capture canonical tone and rules
- .cursorrules — quick rules summary to align enforcement keys
- .cursor/rules/workflow-and-steps.mdc — validate workflow guidance
- .github/copilot-instructions.md — copilot quickref and script checks
- .opencode/instructions/00-default-rules.md, 09-plan-file-standards.md — plan standards and defaults
- .opencode/skills/agent-governance/SKILL.md and a representative set of SKILL.md files — verify frontmatter patterns
- .cursor/skills/banking-agent-standards/SKILL.md — cursor skill content and conventions
- README.md — top-level agent note contradictions
- package.json — script names used in docs
