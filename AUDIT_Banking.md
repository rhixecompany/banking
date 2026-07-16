# AUDIT_Banking.md

> Read-only repo-management audit — Phases 0, 2, 3.
> Destructive phases (1: branch delete/push, 4: create CI) HELD for user approval.
> Generated: 2026-07-16

## Overview
- **Type**: Next.js (React/TypeScript) web application with Drizzle ORM backend.
- **Docs present**: `README.md`, `AGENTS.md`, `ARCHITECTURE.md`, `API_REFERENCE.md`, plus extensive guides (DEPLOYMENT, DEVELOPMENT, TESTING, SECURITY, etc.).
- **Tooling**: Bun (bun.lock present), Next.js, Playwright, ESLint, Prettier, Husky, Drizzle.
- **Manifest**: `package.json` present; `requirements.txt` present (Python deps, e.g. for scripts).

## Disk Usage
- `18M` (excludes `.git`, `node_modules`, `venv`, `__pycache__`, `dist`, `build`, `target`).
- Note: `node_modules/` and `tsconfig.tsbuildinfo` (1 MB) and `bun.lock` (599 KB) are the largest non-source artifacts on disk.

## Entrypoint
- Detected: `"start": "next start"` in `package.json`.
- No Python `main.py`/`def main` entry found.
- Primary app entry: Next.js `src/` directory.

## Gitignore Audit (missing entries)
`.gitignore` EXISTS (2692 bytes). Coverage check against the standard baseline:

| Entry | Status |
|-------|--------|
| `node_modules/` | PRESENT |
| `.env` | PRESENT |
| `*.pyc` | **MISSING** |
| `__pycache__/` | **MISSING** |
| `dist/` | PRESENT |
| `build/` | PRESENT |
| `.next/` | PRESENT |
| `venv/` | **MISSING** |
| `.DS_Store` | PRESENT |

**Missing entries:** `*.pyc`, `__pycache__/`, `venv/`
- Impact: low/medium. There is a `requirements.txt` (Python tooling/scripts), so stray `.pyc`/`__pycache__/` and any local `venv/` could be committed if generated. Verified `.env` is NOT currently tracked.

## Dependency Audit (manifest type, top deps, audit-tool availability)
- **Manifest type**: `package.json` + `bun.lock` (Bun package manager, v1.3.14).
- **Total installed deps**: 2270 (from `bun pm ls`).
- **Top deps (sample)**: `@auth/drizzle-adapter@1.11.2`, `@base-ui/react@1.4.1`, `@dnd-kit/core@6.3.1`, `@playwright/test@1.59.1`, `@radix-ui/*`, `@hookform/resolvers@5.2.2`, `@eslint/js@10.0.1`.
- **Audit tool availability**: `bun audit` exists in Bun 1.3.x. NOT RUN here (read-only audit; held to avoid proactive network calls). Recommend running `bun audit` under user approval.
- **Python deps** (`requirements.txt`, 392 bytes): minimal; not separately enumerated. `pip-audit` not required for this JS-centric project.
- **Outdated/known-bad flags**: none flagged from lockfile names only at this pass.

## Branch State
```
* development
  production
```
- Two branches: `development` (current) and `production`.
- No stray `master` or orphan branches. Branch naming follows the `development`/`production` convention expected by the repo-management prompt.

## Destructive Phases HELD (pending approval)
- **Phase 1** (branch deletion / push): HELD. No branches slated for deletion; nothing pushed.
- **Phase 4** (create CI): HELD. No CI workflow file created.

> Next step (approval required): run `bun audit`, then optionally proceed to Phase 1/4.
