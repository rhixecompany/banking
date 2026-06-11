# Audit & Enhance Plan

## Goals

- Audit repository docs and code to identify gaps in database schema, Server Actions, Zod schemas, DALs, pages, tests, and custom components.
- Produce markdown inventories under `docs/` for app pages, test context, and custom components.
- Propose and apply minimal, safe schema enhancements to `database/schema.ts` where fields/tables are missing.
- Audit and improve Actions, Zod schemas, and DALs for validation, DRY, and N+1 avoidance.
- Create reusable dynamic components under `components/layouts` where appropriate.
- Make scripts AST-safe with dry-run support (proposal + sample changes for critical scripts).

## Scope

- Read and modify files across: `docs/`, `database/schema.ts`, `app/`, `lib/actions` & `actions/`, `lib/dal` & `dal/`, `components/` (skip `components/ui`), `tests/`, `scripts/`.
- Changes will be small, incremental, and validated via format/type-check/lint before committing.

## Target Files

- `docs/**/*.md`
- `database/schema.ts`
- `app/**/*.{ts,tsx}`
- `lib/actions/**/*.ts`, `actions/**/*.ts`
- `lib/dal/**/*.ts`, `dal/**/*.ts`
- `components/**/*.tsx` (exclude `components/ui/**`)
- `tests/**/*.{ts,tsx}`
- `scripts/**/*.{sh,ps1,js,ts}`

## Risks

- Schema changes may affect running databases. Mitigation: non-destructive column additions and migration plan.
- Large refactors may introduce regressions. Mitigation: small commits, tests, and validation after each change.

## Planned Changes (order)

1. Read-only audit and produce three docs in `docs/`: `app-pages.md`, `test-context.md`, `custom-components.md`.
2. Audit `database/schema.ts` and produce a proposed patch for missing tables/fields.
3. With your approval, apply minimal schema edits and generate migrations.
4. Audit Actions/Zod/DAL and produce small fixes (zod .describe messages, shared schemas, avoid N+1).
5. Create `components/layouts` reusable primitives and update components incrementally.
6. Propose script rewrites with dry-run; implement critical scripts as examples.

## Validation

- After each commit run:
  - `npm run format:check`
  - `npm run type-check`
  - `npm run lint:strict`
  - Unit tests: `npm run test:browser` (faster)
  - E2E as final check: `npm run test:ui` (ensure port 3000 is free)

## Rollback / Mitigation

- Keep changes minimal and in separate commits. For DB changes: add nullable columns, backfill, then set NOT NULL in a follow-up migration.

## Validation Checklist

- [ ] Plan file added
- [ ] Docs inventories created
- [ ] Schema proposal created
- [ ] Approve schema changes

## Next Step

I will run a read-only audit and create the three docs under `docs/` and a findings summary. I will not modify `database/schema.ts` until you approve proposed schema edits.
