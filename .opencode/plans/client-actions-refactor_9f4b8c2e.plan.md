# Client Actions Refactor Plan

ID: 9f4b8c2e

## Summary

Refactor client components that currently import server actions directly so they instead receive server actions from nearby server components (server-wrapper → client-wrapper). Group changes into small patch groups (<=3 files) to keep diffs reviewable.

## Why

- Repository enforces server/client separation: server actions must not be imported directly into client components.
- Ensure Server Actions remain server-only and are passed to client components by server wrappers.

## Files discovered importing server actions

- components/settings/settings-client-wrapper.tsx (imports updateProfile)
- components/nav-user/nav-user.tsx (imports logoutAccount)
- components/auth-form/auth-form.tsx (imports register)
- components/payment-transfer/payment-transfer-client-wrapper.tsx (imports createTransfer)
- components/footer/footer.tsx (imports logoutAccount)
- components/plaid-link/_ and components/plaid-context/_ (already refactored to accept server action props)

## Strategy

- Make minimal changes per file: do not change public props or renames unless necessary.
- For each client component that imports a server action directly:
  1. Remove the direct import from the client file.
  2. Add a prop to accept the server action (preserve the same call signature).
  3. Update the nearest server wrapper to import the server action and pass it as a prop to the client wrapper.
  4. Add/update unit tests where behavior is changed.
  5. Run formatting and type-checking.

## Patch Groups (apply sequentially)

Group A — Settings (3 files)

- components/settings/settings-client-wrapper.tsx (remove import, accept updateProfile prop)
- components/settings/settings-server-wrapper.tsx (import updateProfile, pass to client wrapper)
- tests/unit/updateProfile.test.ts (ensure tests import the action directly for unit-testing; no change required unless signature changes)

Group B — Auth (2 files)

- components/auth-form/auth-form.tsx (remove import, accept register prop)
- app/(auth)/sign-up/page.tsx or sign-up server wrapper (import register, pass prop)

Group C — Logout (2 files)

- components/nav-user/nav-user.tsx (remove import, accept logoutAccount prop)
- components/footer/footer.tsx (remove import, accept logoutAccount prop)
- app/(root)/layout.tsx or top-level server wrapper (import logoutAccount, pass down via NavUser/Footer props)

Group D — Payment Transfer (2 files)

- components/payment-transfer/payment-transfer-client-wrapper.tsx (remove import, accept createTransfer prop)
- components/payment-transfer/payment-transfer-server-wrapper.tsx (import createTransfer, pass to client wrapper)

Group E — Plaid provider/link (already addressed)

## Testing and Verification

- After each group patch, run:
  1. npm run format
  2. npm run type-check
  3. npm run test (or npm run test:unit) — fix failing tests introduced by the change
- Add unit tests for client components where appropriate to assert they call the passed-in server action prop when triggered. Use jest/vitest mocking for the function prop.
- Do not run Playwright until all server wrappers are updated; E2E may break otherwise.

## Rollout Plan

1. Apply Group A (Settings) — small and self-contained. Verify unit tests. Notes

---

- Keep changes minimal. If a change touches >3 files, create a dedicated plan file for that group.
- I will apply patches for Group A now (3 files). After applying Group A, I will run type-check and unit tests and report results.

## Files read to prepare this plan

- components/settings/settings-client-wrapper.tsx — contained updateProfile import
- components/settings/settings-server-wrapper.tsx — server wrapper for settings page
- components/nav-user/nav-user.tsx
- components/footer/footer.tsx
- components/auth-form/auth-form.tsx
- components/payment-transfer/payment-transfer-client-wrapper.tsx
- components/payment-transfer/payment-transfer-server-wrapper.tsx
- components/plaid-context/plaid-context.tsx
- components/layouts/plaid-provider.tsx
- components/plaid-link/plaid-link.tsx

Approved by user: Yes (you approved "Proceed i have Approved")
