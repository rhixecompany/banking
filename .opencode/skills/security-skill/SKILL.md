---
name: security-skill
description: Security patterns for encryption, environment handling, and secret management.
lastReviewed: 2026-04-29
applyTo: "lib/**/*.{ts,js}"
---

# Security Skill — Security Patterns

## Overview

This skill provides comprehensive security patterns for the Banking app, covering encryption, environment handling, secret management, and secure coding practices.

**This skill applies to:** All code handling sensitive data, environment variables, encryption, authentication, and authorization.

## Multi-Agent Support

### OpenCode

```bash
# Encryption utilities
lib/encryption.ts encrypt decrypt encryptField decryptField

# Environment validation
lib/env.ts getRequired getOptional validateEnv
app-config.ts - validated env config

# Security checks
bun run verify:rules  # Check for security violations
```

### Cursor

```typescript
// Import encryption
import { encrypt, decrypt } from "@/lib/encryption";

// Environment access pattern
import { appConfig } from "@/lib/app-config";
const dbUrl = appConfig.database.url;

// Never log secrets
console.log("User logged in"); // CORRECT
console.log("Token: " + token); // WRONG
```

### GitHub Copilot

```typescript
// Copilot suggests secure patterns
// Encrypt sensitive data before storing
const encryptedToken = encrypt(accessToken);

// Validate environment on startup
const config = appConfig; // Already validated
```

## Encryption Patterns

### AES-256-GCM Encryption

The Banking app uses AES-256-GCM for encrypting sensitive data at rest:

```typescript
// lib/encryption.ts
import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;
const SALT_LENGTH = 64;
const KEY_LENGTH = 32;
const ITERATIONS = 100000;

function getKey(salt: Buffer): Buffer {
  return crypto.pbkdf2Sync(
    process.env.ENCRYPTION_KEY!,
    salt,
    ITERATIONS,
    KEY_LENGTH,
    "sha512"
  );
}

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const salt = crypto.randomBytes(SALT_LENGTH);
  const key = getKey(salt);

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(text, "utf8"),
    cipher.final()
  ]);
  const authTag = cipher.getAuthTag();

  // Format: salt + iv + authTag + encrypted
  return Buffer.concat([salt, iv, authTag, encrypted]).toString(
    "base64"
  );
}

export function decrypt(encryptedText: string): string {
  const data = Buffer.from(encryptedText, "base64");

  const salt = data.subarray(0, SALT_LENGTH);
  const iv = data.subarray(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
  const authTag = data.subarray(
    SALT_LENGTH + IV_LENGTH,
    SALT_LENGTH + IV_LENGTH + AUTH_TAG_LENGTH
  );
  const encrypted = data.subarray(
    SALT_LENGTH + IV_LENGTH + AUTH_TAG_LENGTH
  );

  const key = getKey(salt);
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  return decipher.update(encrypted) + decipher.final("utf8");
}
```

### Field-Level Encryption

```typescript
// Encrypt specific fields before database insertion
import { encrypt, decrypt } from "@/lib/encryption";

interface SensitiveWalletData {
  accessToken: string;
  accountId: string;
}

export function encryptWalletData(
  data: SensitiveWalletData
): EncryptedWalletData {
  return {
    accessToken: encrypt(data.accessToken),
    accountId: encrypt(data.accountId),
    // Non-sensitive fields remain plain
    institutionName: data.institutionName
  };
}

export function decryptWalletData(
  data: EncryptedWalletData
): SensitiveWalletData {
  return {
    accessToken: decrypt(data.accessToken),
    accountId: decrypt(data.accountId),
    institutionName: data.institutionName
  };
}
```

### Encryption in DAL

```typescript
// dal/wallet.dal.ts
import { encrypt, decrypt } from "@/lib/encryption";

export class WalletDal {
  async create(data: CreateWalletInput): Promise<Wallet> {
    const encryptedData = {
      ...data,
      accessToken: encrypt(data.accessToken), // Encrypt before storage
      accountId: data.accountId ? encrypt(data.accountId) : null
    };

    const [wallet] = await db
      .insert(wallets)
      .values(encryptedData)
      .returning();
    return this.decryptWallet(wallet);
  }

  private decryptWallet(wallet: Wallet): DecryptedWallet {
    return {
      ...wallet,
      accessToken: decrypt(wallet.accessToken),
      accountId: wallet.accountId ? decrypt(wallet.accountId) : null
    };
  }
}
```

