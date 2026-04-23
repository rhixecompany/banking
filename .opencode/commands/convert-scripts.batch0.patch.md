Batch 0 patch summary

Files added:

- scripts/ts/utils/cli.ts
- scripts/ts/utils/ast.ts
- scripts/ts/utils/fs-safe.ts
- scripts/ts/entrypoints/deploy-cli.ts
- scripts/ts/entrypoints/opencode-mcp-cli.ts
- scripts/ts/entrypoints/run-verify-and-validate-cli.ts
- scripts/ts/tools/discover-app-pages.ts

Files updated:

- scripts/codemod/find-process-env.ts (now uses ts-morph + dry-run/apply)
- scripts/codemod/run-codemod.ts (runs tsx or imports module)
- scripts/opencode-mcp.{sh,ps1,bat} wrapper updated to call tsx entrypoint
- scripts/provenance/generate-provenance.ts (now logs to .beads/provenance.log)
- scripts/run-verify-and-validate.ts (added dry-run support via CLI)
- package.json (various script entries updated to tsx entrypoints)
- scripts/deploy/deploy.sh/ps1/bat updated to delegate to tsx entrypoints

Files deleted:

- scripts/codemod/run-codemod.js
- scripts/codemod/find-process-env.js
- scripts/codemod/run-codemod-node.js
- scripts/provenance/generate-provenance.js
- scripts/tools/discover-app-pages.js
- scripts/utils/ci-helpers/run-with-args.js
- scripts/tools/exec-wrapper.js
- scripts/temp-write.ts

Verification steps to run locally or in CI:

- npm run format && npm run type-check && npm run lint:strict && npm run verify:rules
- npx tsx scripts/ts/codemod/find-process-env.ts --dry-run
- npx tsx scripts/ts/tools/discover-app-pages.ts --out=.opencode/commands/manifest-app-pages.json --dry-run
