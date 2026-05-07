# Test Context Inventory

## Overview

Generated: 2026-05-07 Source: `src/tests/**`

## Vitest Unit Tests (47 specs)

| Spec | Path |
| --- | --- |
| admin.actions | `src/tests/unit/admin.actions.test.ts` |
| currency-precision | `src/tests/unit/currency-precision.test.ts` |
| dashboard-server-wrapper | `src/tests/unit/dashboard-server-wrapper.test.ts` |
| dwolla | `src/tests/unit/dwolla.test.ts` |
| dwolla.actions | `src/tests/unit/actions/dwolla.actions.test.ts` |
| error-tracking | `src/tests/unit/error-tracking.test.ts` |
| generate-markdown-catalog-script | `src/tests/unit/generate-markdown-catalog-script.test.ts` |
| lib/encryption | `src/tests/unit/lib/encryption.test.ts` |
| lib/utils | `src/tests/unit/lib/utils.test.ts` |
| lib/validation-utils | `src/tests/unit/lib/validation-utils.test.ts` |
| markdown-catalog | `src/tests/unit/markdown-catalog.test.ts` |
| mcp-runner.parse | `src/tests/unit/mcp-runner.parse.test.ts` |
| mcp-runner.verify | `src/tests/unit/mcp-runner.verify.test.ts` |
| my-wallets-server-wrapper | `src/tests/unit/my-wallets-server-wrapper.test.ts` |
| payment-transfer-server-wrapper | `src/tests/unit/payment-transfer-server-wrapper.test.ts` |
| plan-ensure | `src/tests/unit/plan-ensure.scoring.test.ts` |
| plan-ensure.comprehensive | `src/tests/unit/plan-ensure-comprehensive.test.ts` |
| plan-ensure.match | `src/tests/unit/plan-ensure.match.test.ts` |
| plaid | `src/tests/unit/plaid.test.ts` |
| register | `src/tests/unit/register.test.ts` |
| report-parser | `src/tests/unit/report-parser.test.ts` |
| settings-server-wrapper | `src/tests/unit/settings-server-wrapper.test.ts` |
| signin-wrapper | `src/tests/unit/signin-wrapper.test.ts` |
| transaction-history-server-wrapper | `src/tests/unit/transaction-history-server-wrapper.test.ts` |
| transaction-mapping | `src/tests/unit/transaction-mapping.test.ts` |
| transaction.actions | `src/tests/unit/transaction.actions.test.ts` |
| transaction.actions.db-error | `src/tests/unit/transaction.actions.db-error.test.ts` |
| transfer-validate | `src/tests/unit/validations/transfer.test.ts` |
| updateProfile | `src/tests/unit/updateProfile.test.ts` |
| user.actions | `src/tests/unit/user.actions.test.ts` |
| verify-rules | `src/tests/verify-rules/verify-rules.test.ts` |
| wallet.actions | `src/tests/unit/wallet.actions.test.ts` |
| IN PROGRESS | +more dal tests |

### DAL Tests

| Spec            | Path                                         |
| --------------- | -------------------------------------------- |
| user.dal        | `src/tests/unit/dal/user.dal.test.ts`        |
| wallet.dal      | `src/tests/unit/dal/wallet.dal.test.ts`      |
| transaction.dal | `src/tests/unit/dal/transaction.dal.test.ts` |
| recipient.dal   | `src/tests/unit/dal/recipient.dal.test.ts`   |
| dwolla.dal      | `src/tests/unit/dal/dwolla.dal.test.ts`      |
| admin.dal       | `src/tests/unit/dal/admin.dal.test.ts`       |
| errors.dal      | `src/tests/unit/dal/errors.dal.test.ts`      |

### Store Tests

| Spec           | Path                                           |
| -------------- | ---------------------------------------------- |
| ui-store       | `src/tests/unit/stores/ui-store.test.ts`       |
| toast-store    | `src/tests/unit/stores/toast-store.test.ts`    |
| filter-store   | `src/tests/unit/stores/filter-store.test.ts`   |
| transfer-store | `src/tests/unit/stores/transfer-store.test.ts` |

## Playwright E2E Tests (14 specs)

| Spec | Path |
| --- | --- |
| admin | `src/tests/e2e/admin.spec.ts` |
| auth | `src/tests/e2e/auth.spec.ts` |
| dashboard | `src/tests/e2e/dashboard.spec.ts` |
| example | `src/tests/e2e/example.spec.ts` |
| mock-tokens | `src/tests/e2e/mock-tokens.spec.ts` |
| my-wallets | `src/tests/e2e/my-wallets.spec.ts` |
| payment-transfer | `src/tests/e2e/payment-transfer.spec.ts` |
| settings | `src/tests/e2e/settings.spec.ts` |
| soft-delete | `src/tests/e2e/soft-delete.spec.ts` |
| transaction-history | `src/tests/e2e/transaction-history.spec.ts` |
| transfer-idempotency | `src/tests/e2e/transfer-idempotency.spec.ts` |
| wallet-linking | `src/tests/e2e/wallet-linking.spec.ts` |
| specs/plaid-script | `src/tests/e2e/specs/plaid-script.spec.ts` |
| integration/link-and-transfer | `src/tests/e2e/integration/link-and-transfer.spec.ts` |

## Integration Tests

| Spec | Path |
| --- | --- |
| errors.dal.integration | `src/tests/integration/dal/errors.dal.integration.test.ts` |

## Summary

- **Vitest specs**: 47+
- **Playwright specs**: 14
- **Integration specs**: 1
