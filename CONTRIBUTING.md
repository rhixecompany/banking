# Banking — Contributing Guide

## Quick Start

```bash
git clone <repo-url>
cd banking
bun install
cp .env.local.example .env.local
bun run db:push
bun run dev
```

## Before You Contribute

- Review [ARCHITECTURE.md](ARCHITECTURE.md) for system design
- Review [DEVELOPMENT_GUIDE.md](DEVELOPMENT_GUIDE.md) for conventions
- Ensure you can run the full test suite

## Pull Request Process

1. **Create a feature branch** from `main`
2. **Make changes** following project conventions
3. **Run validation**:
   ```bash
   bun run type-check
   bun run lint:strict
   bun run build
   bun run test
   ```
4. **Write tests** for new functionality
5. **Update documentation** for user-facing changes
6. **Open a PR** with a clear description

## Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add Plaid multi-account linking
fix: resolve Dwolla transfer idempotency
docs: update Plaid integration guide
chore: upgrade Drizzle ORM to 0.45.2
test: add transaction DAL unit tests
refactor: consolidate auth middleware
```

## Code Standards

- **TypeScript**: Strict mode, no `any` types
- **ESLint**: Zero warnings (enforced in CI)
- **Formatting**: Prettier with organize imports
- **Components**: Server-first, client islands for interactivity
- **Server Actions**: Zod validation at entry points
- **DAL**: Constructor pattern, returns `null` on not found

## Testing Requirements

- Unit tests for all new DAL methods
- Server Action tests for all new actions
- E2E tests for critical user flows
- Minimum 80% coverage for new code

## Security Notes

- Never commit secrets or tokens
- Use `lib/env.ts` for env validation
- Encrypt sensitive data before storage
- Validate all inputs with Zod

## Questions?

Open a [GitHub Issue](https://github.com/your-org/banking/issues) or discussion.
