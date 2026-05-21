# Testing

## Rules

- Run `bun run format`, `bun run type-check`, `bun run lint:strict` before any PR
- Run `bun run test:unit` for unit tests during development
- Write unit tests for DAL classes (test query building, not database)
- Write integration tests for server actions (mock DB/external services)
- Never commit real credentials — use `.env.local` and mock external services in tests

## Examples

### Unit Test for DAL

```typescript
// src/dal/__tests__/user.dal.test.ts
import { spyOn } from "bun";
import { UserDal } from "../user.dal";

describe("UserDal", () => {
  const dal = new UserDal();

  describe("findByEmail", () => {
    it("returns user when found", async () => {
      const mockDb = {
        select: () => ({
          from: () => ({
            where: () => ({
              limit: () =>
                Promise.resolve([
                  { id: "1", email: "test@example.com" }
                ])
            })
          })
        })
      };
      const result = await dal.findByEmail("test@example.com");
      expect(result).toEqual({ id: "1", email: "test@example.com" });
    });
  });
});
```

### Integration Test for Server Action

```typescript
// src/actions/__tests__/auth.actions.test.ts
import { describe, it, expect, vi } from "bun:test";
import { registerUser } from "../register";

// Mock dependencies
vi.mock("@/lib/auth", () => ({
  auth: vi.fn().mockResolvedValue(null)
}));

describe("registerUser", () => {
  it("returns error for invalid email", async () => {
    const result = await registerUser({
      email: "invalid",
      password: "Test@123"
    });
    expect(result.ok).toBe(false);
    expect(result.error).toContain("Invalid email");
  });
});
```

## Anti-patterns

### Don't Test Without Mocking

```typescript
// BAD: Real DB calls in unit tests
it("creates user", async () => {
  const db = require("../database/db").db; // ❌ Real DB
  await db.insert(users).values({...}); // Hits real DB
});
```

### Don't Skip Validation Tests

```typescript
// BAD: Only testing happy path
it("registers user", async () => {
  const result = await registerUser(validInput);
  expect(result.ok).toBe(true); // ❌ Missing invalid input tests
});
```
