# Map raw color utilities and remove inline icon sizing (conservative)

## Goals

- Replace low-ambiguity raw color utility classes in components/ui with semantic tokens used in the project (e.g., text-slate-500 -> text-muted-foreground, bg-slate-100 -> bg-muted, border-gray-200 -> border-muted).
- Remove obvious inline icon sizing classes on icon elements when the parent already defines icon sizing via selectors (e.g., [&_svg]:size-4). Where appropriate, add data-icon attributes instead of manual size classes.

## Scope

- Target only low-risk, obvious mappings. Do not attempt to map every raw color automatically — ambiguous cases will be left for manual review.
- Remove explicit `size-*` on icon elements when a parent rule already sets icon sizes. If no parent sizing exists, do not remove the icon size.

## Target Files (initial conservative set)

- components/ui/spinner.tsx
- components/ui/calendar.tsx
- components/ui/select.tsx
- components/ui/multi-select.tsx
- components/ui/checkbox.tsx
- components/ui/pagination.tsx
- components/ui/password-input.tsx (icon size already handled; we will remove size-4.5)
- components/ui/sheet.tsx (X icon explicit size -> remove)
- components/ui/dialog.tsx (X icon explicit size -> remove)

## Planned Replacements (examples)

- `border-gray-200` -> `border-muted`
- `border-t-blue-600` -> `border-t-primary`
- `text-slate-500` -> `text-muted-foreground`
- `bg-slate-100` -> `bg-muted`
- `dark:text-slate-400` -> `dark:text-muted-foreground`
- Remove `className="size-4"` on inline icons when parent uses `[&_svg]:size-4` or similar.
- Replace inline icon classes with `data-icon="inline-start"` where appropriate for Button/Icon pairs.

## Risks

- Color semantics may differ (e.g., slate-900 vs slate-50) — conservative mapping minimizes wrong choices, but some visual differences may occur and need manual approval.
- Removing icon sizing where no parent applies sizing could break icon visuals; the plan avoids such removals.

## Validation

- Grep for remaining raw color utilities (text-_-[0-9]{3}) and inline size-_ classes and produce a short report of remaining matches for manual review.
- Quick dev build and spot-check visually.

## Rollback

- As changes are small and targeted, revert the specific commit if needed.
