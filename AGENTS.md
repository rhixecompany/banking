# AGENTS

## Start Here

- This repo uses Bun as the package manager. Use `bun install` and `bun run <script>` by default. The lockfile is `bun.lock` and `package.json` declares `packageManager: bun@1.3.13`.
- `opencode.json` auto-loads this file plus `architecture.md`, `tech-stack.md`, `coding-standards.md`, `folder-structure.md`, `exemplars.md`, `.github/copilot-instructions.md`, and `.cursorrules`. Keep this file short and avoid duplicating those docs.

## Commands That Matter

- Dev server: `bun run dev`
- Build: `bun run build`
- Typecheck: `bun run type-check`
- Lint: `bun run lint:strict`
- Format: `bun run format`
- Rules check: `bun run verify:rules`
- Unit tests: `bun run test:browser`
- E2E tests: `bun run test:ui`
- Full validation: `bun run validate`
- Single Vitest file: `bun exec vitest run tests/path/to/file.test.ts --config=vitest.config.ts`
- Single Playwright spec: `bunx playwright test tests/e2e/path/to/spec.ts --project=chromium`

## Scripts Pattern

Shell scripts in `scripts/` are **orchestrators** — they MUST only call TypeScript or CLI tools. All logic lives in `scripts/ts/`.

Pattern:
- Shell script: `bunx tsx scripts/ts/<path>.ts`
- No embedded logic in shell scripts
- package.json scripts reference TS directly: `bunx tsx scripts/ts/...`

Cross-platform: Keep both `.sh` and `.ps1` for scripts that need both Unix/Windows.

## Non-Obvious Workflow Rules

- If a change touches more than 7 files, add a plan under `.opencode/commands/` before implementation. `scripts/verify-rules.ts` and CI both enforce this with exit code 2 on violations.
- Do not read `process.env` directly in app code. Use `app-config.ts` first, `lib/env.ts` only for compatibility. **Verified exception:** `proxy.ts` reads Upstash env vars directly.
- Keep `app/page.tsx` public and static. `scripts/verify-rules.ts` treats auth calls, direct env reads, and DB/DAL access on the home page as critical violations.
- All writes belong in Server Actions, not API routes. Pattern in `actions/register.ts`: `"use server"`, early auth(), Zod validation, return `{ ok, error? }`, call DAL helpers.
- UI and route components must NOT import DB clients directly. Use `dal/**` helpers exclusively.
- When loading related DB data, avoid N+1 queries. Reference: `dal/transaction.dal.ts` — fetch base rows, batch related IDs with IN clauses, map results back.

## Canonical Reference Files

These files are the authoritative implementations. Always reference them when implementing similar patterns:

| File | Pattern It Implements |
| --- | --- |
| `actions/register.ts` | Server Action with Zod validation, auth, { ok, error? } return |
| `dal/transaction.dal.ts` | N+1 prevention with batch fetching |
| `dal/user.dal.ts` | User CRUD with profile relations |
| `lib/auth-options.ts` | NextAuth v4 JWT configuration |
| `lib/auth.ts` | Server-side session helper |
| `database/schema.ts` | Drizzle ORM schema definitions |

## Testing Patterns

- **Mock tokens:** Use tokens starting with `seed-`, `mock-`, or `mock_` to skip Plaid API calls. See `lib/plaid.ts` (`isMockAccessToken()`).
- **E2E seed user:** `seed-user@example.com` / `password123`
- **Port guard:** Always free port 3000 before running tests:

```powershell
$pids = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
if ($pids) { $pids | ForEach-Object { Stop-Process -Id $_ -Force } }
```

## Architecture Snapshot

- Main app: Next.js 16 App Router with Server Components by default.
- Important runtime flags in `next.config.ts`: `cacheComponents: true`, `typedRoutes: true`, `reactCompiler: true`, `output: "standalone"`.
- Main boundaries:
  - `app/`: routes and server wrappers
  - `actions/`: mutations
  - `dal/`: database reads/writes
  - `database/`: Drizzle schema and DB client
  - `components/`: presentational/UI code

## Test Infrastructure

- `vitest.config.ts` only includes `tests/unit/**/*.test.{ts,tsx,js,jsx}`.
- Playwright is stateful: `workers: 1`, `fullyParallel: false`, starts app via `bun run dev` from `playwright.config.ts`.
- `bun run test:ui` sets `PLAYWRIGHT_PREPARE_DB=true`. `tests/e2e/global-setup.ts` runs `bun run db:push` and `bun run db:seed -- --reset` if DB not prepared.
- E2E requires reachable Postgres `DATABASE_URL`, plus `ENCRYPTION_KEY` and `NEXTAUTH_SECRET`.

