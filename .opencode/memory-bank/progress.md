# Progress

## What Works

- ✅ User registration and authentication (NextAuth v4 + JWT)
- ✅ Bank account linking via Plaid
- ✅ Real-time transaction sync from Plaid
- ✅ Internal transfers via Dwolla ACH
- ✅ Admin dashboard with user management
- ✅ Transaction history with filtering/pagination
- ✅ DAL pattern for type-safe DB queries
- ✅ Server Actions for all mutations
- ✅ E2E tests with Playwright (stateful, 1 worker)
- ✅ Unit tests with Vitest

## What's Left to Build

- Enhanced category-based spending analytics
- Recurring transfers/scheduled payments
- Push notifications for transactions
- Mobile app companion

## Current Status

Active development project. Core banking features complete.

## Known Issues

- ENCRYPTION_KEY must be manually added to `.env.local` (not in `.env.example`)
- Missing ENCRYPTION_KEY causes silent E2E failures
- Port 3000 must be free before running E2E/Vitest

## Project Evolution

### v3.2 (2026-05-07)
- AGENTS.md trimmed, added OpenCode config notes
- Memory bank created

### v3.1 (2026-05-06)
- Optimized AGENTS.md
- Banking skill refined

### v3.0
- Next.js 16 upgrade
- React 19 compatibility
- Server Components by default