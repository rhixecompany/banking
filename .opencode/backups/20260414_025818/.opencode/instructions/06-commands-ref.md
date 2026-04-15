---
description: Reference for scripts and command patterns used in repo
applyTo: "scripts/**/*.{ts,sh}"
lastReviewed: 2026-04-14
---

# Commands Reference

- Prefer using npm scripts defined in package.json to preserve NODE_OPTIONS and other flags.
- Destructive scripts must accept `--dry-run` and require explicit flags to run (see .opencode/instructions/12-scripts-patterns.md).
