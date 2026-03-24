---
applyTo: "**/*.test.ts,**/*.test.tsx,tests/**"
description: "Testing standards for TypeScript/Next.js projects."
---

# Testing Standards

- Write unit tests for all public logic and components (Vitest)
- Write E2E tests for critical flows (Playwright)
- Co-locate tests with the code they test
- Use mocks for external dependencies (database, auth)
- Ensure 100% pass rate before merging
- Prefer descriptive test names and use test.step() for E2E readability
