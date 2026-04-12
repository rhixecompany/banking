# Update Agentic Documentation (Full Rewrite)

## Goals

- Perform a full rewrite of agent-facing documentation to make it consistent, actionable, and aligned with executable sources of truth (package.json, eslint.config.mts, app-config.ts/lib/env.ts).
- Produce a single authoritative AGENTS.md and update the Cursor rules summary (.cursorrules).

## Scope

- Create plan file in `.opencode/plans/` (this file).
- Replace top-level `AGENTS.md` with a rewritten, canonical version.
- Replace `.cursorrules` with an updated summary aligned to AGENTS.md.
- Leave other files untouched in this patch; further batches will update `.cursor/rules/*.mdc`, `.opencode/instructions/*.md`, SKILL.md files, and `.github/instructions/*.md` iteratively.

## Target Files

- AGENTS.md
- .cursorrules

## Risks

- Large documentation edits may unintentionally remove legacy guidance relied upon by contributors. Mitigation: keep examples and reference links, and record decisions in this plan.

## Planned Changes

1. Replace `AGENTS.md` with a concise, canonical guide that references executable sources and includes exact commands and PR-blocking rules.
2. Replace `.cursorrules` with a short, consistent rule summary for Cursor agents.
3. Produce a changelog block listing what changed (this plan + file diffs will serve as the changelog before any commit).

## Validation

- Run markdownlint on edited files (`npm run format:markdown:check` is available).
- Manually verify that package.json script references in AGENTS.md match actual package.json.

## Rollback

- No commits will be made until you approve. If you ask to commit and later want to revert, we can create a revert commit.

## Next Steps

After you confirm, I will apply the planned replacements for AGENTS.md and .cursorrules. Then we can iterate on the remaining agentic docs in batches.
