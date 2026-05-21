# Logging

## Rules

- Use `logger` from `@/lib/logger` (configured pino logger) for all logging
- NEVER log sensitive data: passwords, SSN, full card numbers, auth tokens
- Log all financial operations (transfers, bank connections) with user ID and operation type
- Include operation context for traceability: `logger.info("operation", { userId, operationId })`
- Use appropriate log levels: `error` for failures, `info` for completions, `debug` for dev details

## Examples

### Financial Operation Logging

```typescript
// src/actions/transfer.actions.ts
import { logger } from "@/lib/logger";

export async function initiateTransfer(input: unknown) {
  logger.info("initiateTransfer started", { userId: session.user.id });
  try {
    const result = await dwollaClient.transfer.create({...});
    logger.info("initiateTransfer completed", {
      userId: session.user.id,
      transferId: result.data.id
    });
    return { ok: true, transferUrl: result.data._links.self.href };
  } catch (error) {
    logger.error("initiateTransfer failed", { userId: session.user.id, error });
    return { error: "Transfer failed", ok: false };
  }
}
```

### API Call Logging

```typescript
// src/lib/plaid/index.ts
export async function exchangePublicToken(publicToken: string) {
  logger.debug("exchanging public token");
  const exchangeResponse = await plaidClient.itemPublicTokenExchange({
    public_token: publicToken
  });
  logger.info("plaid token exchange completed");
  return exchangeResponse.data.access_token;
}
```

## Anti-patterns

### Don't Log Sensitive Data

```typescript
// BAD: Never log passwords, SSN, or full card numbers
logger.info("User login", { email, password: user.password }); // ❌
logger.info("KYC verification", { ssn: profile.ssnEncrypted }); // ❌
```

### Don't Log Without Context

```typescript
// BAD: Unhelpful log without identifiers
logger.info("Transfer failed"); // ❌

// GOOD: Include user and operation context
logger.error("transfer failed", { userId, transferId, amount }); // ✓
```
