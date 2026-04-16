---
name: update-agentic-documentation
overview: Rewrite and reconcile all agent-facing documentation so AGENTS.md is canonical, all other agent instruction surfaces cross-reference it, and plan location is standardized on `.opencode/plans/`.
todos:
  - id: inventory-and-conflict-map
    content: "Build a conflict map: plan location/threshold, validation commands, and rule duplication across AGENTS.md / .cursorrules / .cursor/rules / .github/copilot-instructions.md / .opencode/instructions."
    status: completed
  - id: rewrite-canonical-and-pointers
    content: Rewrite AGENTS.md as canonical, then rewrite other surfaces into thin pointers aligned to it (including `.cursor/rules` switching to `.opencode/plans/`).
    status: completed
  - id: opencode-instructions-and-skills
    content: Rewrite `.opencode/instructions/*` and skill SKILL.md files to remove cross-repo mandates, unify terminology, and link to canonical rules.
    status: completed
  - id: github-instructions-subset
    content: Identify and update only the Banking/agent-relevant `.github/instructions/*.md` files; leave template-only files untouched.
    status: completed
  - id: readme-alignment
    content: Update README’s agentic notes and command references to match AGENTS.md and package.json scripts.
    status: completed
  - id: validation-pass
    content: Run markdown lint checks and verify all referenced npm scripts exist; produce a file-by-file changelog.
    status: completed
isProject: false
---

# Update Agentic Documentation and Rules

## Goals

- Make **`AGENTS.md`** the canonical, accurate source of truth for agent behavior in this repo.
- Rewrite overlapping instruction surfaces so they **do not drift** (they should mostly _point to_ `AGENTS.md` and a small set of canonical rules/instructions).
- Standardize plan location on **`.opencode/plans/`** across all agent docs/rules.

## Scope

- Documentation/instruction/rule files only:
  - `AGENTS.md`, `.cursorrules`, `.cursor/rules/*.mdc`
  - `.github/copilot-instructions.md`
  - Banking/agent-relevant subset of `.github/instructions/*.md`
  - `.opencode/instructions/*.md`
  - `.opencode/skills/**/SKILL.md` and `.cursor/skills/**/SKILL.md`
  - top-level `README.md`
  - `package.json` for script-name accuracy checks (read-only)
- No product/code refactors; no full test suite unless explicitly requested later.

## Target Files (inventory discovered)

- Canonical doc:
  - [`AGENTS.md`](AGENTS.md)
- Cursor agent instruction surfaces:
  - [`.cursorrules`](.cursorrules)
  - [`.cursor/rules/*.mdc`](.cursor/rules/) (12 files)
  - [`.cursor/skills/banking-agent-standards/SKILL.md`](.cursor/skills/banking-agent-standards/SKILL.md)
- GitHub Copilot surfaces:
  - [`.github/copilot-instructions.md`](.github/copilot-instructions.md)
  - Banking/agent-relevant subset under [`.github/instructions/`](.github/instructions/) (178 total; we will only edit a small subset, determined by search)
- Opencode instruction/skills surfaces:
  - [`.opencode/instructions/*.md`](.opencode/instructions/) (note: includes backups folder we should treat as read-only history)
  - [`.opencode/skills/**/SKILL.md`](.opencode/skills/) (29 files)
- Contributor-facing docs:
  - [`README.md`](README.md)
  - [`package.json`](package.json) (for script names / commands)

## Risks

- Conflicting “standards” files (currently present) could cause accidental behavior changes for agents.
- Large rewrite across many doc surfaces can introduce new drift if duplication remains.
- Markdownlint failures if tables/long lines remain in files where lint is enforced.

## Planned Changes

### 1) Define the canonical contract (AGENTS-first)

- Treat [`AGENTS.md`](AGENTS.md) as canonical.
- Ensure `AGENTS.md` explicitly defines (and becomes the only place that fully defines):
  - **Plan threshold and location**: `>3 files` → plan required → `.opencode/plans/<task>_<8char>.plan.md`.
  - **Validation commands** that are real in `package.json` (e.g. `npm run lint:strict`, `npm run validate`, `npm run format:markdown:check`).
  - **Non-negotiables** (no `any`, no N+1, env access rule, server actions for mutations, etc.).
  - **Doc hierarchy**: what other files exist and how they should defer to `AGENTS.md`.

### 2) De-duplicate and convert other surfaces into “thin pointers”

