---
description: How to use apply_patch safely and verify edits
applyTo: "**/*"
lastReviewed: 2026-04-14
---

# Apply Patch Verification

- Use the `apply_patch` tool for text edits always read the file with the `read` tool before using the `apply_patch` tool ; avoid ad-hoc sed/awk commands for safety.
- After patches, run `npm run format` and `npm run type-check` to surface syntax errors immediately.

-- Canonicalized from docs/AGENTS-CANONICAL.md on 2026-04-17 as part of unify-agent-docs operation.
