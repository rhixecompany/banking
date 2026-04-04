---
name: SecuritySkill
description: Security patterns for the Banking app - encryption, input sanitization, CSRF protection, and secure headers. Use when handling sensitive data, authentication, or security-critical code.
---

# SecuritySkill - Banking Security Patterns

## Overview

This skill provides guidance on security patterns for the Banking project.

## Key Patterns

### Encryption (AES-256-GCM)

```typescript
// Usage — always import env from lib/env.ts
import { encrypt, decrypt } from "@/lib/encryption";
import { env } from "@/lib/env";

// encrypt(plaintext, key) → "iv:authTag:ciphertext" (hex, colon-separated)
const encrypted = encrypt(accountNumber, env.ENCRYPTION_KEY);
const plaintext = decrypt(encrypted, env.ENCRYPTION_KEY);
```

### Input Sanitization

```typescript
// lib/sanitize.ts
import { z } from "zod";

// Validate and sanitize HTML input
export const sanitizedHtml = z
  .string()
  .transform(val =>
    val.replace(
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      ""
    )
  );

// SQL injection prevention - use parameterized queries (Drizzle handles this)
```

### Rate Limiting

```typescript
// lib/rate-limit.ts
// Rate limiting uses REDIS_URL from lib/env.ts.
// If REDIS_URL is absent, ratelimit is null and rate limiting is silently skipped.
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { env } from "@/lib/env";

export const ratelimit = env.REDIS_URL
  ? new Ratelimit({
      redis: new Redis({ url: env.REDIS_URL }),
      limiter: Ratelimit.slidingWindow(10, "10 s")
    })
  : null;

// Usage in Server Action
export async function transferAction(formData: FormData) {
  if (ratelimit) {
    const { success } = await ratelimit.limit("transfer");
    if (!success) {
      return {
        ok: false,
        error: "Too many requests. Please try again."
      };
    }
  }
  // Process transfer...
}
```

### Security Headers (proxy.ts)

```typescript
// proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Content Security Policy
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
  );

  // X-Frame-Options
  response.headers.set("X-Frame-Options", "DENY");

  // X-Content-Type-Options
  response.headers.set("X-Content-Type-Options", "nosniff");

  // Referrer-Policy
  response.headers.set(
    "Referrer-Policy",
    "strict-origin-when-cross-origin"
  );

  // Permissions-Policy
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  return response;
}
```

### CSRF Protection

Next.js includes built-in CSRF protection for Server Actions. Always use:

```typescript
"use server";
// Automatic CSRF protection via origin check
```

## Environment Variables

Required in `lib/env.ts`:

- `ENCRYPTION_KEY` - 32+ character key for AES-256
- `REDIS_URL` - Optional. Upstash Redis URL for rate limiting. If absent, rate limiting is silently skipped.

> **Note:** `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` do **not** exist in `lib/env.ts`. The single env var is `REDIS_URL`. Always import from `lib/env.ts`, never use `process.env` directly.

## Validation

Run: `npm run type-check` and `npm run lint:strict`

## Critical Rules

1. **Never log sensitive data** - Don't log passwords, tokens, account numbers
2. **Encrypt at rest** - All financial data encrypted with AES-256-GCM
3. **Rate limit** - Protect against brute force attacks
4. **Validate input** - Always use Zod schemas
5. **Use Server Actions** - Built-in CSRF protection
6. **Security headers** - Configure in proxy.ts
