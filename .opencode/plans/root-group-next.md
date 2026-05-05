---
plan name: root-group-next
plan description: Server wrappers + tests
plan status: active
---

## Idea

Add server wrappers and hermetic tests for next route group

## Implementation

- 1. Inventory: list files for payment-transfer, settings, transaction-history pages, components, and existing server wrappers (if any).
- 2. Create server wrappers: implement server-wrapper components under components/<page>/<page>-server-wrapper.tsx matching the existing dashboard/my-wallets pattern. Use auth(), call DAL via actions/\*, and return client wrapper components. Add types and minimal error handling.
- 3. Create hermetic unit tests: add tests/unit/{payment-transfer,my-wallets?,settings,transaction-history}-server-wrapper.test.ts that mock @/lib/auth and relevant actions/DAL with vi.mock to assert JSX returned and error handling. Reuse global auth mock; override per-test when simulating unauthenticated behavior.
- 4. Update tests/setup.ts if needed (already done). Ensure MSW handlers cover network calls used by these wrappers or mock action modules directly.
- 5. Commit changes incrementally on a feature branch feat/root-refactor-2 with small commits: inventory, each server wrapper + test.
- 6. Validation: run format, type-check, lint:strict (or lint only affected paths), and targeted vitest tests for new files. Run full CI on PR for full suite and Playwright smoke tests.
- 7. Rollout: After PR approval, iterate to extract AppShell/PageShell where shared UI is duplicated across these pages. Then proceed to remaining route groups.
- 8. QA: Add Playwright smoke tests for /payment-transfer and /transaction-history once server wrappers are in and DB seed scripts available for CI.
- 9. Monitoring & rollback: merge to feature branch first; monitor CI; revert small commits if regressions seen.

## Required Specs

<!-- SPECS_START -->

- enhance-pages-v2
<!-- SPECS_END -->