- Rewrite [`.cursorrules`](.cursorrules) so it:
  - Matches `AGENTS.md` on plan threshold/location.
  - Contains only short enforceable bullets + a “See `AGENTS.md`” link.
- Rewrite relevant `.cursor/rules/*.mdc`:
  - Update [`plan-file-standards.mdc`](.cursor/rules/plan-file-standards.mdc) and any references in [`workflow-and-steps.mdc`](.cursor/rules/workflow-and-steps.mdc) to use **`.opencode/plans/`** (currently `.cursor/plans/`).
  - Keep “index” rules (like [`project-coding-standards.mdc`](.cursor/rules/project-coding-standards.mdc)) as pointers; avoid duplicating content that already lives in `AGENTS.md`.
- Rewrite [`.github/copilot-instructions.md`](.github/copilot-instructions.md) into a Copilot-optimized summary that:
  - Avoids long tables where possible.
  - Removes questionable/incorrect statements (e.g. the current note about `format:check` being destructive conflicts with `package.json`).
  - Primarily links to `AGENTS.md` and a small set of canonical rule files.
- `.github/instructions/*.md` (subset only):
  - Identify which instruction files are actually in use for this repo’s agents.
  - Update only those to either:
    - reference `AGENTS.md` as canonical, or
    - be clearly repo-agnostic templates (leave them untouched).

### 3) Repair `.opencode/*` instruction drift

- Audit `.opencode/instructions/*.md` for conflicts with `AGENTS.md`.
  - Example already found: [`.opencode/instructions/09-plan-file-standards.md`](.opencode/instructions/09-plan-file-standards.md) currently talks about “commands”, `>6 files`, and `.opencode/commands/*.prompt.md`, which conflicts with `AGENTS.md` + your chosen `.opencode/plans/` standard.
- Rewrite `.opencode/instructions/*` so:
  - “Plan vs command” terminology is consistent with `AGENTS.md`.
  - Threshold/location/naming/required sections match the canonical contract.
  - Any “run docker gateway” or unrelated cross-repo mandates in default rules are removed or moved behind an explicit “optional / local-only” section.
  - Backups under `.opencode/backups/**` are not edited (treat as historical snapshots).

### 4) Normalize skill documentation

- For `.opencode/skills/**/SKILL.md` and `.cursor/skills/**/SKILL.md`:
  - Ensure each skill’s “When to apply” and “Non-negotiables” point to `AGENTS.md`.
  - Remove duplicated “core rules” text unless it adds unique, skill-specific constraints.

### 5) Bring `README.md` into alignment (without turning it into agent docs)

- Keep `README.md` as contributor-facing.
- Ensure any “Agentic contributor notes” section:
  - References `AGENTS.md`.
  - Uses the standardized plan location `.opencode/plans/`.
  - References only real `package.json` scripts.
- Reduce or quarantine tutorial-era snippets that contradict the repo’s current patterns (keep them as “tutorial snippet” with pointer to `AGENTS.md` for canonical patterns).

## Validation

- Run markdown lint on changed markdown files using the repo script(s):
  - `npm run format:markdown:check` (and `npm run format:markdown:fix` if needed)
- Verify docs reference only scripts that exist in [`package.json`](package.json).
- Spot-check: search for `.cursor/plans` and `.opencode/commands` references and ensure they are either intentionally kept (with rationale) or updated.

## Rollback or Mitigation

- No commits will be created unless you explicitly request it.
- If you later want commits, we’ll keep them small and thematic (e.g. “cursor rules alignment”, “opencode instructions alignment”, “copilot instructions refresh”).

## Notes / Known Conflicts to Resolve

- **Plan location conflict**: `.cursor/rules/*` currently enforces `.cursor/plans/`, while `AGENTS.md` + `.cursorrules` use `.opencode/plans/`. You chose `.opencode/plans/`; plan includes updating `.cursor/rules` accordingly.
- **Opencode plan/command drift**: `.opencode/instructions/09-plan-file-standards.md` is inconsistent (commands, >6 threshold, `.opencode/commands/`). Plan includes rewriting it to match the canonical contract.

## How we’ll pick the “Banking/agent-relevant” `.github/instructions` subset

- Search within `.github/instructions/` for references to:
  - `AGENTS.md`, `Cursor`, `.cursorrules`, `.cursor/rules`, `.opencode`, `Next.js 16`, `Drizzle`, `Server Actions`, `Vitest`, `Playwright`, `banking`
- Only edit files that either:
  - are explicitly about agents in this repo, or
  - are referenced/linked by `copilot-instructions.md` / `AGENTS.md` / README.
