# Update Agentic Documentation (Full Rewrite) — e9f4c1b2

## Goals

- Produce AGENTS.md v4.0: a full authoritative rewrite tied to executable sources of truth
- Update all agentic docs (.opencode/instructions/\*), .cursorrules, and README agentic sections to match AGENTS.md
- Create evidence_map.md linking every normative claim to file:line evidence
- Commit changes locally (no push) and run validations last; record validation logs and an issue catalog for any failures

## Scope

- Replace AGENTS.md (full rewrite)
- Update all files under `.opencode/instructions/`
- Update `.cursorrules` / `.cursor/rules` summary
- Update README agentic contributor notes
- Add `docs/evidence_map.md`, `docs/validation/*`, and `docs/issue-catalog.md`

## Plan ID

- e9f4c1b2 (this file)

## Deliverables

1. `.opencode/plans/update-agentic-docs_e9f4c1b2.plan.md` (this plan)
2. `AGENTS.md` v4.0 (full rewrite)
3. `.cursorrules` / `.cursor/rules` summary
4. `README.md` agentic section edits
5. `docs/evidence_map.md`
6. `docs/validation/*` logs
7. `docs/issue-catalog.md` (if failures)
8. Local commits on current branch (no push)

## Steps (high level)

1. Discovery: read package.json, eslint.config.mts, app-config.ts, lib/env.ts, database/schema.ts, tests/
2. Draft AGENTS.md v4.0 referencing evidence_map entries
3. Commit plan file as checkpoint
4. Commit AGENTS.md and other doc edits in small commits (local only)
5. Prepare reviewer package (PR draft file, checklist)
6. Run validation (last): format, type-check, lint:strict, test:ui, test:browser, scripts/validate.ts
7. Record validation logs and produce docs/issue-catalog.md for any failures (policy A: keep docs commits)
8. Deliver artifacts and request signoff from `rhixecompany`

## Validation

- Validation commands will be executed last and logs stored in `docs/validation/`:
  - `npm run format:check`
  - `npm run type-check`
  - `npm run lint:strict`
  - `npm run test:ui`
  - `npm run test:browser`
  - `npx tsx scripts/validate.ts --all`

## Rollback

- The previous AGENTS.md will be preserved by pointer to the prior commit (changelog + git commit hash included in final AGENTS.md)

## Owners

- Implementer: agent (will perform edits after approval)
- Reviewer: `rhixecompany`
- Architect: review architecture/version claims
