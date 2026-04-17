# Skills Summary

This document contains expanded summaries for all loaded Agent Skills in this repository. Each entry lists: Purpose, When to Use, Key Patterns / Examples, and the skill base path.

---

## agent-governance

- Purpose: Governance, policy and audit patterns for safe agent/tool execution.
- When to use: Any system where agents call external tools, perform sensitive operations, or require audit/compliance.
- Key patterns: declarative policies (allowlist/blocklist), intent classification pre-flight, tool-level governance decorators, trust scoring with decay, append-only audit trails, and integration examples for agent frameworks (PydanticAI, CrewAI, OpenAI Agents SDK).
- Notable files / notes: Includes YAML policy examples and audit export helpers.
- Base path: .opencode/skills/agent-governance

## agentic-eval

- Purpose: Iterative self-evaluation and improvement patterns for LLM outputs.
- When to use: Quality-critical generation (code, reports), when you can define evaluation criteria or rubrics.
- Key patterns: generate → evaluate → critique → refine loops; LLM-as-judge, rubric-based scoring, code-specific test-driven refinement; structured JSON outputs for reliable parsing.
- Base path: .opencode/skills/agentic-eval

## auth-skill

- Purpose: NextAuth v4 authentication patterns and server helper usage.
- When to use: Any Server Action or server-side code that needs to authenticate/authorize requests.
- Key patterns: Use `auth()` early in Server Actions, check session.user, return stable { ok, error? } shapes for unauthenticated flows, and validate account state (isActive/isAdmin).
- Base path: .opencode/skills/auth-skill

## create-web-form

- Purpose: Practical reference for building accessible, secure web forms (HTML, CSS, JS, server-side processing).
- When to use: When adding new forms (contact, signup, payment) or implementing form validation and server processing.
- Key patterns: semantic HTML, ARIA roles, accessible labels, client+server validation, progressive enhancement, server-side examples for PHP and Python, and security best practices (HTTPS, input validation).
- Base path: .opencode/skills/create-web-form

## dal-skill

- Purpose: Data Access Layer (DAL) patterns for Drizzle ORM and N+1 prevention.
- When to use: Any DB read/write: centralize access into dal/\*, avoid per-row queries inside loops.
- Key patterns: eager JOINs, batch queries, transaction acceptance of optional tx param, small DAL surface methods (findById, create, update, delete).
- Base path: .opencode/skills/dal-skill

## db-skill

- Purpose: Drizzle ORM / Database patterns and schema notes specific to the Banking app.
- When to use: When modifying schema, writing DAL code, creating migrations, or seeding the DB.
- Key patterns: canonical table descriptions (users, wallets, transactions, recipients), migration workflow (npm run db:generate / migrate / push), explicit N+1 guidance, and using db.transaction for atomic sequences.
- Base path: .opencode/skills/db-skill

## deployment-skill

- Purpose: Deployment notes and platform-specific guidance (Vercel, Railway, Docker).
- When to use: When preparing production deploys or CI/CD; verify secrets (ENCRYPTION_KEY, NEXTAUTH_SECRET) and run `npm run build` to validate.
- Key patterns: platform env var guidance, build verification, runtime checks.
- Base path: .opencode/skills/deployment-skill

## dwolla-skill

- Purpose: Dwolla integration patterns for ACH transfers, funding sources, and webhooks.
- When to use: Implementing transfers, creating customers/funding-sources, or handling Dwolla webhooks.
- Key patterns: keep Dwolla calls in Server Actions, use dal/ for DB writes, encrypt tokens, verify webhook signatures, and follow idempotency and retry/backoff best practices.
- Base path: .opencode/skills/dwolla-skill

## entra-agent-user

- Purpose: Guidance to create Microsoft Entra agent users (Graph API) so agents can act as user identities.
- When to use: When provisioning agent users for M365 capabilities that require user tokens (mailbox, Teams) and appropriate permissions.
- Key patterns: verify agent identity type (agentIdentity), POST to /users/microsoft.graph.agentUser with identityParentId, license/usageLocation steps, and common troubleshooting notes.
- Base path: .opencode/skills/entra-agent-user

