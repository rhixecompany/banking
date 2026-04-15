# Actions Audit — Phase 1

This file contains per-action audit notes discovered during Phase 1 scanning. Focus is on Zod validation, Server Action patterns, auth checks, return shapes, and external API concurrency.

Format: file path -> Findings -> Recommended fixes

1. actions/register.ts
   - Findings:
     - Zod schema (RegisterSchema) includes error messages and .meta descriptions (good).
     - registerUser returns `user?: unknown` in its return type which is imprecise. The DAL returns a typed `UserWithProfile`.
   - Recommended fixes:
     - Change return type to `user?: UserWithProfile` and import the type from `@/types/user`.

2. actions/updateProfile.ts
   - Findings:
     - UpdateProfileSchema uses validators without explicit error messages for `.email()` and `.min()` calls. ESLint rule `zod/require-error-message` requires explicit messages.
     - Example lines:
       - email: `z.string().trim().email().optional()` (line ~15)
       - name: `z.string().trim().min(2).optional()` (line ~26)
       - newPassword/password: `.min(8)` without messages.
   - Recommended fixes:
     - Add error messages to each validator, e.g., `.email("Invalid email address")`, `.min(2, "Full name must be at least 2 characters")`, `.min(8, "Password must be at least 8 characters")`.

3. actions/wallet.actions.ts
   - Findings:
     - Good: Schema uses `.uuid("Invalid wallet ID format")` and action validates auth first (good). Uses DAL for DB operations.
     - Suggestion: Consider using `revalidateTag()` with more granular tags when unlinking wallets to avoid full page invalidation.

4. actions/user.actions.ts
   - Findings:
     - Good: Auth is used for protected flows and DAL is used for reads. Return shapes `{ ok, user?, error? }` are present.

5. actions/plaid.actions.ts
   - Findings:
     - Several Zod validators use `.min()` / `.max()` / `.trim().min()` calls without explicit error messages.
       - ExchangePublicTokenSchema: `publicToken: z.string().trim().min(1)` (no message)
       - GetAccountsSchema: `walletId: z.string().trim().min(1)` (no message)
       - GetTransactionsSchema: `count`, `endDate`, `offset`, `startDate`, `walletId` — many use `.min()`/`.max()` without messages.
       - GetBalanceSchema / GetInstitutionSchema / GetWalletWithDetailsSchema / RemoveWalletSchema: walletId/institutionId missing messages.
     - External API concurrency: `getAllBalances` and `getAllWalletsWithDetails` call Plaid in parallel via `Promise.all` over wallets. This is graceful but may hit rate limits for many wallets.
   - Recommended fixes:
     - Add error messages to all `.min()`/`.max()`/`.email()` validators.
     - Add a concurrency limit (e.g., p-map with concurrency=2 or 3) when calling external APIs, following `.opencode/instructions/08-alibaba-rate-limit-handling.md` guidance.

6. actions/dwolla.actions.ts
   - Findings:
     - Zod schemas in this file generally include descriptive messages for `.min()` validators (good).
     - One use of `db.transaction(async (tx: any) => { ... })` uses `any` for the transaction parameter — flagged by repository type checks.
   - Recommended fixes:
     - Replace `tx: any` with an inferred type (remove explicit `: any`) or use the proper Drizzle transaction type if available to avoid `any` in committed code.

7. actions/recipient.actions.ts
   - Findings:
     - RecipientSchema includes `.email("Invalid email address")` — good.
     - Revalidates dependent paths after mutations (good).

8. actions/admin.actions.ts
   - Findings:
     - Ensure admin mutations check `auth()` and `session.user.isAdmin` explicitly before performing admin operations (authorization on server actions is required even if middleware exists).

9. actions/admin-stats.actions.ts
   - Findings:
     - Pagination schemas use `.default()` without `.describe()`? Verify Zod meta presence and messages for min/max on page/pageSize.
   - Recommended fixes:
     - Add `.meta()` descriptions and messages for number validators where absent.

10. actions/transaction.actions.ts
    - Findings:
      - Uses DAL for paginated queries and checks auth (good).

Notes and next steps

- Priority 1 fixes (apply immediately):
  - Add missing Zod error messages in `actions/updateProfile.ts` and `actions/plaid.actions.ts` schemas.
  - Tighten return types for `actions/register.ts` to use `UserWithProfile`.

- Priority 2 fixes (next pass):
  - Replace `any` usage in `actions/dwolla.actions.ts` transaction callback.
  - Add concurrency limits for Plaid/Dwolla external API calls.

Generated during Phase 1 audit (read-only).
