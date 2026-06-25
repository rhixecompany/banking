# Banking — Development Guide

## Development Workflow

### Daily Commands

```bash
bun run dev           # Start dev server (with Turbopack)
bun run type-check    # TypeScript validation
bun run lint:strict   # ESLint (zero warnings required)
bun run format        # Prettier formatting
```

### Before Each PR

Run the full validation pipeline:

```bash
bun run prebuild      # Clean + type-check
bun run build         # Production build
bun run lint:strict   # Zero ESLint warnings
bun run test          # All tests pass
```

## Code Style Guide

### Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Server Actions | `dot.camelCase` | `auth.signin.ts` |
| Components | `PascalCase` | `BankInfo.tsx` |
| Utils/Hooks | `camelCase` | `formUrlQuery.ts` |
| Database Tables | `snake_case` | `user_profiles` |
| DAL Files | `dot.camelCase` | `user.dal.ts` |

### Server Action Pattern

```typescript
"use server";
import { z } from "zod";
import { db } from "@/database/db";

const Schema = z.object({
  // validation schema
});

export async function actionName(input: unknown) {
  const parsed = Schema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.errors[0]?.message, ok: false };

  try {
    // ... business logic
    return { ok: true, data: result };
  } catch (error) {
    return { error: "Operation failed", ok: false };
  }
}
```

### DAL Pattern

```typescript
import { db } from "@/database/db";
import { users } from "@/database/schema";

export class EntityDAL {
  async findByPk(id: number) {
    return db.select().from(users).where(eq(users.id, id)).limit(1);
  }
}
export const entityDal = new EntityDAL();
```

### Component Pattern

```typescript
// Server Component (default)
export default async function DashboardPage() {
  const data = await someDalMethod();
  return <ClientComponent data={data} />;
}

// Client Component
"use client";
export function InteractiveWidget() {
  // useState, useEffect, event handlers
}
```

## Project Structure

When adding new features:

1. **Schema**: Add table to `src/database/schema.ts`
2. **Migration**: Run `bun run db:generate` and `bun run db:push`
3. **DAL**: Create data access methods in `src/dal/`
4. **Action**: Create server action in `src/actions/`
5. **Component**: Create UI component in `src/components/`
6. **Route**: Add page under `src/app/`

## Git Workflow

```bash
git checkout -b feature/your-feature
# make changes
bun run validate
git add -A
git commit -m "feat: description"
git push -u origin feature/your-feature
# Open PR against main
```

## Scripts

| Script | Purpose |
|--------|---------|
| `bun run generate:component` | Scaffold a new component |
| `bun run generate:action` | Scaffold a new server action |
| `bun run generate:dal` | Scaffold a new DAL class |
| `bun run generate:feature` | Scaffold a full feature |
| `bun run ci:checks:run` | Run CI checks locally |
| `bun run clean:all` | Full cleanup (node_modules too) |

## Quality Gates

All checks **MUST** pass before merging:

1. **TypeScript**: Zero errors (`bun run type-check`)
2. **Linting**: Zero errors & warnings (`bun run lint:strict`)
3. **Formatting**: Prettier compliance (`bun run format:check`)
4. **Build**: Production build succeeds (`bun run build`)
5. **Tests**: All tests pass (`bun run test`)

## Environment Files

| File | Purpose |
|------|---------|
| `.env.local` | Local development secrets |
| `.env.local.example` | Template with placeholder values |
| `.env.test` | Test environment variables |
