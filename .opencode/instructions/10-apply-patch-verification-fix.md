---
description: How to use apply_patch safely and verify edits
applyTo: "**/*"
lastReviewed: 2026-04-14
---

# Apply Patch Verification

- Use the `apply_patch` tool for text edits always read the file with the `read` tool before using the `apply_patch` tool ; avoid ad-hoc sed/awk commands for safety.
- After patches, run `npm run format` and `npm run type-check` to surface syntax errors immediately.

## Troubleshooting: "paths[0] property must be of type string" wrapper error

- Symptom: The tooling wrapper (bash tool) fails early with message: "The 'paths[0]' property must be of type string, got undefined" when running commands via the agent tooling layer.
- Root cause: The wrapper's input validation receives an undefined/invalid path or workdir parameter. This is not a git error — it occurs before the command executes.
- Immediate mitigation steps:
  1. Re-run the command directly in your shell (PowerShell/CMD/WSL) to bypass the wrapper for debugging.
  2. Ensure the wrapper is invoked with a valid `workdir` string and that any file path arguments are defined.
  3. If the wrapper is part of an automation layer, add logging to dump the arguments passed to the wrapper before validation.

## Example PowerShell checks

```powershell
Get-Command git
git --version
pwd
ls -la

git rev-parse --abbrev-ref HEAD
git status --porcelain --branch

Get-Content .\drizzle.config.ts -Raw | Select-String -Pattern "resolveDatabaseUrl" -Context 0,3
```

If direct shell commands succeed, iterate on the wrapper invocation site and fix the undefined parameter there. If not, collect the shell outputs and open an issue with the wrapper maintainers including the captured logs.

-- Canonicalized from docs/AGENTS-CANONICAL.md on 2026-04-17 as part of unify-agent-docs operation.
