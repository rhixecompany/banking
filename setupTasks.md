# Refactor Frontend ui

## tasks

1: As reviewer personas Read and understand all markdown files in the codebase, in `./docs`.

2: Audit `database/schema.ts` to identify any missing database table and fields.

3: Enhance `database/schema.ts` with any missing database table and fields,

4: Audit all Actions, Zod schemas, Dals for compliance.

5: Enhance all Actions, Zod schemas, Dals using best practices and dry.

6: List all pages in `./app` save the list to `docs/app-pages.md` format with markdownlint then triage.

7: List all test its helpers and configurations in the codebase save the list to `docs/test-context.md` format with markdownlint then triage.

8: Enhance all pages,test,helpers and configurations in `docs/app-pages.md` and `docs/test-context.md`

9: List all custom components in `./components` skip all components in `./components/ui` save the list to `docs/custom-components.md` format with markdownlint then triage, then identify any custom components that can be split up into smaller dynamic generic reusable components.

10: Update all custom components in `docs/custom-components.md` ensure to create and use any reusable dynamic generic custom components and saved to `./components/layouts` ensure to verify and valid all reusable dynamic generic custom components in `./components/layouts`.

11: Update all script in the codebase to be AST-safe and enhanced with re-run in dry-run functionality.

12: Read and enhance `.opencode/commands/init-enhanced.md` include any recommendations or suggestions you may have format with markdownlint.
