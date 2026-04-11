# Refactor Frontend ui

## tasks

1: Load all skill by /shadcn /TestingSkill /ValidationSkill /UISkill /SecuritySkill /PlaidSkill /ServerActionSkill /DwollaSkill /DeploymentSkill /DBSkill /AuthSkill then Audit `database/schema.ts` to identify any missing database table and fields.

2: Enhance `database/schema.ts` with any missing database table and fields,

3: Audit all Actions, Zod schemas, Dals for compliance.

4: Enhance all Actions, Zod schemas, Dals using best practices and dry.

5: List all pages in `./app` save the list to `docs/app-pages.md` format with markdownlint then triage.

6: List all custom components in `./components` skip all components in `./components/ui` save the list to `docs/custom-components.md` format with markdownlint then triage, then identify any custom components that can be split up into smaller dynamic generic reusable components.

7: Read and understand `docs/custom-components.md` then Update all custom components in `docs/custom-components.md` ensure to create and use any reusable dynamic generic custom components and saved to `./components/layouts` ensure to verify and valid all reusable dynamic generic custom components in `./components/layouts`.

8: List all test its helpers and configurations in the codebase save the list to `docs/test-context.md` format with markdownlint then triage.

9: Read and understand `docs/app-pages.md` and `docs/test-context.md` then Update all pages,test,helpers and configurations in `docs/app-pages.md` and `docs/test-context.md`

10: fix Warning: The Plaid link-initialize.js script was embedded more than once. This is an unsupported configuration and may lead to unpredictable behavior. Please ensure Plaid Link is embedded only once per page. (<https://cdn.plaid.com/link/v2/stable/link-initialize.js:1:91992>)

11: Update all custom typescript scripts in `./scripts` to be AST-safe and enhanced with re-run in dry-run functionality.

12: Update all bash,powershell,bat scripts in `./scripts` to be AST-safe and enhanced with re-run in dry-run functionality.
