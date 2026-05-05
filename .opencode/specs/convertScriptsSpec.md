# Spec: convertScriptsSpec

Scope: feature

Scope: feature

Spec: Convert shell and PowerShell scripts under scripts/ into TypeScript equivalents.

Requirements:

- Add TypeScript scripts under scripts/ts/ that preserve the original behavior of each .sh/.ps1 file.
- Ensure each TS file uses only Node built-ins (child_process, fs, path, readline) and supports running via `npx ts-node` or compiled Node.
- Add a strict JSDoc header block at top of each file with fields: Description, CreatedBy, TODO tags.
- Do not delete original .sh or .ps1 files. Keep originals for fallback until verification.
- Add robust error handling (catch exceptions, return non-zero exit codes on failures).
- Update scripts/codemod/find-process-env.ts to expand globs to include app/, lib/, pages/, components/, and src/ and to insert a stricter JSDoc TODO comment when --apply is used.
- Run verification locally: npm run format, npm run type-check, npm run lint:strict, npm run verify:rules.

Outputs:

- New TS files under scripts/ts/ for each batch.
- Updated scripts/codemod/find-process-env.ts.
- Batch report files under scripts/reports/report-<batch>.json (created by operator when running scripts locally).

Notes:

- Keep batch sizes <=7 files.
- Include provenance line in commit/PR body when committing.
