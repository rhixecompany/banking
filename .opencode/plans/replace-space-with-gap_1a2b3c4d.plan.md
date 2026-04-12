# Replace space-_ with gap-_ in shadcn/ui components

## Goals

- Replace deprecated or forbidden `space-x-*` and `space-y-*` Tailwind utilities with `gap-*` equivalents across `components/ui/*` following project Critical Rules.

## Scope

- Update only spacing utilities (`space-x-*`, `space-y-*`, `sm:space-x-*`, `rtl:space-x-reverse`, etc.) to use `gap-*` or `sm:gap-*` equivalents.
- Do not modify color, icon sizing, or other class patterns in this change.

## Target Files

- components/ui/sheet.tsx
- components/ui/password-input.tsx
- components/ui/navigation-menu.tsx
- components/ui/form.tsx
- components/ui/dialog.tsx
- components/ui/card.tsx
- components/ui/alert-dialog.tsx

## Risks

- Minimal visual spacing changes: `space-*` and `gap-*` behave slightly differently when wrapping/inline elements, but in our components these utilities are used on flex containers where `gap-*` is the preferred rule.
- Regression risk is low for form and dialog headers, but visual QA recommended.

## Planned Changes

1. Replace `space-y-N` with `gap-N` where used on `flex flex-col` containers.
2. Replace `sm:space-x-N` with `sm:gap-N` where used alongside `sm:flex-row` or horizontal layouts.
3. Replace `space-x-N` with `gap-N` for horizontal stacks.
4. Preserve RTL helpers: convert `rtl:sm:space-x-reverse` to `rtl:sm:gap-x-reverse` is not required; instead preserve `rtl:sm:space-x-reverse` removal of reverse utility is safe because gap does not need reverse; we will remove rtl:space-x-reverse occurrences.

## Validation

1. Run grep for `\bspace-(x|y)-` to ensure no matches remain in `components/ui`.
2. Run a quick dev build (optional) and visually inspect affected components: Sheet, Dialog, Card, Form, PasswordInput, AlertDialog, NavigationMenu.

## Rollback or Mitigation

- Changes are limited to spacing utility strings; if visual regressions occur, revert the single commit and adjust per-file manually.

\*\*\* End Patch
