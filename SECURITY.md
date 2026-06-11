# Security Guidelines

This document outlines security requirements and best practices for the Banking application.

## Overview

This is a fintech application handling sensitive financial data. Security is paramount.

## Security Rules

### 1. Environment Variables & Secrets

- **NEVER commit secrets** - Use `.env.local` and access via `lib/env.ts`
- Use `lib/env.ts` for typed environment access
- `proxy.ts` is the only file allowed to read `process.env` directly
- Rotate secrets regularly
- Required secrets: `DATABASE_URL`, `ENCRYPTION_KEY`, `NEXTAUTH_SECRET`

### 2. Data Encryption

- All sensitive data must be encrypted at rest
- Use the encryption utilities in `lib/utils` for encrypting/decrypting
- Never store plaintext passwords - use bcrypt (12 rounds minimum)
- Encrypt bank access tokens and API keys before storage

### 3. Input Validation

- Validate all inputs using Zod at every action entry point
- Never trust user input - validate before database operations
- Use parameterized queries (Drizzle handles this)
- Sanitize outputs to prevent XSS

### 4. Authentication & Authorization

- Use NextAuth v4 with JWT sessions
- Implement proper session management
- Use middleware for protected routes
- Implement rate limiting on auth endpoints

### 5. Soft Delete

- Never hard delete user data - use soft-delete pattern
- User accounts, bank accounts, and transactions use soft-delete
- DAL queries must always filter `deletedAt IS NULL`

### 6. Idempotency

- Implement idempotency keys for all financial transactions
- Prevent duplicate transfers
- Handle race conditions gracefully

```typescript
import { crypto } from "crypto";

const idempotencyKey = crypto.randomUUID();
```

### 7. API Security

- Validate all API inputs
- Use proper error handling - don't expose internals to client
- Implement rate limiting
- Log security events

### 8. Database Security

- Use parameterized queries (Drizzle ORM)
- Never concatenate user input into SQL
- Use least-privilege database users
- Encrypt sensitive database fields

### 9. Third-Party Integrations

- Plaid: Secure token exchange, never expose access tokens
- Dwolla: ACH transfers require proper authorization
- Validate all webhook payloads
- Store only encrypted tokens externally

## Reporting Security Issues

If you discover a security vulnerability, please report it responsibly:

1. **DO NOT** create a public GitHub issue
2. Email the maintainers directly
3. Provide detailed reproduction steps
4. Allow time for remediation before disclosure

## Security Checklist

Before deploying to production:

- [ ] All environment variables configured
- [ ] Encryption keys set and rotated
- [ ] Rate limiting enabled on all public endpoints
- [ ] SSL/TLS configured
- [ ] Database connection uses SSL
- [ ] Session timeout configured
- [ ] Logging and monitoring in place
- [ ] Backup strategy tested
- [ ] Dependencies updated and audited

## Dependencies Security

Regularly audit dependencies for vulnerabilities:

```bash
bun run check-updates --deep
# or
npm audit
```

## Compliance

This application should comply with:

- PCI DSS (if storing card data)
- SOC 2 requirements
- GDPR data protection requirements

## Quick Reference

| Security Concern | Implementation                   |
| ---------------- | -------------------------------- |
| Password hashing | `bcrypt` with 12 rounds          |
| Token encryption | `lib/utils` encryption functions |
| Input validation | Zod schemas at action entry      |
| Session strategy | NextAuth v4 JWT                  |
| Delete pattern   | Soft-delete with `deletedAt`     |
| Financial safety | Idempotency keys                 |

## Contact

For security concerns, contact the development team.
