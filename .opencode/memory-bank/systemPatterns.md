# System Patterns

## Architecture

```
src/
├── app/           # Next.js App Router pages
│   ├── (auth)/   # Public: login, register
│   ├── (root)/   # Protected: dashboard, wallets
│   └── (admin)/  # Admin-only routes
├── actions/      # Server Actions (mutations)
├── dal/          # Data Access Layer
├── database/     # Drizzle schema + client
├── components/   # UI components (use client)
├── lib/          # Shared: auth, plaid, dwolla, utils
└── tests/        # Unit + E2E tests
```

## Key Patterns

### DAL Pattern
```typescript
// Always use DAL, never import db in UI
import { userDal } from "@/dal";
const user = await userDal.findById(id);
```

### Server Actions
```typescript
"use server";
export async function createWallet(input: unknown) {
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "..." };
  const result = await walletDal.create(parsed.data);
  return result.ok ? { ok: true, wallet: result.wallet } : { ok: false, error: result.error };
}
```

### N+1 Prevention
```typescript
// Collect IDs → batch fetch with IN clause
const walletIds = txns.map(t => t.walletId);
const wallets = await db.select().from(wallets).where(inArray(wallets.id, walletIds));
```

### Soft Delete
```typescript
// DAL filters deletedAt automatically
async findById(id) {
  const [user] = await db.select().from(users).where(eq(users.id, id));
  return user?.deletedAt === null ? user : undefined;
}
```

## Component Relationships

- **Pages** → Server Actions for mutations
- **Server Actions** → DAL for DB, Plaid/Dwolla for external APIs
- **UI Components** → Server Actions via `useForm` + `action` prop
- **Zustand stores** → UI state (modals, toasts, transfer form)

## Critical Paths

1. **Bank Linking**: Plaid Link → exchange token → create bank account → revalidatePath
2. **Transfers**: form submit → Server Action → validate → check balance → Dwolla transfer → record transaction
3. **Auth**: NextAuth credentials → JWT session → middleware protects routes