# Playwright E2E Tests

## Prerequisites

E2E tests require a **running PostgreSQL database** that is:

1. **Reachable** - The server must be accessible via the `DATABASE_URL` environment variable
2. **Seeded** - Must contain the test user (`seed-user@example.com`)

### Required Environment Variables

| Variable | Description | Example |
| --- | --- | --- |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/banking` |
| `ENCRYPTION_KEY` | Encryption key for the app | 32+ character string |
| `NEXTAUTH_SECRET` | NextAuth session secret | 32+ character string |

### Optional Environment Variables

| Variable | Description |
| --- | --- |
| `LOCAL_DATABASE_URL` | Fallback if `DATABASE_URL` is not set |
| `PLAYWRIGHT_PREPARE_DB` | Set to `true` to auto-prepare DB (default in `npm run test:ui`) |

## Setup

1. **Copy environment file**:

   ```bash
   cp .env.example .env.local
   ```

2. **Configure database**:

   ```bash
   # Edit .env.local and set your DATABASE_URL
   DATABASE_URL=postgresql://user:password@localhost:5432/banking
   ```

3. **Ensure PostgreSQL is running** and accessible

## Running Tests

### Full E2E Suite (requires DB)

```bash
npm run test:ui
```

This will:

1. Check database connectivity
2. Run `npm run db:push` to sync schema (if not already done)
3. Run `npm run db:seed -- --reset` to seed test data
4. Start the dev server
5. Run all Playwright tests

### Without Database Preparation

If the database is already seeded and running, you can run tests directly:

```bash
PLAYWRIGHT_PREPARE_DB=false npx playwright test
```

### Single Test File

```bash
npx playwright test tests/e2e/auth.spec.ts
```

### With UI Mode

```bash
npx playwright test --ui
```

## Test Data

### Seed User

The seed script creates a test user:

- **Email**: `seed-user@example.com`
- **Password**: `password123`

Use these credentials for authenticated E2E tests.

## Troubleshooting

### Database Connection Failed

```
[playwright] Cannot connect to database at <URL>
```

**Solutions**:

1. Verify PostgreSQL is running: `pg_isready` or check your database dashboard
2. Check the connection URL in `.env.local`
3. Ensure firewall/network allows connection to the database host
4. For Neon/Cloud databases, check connection pooling settings

### Database URL Not Set

```
[playwright] DATABASE_URL is not set
```

**Solution**: Set `DATABASE_URL` in `.env.local`:

```bash
echo 'DATABASE_URL=postgresql://user:pass@localhost:5432/banking' >> .env.local
```

### Schema Push Failed

If `db:push` fails:

```bash
# Check for migration issues
npm run db:check

# Reset and recreate
npm run db:reset
```

### Seed Script Errors

If seeding fails:

```bash
# Run seed manually with verbose output
npm run db:seed -- --reset --verbose
```

## CI/CD

In CI environments, ensure:

1. Database service is started before running tests
2. `DATABASE_URL` is set via environment secrets
3. Wait for database to be ready before running tests:

```yaml
# GitHub Actions example
services:
  postgres:
    image: postgres:16
    env:
      POSTGRES_PASSWORD: password
    options: >-
      --health-cmd pg_isready --health-interval 10s --health-timeout 5s --health-retries 5


    ports:
      - 5432:5432
```

## Test Structure

```
tests/e2e/
├── helpers/
│   └── db.ts          # Database connectivity helpers
├── pages.spec.ts      # Public pages tests
├── auth.spec.ts       # Authentication tests
├── bank-linking.spec.ts
├── payment-transfer.spec.ts
└── protected-pages.spec.ts
```

## Skipping Tests

To skip tests that require authentication when DB is unavailable:

```typescript
test.describe("Authenticated feature", () => {
  test.skip(
    process.env.DATABASE_URL === undefined,
    "Requires database connection"
  );
  // ... tests
});
```
