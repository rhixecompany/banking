## Plan: Fix All Lint Issues, Warnings, and Errors (Code-Only)

**TL;DR:** Systematically resolve all lint warnings and errors in the codebase by updating code, not configuration. Do not modify `eslint.config.mts`. Address all issues surfaced by `npm run lint` and `npm run lint:fix`.

---

### Steps

#### Phase 1: Issue Collection

1. Run `npm run lint` and `npm run lint:fix` to collect all lint warnings and errors.
2. Aggregate all issues by file and type (e.g., missing React import, missing return type, impure function, memoization, import order).

#### Phase 2: Code-Only Fixes

3. For each file with lint issues:
   - Add `import React from "react";` to the top if JSX is used and React is not imported.
   - Explicitly annotate return types for all exported functions/components.
   - Remove or refactor unstable memoization (e.g., `useMemo`, `memo`) and avoid passing unstable functions to memoized children.
   - Replace impure functions (e.g., `Math.random()` in render) with values generated outside the render or in a `useState` initializer.
   - Manually resolve circular import/formatting issues by reordering imports/exports and formatting code.
   - Fix any other code-level lint issues as reported, without changing lint config.

#### Phase 3: Validation

4. Re-run `npm run lint` and `npm run lint:fix` to confirm all issues are resolved.
5. Repeat Phases 1–3 until zero lint errors/warnings remain.

---

### Relevant Files

- All `.tsx`, `.ts`, `.jsx`, `.js` files with lint issues (see lint report)

---

### Verification

1. `npm run lint` and `npm run lint:fix` complete with zero errors/warnings.
2. No changes made to `eslint.config.mts` or any lint config files.
3. All fixes are code-only and standards-compliant.

---

### Decisions & Scope

- **Scope:** All code files with lint issues; do not touch config.
- **Config Policy:** Never update `eslint.config.mts` or any lint config; only fix code.
- **Repeat:** Continue until all lint issues are resolved in code.

---

**Ready to proceed with file-by-file code fixes.**
