# Pages Enhancement Plan (Draft)

Status: Plan Mode — READ-ONLY draft. Will not be written until you approve.

Goal

- Sequentially audit and enhance every Next.js page in ./app. Start with Home, then Wallets, Transfers, Account (Settings), Dashboard, then remaining pages. Preserve repo patterns: Server Actions with Zod + auth(), DAL usage via dal/\*, revalidate after mutations.

Scope

- Pages: (see docs/app-pages.md)
- Components: all custom components referenced by pages (excluding ./components/ui)
- Actions: audit actions/\* for proper Zod validation, auth(), mocked short-circuits
- DAL: ensure all DB access goes through dal/\* and avoid N+1 by moving joins into DAL
- Tests: triage & harden related tests (unit & E2E) but do not run global typecheck/lint/tests until all pages are enhanced (per your constraint)

Constraints (from user / AGENTS.md)

- Plan Mode: do not modify files yet. This plan is a read-only artifact.
- Per run-tasks.txt: do not run global typecheck/lint/tests until all pages in the list are enhanced.
- Use seed runner (scripts/seed/run.ts) for E2E deterministic data (you confirmed yes).
- Put extracted reusable components in ./components/layouts.

High-Level Timeline & Estimates (rough)

- Discovery & plan creation: completed (this document). ~2–4 hours (already performed).
- Per-page enhancement (audit -> implement -> unit test): ~1–6 hours per page depending on complexity.
- Full test & lint run after all pages: 2–4 hours (depending on E2E flakiness & CI).

Branch / Commit Strategy (awaiting confirm to run)

- You told me: if proceeding, prefer working on current branch; but we remain in Plan Mode now.
- Recommendation: use feature branches per page or small grouped pages (e.g., `feat/page/home-refactor`) when switching to Implementation — this keeps PRs small.

Priority order (as you requested)

1. Home
2. My Wallets (Wallets)
3. Payment Transfer (Transfers)
4. Settings (Account)
5. Dashboard
6. Transaction History
7. Auth pages (Sign-in / Sign-up)
8. Admin
9. Any other pages discovered

Per-Page Workflow (repeat for each page)

1. Audit (read-only)
   - Open page file and its server-wrapper and client-wrapper.
   - List custom components used (exclude components/ui).
   - Identify actions imported and DAL methods called.
   - Identify Zod schemas referenced and their locations.
   - Find tests referencing the page and any fixtures used.
   - Produce a per-page audit entry (small Markdown snippet) and record files to change.

2. Plan small changes (1–3 items) — keep minimal:
   - Move any ad-hoc DB queries into dal/\* if found.
   - Ensure server actions used by the page:
     - Validate inputs with Zod and descriptive messages.
     - authenticate via auth() at top of action.
     - return stable shape: { ok: boolean; error?: string }.
     - short-circuit Plaid/Dwolla with mock detection when appropriate.
   - If a component mixes fetching + presentation, extract presentational part into components/layouts and keep fetching in server-wrapper.
   - Add/adjust unit tests for new presentational components and server action behavior.

3. Implement & verify (once Implementation Mode enabled)
   - Create minimal edits for the page's direct dependencies (aim < 10 files per PR).
   - Run local unit tests for the modified units if you allow per-PR checks; otherwise defer local runs until all pages complete (you requested strict delay).
   - Add tests where missing (unit tests for presentational pieces).

4. Post-change housekeeping
   - Add revalidatePath() or revalidateTag() calls after mutations in server actions where appropriate.
   - Update docs/app-pages.md and docs/custom-components.md to reflect refactors.

5. Mark page complete and move to next page.

Detailed Example — Home page (first-run template)

1. Audit:
   - Files to open: app/page.tsx; components/home/home-server-wrapper.tsx; components/home/home-client-wrapper.tsx; components/shared/wallets-overview.tsx; components/total-balance-box/total-balance-box.tsx; tests referencing these files.
   - Identify: any server actions called directly from client; any DAL access in components.

2. Plan:
   - If found: extract Balance / Wallets presentational components into components/layouts (e.g., components/layouts/total-balance.tsx).
   - Ensure server-wrapper uses dal/\* and server actions validate inputs with Zod + auth().

3. Implement:
   - Make small, isolated edits: move presentational pieces; update imports; add unit tests for extracted components.

4. Verify:
   - If you allow per-PR checks: run unit tests for the modified units only. Otherwise, defer full test runs.

Cross-cutting tasks (apply across pages)

- Zod normalisation:
  - Convert meta({ description }) usage to z.describe(...) where lint rules require (there is already a codemod script: scripts/transform/zod-meta-to-describe.ts).
- DAL N+1 prevention:
  - In page-level audits, detect loops that call DAL per item; if found, move to a join query in dal/\* and add a targeted unit test.
- Tests:
  - Replace any live Plaid/Dwolla calls in tests with msw or existing E2E helpers and use tests/e2e/helpers/plaid.mock.ts.
- Scripts:
  - Ensure scripts in scripts/ (seed, validate, transform) support --dry-run where appropriate (many already do); add dry-run flags where missing (follow AST-safe modifications when implementing).

Deliverables (what I will produce in Implementation Mode)

- docs/app-pages.md (finalized)
- docs/custom-components.md (finalized + triage)
- docs/test-context.md (finalized + triage)
- Per-page change lists and small PRs (one PR per page or small related group)
- Change-log mapping pages → files modified → tests updated

Acceptance criteria (for a page)

- Server actions used by the page validate inputs via Zod, call auth() (if protected), and return the stable { ok, error? } shape.
- DAL access occurs only through dal/\* with no new ad-hoc queries within components.
- Component extraction: presentation separated from data fetching and moved under components/layouts for reuse.
- Unit tests added/updated for presentational components and server actions where modifications occurred.
- E2E readiness: page's E2E tests use seeded data or mocks; Plaid/Dwolla short-circuits preserved.

Risks & mitigations

- Large refactors cause CI pain: mitigate with small per-page PRs.
- E2E flakiness due to external APIs: mitigate using Plaid/Dwolla helpers and seed runner.
- Time: some pages may require non-trivial DAL work; flag those pages and schedule separately.

Next actions (what I need from you)

1. Approve this plan (I’m in Plan Mode — no changes will be made until you explicitly permit Implementation).
2. Confirm whether you want me to:
   - (A) Create the plan file `.opencode/plans/pages_enhancement.plan.md` now (requires switching out of read-only Plan Mode), or
   - (B) Keep Plan Mode and proceed when you give the explicit go-ahead to implement changes.
3. If you approve Implementation later, confirm branch strategy (you earlier said “use current branch” when asked — I recommend feature branches).

If you approve, I will:

- Create the plan file and generate the three docs as actual files, then begin the first-page audit implementation (Home) according to the per-page workflow, producing small commits and PRs for review.

If you'd like edits to these drafts (more/less detail, different structure, additional per-page fields), tell me exactly what you'd change and I will revise the drafts in Plan Mode before any writes.
