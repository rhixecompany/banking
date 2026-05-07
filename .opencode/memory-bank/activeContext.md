# Active Context

## Current Work Focus

- General maintenance and improvements
- No specific feature in progress

## Recent Changes

- AGENTS.md updated (v3.2) — trimmed skills section, added OpenCode config notes
- Memory bank created

## Next Steps

- Load `banking` skill at session start for fintech patterns
- Run pre-PR checklist before commits

## Important Patterns

1. **Server Actions return `{ ok, error, ...payload }`** — always check `ok` before using payload
2. **DAL helpers prevent N+1** — always use `userDal.findById()` not direct DB queries
3. **Mock tokens for testing** — `seed-`, `mock-`, `mock_` prefixes skip Plaid/Dwolla API
4. **ENCRYPTION_KEY required** — not in `.env.example`, must add manually to `.env.local`

## Learnings

- Next.js 16 with React 19, Server Components by default
- Drizzle ORM with soft-delete pattern
- Plaid + Dwolla integration requires idempotency keys for transfers
- Playwright E2E uses 1 worker (stateful) — watch for port conflicts

## Considerations

- Pre-commit runs `format:check` only (lint-staged disabled)
- CI is the real gate for linting
- Hook side effects: predev cleans .next, prebuild runs type-check