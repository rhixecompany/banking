# App Pages Inventory

This document lists files under the app/ directory. Pages are marked as Client when they contain a top-level "use client" directive; otherwise they are Server (Next.js Server Component by default).

Format: - Path — Type

- app/page.tsx — Server
- app/layout.tsx — Server
- app/global-error.tsx — Client
- app/not-found.tsx — Server
- app/api/auth/[...nextauth]/route.ts — Server (API route)
- app/api/dwolla/webhook/route.ts — Server (API route)
- app/api/health/route.ts — Server (API route)
- app/(root)/layout.tsx — Server
- app/(root)/page.tsx — Server
- app/(root)/my-wallets/page.tsx — Server
- app/(root)/my-wallets/loading.tsx — Server
- app/(root)/my-wallets/error.tsx — Client
- app/(root)/dashboard/page.tsx — Server
- app/(root)/dashboard/loading.tsx — Server
- app/(root)/dashboard/error.tsx — Client
- app/(root)/transaction-history/page.tsx — Server
- app/(root)/transaction-history/loading.tsx — Server
- app/(root)/transaction-history/error.tsx — Client
- app/(root)/payment-transfer/page.tsx — Server
- app/(root)/payment-transfer/loading.tsx — Server
- app/(root)/payment-transfer/error.tsx — Client
- app/(root)/settings/page.tsx — Server
- app/(root)/settings/loading.tsx — Server
- app/(root)/settings/error.tsx — Client
- app/(auth)/layout.tsx — Server
- app/(auth)/sign-in/page.tsx — Server
- app/(auth)/sign-in/loading.tsx — Client
- app/(auth)/sign-in/error.tsx — Client
- app/(auth)/sign-up/page.tsx — Server
- app/(auth)/sign-up/loading.tsx — Client
- app/(auth)/sign-up/error.tsx — Client
- app/(admin)/layout.tsx — Server
- app/(admin)/admin/page.tsx — Server
- app/(admin)/admin/loading.tsx — Client
- app/(admin)/admin/error.tsx — Client

Notes:

- Pages marked Client were identified by the presence of a top-level "use client" directive.
- Server actions and Zod usage should be audited per page; this inventory is a starting point for triage.
