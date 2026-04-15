---
description: How to use apply_patch safely and verify edits
applyTo: "**/*"
lastReviewed: 2026-04-14
---

# Apply Patch Verification

- Use the `apply_patch` tool for text edits; avoid ad-hoc sed/awk commands for safety.
- After patches, run `npm run format` and `npm run type-check` to surface syntax errors immediately.
