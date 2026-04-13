# Refactor Frontend ui

## tasks

1: as Architect Persona Audit `database/schema.ts` to identify any missing database table and fields.

2: as Implementer Persona Enhance `database/schema.ts` with any missing database table and fields,

3: as Architect Persona Audit all Actions, Zod schemas, Dals for compliance.

4: as Implementer Persona Enhance all Actions, Zod schemas, Dals using best practices and dry.

5: as Implementer Persona List all pages in `./app` save the list to `docs/app-pages.md` format with markdownlint then triage.

6: as Implementer Persona List all custom components in `./components` skip all components in `./components/ui` save the list to `docs/custom-components.md` format with markdownlint then triage, then identify any custom components that can be split up into smaller dynamic generic reusable components.

7: as Implementer Persona Update all custom components,pages in `docs/custom-components.md` and `docs/app-pages.md` ensure to create and use any reusable dynamic generic custom components and saved to `./components/layouts` ensure to verify and valid all reusable dynamic generic custom components in `./components/layouts` use dry practices.

8: as Implementer Persona List all test its helpers and configurations in the codebase save the list to `docs/test-context.md` format with markdownlint then triage.

9: as Implementer Persona Update all test,helpers and configurations in `docs/test-context.md` use dry practices Harden all vitest and Playwright E2E specs by removing skipped/non-deterministic tests, standardizing assertions, and making authenticated scenarios deterministic with a seeded user.

10: fix Warning: The Plaid link-initialize.js script was embedded more than once. This is an unsupported configuration and may lead to unpredictable behavior. Please ensure Plaid Link is embedded only once per page. (<https://cdn.plaid.com/link/v2/stable/link-initialize.js:1:91992>)

11: as Implementer Persona Update all custom typescript scripts in `./scripts` to be AST-safe and enhanced with re-run in dry-run functionality.

12: as Implementer Persona Update all bash,powershell,bat scripts in `./scripts` to be AST-safe and enhanced with re-run in dry-run functionality.

13: ask all needed questions one at a time then show me the full final plan
