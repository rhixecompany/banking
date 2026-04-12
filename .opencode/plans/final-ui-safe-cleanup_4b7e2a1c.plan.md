# Final UI Safe Cleanup

## Goals

- Apply a final conservative pass of low-risk UI fixes to shadcn/ui components.
- Replace a few remaining raw palette and border utilities with the project's semantic tokens where the mapping is unambiguous.
- Avoid touching intentional size-\* tokens and complex parent selector patterns.

## Scope

- Single-file changes: components/ui/calendar.tsx
- Add a plan file documenting the change.

## Target Files

- components/ui/calendar.tsx

## Risks

- Visual regressions in the Calendar component if the chosen semantic tokens differ noticeably from the replaced slate colors in certain themes. Risk is low: the project already uses bg-muted and border-input widely.

## Planned Changes

- Replace `dark:bg-slate-950` with `dark:bg-muted/80`.
- Replace `border-slate-200` with `border-input`.
- Replace `dark:border-slate-800` with `dark:border-input/60`.

These substitutions follow existing patterns in the components (bg-muted, border-input, dark:bg-muted/80) to remain consistent.

## Validation

1. Run quick greps to ensure no `bg-slate-950`, `border-slate-200`, or `border-slate-800` remain in components/ui.
2. Run `npm run type-check` and `npm run lint` locally (fast checks).
3. Manual visual check recommended for Calendar in light and dark themes.

## Rollback or Mitigation

- If a regression is found, revert the single commit that modifies calendar.tsx (git checkout -- components/ui/calendar.tsx) and re-run tests.

\*\*\* End Patch
