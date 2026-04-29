---
name: code-philosophy
description: Internal logic and data flow philosophy (The 5 Laws of Elegant Defense). Understand deeply to ensure code guides data naturally and prevents errors.
lastReviewed: 2026-04-29
applyTo: "**/*.{ts,tsx,js,jsx}"
---

## Agent Support

| Agent | Integration | Usage |
|-------|-------------|-------|
| **OpenCode** | Direct skill invocation | `skill("code-philosophy")` when writing or reviewing logic |
| **Cursor** | `.cursorrules` reference | Add to project rules for code quality |
| **Copilot** | `.github/copilot-instructions.md` | Reference for internal logic patterns |

### OpenCode Usage
```
# When writing TypeScript/JavaScript code
Use code-philosophy to apply the 5 Laws of Elegant Defense.

# When reviewing code for quality
Load code-philosophy for the 5 laws assessment.
```

### Cursor Integration
```json
// .cursorrules - Add code philosophy rules
{
  "codeQuality": {
    "enforceEarlyExits": true,
    "makeIllegalStatesUnrepresentable": true,
    "pureFunctions": true,
    "failFast": true,
    "intentionalNaming": true
  }
}
```

### Copilot Integration
```markdown
<!-- .github/copilot-instructions.md -->
## Code Philosophy - 5 Laws of Elegant Defense

1. Law of Early Exit - Handle edge cases at top
2. Make Illegal States Unrepresentable - Parse don't validate
3. Law of Atomic Predictability - Pure functions, same input = same output
4. Fail Fast, Fail Loud - Halt immediately on invalid state
5. Intentional Naming - Self-documenting names, no comments needed

See skills/code-philosophy for full details.
```

---

# Internal Logic Philosophy: The 5 Laws of Elegant Defense

**Role:** Principal Engineer for all **Internal Logic & Data Flow** — applies to backend, React components, hooks, state management, and any code where functionality matters.

**Philosophy:** Elegant Simplicity — code should guide data so naturally that errors become impossible, keeping core logic flat, readable, and pristine.

## When to Use This Skill

Use this skill when:
- Writing or reviewing any TypeScript/JavaScript code
- Designing functions, classes, or modules
- Implementing business logic or data transformations
- Creating React components or custom hooks
- Building API endpoints or service layers
- Refactoring existing code for clarity

Do NOT use this skill when:
- Writing pure UI markup (HTML/CSS) without logic
- Writing configuration files
- Writing documentation or comments (though the principles apply)

## The 5 Laws

### 1. The Law of the Early Exit (Guard Clauses)

- **Concept:** Indentation is the enemy of simplicity. Deep nesting hides bugs.
- **Rule:** Handle edge cases, nulls, and errors at the very top of functions.
- **Practice:** Use `if (!valid) return; doWork();` instead of `if (valid) { doWork(); }`.

#### Why It Matters

Deeply nested code creates multiple paths to trace through. Each level of indentation represents a state where something could go wrong. By exiting early, you reduce the cognitive load on developers and eliminate entire branches of potential bugs.

#### Good vs Bad Examples

```typescript
// ❌ BAD: Deep nesting
function processUser(user: User | null): string {
  if (user !== null) {
    if (user.isActive) {
      if (user.hasPermissions) {
        return user.name;
      } else {
        return "No permissions";
      }
    } else {
      return "User inactive";
    }
  } else {
    return "No user";
  }
}

// ✅ GOOD: Early exits
function processUser(user: User | null): string {
  if (!user) return "No user";
  if (!user.isActive) return "User inactive";
  if (!user.hasPermissions) return "No permissions";
  return user.name;
}
```

#### Application in Different Contexts

**In React Components:**
```typescript
// ❌ BAD: Nested conditions in render
function UserProfile({ user }) {
  if (user) {
    if (user.isLoaded) {
      if (user.isActive) {
        return <div>{user.name}</div>;
      }
    }
  }
  return <Loading />;
}

// ✅ GOOD: Early returns
function UserProfile({ user }) {
  if (!user) return <Loading />;
  if (!user.isLoaded) return <Loading />;
  if (!user.isActive) return <InactiveUser />;
  return <div>{user.name}</div>;
}
```

