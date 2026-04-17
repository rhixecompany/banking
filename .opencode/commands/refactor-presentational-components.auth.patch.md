Files changed:

- components/layouts/auth-form/index.tsx — new re-export to follow components/layouts convention for presentational components. Keeps original implementation in components/auth-form for now to minimize risk.
- lib/schemas/index.ts — central re-export for schemas; makes importing shared schemas easier going forward.
- tests/unit/auth-form.layout.test.tsx — unit test that imports the new layout re-export and verifies sign-in heading renders.
- components/sign-up/sign-up-server-wrapper.tsx — switched import to components/layouts/auth-form to use the new presentational location.
- components/sign-in/sign-in-server-wrapper.tsx — switched import to components/layouts/auth-form.

Files read (provenance):

- components/auth-form/auth-form.tsx — to re-export and ensure behavior preserved.
- components/sign-up/sign-up-server-wrapper.tsx — to update import path.
- components/sign-in/sign-in-server-wrapper.tsx — to update import path.
- actions/register.ts — inspected to ensure Server Action complies with Zod + stable-return contract.
- lib/schemas/auth.schema.ts & lib/validations/auth.ts — to confirm existing schema locations and types.

Rationale:

Minimal, low-risk change to start extracting presentational components into components/layouts. We re-export the existing implementation to avoid behavioral changes and update server wrappers to import from the new path. Added a unit test to verify the new import surface resolves and renders as expected.
