---
name: suspense-skill
description: Guidance for implementing Suspense boundaries in Next.js 16 to handle async auth APIs without blocking route rendering.
lastReviewed: 2026-04-24
applyTo: "app/**/*.{tsx,ts,md}"
---

# suspense-skill

This skill provides guidance for implementing Suspense boundaries in Next.js 16 to handle async auth APIs without blocking route rendering.

## Overview

In Next.js 16, APIs like `cookies()`, `headers()`, and `auth()` are **async**. Using them directly in Server Components without `<Suspense>` causes blocking route errors and degrades performance.

## Key Patterns

### 1. Protected Pages with Suspense

```tsx
// ❌ BAD - Blocks route rendering
export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/sign-in");
  return <Dashboard />;
}

// ✅ GOOD - Suspense boundary allows streaming
export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}

async function DashboardContent() {
  const session = await auth();
  if (!session) redirect("/sign-in");
  return <Dashboard />;
}
```

### 2. Auth Pages with Suspense

```tsx
// sign-in/page.tsx
export default function SignIn() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SignInContent />
    </Suspense>
  );
}

async function SignInContent() {
  const session = await auth();
  if (session) redirect("/dashboard");
  return <AuthForm type="sign-in" />;
}
```

### 3. Layouts with Suspense

```tsx
// (root)/layout.tsx
export default function ProtectedLayout({ children }) {
  return (
    <Suspense fallback={<LayoutSkeleton />}>
      <ProtectedLayoutContent>{children}</ProtectedLayoutContent>
    </Suspense>
  );
}

async function ProtectedLayoutContent({ children }) {
  const user = await getLoggedInUser();
  if (!user) redirect("/sign-in");
  return <DashboardLayout user={user}>{children}</DashboardLayout>;
}
```

### 4. Loading Skeletons

```tsx
// loading.tsx
export default function Loading() {
  return (
    <main className="flex h-screen">
      <SidebarSkeleton />
      <div className="flex-1">
        <HeaderSkeleton />
        <div className="p-6">
          <ContentSkeleton />
        </div>
      </div>
    </main>
  );
}
```

## When to Use Suspense

| Pattern            | Use Suspense? | Reason              |
| ------------------ | ------------- | ------------------- |
| `cookies()`        | ✅ Yes        | Async in Next.js 16 |
| `headers()`        | ✅ Yes        | Async in Next.js 16 |
| `auth()`           | ✅ Yes        | Depends on cookies  |
| `searchParams`     | ✅ Yes        | Async in Next.js 16 |
| `params` (awaited) | ✅ Yes        | Can be Promise      |
| Static content     | ❌ No         | No async ops        |
| Client Components  | ❌ No         | Already handled     |

## Common Errors

### "Route accessed without Suspense"

```
Error: Route "/": Runtime data such as `cookies()`, `headers()`,
`params`, or `searchParams` was accessed outside of `<Suspense>`.
```

**Fix**: Wrap the async component in `<Suspense>`.

### Slow Initial Page Load

**Cause**: Large component tree waiting for session check.

**Fix**:

1. Add loading skeleton
2. Move auth check to layout level
3. Use `useEffect` for client-side checks when possible

## Best Practices

1. **Always wrap async Server Components** in Suspense
2. **Provide meaningful loading skeletons**, not spinners
3. **Handle redirects inside async components**, not in Suspense fallback
4. **Keep Suspense boundaries as high as possible** in the tree
5. **Test with slow network** to ensure loading states work

## Example Prompts for This Skill

- "Create a protected route with Suspense boundary"
- "Add loading skeleton for the dashboard"
- "Fix the blocking route error on the sign-in page"
- "Implement auth check with Suspense for the admin layout"
