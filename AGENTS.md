# Banking - Next.js Fintech App Context

Next.js 16 fintech banking application with Plaid/Dwolla integration.

## Architecture
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: Drizzle ORM + PostgreSQL
- **Payments**: Plaid (bank linking) + Dwolla (transfers)
- **Auth**: NextAuth.js
- **Deployment**: Docker + Vercel

## Conventions
- Use TypeScript strict mode
- Server Components by default
- API routes in `src/app/api/`
- Database schema in `src/db/schema.ts`
- Environment variables in `.env.local` (never commit)

## Commands
```bash
# Dev server
npm run dev

# Build
npm run build

# Database
npm run db:generate
npm run db:push
npm run db:studio

# Lint
npm run lint
```

## Important Notes
- Plaid keys in `.env.local` — never commit
- Dwolla sandbox for development
- Webhook handling for Plaid/Dwolla events