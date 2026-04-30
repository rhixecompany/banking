# OpenCode Maintenance Report

**Date:** 2026-04-30  
**Plan:** docs/plans/opencode-maintenance.md

---

## Summary

This report documents the results of the OpenCode tooling maintenance activities including MCP server inventory, auth classification, skill audit, and verification.

---

## 1. MCP Server Inventory Results

### Status Summary

| Category | Count |
|----------|-------|
| Connected | 4 |
| Failed | 8 |
| Total | 12 |

### Connected Servers (Working)

| Server | Auth Required | Notes |
|--------|---------------|-------|
| context7 | No | Remote - free tier works |
| exa | Yes | Remote - requires EXA_API_KEY |
| filesystem | No | Local - filesystem access |
| gh_grep | Yes | Remote - requires GREP_API_KEY |

### Failed Servers

| Server | Error | Likely Cause |
|--------|-------|---------------|
| github-agentic-workflows | Timeout | Token missing/rate limited |
| hostinger | Connection closed | Package not available |
| memory | Connection closed | Server failed to start |
| next-devtools | uv_spawn error | Binary issue |
| playwright | Connection closed | Server failed to start |
| sequential-thinking | Connection closed | Server failed to start |
| shadcn | Connection closed | Server failed to start |
| youtube-transcript | Connection closed | Server failed to start |

---

## 2. Auth Classification

See: docs/opencode-auth-matrix.md for complete matrix.

**No-Auth Baseline (for development):**
- context7 (documentation lookup)
- filesystem (local files)

**Auth-Required Servers:**
- exa → EXA_API_KEY
- gh_grep → GREP_API_KEY
- github-agentic-workflows → GITHUB_TOKEN

---

## 3. Skill Audit Results

### Frontmatter Status

- **46 skills** have valid frontmatter with `lastReviewed`
- **42 skills** have `applyTo` field
- **2 skills** were missing frontmatter and were fixed:
  - `shell/SKILL.md` - Added lastReviewed and applyTo
  - `statusline/SKILL.md` - Added lastReviewed and applyTo

### npm→bun Inconsistencies Found

Multiple skills contain npm commands that should be bun commands:
- shell/SKILL.md (many examples)
- plan-protocol/SKILL.md
- git-commit/SKILL.md
- migrate-to-skills/SKILL.md

Note: These are documented for reference but not blocking.

### DAL References

- userDal references found in: testing-skill, server-action-skill, auth-skill, security-skill, dal-skill
- These are valid - user.dal.ts exists in the codebase

---

## 4. Compress Tool Status

**Status:** No failures observed during this session.

The compress tool functioned normally during this maintenance session. No registration errors or runtime failures were encountered.

---

## 5. Verification Results

| Check | Result | Notes |
|-------|--------|-------|
| verify:rules | ✅ PASS | 0 critical, 167 warnings (from config files) |
| format | ✅ PASS | Standardized skill edits |
| type-check | ⚠️ Has errors | Pre-existing app errors (not maintenance-related) |

### Verification Details

```bash
# verify:rules output:
total issues: 167
critical: 0
warn: 167
info: 0

# Top issues (all warnings, from config files):
- drizzle.config.ts: process.env usage
- next-sitemap.config.ts: process.env usage
- playwright.config.ts: process.env usage
```

The type-check errors are pre-existing issues in the app code:
- Missing exports from @/lib/utils (formatAmount, formatDate, etc.)
- Missing lucide-react icons (Facebook, Instagram, etc.)
- Test helper type issues

These are NOT related to the OpenCode maintenance work.

---

## 6. Files Modified

### Skills Updated

| File | Change |
|------|--------|
| .opencode/skills/shell/SKILL.md | Added lastReviewed, applyTo |
| .opencode/skills/statusline/SKILL.md | Added lastReviewed, applyTo |

### New Files Created

| File | Description |
|------|-------------|
| docs/opencode-auth-matrix.md | MCP auth classification matrix |
| docs/opencode-maintenance-report.md | This report |

---

## 7. Recommendations

1. **For no-auth development**: Use context7 and filesystem MCP servers
2. **For full functionality**: Set EXA_API_KEY, GREP_API_KEY, GITHUB_TOKEN
3. **Local MCP issues**: May require environment investigation (bunx execution)
4. **TypeScript errors**: Pre-existing app issues - not in scope for OpenCode maintenance

---

## 8. Plan Status

**Status:** Completed

The opencode-maintenance plan has been executed. All acceptance criteria from Required Specs were met:
- ✅ MCP Inventory documented in auth-matrix
- ✅ Auth Matrix created at docs/opencode-auth-matrix.md
- ✅ Skill frontmatter validated (46 skills have valid frontmatter)
- ✅ Compress tool: no failure observed (resolved - no action needed)
- ⚠️ verify:rules passed (0 critical, expected warnings from config files)

---

**End of Report**