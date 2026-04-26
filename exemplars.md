# Exemplary Code Patterns (evidence-based)

This document contains short, concrete examples of patterns already used in the codebase. Each example references the original file where the pattern is implemented.

## 1. Server Action Pattern (register)

**File**: `actions/register.ts`

**Key points**:

- `"use server"` directive
- Zod validation with `.safeParse()`
- Early auth check (when required)
- Returning `{ ok, error? }` shape
- Using DAL helpers for DB access

```typescript
"use server";
import bcrypt from "bcrypt";
import { z } from "zod";

import { userDal } from "@/dal";
import { signUpSchema } from "@/lib/validations/auth";

export async function registerUser(input: unknown): Promise<{
  ok: boolean;
  user?: undefined | UserWithProfile;
  error?: string;
}> {
  const parsed = signUpSchema.safeParse(input);
  if (!parsed.success) {
    const allErrors = parsed.error.issues
      .slice(0, 3)
      .map(issue => issue.message)
      .join("; ");
    return { error: allErrors, ok: false };
  }
  // ... use userDal for DB access
}
```

## 2. DAL Batching to Avoid N+1 (transactions)

**File**: `dal/transaction.dal.ts`

**Key points**:

- Fetch transactions first
- Collect unique wallet IDs
- Batch fetch wallets in one query
- Map wallets back onto transactions
- Avoids joining same table twice

```typescript
async findByUserIdWithWallets(userId: string, limitVal = 50, offsetVal = 0) {
  // 1. Fetch transactions
  const txns = await db.select().from(transactions).where(...);

  // 2. Collect unique wallet ids
  const walletIds = new Set<string>();
  for (const t of txns) {
    if (t.senderWalletId) walletIds.add(t.senderWalletId);
    if (t.receiverWalletId) walletIds.add(t.receiverWalletId);
  }

  // 3. Batch fetch wallets (single query)
  if (walletIds.size > 0) {
    const rows = await db.select(...).from(wallets).where(or(...conditions));
    // Build map for lookup
  }

  // 4. Map wallets back onto transactions
  return txns.map((txn) => ({
    ...txn,
    senderWallet: walletsMap[txn.senderWalletId] ?? null,
    receiverWallet: walletsMap[txn.receiverWalletId] ?? null,
  }));
}
```

## 3. Env Access & app-config

**Files**: `lib/env.ts` & `app-config.ts`

**Key points**:

- `app-config.ts` is the canonical typed source
- `lib/env.ts` re-exports for backward compatibility
- Centralized Zod schema validation
- Organized by category (auth, database, integrations)

```typescript
// app-config.ts - canonical source
import { z } from "zod";

const authSchema = z.object({
  NEXTAUTH_SECRET: z.string().trim().min(1).optional(),
  NEXTAUTH_URL: z.string().trim().url().optional()
});

export const auth = parseAuthConfig(); // singleton

// lib/env.ts - backward compat re-export
export const env = {
  NEXTAUTH_SECRET: auth.NEXTAUTH_SECRET,
  NEXTAUTH_URL: auth.NEXTAUTH_URL
} as const;
```

## 4. Deterministic Test Short-circuits (Plaid & Dwolla)

**Files**: `lib/plaid.ts`, `actions/dwolla.actions.ts`, `tests/e2e/helpers/plaid.mock.ts`

**Key points**:

- `isMockAccessToken()` helper detects test tokens
- Mock tokens start with `seed-`, `mock-`, or `mock_`
- Create mock funding-source/transfer URLs to avoid network calls
- Plaid Link mock injection in E2E tests

```typescript
// lib/plaid.ts
export function isMockAccessToken(token: string): boolean {
  if (!token) return false;
  const t = token.toLowerCase();
  return (
    t.startsWith("seed-") ||
    t.startsWith("mock-") ||
    t.startsWith("mock_") ||
    t.startsWith("mock")
  );
}

// tests/e2e/helpers/plaid.mock.ts
export async function addMockPlaidInitScript(
  page: Page,
  publicToken = "MOCK_PUBLIC_TOKEN"
): Promise<void> {
  const script = `(() => {
    window.Plaid = {
      create: function(opts) {
        setTimeout(() => {
          if (opts && typeof opts.onSuccess === 'function') {
            opts.onSuccess(${JSON.stringify(publicToken)}, { metadata: {} });
          }
        }, 0);
        return { open: function() {} };
      }
    };
  })();`;
  await page.addInitScript(script);
}
```

## 5. Scripts & Validation Tooling

**File**: `scripts/verify-rules.ts`

**Key points**:

- AST-based rule enforcement using ts-morph
- Detects `process.env` usage, `any` usage, server action heuristics
- Supports `--ci` mode with exit code 2 on critical violations
- Produces `.opencode/reports/rules-report.json`
- Configurable allowlist and severities

```typescript
// ts-morph AST-based detection
const project = new Project({
  skipAddingFilesFromTsConfig: true,
  tsConfigFilePath: "tsconfig.json",
});

// Detect process.env usage
const propAccesses = sf.getDescendantsOfKind(SyntaxKind.PropertyAccessExpression);
for (const p of propAccesses) {
  if (p.getExpression().getText() === "process" && p.getName() === "env") {
    issues.push({ check: "process.env-usage", ... });
  }
}

// CI mode with exit code
if (opts.ci && criticalFound) {
  logger.error("Critical rule violations found. Failing CI.");
  process.exit(2);
}
```

## Usage

When implementing new patterns, model code after these exemplars and include file references in PR descriptions.

## Provenance

All examples extracted from:

- `actions/register.ts`
- `dal/transaction.dal.ts`
- `app-config.ts`
- `lib/env.ts`
- `lib/plaid.ts`
- `tests/e2e/helpers/plaid.mock.ts`
- `scripts/verify-rules.ts`

Last updated: 2026-04-24
