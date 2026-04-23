# Spec: enhance-pages-v2

Scope: repo

- Scope: server-wrapper additions for payment-transfer, settings, transaction-history
- Acceptance criteria:
  - Each page has a server-wrapper under components/<page>/<page>-server-wrapper.tsx
  - Server wrappers call auth() early, validate input, use DAL via actions/\* (no direct DB import in components), and return a client wrapper component
  - Unit tests exist and run hermetically (mock auth and action modules)
  - MSW handlers or action mocks cover any external network calls used by wrappers
- Tests:
  - Unit tests using Vitest for each server wrapper
  - Playwright smoke tests for /payment-transfer and /transaction-history (CI only)
- Rollout: feature branches per page group
- Reviewers: frontend-lead, backend-lead
