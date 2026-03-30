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

## Plan: Batch Fix All Errors, Warnings, and Deprecations (Banking Monorepo)

**TL;DR:** Systematically run all validation, build, and test scripts to collect every error, warning, and deprecation in the Next.js 16/TypeScript Banking monorepo. Categorize and batch-fix all issues, including code, dependencies, config, and documentation, per clarified user policies. Ensure all scripts pass with zero errors/warnings, update all affected docs, and provide a detailed before/after report.

---

### Steps

#### Phase 1: Error & Warning Collection

1. Run all validation, build, and test scripts:
   - `npm run lint`
   - `npm run type-check`
   - `npm run test`
   - `npm run build`
2. Aggregate all errors, warnings, and deprecation notices from the above.
3. Categorize issues by type (lint, type, test, build, dependency, config, schema, docs).

#### Phase 2: Batch Fix Implementation

4. For each category, batch-fix issues:
   - **Lint/Format:** Auto-fix where possible, then manually resolve remaining.
   - **Type Errors:** Refactor code for strict TypeScript compliance (no `any`).
   - **Test Failures:** Stabilize or rewrite flaky tests.
   - **Build Errors/Warnings:** Update code/config for compatibility.
   - **Deprecations:** Upgrade dependencies to latest stable, refactor code for breaking changes, and update all affected code/docs.
   - **Third-party Issues:** Implement workarounds and document them.
   - **Env/Config:** Update code, docs, and deployment references for any env/config changes.
   - **Database Schema:** Generate/apply migrations, update related code, and document.
   - **Deprecated Features:** Remove code, docs, comments, and tests for deprecated/unused features.
   - **Public API/UI/UX:** Update backend, downstream docs/clients, UI code, tests, and design references as needed.

#### Phase 3: Documentation & Reporting

5. Update all relevant documentation:
   - README.md, CHANGELOG.md, inline comments, architectural docs, config references.
6. Prepare a detailed report:
   - List of all issues found and fixed.
   - Before/after code snippets for significant changes.
   - Explanations for major/breaking changes.
   - Documentation of workarounds, migrations, and config changes.

#### Phase 4: Full Validation & Verification

7. Re-run all scripts (`npm run lint`, `npm run type-check`, `npm run test`, `npm run build`) to confirm zero errors/warnings.
8. Manually verify that all breaking changes, migrations, and documentation updates are complete and accurate.
9. Ensure all tests (unit, E2E) pass 100%.

---

### Relevant Files

- `package.json`, `tsconfig.json`, `next.config.ts`, `eslint.config.mts`, `vitest.config.ts`, `playwright.config.ts` — dependency, config, and script updates
- `app/`, `components/`, `lib/`, `database/`, `types/`, `tests/` — code, schema, and test fixes
- `README.md`, `CHANGELOG.md`, `docs/`, `DEPLOYMENT-MIGRATION.md`, `SECURITY.md` — documentation updates
- `.env*`, `generate-env.sh` — environment/config changes

---

### Verification

1. All scripts (`npm run lint`, `npm run type-check`, `npm run test`, `npm run build`) complete with zero errors/warnings.
2. All tests (unit, integration, E2E) pass 100%.
3. Manual review of documentation, config, and migration updates.
4. All deprecated/unused features fully removed from code, docs, and tests.
5. All breaking changes, migrations, and workarounds are clearly documented.

---

### Decisions & Scope

- **Scope:** All files, all issues, all dependencies, all documentation.
- **Dependency Policy:** Always upgrade to latest stable; refactor for breaking changes.
- **Test Policy:** Stabilize or rewrite flaky tests.
- **Breaking Changes:** Proceed, update all affected code/docs.
- **Third-party Issues:** Implement workaround and document.
- **Env/Config:** Update code, docs, and deployment references.
- **Database Schema:** Generate/apply migration, update code, document.
- **Deprecated Features:** Fully remove code, docs, comments, and tests.
- **Public API/UI/UX:** Update backend, downstream docs/clients, UI code, tests, and design references.

---

### Further Considerations

1. If any dependency upgrade introduces a major breaking change, ensure all downstream code and documentation are updated in the same batch.
2. For any database migration, ensure both up and down migrations are tested and documented.
3. For any public API or UI/UX change, coordinate updates across backend, frontend, tests, and documentation to maintain consistency.

---

**Ready to proceed with Phase 1: error and warning collection.** Let me know if you want to adjust any part of this plan before execution!
