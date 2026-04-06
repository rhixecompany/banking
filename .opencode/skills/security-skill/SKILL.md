---
name: SecuritySkill
description: Security patterns for the Banking app - encryption, input sanitization, CSRF protection, and secure headers. Use when handling sensitive data, authentication, or security-critical code.
---

# SecuritySkill - Banking Security Patterns

## Overview

This skill provides guidance on security patterns for the Banking project.

## Encryption (AES-256-GCM)

```typescript
// lib/encryption.ts
import { encrypt, decrypt } from "@/lib/encryption";
import { env } from "@/lib/env";

// encrypt(plaintext, key) → "iv:authTag:ciphertext" (hex, colon-separated)
const encrypted = encrypt(accountNumber, env.ENCRYPTION_KEY);
const plaintext = decrypt(encrypted, env.ENCRYPTION_KEY);
```

## Input Sanitization

All input sanitized through Zod before DB or external API calls. Drizzle handles SQL injection prevention via parameterized queries.

```typescript
import { z } from "zod";

const inputSchema = z.object({
  email: z.string().email().describe("User email"),
  amount: z.coerce.number().min(0.01).describe("Transfer amount")
});
```

## Rate Limiting (`proxy.ts`)

Rate limiting lives **directly in `proxy.ts`** (not a separate file). Uses Upstash Redis with graceful degradation:

```typescript
// proxy.ts — rate limiter (lazy-initialized)
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Guard BEFORE calling Redis.fromEnv() — on Windows the SDK throws
// a native error if env vars are absent, crashing the worker process.
const ratelimit = (() => {
  if (
    !process.env.UPSTASH_REDIS_REST_URL ||
    !process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    return undefined;
  }
  try {
    return new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(5, "60 s"),
      prefix: "banking-auth",
      analytics: true
    });
  } catch {
    return undefined;
  }
})();

// Usage in proxy() — only on /sign-in and /sign-up
if (ratelimit) {
  const { success, remaining, reset } =
    await ratelimit.limit(identifier);
  if (!success)
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429 }
    );
}
```

**Key points:**

- Uses `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` (not `REDIS_URL`)
- `REDIS_URL` is defined in `app-config.ts` but rate limiting uses the Upstash REST credentials directly
- If credentials are absent, rate limiting is silently skipped
- IP extracted from `x-forwarded-for`, `x-real-ip`, or `cf-connecting-ip` headers

## Security Headers (`next.config.ts`)

Security headers configured in Next.js config (HSTS, X-Frame-Options, CSP, etc.).

## CSRF Protection

Next.js includes built-in CSRF protection for Server Actions:

```typescript
"use server";
// Automatic CSRF protection via origin check
```

## Password Hashing

Uses `bcryptjs` at cost 12:

```typescript
import bcrypt from "bcryptjs";
const hashed = await bcrypt.hash(password, 12);
```

## Environment Variables

Required: `ENCRYPTION_KEY` (32+ char key for AES-256) Optional: `REDIS_URL` (Upstash Redis URL for general use)

Rate limiting uses `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` directly in `proxy.ts` (edge runtime constraint — cannot import `lib/env.ts`).

**Never read `process.env` directly** except in `proxy.ts` (edge runtime) and config files. Use `app-config.ts` (preferred) or `lib/env.ts`.

## Critical Rules

1. **Never log sensitivity data** — Don't log passwords, tokens, account numbers
2. **Encrypt at rest** — All financial data encrypted with AES-256-GCM
3. **Rate limit** — Protect against brute force attacks (proxy.ts)
4. **Validate input** — Always use Zod schemas
5. **Use Server Actions** — Built-in CSRF protection
6. **Hash passwords** — bcryptjs at cost 12
7. **No raw `process.env`** — Use `app-config.ts` or `lib/env.ts` (except `proxy.ts`)

## Validation

Run: `npm run type-check` and `npm run lint:strict`
