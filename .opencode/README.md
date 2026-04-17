# NextJS Dev Plugin

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/) [![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/) [![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

> Opencode plugin for Next.js 16 development best practices, Suspense boundaries, and Server Actions.

## Features

- **Suspense Skill** - Handle async auth in Next.js 16 without blocking route rendering
- **Server Action Skill** - Zod validation, error handling, and revalidation patterns
- **DAL Skill** - N+1 query prevention with JOIN patterns
- **NextJS Architect Agent** - Pre-configured AI agent for code review and generation

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

## Usage

### Skills

The plugin includes three specialized skills:

| Skill | Purpose |
| --- | --- |
| `suspense-skill.md` | Suspense boundary patterns for async auth |
| `server-action-skill.md` | Server Action conventions with Zod |
| `dal-skill.md` | N+1 prevention with JOIN patterns |

### Example Prompts

```
# Suspense patterns
"Create a protected route with Suspense boundary"
"Add loading skeleton for the dashboard"

# Server Actions
"Create a Server Action for user registration with Zod validation"
"Add revalidation to the create post action"

# DAL patterns
"Query user with profile using JOIN instead of N+1"
"Add pagination to the posts list"
```

## Tech Stack

This plugin follows patterns for:

- **Next.js 16** (App Router)
- **TypeScript** (strict mode)
- **Drizzle ORM** (PostgreSQL)
- **NextAuth v4** (session handling)
- **Zod** (validation)
- **shadcn/UI** (components)

## Key Patterns

### Protected Routes with Suspense

```tsx
export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}

async function DashboardContent() {
  const session = await getServerSession();
  if (!session) redirect("/sign-in");
  return <Dashboard />;
}
```

### Server Actions

```typescript
export async function createUser(
  data: CreateUserInput
): Promise<{ ok: boolean; error?: string }> {
  const parsed = CreateUserSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message, ok: false };
  }

  // ... action logic

  revalidatePath("/users");
  return { ok: true };
}
```

### DAL with JOINs

```typescript
// ❌ BAD - N+1
const users = await db.select().from(users);
for (const user of users) {
  user.profile = await db.select().from(profiles).where(...);
}

// ✅ GOOD - Single JOIN
const usersWithProfiles = await db
  .select()
  .from(users)
  .leftJoin(profiles, eq(users.id, profiles.userId));
```

## Files

```
opencode-nextjs-dev/
├── SKILL.md                    # Main skill file
├── skills/
│   ├── suspense-skill.md      # Suspense boundary patterns
│   ├── server-action-skill.md # Server Action patterns
│   └── dal-skill.md           # Data Access Layer patterns
├── agent/
│   └── nextjs-architect.md    # AI architect agent
└── README.md
```

## Contributing

Contributions are welcome! Please read the contribution guidelines and submit PRs.

## License

MIT License - see LICENSE file for details.
