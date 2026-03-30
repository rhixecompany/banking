---
name: AuthSkill
description: NextAuth.js v4 authentication patterns, session management, OAuth providers, and protected routes for the Banking app. Use when working with auth, sessions, or user authentication flows.
---

# AuthSkill - Banking Authentication Patterns

## Overview

This skill provides guidance on NextAuth.js v4 authentication patterns for the Banking project.

## Key Patterns

### Session Management

```typescript
// lib/auth.ts - Session configuration
import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  providers: [], // Configured in lib/auth-config.ts
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    }
  },
  pages: {
    signIn: "/sign-in",
    error: "/auth-error"
  }
};

export const { handlers, auth, signIn, signOut } =
  NextAuth(authConfig);
```

### Protected Routes

```typescript
// lib/auth.ts - Protect route helper
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    redirect("/sign-in");
  }
  return session;
}
```

### Auth in Server Components

```typescript
// app/(root)/dashboard/page.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/sign-in");
  }

  return <div>Welcome, {session.user.name}</div>;
}
```

### OAuth Providers

```typescript
// Google Provider example
import Google from "next-auth/providers/google";

providers: [
  Google({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  }),
],
```

## Environment Variables

Required in `lib/env.ts`:

- `AUTH_SECRET` - Generate with: `openssl rand -base64 32`
- Provider-specific: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, etc.

## Common Issues

1. **Session not updating** - Use `revalidatePath()` after mutations
2. **Auth redirect loops** - Check middleware matcher patterns
3. **Token expired** - Configure `session.maxAge` in authConfig

## Validation

Run: `npm run type-check` and `npm run lint:strict`
