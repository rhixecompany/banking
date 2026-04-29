---
plan name: enhanced-readme
plan description: Sync code, docs, README
plan status: done
---

## Idea

Bring the project’s documentation and claims back in sync with the actual codebase, then implement the missing product features that the README promises (or that we decide are required) so contributors and deployers have a reliable source of truth. This includes: auditing current README/template content vs implemented routes/features, fixing inconsistencies (Bun vs npm, env file names, protected routes, scripts), implementing missing app/product features in code with tests, updating docs under `docs/`, and updating the README generator/template so the enhanced README is the generated output going forward.

## Implementation

- Audit current `README.md`/`templates/README.template.md` claims vs actual app routes, scripts, env setup, and integrations; produce a concrete checklist of gaps (what’s wrong, what’s missing, what’s outdated).
- Define the target README structure for dual audience (contributors + deployers): concise overview, quick start with Bun, required env + links to docs, verification commands, and minimal high-value architecture pointers; remove/replace any stale large code snippets.
- Implement missing product/code features identified in the audit (App Router routes/components, Server Actions, DAL helpers) following repo rules: no DB in UI, no direct `process.env`, writes via `actions/**`, avoid N+1 in `dal/**`.
- Add/adjust tests for the newly implemented features (unit and/or Playwright E2E as appropriate) and ensure local verification passes: `bun run format`, `bun run type-check`, `bun run lint:strict`, `bun run verify:rules` (and `bun run build` if runtime behavior changed).
- Update `docs/**` to match the new reality (env vars docs, deploy guides, screenshots links) and ensure all README links resolve to existing docs paths.
- Update the README generation pipeline so the enhanced README persists: modify `templates/README.template.md` (and `scripts/generate-readme.ts` if needed) then regenerate `README.md` via `bun run registry:generate`; confirm it produces the desired output.
- Run markdown/doc linting as configured (if present) and do a final pass for correctness (commands, file names, route paths, env var names) and consistency with `AGENTS.md`/`CONTRIBUTING.md`.

## Required Specs

<!-- SPECS_START -->

- enhance-pages-spec
- enhance-pages-v2
- root-tests
- readme-gap-features
<!-- SPECS_END -->
