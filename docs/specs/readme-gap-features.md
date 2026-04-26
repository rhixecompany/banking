# Spec: readme-gap-features

Scope: feature

# Enhanced README + Gap Closure (Feature Spec)

## Goal

Create an enhanced, accurate root README (contributors + deployers) and ensure the repository’s documentation and the implemented product features are aligned. Any feature claimed by the README should either be implemented (with tests) or removed/rewritten so the docs remain truthful.

## Constraints (Repo Rules)

- Use Bun for install/run instructions (`bun install`, `bun run <script>`).
- Do not read `process.env` directly in app code; use `app-config.ts` (preferred) or `lib/env.ts` (compat) with the existing exception(s) honored.
- UI/route components must not import DB clients directly; use `dal/**` helpers.
- All writes must be Server Actions in `actions/**` using the enforced pattern ("use server", authenticate early when protected, validate with Zod, return `{ ok, error? }`).
- Home page must remain public/static (no auth/DB/env reads that violate rules).

## Scope

- Audit current root `README.md` and generator template `templates/README.template.md` against:
  - Actual routes and protected areas
  - Current package scripts and local dev workflow
  - Env var setup and validation docs
  - Deployment docs under `docs/`
- Implement missing product/code features discovered in that audit (or adjust docs to remove stale claims).
- Update `docs/**` to match the resulting reality.
- Update README generation pipeline so the enhanced README is produced by `bun run registry:generate`.

## Non-Goals

- Adding entirely new product surface area not implied by current docs/code (unless explicitly approved after the audit).
- Rewriting the whole documentation set; only correctness + alignment for referenced docs.

## Deliverables

- Enhanced README content (generated output) with:
  - Accurate Quick Start (Bun)
  - Correct env file guidance and a link to env var docs
  - Correct protected route references
  - Minimal, high-value architecture pointers and verification commands
  - Links to existing deployment guides (Vercel/Railway/Docker/etc) that resolve
- Implemented missing app/product features (as defined by audit) with appropriate tests.
- Updated `docs/**` pages referenced by README, with no broken links.

## Acceptance Criteria

- `bun run registry:generate` produces the enhanced `README.md` (no manual-only drift).
- README commands match `package.json` scripts and repo rules.
- No critical rule violations: `bun run verify:rules` passes.
- Code quality gates pass for touched areas: `bun run format`, `bun run type-check`, `bun run lint:strict`.
- If product behavior/routing changes: `bun run build` passes; targeted tests cover new behavior.
- All README links to `docs/**` resolve to existing files.

## Open Questions (Resolved During Audit)

- Which specific “missing product features” exist: define per-gap checklist; each gap gets a decision: implement vs remove from docs.
