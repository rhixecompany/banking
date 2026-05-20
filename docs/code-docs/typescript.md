# TypeScript Documentation Standards

## Overview

This document outlines the documentation standards for TypeScript code in the Banking project.

## File Organization

- **Source Files**: `src/**/*.ts`, `src/**/*.tsx`
- **Types**: `src/types/`
- **Components**: `src/components/`
- **Actions**: `src/actions/`

## Documentation Format

### JSDoc Comments

Use JSDoc for documenting functions, classes, and interfaces.

```typescript
/**
 * Creates a new user in the database.
 * @param input - User creation data
 * @returns Result object with created user or error
 * @example
 * const result = await createUser({ email: "user@example.com", name: "John" });
 */
export async function createUser(input: CreateUserInput): Promise<Result<User>> {
  // implementation
}
```

### TSDoc for TypeScript

For more complex TypeScript types:

```typescript
/**
 * Represents a bank account connected via Plaid.
 * @interface BankAccount
 * @property {string} id - Unique identifier
 * @property {string} institutionName - Bank name
 * @property {string} accountType - checking or savings
 * @property {number} balance - Current balance in cents
 */
export interface BankAccount {
  id: string;
  institutionName: string;
  accountType: "checking" | "savings";
  balance: number;
}
```

## Required Documentation

### Server Actions

Every server action must include:
- Description of what the action does
- Input parameters with types
- Return type
- Error cases

```typescript
/**
 * Initiates a money transfer via Dwolla ACH.
 * @param input - Transfer details including amount, recipient, and idempotency key
 * @returns Transfer result with status or error message
 * @throws {ZodError} When input validation fails
 */
export async function initiateTransfer(input: TransferInput): Promise<TransferResult>
```

### DAL (Data Access Layer)

Document all database operations:

```typescript
/**
 * Retrieves a user by their email address.
 * @param email - User's email
 * @returns User record or undefined if not found
 * @sql SELECT * FROM users WHERE email = $1
 */
export async function getUserByEmail(email: string): Promise<User | undefined>
```

### Components

Document React components:

```typescript
/**
 * Displays a bank account card with balance and details.
 * @component
 * @param {BankCardProps} props - Component props
 * @param {BankAccount} props.account - Bank account data
 * @param {boolean} props.showBalance - Whether to display balance
 * @returns JSX element representing the bank card
 */
export function BankCard({ account, showBalance = true }: BankCardProps)
```

### Types and Interfaces

Document all exported types:

```typescript
/**
 * Transaction status enumeration.
 * @enum {string}
 */
export enum TransactionStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
  CANCELLED = "cancelled"
}
```

## Code Examples

### Validating Input with Zod

```typescript
import { z } from "zod";

/**
 * Schema for creating a new recipient.
 * @example
 * const validInput = {
 *   name: "John Doe",
 *   email: "john@example.com",
 *   bankAccount: "123456789",
 *   routingNumber: "021000021"
 * };
 */
export const CreateRecipientSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().optional(),
  bankAccount: z.string().length(10),
  routingNumber: z.string().length(9)
});
```

### Error Handling Pattern

```typescript
/**
 * Executes a database operation with standardized error handling.
 * @param operation - Async function to execute
 * @returns Result object with data or error
 */
async function withErrorHandling<T>(operation: () => Promise<T>): Promise<Result<T>> {
  try {
    const data = await operation();
    return { ok: true, data };
  } catch (error) {
    console.error("Database error:", error);
    return { ok: false, error: "Operation failed" };
  }
}
```

## Best Practices

1. **Use TSDoc/JSDoc** for all public functions
2. **Include @example** for complex functions
3. **Document edge cases** and error conditions
4. **Keep docs in sync** with code changes
5. **Use consistent formatting** across all files

## Related Files

- [CODE_STYLE.md](../../CODE_STYLE.md)
- [AGENTS.md](../../AGENTS.md)
- [Drizzle ORM Guide](../DrizzleORMGuide.md)