# Project Brief

## Project Overview

**Name:** Banking (Fintech SaaS Platform)  
**Type:** Next.js 16 Web Application  
**Core Functionality:** Financial platform connecting to multiple bank accounts, displaying real-time transactions, enabling money transfers between users  
**Target Users:** Consumers needing unified banking view and peer-to-peer transfers

---

## Core Requirements

### Authentication
- NextAuth v4 with JWT strategy
- Credentials + OAuth (GitHub, Google)
- Protected routes via middleware

### Bank Integration
- Plaid for bank account linking
- Real-time transaction sync
- Multiple accounts per user

### Money Transfers
- Dwolla for ACH transfers
- Internal transfers between platform users
- Idempotency keys for financial safety

### Data Management
- PostgreSQL + Drizzle ORM
- DAL (Data Access Layer) pattern
- Soft delete for data safety

---

## Key Constraints

1. **Never read `process.env` directly** — use `app-config.ts`
2. **Never import DB in UI** — use DAL helpers
3. **Batch N+1 queries** — use IN clauses
4. **Use Server Actions** — not API routes for mutations
5. **Keep home page static** — no auth/db/env in `app/page.tsx`
6. **Use cent-based integers** — never floating point for currency

---

## Success Criteria

- [x] User registration/login with NextAuth
- [x] Plaid bank account linking
- [x] Real-time transaction display
- [x] Internal transfers via Dwolla
- [x] Admin dashboard
- [ ] (Add as project evolves)