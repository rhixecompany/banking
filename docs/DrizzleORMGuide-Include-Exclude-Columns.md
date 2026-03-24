# Drizzle ORM Guide: Include or Exclude Columns

## Overview

- Use `.select()` to include all or specific columns.
- Use `getColumns()` (v1+) or `getTableColumns()` (pre-v1) for dynamic column selection.
- Exclude columns by destructuring from `getColumns()` result.
- Works with joins and relational queries.

## Examples

### Include all columns

```ts
import { posts } from './schema';
const db = drizzle(...);
await db.select().from(posts);
```

### Include specific columns

```ts
await db.select({ title: posts.title }).from(posts);
```

### Include all columns + extra

```ts
import { getColumns, sql } from "drizzle-orm";
await db
  .select({
    ...getColumns(posts),
    titleLength: sql`length(${posts.title})`
  })
  .from(posts);
```

### Exclude columns

```ts
import { getColumns } from "drizzle-orm";
const { content, ...rest } = getColumns(posts); // exclude 'content'
await db.select({ ...rest }).from(posts);
```

### With joins

```ts
import { eq, getColumns } from "drizzle-orm";
import { comments, posts, users } from "./db/schema";
const { userId, postId, ...rest } = getColumns(comments);
await db
  .select({
    postId: posts.id, // include 'id' from posts
    comment: { ...rest }, // all other columns
    user: users // all columns from users
  })
  .from(posts)
  .leftJoin(comments, eq(posts.id, comments.postId))
  .leftJoin(users, eq(users.id, posts.userId));
```

### Relational queries

```ts
import * as schema from './schema';
const db = drizzle(..., { schema });
await db.query.posts.findMany(); // all columns
await db.query.posts.findMany({ columns: { title: true } }); // specific columns
await db.query.posts.findMany({ extras: { titleLength: sql`length(${posts.title})`.as('title_length') } }); // extra columns
await db.query.posts.findMany({ columns: { content: false } }); // exclude column
await db.query.posts.findMany({ columns: { id: true }, with: { comments: { columns: { userId: false, postId: false } }, user: true } }); // with relations
```

### Conditional select

```ts
const searchPosts = async (withTitle = false) => {
  await db
    .select({
      id: posts.id,
      ...(withTitle && { title: posts.title })
    })
    .from(posts);
};
await searchPosts();
await searchPosts(true);
```
