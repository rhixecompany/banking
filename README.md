# Banking

A Next.js 16 fintech banking application with PostgreSQL, Drizzle ORM, and Plaid/Dwolla integrations.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: PostgreSQL + Drizzle ORM
- **Auth**: NextAuth v4
- **Integrations**: Plaid (banking), Dwolla (ACH transfers)
- **UI**: shadcn/ui + Tailwind CSS

## Quick Start

```bash
# Install dependencies
bun install

# Set up environment
cp .env.local.example .env.local

# Push database schema
bun run db:push

# Start development server
bun run dev
```

## Commands

| Command               | Description             |
| --------------------- | ----------------------- |
| `bun run dev`         | Start dev server        |
| `bun run build`       | Production build        |
| `bun run db:push`     | Push schema to database |
| `bun run db:studio`   | Open Drizzle Studio     |
| `bun run format`      | Format code             |
| `bun run lint:strict` | Strict linting          |
| `bun run type-check`  | TypeScript validation   |

## Project Structure

```
src/
├── actions/           # Server Actions
├── app/               # Next.js App Router
│   ├── (auth)/        # Auth routes
│   ├── (root)/        # Main app
│   └── api/           # API routes
├── components/        # React components
├── dal/               # Data Access Layer
├── database/          # Drizzle schema
├── lib/               # Utilities
└── types/             # TypeScript types
```

## Environment Variables

Required in `.env.local`:

```env
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=...
PLAID_CLIENT_ID=...
PLAID_SECRET=...
DWOLLA_KEY=...
DWOLLA_SECRET=...
```

## Documentation

- [Developer Docs Index](docs/DeveloperDocsIndex.md)
- [Drizzle ORM Guide](docs/DrizzleORMGuide.md)
- [Plaid Integration](docs/PlaidIntegrationGuide.md)
- [Dwolla Integration](docs/DwollaIntegrationGuide.md)

## Security

- Never commit secrets — use `.env.local`
- Encrypt sensitive data — see `lib/utils`
- Validate all inputs — use Zod at every action entry point
- Use soft-delete — never hard delete user data
- Implement idempotency — for all financial transactions

## Testing

```bash
bun run test          # All tests
bun run test:unit     # Unit tests only
bun run test:e2e      # E2E tests (Playwright)
```

## Related Docs

- [ARCHITECTURE.md](ARCHITECTURE.md)
- [CODE_STYLE.md](CODE_STYLE.md)
- [AGENTS.md](AGENTS.md)
