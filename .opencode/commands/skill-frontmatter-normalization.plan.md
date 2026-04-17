# SKILL Frontmatter Normalization

## Goals

- Normalize SKILL.md frontmatter across agent skills so automated discovery and validation use a consistent schema: `name` (kebab-case), `description`, `lastReviewed` (ISO date), `applyTo` (glob) when applicable.

## Scope

- Small batch edits (<= 7 files per patch) to SKILL.md files under `.opencode/skills/` and selected `.cursor/skills/` artifacts.
- This plan covers the next batch and the verification steps; subsequent batches will follow the same pattern.

## Target Files (proposed first batch)

1. .opencode/skills/ui-skill/SKILL.md (already normalized in prior patch)
2. .cursor/skills/banking-agent-standards/SKILL.md (already annotated in prior patch)
3. .opencode/skills/git-commit/SKILL.md (verify frontmatter ordering and presence of applyTo)
4. .opencode/skills/gh-cli/SKILL.md (confirm applyTo pattern)
5. .opencode/skills/make-skill-template/SKILL.md (ensure example frontmatter follows canonical form)

Note: The first two files were updated already as a quick correction; remaining files will be changed only after confirmation in this plan.

## Risks

- Accidental editing of historical artifacts under `.cursor/` or `.opencode/plans/`. Mitigation: small, non-destructive metadata updates only.
- Lint or markdown-check failures. Mitigation: run `npm run format:markdown:check` after edits.

## Planned Changes

- For each SKILL.md in the batch:
  1. Ensure `name` matches folder name and uses kebab-case.
  2. Ensure `description` exists and is concise.
  3. Ensure `lastReviewed` is present (default to today's date if missing).
  4. Ensure `applyTo` exists with an appropriate glob (add `**/*` if unclear) — prefer conservative globs.
  5. Do not modify body content except to fix frontmatter ordering/format.

## Validation

- Run `npm run format:markdown:check` — must pass with zero errors for edited files.
- List of files edited and a short justification will be included in the commit message.

## Rollback or Mitigation

- Changes are small and non-destructive; if a change is incorrect, open a follow-up patch to revert that specific SKILL.md rather than a broad revert.

## Next Steps

- Please confirm to proceed with the remaining batch (files 3-5 in Target Files). When confirmed, I will apply the changes and run the markdown check.
