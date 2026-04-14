<!--
Review audit of Server Actions, Zod schemas, and DALs.
This file captures observed issues, severity, rationale, and suggested fixes.
Edit or extend as reviewer work proceeds.
-->

# Review Comments — Server Actions, Zod Schemas, and DALs

## Summary

Performed a static audit of actions/ and dal/ to surface policy violations and improvement opportunities (Zod meta vs describe, auth ordering in protected actions, DB filtering in DALs, missing validator messages, and small API-surface polishing).

Guiding rules used (project canonical):

- Server Actions MUST call auth() first for protected flows (return { ok:false, error: 'Unauthorized' } if no session).
- Zod schemas MUST include .describe() metadata for each field and provide explicit error messages for validators (zod/require-error-message and zod/prefer-meta rules per repo).
- DALs MUST avoid JS-side filtering of deleted records — prefer DB WHERE clauses (isNull(deletedAt)).
- All changes must follow plan-first small commits and include validation outputs.

## Per-file findings and suggested fixes

1. actions/plaid.actions.ts
   - Severity: High / Medium
   - Files & lines (examples):
     - CreateLinkTokenSchema: actions/plaid.actions.ts lines 21-27
     - ExchangePublicTokenSchema: lines 35-37
     - GetTransactionsSchema: lines 55-61
     - exchangePublicToken function: lines 149-162 (safeParse occurs before auth)
     - getAccounts: lines 252-276 (safeParse before auth)
     - getTransactions: lines 316-334 (safeParse before auth)
     - removeWallet: lines 807-836 (safeParse before auth)

   - Issues observed:
     1. Zod schemas use .meta({ description: "..." }) instead of the repo-required `.describe("...")` on many fields (e.g., CreateLinkTokenSchema lines 21-27). This violates zod meta/describe linting rules.
     2. Several validators lack explicit error messages (e.g., GetTransactionsSchema endDate/startDate use `.min(1)` without a message). The repo enforces `zod/require-error-message`.
     3. Protected actions frequently call `safeParse()` (input validation) before calling `auth()`. Per project rules, auth() should be checked first in protected actions to avoid unnecessary work and to honor auth-first pattern.

   - Why it matters:
     - Linting and CI will fail if `.describe()` is required. More importantly, `.describe()` is used for automatic docs and consistent error metadata.
     - Missing error messages produce poor developer UX and fail lint rules.
     - Calling auth() first is a security and performance pattern: avoid validating/parsing inputs for unauthenticated requests and make the authorization check explicit and early.

   - Suggested fixes:
     1. Replace `.meta({ description: "..." })` with `.describe("...")` on all Zod schema fields. Example change:

        // BEFORE userId: z.string().trim().min(1, "User ID is required").meta({ description: "User ID for Plaid Link" }),

        // AFTER userId: z.string().trim().min(1, "User ID is required").describe("User ID for Plaid Link"),

     2. Add explicit messages to all `.min()` / `.max()` / `.email()` validators that are missing them.
     3. Reorder protected actions to call `const session = await auth(); if (!session?.user?.id) return { ok:false, error: 'Unauthorized' }` at the top of the function before doing input parsing or external API calls.

   - Example patch suggestion for exchangePublicToken (conceptual):

     export async function exchangePublicToken(input: unknown) { const session = await auth(); if (!session?.user?.id) return { ok: false, error: 'Unauthorized' }; const parsed = ExchangePublicTokenSchema.safeParse(input); if (!parsed.success) return { ok: false, error: 'Invalid input' }; // ... continue with business logic using session.user.id }

2. actions/wallet.actions.ts
   - Severity: Medium
   - Files & lines (examples):
     - DisconnectWalletSchema / disconnectWallet: lines 13-56 (DisconnectWalletSchema defined at top; disconnectWallet calls safeParse before auth)

   - Issues observed:
     1. The disconnectWallet action validates input via `safeParse()` before checking auth (lines ~33 vs 38). For protected write operations, auth() should be the first runtime check.

   - Suggested fix:
     - Move the auth() call to the top of the action and return early for unauthenticated requests. Keep input validation after auth so that validation errors are returned only for authenticated users, and expensive DAL calls are avoided for unauthenticated callers.

3. actions/register.ts
   - Severity: Medium
   - Files & lines (examples):
     - RegisterSchema: lines 12-60
     - registerUser: lines 79-117

   - Issues observed:
     1. Zod schema uses `.meta({ description: ... })` instead of `.describe()` (lines 12-60). Replace with `.describe()` to satisfy lint rules.
     2. Some optional fields are fine, but ensure all validators that perform active validation include explicit messages (e.g., `.min(8, 'Password must be at least 8 characters')` is present; keep consistency across all fields).
     3. `registerUser` return type uses `user?: unknown` — prefer a typed `User` or `UserWithProfile` return rather than unknown.

   - Suggested fixes:
     - Migrate `.meta(...)` → `.describe(...)` and ensure `.min()`/`.email()` calls include explicit messages.
     - Use the canonical `User`/`UserWithProfile` TypeScript type for function returns and avoid `unknown`.

4. actions/updateProfile.ts
   - Severity: Medium
   - Files & lines (examples):
     - UpdateProfileSchema: lines 12-46
     - updateProfile function: lines 65-134

   - Issues observed:
     1. Schema uses `.meta()` rather than `.describe()` (lines 12-46).
     2. Some validators (e.g., `.email()`) don't have explicit messages — add explicit validator messages to satisfy repo lint rules.

   - Suggested fixes:
     - Convert `.meta({...})` usages to `.describe('...')` and add messages where missing.

5. DAL — dal/wallet.dal.ts
   - Severity: Low / Medium
   - Files & lines (examples):
     - findByUserId: lines 51-61 (select then filter in JS)

   - Issue observed:
     1. findByUserId queries all wallets for the user and then filters soft-deleted records in JS (lines 51-61). This performs more work and transfers rows that could be filtered in SQL.

   - Suggested fix:
     - Move deletedAt filter into the DB WHERE clause so the DB only returns non-deleted rows. Example:

       const walletRecords = await db .select() .from(wallets) .where(and(eq(wallets.userId, userId), isNull(wallets.deletedAt)));

     - This is more efficient and follows DAL best-practices.

6. DAL — general notes
   - Many DAL methods correctly accept an optional `opts?: { db?: typeof db }` to allow transaction-scoped DB instances (eg transaction.dal.createTransaction). Keep this pattern for multi-step writes.

## Other observations / opportunities

- Rate-limits & external API resilience: several Plaid action functions call Plaid endpoints in parallel (getAllBalances, getAllAccounts, getAllWalletsWithDetails). Consider adding retry/backoff with jitter or batching to avoid hitting provider rate-limits in CI/E2E (where many wallets may be queried). This is a performance/robustness improvement (medium priority).
- Consolidate Plaid provider logic: components/plaid-context and components/layouts/plaid-provider both exist. Consider consolidating into a single canonical provider to avoid script re-insertion, duplicate token fetches, and test instability (high-priority UX/testability improvement).
- Typed return shapes: prefer explicit typed return values rather than `unknown` or `any` in Server Actions. This improves type-safety and test ergonomics. Next steps (recommended)

---

1. Apply Zod changes across actions/\*: replace `.meta` with `.describe` and add explicit validator messages where missing.
2. Reorder protected Server Actions so `auth()` is called at the top of the function before parsing or external calls.
3. Update DALs to push deletedAt filtering into DB WHERE clauses instead of JS-side filtering.
4. Add a small PR that changes a single action (e.g., wallet.actions.disconnectWallet) to demonstrate the pattern: auth-first, .describe(), and validator messages; run validation; then iterate.

If you'd like, I can prepare a minimal patch implementing the pattern on 1–2 representative files (small commit) so CI/validation can be run and the pattern used as a template for remaining files.
