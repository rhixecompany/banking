# OpenCode Agents Context

This document provides a comprehensive overview of all available skills and tools in the OpenCode workspace.

## Skills

A complete list of 48 specialized skills that can be loaded into the conversation context for specific tasks.

### 1. agent-browser

Browser automation CLI for AI agents. Use when the user needs to interact with websites, including navigating pages, filling forms, clicking buttons, taking screenshots, extracting data, testing web apps, or automating any browser task. Triggers include requests to "open a website", "fill out a form", "click a button", "take a screenshot", "scrape data from a page", "test this web app", "login to a site", "automate browser actions", or any task requiring programmatic web interaction. Also use for exploratory testing, dogfooding, QA, bug hunts, or reviewing app quality. Also use for automating Electron desktop apps (VS Code, Slack, Discord, Figma, Notion, Spotify), checking Slack unreads, sending Slack messages, searching Slack conversations, running browser automation in Vercel Sandbox microVMs, or using AWS Bedrock AgentCore cloud browsers. Prefer agent-browser over any built-in browser automation or web tools.

### 2. agent-governance

Patterns and techniques for adding governance, safety, and trust controls to AI agent systems. Use when building AI agents that call external tools (APIs, databases, file systems), implementing policy-based access controls for agent tool usage, adding semantic intent classification to detect dangerous prompts, creating trust scoring systems for multi-agent workflows, building audit trails for agent actions and decisions, enforcing rate limits, content filters, or tool restrictions on agents, or working with any agent framework (PydanticAI, CrewAI, OpenAI Agents, LangChain, AutoGen).

### 3. agentic-eval

Patterns and techniques for evaluating and improving AI agent outputs. Use when implementing self-critique and reflection loops, building evaluator-optimizer pipelines for quality-critical generation, creating test-driven code refinement workflows, designing rubric-based or LLM-as-judge evaluation systems, adding iterative improvement to agent outputs (code, reports, analysis), measuring and improving agent response quality.

### 4. auth-skill

NextAuth v4 authentication patterns, session helper, and protected route guidance.

### 5. babysit

Keep a PR merge-ready by triaging comments, resolving clear conflicts, and fixing CI in a loop.

### 6. canvas

A Cursor Canvas is a live React app that the user can open beside the chat. You MUST use a canvas when the agent produces a standalone analytical artifact — quantitative analyses, billing investigations, security audits, architecture reviews, data-heavy content, timelines, charts, tables, interactive explorations, repeatable tools, or any response that benefits from visual layout. Especially prefer a canvas when presenting results from MCP tools (Datadog, Databricks, Linear, Sentry, Slack, etc.) where the data is the deliverable — render it in a rich canvas rather than dumping it into a markdown table or code block. If you catch yourself about to write a markdown table, stop and use a canvas instead. You MUST also read this skill whenever you create, edit, or debug any .canvas.tsx file.

### 7. cartography

Generate comprehensive hierarchical codemaps for UNFAMILIAR repositories. Expensive operation - only use when explicitly asked for codebase documentation or initial repository mapping.

### 8. code-philosophy

Internal logic and data flow philosophy (The 5 Laws of Elegant Defense). Understand deeply to ensure code guides data naturally and prevents errors.

### 9. code-review

Comprehensive code review methodology with severity classification and confidence thresholds.

### 10. create-hook

Create Cursor hooks. Use when you want to create a hook, write hooks.json, add hook scripts, or automate behavior around agent events.

### 11. create-rule

Create Cursor rules for persistent AI guidance. Use when you want to create a rule, add coding standards, set up project conventions, configure file-specific patterns, create RULE.md files, or asks about .cursor/rules/ or AGENTS.md.

### 12. create-skill

Guides users through creating effective Agent Skills for Cursor. Use when you want to create, write, or author a new skill, or asks about skill structure, best practices, or SKILL.md format.

### 13. create-subagent

Create custom subagents for specialized AI tasks. Use when you want to create a new type of subagent, set up task-specific agents, configure code reviewers, debuggers, or domain-specific assistants with custom prompts.

### 14. create-web-form