## Verification Order

- Preferred local check sequence for app changes: `bun run format && bun run type-check && bun run lint:strict && bun run verify:rules`
- Use `bun run build` and `bun run test` when the change affects runtime behavior, routing, auth, or persistence.

## Pre-Commit Hooks

The repo uses Husky (configured in `.husky/`). On `git commit`, hooks run automatically. Key hooks:
- `verify-rules.ts` — AST-based policy enforcement (same as CI)
- `lint-staged` — Format and lint only staged files
- Do not bypass hooks with `--no-verify` unless explicitly instructed by the user.

## Learned User Preferences

- When the user provides an attached implementation plan with existing todos, execute the plan as written, do not edit the plan file, and progress existing todos in order while working.

## Learned Workspace Facts

- The repo already enforces clearing listeners on port `3000` before Playwright/Vitest runs through the always-applied test runner guard rule.

## Repository Map

A full codemap is available at `codemap.md` in the project root.

Before working on any task, read `codemap.md` to understand:

- Project architecture and entry points
- Directory responsibilities and design patterns
- Data flow and integration points between modules

For deep work on a specific folder, also read that folder's `codemap.md`.

## Plugins

This repo uses Cursor/opencode plugins for specialized agent capabilities.

### Installed Plugins

| Plugin | Version | Description |
| --- | --- | --- |
| `create-plugin` | 739bb28f | Meta workflows for creating Cursor plugins that are marketplace-ready |
| `continual-learning` | 739bb28f | Automatically keeps `AGENTS.md` up to date from transcript changes |
| `context7-plugin` | 58a36cea | Fetches current documentation directly from source repositories (Context7 MCP) |
| `pr-review-canvas` | 739bb28f | Renders PR diffs as interactive Cursor Canvas |
| `docs-canvas` | 739bb28f | Renders documentation as navigable Cursor Canvas |
| `figma` | 35d0f6de | Figma design handoff and inspection |
| `sentry` | d4b4035d | Sentry error tracking and monitoring |
| `redis` | 4eaff191 | Redis cache management |
| `vercel` | 3d9d9cd0 | Vercel deployment integration |
| `exa` | 0c6bb4c0 | Exa web search and content extraction |
| `parallel` | db86c809 | Parallel execution workflows |
| `superpowers` | b7a8f769 | Complete software development workflow (brainstorming, TDD, plans, subagents) |

### Superpowers Plugin (Primary)

Superpowers provides the main agent workflow. Skills trigger automatically based on context:

| Skill | Purpose |
| --- | --- |
| `brainstorming` | Socratic design refinement before writing code |
| `using-git-worktrees` | Creates isolated workspace on new branch |
| `writing-plans` | Detailed implementation plans (2-5 min tasks) |
| `subagent-driven-development` | Fast iteration with two-stage review |
| `executing-plans` | Batch execution with checkpoints |
| `test-driven-development` | RED-GREEN-REFACTOR cycle |
| `systematic-debugging` | 4-phase root cause process |
| `requesting-code-review` | Pre-review checklist |
| `receiving-code-review` | Responding to feedback |
| `finishing-a-development-branch` | Merge/PR decision workflow |
| `dispatching-parallel-agents` | Concurrent subagent workflows |
| `writing-skills` | Create new skills following best practices |

### Other Plugins

| Plugin | Components |
| --- | --- |
| `context7-plugin` | MCP server for Context7 docs, `docs-researcher` agent, `/context7:docs` command |
| `create-plugin` | `plugin-architect` agent, `create-plugin-scaffold` skill, `create-plugin` command |

## Skills

Skills provide specialized instructions for specific tasks. Use `skill` tool to load.

### Banking App Skills

