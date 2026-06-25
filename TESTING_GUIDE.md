# Banking — Testing Guide

## Test Framework

| Layer | Tool | Scope |
|-------|------|-------|
| Unit Tests | Vitest | DAL, utilities, validation |
| Component Tests | Vitest + Testing Library | React components |
| E2E Tests | Playwright | User flows, auth, banking operations |

## Running Tests

```bash
# All tests
bun run test

# E2E tests only
bun run test:ui

# Browser component tests
bun run test:browser

# Generate Playwright report
bun run test:ui:report
```

## Test Structure

```
tests/
├── unit/
│   ├── dal/               # DAL method tests
│   ├── actions/           # Server Action tests
│   └── utils/             # Utility function tests
├── components/            # Component render tests
└── e2e/
    ├── auth.spec.ts       # Login/register flows
    ├── banking.spec.ts    # Bank linking + transfers
    └── dashboard.spec.ts  # Dashboard functionality
```

## What to Test

### DAL Methods
- CRUD operations for each entity
- Edge cases: not found, duplicate, null inputs
- Relation eager loading

### Server Actions
- Zod validation rejection cases
- Successful operation paths
- Error handling (database failures, network errors)
- Authorization checks

### Components
- Render with data
- Render empty/loading states
- Interactive elements (buttons, forms, modals)
- Responsive layout

### E2E Flows
- User registration and login
- Bank account linking (Plaid sandbox)
- ACH transfer (Dwolla sandbox)
- Dashboard balance display
- Transaction history pagination

## Running Tests in CI

All tests run automatically in GitHub Actions:

```yaml
# .github/workflows/ci.yml
- name: Test
  run: |
    bun run type-check
    bun run lint:strict
    bun run test:ui       # Playwright E2E
    bun run test:browser  # Vitest browser
```