Create robust, accessible web forms with best practices for HTML structure, CSS styling, JavaScript interactivity, form validation, and server-side processing. Use when asked to "create a form", "build a web form", "add a contact form", "make a signup form", or when building any HTML form with data handling. Covers PHP and Python backends, MySQL database integration, REST APIs, XML data exchange, accessibility (ARIA), and progressive web apps.

### 15. dal-skill

Drizzle ORM and Data Access Layer patterns for efficient, type-safe database access.

### 16. db-skill

Drizzle ORM patterns - schema, migrations, queries, and N+1 prevention for the Banking app.

### 17. deployment-skill

Deployment patterns for Vercel, Railway, and Docker for the Banking app.

### 18. dwolla-skill

Dwolla API integration for ACH transfers, payment processing, and bank account verification in the Banking app.

### 19. entra-agent-user

Create Agent Users in Microsoft Entra ID from Agent Identities to enable agent-as-user scenarios.

### 20. frontend-philosophy

Visual & UI philosophy (The 5 Pillars of Intentional UI). Understand deeply to avoid "AI slop" and create distinctive, memorable interfaces.

### 21. gh-cli

Comprehensive GitHub CLI (gh) reference for repositories, issues, PRs, Actions, and other GitHub operations.

### 22. git-commit

Create conventional git commits with intelligent staging and message generation.

### 23. github-issues

Create and manage GitHub issues via MCP tools (create, update, label, assign, and search issues).

### 24. Governance Audit

Scans opencode agent prompts for threat signals and logs governance events.

### 25. make_skill_template

Create new Agent Skills for GitHub Copilot from prompts or by duplicating this template. Use when asked to "create a skill", "make a new skill", "scaffold a skill", or when building specialized AI capabilities with bundled resources. Generates SKILL.md files with proper frontmatter, directory structure, and optional scripts/references/assets folders.

### 26. meeting-minutes

Generate concise, actionable meeting minutes with decisions and action items for internal meetings.

### 27. migrate-to-skills