| Skill | Purpose |
| --- | --- |
| `agent-governance` | Governance patterns for AI agents (policy, trust scoring, audit trails) |
| `agentic-eval` | Self-improvement through iterative evaluation and refinement |
| `auth-skill` | NextAuth v4 patterns, session helper, protected routes |
| `babysit` | Keep PR merge-ready by triaging comments and fixing CI |
| `cartography` | Generate hierarchical codemaps for unfamiliar repos |
| `code-philosophy` | The 5 Laws of Elegant Defense (internal logic philosophy) |
| `code-review` | Comprehensive code review methodology |
| `create-hook` | Create Cursor hooks with event handling |
| `create-rule` | Create Cursor rules for persistent AI guidance |
| `create-skill` | Scaffold new Agent Skills for Cursor |
| `create-subagent` | Create custom subagents for specialized tasks |
| `create-web-form` | Robust web forms with validation |
| `dal-skill` | Drizzle ORM and Data Access Layer patterns |
| `db-skill` | Drizzle ORM patterns (schema, migrations, N+1 prevention) |
| `deployment-skill` | Vercel, Railway, Docker deployment |
| `dwolla-skill` | Dwolla API for ACH transfers |
| `frontend-philosophy` | Visual & UI philosophy (5 Pillars of Intentional UI) |
| `gh-cli` | GitHub CLI reference |
| `git-commit` | Conventional commits with intelligent staging |
| `github-issues` | Create/manage GitHub issues via MCP |
| `make-skill-template` | Create skill templates for Cursor |
| `meeting-minutes` | Generate concise meeting minutes |
| `mcp-cli` | MCP server CLI interface |
| `nuget-manager` | Safe NuGet package management |
| `plan-protocol` | Plan creation and management guidelines |
| `plan-review` | Plan quality review criteria |
| `plans-and-specs` | Planning tools (createPlan, readPlan, submitPlan) |
| `prd` | Generate high-quality Product Requirements Documents |
| `refactor` | Surgical code refactoring guidance |
| `security-skill` | Encryption, environment handling, secrets |
| `server-action-skill` | Next.js Server Actions patterns |
| `session-logger` | Log agent session activity for audit |
| `shadcn` | shadcn/ui component management |
| `simplify` | Simplify code for clarity |
| `snippets` | Create, edit, manage code snippets |
| `testing-skill` | Vitest (unit) and Playwright (E2E) patterns |
| `ui-skill` | shadcn/ui components and Tailwind CSS |
| `validation-skill` | Zod schema validation patterns |
| `verification-before-completion` | Verify work is complete before claiming |
| `vscode-ext-commands` | VS Code extension commands |
| `vscode-ext-localization` | VS Code extension localization |

### Shell Skill

| Skill   | Purpose                         |
| ------- | ------------------------------- |
| `shell` | Execute shell commands directly |

## Tools

Tools organized by category. All tools are available in opencode.

### File System Tools

- `read` / `filesystem_read_text_file` - Read file contents
- `write` / `filesystem_write_file` - Create/overwrite files
- `edit` / `filesystem_edit_file` - Line-based edits with diff
- `glob` / `filesystem_search_files` - Pattern-based file search
- `grep` - Content search with regex
- `filesystem_read_file` / `filesystem_read_text_file` / `filesystem_read_media_file` - Read files
- `filesystem_read_multiple_files` - Batch read
- `filesystem_create_directory` - Create directories
- `filesystem_list_directory` - List directory contents
- `filesystem_directory_tree` - Recursive tree view
- `filesystem_move_file` - Move/rename files
- `filesystem_get_file_info` - Get file metadata
- `filesystem_list_directory_with_sizes` - List with sizes
- `filesystem_list_allowed_directories` - Show accessible dirs

### Web Tools

- `websearch` - Web search (Exa AI)
- `webfetch` - Fetch URL content as markdown
- `codesearch` - Search code examples via Exa Code API
- `youtube_transcript_get_transcript` - YouTube transcript extraction

### GitHub Tools (MCP)

- `github_agentic_workflows_search_repositories` - Search repos
- `github_agentic_workflows_get_file_contents` - Get file/dir contents
- `github_agentic_workflows_create_or_update_file` - Create/update file
- `github_agentic_workflows_push_files` - Push multiple files
- `github_agentic_workflows_create_repository` - Create repo
- `github_agentic_workflows_create_pull_request` - Create PR
- `github_agentic_workflows_create_issue` - Create issue
- `github_agentic_workflows_list_commits` - List commits
- `github_agentic_workflows_list_issues` - List issues
- `github_agentic_workflows_list_pull_requests` - List PRs
- `github_agentic_workflows_get_pull_request` - Get PR details
- `github_agentic_workflows_get_pull_request_files` - Get changed files
- `github_agentic_workflows_get_pull_request_status` - Get CI status
- `github_agentic_workflows_merge_pull_request` - Merge PR
- `github_agentic_workflows_create_branch` - Create branch
- `github_agentic_workflows_fork_repository` - Fork repo
- `gh_grep_search_github` - Search code on GitHub

