# Auth group checklist

This checklist covers the work to make auth pages (app/(auth)) DRY, testable, and compliant with repo conventions.

Files:

- app/(auth)/sign-in/page.tsx
- app/(auth)/sign-up/page.tsx
- components/sign-in/sign-in-server-wrapper.tsx
- components/sign-up/sign-up-server-wrapper.tsx
- components/layouts/auth-form/index.tsx
- actions/auth.signin.ts
- actions/register.ts

Checklist:

1. Verify server wrappers call auth() and redirect appropriately (already present).
2. Ensure AuthForm is presentational-only and receives server actions or API endpoints via props.
3. Add Zod validation to server actions (auth.signin already has Zod; register uses signUpSchema).
4. Add deterministic seed fixtures for auth users under tests/fixtures/seed-user.json.
5. Add unit tests for AuthForm props and behaviors (existing tests should be run and updated if flaky).
6. Update docs/test-context.md with seeding and Playwright guidance (done).
7. Ensure AuthForm supports `actionEndpoint` prop for API-based registration flows (implemented).

Use this checklist to track per-file changes and PRs.
