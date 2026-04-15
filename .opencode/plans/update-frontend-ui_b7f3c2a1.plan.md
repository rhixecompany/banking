# Update Frontend UI — update-frontend-ui_b7f3c2a1

Goals

- Bring frontend patterns into repository standards: Server Actions, Zod schemas, and DALs.
- Create reusable UI primitives under components/layouts and reduce duplicated blocks.
- Harden tests (Vitest + Playwright) so E2E and unit suites are deterministic.
- Make scripts AST-safe and non-destructive (add --dry-run, --yes, RUN_DESTRUCTIVE gating).
- Produce evidence-backed docs for reviewers and validation logs for CI gates.
- Keep all changes local and small; do not push or open PRs without explicit approval.

Scope

- In scope:
  - Audit and update Server Actions (actions/), Zod schemas across app and components, and dal/ helpers.
  - Create new reusable components under components/layouts and refactor pages to use them.
  - Generate discovery docs: docs/app-pages.md, docs/custom-components.md, docs/test-context.md, docs/evidence_map.md.
  - Update scripts under scripts/ to add dry-run and --yes flags and ensure AST-safe edits.
  - Harden tests, add deterministic seeding for Playwright E2E, and fix flaky Vitest tests.
  - Produce validation outputs in docs/validation/.
- Out of scope:
  - Any database schema changes that require db:migrate/db:push (unless explicitly requested later).
  - Pushing to remote or creating PRs (requires explicit human approval).
  - Large UI redesigns beyond composing existing blocks into reusable components.

Target Files (high-level)

- app/\*_/_.{ts,tsx}
- components/\*_ (except components/ui/_) → focus on components/shadcn-studio/blocks/\* and components/layouts/ (new)
- components/layouts/\*\* (new)
- dal/\*\* (all .ts files)
- actions/\*\* (Server Actions)
- lib/auth.ts, lib/env.ts, lib/\* utilities
- database/schema.ts
- scripts/\*\* (TypeScript scripts; any .sh/.ps1 wrappers)
- tests/\*\*, playwright.config.ts, vitest.config.ts
- components.json, package.json
- docs/ (new/updated docs)
- .opencode/plans/ (this file)

Risks & Mitigations

- Risk: Changes break build / lint / tests.
  - Mitigation: Make small, focused commits. Run validation locally (npm run validate) and capture logs to docs/validation/. If validation fails, produce docs/issue-catalog.md with owners and severity.
- Risk: Introducing N+1 queries or DB regressions.
  - Mitigation: DAL changes must be centralized and reviewed; prefer JOINs/eager loading and add unit tests around DAL methods.
- Risk: Flaky E2E due to non-deterministic auth/test data.
  - Mitigation: Add deterministic test seeding scripts (scripts/db:seed:test --dry-run first) and ensure Playwright uses seeded test accounts in CI/local runs.
- Risk: Scripts that mutate files run accidentally.
  - Mitigation: All scripts that write must implement --dry-run and require RUN_DESTRUCTIVE=true for destructive runs.
- Risk: Large refactor touches >3 files.
  - Mitigation: This plan itself satisfies the rules; any change that touches >3 files will be staged as a separate plan/commit grouping and announced.

Planned Changes (step-by-step)

1. Pre-edit Plan (this file)
   - Artifact: .opencode/plans/update-frontend-ui_b7f3c2a1.plan.md
   - Commit message (exact): chore(plans): add update-frontend-ui_b7f3c2a1.plan.md
   - Note: Wait for approval before writing.

2. Discovery Docs (Reviewer)
   - Create docs/app-pages.md: list all app routes, file path, component type (Server/Client), and notes (uses actions/DAL?).
   - Create docs/custom-components.md: list all components under components/ excluding components/ui, exported names, typed props (if present), and triage flag (ok/needs refactor/candidate).
   - Create docs/test-context.md: inventory tests, fixtures, and test helpers.
   - Commit messages:
     - docs(app-pages): add docs/app-pages.md
     - docs(custom-components): add docs/custom-components.md
     - docs(test-context): add docs/test-context.md

3. Server Action / Zod / DAL Audit (Reviewer)
   - For each Server Action file:
     - Confirm "use server" at top, auth() is first call (for protected actions), Zod validation uses .describe() everywhere, return type Promise<{ok:boolean; error?:string}> and DAL used for writes.
   - For each DAL:
     - Confirm no queries in loops, accept optional tx, and add eager-loading helpers where needed.
   - Produce docs/review-comments.md and docs/evidence_map.md mapping each issue → file:line → recommended fix.
   - Commit: docs/review-comments.md, docs/evidence_map.md

4. Implementer Changes — Server Actions, Zod, DAL (small commits)
   - Apply fixes per reviewer findings in small commits (group by concern, <=3 files per commit where reasonable).
   - Examples of focused commits:
     - feat(actions|zod|dal): upgrade server actions, zod schemas, dal helpers
     - refactor(dal): add eager loader for <entity>
   - For each Server Action change:
     - Validate with TypeScript (npm run type-check) and lint (npm run lint:strict) locally before committing.
     - Add unit tests where relevant.