**In API Handlers:**
```typescript
// ❌ BAD: Nested validation
async function handler(req: Request) {
  const result = await validateRequest(req);
  if (result.isValid) {
    const user = await getUser(req.userId);
    if (user) {
      const response = await processData(user);
      if (response.success) {
        return json(response.data);
      }
    }
  }
  return error("Failed");
}

// ✅ GOOD: Early exits
async function handler(req: Request) {
  const validation = await validateRequest(req);
  if (!validation.isValid) return error(validation.error);

  const user = await getUser(req.userId);
  if (!user) return error("User not found");

  const response = await processData(user);
  if (!response.success) return error(response.error);

  return json(response.data);
}
```

---

### 2. Make Illegal States Unrepresentable (Parse, Don't Validate)

- **Concept:** Don't check data repeatedly; structure it so it can't be wrong.
- **Rule:** Parse inputs at the boundary. Once data enters internal logic, it must be in trusted, typed state.
- **Why:** Removes defensive checks deep in algorithmic code, keeping core logic pristine.

#### The Core Idea

If your type system can represent an invalid state, someone will eventually create that state. Instead of validating everywhere, use the type system to make invalid states impossible to represent.

#### Good vs Bad Examples

```typescript
// ❌ BAD: Validating everywhere
function calculateTotal(items: CartItem[]): number {
  let total = 0;
  for (const item of items) {
    if (item !== null && item !== undefined) {
      if (typeof item.price === "number" && item.price >= 0) {
        total += item.price * item.quantity;
      }
    }
  }
  return total;
}

// ✅ GOOD: Parse once at boundary, trust inside
type ValidCartItem = {
  price: number;  // Already validated as positive number
  quantity: number;  // Already validated as positive integer
};

function calculateTotal(items: ValidCartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}
```

#### Parsing Patterns

**Using Zod for Input Validation:**
```typescript
import { z } from "zod";

const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  age: z.number().int().positive().max(150),
});

// Parse at the boundary - this is the ONLY place validation happens
function createUser(input: unknown): User {
  return UserSchema.parse(input);  // Throws if invalid
}

// Internal logic trusts the type - no defensive checks needed
function getUserDisplayName(user: User): string {
  return user.email.split("@")[0];  // Safe - we know email is valid
}
```

**Using Discriminated Unions:**
```typescript
// ❌ BAD: Using optional properties
type Order =
  | { status: "pending" }
  | { status: "processing" }
  | { status: "completed"; completedAt: Date }
  | { status: "cancelled"; cancelledAt: Date; reason: string };

// Problem: Can someone have status="completed" without completedAt?
const badOrder: Order = { status: "completed" };  // TypeScript allows this!

// ✅ GOOD: Discriminated union forces all required fields
type Order =
  | { status: "pending" }
  | { status: "processing" }
  | { status: "completed"; completedAt: Date }
  | { status: "cancelled"; cancelledAt: Date; reason: string };

// TypeScript NOW enforces that completed orders have completedAt
function processOrder(order: Order) {
  switch (order.status) {
    case "completed":
      return order.completedAt;  // TypeScript knows this exists
    case "cancelled":
      return order.reason;  // TypeScript knows this exists
  }
}
```

#### Boundary vs Internal Logic

```
┌─────────────────────────────────────────────────────────────┐
│                      BOUNDARY LAYER                         │
│  - API handlers receive raw request data                   │
│  - Form inputs come as strings/objects                     │
│  - Database returns may have nulls                         │
│                                                             │
│  ✅ VALIDATE & PARSE HERE                                   │
│  ✅ Convert to trusted internal types                       │
│  ✅ Throw descriptive errors for invalid data              │
└─────────────────────────────────────────────────────────────┘
                            ↓ Trusted types
┌─────────────────────────────────────────────────────────────┐
│                    INTERNAL LOGIC                           │
│  - Business logic runs                                      │
│  - Data transformations happen                              │
│  - Algorithms execute                                       │
│                                                             │
│  ❌ NO VALIDATION NEEDED                                    │
│  ❌ Trust the types                                         │
│  ❌ Focus on correctness, not defensive checks             │
└─────────────────────────────────────────────────────────────┘
```

---

### 3. The Law of Atomic Predictability

- **Concept:** A function must never surprise the caller.
- **Rule:** Functions should be "Pure" where possible. Same Input = Same Output. No hidden mutations.
- **Defense:** Avoid `void` functions that mutate global state. Return new data structures instead.

#### Why Predictability Matters

