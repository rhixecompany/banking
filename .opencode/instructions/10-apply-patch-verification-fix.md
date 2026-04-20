---
description: How to use apply_patch safely and verify edits
applyTo: "**/*"
lastReviewed: 2026-04-20
---

# Apply Patch Verification

Short checklist

- When making text edits via automation, always read the file with the `read` tool before calling `apply_patch`. This prevents mismatches and avoids blind edits.
- After applying patches run:
  - npm run format
  - npm run type-check
  - npm run verify:rules to surface formatting, type, and repository-rule issues immediately.

This file documents a specific, common wrapper error (and how to debug it), and it adds concrete, cross-platform commands you can run locally to bypass the wrapper and re-run the repository verification script.

---

## Troubleshooting: "paths[0] property must be of type string" wrapper error

Symptom

- Agent/tooling wrapper fails early with: "The 'paths[0]' property must be of type string, got undefined"
- This happens while the agent attempts to execute a command via the tooling wrapper (the agent runtime's bash wrapper), and the wrapper terminates before the underlying shell command runs.

Where the wrapper comes from

- The error normally originates from the agent runtime's tooling layer (the "bash" tool wrapper provided to agents). This wrapper validates its inputs (command, args, workdir, paths) before executing the OS shell command.
- The wrapper is part of the agent/tooling runtime — not Git, not the verify script, and not your repository code.

Root cause

- The wrapper receives an undefined or invalid file/path/workdir parameter (often because the caller passed an undefined variable or omitted the workdir).
- Because validation runs before spawning the real command, you'll see this error even when the same command runs fine locally.

Immediate mitigations (quick)

1. Bypass the wrapper and re-run the exact command locally in your shell (Bash or PowerShell) — this verifies whether the command itself is valid.
2. If you control the agent code, pass an explicit string workdir (absolute or relative) to the wrapper. Avoid passing undefined.
3. Add logging in the wrapper caller to dump the arguments before the wrapper validates them (capture command, args, workdir, and any file paths).
4. If you cannot change the caller right away, run the verify-rules command locally (examples below) and collect outputs to triage.

When to open an issue against the wrapper

- If the caller is passing valid strings but the wrapper still rejects them, collect the following and open an issue with the wrapper maintainers:
  - exact wrapper invocation (command + args + workdir)
  - the wrapper error and full stack trace
  - outputs of the cross-platform checks below (git status, file listing, node/tsx versions)
  - the repo path where you ran the command

---

## Canonical commands to run the project's verify-rules script

The repository provides both an npm script and a direct `tsx` invocation.

Notes:

- The repo has two useful npm scripts:
  - verify:rules — runs the script interactively (prints output)
  - verify:rules:ci — runs with CI mode and writes JSON output to .opencode/reports/rules-report.json
- You can pass `--ci` and `--output <path>` to the script to enable CI behavior and specify the output path. The canonical CI JSON path used by CI is: .opencode/reports/rules-report.json

Bash examples

- Run the default interactive check:
  - npm run verify:rules
- Run in CI mode and write JSON output to the default path:
  - npm run verify:rules -- --ci --output .opencode/reports/rules-report.json
  - or use the convenience script:
    - npm run verify:rules:ci
- Direct tsx invocation (bypasses npm):
  - npx tsx scripts/verify-rules.ts --ci --output .opencode/reports/rules-report.json

PowerShell examples

- Run the default interactive check:
  - npm run verify:rules
- Run in CI mode and write JSON output:
  - npm run verify:rules -- --ci --output .opencode/reports/rules-report.json
  - or
    - npm run verify:rules:ci
- Direct tsx invocation:
  - npx tsx scripts/verify-rules.ts --ci --output .opencode\reports\rules-report.json

Inspect generated report (bash)

- cat .opencode/reports/rules-report.json | jq '.' # pretty-print if jq installed
- less .opencode/reports/rules-report.json

Inspect generated report (PowerShell)

- Get-Content .\opencode\reports\rules-report.json -Raw | ConvertFrom-Json

Note: if you run `npm run verify:rules` without `--ci` the script prints findings to stdout; CI mode (`--ci`) is used when you want machine-readable JSON output.

---

## Guidance split by role

A. For agent authors (apply_patch / read tooling)

- Always call the `read` tool to fetch current file contents before producing an `apply_patch`. This prevents accidental overwrites and ensures your patch is based on latest content.
- apply_patch expectations:
  - Use the file-oriented patch format (header + +/- lines). See examples in other .opencode instruction files.
  - Ensure file paths in the patch header are valid strings. Do not pass undefined or null.
- When using the agent-provided bash wrapper (functions.bash / bash tool):
  - Pass an explicit workdir string when the workspace is not the repo root. Example (pseudo-code call):
    - bash({ command: "git status --porcelain --branch", workdir: "C:\\Users\\Alexa\\Desktop\\SandBox\\Banking" })
  - Validate all path arguments (e.g., file paths passed to the wrapper) before calling the wrapper.
- If the wrapper returns the 'paths[0]' error:
  - Re-run the same command using the direct tsx invocation listed above (or ask a human to run it locally) to confirm the underlying command works.
  - Log the wrapper call arguments and include them in any bug report.
- Follow repo small-change rules:
  - Keep automated edits small and reversible. Do not modify more than 5 files in a single automated patch without creating a plan (.opencode/commands/\*.plan.md).
  - Add a one-line provenance in the commit/PR body when automated edits are made.

B. For human maintainers (local shell / manual debugging)

- If you see the wrapper error while interacting with an agent or CI, reproduce locally using the exact commands below to bypass the wrapper and collect troubleshooting data.

Cross-platform checks to debug the wrapper and verify git state

Bash (Linux / macOS / Git Bash / WSL)

- Verify tooling versions and environment
  - git --version
  - node --version
  - npx --version
  - npx tsx --version
- Verify repo and branch state
  - pwd
  - ls -la
  - git rev-parse --abbrev-ref HEAD
  - git status --porcelain --branch
  - git log -n 5 --oneline
  - git rev-parse --show-toplevel
- Verify verify-rules script exists
  - test -f scripts/verify-rules.ts && echo "verify-rules.ts exists" || echo "verify-rules.ts missing"
  - sed -n '1,120p' scripts/verify-rules.ts
- Run verification (bypass wrapper)
  - npm run verify:rules -- --ci --output .opencode/reports/rules-report.json
  - or
  - npx tsx scripts/verify-rules.ts --ci --output .opencode/reports/rules-report.json
- Inspect output
  - ls -la .opencode/reports
  - cat .opencode/reports/rules-report.json | jq '.'

PowerShell (Windows)

- Verify tooling versions and environment
  - Get-Command git
  - git --version
  - node --version
  - npx --version
  - npx tsx --version
- Verify repo and branch state
  - pwd
  - Get-ChildItem -Force
  - git rev-parse --abbrev-ref HEAD
  - git status --porcelain --branch
  - git log -n 5 --oneline
  - git rev-parse --show-toplevel
- Verify verify-rules script exists
  - Test-Path .\scripts\verify-rules.ts
  - Get-Content .\scripts\verify-rules.ts -TotalCount 120
- Run verification (bypass wrapper)
  - npm run verify:rules -- --ci --output .opencode\reports\rules-report.json
  - or
  - npx tsx scripts/verify-rules.ts --ci --output .opencode\reports\rules-report.json
- Inspect output
  - Get-ChildItem .opencode\reports
  - Get-Content .opencode\reports\rules-report.json -Raw | ConvertFrom-Json

Collect these outputs and include them when filing a wrapper/agent bug. They will prove the underlying command works and highlight where the wrapper validation fails.

---

## Quick triage flow (recommended)

1. Agent run fails with wrapper validation error.
2. Reproduce the failing verify-rules invocation locally (use the exact `npx tsx` or `npm run` command above).
3. If the local run succeeds, inspect the wrapper caller code (the place where the agent invoked `bash` or the tooling wrapper) for undefined workdir/path arguments.
4. If local run fails too, capture the script stdout/stderr and open an issue — include the verify-rules output (.opencode/reports/rules-report.json when run with --ci) and the other diagnostics above.
5. If you must continue work immediately, manually run the verify:rules command locally and proceed after triaging the issues it reports.

---

## Notes / repository rules reminders

- Before opening a PR, run:
  - npm run format && npm run type-check && npm run lint:strict && npm run verify:rules
- Keep automated edits small — if you will touch more than 5 files, create a plan under .opencode/commands/ as required by repository policy.
- Do NOT commit secrets (.env, tokens). Use app-config.ts / lib/env.ts helpers rather than direct process.env reads when updating code.
