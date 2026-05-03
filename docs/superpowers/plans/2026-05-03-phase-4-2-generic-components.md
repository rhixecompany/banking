# Phase 4.2 Generic Components Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate generic layout components into core app pages where page-level markup exists, without changing behavior.

**Architecture:** Restrict changes to core `app/**/page.tsx` files only. Wrap only page-level markup that is defined in the page file itself; do not touch server/client wrappers or component internals. Preserve metadata and existing Suspense boundaries.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS, shadcn/ui

---

## File Structure

**Audit targets (core pages only):**

- `app/(auth)/sign-in/page.tsx`
- `app/(auth)/sign-up/page.tsx`
- `app/(admin)/admin/page.tsx`
- `app/(root)/dashboard/page.tsx`
- `app/(root)/my-wallets/page.tsx`
- `app/(root)/payment-transfer/page.tsx`
- `app/(root)/transaction-history/page.tsx`
- `app/(root)/settings/page.tsx`

**Generic components available (do not modify these files):**

- `components/layouts/generic-page-shell/index.tsx`
- `components/layouts/generic-card/index.tsx`
- `components/layouts/generic-data-table/index.tsx`
- `components/layouts/generic-form/index.tsx`

---

### Task 1: Audit core pages for inline markup

**Files:**

- Modify: none (audit-only)

- [ ] **Step 1: Read each core page file**

Review the file contents and identify inline page-level markup inside the page component (outside imported wrappers).

- [ ] **Step 2: Record candidates for replacement**

Create a short list of any inline structures in page files that match:

- Page shell (title/description/action bar)
- Card container markup
- Table markup
- Form wrapper markup

If no inline markup exists (pages only render wrappers), the task is a no-op and you should move to Task 4.

---

### Task 2: Apply GenericPageShell where applicable

**Files:**

- Modify: `app/(auth)/sign-in/page.tsx`
- Modify: `app/(auth)/sign-up/page.tsx`
- Modify: `app/(admin)/admin/page.tsx`
- Modify: `app/(root)/*/page.tsx`

- [ ] **Step 1: Add GenericPageShell import (only where used)**

```ts
import { GenericPageShell } from "@/components/layouts/generic-page-shell";
```

- [ ] **Step 2: Wrap inline page-level markup with GenericPageShell**

Use this exact pattern when the page itself renders a page header or container:

```tsx
return (
  <GenericPageShell
    title="Page Title"
    description="Short description"
  >
    {/** existing inline page markup here **/}
  </GenericPageShell>
);
```

If the page only renders an imported wrapper inside `Suspense` (no inline markup), do not add `GenericPageShell`.

---

### Task 3: Replace inline cards/tables/forms where applicable

**Files:**

- Modify: `app/(auth)/sign-in/page.tsx`
- Modify: `app/(auth)/sign-up/page.tsx`
- Modify: `app/(admin)/admin/page.tsx`
- Modify: `app/(root)/*/page.tsx`

- [ ] **Step 1: Replace page-level card markup with GenericCard**

```tsx
import { GenericCard } from "@/components/layouts/generic-card";

return (
  <GenericCard
    header={<h2 className="text-lg font-semibold">Title</h2>}
  >
    {/** existing inline card content **/}
  </GenericCard>
);
```

- [ ] **Step 2: Replace page-level table markup with GenericDataTable**

```tsx
import { GenericDataTable } from "@/components/layouts/generic-data-table";

const columns = [
  { key: "name", header: "Name" },
  { key: "amount", header: "Amount" }
];

return <GenericDataTable data={rows} columns={columns} />;
```

- [ ] **Step 3: Replace page-level form wrappers with GenericForm**

```tsx
import { GenericForm } from "@/components/layouts/generic-form";

return (
  <GenericForm form={form} onSubmit={handleSubmit}>
    {/** existing inline form fields **/}
  </GenericForm>
);
```

If none of these patterns appear in page files, do not add these imports.

---

### Task 4: Verify guardrails (no behavior changes)

**Files:**

- Modify: none (verification-only)

- [ ] **Step 1: Confirm no wrapper or auth changes**

Check that `AuthLayoutWrapper`, `RootLayoutWrapper`, and server wrapper usage is untouched, and no new data fetching or redirects were introduced.

- [ ] **Step 2: Confirm demo pages untouched**

Ensure no files under `app/demo/**` were modified.

---

### Task 5: Commit changes (if any)

**Files:**

- Commit only if page files changed

- [ ] **Step 1: Check git status**

Run: `git status -sb`

- [ ] **Step 2: Commit if there are changes**

```bash
git add app/(auth)/ app/(admin)/ app/(root)/
git commit -m "refactor: apply generic layouts to core pages"
```

If there are no changes, do not create a commit.

---

## Notes

- No tests are run in Phase 4 until Task 4.5.
- Keep `app/page.tsx` static and unchanged.
- Do not modify server or client wrappers.
