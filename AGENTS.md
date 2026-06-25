# Banking — Fintech App

## Architecture
- **Type:** Next.js fintech application (banking dashboard)
- **Pattern:** App Router with Drizzle ORM, Plaid/Dwolla integrations
- **Reference:** [Workflow Analysis](docs/Project_Architecture/Workflow_Analysis.md), [Exemplars](docs/Project_Architecture/exemplars.md)

Next.js 16 + Drizzle ORM + Plaid (banking API) + Dwolla (payments). Full-stack fintech with transaction management, authentication, and webhook handling.

## Stack
- **Frontend:** Next.js 16, TypeScript (strict), App Router
- **Database:** PostgreSQL via Drizzle ORM
- **Auth:** NextAuth.js
- **Payments/Banking:** Plaid, Dwolla
- **Deploy:** Docker + Vercel
- **Package Manager:** Bun (`bun.lock`)

## Commands
```bash
npm run dev
npm run build
npm run lint
npm run db:generate
npm run db:push
npm run db:studio
```

## Conventions
- Schema in `src/db/schema.ts`; use Drizzle migrations (not raw SQL)
- `.env.local` for secrets — never commit
- Plaid sandbox mode for development
- Webhooks for Plaid/Dwolla async events
- Node 18+ required

## Notes
- Uses `bun` as package manager with `bun.lock`
- API routes in `src/app/api/`
- Drizzle Studio for DB inspection
