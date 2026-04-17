# Exemplary Code Patterns (evidence-based)

This document contains short, concrete examples of patterns already used in the codebase. Each example references the original file where the pattern is implemented.

1. Server Action pattern (register)

- File: actions/register.ts
- Key points: `"use server"` directive, Zod validation, early auth (when required), returning `{ ok, error? }` shape.

Excerpt (see file for full implementation):

```ts
"use server";
import { z } from "zod";
const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});
export async function registerUser(input: unknown) {
  const parsed = RegisterSchema.safeParse(input);
  if (!parsed.success)
    return { ok: false, error: parsed.error.message };
  // use userDal for DB access
}
```

2. DAL batching to avoid N+1 (transactions)

- File: dal/transaction.dal.ts
- Key points: fetch transactions, collect wallet IDs, batch fetch wallets, map results back — avoids joining same table twice.

3. Env access & app-config

- File: lib/env.ts & app-config.ts
- Key points: typed re-export of configuration; `lib/env` keeps backward compat while `app-config` is the canonical source.

4. Deterministic test short-circuits (Plaid & Dwolla)

- Files: lib/plaid.ts, actions/dwolla.actions.ts, tests/e2e/helpers/plaid.mock.ts
- Key points: `isMockAccessToken()` helper, create mock funding-source/transfer URLs when token contains `mock`/`seed` to avoid network calls.

5. Scripts & validation tooling

- File: scripts/verify-rules.ts
- Key points: AST-based rule enforcement for `process.env` usage, `any` usage, server action heuristics. Produces `.opencode/reports/rules-report.json`.

Usage

- When implementing new patterns, model code after these exemplars and include file references in PR descriptions.
