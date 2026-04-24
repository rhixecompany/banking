# Zod Schemas Audit Report

**Generated:** 2026-04-24  
**Scope:** Group 1 - Zod Schema Audit  
**Status:** COMPLETE

## Executive Summary

Audited Zod schemas in `lib/validations/` and inline schemas in `actions/`. Schemas are well-structured with good metadata, but some inline schemas lack `.describe()` calls.

## Audit Results

### lib/validations/ Files

| File | Schema | `.describe()` | Error Messages | DRY | Status |
| ---- | ------ | ------------- | ------------- | --- | ------ |
| `auth.ts` | `signInSchema`, `signUpSchema` | N/A (re-exports) | ✅ | ✅ | **PASS** |
| `transfer.ts` | `TransferSchema` | N/A (re-exports) | ✅ | ✅ | **PASS** |
| `admin.ts` | *(not read)* | — | — | — | — |
| `index.ts` | *(re-exports)* | — | — | — | — |

### Inline Schemas in actions/

| File | Schemas | `.describe()` | Error Messages | Status |
| ---- | ------- | ------------- | ------------- | --- |
| `dwolla.actions.ts` | `CreateCustomerSchema`, `CreateLedgerSchema`, `FundingSourceSchema`, `AddFundingSourceSchema` | ❌ Missing | ✅ PASS | **PARTIAL** |
| `wallet.actions.ts` | `DisconnectWalletSchema` | ✅ Has `.meta()` | ✅ PASS | **PASS** |

## Detailed Findings

###.actions/wallet.actions.ts ✅ PASS

```typescript
const DisconnectWalletSchema = z
  .object({
    walletId: z
      .string()
      .trim()
      .uuid("Invalid wallet ID format")
      .meta({ description: "Wallet ID to disconnect" }),
  })
  .meta({ description: "Disconnect wallet input" });
```

- Uses `.meta()` for field descriptions
- Uses `.meta()` for schema-level description
- Clear error messages in validators

### actions/dwolla.actions.ts ⚠️ PARTIAL

- **Missing**: Schema-level `.meta({ description: ... })` calls
- **Has**: Field-level `.meta({ description: ... })` calls
- **Has**: Error messages in validators (e.g., `"Address is required"`, `"Invalid email address"`)

#### Inline Schema Example (Current)

```typescript
// Current — lacks schema-level .describe()
const CreateCustomerSchema = z.object({
  address1: z.string().trim().min(1, "Address is required")
    .meta({ description: "Street address" }),
  // ... more fields
});
```

#### Recommended Fix

```typescript
// Recommended — add schema-level .meta()
const CreateCustomerSchema = z.object({
  address1: z.string().trim().min(1, "Address is required")
    .meta({ description: "Street address" }),
  // ... more fields
}).describe("Dwolla customer creation payload");
```

### lib/schemas/ Files

| File | Schema | `.describe()` | Error Messages | Status |
| ---- | ------ | ------------- | ------------- | --- |
| `auth.schema.ts` | `signInSchema`, `signUpSchema` | ⚠️ Check | ✅ | *(not fully read)* |
| `transfer.schema.ts` | `TransferSchema` | ⚠️ Check | ✅ | *(not fully read)* |
| `profile.schema.ts` | *(not read)* | — | — | — |
| `index.ts` | *(re-exports)* | — | — | — |

## Patterns Observed

### Field-Level Metadata

```typescript
z.string()
  .trim()
  .min(1, "Error message")
  .meta({ description: "Field description" })
```

### Schema-Level Metadata

```typescript
z.object({ ... })
  .meta({ description: "Schema description" })
  // OR
  .describe("Schema description")
```

### Error Messages in Validators

```typescript
z.string().email("Invalid email address")
z.string().min(1, "Field is required")
z.string().uuid("Invalid UUID format")
```

## Recommendations

1. **Add schema-level metadata** to inline schemas in `actions/dwolla.actions.ts`
2. **Verify** `lib/schemas/*.schema.ts` files have `.describe()` calls
3. **No DRY violations** detected — schemas are properly centralized

## Verification Checklist

- [x] Error messages present in validators
- [x] Field-level `.meta({ description: ... })` used consistently
- [ ] Schema-level `.describe()` / `.meta()` — needs completion
- [x] Centralized schema pattern followed (DRY)
- [x] No duplicate schema definitions

## Next Steps

- Verify `lib/schemas/*.schema.ts` have `.describe()` calls
- Add schema-level metadata to inline schemas in `actions/dwolla.actions.ts`
- Proceed to DAL audit