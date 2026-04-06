# Environment Variables

All environment variables validated via `lib/env.ts` using Zod. **Never read `process.env` directly** — always import from `@/lib/env`.

## All Variables (24)

| # | Variable | Required | Sensitive | Docker Variant |
| --- | --- | --- | --- | --- |
| 1 | `ENCRYPTION_KEY` | Yes | Yes | `ENCRYPTION_KEY_FILE` |
| 2 | `NEXTAUTH_SECRET` | Yes | Yes | `NEXTAUTH_SECRET_FILE` |
| 3 | `NODE_ENV` | No | No | - |
| 4 | `PORT` | No | No | - |
| 5 | `HOSTNAME` | No | No | - |
| 6 | `NEXT_PUBLIC_SITE_URL` | No | No | - |
| 7 | `DATABASE_URL` | No | Yes | `DATABASE_URL_FILE` |
| 8 | `PLAID_CLIENT_ID` | No | No | - |
| 9 | `PLAID_SECRET` | No | Yes | `PLAID_SECRET_FILE` |
| 10 | `PLAID_ENV` | No | No | - |
| 11 | `PLAID_BASE_URL` | No | No | - |
| 12 | `DWOLLA_KEY` | No | No | - |
| 13 | `DWOLLA_SECRET` | No | Yes | `DWOLLA_SECRET_FILE` |
| 14 | `DWOLLA_ENV` | No | No | - |
| 15 | `DWOLLA_BASE_URL` | No | No | - |
| 16 | `AUTH_GITHUB_ID` | No | No | - |
| 17 | `AUTH_GITHUB_SECRET` | No | Yes | `AUTH_GITHUB_SECRET_FILE` |
| 18 | `AUTH_GOOGLE_ID` | No | No | - |
| 19 | `AUTH_GOOGLE_SECRET` | No | Yes | `AUTH_GOOGLE_SECRET_FILE` |
| 20 | `NEXTAUTH_URL` | No | No | - |
| 21 | `SMTP_HOST` | No | No | - |
| 22 | `SMTP_PORT` | No | No | - |
| 23 | `SMTP_USER` | No | No | - |
| 24 | `SMTP_PASS` | No | Yes | `SMTP_PASS_FILE` |

**Optional:** `REDIS_URL` for rate limiting.

## Sensitive vs Plain

### Sensitive (use Docker Swarm secrets)

- `ENCRYPTION_KEY`
- `NEXTAUTH_SECRET`
- `DATABASE_URL`
- `PLAID_SECRET`
- `DWOLLA_SECRET`
- `AUTH_GITHUB_SECRET`
- `AUTH_GOOGLE_SECRET`
- `SMTP_PASS`

### Plain (can use .env files)

- All others

## Docker Compose Environment Files

In production, use environment files with Docker Compose:

```bash
# Create environment file
docker compose --env-file .envs/production/.env.production up -d
```

Or reference the env file in `docker-compose.yml`:

```yaml
services:
  app:
    env_file:
      - .envs/production/.env.production
```

## Validation

All vars validated at startup via `lib/env.ts`. Missing required vars will throw errors.

```typescript
import { env } from "@/lib/env";

// GOOD
const encryptionKey = env.ENCRYPTION_KEY;

// BAD
const encryptionKey = process.env.ENCRYPTION_KEY;
```