5. Create Reusable Components (components/layouts)
   - Extract common patterns from blocks into components/layouts/\* (e.g., CardGrid, MetricWidget, TransactionTableWrapper).
   - Update pages in app/ to consume new layouts; keep behavior identical.
   - Commit: refactor(components): update reusable components → components/layouts

6. Scripts Improvements
   - Update TypeScript scripts under scripts/ to be AST-safe (use ts-morph or recast where necessary) and add --dry-run, --yes flags.
   - Add wrapper docs: scripts/README.md with usage and dry-run examples.
   - Commit: scripts: make scripts AST-safe and add --dry-run

7. Tests Hardening
   - Add deterministic DB seed for tests (scripts/db:seed:test with --dry-run).
   - Update Playwright tests to use seeded auth fixtures and run with 1 worker (per repo policy).
   - Fix/remove flaky tests, standardize assertions, and add timeout adjustments where necessary.
   - Commit: test: update vitest/playwright configs and seeded fixtures

8. Validation & Artifacts
   - Run validation commands and save outputs:
     - npm run format:check → docs/validation/format-check.txt
     - npm run type-check → docs/validation/type-check.txt
     - npm run lint:strict → docs/validation/lint-strict.txt
     - npm run test:ui → docs/validation/test-ui.txt
     - npm run test:browser → docs/validation/test-browser.txt
     - npx tsx scripts/validate.ts --all → docs/validation/validate-logs.txt
   - If any step fails, add docs/issue-catalog.md with failures, affected files, severity, and suggested owners.

9. Reviewer Handoff
   - Produce docs/pr-draft.md and docs/reviewer-checklist.md summarizing changes, validation logs, and suggested review points.
   - Wait for explicit authorization to push and open PR.

Validation (commands)

- npm run format && npm run format:check
- npm run type-check
- npm run lint:strict
- npm run test:ui (ensure port 3000 is free)
- npm run test:browser
- npx tsx scripts/validate.ts --all

Save all command outputs to docs/validation/\*.txt for audit.

Rollback / Mitigation

- Work on a feature branch: update-frontend-ui/b7f3c2a1
- Each logical change is a small commit. To rollback a commit: use git revert <commit-hash> (safe, non-destructive).
- If many commits must be undone locally before pushing, create a new branch from a known-good commit and cherry-pick needed commits.
- NEVER run git reset --hard on shared branches; avoid force-pushes without explicit approval.

Timeline (estimates)

- Plan signoff: immediate (this step)
- Discovery docs: 2–4 hours
- Server Action/Zod/DAL audit: 4–8 hours
- Implementer fixes (iterative): 1–3 days (depending on audit size); each small commit followed by validation
- Component extraction & refactor: 1–2 days
- Scripts & test fixes: 1–2 days
- Full local validation: 1–2 hours (may repeat after fixes)
- Note: times assume a single engineer; parallel work (reviewer+implementer) can shorten calendar time.

Commit Strategy & Messages

- Create feature branch: update-frontend-ui/b7f3c2a1 (local only; do not push)
- Commit plan file first:
  - chore(plans): add update-frontend-ui_b7f3c2a1.plan.md
- Keep commits small and focused. Example messages:
  - docs(app-pages): add docs/app-pages.md
  - docs(custom-components): add docs/custom-components.md
  - feat(actions|zod|dal): upgrade server actions, zod schemas, dal helpers
  - refactor(components): move reusable UI to components/layouts
  - scripts: make scripts AST-safe and add --dry-run
  - test: update vitest/playwright configs and seeded fixtures
  - chore(validation): add docs/validation/\* logs

Open Questions (one at a time)

1. Do you want deterministic DB seeding included in this work (scripts/db:seed:test) or will you provide existing test-seed fixtures? (required to finalize test changes)
2. Who should be assigned as issue owners in docs/issue-catalog.md if validation fails? (default: unassigned)
3. After changes are committed locally, do you want me to run the full validation sequence automatically, or wait for your explicit "run validations" command?

Next Steps (what I will do after you approve the plan)

- If you approve this plan text, I will:
  1. Create the plan file at .opencode/plans/update-frontend-ui_b7f3c2a1.plan.md and stage/commit it locally with the exact commit message: chore(plans): add update-frontend-ui_b7f3c2a1.plan.md
  2. Generate the discovery docs (docs/app-pages.md and docs/custom-components.md) and commit them.
  3. Proceed with the audit and produce docs/review-comments.md and docs/evidence_map.md.
- Note: I will NOT push or open a PR at any point without your explicit approval.

Please review the plan above and tell me one action:

- Reply "approve" to confirm the plan as-is (then I will create & commit the plan file), OR
- Reply "edit: <section>" to request a change to a specific section (e.g., "edit: Risks — add [X]"), OR
- Ask a clarifying question about any part of the plan (I will answer and then apply your requested edit).

(Ask your response as a single sentence: approve / edit: <section> / question: <text>.)
