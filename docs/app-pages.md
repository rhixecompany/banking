# App Pages

Last updated: 2026-04-12

Summary

- Pages discovered under `app/`: 10
- API routes discovered under `app/api/`: 3
- Notes: Routes use App Router conventions and a protected layout under `app/(root)/layout.tsx` that wraps with `PlaidProvider`.

| Route | File | Auth | Notes | Triage |
| --- | --- | --: | --- | --- |
| / | `app/page.tsx` | Public | Root landing/marketing page | Low |
| / (app/(root) index) | `app/(root)/page.tsx` | Protected (layout) | Protected site root; wrapped by protected layout | Medium |
| /dashboard | `app/(root)/dashboard/page.tsx` | Protected | Uses server actions for dashboard data | Medium |
| /my-wallets | `app/(root)/my-wallets/page.tsx` | Protected | Primary Plaid integration point — ensure single Plaid loader | High |
| /transaction-history | `app/(root)/transaction-history/page.tsx` | Protected | History UI; paginated server actions | Medium |
| /settings | `app/(root)/settings/page.tsx` | Protected | Account settings UI | Low |
| /payment-transfer | `app/(root)/payment-transfer/page.tsx` | Protected | Transfer flow (Dwolla + Plaid interactions possible) | High |
| /sign-up | `app/(auth)/sign-up/page.tsx` | Public | Auth flow (credentials) | Low |
| /sign-in | `app/(auth)/sign-in/page.tsx` | Public | Auth flow | Low |
| /admin | `app/(admin)/admin/page.tsx` | Protected, Admin only | Admin dashboard — requires `session.user.isAdmin` checks | High |

| API Route | File | Notes |
| --- | --- | --- |
| `/api/dwolla/webhook` | `app/api/dwolla/webhook/route.ts` | Webhook handler for Dwolla; ensure CSRF and signature validation |
| `/api/auth/[...nextauth]` | `app/api/auth/[...nextauth]/route.ts` | NextAuth route (jwt strategy) |
| `/api/health` | `app/api/health/route.ts` | Health-check endpoint used by CI |

Triage Details (short)

- High
  - Pages that use Plaid (e.g., `/my-wallets`, `/payment-transfer`) — must ensure Plaid Link script is injected exactly once.
  - Admin page — ensure authorization checks and tests are deterministic.
- Medium
  - Pages with heavy server actions (dashboard, transaction-history) — consider caching/joins to avoid N+1 or slow loads.
- Low
  - Static marketing or settings pages — small UX or accessibility tweaks.

Action items

- Confirm that pages using Plaid are always wrapped by the single `PlaidProvider` (preferred) or that local initializers check `window.__plaid_link_script_loaded`.
- Add route-level tests for protected redirects (unauthenticated → /sign-in).
- Consider dynamic imports for heavy client libraries (charts, Plaid consumer) on pages that need them.
