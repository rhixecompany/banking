---
plan name: opencode-maintenance
plan description: OpenCode Tooling Maintenance
plan status: done
---

## Idea

Consolidated maintenance plan for OpenCode plugins, skills, and tooling stability. Combines: opencode-plugin-audit (plugin/MCP inventory with auth classification), opencode-tools-debug (compress/tool stability), skill-audit-fix (skill file fixes). See: docs/plans/2026-04-29-plugin-mcp-inventory.md

## Implementation

- 1. Plugin/MCP Inventory: Verify working set from docs/plans/2026-04-29-plugin-mcp-inventory.md; run mcp-cli discovery for each server.
- 2. Auth Classification: Document which plugins/MCPs work without auth, which require API keys/tokens; list env var names only.
- 3. Compress Tool Fix: Reproduce compress failures; identify root cause (registration/wiring vs runtime); apply minimal fix.
- 4. Skill Audit: Review .opencode/skills/\*.md for npm→bun inconsistencies, outdated refs (bankDal→walletDal), missing frontmatter.
- 5. Fix Skills: Add missing lastReviewed/applyTo to simplify, code-philosophy, code-review, auth-skill, dal-skill.
- 6. Verification: Run verify:rules, format, type-check after fixes; verify samples of skill usage in codebase.
- 7. Report: Document working vs blocked components, fix summary, and recommended no-auth baseline.

## Required Specs

<!-- SPECS_START -->
<!-- SPECS_END -->
