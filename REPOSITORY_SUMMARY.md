# Banking — Repository Summary

**Generated:** 2026-07-25  
**Project:** `projects/Banking/`  
**Type:** Next.js 16 Fintech Application  
**Status:** Active

---

## Architecture Overview

| Property            | Value                              |
| ------------------- | ---------------------------------- |
| **Framework**       | Next.js 16 (App Router)            |
| **Language**        | TypeScript (strict)                |
| **Database**        | PostgreSQL via Drizzle ORM         |
| **Auth**            | NextAuth.js                        |
| **Banking APIs**    | Plaid (linking), Dwolla (payments) |
| **Package Manager** | Bun (`bun.lock`)                   |
| **Deploy**          | Docker + Vercel                    |

---

## Key Components

```
src/
├── app/
│   ├── api/           # API routes (Plaid, Dwolla, auth)
│   ├── dashboard/     # Protected dashboard pages
│   └── layout.tsx     # Root layout with providers
├── components/        # UI components (shadcn/ui)
├── db/
│   ├── schema.ts      # Drizzle schema definitions
│   └── index.ts       # Database client
├── lib/
│   ├── plaid.ts       # Plaid client configuration
│   ├── dwolla.ts      # Dwolla client configuration
│   └── auth.ts        # NextAuth configuration
└── types/             # Shared TypeScript types
```

---

## Technologies

| Category  | Technology                                    |
| --------- | --------------------------------------------- |
| Frontend  | Next.js 16, React 19, Tailwind CSS, shadcn/ui |
| Backend   | Next.js API Routes, Drizzle ORM               |
| Database  | PostgreSQL (Neon/Vercel Postgres)             |
| Auth      | NextAuth.js v5                                |
| Banking   | Plaid API (Account linking), Dwolla API (ACH) |
| Dev Tools | Bun, ESLint, Prettier, TypeScript strict      |
| CI/CD     | GitHub Actions (project-specific)             |

---

## Data Flow

```
User Action
    │
    ├─→ Plaid Link Token → Frontend → Plaid Link UI → Public Token
    │       │
    │       └─→ Exchange Public Token → Access Token → Store (encrypted)
    │
    ├─→ Dwolla Customer → Create Funding Source → Initiate Transfer
    │
    └─→ Webhooks (Plaid/Dwolla) → API Routes → Update DB → Notify User
```

---

## Security Considerations

- All secrets in `.env.local` (never committed)
- Plaid sandbox for development
- Access tokens encrypted at rest
- Webhook signature verification
- CSRF protection via NextAuth
- Rate limiting on API routes

---

## Commands

```bash
# Development
bun install
bun run dev

# Database
bun run db:generate   # Generate Drizzle migrations
bun run db:push       # Push schema to DB
bun run db:studio     # Open Drizzle Studio

# Quality
bun run lint          # ESLint
bun run typecheck     # TypeScript strict check
bun run build         # Production build
```

---

## CI/CD

**Workflow:** `.github/workflows/banking-ci.yml`  
**Triggers:** Push/PR to `development` or `production` touching `projects/Banking/**`  
**Jobs:** Install → TypeCheck → Lint → Build → Test

---

## Related Projects

- **rhixecompany-comics** — Shares Drizzle ORM patterns
- **university-libary-jsm** — Shares Next.js 15/16 patterns
- **comicwise** — Shares Prisma/Drizzle comparison insights

---

## Open Items

- [ ] Migrate from Plaid sandbox to production
- [ ] Add comprehensive test coverage
- [ ] Implement webhook retry logic
- [ ] Add monitoring/alerting for failed transfers
