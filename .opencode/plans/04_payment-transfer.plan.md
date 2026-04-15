# 04_payment-transfer.plan.md

## Goal

Stabilize Payment Transfer page tests by removing debug logs, ensuring the client wrapper accepts `createTransfer` via props (already done), and make the Radix Select test-friendly by adding deterministic attributes or small testMode support.

## Files to change (minimal patch)

- components/payment-transfer/payment-transfer-client-wrapper.tsx — remove debug console.log statements and keep `createTransfer` as a prop (already present). Add a small `data-testid` attribute to SelectTrigger for test targeting.
- components/payment-transfer/payment-transfer-server-wrapper.tsx — ensure it imports `createTransfer` and passes it through (already present).
- components/ui/select.tsx — add minimal test-friendly attributes (data-slot already present); add support for forwarding `data-testid` via SelectTrigger props to make tests deterministic.
- tests/mocks/ui/select.tsx — add a simple test-double component that mimics the Select API for unit tests (optional; included here).

## Tests to update

- tests/unit/PaymentTransferClientWrapper.props.test.tsx — remove debug console logs and rely on `initial*` + `autoSubmit` props or updated `data-testid` attributes to perform deterministic queries. Also mock `sonner` per-test to assert toast calls.

## Test checklist

- Run unit tests: `npm run test`

## Notes

- Keep changes minimal; if Select changes require more invasive refactor, create a follow-up plan.