## gh-cli

- Purpose: Comprehensive GitHub CLI reference and examples for working with repos, issues, PRs, workflows, and more.
- When to use: Automating GitHub operations locally or in CI, creating PRs/issues via CLI.
- Key patterns: authentication flows, repo/pr/issue commands, workflow controls, secrets/variables, and advanced usage (graphQL, api calls, extensions).
- Base path: .opencode/skills/gh-cli

## git-commit

- Purpose: Conventional commit guidance and safe git protocols tuned to the repo rules.
- When to use: Preparing commits to the repository. Follow conventional commit types (feat, fix, docs, chore, etc.) and breaking change conventions.
- Key patterns: analyze diff to pick type/scope, stage thoughtfully, avoid committing secrets, follow Git Safety Protocol (no destructive commands, no force pushes to main, fix hook failures by new commit).
- Base path: .opencode/skills/git-commit

## github-issues

- Purpose: Templates and MCP tool guidance for creating and managing GitHub issues programmatically.
- When to use: Creating issues on behalf of users or automating triage via MCP tools.
- Key patterns: use structured templates, provide owner/labels/assignees, include reproducible steps and environment fields, and call the appropriate MCP tool with structured payloads.
- Base path: .opencode/skills/github-issues

## make-skill-template

- Purpose: Template and checklist for scaffolding new Agent Skills (SKILL.md frontmatter rules and folder layout).
- When to use: When adding a new skill under .opencode/skills/ or .agents/skills/.
- Key patterns: required frontmatter (name, description), folder layout (scripts/, references/, assets/), validation checklist (name format, description constraints), and sample SKILL.md structure.
- Base path: .opencode/skills/make-skill-template

## mcp-cli

- Purpose: Reference for calling MCP servers/tools from the CLI and inspecting schemas.
- When to use: Discovering available MCP tools and invoking them from scripts or the terminal.
- Key patterns: inspect tool schemas, call tools with JSON arguments, use -d for descriptions and --json for machine-friendly output.
- Base path: .opencode/skills/mcp-cli

## meeting-minutes

- Purpose: Strict schema and workflow for concise, actionable meeting minutes.
- When to use: Converting transcripts or raw notes to structured minutes for distribution and follow-up.
- Key patterns: Strict Minutes Schema (Metadata, Attendance, Agenda, Decisions, Action Items with owner/due date/acceptance criteria), discovery questions, and review/publish steps.
- Base path: .opencode/skills/meeting-minutes

## nuget-manager

- Purpose: Safe NuGet package management workflows using the dotnet CLI.
- When to use: Adding, removing, or updating NuGet packages in .NET projects.
- Key patterns: `dotnet add/remove package`, central version management via Directory.Packages.props, verification steps (dotnet restore) and policy to avoid direct edits except for version bumps.
- Base path: .opencode/skills/nuget-manager

## plaid-skill

- Purpose: Plaid Link and access-token exchange patterns with encryption guidance.
- When to use: Exchanging Plaid public tokens server-side, storing encrypted access tokens, and fetching transactions.
- Key patterns: server action to exchange tokens, encrypt access tokens before persisting, never expose tokens to clients.
- Base path: .opencode/skills/plaid-skill

## prd

- Purpose: Product Requirements Document template and workflow (discovery-first, measurable acceptance criteria).
- When to use: Scoping new features or products, translating stakeholder needs into technical requirements.
- Key patterns: strict PRD Schema (Executive Summary, UX & Functionality, AI requirements, Technical Specs, Risks & Roadmap), mandatory discovery questions, and success metrics.
- Base path: .opencode/skills/prd

## refactor

- Purpose: Surgical refactoring guidance: small steps, tests-first, and common code smells/fixes.
- When to use: Improving maintainability without changing behavior.
- Key patterns: extract method/class, remove duplication, replace magic numbers, introduce types, guard clauses, design patterns (strategy, chain of responsibility), and safe refactoring checklist.
- Base path: .opencode/skills/refactor

