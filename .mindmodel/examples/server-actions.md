# Server Action Examples

## Basic Server Action Pattern

```typescript
// src/actions/register.ts
"use server";

import bcrypt from "bcrypt";
import { z } from "zod";

import type { UserWithProfile } from "@/types/user";
import { userDal } from "@/dal";
import { auth } from "@/lib/auth";
import { signUpSchema } from "@/lib/validations/auth";

export async function registerUser(input: unknown): Promise<{
  ok: boolean;
  user?: undefined | UserWithProfile;
  error?: string;
}> {
  await auth(); // Verify not already logged in
  const parsed = signUpSchema.safeParse(input);
  if (!parsed.success) {
    const allErrors = parsed.error.issues
      .slice(0, 3)
      .map(issue => issue.message)
      .join("; ");
    return { error: allErrors, ok: false };
  }

  const existing = await userDal.findByEmail(email);
  if (existing) {
    return { error: "Email already registered", ok: false };
  }

  const hashed = await bcrypt.hash(password, 12);
  try {
    const user = await userDal.createWithProfile({
      email,
      name: `${firstName} ${lastName}`,
      password: hashed,
      profile: { address: address1 }
    });
    return { ok: true, user };
  } catch (e) {
    if (
      typeof e === "object" &&
      e !== null &&
      "code" in e &&
      (e as { code?: string }).code === "23505"
    ) {
      return { error: "Email already registered", ok: false };
    }
    return { error: "Registration failed", ok: false };
  }
}
```

## Pagination Pattern

```typescript
// src/actions/transaction.actions.ts
"use server";

import { z } from "zod";
import type { Transaction } from "@/types/transaction";
import { transactionDal } from "@/dal";
import { auth } from "@/lib/auth";
import { logger } from "@/lib/logger";

export async function getTransactionHistory(
  page = 1,
  pageSize = 20
): Promise<{
  ok: boolean;
  transactions?: Transaction[];
  error?: string;
}> {
  // Validate pagination inputs
  const PageSchema = z.number().int().min(1).default(1);
  const PageSizeSchema = z.number().int().min(1).max(200).default(20);
  const p = PageSchema.safeParse(page);
  const ps = PageSizeSchema.safeParse(pageSize);
  if (!p.success)
    return { error: p.error.issues[0].message, ok: false };
  if (!ps.success)
    return { error: ps.error.issues[0].message, ok: false };

  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "Not authenticated", ok: false };
    }
    const userId = session.user.id;
    const offset = (resolvedPage - 1) * resolvedPageSize;
    const transactions = await transactionDal.findByUserIdWithWallets(
      userId,
      pageSize,
      offset
    );
    return { ok: true, transactions };
  } catch (error) {
    logger.error("getTransactionHistory error:", error);
    return { error: "Failed to get transaction history", ok: false };
  }
}
```
