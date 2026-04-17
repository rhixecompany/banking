# Centralize Schemas & Refactor Related Wrappers

## Goals

- Centralize shared Zod schemas (Profile, Password, UpdateProfile) under `lib/schemas/` so server actions and client wrappers share a single source of truth.
- Reduce duplication and drift between server-side validation and client-side forms.
- Prepare for downstream work: hardening Server Actions, extracting presentational components, and adding DAL/type fixes.

## Scope

- Create `lib/schemas/profile.schema.ts` exporting `ProfileSchema`, `PasswordSchema`, and `UpdateProfileSchema`.
- Update `actions/updateProfile.ts` to import the server schema from the new file.
- Update `components/settings/settings-client-wrapper.tsx` to import `ProfileSchema` and `PasswordSchema` instead of re-defining them.
- Add provenance for files read during the change.

This plan intentionally targets a small set of files (<=7) so we can implement safely and validate quickly.

## Target Files

- Add: `lib/schemas/profile.schema.ts`
- Update: `actions/updateProfile.ts`
- Update: `components/settings/settings-client-wrapper.tsx`
- Add: `.opencode/commands/centralize-schemas-and-refactor.plan.md` (this file)

## Risks

- Type mismatches if imports are incorrect or if other modules relied on the exact exported names/types from `actions/updateProfile.ts` (we will keep exported runtime behavior and re-export types where appropriate).
- Lint/type errors may appear due to missing/unused imports after removing local schemas — we'll run `npm run type-check` and `npm run lint:strict` to catch them.

## Planned Changes

1. Create `lib/schemas/profile.schema.ts` with the three schemas, including descriptive metadata for fields.
2. Modify `actions/updateProfile.ts` to import `UpdateProfileSchema` and export `UpdateProfileInput` type derived from it.
3. Modify `components/settings/settings-client-wrapper.tsx` to import `ProfileSchema` and `PasswordSchema` and remove its local definitions.
4. Run local validations (format, type-check, lint) and fix small issues discovered.

## Validation

- Run: `npm run format` then `npm run type-check` and `npm run lint:strict`.
- Run unit tests affected by settings/updateProfile if any (e.g., `npm run test:browser` or targeted vitest commands).

## Rollback / Mitigation

- Changes are small and staged; if a problem occurs, revert the three updated files to their previous state.

## Provenance (files to read before implementation)

- `actions/updateProfile.ts` — ensure server-side expectations
- `components/settings/settings-client-wrapper.tsx` — remove local schema duplication
- `components/layouts/settings-profile-form` — confirm usage of form fields and names
- `tests/unit/updateProfile.test.ts` and `tests/unit/settings-profile-form.test.tsx` — validate tests after changes
- `lib/schemas/` — (new)

## Next Steps

1. Implement the schema file and update the two consumer files.
2. Run format/type-check/lint and fix any issues.
3. If green, push branch `chore/centralize-schemas` and open a PR (ask user before pushing).
