# Coding Rules

## Error Handling

1. **Never throw** from server actions or DAL methods
2. **Always catch** external API calls and database operations
3. **Log errors** with `logger.error()` before returning
4. **Return stable shapes**: `{ ok: boolean; data?: T; error?: string }`

## Validation

1. **Use Zod** for all input validation
2. **Define schemas** at module level for reuse
3. **Validate on both client and server**
4. **Use `.trim()`** on all string inputs
5. **Return meaningful errors** from first validation failure

## Database

1. **Use DAL classes** for all database access
2. **Exclude soft-deleted** records with `isNull(deletedAt)`
3. **Use snake_case** for table and column names
4. **Prefer eager loading** over N+1 queries

## State Management

1. **Use Zustand** for client state
2. **Use `createStore`** (not `create`) for SSR safety
3. **Pass actions as props** instead of importing server actions in client components

## Security

1. **Never expose secrets** - use env.ts wrapper
2. **Encrypt sensitive data** - SSN stored encrypted
3. **Validate all inputs** - Zod at every entry point
4. **Use soft-delete** - never hard delete user data
5. **Implement idempotency** - for all financial transactions

## Environment Variables

1. **Use `lib/env.ts`** wrapper for all env access
2. **Never use `process.env` directly** in components
3. **Validate at startup** - fail fast on missing required vars

## Imports

1. **Use path aliases** (`@/dal`, `@/lib`, `@/types`)
2. **Use `import type`** for type-only imports
3. **Use barrel exports** for organized re-exports

## Testing

1. **Use integration tests** over mocking
2. **Test error paths** - not just success cases
3. **Avoid raw SQL** in test helpers (injection risk)
4. **Clean up test data** between tests
