Files read for implementing `centralize-schemas-and-refactor.plan.md`:

- actions/updateProfile.ts — ensure server-side schema and usages
- components/settings/settings-client-wrapper.tsx — remove duplicated schemas and import centralized ones
- components/layouts/settings-profile-form.tsx — confirm field names and defaultValues mapping
- lib/schemas/transfer.schema.ts — existing centralized transfer schema (for reference)
- tests/unit/updateProfile.test.ts — (read to know expected behaviors)

Rationale: these files contain the duplicated schema definitions or consume them; validating their structure reduces risk.
