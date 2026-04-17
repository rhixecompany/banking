---
description: Patterns for repository scripts and destructive operations
applyTo: "scripts/**/*.{ts,sh}"
lastReviewed: 2026-04-14
---

# Scripts Patterns

- Scripts that modify infrastructure must accept `--dry-run` and be gated behind RUN_DESTRUCTIVE=true plus `--yes`.
- Prefer TypeScript scripts under `scripts/` and run them with `npx tsx` for cross-platform compatibility.

-- Canonicalized from docs/AGENTS-CANONICAL.md on 2026-04-17 as part of unify-agent-docs operation.
