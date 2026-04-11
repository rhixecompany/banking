# App Pages

This document lists all routes discovered in the Next.js app/ directory, notes about layouts and caching, and includes references to rendered screenshots saved under docs/screenshots/. Screenshots are captured at desktop (1280x800) and mobile (390x844) sizes.

Notes

- Rendered screenshots: docs/screenshots/<route-name>-desktop.png and -mobile.png
- If a route is a dynamic segment, the file path is shown and the example URL used for screenshots is provided.

## Routes

- / (app/page.tsx) — Layout: app/(root)/layout.tsx — Screenshot: docs/screenshots/root-desktop.png, docs/screenshots/root-mobile.png
- /dashboard (app/(root)/dashboard/page.tsx) — Layout: app/(root)/layout.tsx — Screenshot: docs/screenshots/dashboard-desktop.png, docs/screenshots/dashboard-mobile.png
- /my-wallets (app/(root)/my-wallets/page.tsx) — Screenshot: docs/screenshots/my-wallets-desktop.png, docs/screenshots/my-wallets-mobile.png
- /transaction-history (app/(root)/transaction-history/page.tsx) — Screenshot: docs/screenshots/transaction-history-desktop.png, docs/screenshots/transaction-history-mobile.png
- /settings (app/(root)/settings/page.tsx) — Screenshot: docs/screenshots/settings-desktop.png, docs/screenshots/settings-mobile.png
- /payment-transfer (app/(root)/payment-transfer/page.tsx) — Screenshot: docs/screenshots/payment-transfer-desktop.png, docs/screenshots/payment-transfer-mobile.png
- /sign-in (app/(auth)/sign-in/page.tsx) — Layout: app/(auth)/layout.tsx — Screenshot: docs/screenshots/sign-in-desktop.png, docs/screenshots/sign-in-mobile.png
- /sign-up (app/(auth)/sign-up/page.tsx) — Screenshot: docs/screenshots/sign-up-desktop.png, docs/screenshots/sign-up-mobile.png
- /admin (app/(admin)/admin/page.tsx) — Layout: app/(admin)/layout.tsx — Screenshot: docs/screenshots/admin-desktop.png, docs/screenshots/admin-mobile.png

## API routes

- /api/auth/[...nextauth] (app/api/auth/[...nextauth]/route.ts)
- /api/dwolla/webhook (app/api/dwolla/webhook/route.ts)
- /api/health (app/api/health/route.ts)

## How screenshots were captured

- Dev server started via `npm run dev`
- Playwright script visited each route and captured desktop and mobile screenshots
- Screenshots saved to docs/screenshots/
