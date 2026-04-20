---
plan name: convert-scripts
plan description: Convert scripts to TypeScript
plan status: active
---

## Idea

Convert existing shell and PowerShell scripts under scripts/ into TypeScript (ts-node) equivalents, add stricter header comments, improve error handling, and expand codemod globs to include app/, lib/, pages/, components/, and src/. Preserve originals during verification and run lint/type-check/verify rules per batch.

## Implementation

- Inventory all .sh and .ps1 scripts under scripts/ and categorize into batches (<=7 files per batch).
- Create plan file .opencode/commands/convert-scripts.plan.md listing batches, verification steps, and provenance requirements.
- For each batch: add TypeScript equivalents under scripts/ts/ that preserve behavior, include JSDoc header comments with TODO markers, and improve error handling. Do not delete originals.
- After adding a batch: run format, type-check, lint:strict, and verify:rules locally; generate a batch report in scripts/reports/report-<batch>.json. Stop and fix on failures.
- Once all batches pass, update scripts/README.md with TypeScript usage and provide a final summary and PR body including provenance lines. Optionally deprecate original scripts in a final batch.

## Required Specs

<!-- SPECS_START -->
<!-- SPECS_END -->
