# Data Fetching

## Rules

- Fetch data in Server Components when possible — avoid client-side fetching for initial render
- Use Server Actions for mutations — not client-side fetch to API routes
- Pass server action references as props from Server → Client Components (no direct imports in client components)
- Use `react-hook-form` + `zodResolver` for form state management
- Use Zustand stores for UI state that needs client reactivity
- Always validate session with `auth()` before returning protected data

## Examples

### Server Component Data Fetching

```typescript
// src/app/(root)/dashboard/page.tsx
import { auth } from "@/lib/auth";
import { userDal } from "@/dal";
import { redirect } from "next/navigation";
import { DashboardContent } from "./DashboardContent";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/signin");

  const user = await userDal.findByIdWithProfile(session.user.id);
  const recentTransactions = await transactionDal.findByUserIdWithWallets(
    session.user.id,
    5,
    0
  );

  return (
    <DashboardContent
      user={user}
      recentTransactions={recentTransactions}
    />
  );
}
```

### Server Action Passed as Prop

```typescript
// Server Component (src/actions/payment.actions.ts creates action)
// In page: <PaymentTransferClient createTransfer={createTransferAction} ... />

interface PaymentTransferClientProps {
  createTransfer?: (input: unknown) => Promise<{
    ok: boolean;
    transferUrl?: string;
    error?: string;
  }>;
  // ... other props
}

export function PaymentTransferClient({ createTransfer }: PaymentTransferClientProps) {
  async function handleSubmit(data: TransferFormData) {
    const result = await createTransfer?.({ amount: data.amount, ... });
  }
}
```

## Anti-patterns

### Don't Client-Side Fetch in Server Components

```typescript
// BAD: Using useEffect for initial data in Server Component
"use client";
export function Dashboard() {
  const [data, setData] = useState();
  useEffect(() => {
    fetch("/api/transactions")
      .then(res => res.json())
      .then(setData);
  }, []);
  // ❌ Fetching on client when could use server
}
```

### Don't Import Server Actions Directly in Client Components

```typescript
// BAD: Server actions are server-only
"use client";
import { createTransferAction } from "@/actions/transfer.actions"; // ❌

// GOOD: Pass as prop from server wrapper
export function PaymentClient({ createTransfer }: Props) {
  const result = await createTransfer({...}); // ✓ via prop
}
```
