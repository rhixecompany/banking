# Security Guide

Comprehensive security documentation for the Banking application.

---

## Secrets Management

### Environment File Method

The recommended approach is to use environment files (`.env` files) stored securely.

#### Required Environment Variables

| Variable | Description | Example |
| --- | --- | --- |
| `ENCRYPTION_KEY` | AES-256-GCM encryption key | 64 hex characters |
| `NEXTAUTH_SECRET` | NextAuth session secret | 32+ random characters |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `PLAID_CLIENT_ID` | Plaid API client ID | From Plaid dashboard |
| `PLAID_SECRET` | Plaid API secret | From Plaid dashboard |
| `DWOLLA_KEY` | Dwolla API key | From Dwolla dashboard |
| `DWOLLA_SECRET` | Dwolla API secret | From Dwolla dashboard |

### Security Best Practices

#### 1. Keep Secrets Out of Version Control

The `.env` files are gitignored. Never commit them:

```bash
# Verify .env files are ignored
git check-ignore .env .env.local .envs/production/.env.production
```

#### 2. Use Different Secrets per Environment

Never use the same secrets in staging and production:

```bash
# Staging
.envs/staging/.env.staging

# Production
.envs/production/.env.production
```

#### 3. Generate Strong Secrets

Use random generators for encryption keys:

```bash
# Generate encryption key
openssl rand -hex 32

# Generate NextAuth secret
openssl rand -base64 32
```

---

## Application Security Patterns

### Currency Precision

**NEVER** use floating point for currency. Use cent-based integers:

```typescript
// ❌ WRONG: Floating point causes rounding errors
const amount = 10.5;

// ✅ CORRECT: Use integers (cents)
const amountCents = 1050; // Represents $10.50
```

### Soft Delete Pattern

Database uses soft delete via `deletedAt` timestamp:

```typescript
// DAL automatically filters soft-deleted
async findById(id: string) {
  const [user] = await db.select().from(users).where(eq(users.id, id));
  return user?.deletedAt === null ? user : undefined;
}

// Soft delete
await db.update(users).set({ deletedAt: new Date() }).where(eq(users.id, id));
```

### Idempotency Keys

All financial transfers must use idempotency keys to prevent double-charges:

```typescript
import { v4 as uuidv4 } from "uuid";

const idempotencyKey = uuidv4();
// Include in transfer request headers
```

---

## Plaid/Dwolla Anti-Patterns

**NEVER** do these when integrating Plaid or Dwolla:

- ❌ **NEVER skip error boundaries on Plaid Link** — Plaid's hosted flow can fail silently
- ❌ **NEVER use Plaid access tokens in client components** — Tokens are valid for months and can be replayed
- ❌ **NEVER process Dwolla transfers without idempotency keys** — Network failures can cause double-transfers
- ❌ **NEVER store Plaid Item ID in plaintext** — If leaked, attacker can query transaction history
- ❌ **NEVER skip decimal precision in Dwolla amounts** — Using floating point causes fund loss

---

## Reporting Security Issues

If you believe you have found a security vulnerability, please report it through coordinated disclosure.

**Please do not report security vulnerabilities through public GitHub issues or pull requests.**

Send an email to opensource-security[@]github.com with:

- The type of issue (e.g., buffer overflow, SQL injection, cross-site scripting)
- Full paths of source file(s) related to the manifestation of the issue
- Step-by-step instructions to reproduce the issue
- Impact of the issue, including how an attacker might exploit it

---

## Related Documentation

- `docs/env-vars.md` — Environment variables reference
- `docs/secrets-management.md` — Full secrets management guide
- `app-config.ts` — Typed env config with Zod validation

---

_Consolidated from `SECURITY.md` and `docs/secrets-management.md`_
