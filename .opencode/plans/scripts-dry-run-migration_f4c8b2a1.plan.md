# Plan: scripts-dry-run-migration_f4c8b2a1

Version: 2026-04-13

Owner: (Prepared by assistant — no commit applied)

## Summary

This plan implements the repository-wide scripts dry-run migration. It documents what will be changed, the batches of patches to prepare, the discovery results, and the exact choices you confirmed during the interactive questions.

## Goals

- Ensure every script under `scripts/**` that mutates external state (files, DB, system) supports a safe `--dry-run` mode and non-interactive flags.
- Centralize filesystem mutating operations behind `scripts/utils/io.ts` that honors:
  - CLI `--dry-run` / `-n` (highest precedence)
  - env `DRY_RUN` == `true|1`
  - `globalThis.__SCRIPTS_DRY_RUN === true`
- Mask secrets in dry-run output and prefer `lib/env.ts` for env access when appropriate.
- Add smoke checks to `scripts/validate.ts` and surface a small CI job to run `npx tsx scripts/validate.ts --all` as a blocking check.

## User choices recorded

- Branch name for staging patches: `feat/scripts-dryrun`
- Update `package.json` validate script: YES (include `npx tsx scripts/validate.ts --all` if not present)
- CI changes: produce snippet and include patch (you requested both)
- Destructive ops: require BOTH `RUN_DESTRUCTIVE=true` AND `--yes` flag to run destructive operations (recommended)
- CLI flags: adopt recommended defaults: `--dry-run` / `-n`, `--yes` / `-y`, `--force`, `--verbose`, `--json`
- Dry-run logging format: Both human and JSON (`--json` to emit machine-readable lines)
- Dry-run preview masking length: 200 characters
- Secrets handling: Mask & convert env usage (update scripts to prefer `lib/env.ts` where appropriate)
- Seed scripts: Include them in migration with simulated `--dry-run` and gating for real runs (require `RUN_DESTRUCTIVE` + `--yes`)
- Files excluded from edits: none
- Patch granularity: Batch per patch (recommended)
- Patch storage path: `patches/` (repo root)
- Create plan file now: (this file)

## Discovery summary (read-only)

I ran a read-only discovery across `scripts/**` and produced a prioritized list of files that either:

- create/modify/delete filesystem entries (fs write/mkdir/unlink)
- directly read `process.env` or otherwise reference secrets
- spawn child processes (child_process.spawn / exec)

High-priority candidates (mutate FS or need dry-run):

- scripts/export-data.ts (mkdirSync, writeFileSync)
- scripts/export-json.ts (mkdirSync, writeFileSync)
- scripts/generate/component.ts (mkdirSync, writeFileSync)
- scripts/generate/action.ts (writeFileSync)
- scripts/generate/dal.ts (writeFileSync helper + multiple writes)
- scripts/generate/feature.ts (mix of writeFile helper and mkdirSync)
- scripts/transform/zod-meta-to-describe.ts (writeFileSync; already supports --dry-run/--apply)
- scripts/utils/template.ts (writes README/opencode files)
- scripts/temp-write.ts (adhoc write)
- scripts/seed/create-plaid-tokens.ts (writes seed config)
- scripts/seed/run.ts & scripts/seed/seed-data.ts (DB seed logic — sensitive)
- scripts/mcp-runner.ts (spawns child processes)
- scripts/validate.ts (already orchestrates checks and references generator scripts)

There are many shell/batch helper scripts across `scripts/server/`, `scripts/docker/`, `scripts/cleanup/` etc. They will be reviewed in a later batch; high priority is to standardize TS scripts and seed scripts first.

## Batches & deliverables

The work will be produced as patch files in `patches/` (one patch per batch) and will NOT be committed/pushed. Each patch will contain:

- A short description of changes
- The new or modified file contents (full snippets) ready to be applied
- Instructions to apply and verify the changes locally

- Batch 0 — Plan & discovery (this file) — DONE
- Batch 1 — Core helper + migrate generators (patch: `patches/01-core-helper-and-generators.md`)
  - Add `scripts/utils/io.ts`
  - Migrate `scripts/generate/{feature,dal,component,action}.ts` to `writeFile` / `mkdirp`
  - Update `scripts/verify-agents.{sh,ps1}` to call TS scripts with `--dry-run`

- Batch 2 — Seed scripts (patch: `patches/02-seed-scripts.md`)
  - Add dry-run simulation and gated destructive confirmation
  - Keep DB writes guarded: require `RUN_DESTRUCTIVE=true` + `--yes`

- Batch 3 — Exports & templates (patch: `patches/03-exports-templates.md`)
  - Migrate `scripts/export-*.ts` and `scripts/utils/template.ts` to use helper

- Batch 4 — Shell wrappers + cross-platform scripts (patch: `patches/04-shell-wrappers.md`)
  - Update wrappers to call TS scripts with `--dry-run` and not print secrets during dry-run

- Batch 5 — Validate & CI (patch: `patches/05-validate-ci.md`)
  - Update `scripts/validate.ts` to run dry-run smoke checks of the generator scripts
  - Add GitHub Actions job snippet that runs `npx tsx scripts/validate.ts --all` (and include patch or snippet per your choice)

- Batch 6 — Final audit & docs (patch: `patches/06-docs-and-audit.md`)
  - Run grep audit, fix any remaining direct fs writes, update `scripts/README.md` and `.opencode/instructions/12-scripts-patterns.md`

## Validation & verification

After you review patches and approve applying them I will (on request) run the following locally (read-only or dry-run where appropriate):

- npx tsx scripts/validate.ts --all
- npm run type-check
- npm run lint:strict
- Generator dry-runs (examples):
  - npx tsx scripts/generate/feature.ts example --dry-run
  - npx tsx scripts/generate/dal.ts user --dry-run

## Safety & rollback

- No destructive scripts will be executed automatically. All destructive actions require `RUN_DESTRUCTIVE=true` AND `--yes`.
- Patches are small and per-batch; revert by restoring original files if needed.

## Next steps (what I will produce now)

1. Create this plan file (done)
2. Produce patch files for Batch 1 (core helper + generators) and Batch 5 (validate/CI) in `patches/` for your review. These are _proposals_ and will not be applied unless you tell me to apply them.

If you want me to _apply_ changes to the working tree (but not commit), reply: "apply batch 1" (or "apply all batches"), and I will modify the working tree accordingly and leave changes unstaged.

If you want me to stop here or adjust the plan, reply with changes.

## Estimated effort (rough)

- Discovery & plan: 1–2 hours (completed)
- Batch 1: 0.5–1 hour
- Batch 2: 1–2 hours
- Batch 3: 0.5–1 hour
- Batch 4: 0.5 hour
- Batch 5: 0.5–1 hour
- Batch 6 & final verification: 1–2 hours

Total: 5–9 hours of focused work (spread across batches).

---

End of plan
