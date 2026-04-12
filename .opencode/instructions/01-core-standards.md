---
name: "core-standards"
description: "Critical coding standards and PR-blocking rules for Banking project"
applyTo: "**/*.{ts,tsx,js,jsx}"
priority: 1
---

# Core Standards - Banking Project

Critical rules that MUST be followed. PRs will be blocked if violated.

## PR-Blocking Rules

| # | Rule | Requirement | Enforcement |
| --- | --- | --- | --- |
| 1 | No `any` types | Use `unknown` + type guards | TypeScript strict |
| 2 | No N+1 queries | Always eager load / JOIN — never query in loops | Code review |
| 3 | No raw `process.env` | Use `app-config.ts` (preferred) or `lib/env.ts` | ESLint + TypeScript |
| 4 | Mutations via Server Actions | All writes must be Server Actions in `actions/` | Code review |
| 5 | Zero TypeScript errors | Pass `npm run type-check` | CI check |
| 6 | Zero lint warnings | Pass `npm run lint:strict` | CI check |
| 7 | All tests pass | Pass `npm run test` | CI check |

## TypeScript Strict Rules

### No `any` Types

```typescript
// BAD - Using any
function parseInput(input: any) {
  return input.value;
}

// GOOD - Using unknown with type guard
type HasValue = { value: string };

function hasValue(input: unknown): input is HasValue {
  return (
    typeof input === "object" &&
    input !== null &&
    "value" in input &&
    typeof (input as HasValue).value === "string"
  );
}
```

### Explicit Return Types

Always include return types for exported functions (this helps reviewers and ensures stable public typings):

```typescript
export function getUser(id: string): Promise<User | null> {
  return db.query.users.findFirst({ where: eq(users.id, id) });
}
```

Note: Exported Server Actions and public helpers should use explicit return types as well.

## Environment Variables

**NEVER use `process.env` directly.** Use `lib/env.ts`:

```typescript
// BAD
const apiKey = process.env.API_KEY;

// GOOD
import { env } from "@/lib/env";
const apiKey = env.API_KEY;
```

## Security Essentials

- Sanitize all user input
- Use Zod for validation
- Hash passwords before storage
- Never log sensitive data
- Use parameterized queries (Drizzle does this)

## Import Order

```typescript
// 1. React/core
import * as React from "react";

// 2. Next.js
import { redirect } from "next/navigation";

// 3. Third-party
import { z } from "zod";
import { eq } from "drizzle-orm";

// 4. Internal - DAL
import { userDal } from "@/dal";

// 5. Internal - Actions
import { createUser } from "@/actions/user.actions";

// 6. Internal - Components
import { Button } from "@/components/ui/button";
```

## Naming Conventions

| Type      | Convention  | Example       |
| --------- | ----------- | ------------- |
| Files     | kebab-case  | `user-dal.ts` |
| Classes   | PascalCase  | `UserDal`     |
| Functions | camelCase   | `findById`    |
| Variables | camelCase   | `currentUser` |
| Constants | UPPER_SNAKE | `MAX_RETRY`   |
| Types     | PascalCase  | `UserProfile` |

See: `.opencode/skills/` for detailed patterns and AGENTS.md for canonical agent rules.
