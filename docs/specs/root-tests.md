# Spec: root-tests

Scope: repo

Spec: Root server-wrapper testing and helpers

Purpose

- Provide reusable, hermetic test helpers and standardized unit tests for root route-group server wrappers (payment-transfer, settings, transaction-history).

Files to add

- tests/utils/serverWrapperTestUtils.ts
  - export mockRedirect(url: string) => throw Error('REDIRECT:'+url)
  - export makeAuthMock(session?: Session) -> typed vi.fn returning session
  - export extractPropsFromElement(el: ReactElement) -> any (safe accessor)

- tests/unit/\*-server-wrapper.test.ts (updated)
  - Each test file will:
    - vi.mock('@lib/auth') local override where needed
    - vi.mock('next/navigation', () => ({ redirect: (url)=>{throw new Error('REDIRECT:'+url)} })) OR reuse mockRedirect helper
    - Strong prop assertions using extractPropsFromElement
    - Unauthenticated test overriding auth mock to null and asserting REDIRECT:/sign-in

Test conventions

- Keep mocks local to each test file unless multiple tests require the same global mock. Avoid touching tests/setup.ts global auth mock here.
- All server-wrapper tests must assert:
  - The return is a React element
  - props include expected DTO shapes (wallets, recipients, transactions, userWithProfile)
  - create/update functions are function types when returned
  - Redirect behavior when auth returns null

Developer workflow

1. Branch: feat/root-refactor-2
2. Add tests/utils/serverWrapperTestUtils.ts and update tests
3. Run locally: npm run format && npm run type-check && npm run lint:strict
4. Run targeted tests: npx vitest tests/unit/\*-server-wrapper.test.ts --run
5. Commit with small reversible commits (tests first)

CI / PR expectations

- PR must pass CI where lint and Playwright/E2E run. Document E2E env var requirements in PR body.
- Add reviewers: frontend-owner, backend-owner, QA.

Optional

- Add Playwright E2E test that signs in and verifies redirect flow using seeded DB and env vars.

Notes

- Do NOT commit secrets. Use app-config.ts for env access. Follow repo guidelines.
