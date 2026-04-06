---
name: AuthSkill
description: NextAuth.js v4 authentication patterns, session management, OAuth providers, and protected routes for the Banking app. Use when working with auth, sessions, or user authentication flows.
---

# AuthSkill - Banking Authentication Patterns

## Overview

This skill provides guidance on NextAuth.js v4 authentication patterns for the Banking project.

## Auth Configuration (`lib/auth-options.ts`)

```typescript
import type { NextAuthOptions } from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import bcrypt from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

import { db } from "@/database/db";
import {
  account,
  authenticator,
  session,
  users,
  verificationToken
} from "@/database/schema";
import { env } from "@/lib/env";

export const authOptions: NextAuthOptions = {
  adapter: DrizzleAdapter(db, {
    accountsTable: account,
    authenticatorsTable: authenticator,
    sessionsTable: session,
    usersTable: users,
    verificationTokensTable: verificationToken
  }),
  session: { strategy: "jwt" },
  pages: { signIn: "/sign-in", error: "/error" },
  providers: [
    // Conditional OAuth — only enabled if env vars present
    ...(env.AUTH_GITHUB_ID && env.AUTH_GITHUB_SECRET
      ? [
          GitHubProvider({
            clientId: env.AUTH_GITHUB_ID,
            clientSecret: env.AUTH_GITHUB_SECRET
          })
        ]
      : []),
    ...(env.AUTH_GOOGLE_ID && env.AUTH_GOOGLE_SECRET
      ? [
          GoogleProvider({
            clientId: env.AUTH_GOOGLE_ID,
            clientSecret: env.AUTH_GOOGLE_SECRET
          })
        ]
      : []),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password)
          return null;
        const user = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email))
          .then(r => r[0]);
        if (!user?.isActive || !user.password) return null;
        const valid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!valid) return null;
        return {
          id: String(user.id),
          email: user.email,
          name: user.name,
          image: user.image,
          isAdmin: user.isAdmin ?? false,
          isActive: user.isActive ?? true
        };
      }
    })
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.isAdmin =
          (user as { isAdmin?: boolean }).isAdmin ?? false;
        token.isActive =
          (user as { isActive?: boolean }).isActive ?? true;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        const ext = session.user as {
          id?: string;
          isAdmin?: boolean;
          isActive?: boolean;
        };
        ext.id = token.id as string;
        ext.isAdmin = token.isAdmin ?? false;
        ext.isActive = token.isActive ?? true;
      }
      return session;
    },
    async signIn({ account, user }) {
      if (account?.provider === "credentials") return true;
      // Auto-create user for OAuth sign-in
      if (user.email) {
        const [existing] = await db
          .select()
          .from(users)
          .where(eq(users.email, user.email));
        if (!existing) {
          const tempPassword = generateSecurePassword();
          const hashed = await bcrypt.hash(tempPassword, 12);
          await db.insert(users).values({
            email: user.email,
            name: user.name,
            image: user.image,
            password: hashed
          });
        }
      }
      return true;
    }
  }
};
```

## Auth Helper (`lib/auth.ts`)

```typescript
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export function auth() {
  return getServerSession(authOptions);
}
```

## Session Shape

```typescript
// types/next-auth.d.ts
interface Session {
  user: {
    id: string;
    name?: null | string;
    email?: null | string;
    isAdmin: boolean; // NO `role` field
    isActive: boolean;
  };
}
```

JWT also carries `id`, `isAdmin`, `isActive` — checked in `proxy.ts` middleware.

## Protected Routes (`proxy.ts`)

Middleware guards: `/sign-in`, `/sign-up`, `/dashboard/*`, `/settings/*`, `/my-wallets/*`, `/transaction-history/*`, `/payment-transfer/*`

- Authenticated users redirected away from auth pages
- Unauthenticated users redirected to `/sign-in?callbackUrl=<path>`
- Inactive accounts (`isActive === false`) redirected to `/sign-in?error=AccountDeactivated`
- Rate limiting: 5 requests per 60s via Upstash Redis (skipped if `UPSTASH_REDIS_REST_URL`/`UPSTASH_REDIS_REST_TOKEN` absent)

## Password Hashing

Uses `bcryptjs` (not `bcrypt`) at cost 12:

```typescript
import bcrypt from "bcryptjs";
const hashed = await bcrypt.hash(password, 12);
const valid = await bcrypt.compare(password, hashed);
```

## Environment Variables

Required (validated at startup): `ENCRYPTION_KEY`, `NEXTAUTH_SECRET` Optional (gracefully skipped): `DATABASE_URL`, `PLAID_*`, `DWOLLA_*`, `REDIS_URL`, OAuth creds, SMTP

**Never read `process.env` directly.** Use `app-config.ts` (preferred) or `lib/env.ts`:

```typescript
import { env } from "@/lib/env";
// or preferred:
import { auth } from "@/app-config";
```

## Common Issues

1. **Session not updating** — Use `revalidatePath()` after mutations
2. **Auth redirect loop** — Check middleware matcher patterns in `proxy.ts`
3. **Token expired** — Configure `session.maxAge` in authOptions
4. **Windows Redis crash** — `proxy.ts` guards `Redis.fromEnv()` with env var checks before calling

## Validation

Run: `npm run type-check` and `npm run lint:strict`
