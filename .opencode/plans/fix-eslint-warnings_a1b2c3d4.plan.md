# Fix ESLint Warnings — Targeted Fixes

## Goals

- Address a focused set of ESLint warnings that block `npm run lint:strict` in CI for the Banking repo.
- Make minimal, safe changes to bring lint warnings down (process.env usage, console.\* methods, and small test fixture fixes) without broad refactors.

## Scope

- Files targeted for edits (small, contained changes):
  - app/api/**playwright**/set-cookie/route.ts
  - scripts/db/apply-migrations.ts
  - scripts/db/apply-select-migrations.ts
  - tests/fixtures/auth.ts
  - lib/env.ts (add optional PLAYWRIGHT_BASE_URL export)

Changes are limited to: importing `env` from `@/lib/env` where appropriate, replacing direct `process.env` reads with `env.*`, replacing `console.log` with allowed console methods (`console.warn` / `console.error`), and small safe adjustments to test fixtures to align with lint rules.

## Risks

- Low: changes are small and local to scripts and test fixtures. There is a small risk of tests assuming different defaults for PLAYWRIGHT_BASE_URL; we will preserve existing defaulting behavior.

## Planned Changes

1. Add PLAYWRIGHT_BASE_URL mapping to `lib/env.ts` so tests and scripts can use `import { env } from '@/lib/env'` instead of reading `process.env` directly.
2. Update `app/api/__playwright__/set-cookie/route.ts` to import `env` and use `env` values for gating the test-only endpoint.
3. Update `scripts/db/apply-migrations.ts` and `scripts/db/apply-select-migrations.ts` to use `env.DATABASE_URL`/`env.NEON_DATABASE_URL` and replace `console.log` with `console.warn`/`console.error` as appropriate.
4. Update `tests/fixtures/auth.ts` to import `env` and use `env.NEXTAUTH_SECRET` and `env.PLAYWRIGHT_BASE_URL` to align with core standards.

## Validation

- Run `npm run type-check` (tsc --noEmit)
- Run `npm run lint:strict` and ensure warnings are reduced (aim for 0 warnings); if further warnings remain, prepare next patches.
- Run unit tests subset (optional).

## Rollback

- Changes are isolated; revert the working-tree edits if any problem arises.

## Next Steps After Approval

- Apply the planned patches to working tree and re-run validations. Create additional targeted patches for remaining lint warnings if necessary.
