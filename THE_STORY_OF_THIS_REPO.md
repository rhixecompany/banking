# The Story of Banking

*From sandbox experiment to fintech prototype*

---

## Prologue: Why Banking?

It started with a question: *How hard is it to build a banking dashboard?* The answer: harder than expected, but not for the reasons you'd think.

The technical challenges — Plaid integration, Dwolla ACH transfers, Drizzle ORM — were solvable. The real friction was **compliance simulation**. Even in sandbox mode, you need webhook handlers, idempotency keys, encrypted token storage, audit trails. The "toy" became a lesson in why fintech moves slowly.

---

## Chapter 1: The Stack Decision (Week 1)

**Next.js 16** was still in beta. **Drizzle ORM** had just hit 1.0. **Bun** was the shiny new runtime.

Why not the safe choices? Next.js 14, Prisma, Node 20, npm?

Because the workspace was a learning lab. If you're going to build a banking demo, you might as well use the tools you'll need to justify in six months. The bet paid off — Drizzle's type-safe SQL is genuinely better than Prisma for this use case, and Bun's speed makes the dev loop feel instant.

---

## Chapter 2: Plaid — The Gateway Drug

Plaid's Link flow is deceptively simple:

```typescript
// Frontend
const linkToken = await fetch('/api/plaid/create-link-token').then(r => r.json())
Plaid.create({ token: linkToken, onSuccess: (public_token) => {...} })
```

But the backend reality:
- Link tokens expire in 4 hours
- Public tokens are single-use
- Access tokens must be encrypted (AES-256-GCM)
- Sandbox credentials ≠ production behavior
- Webhooks arrive out of order

The first implementation stored access tokens in plaintext. The second used `crypto.subtle` with a key derived from `process.env.ENCRYPTION_KEY`. The third added a key rotation strategy.

**Lesson:** Never underestimate the surface area of a third-party integration.

---

## Chapter 3: Dwolla — The ACH Education

Dwolla taught the team about ACH:
- Transfers take 1-3 business days
- `pending` → `processed` → `cancelled` → `failed` state machine
- Micro-deposits for verification
- Idempotency keys are mandatory (not optional)
- Balance checks before transfer initiation

The webhook handler grew from 20 lines to 200:
```typescript
// Simplified
export async function POST(req: Request) {
  const event = await req.json()
  if (!verifySignature(req.headers, event)) return 401
  
  switch (event.topic) {
    case 'customer_transfer_created': await handleCreated(event); break
    case 'customer_transfer_completed': await handleCompleted(event); break
    case 'customer_transfer_failed': await handleFailed(event); break
    // ... 12 more cases
  }
}
```

---

## Chapter 4: Drizzle — The Type-Safe Surprise

Prisma was the default choice. Then came the migration pain:
- `prisma migrate dev` creates migration files you can't easily edit
- Schema changes require `generate` + `migrate` + `push`
- Raw SQL for complex queries defeats the purpose

Drizzle flipped the model:
```typescript
// schema.ts — this IS the source of truth
export const accounts = pgTable('accounts', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  plaidAccountId: varchar('plaid_account_id').unique(),
  name: varchar('name'),
  type: varchar('type'), // 'depository', 'credit', 'loan'
  balance: decimal('balance', { precision: 12, scale: 2 }),
  createdAt: timestamp('created_at').defaultNow(),
})
```

```bash
# One command
bun run db:generate  # Creates migration SQL
bun run db:push      # Applies to DB
```

The SQL is visible, editable, reviewable. **You own your schema.**

---

## Chapter 5: The Security Audit (Week 6)

A simulated audit revealed:
| Finding | Severity | Fix |
|---------|----------|-----|
| Access tokens in logs | HIGH | Redaction middleware |
| No rate limiting on `/api/plaid/*` | MEDIUM | Upstash Redis + `rate-limit` |
| Webhook signature verification missing | HIGH | HMAC-SHA256 verification |
| Plaintext Dwolla tokens in DB | CRITICAL | AES-256-GCM encryption |
| No audit log for transfers | MEDIUM | Append-only `audit_log` table |

All fixed in a single PR. The audit became a template for other projects.

---

## Chapter 6: Current State (July 2025)

| Metric | Value |
|--------|-------|
| Lines of code | ~3,200 |
| Test coverage | 0% (shameful) |
| API routes | 14 |
| Database tables | 8 |
| Dependencies | 47 production, 31 dev |
| Critical vulns | 0 (after audit) |

---

## Epilogue: What's Next

The project works. Money moves (in sandbox). Users can link accounts, see balances, initiate transfers.

But it's not "done":
- **Production Plaid/Dwolla** — requires business verification, compliance review
- **Tests** — Vitest for unit, Playwright for E2E
- **Monitoring** — Sentry for errors, custom metrics for transfer success rate
- **Multi-user** — currently single-tenant demo
- **Statements** — PDF generation for monthly statements

The repository sits at `projects/Banking/`, waiting. The next commit will be tests. Or production credentials. Or a rewrite in Rust because someone read a blog post.

Either way, the foundation is solid. Drizzle schema owns the data. NextAuth owns the session. Bun owns the speed. The rest is features.

---

*Written by the workspace chronicler, July 25, 2025.  
Filed at `projects/Banking/THE_STORY_OF_THIS_REPO.md`.*