## scoutqa-test

- Purpose: ScoutQA CLI patterns for autonomous exploratory and accessibility testing of web apps.
- When to use: Automated exploratory testing, smoke tests, accessibility audits, and parallel test runs after feature work.
- Key patterns: start remote tests with CLI (capture execution ID and browser URL quickly using short timeout), run parallel tests, provide clear natural-language prompts describing goals (what to test, not how), and present results with severities and links.
- Base path: .opencode/skills/scoutqa-test

## security-skill

- Purpose: Security patterns for encryption, secret handling, and validated env access.
- When to use: Any code handling tokens, secrets, or sensitive configuration.
- Key patterns: AES-256-GCM helper usage, never log secrets, prefer app-config.ts / lib/env.ts for validated env access.
- Base path: .opencode/skills/security-skill

## server-action-skill

- Purpose: Server Action contract guidance (auth-first, Zod validation, DAL-only DB access, revalidation).
- When to use: Implementing mutations in the Next.js App Router using "use server" functions.
- Key patterns: call auth() early, validate with zod.safeParse, return { ok: boolean; error?: string }, use dal/ for DB writes, call revalidatePath/revalidateTag after success.
- Base path: .opencode/skills/server-action-skill

## session-logger

- Purpose: Hooks and recipes for logging opencode coding agent sessions and prompts for audit/debugging.
- When to use: Auditing agent activity or collecting session analytics (locally only).
- Key patterns: structured JSON logs, session start/end, prompt events, privacy controls (disable logging, ignore logs in git), and sample shell hooks.
- Base path: .opencode/skills/session-logger

## shadcn

- Purpose: shadcn/ui guidance: rules, CLI workflows, and component composition best practices.
- When to use: Adding UI components, fixing shadcn components, or maintaining style/token consistency.
- Key patterns: prefer components over custom markup, use semantic tokens, `FieldGroup` form patterns, `data-invalid`/`aria-invalid` rules, `cn()` usage, CLI `npx shadcn@latest add` flows with --dry-run/--diff for safe updates, and mapping project context fields (base, iconLibrary, tailwindVersion).
- Base path: .agents/skills/shadcn

## suspense-skill

- Purpose: Suspense boundary patterns for Next.js 16 to avoid blocking renders when using async server APIs (cookies, headers, getServerSession).
- When to use: Any route/layout that awaits auth or other async server APIs; wrap async server components in <Suspense> and provide meaningful skeletons.
- Key patterns: Suspense+async inner components, loading skeletons, handle redirects inside async components, keep boundaries high for streaming.
- Base path: .opencode/skills/suspense-skill

## testing-skill

- Purpose: Testing patterns for Vitest (unit) and Playwright (E2E) and test run order guidance.
- When to use: Authoring or running tests; remember Playwright E2E runs first then Vitest; free port 3000 before Playwright on Windows.
- Key patterns: prepare seeded DB for E2E, deterministic mocks for external APIs, single-worker Playwright configuration.
- Base path: .opencode/skills/testing-skill

## ui-skill

- Purpose: shadcn/ui + Tailwind patterns used in the Banking app for building presentational components and forms.
- When to use: Implementing buttons, inputs, cards, tables, or composing layout with Tailwind responsive utilities.
- Key patterns: form wiring with react-hook-form + zod, use Card/CardHeader composition, Suspense loading skeletons, data tables with tanstack/react-table, and project-specific Tailwind conventions.
- Base path: .opencode/skills/ui-skill

## validation-skill

- Purpose: Zod schema validation patterns and ESLint-driven rules for robust input validation.
- When to use: Defining Zod schemas for Server Actions, forms, and app-config environment validation.
- Key patterns: `.describe()` on fields, custom error messages, use `z.coerce` for form inputs, safeParse handling, and central environment validation in app-config.ts.
- Base path: .opencode/skills/validation-skill

