---
description: Convert package manager from npm to bun
applyTo: "**"
status: complete
phase: 1
updated: 2026-04-24
---

# Plan: Convert Package Manager from npm to Bun

## Summary

Switch the Banking repository from npm to bun as the package manager.

## Status: COMPLETE ✓

## Changes Made

### 1. package.json ✓

- All `npm run` → `bun run`
- All `npx` → `bunx`
- `npm ci` → `bun install --frozen-lockfile`
- `npm cache` → `bun pm cache`
- `npm-check-updates` → `bun-upgrade-all`
- clean:all removes `bun.lockb` instead of `package-lock.json`

### 2. GitHub Workflows ✓ (~10 files)

- `.github/workflows/ci.yml`
- `.github/workflows/vercel-preview.yml`
- `.github/workflows/copilot-setup-steps.yml`
- `.github/workflows/plan-check.yml`
- `.github/workflows/verify-agents.yml`
- `.github/workflows/docker-security.yml`
- `.github/workflows/generate-readme.yml`
- `.github/workflows/validate-pr.yml`
- `.github/workflows/contributors.yml`

### 3. Docker ✓

- `compose/dev/node/Dockerfile` - npm ci → bun install
- `scripts/docker/entrypoint.sh` - npm ci → bun install

### 4. opencode.json ✓

- `.opencode/opencode.json` - all `npx` → `bunx`

### 5. Lockfile ✓

- Renamed `package-lock.json` to `package-lock.json.bak` (backup)

## Manual Steps Needed

1. Run `bun install` to generate bun.lockb
2. Delete the backup: `del package-lock.json.bak`
3. Verify: `bun run build && bun run type-check`

---

_Provenance: user request to switch from npm to bun_
