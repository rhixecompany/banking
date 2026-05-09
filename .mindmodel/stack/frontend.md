# Frontend

## Rules

- Next.js 16 with App Router for all frontend pages
- Server Components for data fetching; Client Components for interactivity
- Use shadcn/ui components for base UI primitives
- Use React Hook Form + Zod for all forms
- CSS via Tailwind — follow design system tokens
- Responsive design with Tailwind breakpoints

## Tech Stack

| Category  | Technology                                   |
| --------- | -------------------------------------------- |
| Framework | Next.js 16 (App Router)                      |
| UI        | React 19, Tailwind CSS, shadcn/ui            |
| Forms     | React Hook Form + Zod                        |
| State     | Zustand (client), Server Components (server) |
| Icons     | Lucide React                                 |

## Examples

### Server Page with Client Form

```typescript
// app/(root)/transfer/page.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { PaymentTransferClient } from "@/components/transfer/payment-transfer-client";
import { createTransferAction } from "@/actions/transfer.actions";
import { walletDal } from "@/dal";
import { recipientDal } from "@/dal";

export default async function TransferPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/signin");

  const wallets = await walletDal.findByUserId(session.user.id);
  const recipients = await recipientDal.findByUserId(session.user.id);

  return (
    <PaymentTransferClient
      createTransfer={createTransferAction}
      wallets={wallets}
      recipients={recipients}
    />
  );
}
```

### Form with Validation

```typescript
// components/transfer/payment-transfer-client.tsx
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { transferSchema } from "@/lib/validations/transfer";

export function PaymentTransferClient({ createTransfer, wallets, recipients }) {
  const form = useForm({
    resolver: zodResolver(transferSchema),
    defaultValues: { amount: "", recipientId: "", sourceBankId: "" },
  });

  async function onSubmit(data) {
    const result = await createTransfer({ ...data });
    if (!result.ok) form.setError("root", { message: result.error });
  }

  return <TransferForm form={form} onSubmit={onSubmit} />;
}
```

## Dependencies

```json
{
  "@hookform/resolvers": "^3.10.0",
  "clsx": "^2.1.0",
  "lucide-react": "^0.500.0",
  "next": "^16.0.0",
  "react": "^19.0.0",
  "react-hook-form": "^7.54.0",
  "tailwind-merge": "^2.6.0",
  "tailwindcss": "^4.0.0",
  "zod": "^3.24.0",
  "zustand": "^5.0.0"
}
```
