01_home.plan.md

## Goal

Canonicalize Home page to `app/page.tsx` and ensure server-wrapper → client-wrapper pattern is applied where relevant.

## Files to change (minimal patch)

- components/home/home-server-wrapper.tsx — ensure server-only logic lives here (no change required by audit unless inconsistencies found)
- components/home/home-client-wrapper.tsx — accept server action props if interactivity is later added (currently placeholder)
- tests/unit/home-client-wrapper.props.test.tsx — unit test to assert client wrapper behavior (create if needed)

## Steps

1. Inspect `app/(root)/page.tsx` (if present) to confirm it is duplicate. Prefer `app/page.tsx` as canonical.
2. Keep `HomeServerWrapper` as the server-side entry point (no client action imports in client wrapper).
3. If future interactivity is added to `home-client-wrapper.tsx`, ensure server actions are passed as props rather than imported directly.

## Test checklist

- Add unit tests that assert the Home client wrapper renders when invoked by the server wrapper.
- Run unit tests once full per-page enhancement is complete.

## Rollback

- Revert plan file or restore any removed files if needed.

## Notes

- This plan keeps the Home changes minimal and documents the intended pattern for future enhancements.