When a function can produce different outputs for the same inputs, debugging becomes a nightmare. Developers must trace through invisible state changes to understand why something isn't working. Predictable functions are testable, debuggable, and composable.

#### Pure vs Impure Functions

```typescript
// ❌ IMPURE: Hidden state mutation
let cache: Map<string, User> = new Map();

function getUserCached(id: string): User {
  if (cache.has(id)) {
    return cache.get(id)!;
  }
  const user = fetchUserFromDb(id);  // Side effect!
  cache.set(id, user);  // Mutation!
  return user;
}

// Problems:
// - Same input (id) can return different results over time
// - Not thread-safe
// - Can't be tested without mocking global state
// - Cache can grow unbounded

// ✅ PURE: No side effects, same input = same output
function getUserCached(id: string, cache: Map<string, User>): User | null {
  return cache.get(id) ?? null;
}

// Caller manages cache:
// - Testable: pass different caches
// - Composable: chain with other functions
// - Debuggable: input + cache = predictable output
```

#### Returning New Data Structures

```typescript
// ❌ BAD: Mutating input
function addItemToCart(cart: Cart, item: Item): void {
  cart.items.push(item);  // Mutates original!
  cart.total += item.price;
}

// Caller has no idea cart was modified!
const myCart = { items: [], total: 0 };
addItemToCart(myCart, newItem);
// myCart is now different - but this wasn't clear from the call

// ✅ GOOD: Return new structure
function addItemToCart(cart: Cart, item: Item): Cart {
  return {
    items: [...cart.items, item],
    total: cart.total + item.price,
  };
}

// Clear from the call site that something is returned
const myCart = { items: [], total: 0 };
const newCart = addItemToCart(myCart, newItem);
// Original cart is unchanged - no surprises!
```

#### When Impurity Is Necessary

Some operations inherently require side effects:
- Database writes
- API calls
- File system operations
- Console logging

For these, use the "Command Query Separation" pattern:

```typescript
// Commands: Execute action, return void or result object
async function createUser(data: UserData): Promise<{ ok: boolean; userId?: string; error?: string }> {
  try {
    const userId = await db.users.create(data);
    return { ok: true, userId };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

// Queries: Return data, no side effects
function getUserById(users: User[], id: string): User | undefined {
  return users.find(u => u.id === id);
}
```

---

### 4. The Law of "Fail Fast, Fail Loud"

- **Concept:** Silent failures cause complexity later.
- **Rule:** If a state is invalid, halt immediately with a descriptive error. Do not try to "patch" bad data.
- **Result:** Keeps logic simple by never accounting for "half-broken" states.

#### The Problem with Silent Failures

When code continues running with invalid state, the error manifests far from the root cause. This makes debugging exponentially harder. Fail fast means the error appears exactly where it occurs.

#### Good vs Bad Examples

```typescript
// ❌ BAD: Silent failure / default values
function divide(a: number, b: number): number {
  if (b === 0) {
    return 0;  // Silent failure! Caller doesn't know something is wrong
  }
  return a / b;
}

const result = divide(10, 0);  // Returns 0 - is this correct or an error?
// Caller can't distinguish between divide(10, 0) and divide(0, 0)!

// ✅ GOOD: Fail loud with descriptive error
function divide(a: number, b: number): number {
  if (b === 0) {
    throw new Error("Cannot divide by zero. Received: " + JSON.stringify({ a, b }));
  }
  return a / b;
}

// Now the caller KNOWS something went wrong
try {
  const result = divide(10, 0);
} catch (e) {
  console.error(e.message);  // Clear error message
}
```

#### Using Asserts for Impossible States

```typescript
// When you KNOW something should be true but TypeScript can't prove it
function processOrder(order: Order) {
  // We know that completed orders have a completion date
  // but TypeScript doesn't
  if (order.status === "completed") {
    // Assert the invariant - fail fast if we're wrong
    const completedAt = order.completedAt ?? assertFailed("Completed orders must have completedAt");
    return { ...order, processedAt: completedAt };
  }
}

function assertFailed(message: string): never {
  throw new Error(`ASSERTION FAILED: ${message}`);
}
```

#### Error Messages That Help

```typescript
// ❌ BAD: Cryptic errors
function getUser(id: string): User {
  throw new Error("Not found");  // What wasn't found? Where?
}

// ✅ GOOD: Descriptive errors
function getUser(id: string): User {
  const user = db.users.find(id);
  if (!user) {
    throw new Error(`User not found: id=${id} (looking up in users table)`);
  }
  return user;
}
```

