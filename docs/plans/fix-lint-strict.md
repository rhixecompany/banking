---
plan name: fix-lint-strict
plan description: Automated and manual lint fixes
plan status: active
---

## Idea

Fix lint failures across repo

## Implementation

- Capture ESLint JSON report using `npm run lint:strict -- --format json --output-file .opencode/reports/eslint-report.json`.
- Run `eslint --config eslint.config.mts . --fix` and `npm run format` to apply safe auto-fixes.
- Use targeted codemods for common patterns: convert `console` → `logger`, `null` → `undefined`, `require()` → `import`, and `String#replace` → `replaceAll` where applicable. Run codemods only on files reported by ESLint.
- Manually fix remaining issues requiring judgement: a11y label associations, JSDoc corrections, empty blocks, hook deps, and super-linear regexes.
- Run `npm run format`, `npm run type-check`, `npm run lint:strict` and `npm run verify:rules`. Iterate until clean.
- Create small, focused commits grouped by change type. If more than 7 files will be changed, add a plan file in `.opencode/commands/` first.
- Open PR with provenance lines and request a high-risk code review for regex and process.env changes.

## Required Specs

<!-- SPECS_START -->

- enhance-pages-spec
- enhance-pages-v2
- root-tests
<!-- SPECS_END -->
