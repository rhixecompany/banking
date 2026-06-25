# Project Workflow — Banking

## Development Workflow

```
1. Branch Creation
   git checkout -b feature/your-feature

2. Local Development
   bun run dev                    # Start dev server
   bun run db:studio              # Browse database
   bun run format                 # Format code

3. Database Changes
   # Edit src/database/schema.ts
   bun run db:generate            # Generate migration
   bun run db:migrate             # Apply migration

4. Quality Gates (Required before PR)
   bun run format                 # Format code
   bun run type-check             # TypeScript validation
   bun run lint:strict            # Strict linting (zero warnings)

5. Testing
   bun run test:unit              # Unit tests
   bun run test:e2e               # E2E tests (Playwright)
   bun run test                   # All tests

6. Commit & PR
   # Husky pre-commit hooks run lint-staged
   git add .
   git commit -m "feat: description"
   git push origin feature/your-feature
```

## Adding a New Feature

1. Create Server Action in `src/actions/feature-name.ts`
2. Add Zod validation schema
3. Create DAL class in `src/dal/`
4. Add database schema (if new table needed)
5. Create React components in `src/components/`
6. Wire up in app router pages

## Database Migration Workflow

```
Edit schema → bun run db:generate → bun run db:migrate → bun run db:studio (verify)
```

## CI/CD Pipeline

```
Push → GitHub Actions
         ├── Lint (ESLint)
         ├── Type Check (tsc)
         ├── Format Check (Prettier)
         ├── Unit Tests (Vitest)
         ├── E2E Tests (Playwright)
         └── Build (Next.js)
```
