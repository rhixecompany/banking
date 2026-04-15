# Draft: Refactor Frontend UI

## Requirements (confirmed)

- Refactor Frontend ui per setupTasks.md (tasks 1-9). Key items copied from repo: audit Actions, Zod schemas, DALs; list app pages and custom components; update components into reusable dynamic layouts; harden tests (Vitest + Playwright); review and improve scripts under ./scripts.

## Technical Decisions (tentative)

- No code-modifying decisions made yet. Will follow repository patterns discovered by background exploration (search in progress: bg_9253ec0a).

## Research / Current state

- Background exploration task launched (task_id: bg_9253ec0a) to inventory package.json, tsconfig, app/ or src/, components, components.json, shadcn usage, testing infra, Playwright config, dal/, database schema, scripts/, and other repo patterns.

## Open Questions (need user input)

1. Which persona should I adopt for this session? Options: "developer (implementer)", "reviewer (audit)", "ops/CI". (Recommended: reviewer first.)
2. Do I have permission to modify files in the repo (create commits / implement), or should I only propose changes and generate patches/plans? Options: "Can modify files" or "Propose only".
3. Which task should be first priority from setupTasks.md? Options: (A) Audit Actions/Zod/DALs, (B) List app pages & components, (C) Harden tests, (D) Update scripts. (Recommended default: A — Audit Actions/Zod/DALs.)

## Scope boundaries

INCLUDE: Static analysis, inventories, audit reports, decision-complete work plans saved to .sisyphus/plans/\*.md, and draft updates. EXCLUDE: Any code changes until you explicitly grant permission to modify files.

## Next steps (after your answers)

1. Wait for your persona + permission + priority choices.
2. When provided, collect background exploration output and present a concise set of clarifying questions (if any discoverable facts remain).
3. Run Clearance Checklist and generate a decision-complete plan at .sisyphus/plans/refactor-frontend-ui.md.

## Notes

- I launched an exhaustive search in parallel (explore agents) to map repo patterns before asking further questions — this avoids trivial clarifying questions. Do NOT answer questions that can be discovered in the repo; instead, answer only the three preference questions above so I can proceed.
