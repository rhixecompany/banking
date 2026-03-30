---
agent: "Next.js Expert"
model: "Auto"
tools:
  [
    vscode,
    execute,
    read,
    agent,
    edit,
    search,
    web,
    "github/*",
    browser,
    vscode.mermaid-chat-features/renderMermaidDiagram,
    github.vscode-pull-request-github/issue_fetch,
    github.vscode-pull-request-github/labels_fetch,
    github.vscode-pull-request-github/notification_fetch,
    github.vscode-pull-request-github/doSearch,
    github.vscode-pull-request-github/activePullRequest,
    github.vscode-pull-request-github/pullRequestStatusChecks,
    github.vscode-pull-request-github/openPullRequest,
    todo
  ]
description: "Batch fix all errors, warnings, and deprecations in the Banking monorepo, ensuring code, dependencies, config, and documentation are updated and compliant with project standards."
---

## DRY Plan: Batch Fix All Errors, Warnings, and Deprecations (Code-First, Banking Monorepo)

**TL;DR:** Systematically run all validation, build, and test scripts (`npm run lint`, `npm run type-check`, `npm run test`, `npm run build`) in the Banking Next.js monorepo. For every error, warning, or deprecation, collect the full output, identify the root cause, and apply the minimal, standards-compliant fix—prefer code-only changes, never update lint config. Batch and document all changes, update docs if needed, and repeat until zero errors/warnings remain. Prepare a detailed, traceable report.

---

### Steps

#### Phase 1: Issue Collection & Categorization

1. Run all scripts:
   - `npm run lint`
   - `npm run lint:fix`
   - `npm run type-check`
   - `npm run test`
   - `npm run build`
2. Aggregate all errors, warnings, and deprecation notices by file and type (lint, type, test, build, dependency, config, schema, docs).
3. For each error/warning:
   - Read the full file(s) and relevant code sections.
   - Identify the root cause (syntax, type, API usage, deprecated package, etc.).
   - Search for and read official documentation for any problematic packages or APIs.

#### Phase 2: Code-First Batch Fixes

4. For each error/warning:
   - **Lint/Format:**
     - Apply code-only fixes (never update `eslint.config.mts` or lint config).
     - Add `import React from "react";` to files with JSX and missing import.
     - Explicitly annotate return types for all exported functions/components.
     - Remove/refactor unstable memoization (e.g., `useMemo`, `memo`).
     - Replace impure functions (e.g., `Math.random()` in render) with values generated outside render or in a `useState` initializer.
     - Manually resolve circular import/formatting issues by reordering imports/exports and formatting code.
     - Batch repeated issues (e.g., missing React import) for efficiency.
   - **Type Errors:** Refactor code for strict TypeScript compliance (no `any`).
   - **Test Failures:** Fix code or tests as appropriate; stabilize or rewrite flaky tests.
   - **Build Errors/Warnings:** Update code/config for compatibility.
   - **Deprecations:** Upgrade dependencies to latest stable, refactor code for breaking changes, and update all affected code/docs.
   - **Third-party Issues:** Implement workarounds and document them.
   - **Env/Config:** Update code, docs, and deployment references for any env/config changes.
   - **Database Schema:** Generate/apply migrations, update related code, and document.
   - **Deprecated Features:** Remove code, docs, comments, and tests for deprecated/unused features.
   - **Public API/UI/UX:** Update backend, downstream docs/clients, UI code, tests, and design references as needed.
5. Run `npm run lint:fix` to auto-format the codebase.

#### Phase 3: Validation & Iteration

6. Rerun all scripts (`lint`, `type-check`, `test`, `build`) to confirm all issues are resolved.
7. If any errors/warnings remain, repeat Phases 1–3 until clean.

#### Phase 4: Documentation & Reporting

8. Document all fixes:
   - List affected files and error types.
   - Provide before/after code snippets for significant changes.
   - Explain why each change was necessary.
   - Reference relevant docs/resources.
9. Update README, CHANGELOG, and any architectural docs if fixes impact usage/setup/architecture.
10. Prepare a detailed change report.

#### Phase 5: Commit & Final Verification

11. Commit all fixes in a single batch with a clear summary.
12. Final run of all scripts to ensure zero errors/warnings.
13. If any warnings remain (e.g., unavoidable third-party issues), document and justify.

---

### Relevant Files

- All source files with errors/warnings (to be identified during error collection)
- All `.tsx`, `.ts`, `.jsx`, `.js` files with lint issues (see lint report)
- Example files from the latest report:
  - `app/(admin)/application-shell-01/page.tsx`
  - `app/(admin)/dashboard-shell-01/page.tsx`
  - `components/data-table.tsx`
  - `components/ui/sidebar.tsx`
  - `components/AuthForm.tsx`
  - `components/CustomInput.tsx`
  - ...and all other files listed in the lint-fix report
- README.md, `CHANGELOG.md`, and any docs if usage/setup changes
- package.json/tsconfig.json if dependency or config changes are needed
- `next.config.ts`, `eslint.config.mts`, `vitest.config.ts`, `playwright.config.ts` (for reference, not config changes)
- `.env*`, `generate-env.sh` (if env/config changes are required)

---

### Verification

1. All scripts (`npm run lint`, `npm run type-check`, `npm run test`, `npm run build`) complete with zero errors and zero warnings.
2. All fixes are documented and traceable.
3. Codebase remains consistent with project standards and conventions.
4. Documentation is updated if any fix impacts usage/setup/architecture.
5. No changes made to `eslint.config.mts` or any lint config files.
6. All fixes are code-only and standards-compliant unless a breaking change requires otherwise (document rationale).

---

### Decisions & Scope

- **Scope:** All files, all issues, all dependencies, all documentation.
- **Config Policy:** Never update `eslint.config.mts` or any lint config; only fix code.
- **Dependency Policy:** Always upgrade to latest stable; refactor for breaking changes.
- **Test Policy:** Stabilize or rewrite flaky tests.
- **Breaking Changes:** Proceed, update all affected code/docs.
- **Third-party Issues:** Implement workaround and document.
- **Env/Config:** Update code, docs, and deployment references.
- **Database Schema:** Generate/apply migration, update code, document.
- **Deprecated Features:** Fully remove code, docs, comments, and tests.
- **Public API/UI/UX:** Update backend, downstream docs/clients, UI code, tests, and design references.
- **Repeat:** Continue until all issues are resolved in code.
- **Batching:** For repeated issues (e.g., missing React import), batch fixes for efficiency.

---

### Example Fix Patterns

- Add `import React from "react";` to all files with JSX and missing import.
- Add explicit return types to all exported functions/components.
- Refactor/remove unstable memoization and impure functions in render.
- Manually resolve circular import/formatting issues.

---

### Further Considerations

1. If a package update is required for a deprecation fix, prefer the latest stable version and review the changelog for breaking changes.
2. If a fix requires a significant code change (e.g., major API migration), document the rationale and reference official migration guides.
3. If any test failures are due to flaky or external dependencies, document and recommend stabilization steps.
4. For any database migration, ensure both up and down migrations are tested and documented.
5. For any public API or UI/UX change, coordinate updates across backend, frontend, tests, and documentation to maintain consistency.

---

**Ready to proceed with Phase 1: error and warning collection and code-only-first batch fixes.**
