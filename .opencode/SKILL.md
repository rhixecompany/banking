# Next.js Dev Plugin

Comprehensive skill for Next.js 16 development with App Router patterns, Suspense boundaries, Server Actions, and Data Access Layer best practices.

## Overview

This plugin provides guidance for building production-ready Next.js 16 applications following established patterns from enterprise-grade projects.

## Included Skills

### 1. Suspense Skill

- Handles async auth in Next.js 16
- Prevents blocking route errors
- Loading skeleton patterns

### 2. Server Action Skill

- Zod validation patterns
- Error handling conventions
- Revalidation strategies
- Optimistic updates

### 3. DAL Skill

- N+1 query prevention
- JOIN patterns
- Transaction usage
- Pagination best practices

## Quick Start

When working on a Next.js project, use these prompts:

```
# Auth patterns
"Create a protected route with Suspense boundary"
"Add auth check to the admin layout"
"Fix the blocking route error"

# Server Actions
"Create a Server Action for user registration"
"Add Zod validation to the create post action"
"Implement optimistic updates for the form"

# Database
"Query user with profile using JOIN"
"Add pagination to the posts list"
"Prevent N+1 in the getUserBanks function"
```

## Tech Stack

This plugin is optimized for:

- **Next.js 16** (App Router)
- **TypeScript** (strict mode)
- **Drizzle ORM** (PostgreSQL)
- **NextAuth v4** (session handling)
- **Zod** (validation)
- **shadcn/UI** (components)

## Key Patterns

### Protected Routes

```tsx
// Always wrap async auth checks in Suspense
export default function ProtectedPage() {
  return (
    <Suspense fallback={<Skeleton />}>
      <ProtectedContent />
    </Suspense>
  );
}
```

### Server Actions

```typescript
// Always return consistent error shape
export async function action(
  data: Input
): Promise<{ ok: boolean; error?: string }> {
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    return { error: "Invalid input", ok: false };
  }
  // ... action logic
  return { ok: true };
}
```

### DAL Pattern

```typescript
// Use JOINs, never N+1
const result = await db
  .select({ user: users, profile: user_profiles })
  .from(users)
  .leftJoin(user_profiles, eq(users.id, user_profiles.userId));
```

## Installation

### Project Level

```bash
mkdir -p .opencode
git clone https://github.com/awesome-opencode/opencode-nextjs-dev.git .opencode/nextjs-dev
```

### Global

```bash
git clone https://github.com/awesome-opencode/opencode-nextjs-dev.git ~/.config/opencode/nextjs-dev
```

## Files

```
opencode-nextjs-dev/
├── SKILL.md                    # This file
├── skills/
│   ├── suspense-skill.md      # Suspense boundary patterns
│   ├── server-action-skill.md  # Server Action patterns
│   └── dal-skill.md           # Data Access Layer patterns
└── agent/
    └── nextjs-architect.md    # AI architect agent config
```

## Contributing

See the GitHub repository for contribution guidelines and skill templates.
