# Code Exemplars — Banking

## 1. Server Action Pattern

```typescript
// actions/auth.signin.ts
"use server";

import { z } from "zod";
import { db } from "@/database/db";
import { users } from "@/database/schema";

const SignInSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().trim().min(8),
});

export async function signIn(input: unknown) {
  const parsed = SignInSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message, ok: false };
  }
  try {
    // ... authentication logic
    return { ok: true };
  } catch {
    return { error: "Sign in failed", ok: false };
  }
}
```

## 2. DAL Pattern

```typescript
// dal/user.dal.ts
import { db } from "@/database/db";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";

export class UserDAL {
  async findByEmail(email: string) {
    return db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
  }

  async findById(id: number) {
    return db.select().from(users).where(eq(users.id, id)).limit(1);
  }
}

export const userDal = new UserDAL();
```

## 3. Zod Validation

```typescript
const TransferSchema = z.object({
  amount: z.string().transform(Number).pipe(z.number().positive()),
  recipientId: z.string().min(1),
  description: z.string().max(200).optional(),
});
```

## 4. Component Pattern

```typescript
// components/DashboardCard.tsx
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  className?: string;
}

export function DashboardCard({ title, value, icon, className }: DashboardCardProps) {
  return (
    <Card className={cn("p-4", className)}>
      <CardHeader className="flex flex-row items-center justify-between">
        <p className="text-sm text-muted-foreground">{title}</p>
        {icon}
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}
```
