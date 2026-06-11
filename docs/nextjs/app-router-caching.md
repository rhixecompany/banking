# Next.js App Router Caching

> Source: [Next.js App Router Caching](https://nextjs.org/docs/app/building-your-application/caching)

## Overview

Next.js provides multiple caching mechanisms to improve performance. This guide covers the previous model (pre-Cache Components).

## Caching Fetch Requests

### Basic Caching

```typescript
// Cache by default
export default async function Page() {
  const data = await fetch('https://api.example.com/data', {
    cache: 'force-cache'
  });
  return <div>{data.name}</div>;
}
```

### Time-based Revalidation

```typescript
// Revalidate every hour
export default async function Page() {
  const data = await fetch('https://api.example.com/data', {
    next: { revalidate: 3600 }
  });
  return <div>{data.name}</div>;
}
```

## unstable_cache for Database Queries

```typescript
import { unstable_cache } from "next/cache";

export const getCachedUser = unstable_cache(
  async (id: string) => {
    return db.query.users.findFirst({
      where: eq(users.id, id)
    });
  },
  ["user"], // cache key prefix
  { tags: ["user"], revalidate: 3600 }
);
```

## Route Segment Config

```typescript
// Force dynamic rendering
export const dynamic = "force-dynamic";

// Revalidate every 60 seconds
export const revalidate = 60;
```

## On-Demand Revalidation

### Using Tags

```typescript
// Tag a fetch request
export async function getUser(id: string) {
  const data = await fetch(`https://api.example.com/users/${id}`, {
    next: { tags: ["user"] }
  });
  return data;
}
```

### Revalidating by Tag

```typescript
import { revalidateTag } from "next/cache";

export async function updateUser(id: string) {
  await db.users.update({ id });
  revalidateTag("user");
}
```

### Revalidating by Path

```typescript
import { revalidatePath } from "next/cache";

export async function updateProfile() {
  await db.profile.update();
  revalidatePath("/profile");
}
```

## Deduplicating Requests

```typescript
import { cache } from "react";

export const getPost = cache(async (id: string) => {
  return db.query.posts.findFirst({
    where: eq(posts.id, id)
  });
});
```

## Preloading Data

```typescript
import { cache } from "react";
import "server-only";

export const getItem = cache(async (id: string) => {
  return db.query.items.findFirst({
    where: eq(items.id, id)
  });
});

export const preload = (id: string) => {
  void getItem(id);
};

// Usage in page
export default async function Page({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  preload(id); // Start loading early
  // ... rest of component
}
```

## See Also

- [use cache Directive](./use-cache-directive.md)
- [Plaid Transactions](../plaid/transactions.md)
- [Dwolla Transfers](../dwolla/send-money.md)
