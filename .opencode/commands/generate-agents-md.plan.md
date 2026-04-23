---
# Generate AGENTS.md and supporting root docs

## Goals

- Produce a repository-accurate `AGENTS.md` in project root that guides Opencode and human contributors.
- Create/update the following root docs (evidence-based): `architecture.md`, `tech-stack.md`, `coding-standards.md`, `folder-structure.md`, `exemplars.md`.
- Ensure every rule/pattern in AGENTS.md is directly supported by an existing file in the codebase and include provenance.

## Scope

- Add/Update files:
  - AGENTS.md
  - architecture.md
  - tech-stack.md
  - coding-standards.md
  - folder-structure.md
  - exemplars.md
  - .opencode/commands/generate-agents-md.plan.md (this plan)

## Target Files (to read for evidence)

- package.json (versions & scripts)
- tsconfig.json (compilerOptions)
- next.config.ts (Next.js options)
- README.md (tech stack, examples)
- scripts/seed/run.ts
- scripts/verify-rules.ts
- database/schema.ts
- dal/*.ts
- actions/*.ts
- lib/env.ts, app-config.ts
- tests/e2e/helpers/plaid.mock.ts
- tests/mocks/*, tests/fixtures/*
- scripts/**/*.{ts,sh,ps1,bat}
- .opencode/instructions/* and .cursor/rules/*

## Risks

- Including practices not fully present in the repo. Mitigation: only cite concrete files as evidence.
- Plan touches multiple files (>7). Mitigation: plan file created and kept minimal; commits will be small and focused.

## Validation

- Run formatting: `npm run format` and `npm run format:markdown:check`.
- Run type-check: `npm run type-check`.
- Run rules verification: `npm run verify:rules`.
- Ensure no code changes are introduced by these docs edits that violate repository rules.

## Rollback or Mitigation

- If CI or verify-rules fails, revert the docs commit and iterate on the failing rule references.

---

Plan created by OpenCode agent.
