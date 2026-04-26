# Agents Context Report

Generated: 2026-04-26

## Scope

This report lists the runtime capabilities visible in this session and summarizes how each group is used in this repository.

## Tools Available to This Agent

### Core File and Code Tools

- `ReadFile`: Read file contents (including PDFs and images).
- `Glob`: Find files by glob pattern.
- `rg`: Search code/content with ripgrep semantics.
- `ApplyPatch`: Create or update one file per patch call.
- `Delete`: Delete files safely.
- `EditNotebook`: Edit or create Jupyter notebook cells.
- `ReadLints`: Read current linter diagnostics.

### Execution and Orchestration Tools

- `Shell`: Run terminal commands in a persistent shell.
- `AwaitShell`: Poll/wait for background shell tasks.
- `TodoWrite`: Manage task lists for multi-step work.
- `Subagent`: Launch specialized helper agents.
- `SwitchMode`: Request switching between Agent and Plan mode.
- `multi_tool_use.parallel`: Run independent tool calls in parallel.

### Web and External Data Tools

- `WebSearch`: Search the web for current information.
- `WebFetch`: Fetch and read content from a URL.
- `GenerateImage`: Generate image assets from prompts.
- `AskQuestion`: Collect structured multiple-choice input.

### MCP Tools

- `CallMcpTool`: Invoke MCP server tools.
- `FetchMcpResource`: Fetch read-only MCP resources.

## MCP Servers Configured

- `plugin-sentry-sentry`: Sentry workflows and incident tooling.
- `plugin-neon-postgres-neon`: Neon/Postgres integration tooling.
- `plugin-vercel-vercel`: Vercel platform integration tooling.
- `plugin-exa-exa`: Exa search and extraction tooling.
- `plugin-context7-plugin-context7`: Library/framework docs retrieval.
- `plugin-figma-figma`: Figma design and code-connect tooling.
- `plugin-shadcn-shadcn`: shadcn/ui component tooling.
- `plugin-stripe-stripe`: Stripe integration tooling.

## Skills Available

### Repository and Standards Skills

- `banking-agent-standards`: Enforces Banking app coding constraints.
- `continual-learning` (attached in this chat): Delegates memory updates.

### Cursor Core Workflow Skills

- `babysit`
- `canvas`
- `create-hook`
- `create-rule`
- `create-skill`
- `split-to-prs`
- `statusline`
- `update-cursor-settings`

### Superpowers Workflow Skills

- `brainstorming`
- `dispatching-parallel-agents`
- `executing-plans`
- `finishing-a-development-branch`
- `receiving-code-review`
- `requesting-code-review`
- `subagent-driven-development`
- `systematic-debugging`
- `test-driven-development`
- `using-git-worktrees`
- `using-superpowers`
- `verification-before-completion`
- `writing-plans`
- `writing-skills`

### Plugin and Ecosystem Skills

- `context7-mcp`
- `create-plugin-scaffold`
- `review-plugin-submission`
- `docs-canvas`
- `exa-best-practices`
- `exa-fetch`
- `exa-web-search`
- `figma-code-connect`
- `figma-create-design-system-rules`
- `figma-generate-design`
- `figma-generate-library`
- `figma-implement-design`
- `figma-use`
- `parallel-data-enrichment`
- `parallel-deep-research`
- `parallel-web-extract`
- `parallel-web-search`
- `pr-review-canvas`
- `redis-development`
- `sentry-feature-setup`
- `sentry-sdk-setup`
- `sentry-workflow`
- `shadcn` (two installed variants are present)
- `stripe-best-practices`
- `upgrade-stripe`

### Vercel Skill Set

- `ai-gateway`
- `ai-sdk`
- `auth`
- `bootstrap`
- `chat-sdk`
- `deployments-cicd`
- `env-vars`
- `knowledge-update`
- `marketplace`
- `next-cache-components`
- `next-forge`
- `next-upgrade`
- `nextjs`
- `react-best-practices`
- `routing-middleware`
- `runtime-cache`
- `shadcn` (Vercel flavor)
- `turbopack`
- `vercel-agent`
- `vercel-cli`
- `vercel-functions`
- `vercel-sandbox`
- `vercel-storage`
- `verification`
- `workflow`

## Plugins Detected in This Workspace Context

Based on enabled MCP servers and cached plugin skills/rules:

- Context7 plugin ecosystem.
- Exa plugin ecosystem.
- Figma plugin ecosystem.
- Neon plugin ecosystem.
- Parallel plugin ecosystem.
- Redis development plugin ecosystem.
- Sentry plugin ecosystem.
- shadcn plugin ecosystem.
- Stripe plugin ecosystem.
- Vercel plugin ecosystem.
- Cursor create-plugin and docs-canvas ecosystems.

## Hooks and Hook-Related Context

- Hook state files are present under `.cursor/hooks/state/`.
- A continual-learning state file is present:
  - `.cursor/hooks/state/continual-learning.json`
- An incremental continual-learning index is present:
  - `.cursor/hooks/state/continual-learning-index.json`
- A hook authoring skill is available: `create-hook`.

## High-Level Summary

- This agent has broad local coding capability (read/search/edit/execute), plus orchestration for subagents and parallel tool calls.
- The workspace is configured with strong MCP coverage for docs, cloud, observability, payments, data, and UI systems.
- Skill coverage is extensive, with dedicated workflows for planning, debugging, verification, review, and repository standards compliance.
- Hook and continual-learning state are present, enabling persistent memory updates across sessions.
