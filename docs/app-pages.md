---
title: App Pages Inventory
---

# App Pages Inventory

This document lists all routes/pages found under the `app/` directory and basic metadata useful for audits and refactors.

Format: path — Server/Client — Notes

- app/page.tsx — Server — Root landing page (uses dashboard wrapper)
- app/not-found.tsx — Server — Global not-found UI
- app/layout.tsx — Server — Root layout for the app
- app/global-error.tsx — Server — Global error boundary

- app/api/auth/[...nextauth]/route.ts — Server — NextAuth route (strategy: jwt)
- app/api/health/route.ts — Server — Health-check endpoint

- app/(root)/layout.tsx — Server — Protected root layout
- app/(root)/page.tsx — Server — Root dashboard redirect/landing

- app/(root)/dashboard/page.tsx — Server — Dashboard page
- app/(root)/dashboard/loading.tsx — Server — Suspense loading
- app/(root)/dashboard/error.tsx — Server — Error boundary

- app/(root)/my-wallets/page.tsx — Server — My Wallets list
- app/(root)/my-wallets/loading.tsx — Server — Loading
- app/(root)/my-wallets/error.tsx — Server — Error boundary

- app/(root)/transaction-history/page.tsx — Server — Transaction history
- app/(root)/transaction-history/loading.tsx — Server — Loading
- app/(root)/transaction-history/error.tsx — Server — Error boundary

- app/(root)/settings/page.tsx — Server — User settings
- app/(root)/settings/loading.tsx — Server — Loading
- app/(root)/settings/error.tsx — Server — Error boundary

- app/(root)/payment-transfer/page.tsx — Server — Transfer funds page
- app/(root)/payment-transfer/loading.tsx — Server — Loading
- app/(root)/payment-transfer/error.tsx — Server — Error boundary

- app/(auth)/layout.tsx — Server — Auth layout (sign-in/sign-up)
- app/(auth)/sign-in/page.tsx — Client — Sign-in form (client component)
- app/(auth)/sign-in/loading.tsx — Client — Loading
- app/(auth)/sign-in/error.tsx — Client — Error boundary
- app/(auth)/sign-up/page.tsx — Client — Sign-up form (client component)
- app/(auth)/sign-up/loading.tsx — Client — Loading
- app/(auth)/sign-up/error.tsx — Client — Error boundary

- app/(admin)/layout.tsx — Server — Admin layout
- app/(admin)/admin/page.tsx — Server — Admin dashboard
- app/(admin)/admin/loading.tsx — Server — Loading
- app/(admin)/admin/error.tsx — Server — Error boundary

Notes:

- The project uses App Router; most pages are server components by default. Client pages/components include explicit `"use client"` directive.
- Pages that perform mutations call Server Actions located in `lib/actions` or `actions/`.
- Before changing routes, run `npm run type-check` and `npm run lint:strict`.
