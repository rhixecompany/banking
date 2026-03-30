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
// lib/encryption.ts
import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  scryptSync
} from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;
const SALT_LENGTH = 32;
const KEY_LENGTH = 32;

function getKey(salt: Buffer): Buffer {
  return scryptSync(process.env.ENCRYPTION_KEY!, salt, KEY_LENGTH);
}

export function encrypt(text: string): string {
  const iv = randomBytes(IV_LENGTH);
  const salt = randomBytes(SALT_LENGTH);
  const key = getKey(salt);

  const cipher = createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag();

  return `${salt.toString("hex")}:${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted}`;
}

export function decrypt(encryptedText: string): string {
  const [saltHex, ivHex, authTagHex, encrypted] =
    encryptedText.split(":");

  const salt = Buffer.from(saltHex, "hex");
  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");
  const key = getKey(salt);

  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}
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
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!
});

export const rateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "10 s"),
  analytics: true
});

// Usage in Server Action
export async function transferAction(formData: FormData) {
  const { success } = await rateLimit.limit("transfer");
  if (!success) {
    return {
      ok: false,
      error: "Too many requests. Please try again."
    };
  }
  // Process transfer...
}
```

### Security Headers (middleware.ts)

```typescript
// app/middleware.ts
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
- `UPSTASH_REDIS_REST_URL` - For rate limiting
- `UPSTASH_REDIS_REST_TOKEN`

## Validation

Run: `npm run type-check` and `npm run lint:strict`

## Critical Rules

1. **Never log sensitive data** - Don't log passwords, tokens, account numbers
2. **Encrypt at rest** - All financial data encrypted with AES-256-GCM
3. **Rate limit** - Protect against brute force attacks
4. **Validate input** - Always use Zod schemas
5. **Use Server Actions** - Built-in CSRF protection
6. **Security headers** - Configure in middleware.ts