---

### 5. The Law of Intentional Naming

- **Concept:** Comments are often a crutch for bad code.
- **Rule:** Variables and functions must be named so clearly that logic reads like an English sentence.
- **Defense:** `isUserEligible` is better than `check()`. The name itself guarantees the boolean logic.

#### The Reading Test

Code should be readable as English prose. If you need a comment to explain what a variable means, the variable name is insufficient.

```typescript
// ❌ BAD: Cryptic names requiring comments
// x = user's age in years
// y = current year
// returns true if user can vote
function f(x, y) {
  return x >= 18;
}

// ❌ BAD: Abbreviations that obscure meaning
const usr = getUser();
const isAct = usr.isActive;
const hasPer = checkPerm(usr.id, "vote");

// ✅ GOOD: Self-documenting names
const userAge = user.age;
const currentYear = new Date().getFullYear();
const canVote = userAge >= 18;
```

#### Function Names as Contracts

Function names should describe exactly what they do:

```typescript
// ❌ BAD: Generic names
function check(x: User): boolean { ... }
function process(data: Order): void { ... }
function get(x: string): User { ... }

// ✅ GOOD: Specific, descriptive names
function isUserEligibleForVoting(user: User): boolean { ... }
function processOrderAndNotifyCustomer(order: Order): Promise<void> { ... }
function getUserByIdOrThrow(id: string): User { ... }
```

#### Boolean Names Should State the Assertion

```typescript
// ❌ BAD: Ambiguous booleans
const active = user.active;
const check = isValid(email);
const done = processComplete();

// ✅ GOOD: Boolean names state the condition
const isUserActive = user.isActive;
const isEmailValid = isValid(email);
const hasProcessingCompleted = processComplete();
```

---

## Applying All 5 Laws Together

Here's a complete example showing all 5 laws in action:

```typescript
// ❌ BEFORE: Violates all 5 laws
function getUserDisplay(user: any) {
  if (user != null) {
    if (user.name) {
      if (user.profile) {
        if (user.profile.image) {
          return user.name + " - " + user.profile.image;
        } else {
          return user.name + " - no image";
        }
      } else {
        return user.name;
      }
    } else {
      return "No name";
    }
  }
  return null;
}

// ✅ AFTER: Follows all 5 laws

// 1. Parse at boundary (Law 2)
const UserDisplayData = z.object({
  name: z.string().min(1),
  profile: z.object({
    image: z.string().nullable(),
  }).nullable(),
});

type ValidUserDisplayData = z.infer<typeof UserDisplayData>;

// 2. Early exit (Law 1)
function getUserDisplay(userData: unknown): string {
  const user = UserDisplayData.safeParse(userData);
  if (!user.success) {
    throw new Error(`Invalid user data: ${user.error.message}`);
  }

  return formatUserDisplay(user.data);
}

// 3. Pure function (Law 3)
function formatUserDisplay(user: ValidUserDisplayData): string {
  const name = user.name;
  const image = user.profile?.image ?? "no image";
  return `${name} - ${image}`;
}

// 4. Fail loud (Law 4) - already handled in parse

// 5. Intentional naming (Law 5) - clear names throughout
```

---

## Adherence Checklist

Before completing your task, verify:

- [ ] **Guard Clauses:** Are all edge cases handled at the top with early returns?
- [ ] **Parsed State:** Is data parsed into trusted types at the boundary?
- [ ] **Purity:** Are functions predictable and free of hidden mutations?
- [ ] **Fail Loud:** Do invalid states throw clear, descriptive errors immediately?
- [ ] **Readability:** Does the logic read like an English sentence?

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Code has many nested ifs | Apply Law 1: Extract guard clauses |
| Same validation repeated | Apply Law 2: Parse once at boundary |
| Tests are flaky | Apply Law 3: Make functions pure |
| Bugs are hard to trace | Apply Law 4: Fail fast with clear errors |
| Code needs comments to understand | Apply Law 5: Rename to be self-documenting |

---

## Related Skills

- [code-review](./code-review) - Use this to verify code follows these principles
- [refactor](./refactor) - Use this to apply these principles when improving code
- [testing-skill](./testing-skill) - Write tests that verify pure function behavior
