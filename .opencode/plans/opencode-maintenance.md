---
plan name: opencode-maintenance
plan description: OpenCode Tooling Maintenance - stabilize plugins, skills, and MCP servers
plan status: draft
plan status reason: Awaiting enhancement based on plan-review feedback
---

## Idea

Consolidated maintenance plan for OpenCode plugins, skills, and tooling stability. Combines: opencode-plugin-audit (plugin/MCP inventory with auth classification), opencode-tools-debug (compress/tool stability), skill-audit-fix (skill file fixes). See: docs/plans/2026-04-29-plugin-mcp-inventory.md

**Measurable outcome**: All OpenCode skills have valid frontmatter, MCP servers are classified by auth requirement, compress tool functions without failures.

## Implementation

- 1. **Plugin/MCP Inventory** (Priority: High):
  - Read docs/plans/2026-04-29-plugin-mcp-inventory.md for working set
  - Run `opencode_sync --status` to check configured servers
  - Test each MCP server with `mcp-cli discover <server-name>` or equivalent
  - Document: server name, status (working/failed/blocked), error message if failed

- 2. **Auth Classification** (Priority: High):
  - For each working MCP: determine if auth required
  - Create auth-matrix in docs/opencode-auth-matrix.md with columns: Server, Auth Required (yes/no), Env Vars Needed, Test Token Available
  - List only env var names (e.g., OPENAI_API_KEY), not values

- 3. **Compress Tool Fix** (Priority: High):
  - Run compress on 3 recent conversation ranges to reproduce failure
  - Check logs for: "tool not found", registration errors, runtime exceptions
  - If registration issue: fix in .opencode/config.json or skill registration
  - If runtime issue: identify the specific compress boundary that fails
  - Verify fix with same 3 conversation ranges

- 4. **Skill Audit** (Priority: Medium):
  - Glob .opencode/skills/\*.md files
  - Check each for:
    - npm→bun inconsistencies (grep "npm install", "npm run")
    - Outdated refs: bankDal, userDal → walletDal pattern
    - Missing frontmatter: lastReviewed, applyTo
  - Log each issue with file:line reference

- 5. **Fix Skills** (Priority: Medium):
  - Add lastReviewed: "2026-04-30" to: simplify, code-philosophy, code-review
  - Add applyTo: "\*\*" to: auth-skill, dal-skill
  - Update outdated references (bankDal→walletDal)
  - Replace npm commands with bun equivalents

- 6. **Verification** (Priority: High):
  - Run `bun run verify:rules` — must pass with 0 critical violations
  - Run `bun run format` — no files modified
  - Run `bun run type-check` — no errors
  - Test 3 skills by loading them in a conversation

- 7. **Report** (Priority: Medium):
  - Create docs/opencode-maintenance-report.md with:
    - Working MCPs (no-auth baseline)
    - Blocked MCPs (require auth/keys)
    - Fixed skills list (with before/after summary)
    - Compress tool status (fixed/failed/needs-followup)
    - Recommended no-auth baseline for future testing

## Notes

- Edge case: If MCP discovery fails due to network, mark as "untested" not "failed"
- Edge case: If compress tool has no reproducible failure, document "no failure observed" and close as "resolved - no action needed"
- Decision: Prioritize no-auth MCPs for development workflow to reduce setup friction

## Required Specs

<!-- SPECS_START -->

### Acceptance Criteria

1. **MCP Inventory**: All configured MCP servers tested; status documented in auth-matrix
2. **Auth Matrix**: docs/opencode-auth-matrix.md exists with at least: Server, Auth Required, Env Vars columns
3. **Skill Frontmatter**: All .opencode/skills/\*.md files have valid YAML frontmatter with lastReviewed and applyTo
4. **Compress Tool**: Can compress a 20-message conversation range without errors
5. **Verification**: `bun run verify:rules` passes with 0 critical; `bun run format` modifies 0 files; `bun run type-check` returns 0 errors

### Output Artifacts

- docs/opencode-auth-matrix.md (new)
- docs/opencode-maintenance-report.md (new)
- Updated skill files (in-place edits)
<!-- SPECS_END -->
