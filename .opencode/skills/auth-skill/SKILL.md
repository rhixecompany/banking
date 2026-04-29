---
name: auth-skill
description: >-
  NextAuth v4 authentication patterns, session helper, and protected route guidance. Use when implementing authentication, protecting routes, managing sessions, or working with user authorization. Triggers include requests to "add auth", "protect routes", "check session", "implement login/logout", or any authentication-related task.
lastReviewed: 2026-04-24
applyTo: "actions/**/*.{ts,tsx}"
---

# Auth Skill — NextAuth v4 Patterns

Comprehensive authentication patterns for the Banking app using NextAuth v4 with JWT strategy.

## When to Use This Skill

- Implementing authentication in Server Actions
- Protecting routes and resources
- Managing user sessions
- Handling login/logout flows
- Working with user authorization

## Multi-Agent Commands

### OpenCode / Cursor / Copilot
```bash
# Check auth configuration
cat lib/auth-options.ts
cat lib/auth.ts

# Run type check
bun run type-check

# Run tests
bun run test:browser
```

## Authentication Architecture

### Core Files

| File | Purpose |
|------|---------|
| `lib/auth-options.ts` | NextAuth configuration |
| `lib/auth.ts` | Server-side session helper |
| `app/api/auth/[...nextauth]/route.ts` | Auth API route |
| `database/schema.ts` | User table definition |

### Session Strategy

- **Strategy**: JWT (not database sessions)
- **Configuration**: Set in `lib/auth-options.ts`
- **Token**: Contains user id, email, name, isAdmin, isActive

## Session Helper

### Using auth() in Server Actions

```typescript
import { auth } from "@/lib/auth";

export async function protectedAction(input: unknown) {
  const session = await auth();
  if (!session?.user) {
    return { ok: false, error: "Unauthorized" };
  }
  // Continue with authenticated logic
  return { ok: true };
}
```

### Session Shape

```typescript
interface Session {
  user: {
    id: string;
    name?: string;
    email?: string;
    isAdmin: boolean;
    isActive: boolean;
  };
}
```

### Checking Specific Permissions

```typescript
// Check admin access
export async function adminOnlyAction() {
  const session = await auth();
  if (!session?.user) {
    return { ok: false, error: "Unauthorized" };
  }
  if (!session.user.isAdmin) {
    return { ok: false, error: "Forbidden" };
  }
  return { ok: true };
}

// Check active account
export async function activeUserAction() {
  const session = await auth();
  if (!session?.user) {
    return { ok: false, error: "Unauthorized" };
  }
  if (!session.user.isActive) {
    return { ok: false, error: "AccountDeactivated" };
  }
  return { ok: true };
}
```

## Protected Routes

### Middleware Configuration

The app uses Next.js middleware to protect routes:

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const session = auth();
  // Protected routes:
  // - /dashboard/*
  // - /settings/*
  // - /my-wallets/*
}
```

### Protected Route Patterns

```typescript
// Server component with auth
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  return <Dashboard user={session.user} />;
}
```

## Server Action Auth Patterns

### Register Action

```typescript
"use server";
import { auth } from "@/lib/auth";
import { userDal } from "@/dal/user.dal";
import { z } from "zod";

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
});

export async function registerAction(input: unknown) {
  const parsed = RegisterSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.message };
  }

  const { email, password, name } = parsed.data;

  // Check if user exists
  const existing = await userDal.findByEmail(email);
  if (existing) {
    return { ok: false, error: "UserAlreadyExists" };
  }

  // Create user (password should be hashed)
  const user = await userDal.create({
    email,
    name,
    passwordHash: await hashPassword(password),
  });

  return { ok: true, userId: user.id };
}
```

### Login Action

```typescript
"use server";
import { auth } from "@/lib/auth";
import { userDal } from "@/dal/user.dal";
import { verifyPassword } from "@/lib/password";
import { z } from "zod";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function loginAction(input: unknown) {
  const parsed = LoginSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.message };
  }

  const { email, password } = parsed.data;

  const user = await userDal.findByEmail(email);
  if (!user) {
    return { ok: false, error: "InvalidCredentials" };
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return { ok: false, error: "InvalidCredentials" };
  }

  if (!user.isActive) {
    return { ok: false, error: "AccountDeactivated" };
  }

  // NextAuth handles session creation via credentials provider
  return { ok: true };
}
```

### Logout Action

```typescript
"use server";
import { auth } from "@/lib/auth";
import { signOut } from "@/lib/auth"; // from next-auth/react

export async function logoutAction() {
  await signOut({ redirect: false });
  return { ok: true };
}
```

## Auth Configuration

### NextAuth Options

```typescript
// lib/auth-options.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { userDal } from "@/dal/user.dal";
import { verifyPassword } from "@/lib/password";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await userDal.findByEmail(credentials.email);
        if (!user || !user.isActive) {
          return null;
        }

        const valid = await verifyPassword(
          credentials.password,
          user.passwordHash
        );
        if (!valid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          isAdmin: user.isAdmin,
          isActive: user.isActive,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.isAdmin = user.isAdmin;
        token.isActive = user.isActive;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.isAdmin = token.isAdmin as boolean;
        session.user.isActive = token.isActive as boolean;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
};
```

## Testing Auth Patterns

### Testing Protected Actions

```typescript
import { describe, it, expect, vi } from 'vitest';
import { protectedAction } from '@/actions/protected';
import { auth } from '@/lib/auth';

vi.mock('@/lib/auth', () => ({
  auth: vi.fn()
}));

describe('protectedAction', () => {
  it('should return error for unauthenticated user', async () => {
    vi.mocked(auth).mockResolvedValue(null);
    const result = await protectedAction({});
    expect(result.ok).toBe(false);
    expect(result.error).toBe('Unauthorized');
  });

  it('should allow authenticated user', async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { id: '1', email: 'test@test.com', isAdmin: false, isActive: true }
    });
    const result = await protectedAction({});
    expect(result.ok).toBe(true);
  });

  it('should return error for inactive user', async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { id: '1', email: 'test@test.com', isAdmin: false, isActive: false }
    });
    const result = await protectedAction({});
    expect(result.ok).toBe(false);
    expect(result.error).toBe('AccountDeactivated');
  });
});
```

### E2E Auth Testing

```typescript
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should login successfully', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[name="email"]', 'seed-user@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');
  });

  test('should reject invalid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[name="email"]', 'wrong@test.com');
    await page.fill('[name="password"]', 'wrongpass');
    await page.click('button[type="submit"]');
    await expect(page.locator('.error')).toContainText('Invalid');
  });
});
```

## Security Considerations

1. **Password hashing** - Always hash passwords, never store plain text
2. **JWT secrets** - Use strong secrets for JWT signing
3. **Session expiry** - Set appropriate session durations
4. **CSRF protection** - NextAuth handles this automatically
5. **Input validation** - Validate all auth inputs with Zod

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Session not persisting | Check JWT strategy configuration |
| User not authenticated | Verify auth() is called in Server Actions |
| Login failing | Check credentials provider configuration |
| Redirect loops | Check middleware path patterns |

## Cross-References

- **testing-skill**: For testing auth patterns
- **server-action-skill**: For Server Action patterns
- **validation-skill**: For input validation
- **dal-skill**: For user data access

## Validation

```bash
# Type check
bun run type-check

# Run tests
bun run test:browser

# Lint
bun run lint:strict
```