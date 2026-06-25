# Banking — Setup Guide

## Prerequisites

- **Bun** ≥ 1.3.14 (or Node.js ≥ 18)
- **PostgreSQL** 14+ (local or cloud)
- **Plaid** developer account (sandbox)
- **Dwolla** developer account (sandbox)

## 1. Clone & Install

```bash
git clone <repo-url>
cd banking
bun install
```

## 2. Environment Variables

Copy the example file and fill in your values:

```bash
cp .env.local.example .env.local
```

Required variables:

```env
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/banking

# Auth
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Plaid (Sandbox)
PLAID_CLIENT_ID=your-plaid-client-id
PLAID_SECRET=your-plaid-secret
PLAID_ENV=sandbox

# Dwolla (Sandbox)
DWOLLA_KEY=your-dwolla-key
DWOLLA_SECRET=your-dwolla-secret
DWOLLA_ENV=sandbox

# Upstash Redis (Rate Limiting)
UPSTASH_REDIS_REST_URL=your-upstash-url
UPSTASH_REDIS_REST_TOKEN=your-upstash-token
```

## 3. Database Setup

Create the PostgreSQL database:

```bash
createdb banking
```

Push schema:

```bash
bun run db:push
```

Seed sample data (optional):

```bash
bun run db:seed
```

## 4. Start Development

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 5. Verify Setup

Run the validation suite:

```bash
bun run validate
```

This runs: type-check → lint → build → test.

## Plaid Sandbox Setup

1. Register at [Plaid Dashboard](https://dashboard.plaid.com)
2. Create a new app and get Client ID + Secret
3. Set `PLAID_ENV=sandbox`
4. Use Plaid sandbox credentials (user_good, pass_good) for testing

## Dwolla Sandbox Setup

1. Register at [Dwolla Developer Portal](https://developers.dwolla.com)
2. Create a sandbox application
3. Get Key and Secret
4. Set `DWOLLA_ENV=sandbox`

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `bun install` fails | Ensure Bun ≥ 1.3.14: `bun upgrade` |
| Database connection failed | Verify PostgreSQL running & `DATABASE_URL` correct |
| `bun run db:push` fails | Check DB permissions, run `createdb banking` |
| Plaid link token error | Verify `PLAID_CLIENT_ID` and `PLAID_SECRET` in `.env.local` |
| TypeScript errors | Run `bun run type-check` for details |
| Build fails | Run `bun run clean` then `bun run build` |
