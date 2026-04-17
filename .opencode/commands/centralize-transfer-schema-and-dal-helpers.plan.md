# Centralize Transfer Schema and Add DAL Helper (Phase 1)

## Goals

- Centralize the Transfer Zod schema used by the Payment Transfer page into `lib/schemas/transfer.schema.ts` so server and client can share the same validation and types.
- Begin implementing small, focused changes that follow the repo rules: keep edits minimal, validate with TypeScript and formatting, and include provenance.

## Scope

- Create `lib/schemas/transfer.schema.ts` containing a Zod schema and exported TypeScript type.
- Update `components/payment-transfer/payment-transfer-client-wrapper.tsx` to import and use the centralized schema and type instead of defining them inline.

This plan intentionally covers only the Transfer schema centralization (a small-scope change). Later phases will add DAL helpers and presentational extractions.

## Target Files

- Add: `lib/schemas/transfer.schema.ts`
- Update: `components/payment-transfer/payment-transfer-client-wrapper.tsx`

## Risks

- Low. The change replaces a locally-defined schema with an equivalent centralized one. Risk of minor TypeScript or formatting issues which will be caught by `npm run type-check` and linters.
- If other files import the old local symbol by name (rare), they will be unaffected because we only change the local file to import the shared schema.

## Planned Changes

1. Add `lib/schemas/transfer.schema.ts` exporting `TransferSchema` and `TransferFormData` (with `.describe()` on fields per repo rules).
2. Update `components/payment-transfer/payment-transfer-client-wrapper.tsx`:
   - Remove local TransferSchema/type definitions.
   - Import `{ TransferSchema, type TransferFormData }` from `@/lib/schemas/transfer.schema`.
   - Keep existing resolver usage and form behaviour.

## Validation

- After changes, run:
  1. `npm run format` (formatting)
  2. `npm run type-check` (TypeScript)
  3. `npm run lint:strict` (linting)
  4. `npm run test:browser` (unit tests) — optional before proceeding to further phases

## Rollback or Mitigation

- Changes are additive and minimal. If an issue is detected, revert the commit. The original behaviour is preserved until other parts of the app are updated to use the new schema.

## Notes / Provenance

- Files inspected while preparing this plan:
  - `components/payment-transfer/payment-transfer-client-wrapper.tsx` — locate existing TransferSchema and usage
  - `components/payment-transfer/payment-transfer-server-wrapper.tsx` — confirm server wrapper pattern
  - `components/total-balance-box/total-balance-box.tsx` — example presentational candidate
  - `components/shared/wallets-overview.tsx` — example presentational candidate
  - `dal/transaction.dal.ts` — DAL patterns referenced for later phases

---

When this plan is accepted (by proceeding), implement steps 1-2 in a single small commit. Subsequent phases (DAL helper, presentational extraction) will be planned and implemented separately to keep each change under the repo's plan threshold.
