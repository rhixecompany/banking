# Environment Variables

Environment variables are defined and validated in `app-config.ts` using Zod.

- Preferred imports (new code): `import { auth, database, plaid, dwolla } from "@/app-config"`
- Compatibility import: `import { env } from "@/lib/env"` (re-exported from `app-config.ts`)

## Local Development

Copy the example file and fill in your values:

```bash
cp .env.example .env.local
```

Minimum for most flows:

- `DATABASE_URL`
- `ENCRYPTION_KEY`
- `NEXTAUTH_SECRET`

## Common Variables

The canonical starter list lives in `.env.example`.

| Variable | Notes |
| --- | --- |
| `DATABASE_URL` | Postgres connection string |
| `NEXTAUTH_URL` | e.g. `http://localhost:3000` |
| `NEXTAUTH_SECRET` | 32+ chars |
| `AUTH_GITHUB_ID` | optional |
| `AUTH_GITHUB_SECRET` | optional |
| `AUTH_GOOGLE_ID` | optional |
| `AUTH_GOOGLE_SECRET` | optional |
| `PLAID_CLIENT_ID` | required for Plaid flows |
| `PLAID_SECRET` | required for Plaid flows |
| `PLAID_ENV` | `sandbox` by default |
| `PLAID_BASE_URL` | usually sandbox URL |
| `PLAID_PRODUCTS` | default includes `auth,transactions,identity` |
| `PLAID_COUNTRY_CODES` | default includes `US,CA` |
| `PLAID_SANDBOX_USERNAME` | used for sandbox/E2E convenience |
| `PLAID_SANDBOX_PASSWORD` | used for sandbox/E2E convenience |
| `DWOLLA_KEY` | required for Dwolla flows |
| `DWOLLA_SECRET` | required for Dwolla flows |
| `DWOLLA_BASE_URL` | sandbox URL by default |
| `DWOLLA_ENV` | `sandbox` by default |
| `SMTP_HOST` | optional (emails) |
| `SMTP_PORT` | optional (emails) |
| `SMTP_USER` | optional (emails) |
| `SMTP_PASS` | optional (emails) |
| `SMTP_FROM` | optional |
| `NEXT_PUBLIC_SITE_URL` | public base URL |
| `PLAYWRIGHT_BASE_URL` | E2E runner base URL |

## Access Patterns

**Never read `process.env` directly in app code.** Use `app-config.ts` (preferred) or `lib/env.ts` (compat).

```ts
import { auth } from "@/app-config";

const nextAuthSecret = auth.NEXTAUTH_SECRET;
```
