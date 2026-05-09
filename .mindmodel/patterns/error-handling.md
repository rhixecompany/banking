# Error Handling

## Rules

- All server actions MUST return `{ ok: boolean; error?: string; ... }` with Zod validation
- Never throw errors to client from server actions — always catch and return error object
- Use `logger.error()` for unexpected errors before returning generic message
- Validate ALL inputs with Zod at server action entry points
- Use typed error codes for domain-specific errors (e.g., `DWOLLA_VERIFICATION_FAILED`)

## Examples

### Server Action Error Pattern

```typescript
// src/actions/register.ts
export async function registerUser(input: unknown) {
  const parsed = signUpSchema.safeParse(input);
  if (!parsed.success) {
    const allErrors = parsed.error.issues
      .slice(0, 3)
      .map(issue => issue.message)
      .join("; ");
    return { error: allErrors, ok: false };
  }
  // ... implementation
}
```

### Async Action Error Pattern

```typescript
// src/actions/plaid.actions.ts
export async function createPlaidLinkToken(userId: string) {
  try {
    const tokens = await plaidClient.linkTokenCreate({
      user: { client_user_id: userId },
      client_name: "Banking App",
      products: ["transactions"],
      country_codes: ["US"],
      language: "en"
    });
    return { ok: true, linkToken: tokens.data.link_token };
  } catch (error) {
    logger.error("createPlaidLinkToken error:", error);
    return { error: "Failed to create link token", ok: false };
  }
}
```

## Anti-patterns

### Don't Throw to Client

```typescript
// BAD: Never throw errors from server actions
export async function registerUser(input: unknown) {
  const parsed = signUpSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(parsed.error.errors[0].message); // ❌
  }
}
```

### Don't Ignore Errors

```typescript
// BAD: Swallowing errors hides debugging information
export async function doSomethingRisky(input: unknown) {
  try {
    await riskyOperation(input);
  } catch (e) {
    // Silently ignored — hard to debug
  }
}
```