### Context7/Exa Tools

- `context7_resolve_library_id` - Resolve library to Context7 ID
- `context7_query_docs` - Query Context7 documentation
- `exa_web_search_exa` - Search the web
- `exa_web_fetch_exa` - Fetch web page content

### Playwright Browser Tools

- `playwright_browser_navigate` - Navigate to URL
- `playwright_browser_snapshot` - Accessibility snapshot
- `playwright_browser_click` - Click element
- `playwright_browser_type` - Type text
- `playwright_browser_screenshot` - Take screenshot
- `playwright_browser_fill_form` - Fill form fields
- `playwright_browser_network_requests` - Network monitoring
- `playwright_browser_console_messages` - Console logs
- `playwright_browser_wait_for` - Wait for text/element
- `playwright_browser_evaluate` - Run JS in browser
- `playwright_browser_tabs` - Manage browser tabs
- `playwright_browser_drag` - Drag and drop
- `playwright_browser_hover` - Hover element
- `playwright_browser_select_option` - Select dropdown option

### Next.js DevTools (MCP)

Next.js 16+ exposes MCP at `/_next/mcp` automatically when dev server runs. Use these tools to query the running app:

- `next_devtools_init` - Initialize Next.js MCP context (call first in Next.js sessions)
- `next_devtools_nextjs_index` - Discover running Next.js servers and list available tools
- `next_devtools_nextjs_call` - Call MCP tools on running server (get errors, routes, diagnostics)
- `next_devtools_nextjs_docs` - Fetch Next.js documentation by path
- `next_devtools_browser_eval` - Browser automation via Playwright

### shadcn UI Tools

- `shadcn_get_project_registries` - Get component registries
- `shadcn_search_items_in_registries` - Search components
- `shadcn_view_items_in_registries` - View component details
- `shadcn_get_item_examples_from_registries` - Get usage examples
- `shadcn_get_add_command_for_items` - Get add commands
- `shadcn_list_items_in_registries` - List registry items
- `shadcn_get_audit_checklist` - Audit new components

### Hostinger Tools (VPS/Hosting/Domain)

- **VPS**: `hostinger_vps_list_virtual_machines`, `hostinger_vps_get_virtual_machine_details`, `hostinger_vps_create_snapshot`, `hostinger_vps_restore_snapshot`, `hostinger_vps_start_virtual_machine`, `hostinger_vps_stop_virtual_machine`, `hostinger_vps_restart_virtual_machine`
- **Docker Compose**: `hostinger_vps_create_new_project`, `hostinger_vps_update_project`, `hostinger_vps_delete_project`, `hostinger_vps_start_project`, `hostinger_vps_stop_project`, `hostinger_vps_restart_project`, `hostinger_vps_get_project_logs`
- **Firewall**: `hostinger_vps_create_new_firewall`, `hostinger_vps_get_firewall_list`, `hostinger_vps_sync_firewall`, `hostinger_vps_activate_firewall`, `hostinger_vps_deactivate_firewall`
- **Hosting**: `hostinger_hosting_list_orders`, `hostinger_hosting_list_websites`, `hostinger_hosting_create_website`, `hostinger_hosting_deploy_wordpress_website`, `hostinger_hosting_deploy_wordpress_plugin`, `hostinger_hosting_deploy_wordpress_theme`, `hostinger_hosting_deploy_js_application`, `hostinger_hosting_deploy_static_website`
- **Domain**: `hostinger_domains_check_domain_availability`, `hostinger_domains_get_domain_list`, `hostinger_domains_purchase_new_domain`, `hostinger_domains_update_domain_nameservers`, `hostinger_domains_enable_domain_lock`, `hostinger_domains_disable_domain_lock`
- **DNS**: `hostinger_dns_get_dns_records`, `hostinger_dns_update_dns_records`, `hostinger_dns_delete_dns_records`, `hostinger_dns_reset_dns_records`, `hostinger_dns_validate_dns_records`, `hostinger_dns_get_dns_snapshot_list`, `hostinger_dns_get_dns_snapshot`, `hostinger_dns_restore_dns_snapshot`
- **Billing**: `hostinger_billing_get_catalog_item_list`, `hostinger_billing_get_payment_method_list`, `hostinger_billing_set_default_payment_method`, `hostinger_billing_delete_payment_method`
- **Email Marketing**: `hostinger_reach_list_contacts`, `hostinger_reach_create_a_new_contact`, `hostinger_reach_delete_a_contact`, `hostinger_reach_list_segments`, `hostinger_reach_list_contact_groups`

