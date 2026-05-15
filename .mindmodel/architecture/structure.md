# Architecture

## Rules

- Keep `src/actions/` for server-only operations (DB, external APIs, auth)
- Components in `src/components/` with clear separation: server/client subdirectories
- Business logic belongs in DAL classes (`src/dal/`) — not in components or actions
- Server Components handle data fetching; Client Components handle user interaction
- Route groups in parentheses: `(auth)` for auth pages, `(root)` for app pages

## Structure

```
src/
├── actions/           # Server Actions (dot.camelCase naming)
├── app/              # Next.js App Router
│   ├── (auth)/       # Auth routes (signin, signup)
│   ├── (root)/       # Main app (dashboard, wallets, transactions)
│   └── api/          # API routes
├── components/       # React components (PascalCase)
│   └── ui/           # shadcn/ui base components
├── dal/              # Data Access Layer (dot.camelCase)
├── database/         # Drizzle schema
├── lib/              # Utilities (auth, plaid, dwolla, utils)
├── stores/           # Zustand state stores
└── types/            # TypeScript types
```

## Examples

### Server Wrapper Pattern

```typescript
// Server Component fetches data and passes to client
// src/app/(root)/dashboard/page.tsx
export default async function DashboardPage() {
  const session = await auth();
  const user = await userDal.findByIdWithProfile(session.user.id);
  return <DashboardClient user={user} />;
}

// Client Component handles form state
// src/components/dashboard/DashboardClient.tsx
"use client";
export function DashboardClient({ user }: { user: UserWithProfile }) {
  // React Hook Form for interactions
}
```
