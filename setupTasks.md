# Refactor Frontend ui

## tasks

1: as Reviewer Persona Audit all Actions, Zod schemas, Dals for compliance and enhancements.

2: as Implementer Persona Upgrade all Actions, Zod schemas, Dals using best practices and dry practices.

3: as Reviewer Persona List all pages in `./app` for compliance and enhancements save the list to `docs/app-pages.md` format with markdownlint.

4: as Reviewer Persona List all custom components in `./components` skip all components in `./components/ui` for compliance and enhancements save the list to `docs/custom-components.md` format with markdownlint then triage, then identify any custom components that can be split up into smaller dynamic generic reusable components.

5: as Implementer Persona Update all custom components,pages in `docs/custom-components.md` and `docs/app-pages.md` ensure to create and use any reusable dynamic generic custom components and saved to `./components/layouts` ensure to verify and valid all reusable dynamic generic custom components in `./components/layouts` use dry practices.

6: as Reviewer Persona List all test its helpers and configurations in the codebase for compliance and enhancements save the list to `docs/test-context.md` format with markdownlint then triage.

7: as Implementer Persona Update all test,helpers and configurations in `docs/test-context.md` use dry practices Harden all vitest and Playwright E2E specs by removing skipped/non-deterministic tests, standardizing assertions, and making authenticated scenarios deterministic with a seeded user.

8: as Reviewer Persona Update all custom typescript scripts,bash,powershell,bat scripts in `./scripts` for compliance and enhancements.

9: as Implementer Persona Update all custom typescript scripts,bash,powershell,bat scripts in `./scripts` to be AST-safe and enhanced with re-run in dry-run functionality.

10: ask all clarifying questions one at a time.
