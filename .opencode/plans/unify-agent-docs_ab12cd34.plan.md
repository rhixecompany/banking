# Unify Agentic Docs

## Goals

- Make AGENTS.md the canonical agentic source-of-truth and harmonize all agentic documentation and skill files across the repository.
- Aggressively normalize code snippets in docs (docs-only changes). Do NOT modify application source files.

## Scope

- Files to modify: AGENTS.md, .cursorrules, .cursor/rules/_.mdc, .opencode/instructions/_.md, .opencode/skills/**/SKILL.md, .cursor/skills/**/SKILL.md, .github/instructions/\*.md, .github/copilot-instructions.md (if present), README.md
- Generated outputs included: README.opencode.md, dist/registry.json (created by npm run registry:build)

## Target Files

- AGENTS.md
- .cursorrules
- .cursor/rules/\*.mdc
- .opencode/instructions/\*.md
- .opencode/skills/\*\*/SKILL.md
- .cursor/skills/\*\*/SKILL.md
- .github/instructions/\*.md
- README.md
- .opencode/plans/unify-agent-docs_ab12cd34.plan.md (this file)

## Risks

- Doc snippets may diverge from running code. Mitigation: add inline comments next to normalized snippets: `// docs: updated snippet — verify vs. source` and list any maintainers decisions in the PR.
- Accidental edits to source code. Mitigation: restrict edits to markdown files only and run type-check & lint after commits.

## Planned Changes

1. Add this plan file to `.opencode/plans/` (done).
2. Update AGENTS.md to be canonical; add a short "When docs disagree" pointer to executable sources-of-truth.
3. Add `Last updated: 2026-04-11` to cursor rule files and add short consistency updates where needed.
4. Normalize SKILL.md headers and aggressively update code snippets in docs (bcryptjs→bcrypt, add Zod .describe() where missing, align env usage in snippets to app-config.ts; tag changed snippets with a docs-note comment).
5. Align .opencode/instructions/_.md and .github/instructions/_.md to use the canonical phrasing and exception lists.
6. Update README.md with an "Agentic contributor notes" section that links to AGENTS.md and lists the top PR-blocking rules.
7. Run `npm run registry:build` and include generated README.opencode.md and dist/registry.json in the PRs.

## Validation

- Commands to run locally/CI:
  - `npm run type-check`
  - `npm run lint:strict`
  - `npm run registry:build`
  - `rg -n "Never read process.env" || true`
  - `rg -n "If a change touches >3 files" || true`

## Rollback or Mitigation

- Keep all changes on feature branches and only merge after maintainer approval.
- If a doc change causes confusion, revert the commit(s) and open an issue describing the problem.

## Maintainers Decisions (to list in PRs)

- Confirm whether docs-only normalization (bcryptjs→bcrypt) should be propagated to application code.
- Confirm whether generated registry artifacts should be committed in PRs permanently.

---

_Plan created: 2026-04-11_