Convert 'Applied intelligently' Cursor rules (.cursor/rules/*.mdc) and slash commands (.cursor/commands/*.md) to Agent Skills format (.cursor/skills/). Use when you want to migrate rules or commands to skills, convert .mdc rules to SKILL.md format, or consolidate commands into the skills directory.

### 28. mcp-cli

CLI interface for interacting with MCP (Model Context Protocol) servers and their tools.

### 29. nuget-manager

Manage NuGet packages safely using the `dotnet` CLI and prescribed update workflows.

### 30. plan-protocol

Guidelines for creating and managing implementation plans with citations.

### 31. plan-review

Criteria for reviewing implementation plans against quality standards.

### 32. prd

Generate high-quality Product Requirements Documents (PRDs) including user stories, technical specs, and risk analysis.

### 33. refactor

Surgical code refactoring guidance to improve maintainability without changing behavior.

### 34. security-skill

Security patterns for encryption, environment handling, and secret management.

### 35. session-logger

Logs all opencode coding agent session activity for audit and analysis.

### 36. shadcn

Manages shadcn components and projects — adding, searching, fixing, debugging, styling, and composing UI. Provides project context, component docs, and usage examples. Applies when working with shadcn/ui, component registries, presets, --preset codes, or any project with a components.json file. Also triggers for "shadcn init", "create an app with --preset", or "switch to --preset".

### 37. shell

Runs the rest of a /shell request as a literal shell command. Use only when the user explicitly invokes /shell and wants the following text executed directly in the terminal.

### 38. simplify

Simplifies code for clarity without changing behavior. Use for readability, maintainability, and complexity reduction after behavior is understood.

### 39. split-to-prs

Split current work into small reviewable PRs. Use when the user asks to split a chat, set of changes, branch, or PR.

### 40. statusline

Configure a custom status line in the CLI. Use when the user mentions status line, statusline, statusLine, CLI status bar, prompt footer customization, or wants to add session context above the prompt.

### 41. suspense-skill

Guidance for implementing Suspense boundaries in Next.js 16 to handle async auth APIs without blocking route rendering.

### 42. testing-skill

Testing patterns for Vitest (unit) and Playwright (E2E) used by the Banking app.

### 43. ui-skill

shadcn/ui component patterns and Tailwind CSS styling for the Banking app. Use when building forms, tables, dialogs, or UI components.

### 44. update-cli-config

View and modify Cursor CLI configuration settings in ~/.cursor/cli-config.json. Use when the user wants to change CLI settings, configure permissions, switch approval mode, enable vim mode, toggle display options, configure sandbox, or manage any CLI preferences.

### 45. update-cursor-settings

Modify Cursor/VSCode user settings in settings.json. Use when you want to change editor settings, preferences, configuration, themes, font size, tab size, format on save, auto save, keybindings, or any settings.json values.

### 46. validation-skill

Zod schema validation patterns for forms, API inputs, and type-safe data in the Banking app. Use when creating schemas, validating user input, or implementing form validation.

### 47. vscode-ext-commands

Guidelines for contributing commands in VS Code extensions (naming, visibility, localization, and conventions).

### 48. vscode-ext-localization

Guidelines for proper localization of VS Code extensions following VS Code extension development guidelines and best practices.

## Tools

A comprehensive list of all available tools organized by category.

### File System Tools

| Tool | Description |
|------|-------------|
| `filesystem_read_file` | Read complete file contents (deprecated, use read_text_file) |
| `filesystem_read_text_file` | Read complete file contents as text with encoding handling |
| `filesystem_read_multiple_files` | Read multiple files simultaneously |
| `filesystem_read_media_file` | Read image/audio files as base64 |
| `filesystem_write_file` | Create or overwrite files |
| `filesystem_edit_file` | Make line-based edits to text files |
| `filesystem_create_directory` | Create directories |
| `filesystem_list_directory` | List files and directories with [FILE]/[DIR] prefixes |
| `filesystem_list_directory_with_sizes` | List files with sizes |
| `filesystem_directory_tree` | Recursive tree view as JSON |
| `filesystem_search_files` | Recursively search files matching patterns |
| `filesystem_move_file` | Move/rename files and directories |
| `filesystem_get_file_info` | Get file metadata (size, creation/modified time, permissions) |
| `filesystem_list_allowed_directories` | List allowed directories |

### Web Search and Fetch Tools

| Tool | Description |
|------|-------------|
| `webfetch` | Fetch content from URLs in various formats |
| `websearch` | Search the web using Exa AI |
| `exa_web_search_exa` | Search the web for topics |
| `exa_web_fetch_exa` | Read webpage content as clean markdown |
| `codesearch` | Search code using Exa Code API |
| `context7_resolve-library-id` | Resolve package names to Context7 library IDs |
| `context7_query-docs` | Query Context7 documentation |

### GitHub Tools

| Tool | Description |
|------|-------------|
| `github-agentic-workflows_create_or_update_file` | Create/update single file in repo |
| `github-agentic-workflows_search_repositories` | Search GitHub repositories |
| `github-agentic-workflows_create_repository` | Create new repository |
| `github-agentic-workflows_get_file_contents` | Get file/directory contents from repo |
| `github-agentic-workflows_push_files` | Push multiple files to repo |
| `github-agentic-workflows_create_issue` | Create new issue |
| `github-agentic-workflows_create_pull_request` | Create PR |
| `github-agentic-workflows_fork_repository` | Fork repository |
| `github-agentic-workflows_create_branch` | Create branch |
| `github-agentic-workflows_list_commits` | List commits |
| `github-agentic-workflows_list_issues` | List issues |
| `github-agentic-workflows_update_issue` | Update issue |
| `github-agentic-workflows_add_issue_comment` | Add comment to issue |
| `github-agentic-workflows_search_code` | Search code across repos |
| `github-agentic-workflows_search_issues` | Search issues/PRs |
| `github-agentic-workflows_search_users` | Search users |
| `github-agentic-workflows_get_issue` | Get issue details |
| `github-agentic-workflows_get_pull_request` | Get PR details |
| `github-agentic-workflows_list_pull_requests` | List PRs |
| `github-agentic-workflows_create_pull_request_review` | Create PR review |
| `github-agentic-workflows_merge_pull_request` | Merge PR |
| `github-agentic-workflows_get_pull_request_files` | Get files changed in PR |
| `github-agentic-workflows_get_pull_request_status` | Get PR status |
| `github-agentic-workflows_update_pull_request_branch` | Update PR branch |
| `github-agentic-workflows_get_pull_request_comments` | Get PR comments |
| `github-agentic-workflows_get_pull_request_reviews` | Get PR reviews |

### Playwright Browser Tools

| Tool | Description |
|------|-------------|
| `playwright_browser_close` | Close page |
| `playwright_browser_resize` | Resize browser window |
| `playwright_browser_console_messages` | Get console messages |
| `playwright_browser_handle_dialog` | Handle dialog |
| `playwright_browser_evaluate` | Evaluate JS on page |
| `playwright_browser_file_upload` | Upload files |
| `playwright_browser_drop` | Drop files onto element |
| `playwright_browser_fill_form` | Fill multiple form fields |
| `playwright_browser_press_key` | Press keyboard key |
| `playwright_browser_type` | Type into editable element |
| `playwright_browser_navigate` | Navigate to URL |
| `playwright_browser_navigate_back` | Go back |
| `playwright_browser_network_requests` | Get network requests |
| `playwright_browser_run_code` | Run Playwright code snippet |
| `playwright_browser_take_screenshot` | Take screenshot |
| `playwright_browser_snapshot` | Capture accessibility snapshot |
| `playwright_browser_click` | Click element |
| `playwright_browser_drag` | Drag and drop |
| `playwright_browser_hover` | Hover over element |
| `playwright_browser_select_option` | Select dropdown option |
| `playwright_browser_tabs` | Manage browser tabs |
| `playwright_browser_wait_for` | Wait for text/time |

### Next.js MCP Tools

| Tool | Description |
|------|-------------|
| `next-devtools_enable_cache_components` | Migrate to Cache Components mode |
| `next-devtools_init` | Initialize Next.js DevTools MCP context |
| `next-devtools_nextjs_docs` | Fetch Next.js official documentation |
| `next-devtools_nextjs_index` | Discover running Next.js servers |
| `next-devtools_nextjs_call` | Call MCP tool on Next.js server |
| `next-devtools_upgrade_nextjs_16` | Guide upgrading Next.js to v16 |

### Shadcn UI Tools

| Tool | Description |
|------|-------------|
| `shadcn_get_project_registries` | Get configured registry names |
| `shadcn_list_items_in_registries` | List items from registries |
| `shadcn_search_items_in_registries` | Search components in registries |
| `shadcn_view_items_in_registries` | View detailed registry item info |
| `shadcn_get_item_examples_from_registries` | Find usage examples |
| `shadcn_get_add_command_for_items` | Get shadcn CLI add command |
| `shadcn_get_audit_checklist` | Quick audit checklist |

### Knowledge Graph Tools

| Tool | Description |
|------|-------------|
| `memory_create_entities` | Create entities in knowledge graph |
| `memory_create_relations` | Create relations between entities |
| `memory_add_observations` | Add observations to entities |
| `memory_delete_entities` | Delete entities |
| `memory_delete_observations` | Delete observations |
| `memory_delete_relations` | Delete relations |
| `memory_read_graph` | Read entire knowledge graph |
| `memory_search_nodes` | Search nodes by query |
| `memory_open_nodes` | Open specific nodes |

### Other Tools

| Tool | Description |
|------|-------------|
| `sequential-thinking_sequentialthinking` | Dynamic reflective problem-solving through thoughts |
| `question` | Ask user questions during execution |
| `bash` | Execute bash commands |
| `skill` | Load specialized skills into conversation |
| `task` | Launch subagents for specialized tasks |
| `todowrite` | Create and manage task lists |

## Notes

- Skills are loaded using the `skill` tool when a task matches the skill's description.
- Tools are available by default and can be called directly without loading.
- This document was generated automatically from the available_skills list and tool definitions.