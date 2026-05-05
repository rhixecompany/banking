# Phase 4.2 Generic Components Integration Design

## Goal

Integrate generic layout components into core app pages only to reduce page-level boilerplate without changing behavior.

## Scope

- In scope: `app/(auth)/**/page.tsx`, `app/(root)/**/page.tsx`, `app/(admin)/**/page.tsx`.
- Out of scope: `app/demo/**`, `components/ui`, server wrappers, client wrappers, and feature components.

## Approach (Broad)

- Apply `GenericPageShell` to page-level containers when the page defines a title/description in metadata or nearby markup.
- Replace obvious page-level cards, tables, and forms only when the markup lives in the page file.
- Do not refactor markup inside wrappers or imported components.

## Guardrails

- No new data fetching.
- No auth or redirect changes.
- No `process.env` or DB imports in pages.
- `app/page.tsx` stays static.
- Preserve existing metadata and wrapper structure.

## Success Criteria

- Page files are simpler and use generic components where it is a clear fit.
- No behavior changes or routing changes.
- Demo pages unchanged.

## Files to Touch

- `app/(auth)/**/page.tsx`
- `app/(root)/**/page.tsx`
- `app/(admin)/**/page.tsx`
