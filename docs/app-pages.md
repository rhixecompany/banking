# App Pages Inventory — Phase 1 Audit

Purpose

- A read-only inventory of all files under `app/` discovered during Phase 1.
- Initial compliance notes and recommended next actions for each route / route-group.

Notes

- This file was generated automatically as part of the Phase 1 audit (read-only).
- Entries include file path, role (page/layout/loading/error/API), and short compliance notes.

Summary

- Route groups discovered: (root), (auth), (admin)
- Pages & route files enumerated below. Review notes indicate common check points:
  - Ensure pages use Server Components by default (only use "use client" where interactivity is required).
  - Verify protected pages call `auth()` in server actions or are guarded by middleware (proxy.ts).
  - Confirm data fetching uses DAL helpers (no DB queries in components).
  - Verify metadata/generateMetadata handles async params correctly (Next.js v16: params/searchParams are async).

Inventory

- / (Application root)
  - app/page.tsx — page — Public home page. Uses HomeServerWrapper. Recommendation: verify server wrapper uses DAL and Suspense boundaries for heavy queries.
  - app/layout.tsx — layout — Global layout, fonts and metadata. Ensure fonts are optimized and metadata is declared via the Metadata API.
  - app/not-found.tsx — not-found boundary — Verify user-friendly messaging and status handling.
  - app/global-error.tsx — global error boundary — Review for safe error reporting (no secrets) and structured logging hooks.

- Route group: (root)
  - app/(root)/layout.tsx — layout for protected root routes. Verify it composes with top-level layout and uses auth/session as needed.
  - app/(root)/page.tsx — (exists alongside app/page.tsx) — possible duplicate/overlap. ACTION: confirm which file is active for `/` and whether both are needed.
  - app/(root)/dashboard/page.tsx — page — Dashboard (likely requires auth). Files:
    - app/(root)/dashboard/loading.tsx
    - app/(root)/dashboard/error.tsx Compliance: ensure server actions validate auth before DB writes and use DAL for reads. Add Suspense boundaries where subtrees fetch heavy data.
  - app/(root)/my-wallets/page.tsx — page
    - app/(root)/my-wallets/loading.tsx
    - app/(root)/my-wallets/error.tsx Compliance: sensitive data (wallets) — ensure auth gating and no client-side secrets are leaked.
  - app/(root)/transaction-history/page.tsx — page
    - app/(root)/transaction-history/loading.tsx
    - app/(root)/transaction-history/error.tsx Compliance: large lists — ensure pagination and DAL-based queries to avoid large payloads. Use SWR/Suspense for streaming if appropriate.
  - app/(root)/settings/page.tsx — page
    - app/(root)/settings/loading.tsx
    - app/(root)/settings/error.tsx Compliance: forms use Server Actions for updates. Confirm Zod validation and auth guard are present in Server Actions.
  - app/(root)/payment-transfer/page.tsx — page
    - app/(root)/payment-transfer/loading.tsx
    - app/(root)/payment-transfer/error.tsx Compliance: payment flows must validate inputs server-side and use Server Actions. Ensure third-party calls (Plaid/Dwolla) are abstracted behind service modules and that retries/backoff are implemented where needed.

- Route group: (auth)
  - app/(auth)/layout.tsx — layout for auth routes (sign-in / sign-up)
  - app/(auth)/sign-in/page.tsx — page
    - app/(auth)/sign-in/loading.tsx
    - app/(auth)/sign-in/error.tsx
  - app/(auth)/sign-up/page.tsx — page
    - app/(auth)/sign-up/loading.tsx
    - app/(auth)/sign-up/error.tsx Compliance: auth pages should be client-first for interactive forms but validate via Server Actions. Confirm NextAuth route and callback handling.

- Route group: (admin)
  - app/(admin)/layout.tsx — admin layout
  - app/(admin)/admin/page.tsx — admin dashboard
    - app/(admin)/admin/loading.tsx
    - app/(admin)/admin/error.tsx Compliance: admin pages require explicit authorization checks (isAdmin) in Server Actions; do NOT rely solely on middleware for security. Verify `auth()` + isAdmin checks in server actions.

- API routes (app/api)
  - app/api/auth/[...nextauth]/route.ts — NextAuth handler. Verify provider configuration in lib/auth-options.ts and secure callbacks.
  - app/api/health/route.ts — health check endpoint — keep minimal and fast.
  - app/api/dwolla/webhook/route.ts — Dwolla webhook — verify signature verification, idempotency, and background processing patterns.
  - app/api/**playwright**/set-cookie/route.ts — Playwright helper (test-only). Confirm it is excluded from production or guarded (this is used by E2E helpers).

Initial action items (priority)

1. Resolve duplicate/overlapping root pages: `app/page.tsx` vs `app/(root)/page.tsx`. Determine which one is canonical for `/` and remove/merge the other if redundant. (High)
2. Verify every protected page either uses auth() in Server Actions or is guarded by middleware at the route-level (proxy.ts). (High)
3. Confirm forms use Server Actions (no API routes or client-only mutations) and Zod validation with `.meta()`/`.describe()` and explicit error messages per zod/ESLint rules. (High)
4. Ensure that large list pages (transaction-history, my-wallets) use pagination/DAL queries and do not fetch massive datasets into memory. (Medium)
5. Add tests for page-level flows where none exist (e.g., settings form, payment transfer edge cases). (Medium)

Next steps (Phase 2)

- Produce a per-file audit report for pages that are marked High priority and create small change-sets fixing Zod schema messages, Server Actions auth checks, and DAL usage.
- After fixes, run type-check, lint:strict, and tests for the change-set.

Generated by Phase 1 audit (read-only).
