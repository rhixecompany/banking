# 03_my-wallets.plan.md

## Goal

Ensure My Wallets page follows server-wrapper → client-wrapper pattern and that the client wrapper accepts server action props (remove direct imports if any). Add/update unit tests verifying client wrapper invokes server action props.

## Files to change (minimal patch)

- components/my-wallets/my-wallets-client-wrapper.tsx — ensure `removeWallet` is accepted as a prop (already present) and remove any direct server action imports.
- components/my-wallets/my-wallets-server-wrapper.tsx — review server wrapper to ensure server actions are imported here and passed to client wrapper (already correct).
- tests/unit/my-wallets-client-wrapper.test.tsx — ensure tests mock `removeWallet` and assert calls (existing test already covers this).

## Notes

- The My Wallets client wrapper already accepts `removeWallet` as a prop and the server wrapper passes `removeWallet` from actions. No code changes required besides test verification.
