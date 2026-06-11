---
name: CI Debugger Workflow
overview: Execute the Banking repo’s [`scripts/run-ci-checks.sh`](scripts/run-ci-checks.sh) pipeline, triage the eight `*-report.txt` artifacts from the repo root, fix failures in a sensible order (format/type/lint/build/tests), and re-run until all steps pass—aligned with [`shacn.md`](shacn.md) but with realistic doc research and Windows execution notes.
todos:
  - id: preconditions
    content: Ensure repo root, deps installed, .env aligned; free port 3000 before test steps
    status: pending
  - id: run-ci-script
    content: Run bash ./scripts/run-ci-checks.sh (Git Bash/WSL) and capture which *-report.txt show FAIL
    status: pending
  - id: triage-fix
    content: "Triage in order: format → type-check → lint → build-debug → build → Vitest → Playwright; use targeted docs per error"
    status: pending
  - id: verify-loop
    content: Re-run run-ci-checks.sh until all steps PASS; document fixes (files + error types) for PR/commit
    status: pending
isProject: false
---

# Debugger Persona: Fix All CI Issues (`shacn.md`)

## What the script does

`[scripts/run-ci-checks.sh](scripts/run-ci-checks.sh)` runs **eight steps in sequence**, each capturing **stdout/stderr** to a file in the **current working directory** (run from the repo root):

| Step         | Command                | Report file               |
| ------------ | ---------------------- | ------------------------- |
| format-check | `npm run format:check` | `format-check-report.txt` |
| type-check   | `npm run type-check`   | `type-check-report.txt`   |
| lint-fix     | `npm run lint:fix`     | `lint-fix-report.txt`     |
| lint-strict  | `npm run lint:strict`  | `lint-strict-report.txt`  |
| build-debug  | `npm run build:debug`  | `build-debug-report.txt`  |
| test-browser | `npm run test:browser` | `test-browser-report.txt` |
| test-ui      | `npm run test:ui`      | `test-ui-report.txt`      |
| build        | `npm run build`        | `build-report.txt`        |

The script exits **non-zero** if any step fails; the summary still lists every step’s PASS/FAIL.

**Windows:** Use **Git Bash** (or WSL) from the repo root:

`bash ./scripts/run-ci-checks.sh`

Each inner command is run via `bash -lc`, which matches how `npm` scripts invoke `cross-env` and local binaries.

## Preconditions (repo rules)

- **Port 3000:** Project rules (`[.cursor/rules/kill-port-3000-before-tests.mdc](.cursor/rules/kill-port-3000-before-tests.mdc)`) require freeing port **3000** before **Vitest** and **Playwright**. The shell script does **not** do this—run the documented PowerShell snippet **before** the full CI script, or before `test-browser` / `test-ui` if you re-run only those steps.
- **Environment:** Ensure `[.env.example](.env.example)` / local `.env` matches what tests and build expect (see project docs); missing vars often show up in `build-`_ or `test-`_ reports.

## Triage order (efficient fixes)

1. **format-check** — Prettier drift; usually auto-fixed by `format:check`’s embedded `npm run format` behavior (`[package.json](package.json)` `format:check`).
2. **type-check** — `tsc --noEmit`; fix types before lint if the same files are implicated.
3. **lint-fix** / **lint-strict** — ESLint with `--max-warnings=0` on `lint:strict`; address warnings, not only errors.
4. **build-debug** then **build** — Next.js compile and prerender; catches runtime import and RSC issues.
5. **test-browser** (Vitest) then **test-ui** (Playwright) — often slowest; fix after static checks pass.

Read the **FAIL** reports first, then open the **referenced source files** for full context (as in `shacn.md` step 3).

## Documentation research (practical substitute for step 4)

`shacn.md` step 4 (“read and memorize every word”) is not actionable at scale. Use this instead:

- Map each error line to a **tool** (TypeScript, ESLint rule id, Next.js, Vitest, Playwright, Drizzle, etc.).
- Open **targeted** official docs or migration notes for **that** error (e.g. TypeScript handbook for TS errors, ESLint rule docs for rule names, Playwright trace/docs for locator/timeouts).
- Prefer fixing **root cause in code** over suppressions; follow [AGENTS.md](AGENTS.md) (no `any`, env via `[lib/env.ts](lib/env.ts)`, mutations via Server Actions, no N+1).

## Batch / parallel fixes

- Group edits by **layer** (types, then lint, then components) to reduce churn.
- Run **narrow** checks while iterating: e.g. `npm run type-check` or `npm exec vitest run <file>` instead of the full script every time.
- Reserve **full** `run-ci-checks.sh` for **verification** loops (steps 6 and 8 in `shacn.md`).

## Documentation of fixes (step 7)

Deliver a **concise fix log** (suitable for a PR description or commit body): list **affected files**, **failure type** (e.g. TS2345, ESLint rule, Playwright timeout), and **what changed**. Avoid creating new markdown files unless you explicitly want a persistent doc in-repo.

## Verification loop (steps 6 and 8)

Repeat:

1. Free port 3000 if running tests.
2. `bash ./scripts/run-ci-checks.sh` from repo root.
3. If anything fails, read the corresponding `*-report.txt`, fix, and repeat until the summary shows **all PASS** and exit code **0**.

## Optional hygiene

- CI report `*.txt` files are **not** listed in `[.gitignore](.gitignore)`; delete them after a green run or add a pattern if you want to avoid accidental commits (only if you choose to change ignore rules).

## Risks

- **Flaky E2E:** May need stable selectors, waits, or test data; use Playwright reports under `playwright-report/` / `test-results/` when `test-ui-report.txt` is insufficient.
- **Long runtime:** Full script runs format, typecheck, lint twice, two builds, Vitest, and Playwright—budget time accordingly.
