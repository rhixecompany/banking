---
plan name: root-ts-audit
plan description: Fix root config bugs
plan status: active
---

## Idea

Fix 17 bugs across 7 root-level .ts/.config.ts files: vitest (tsconfigPaths plugin), drizzle (invalid pool, redundant filter), sitemap (wrong env var, missing type, admin not excluded), prettier (empty tailwind, duplicate JSON), app-config (schema mismatch, JSDoc stubs), playwright (dead code, redundant undefined), lint-staged (broken check+fix chain), next (compress disabled). Run full validation after.

## Implementation

- Fix vitest.config.ts — remove resolve.tsconfigPaths: true, import and register vite-tsconfig-paths plugin
- Fix drizzle.config.ts — remove invalid pool from dbCredentials, remove redundant tablesFilter: undefined, fix misleading comment
- Fix next-sitemap.config.ts — change NEXT_PUBLIC_API_URL to NEXT_PUBLIC_SITE_URL, import IConfig, annotate export, add admin paths to exclude, fix transform param type
- Fix .prettierrc.ts — remove tailwindConfig: "", consolidate duplicate JSON override blocks
- Fix app-config.ts — change NEXTAUTH_SECRET and ENCRYPTION_KEY from .optional() to .min(1), fill JSDoc description stubs
- Fix playwright.config.ts — remove dead commented dotenv import block, simplify process.env.CI ?? undefined
- Fix .lintstagedrc.ts — replace format:check && format:markdown:fix with format:markdown:fix alone
- Fix next.config.ts — change compress: false to compress: true
- Run pre-PR validation: bun run format && bun run type-check && bun run lint:strict && bun run verify:rules

## Required Specs

<!-- SPECS_START -->
<!-- SPECS_END -->
