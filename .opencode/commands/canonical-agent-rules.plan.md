# Canonical Agent Rules & Instructions Rewrite

## Goals

- Produce a single, exhaustive, and up-to-date canonical reference for all agentic coding agents (Copilot, Cursor, OpenCode) in this repository.
- Replace legacy instruction files listed in the plan with the canonical reference (verbatim duplication) after review and validation.

## Scope

- Read and audit all target instruction files, skills, scripts, ESLint config, and any custom TypeScript types.
- Synthesize a single canonical reference document that consolidates and resolves conflicts.
- Validate the canonical doc by running repository checks and CI helper scripts.
- Duplicate the canonical doc verbatim to target locations after approval.

## Target Files

- AGENTS.md
- docs/personas-list.md
- .opencode/instructions/\*.md
- .cursorrules
- .github/copilot-instructions.md
- .github/instructions/\*.md
- .cursor/rules/\*.mdc
- .opencode/skills/\*/SKILL.md (read-only; include full content in appendix)
- scripts/\*_/_.{ts,sh,ps1,bat} (inventory & include code listings)
- eslint.config.mts and package.json
- All custom TypeScript types under lib/, dal/, actions/, scripts/types/\*\*

## Risks

- Overwriting multiple docs could remove project-specific nuance or local edits.
- Large replacements will touch many files—must follow the repo plan and commit rules.
- Validation may surface unrelated failures (CI/test flakiness).

## Planned Changes

1. Discovery & Audit (Phase 1)
   - Inventory and read the target files and supporting artifacts.
   - Extract agent rules, persona definitions, skills, scripts, custom types, ESLint rules, and TODOs.
2. Synthesis & Correction (Phase 2)
   - Reconcile conflicting guidance using AGENTS.md as primary authority.
   - Produce canonical reference document (master copy at docs/AGENTS-CANONICAL.md).
   - Include full SKILL.md contents as an appendix and include scripts verbatim.
3. Validation & Handoff (Phase 3)
   - Run `bash scripts/utils/run-ci-checks.sh --continue-on-fail` and repo validation commands.
   - After review, duplicate the canonical doc verbatim to target locations and commit with provenance.

## Validation

- Primary checks:
  - npm run type-check
  - npm run lint:strict
  - npm run verify:rules
  - npm run format
  - bash scripts/utils/run-ci-checks.sh --continue-on-fail
- Playwright/Vitest runs follow the kill-port-3000-before-tests guard.

## Rollback / Mitigation

- Keep original files in git history. If necessary, revert the commit(s).
- Before applying final replacements, produce per-file diffs and store backups under .opencode/backups/canonical-agent-rules/<timestamp>/

## Implementation Notes & Policies

- Any change touching more than 7 files will include this plan and be staged as a focused commit set.
- All edits will use apply_patch and include a provenance block in the commit message listing files read and reasons.
- Do not commit secrets or .env files. Follow AGENTS.md rules for environment access.

## Provenance (files already read for discovery)

- Read (for audit):
  - AGENTS.md — canonical agent policy and rules
  - docs/personas-list.md — persona definitions
  - .opencode/instructions/\*.md — repository-specific instructions (multiple files)
  - .cursorrules — automation rules
  - .github/copilot-instructions.md — Copilot guidance
  - .cursor/rules/\*.mdc — additional cursor rules
  - .opencode/skills/\*/SKILL.md — all SKILL.md files discovered
  - scripts/\*_/_.{ts,sh,ps1,bat} — scripts inventory (list created)
  - eslint.config.mts — ESLint configuration
  - package.json and .opencode/mcp_servers.json

## Next Steps (Phase 1 execution)

1. Run the explore subagent to perform bulk reads and extract structured data: rules, personas, skills, scripts, types, ESLint rules, TODOs, and recent git-based changes.
2. Present Phase 1 artifacts (inventories + extracted content) for review.

## Contact

If any question about scope or exceptions arises, stop and ask one short question.

---

Last updated: 2026-04-17
