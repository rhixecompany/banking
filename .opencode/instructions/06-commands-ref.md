---
name: "commands-ref"
description: "Command reference and workflow guidance for Banking project"
applyTo: "**"
priority: 6
---

# Commands Reference - Banking Project

## Development Commands

```bash
npm run dev              # Dev server (localhost:3000)
                         # predev hook: npm run clean (clears .next before dev)
npm run build            # Production build
                         # prebuild hook: clean + type-check
                         # postbuild hook: next-sitemap
npm run start            # Start production server
npm run clean            # Clean build artifacts
```

## Validation Commands (Required Before Commit)

```bash
npm run validate         # Run all checks (build + lint:strict + test)
npm run format           # Format code with Prettier (writes files)
npm run format:check     # ⚠️ DESTRUCTIVE — runs format (writes files) FIRST, then checks
npm run lint             # ESLint with compact output
npm run lint:fix         # ESLint with auto-fix
npm run lint:strict      # Strict ESLint (blocks PR at 0 warnings)
npm run type-check       # TypeScript type checking
```

## Database Commands

```bash
npm run db:studio        # Drizzle Studio (GUI, localhost:8000)
npm run db:push          # Push schema changes to DB
npm run db:migrate       # Run migrations
npm run db:generate      # Generate migrations
npm run db:check         # Drizzle migration/schema check
npm run db:seed          # Seed database with test data (PLAID_TOKEN_MODE=sandbox)
npm run db:reset         # Full reset: db:drop + db:generate + db:push (NOT seed)
```

## Testing Commands

```bash
npm run test             # All tests (test:ui THEN test:browser — reversed order!)
npm run test:browser     # Vitest unit/integration tests only (happy-dom, forks pool)
npm run test:ui          # Playwright E2E tests only (Chromium, 1 worker)
```

## Single Test Execution

```bash
# Vitest
npx vitest run tests/unit/auth.test.ts

# Playwright
npx playwright test tests/e2e/auth.spec.ts
```

## OpenCode Custom Commands

Use these commands in OpenCode:

- `/validate` - Run all validation checks
- `/test` - Run all tests
- `/build` - Build the project

## Workflow

### Before Commit

```bash
npm run validate
```

### Before PR

1. Run `npm run validate`
2. Fix any issues
3. Ensure all tests pass
4. Create PR

### Code Generation

```bash
npm run generate:feature   # Full feature (DAL + action + component)
npm run generate:dal       # DAL file only
npm run generate:action    # Server Action file only
npm run generate:component # React component only
```

## OpenCode Agents

- `plan` - Review and plan changes
- `build` - Implement features
- `review` - Review code changes

## Pre-Commit Checklist

- [ ] All TypeScript errors fixed
- [ ] ESLint passes with 0 warnings
- [ ] All tests pass
- [ ] Code formatted with Prettier
- [ ] No console.log statements
- [ ] Environment variables documented

## Common Issues

### Port 3000 in use

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Build errors

```bash
npm run clean
npm install
npm run build
```

### Database issues

```bash
npm run db:push
npm run db:seed
```
