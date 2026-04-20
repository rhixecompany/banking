## Enhance pages todo (auto-generated)

1. (in_progress) Auth group
   - Refactor sign-in/sign-up flows to use server actions and presentational AuthForm (done)
   - Add lib/session.getCurrentUser helper (done)
   - Harden API shims with try/catch (done)
   - Run unit tests for AuthForm and fix mocks if needed (in_progress)
2. (pending) Root group
   - Visit dashboard server wrapper and ensure Zod validations / auth present
   - Ensure getUserWallets/getRecentTransactions actions return stable shapes
3. (pending) Admin group
   - Verify AdminLayoutWrapper gating uses getCurrentUser and redirects
   - Extract presentational components into components/layouts/admin-\*
4. (pending) Home page
   - Ensure HomeServerWrapper is SSR-friendly and presentational components are props-only

Notes: This todo is used to track the auto-continue batches requested by the user.