## vscode-ext-commands

- Purpose: Patterns for contributing commands to VS Code extensions (naming, visibility, category, icon use).
- When to use: Adding or modifying contributed VS Code commands, especially for Side Bar or Command Palette integration.
- Key patterns: command metadata must include title and category, special naming for Side Bar commands, visibility via `when`, and consistent grouping for UI placement.
- Base path: .opencode/skills/vscode-ext-commands

## vscode-ext-localization

- Purpose: Guidance for localizing VS Code extension resources (package.json entries, walkthroughs, string bundles).
- When to use: Adding localization for commands, settings, walkthroughs or in-code strings.
- Key patterns: package.nls.LANGID.json for package contributions, per-markdown file localization for walkthroughs, and bundle.l10n.LANGID.json for source strings.
- Base path: .opencode/skills/vscode-ext-localization

---

Provenance — files read to prepare this summary

- .opencode/skills/agent-governance/SKILL.md — source of governance patterns and examples
- .opencode/skills/agentic-eval/SKILL.md — self-eval/refinement patterns
- .opencode/skills/auth-skill/SKILL.md — auth helper and session conventions
- .opencode/skills/create-web-form/SKILL.md — web form references and example files
- .opencode/skills/dal-skill/SKILL.md — DAL rules and examples
- .opencode/skills/db-skill/SKILL.md — DB schema and migration guidance
- .opencode/skills/deployment-skill/SKILL.md — deployment notes
- .opencode/skills/dwolla-skill/SKILL.md — Dwolla server-action patterns
- .opencode/skills/entra-agent-user/SKILL.md — Entra agent user Graph API guidance
- .opencode/skills/gh-cli/SKILL.md — GitHub CLI reference
- .opencode/skills/git-commit/SKILL.md — commit guidance and rules
- .opencode/skills/github-issues/SKILL.md — issue templates and MCP tool guidance
- .opencode/skills/make-skill-template/SKILL.md — skill scaffolding template
- .opencode/skills/mcp-cli/SKILL.md — MCP CLI reference
- .opencode/skills/meeting-minutes/SKILL.md — meeting minutes schema and workflow
- .opencode/skills/nuget-manager/SKILL.md — NuGet workflows
- .opencode/skills/plaid-skill/SKILL.md — Plaid integration patterns
- .opencode/skills/prd/SKILL.md — PRD template and discovery rules
- .opencode/skills/refactor/SKILL.md — refactor patterns and checklist
- .opencode/skills/scoutqa-test/SKILL.md — ScoutQA testing patterns
- .opencode/skills/security-skill/SKILL.md — encryption and secret handling notes
- .opencode/skills/server-action-skill/SKILL.md — Server Action contract and examples
- .opencode/skills/session-logger/SKILL.md — session logging hooks and scripts
- .agents/skills/shadcn/SKILL.md — shadcn/ui rules and CLI workflows (agent-local skill)
- .opencode/skills/suspense-skill/SKILL.md — Suspense patterns for auth in Next.js 16
- .opencode/skills/testing-skill/SKILL.md — Vitest / Playwright testing notes
- .opencode/skills/ui-skill/SKILL.md — UI component patterns for the Banking app
- .opencode/skills/validation-skill/SKILL.md — Zod validation rules and examples
- .opencode/skills/vscode-ext-commands/SKILL.md — VS Code command contribution patterns
- .opencode/skills/vscode-ext-localization/SKILL.md — VS Code localization mapping
- .opencode/skills/create-web-form/references/\* — example reference files cited by the form skill

(Each file above was read because it is the canonical SKILL.md for that skill and contains the authoritative usage patterns used to produce this summary.)

---

What I did

- Created .opencode/skills-summary.md containing expanded summaries for all loaded skills.
- I have not created a git commit. Tell me if you want me to commit this file (I will draft a conventional commit message and run the commit). If you want a commit, say `commit` and optionally provide the commit title/description.