## Environment Variable Management

### app-config.ts (Preferred)

```typescript
// lib/app-config.ts
import { z } from "zod";

// Define schema with validation
const envSchema = z.object({
  // Required variables
  DATABASE_URL: z.string().url(),
  ENCRYPTION_KEY: z.string().length(64), // 256-bit key in hex
  NEXTAUTH_SECRET: z.string().min(32),
  NEXTAUTH_URL: z.string().url().optional(),

  // Optional with defaults
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  // Provider-specific
  PLAID_CLIENT_ID: z.string().optional(),
  PLAID_SECRET: z.string().optional(),
  PLAID_ENV: z
    .enum(["sandbox", "development", "production"])
    .default("sandbox"),

  DWOLLA_KEY: z.string().optional(),
  DWOLLA_SECRET: z.string().optional(),
  DWOLLA_ENV: z.enum(["sandbox", "production"]).default("sandbox")
});

// Parse and validate at startup
const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error(
    "Invalid environment variables:",
    _env.error.format()
  );
  throw new Error("Invalid environment configuration");
}

export const appConfig = _env.data;
```

### lib/env.ts (Legacy/Compatibility)

```typescript
// lib/env.ts - Only for backward compatibility
// Prefer app-config.ts for new code

export function getRequired(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export function getOptional(
  key: string,
  defaultValue?: string
): string | undefined {
  return process.env[key] || defaultValue;
}

export function getDatabaseUrl(): string {
  return getRequired("DATABASE_URL");
}

export function getEncryptionKey(): string {
  return getRequired("ENCRYPTION_KEY");
}
```

### Never Read process.env Directly in App Code

```typescript
// INCORRECT - Direct env access in app code
const db = new Client(process.env.DATABASE_URL);

// CORRECT - Use app-config.ts
import { appConfig } from "@/lib/app-config";
const db = new Client(appConfig.database.url);

// Exception: lib/proxy.ts for specific integrations
```

## Secret Management

### API Key Handling

```typescript
// Never store API keys in plain text
// Use environment variables + encryption at rest

// For Plaid tokens stored in DB
interface StoredPlaidToken {
  accessToken: string; // Encrypted
  itemId: string; // Plain - not sensitive
  institutionId: string; // Plain
}

// For Dwolla keys - use env vars, never store in DB
const dwollaClient = new Dwolla({
  key: appConfig.dwolla.key, // From environment
  secret: appConfig.dwolla.secret // From environment
});
```

### Secrets in Logs

```typescript
// NEVER log secrets
console.log("User logged in"); // CORRECT
console.log("Token: " + token); // WRONG - exposes token
console.log({ userId, action: "login" }); // CORRECT - no secrets

// Use structured logging for debugging
logger.info("Transfer initiated", {
  userId: session.user.id,
  walletId: wallet.id,
  amount: amount
  // Never include: tokens, passwords, secrets
});
```

### Environment-Specific Secrets

```typescript
// development/.env.local
DATABASE_URL="postgres://localhost:5432/banking_dev"
ENCRYPTION_KEY="0000000000000000000000000000000000000000000000000000000000000000"
PLAID_ENV="sandbox"

# production/.env (never commit)
DATABASE_URL="postgres://..."
ENCRYPTION_KEY="actual-256-bit-hex-key"
PLAID_ENV="production"
```

## Authentication Security

### Session Security

```typescript
// lib/auth-options.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyPassword } from "@/lib/password";
import { userDal } from "@/dal";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await userDal.findByEmail(credentials.email);
        if (!user || !user.password) {
          return null;
        }

        const isValid = await verifyPassword(
          credentials.password,
          user.password
        );
        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          isAdmin: user.isAdmin
        };
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.isAdmin = user.isAdmin;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.isAdmin = token.isAdmin as boolean;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
    error: "/login"
  }
};
```

### Password Security

