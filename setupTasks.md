# Refactor Frontend ui

## tasks

1: @planner Audit all Actions, Zod schemas, Dals for compliance and enhancements.

2: @implementer Upgrade all Actions, Zod schemas, Dals using best practices and dry practices.

3: @planner List all pages in `./app` for compliance and enhancements save the list to `docs/app-pages.md` format with markdownlint.

4: @planner List all custom components in `./components` skip all components in `./components/ui` for compliance and enhancements save the list to `docs/custom-components.md` format with markdownlint then triage, then identify any custom components that can be split up into smaller dynamic generic reusable components.

5: @implementer Update all custom components,pages in `docs/custom-components.md` and `docs/app-pages.md` ensure to create and use any reusable dynamic generic custom components and saved to `./components/layouts` ensure to verify and valid all reusable dynamic generic custom components in `./components/layouts` use dry practices.

6: @planner List all test its helpers and configurations in the codebase for compliance and enhancements save the list to `docs/test-context.md` format with markdownlint then triage.

7: @implementer Update all test,helpers and configurations in `docs/test-context.md` use dry practices Harden all vitest and Playwright E2E specs by removing skipped/non-deterministic tests, standardizing assertions, and making authenticated scenarios deterministic with a seeded user.

8: @planner Update all custom typescript scripts,bash,powershell,bat scripts in `./scripts` for compliance and enhancements.

9: @implementer Update all custom typescript scripts,bash,powershell,bat scripts in `./scripts` to be AST-safe and enhanced with re-run in dry-run functionality.

10: @planner start by modify npm run format to use the repo bash scripts with echo telling us what running then it will fail if bash is available and then default to the powershell,bat scripts if it works update all validation scripts such as lint/type-check/test/format/build

10: ask all clarifying questions one at a time.