### Session & Brainstorming Tools

- `start_session` - Start interactive session
- `end_session` - End session
- `pick_one` / `pick_many` - Multiple choice questions
- `confirm` - Yes/No confirmation
- `ask_text` - Text input
- `ask_code` - Code input
- `ask_image` / `ask_file` - File uploads
- `show_options` - Options with pros/cons
- `show_plan` - Plan review
- `show_diff` - Diff review
- `get_answer` / `get_next_answer` - Get answers
- `create_brainstorm` - Start brainstorm session
- `await_brainstorm_complete` - Wait for completion
- `get_session_summary` - Get session findings
- `end_brainstorm` - End brainstorm

### Planning Tools

- `createPlan` - Create implementation plan
- `readPlan` - Read plan with specs
- `submitPlan` - Submit for review
- `appendSpec` - Link spec to plan
- `markPlanDone` - Mark complete
- `get_available_skills` - List available skills
- `skill` - Load skill

### Memory & Knowledge Tools

- `memory_list` - List memory blocks
- `memory_set` - Create/update memory block
- `memory_replace` - Replace in memory
- `memory_create_entities` - Create knowledge graph entities
- `memory_create_relations` - Create relations
- `memory_add_observations` - Add observations
- `memory_search_nodes` - Search knowledge graph
- `memory_open_nodes` - Open nodes by name
- `memory_read_graph` - Read full graph

### OpenCode Sync Tools

- `opencode_sync` - Sync config with GitHub repo

### Utility Tools

- `bash` - Execute shell commands
- `task` - Launch subagent for complex tasks
- `submit_plan` - Submit markdown plan
- `todowrite` - Create task list
- `sc_update` - Update project SKILL files
- `sc_init` - Initialize project SKILL files
- `quota_status` - Check AI quota usage
- `mystatus` - Account quota status
- `getBackgroundProcess` / `listBackgroundProcesss` - Background tasks
- `createBackgroundProcess` - Run command in background
- `killTasks` - Kill background tasks
- `safe_bash` / `security_bash_bash_security_plugin` - Safe shell execution
- `sequential_thinking_sequentialthinking` - Dynamic problem solving
- `agent_attribution` - Get agent attribution
- `handoff_session` - Session handoff
- `read_session` - Read session transcript
- `workspaces` / `worktree` / `devcontainer` - Workspace management

## Plans

Implementation plans tracked in `.opencode/commands/`. Read with `readPlan` tool.

| Plan | Description |
| --- | --- |
| `cleanup-dead-code` | Cleanup dead code and duplicate tests |
| `convert-scripts` | Convert scripts to TypeScript |
| `docker-production-deploy` | Deploy Banking app with Docker Compose |
| `enhance-agents-md` | Enhance AGENTS.md with plugins, skills, tools |
| `enhance-pages` | Enhance pages, layouts, scripts, MCP |
| `enhanced-readme` | Sync code, docs, README |
| `fix-lint-strict` | Automated and manual lint fixes |
| `instruction-files-enhancement` | Enhance instruction files |
| `markdown-docs-consolidation` | Docs catalog and lint |
| `nextjs-page-refactor` | Next.js DRY, Test Hardening |
| `opencode-plugin-audit` | Audit plugins and MCP auth |
| `opencode-tools-debug` | Stabilize agent tooling stack |
| `playwright-e2e-fix` | UI suite reliability work |
| `root-group-next` | Server wrappers + tests |
| `root-group-refactor` | Refactor root pages to server wrappers |
| `session-logger-hook` | Integrate session-logger skill hooks |
| `skill-audit-fix` | Skill audit fix implementation |
| `skill-review-fix` | Review and fix skill files |
| `test-fix-iter` | Run tests iteratively and fix in batches |

## Key Resources

- Full skills list: `get_available_skills` tool
- Plugin READMEs: `.opencode/plugins/*/README.md`
- Superpowers docs: `.opencode/plugins/superpowers/b7a8f76985f1e93e75dd2f2a3b424dc731bd9d37/`
- Context7 docs: Use `context7_resolve_library_id` tool