```typescript
// lib/password.ts
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

export async function hashPassword(
  password: string
): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Password requirements
export function validatePassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push(
      "Password must contain at least one uppercase letter"
    );
  }
  if (!/[a-z]/.test(password)) {
    errors.push(
      "Password must contain at least one lowercase letter"
    );
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  return { valid: errors.length === 0, errors };
}
```

## Authorization Patterns

### Role-Based Access

```typescript
// types/next-auth.d.ts
import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      isAdmin: boolean;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    isAdmin: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    isAdmin: boolean;
  }
}

// Authorization check in Server Actions
import { auth } from "@/lib/auth";

export async function protectedAction(input: unknown) {
  const session = await auth();
  if (!session?.user) {
    return { ok: false, error: "Unauthorized" };
  }

  // Additional role check for admin actions
  if (requireAdmin && !session.user.isAdmin) {
    return { ok: false, error: "Forbidden" };
  }

  // Continue with action
}
```

### Admin-Only Routes

```typescript
// middleware.ts
import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ req, token }) => {
      const path = req.nextUrl.pathname;

      // Admin routes require isAdmin
      if (path.startsWith("/admin")) {
        return token?.isAdmin === true;
      }

      // Protected routes require authentication
      return !!token;
    }
  }
});

export const config = {
  matcher: ["/dashboard/:path*", "/settings/:path*", "/admin/:path*"]
};
```

## Input Validation

### Zod Validation

```typescript
// lib/schemas/transfer.ts
import { z } from "zod";

export const TransferSchema = z.object({
  amount: z
    .number({ invalid_type_error: "Amount must be a number" })
    .positive("Amount must be positive")
    .max(10000, "Amount cannot exceed $10,000"),
  recipientWalletId: z.string().uuid("Invalid wallet ID"),
  note: z
    .string()
    .max(200, "Note cannot exceed 200 characters")
    .optional()
});

export type TransferInput = z.infer<typeof TransferSchema>;

// Usage in Server Action
export async function transferMoney(input: unknown) {
  const result = TransferSchema.safeParse(input);
  if (!result.success) {
    return { ok: false, error: result.error.errors[0].message };
  }

  // Process transfer
}
```

## Security Headers

```typescript
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Security headers
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set(
    "Referrer-Policy",
    "strict-origin-when-cross-origin"
  );
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"
  );

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"]
};
```

## Validation Commands

```bash
# Type checking
bun run type-check

# Lint strict
bun run lint:strict

# Verify security rules
bun run verify:rules

# Check for exposed secrets
grep -r "process.env\." --include="*.ts" --include="*.tsx" app/ actions/ components/ | grep -v "app-config\|lib/env" || echo "No direct env access found"
```

## Common Issues

### 1. Storing Plain Text Secrets

```typescript
// WRONG
const token = "sk_live_abc123";
await db.insert(wallets).values({ accessToken: token });

// CORRECT
const token = "sk_live_abc123";
await db.insert(wallets).values({ accessToken: encrypt(token) });
```

### 2. Logging Sensitive Data

```typescript
// WRONG
console.log("Payment processed", { cardNumber: "4111111111111111" });

// CORRECT
console.log("Payment processed", { last4: "1111" });
```

### 3. Weak Password Hashing

```typescript
// WRONG
const hash = crypto.createHash("sha256").update(password).digest();

// CORRECT
const hash = await bcrypt.hash(password, 12);
```

### 4. Missing Environment Validation

```typescript
// WRONG
const dbUrl = process.env.DATABASE_URL; // Could be undefined

// CORRECT
const dbUrl = appConfig.database.url; // Validated at startup
```

## Cross-References

- **auth-skill** — Authentication patterns
- **db-skill** — Database schema and DAL
- **server-action-skill** — Secure Server Actions
- **validation-skill** — Zod validation patterns

## Multi-Agent Examples

### OpenCode: Security Audit

```bash
# Scan for potential secrets in code
grep -rn "password\|secret\|token\|key" --include="*.ts" lib/ | grep -v "env\|.env"

# Verify encryption is used
grep -n "encrypt(" dal/
```

### Cursor: Secure Code Suggestions

```typescript
// Type this comment for suggestions
// TODO: Add input validation and encryption to wallet creation
```

### Copilot: Security Patterns

```typescript
// Write this comment, Copilot suggests secure implementation
// Create a function to securely store Plaid access token
```
