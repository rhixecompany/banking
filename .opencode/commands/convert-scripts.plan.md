# Plan: convert-scripts

Short description: Convert and consolidate repository scripts to TypeScript with ts-morph AST-safe edits, add dry-run/apply modes, consolidate platform wrappers to thin orchestrators, delete duplicate JS scripts, and update package.json. Validate after each batch.

Batches:

- Batch 0: Prep utilities & plan file
  - Add shared TS utilities under scripts/ts/utils (ast, cli, fs-safe)
  - Commit: chore(scripts): add ts-morph utilities and plan file
  - Verification: npm run format && npm run type-check && npm run lint:strict

  Actions completed:
  - Added scripts/ts/utils/{cli,ast,fs-safe}.ts
  - Added scripts/ts/entrypoints/opencode-mcp-cli.ts and deploy-cli.ts
  - Converted codemod find-process-env to use ts-morph and dry-run/apply
  - Removed duplicate JS codemod runners and provenance JS
  - Added scripts/ts/tools/discover-app-pages.ts and removed JS duplicate
  - Updated many wrappers to forward to tsx entrypoints and updated package.json

- Batch 1: Codemod & verification entrypoints
  - Standardize scripts/codemod/\* to use utils and support --dry-run/--apply
  - Remove .js duplicates in codemod folder
  - Update scripts/run-verify-and-validate to use CLI helpers

- Batch 2: Deploy & docker conversion
  - Consolidate deploy scripts into scripts/ts/deploy/\*
  - Replace deploy/\*.sh/.ps1/.bat with thin orchestrators
  - Update package.json entries to call tsx scripts/ts/deploy/deploy.ts

- Batch 3: Cleanup & docker quickstart
  - Consolidate cleanup scripts and docker quickstart into scripts/ts/\*
  - Replace wrappers and update package.json

- Batch 4: Server & certs
  - Consolidate server scripts into scripts/ts/server/\*
  - Replace wrappers and update package.json

- Batch 5: Misc utilities & provenance
  - Standardize mcp-runner, orchestrator, plan-ensure, provenance tools
  - Remove legacy tools like scripts/tools/exec-wrapper.js and scripts/temp-write.ts

- Batch 6: Final cleanup
  - Delete .js duplicates when .ts counterparts exist
  - Update scripts/README.md with examples for --dry-run and --apply
  - Final verify

Verification steps (per-batch):

- Run: npm run format && npm run type-check && npm run lint:strict && npm run verify:rules
- Smoke-run representative scripts with --dry-run and expect JSON + summary on stdout

Commit/PR rules:

- Commit prefix: chore(scripts):
- Include provenance line from scripts/provenance/generate-provenance.ts in PR body
- Keep changes small: <=7 files per patch where possible

Backups and safety:

- TS scripts will create timestamped .bak backups alongside modified files when run with --apply
- Dry-run prints human summary + JSON to stdout and does not write files

Deletion policy:

- Delete .js duplicates that have a .ts counterpart immediately (aggressive)

Project conventions:

- Use repo tsconfig.json for ts-morph Project
- Use tsx as runtime for package.json script entries

End of plan.
