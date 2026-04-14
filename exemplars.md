# Exemplary Code Patterns (copy-ready examples)

1. Server Action (validated, revalidate, consistent return shape)

```ts
// actions/wallet.actions.ts
"use server";
import { z } from "zod";
import { db } from "@/database/db";
import { wallets } from "@/database/schema";
import { revalidatePath } from "next/cache";

const RemoveWalletSchema = z.object({
  walletId: z.string().uuid()
});

export async function removeWallet(input: unknown) {
  const parsed = RemoveWalletSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.errors[0]?.message };
  }
  const { walletId } = parsed.data;
  try {
    await db.delete(wallets).where(wallets.id.eq(walletId));
    revalidatePath("/my-wallets");
    return { ok: true };
  } catch (err) {
    console.error("removeWallet failed", err);
    return { ok: false, error: "Database error" };
  }
}
```

2. DAL function (Drizzle + typed return)

```ts
// dal/wallet.dal.ts
import { db } from "@/database/db";
import { wallets, users } from "@/database/schema";

export const walletDal = {
  async findByUserId(userId: string) {
    return db.select().from(wallets).where(wallets.userId.eq(userId));
  },

  async create(data: {
    userId: string;
    name: string;
    accessToken?: string | null;
    sharableId: string;
  }) {
    const [created] = await db
      .insert(wallets)
      .values(data)
      .returning();
    return created;
  }
};
```

3. Server wrapper → client wrapper pattern (passing server action as prop)

```tsx
// components/my-wallets/my-wallets-server-wrapper.tsx (server)
import { getUserWallets } from "@/actions/wallet.fetch";
import { removeWallet } from "@/actions/wallet.actions";
import MyWalletsClientWrapper from "./my-wallets-client-wrapper";

export default async function MyWalletsServerWrapper() {
  const wallets = await getUserWallets();
  return (
    <MyWalletsClientWrapper
      wallets={wallets}
      removeWallet={removeWallet}
    />
  );
}
```

```tsx
// components/my-wallets/my-wallets-client-wrapper.tsx (client)
"use client";
import { useTransition } from "react";

export default function MyWalletsClientWrapper({
  wallets,
  removeWallet
}: {
  wallets: Wallet[];
  removeWallet: (id: string) => Promise<{ ok: boolean }>;
}) {
  const [isPending, startTransition] = useTransition();

  const handleRemove = (id: string) => {
    startTransition(() => removeWallet({ walletId: id }));
  };

  return (
    <div>
      {wallets.map(w => (
        <div key={w.id}>
          <span>{w.name}</span>
          <button
            onClick={() => handleRemove(w.id)}
            disabled={isPending}
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}
```

4. Plaid short-circuit pattern (server-side)

```ts
// actions/plaid.actions.ts (excerpt)
import { isMockAccessToken } from "@/lib/plaid";

export async function exchangePublicToken({
  publicToken,
  userId
}: {
  publicToken: string;
  userId: string;
}) {
  // If publicToken is a test/mocked token, short-circuit to deterministic flow
  if (isMockAccessToken(publicToken)) {
    // Create deterministic wallet record in DB using a test access token
    const mockAccessToken = "MOCK_PLAID_ACCESS_TOKEN";
    // persist via DAL, revalidate cache, return consistent shape
    await walletDal.create({
      userId,
      name: "Mock Bank",
      accessToken: mockAccessToken,
      sharableId: "seed-share-checking-001"
    });
    revalidatePath("/my-wallets");
    return { ok: true, accessToken: mockAccessToken };
  }

  // otherwise call actual Plaid client
}
```

5. Dwolla short-circuit + ledger persistence (server-side)

```ts
// actions/dwolla.actions.ts (excerpt)
import { isMockProcessorToken } from "@/lib/dwolla-utils";

export async function createFundingSource({
  processorToken,
  userId,
  bankName
}) {
  if (isMockProcessorToken(processorToken)) {
    const mockUrl = `mock://funding-sources/${userId}/${bankName.replace(/\s+/g, "-").toLowerCase()}`;
    // Persist a dwolla_funding_source row via dal so app behaves deterministically
    await dwollaDal.createFundingSource({
      userId,
      url: mockUrl,
      bankName
    });
    return { ok: true, fundingSourceUrl: mockUrl };
  }

  // Real Dwolla POST flow...
}
```

6. Playwright Plaid injection (E2E helper usage)

```ts
// tests/e2e/specs/link-and-transfer.spec.ts (excerpt)
import { addMockPlaidInitScript } from "../helpers/plaid.mock";

test("link bank and transfer (mocked)", async ({ page }) => {
  await addMockPlaidInitScript(page, "MOCK_PUBLIC_TOKEN");
  await page.goto("/my-wallets");
  // UI triggers Plaid Link which will fire opts.onSuccess() with the mock token
});
```

7. Vitest unit test pattern (mock auth & DAL)

```ts
// tests/unit/actions/dwolla.actions.test.ts
import { vi, describe, it, expect } from "vitest";

vi.mock("@/lib/auth", () => ({
  auth: () => ({
    user: { id: "user-123", email: "seed-user@example.com" }
  })
}));

vi.mock("@/dal", () => ({
  dwollaDal: {
    createFundingSource: vi.fn(),
    createTransfer: vi.fn()
  },
  transactionDal: { create: vi.fn() }
}));

import { createFundingSource } from "@/actions/dwolla.actions";
import { dwollaDal } from "@/dal";

describe("createFundingSource", () => {
  it("short-circuits for mock processor token", async () => {
    const result = await createFundingSource({
      processorToken: "MOCK_PLAID_ACCESS_TOKEN",
      userId: "user-123",
      bankName: "Mock Bank"
    });
    expect(result.ok).toBe(true);
    expect(dwollaDal.createFundingSource).toHaveBeenCalled();
  });
});
```

8. DB migration and seed flow (commands)

```bash
# Generate migration (always review produced SQL)
npm run db:generate

# Apply migration (production/staging as appropriate; review first)
npm run db:migrate

# Local convenience: push schema for dev/test
npm run db:push

# Seed DB (use .env.local or set PLAID_TOKEN_MODE)
npm run db:seed
```

Best practices recap

- Validate inputs with Zod in server actions.
- Keep server actions small and focused.
- All DB access via DAL and Drizzle ORM; avoid per-row roundtrips.
- Use deterministic mocks & seed data for E2E.
- Pass server actions into client components as props — do not import server actions in client code.
