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
npm run build           # Production build
npm run start           # Start production server
npm run clean           # Clean build artifacts
```

## Validation Commands (Required Before Commit)

```bash
npm run validate        # Run all checks (format + type-check + lint + test)
npm run format         # Format code with Prettier
npm run format:check   # Check formatting without fixing
npm run lint           # ESLint with compact output
npm run lint:fix       # ESLint with auto-fix
npm run lint:strict   # Strict ESLint (blocks PR at 0 warnings)
npm run type-check     # TypeScript type checking
```

## Database Commands

```bash
npm run db:studio      # Drizzle Studio (GUI)
npm run db:push        # Push schema changes to DB
npm run db:migrate     # Run migrations
npm run db:generate    # Generate migrations
npm run db:check       # Drizzle migration/schema check
npm run db:seed        # Seed database with test data
npm run db:reset       # Drop, generate, push (full reset)
```

## Testing Commands

```bash
npm run test            # All tests (Vitest + Playwright)
npm run test:browser    # Vitest unit/integration tests only
npm run test:ui         # Playwright E2E tests only
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
npm run generate:dal       # Generate DAL files
npm run generate:action   # Generate Server Action files
npm run generate:component # Generate React components
npm run generate:feature  # Generate feature scaffolding
```

## Project-Specific Commands

```bash
npm run banking:validate    # Run all banking validation checks
npm run banking:generate     # Generate documentation
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

