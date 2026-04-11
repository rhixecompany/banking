<!-- HEADER -->
<div align="center">

<br>
<!-- LOGO -->
<img src="https://github.com/user-attachments/assets/aced1e8e-e6be-485a-9015-b822d01ab064" alt="Awesome Opencode" />
<br><br>

<!-- TITLE -->
<h1>Awesome Opencode</h1>

<!-- BADGES -->
<p>
<a href="https://github.com/sindresorhus/awesome"><img src="https://cdn.rawgit.com/sindresorhus/awesome/d7305f38d29fed78fa85652e3a63e154dd8e8829/media/badge.svg" height="28" alt="Awesome" /></a>
&nbsp;&nbsp;
<a href="https://github.com/anomalyco/opencode"><img src="https://img.shields.io/github/stars/anomalyco/opencode?style=social" height="28" alt="Opencode Stars" /></a>
</p>

<br>

<!-- DESCRIPTION -->
<h3>A curated list of plugins, themes, agents, and resources for <a href="https://opencode.ai/">Opencode</a>.</h3>
<h3>The AI coding agent for the terminal, built by the team at <a href="https://github.com/anomalyco">Anomaly</a>.</h3>

<br>

[**OFFICIAL**](#official) • [**PLUGINS**](#plugins) • [**THEMES**](#themes) • [**AGENTS**](#agents) • [**PROJECTS**](#projects) • [**RESOURCES**](#resources)

<br>
<hr>

</div>

<!-- CONTENT -->

<div id="official"></div>

<h3>⭐️ Official Repositories</h3>

| Project | Stars | Description |
| :-- | :-- | :-- |
| **[opencode](https://github.com/anomalyco/opencode)** | ![Stars](https://badgen.net/github/stars/anomalyco/opencode) | The official opencode AI coding agent. |
| **[opencode-sdk-js](https://github.com/anomalyco/opencode-sdk-js)** | ![Stars](https://badgen.net/github/stars/anomalyco/opencode-sdk-js) | Official JavaScript/TypeScript SDK for opencode. |
| **[opencode-sdk-go](https://github.com/anomalyco/opencode-sdk-go)** | ![Stars](https://badgen.net/github/stars/anomalyco/opencode-sdk-go) | Official Go SDK for opencode. |
| **[opencode-sdk-python](https://github.com/anomalyco/opencode-sdk-python)** | ![Stars](https://badgen.net/github/stars/anomalyco/opencode-sdk-python) | Official Python SDK for opencode. |

<br>

<div id="plugins"></div>

<details open>
<summary><strong>🧩 PLUGINS</strong></summary>
<br>

<details>
  <summary><b>Agent Identity</b> <img src="https://badgen.net/github/stars/gotgenes/opencode-agent-identity" height="14"/> - <i>Agent self-identity and per-message attribution for multi-agent sessions</i></summary>
  <blockquote>
    Two plugins that improve agent identity awareness. AgentSelfIdentityPlugin injects a one-liner into the system prompt so the model knows which agent it's operating as. AgentAttributionToolPlugin exposes a tool for querying per-message agent attribution via the SDK, useful for agents that review multi-agent sessions.
    <br><br><a href="https://github.com/gotgenes/opencode-agent-identity">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>Agent Memory</b> <img src="https://badgen.net/github/stars/joshuadavidthomas/opencode-agent-memory" height="14"/> - <i>Letta-inspired memory</i></summary>
  <blockquote>
    Gives the agent persistent, self-editable memory blocks inspired by Letta agents.
    <br><br><a href="https://github.com/joshuadavidthomas/opencode-agent-memory">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>Agent Skills (JDT)</b> <img src="https://badgen.net/github/stars/joshuadavidthomas/opencode-agent-skills" height="14"/> - <i>Dynamic skills loader</i></summary>
  <blockquote>
    Dynamic skills loader that discovers skills from project, user, and plugin directories.
    <br><br><a href="https://github.com/joshuadavidthomas/opencode-agent-skills">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>Antigravity Auth</b> <img src="https://badgen.net/github/stars/NoeFabris/opencode-antigravity-auth" height="14"/> - <i>Google Antigravity models</i></summary>
  <blockquote>
    Use Gemini and Anthropic models for free via Google Antigravity IDE authentication.
    <br><br><a href="https://github.com/NoeFabris/opencode-antigravity-auth">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>Antigravity Multi-Auth</b> <img src="https://badgen.net/github/stars/theblazehen/opencode-antigravity-multi-auth" height="14"/> - <i>Multiple Google accounts</i></summary>
  <blockquote>
    Fork of opencode-antigravity-auth that allows using multiple Google accounts with automatic rotation when rate limited.
    <br><br><a href="https://github.com/theblazehen/opencode-antigravity-multi-auth">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>Background</b> <img src="https://badgen.net/github/stars/zenobi-us/opencode-background" height="14"/> - <i>Background process management</i></summary>
  <blockquote>
    Background process management plugin for opencode.
    <br><br><a href="https://github.com/zenobi-us/opencode-background">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>Background Agents</b> <img src="https://badgen.net/github/stars/kdcokenny/opencode-background-agents" height="14"/> - <i>Async agent delegation</i></summary>
  <blockquote>
    Claude Code-style background agents with async delegation and context persistence.
    <br><br><a href="https://github.com/kdcokenny/opencode-background-agents">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>Banking</b> <img src="https://badgen.net/github/stars/awesome-opencode/opencode-banking" height="14"/> - <i>Complete banking application patterns - Auth, Plaid, Dwolla, Drizzle, shadcn/ui</i></summary>
  <blockquote>
    Opencode plugin providing agents and skills for banking application development.
Features: - **Banking Agent**: Pre-configured AI agent for banking development - **AuthSkill**: NextAuth.js patterns, session management, OAuth - **DBSkill**: Drizzle ORM, migrations, N+1 prevention - **PlaidSkill**: Bank account linking, transaction retrieval - **DwollaSkill**: ACH transfers, payment processing - **ValidationSkill**: Zod schemas for forms - **ServerActionSkill**: Mutations, form handling - **UISkill**: shadcn/ui components for banking - **SecuritySkill**: Encryption, rate limiting - **TestingSkill**: Vitest, Playwright patterns - **DeploymentSkill**: Vercel, Docker, Railway
Perfect for building production-ready banking applications.

    <br><br><a href="https://github.com/awesome-opencode/opencode-banking">🔗 <b>View Repository</b></a>

  </blockquote>
</details>

<details>
  <summary><b>Beads Plugin</b> <img src="https://badgen.net/github/stars/joshuadavidthomas/opencode-beads" height="14"/> - <i>Beads issue tracker integration</i></summary>
  <blockquote>
    Integration for Steve Yegge's beads issue tracker with /bd-* commands.
    <br><br><a href="https://github.com/joshuadavidthomas/opencode-beads">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>CC Safety Net</b> <img src="https://badgen.net/github/stars/kenryu42/claude-code-safety-net" height="14"/> - <i>Safety net catching destructive commands</i></summary>
  <blockquote>
    A Claude Code plugin that acts as a safety net, catching destructive git and filesystem commands before they execute.
    <br><br><a href="https://github.com/kenryu42/claude-code-safety-net">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>Context Analysis</b> <img src="https://badgen.net/github/stars/IgorWarzocha/Opencode-Context-Analysis-Plugin" height="14"/> - <i>Token usage analysis</i></summary>
  <blockquote>
    An opencode plugin that provides detailed token usage analysis for your AI sessions.
    <br><br><a href="https://github.com/IgorWarzocha/Opencode-Context-Analysis-Plugin">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>Devcontainers</b> <img src="https://badgen.net/github/stars/athal7/opencode-devcontainers" height="14"/> - <i>Multi-branch devcontainers</i></summary>
  <blockquote>
    Plugin for running multiple devcontainer instances with auto-assigned ports and branch-based isolation.
    <br><br><a href="https://github.com/athal7/opencode-devcontainers">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>Direnv</b> <img src="https://badgen.net/github/stars/simonwjackson/opencode-direnv" height="14"/> - <i>Load direnv variables</i></summary>
  <blockquote>
    Automatically loads direnv environment variables at session start. Perfect for Nix flakes.
    <br><br><a href="https://github.com/simonwjackson/opencode-direnv">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>Drizzle ORM</b> <img src="https://badgen.net/github/stars/awesome-opencode/opencode-drizzle" height="14"/> - <i>Drizzle ORM patterns for PostgreSQL - schema, migrations, queries, and DAL patterns</i></summary>
  <blockquote>
    Opencode plugin providing Drizzle ORM patterns for banking and production applications.
Features: - Schema definition best practices - Migration strategies - Data Access Layer (DAL) patterns - N+1 query prevention with JOINs - Type-safe queries - Relationship mapping
Essential for any PostgreSQL-based application.

    <br><br><a href="https://github.com/awesome-opencode/opencode-drizzle">🔗 <b>View Repository</b></a>

  </blockquote>
</details>

<details>
  <summary><b>Dynamic Context Pruning</b> <img src="https://badgen.net/github/stars/Tarquinen/opencode-dynamic-context-pruning" height="14"/> - <i>Optimize token usage</i></summary>
  <blockquote>
    Plugin that optimises token usage by pruning obsolete tool outputs from conversation context.
    <br><br><a href="https://github.com/Tarquinen/opencode-dynamic-context-pruning">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>Envsitter Guard</b> <img src="https://badgen.net/github/stars/boxpositron/envsitter-guard" height="14"/> - <i>Prevent .env leaks</i></summary>
  <blockquote>
    OpenCode plugin that prevents agents/tools from reading or editing sensitive .env* files, while still allowing safe inspection via EnvSitter (keys + deterministic fingerprints; never values).
    <br><br><a href="https://github.com/boxpositron/envsitter-guard">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>Froggy</b> <img src="https://badgen.net/github/stars/smartfrog/opencode-froggy" height="14"/> - <i>Hooks and specialized agents</i></summary>
  <blockquote>
    Plugin providing Claude Code-style hooks, specialized agents, and tools like gitingest.
    <br><br><a href="https://github.com/smartfrog/opencode-froggy">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>Gemini Auth</b> <img src="https://badgen.net/github/stars/jenslys/opencode-gemini-auth" height="14"/> - <i>Google account auth</i></summary>
  <blockquote>
    Authenticate the Opencode CLI with your Google account so you can use your existing Gemini plan.
    <br><br><a href="https://github.com/jenslys/opencode-gemini-auth">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>Google AI Search</b> <img src="https://badgen.net/github/stars/IgorWarzocha/Opencode-Google-AI-Search-Plugin" height="14"/> - <i>Query Google AI Mode (SGE)</i></summary>
  <blockquote>
    An opencode plugin that exposes a native tool for querying Google AI Mode (SGE).
    <br><br><a href="https://github.com/IgorWarzocha/Opencode-Google-AI-Search-Plugin">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>Handoff</b> <img src="https://badgen.net/github/stars/joshuadavidthomas/opencode-handoff" height="14"/> - <i>Session handoff prompts</i></summary>
  <blockquote>
    Creates focused handoff prompts for continuing work in a new session.
    <br><br><a href="https://github.com/joshuadavidthomas/opencode-handoff">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>Kilo Gateway Auth</b> <img src="https://badgen.net/github/stars/JungHoonGhae/opencode-kilo-auth" height="14"/> - <i>Kilo Gateway provider</i></summary>
  <blockquote>
    Adds Kilo Gateway provider support to OpenCode.
    <br><br><a href="https://github.com/JungHoonGhae/opencode-kilo-auth">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>Micode</b> <img src="https://badgen.net/github/stars/vtemian/micode" height="14"/> - <i>Brainstorm-Plan-Implement workflow</i></summary>
  <blockquote>
    Structured workflow with session continuity, subagent orchestration, git worktree isolation, and AST-aware tools.
    <br><br><a href="https://github.com/vtemian/micode">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>Model Announcer</b> <img src="https://badgen.net/github/stars/ramarivera/opencode-model-announcer" height="14"/> - <i>Model self-awareness</i></summary>
  <blockquote>
    Automatically injects the current model name into the chat context so the LLM is self-aware.
    <br><br><a href="https://github.com/ramarivera/opencode-model-announcer">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>Morph Fast Apply</b> <img src="https://badgen.net/github/stars/JRedeker/opencode-morph-fast-apply" height="14"/> - <i>10,500+ tokens/sec code editing</i></summary>
  <blockquote>
    Integrates Morph's Fast Apply API for faster code editing with lazy edit markers and unified diff output.
    <br><br><a href="https://github.com/JRedeker/opencode-morph-fast-apply">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>NextJS Dev</b> <img src="https://badgen.net/github/stars/awesome-opencode/opencode-nextjs-dev" height="14"/> - <i>Next.js 16 App Router patterns, Suspense boundaries, and async auth best practices</i></summary>
  <blockquote>
    Opencode plugin providing agents and skills for Next.js 16 development. Includes guidance on Suspense boundaries for async auth to avoid blocking route rendering, Server Actions with proper Zod validation and error handling, DAL pattern enforcement to prevent N+1 queries, Zod-based environment validation, and TypeScript strict mode compliance. Helps developers implement protected routes, authentication flows, and database connectivity following production-ready patterns.
Features: - SuspenseSkill: Handle async auth in Next.js 16 without blocking route rendering - ServerActionSkill: Zod validation, error handling, and revalidation patterns - DAL Skill: N+1 query prevention with JOIN patterns - NextJS Architect Agent: Pre-configured AI agent for code review and generation
Based on production patterns from the Banking project template.

    <br><br><a href="https://github.com/awesome-opencode/opencode-nextjs-dev">🔗 <b>View Repository</b></a>

  </blockquote>
</details>

<details>
  <summary><b>Oh My Opencode</b> <img src="https://badgen.net/github/stars/code-yeongyu/oh-my-opencode" height="14"/> - <i>Agents & Pre-built tools</i></summary>
  <blockquote>
    Background agents, pre-built tools (LSP/AST/MCP), curated agents, and a Claude Code compatible layer.
    <br><br><a href="https://github.com/code-yeongyu/oh-my-opencode">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>Oh My Opencode Slim</b> <img src="https://badgen.net/github/stars/alvinunreal/oh-my-opencode-slim" height="14"/> - <i>Lightweight agent orchestration with reduced token usage</i></summary>
  <blockquote>
    Slimmed-down fork of oh-my-opencode focused on core agent orchestration. Features specialized sub-agents (Explorer, Oracle, Librarian, Designer, etc.), background task management, LSP/AST tools, tmux integration for live agent visibility, and MCP servers. Optimized to consume significantly fewer tokens.
    <br><br><a href="https://github.com/alvinunreal/oh-my-opencode-slim">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>Omniroute Auth</b> <img src="https://badgen.net/github/stars/Alph4d0g/opencode-omniroute-auth" height="14"/> - <i>Omniroute authentication provider</i></summary>
  <blockquote>
    Connect and automatically fetch models from your Omniroute instance
    <br><br><a href="https://github.com/Alph4d0g/opencode-omniroute-auth">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>open-plan-annotator</b> <img src="https://badgen.net/github/stars/ndom91/open-plan-annotator" height="14"/> - <i>Annotate LLM plans like a Google Doc!</i></summary>
  <blockquote>
    A fully local agentic coding plugin that intercepts plan mode and opens an annotation UI in your browser. Select text to strikethrough, replace, insert, or comment — then approve the plan or request changes
    <br><br><a href="https://github.com/ndom91/open-plan-annotator">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>OpenAI Codex Auth</b> <img src="https://badgen.net/github/stars/numman-ali/opencode-openai-codex-auth" height="14"/> - <i>ChatGPT Plus/Pro OAuth</i></summary>
  <blockquote>
    This plugin enables opencode to use OpenAI's Codex backend via ChatGPT Plus/Pro OAuth authentication.
    <br><br><a href="https://github.com/numman-ali/opencode-openai-codex-auth">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>OpenCode Agent Tmux</b> <img src="https://badgen.net/github/stars/AnganSamadder/opencode-agent-tmux" height="14"/> - <i>Real-time tmux panes for OpenCode agents with auto-launch, streaming, and cleanup.</i></summary>
  <blockquote>
    Smart tmux integration for OpenCode that auto-spawns panes to stream agent output, supports flexible layouts and multi-port setups, and cleans up when sessions finish.
    <br><br><a href="https://github.com/AnganSamadder/opencode-agent-tmux">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>Opencode Canvas</b> <img src="https://badgen.net/github/stars/mailshieldai/opencode-canvas" height="14"/> - <i>Interactive terminal canvases in tmux splits</i></summary>
  <blockquote>
    Interactive terminal canvases (calendars, documents, flight booking) in tmux splits. Port of claude-canvas for OpenCode.
    <br><br><a href="https://github.com/mailshieldai/opencode-canvas">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>Opencode Ignore</b> <img src="https://badgen.net/github/stars/lgladysz/opencode-ignore" height="14"/> - <i>Ignore files based on pattern</i></summary>
  <blockquote>
    Plugin to ignore directory/file based on pattern.
    <br><br><a href="https://github.com/lgladysz/opencode-ignore">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>Opencode Mem</b> <img src="https://badgen.net/github/stars/tickernelz/opencode-mem" height="14"/> - <i>Persistent memory with vector database</i></summary>
  <blockquote>
    A persistent memory system for AI coding agents that enables long-term context retention across sessions using local vector database technology. Features dual memory scopes, web interface, auto-capture system, and multi-provider AI support.
    <br><br><a href="https://github.com/tickernelz/opencode-mem">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>Opencode Notify</b> <img src="https://badgen.net/github/stars/kdcokenny/opencode-notify" height="14"/> - <i>Native OS notifications</i></summary>
  <blockquote>
    Native OS notifications for OpenCode - know when tasks complete.
    <br><br><a href="https://github.com/kdcokenny/opencode-notify">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>OpenCode ntfy.sh</b> <img src="https://badgen.net/github/stars/lannuttia/opencode-ntfy.sh" height="14"/> - <i>Push notifications to keep you in the know, even when you're on the go.</i></summary>
  <blockquote>
    An OpenCode plugin that adds push notifications through ntfy.sh.
    <br><br><a href="https://github.com/lannuttia/opencode-ntfy.sh">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>Opencode Quota</b> <img src="https://badgen.net/github/stars/slkiser/opencode-quota" height="14"/> - <i>Quota toasts and token tracking</i></summary>
  <blockquote>
    Track quota and token usage across providers via automatic toasts and slash commands.
    <br><br><a href="https://github.com/slkiser/opencode-quota">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>Opencode Roadmap</b> <img src="https://badgen.net/github/stars/IgorWarzocha/Opencode-Roadmap" height="14"/> - <i>Strategic planning</i></summary>
  <blockquote>
    Strategic roadmap planning and multi-agent coordination plugin. Provides project-wide planning capabilities.
    <br><br><a href="https://github.com/IgorWarzocha/Opencode-Roadmap">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>Opencode Sessions</b> <img src="https://badgen.net/github/stars/malhashemi/opencode-sessions" height="14"/> - <i>Session management</i></summary>
  <blockquote>
    Session management plugin for OpenCode with multi-agent collaboration support.
    <br><br><a href="https://github.com/malhashemi/opencode-sessions">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>Opencode Skills</b> <img src="https://badgen.net/github/stars/malhashemi/opencode-skills" height="14"/> - <i>Manage skills and capabilities</i></summary>
  <blockquote>
    Plugin for managing and organising opencode skills and capabilities.
    <br><br><a href="https://github.com/malhashemi/opencode-skills">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>Opencode Snippets</b> <img src="https://badgen.net/github/stars/JosXa/opencode-snippets" height="14"/> - <i>Instant inline text expansion</i></summary>
  <blockquote>
    Instant inline text expansion for OpenCode. Type #snippet anywhere in your message and watch it transform. Brings DRY principles to prompt engineering with composable, shell-enabled snippets.
    <br><br><a href="https://github.com/JosXa/opencode-snippets">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>Opencode Synced</b> <img src="https://badgen.net/github/stars/iHildy/opencode-synced" height="14"/> - <i>Sync configs across machines</i></summary>
  <blockquote>
    Enables syncing global opencode configurations across machines with public/private visibility options.
    <br><br><a href="https://github.com/iHildy/opencode-synced">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>Opencode Workspace</b> <img src="https://badgen.net/github/stars/kdcokenny/opencode-workspace" height="14"/> - <i>Multi-agent orchestration</i></summary>
  <blockquote>
    Bundled multi-agent orchestration harness with 16 components in one install.
    <br><br><a href="https://github.com/kdcokenny/opencode-workspace">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>Opencode Worktree</b> <img src="https://badgen.net/github/stars/kdcokenny/opencode-worktree" height="14"/> - <i>Zero-friction git worktrees</i></summary>
  <blockquote>
    Zero-friction git worktrees for OpenCode. Auto-spawns terminals, syncs files, cleans up on exit.
    <br><br><a href="https://github.com/kdcokenny/opencode-worktree">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>opencode-mystatus</b> <img src="https://badgen.net/github/stars/vbgate/opencode-mystatus" height="14"/> - <i>Check AI subscription quotas</i></summary>
  <blockquote>
    Check all your AI subscription quotas in one command. Supports OpenAI (Plus/Pro/Codex, etc.), Zhipu AI, Google Antigravity, and more.
    <br><br><a href="https://github.com/vbgate/opencode-mystatus">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>opencode-plugin-otel</b> <img src="https://badgen.net/github/stars/DEVtheOPS/opencode-plugin-otel" height="14"/> - <i>OpenTelemetry telemetry exporter for opencode sessions, mirroring Claude Code monitoring signals</i></summary>
  <blockquote>
    Exports metrics, logs, and traces from opencode sessions via OTLP/gRPC to any OpenTelemetry-compatible backend (Datadog, Honeycomb, Grafana Cloud, etc.). Instruments session lifecycle, token usage, cost, tool durations, and git commits — mirroring the same signals as Claude Code's monitoring.
    <br><br><a href="https://github.com/DEVtheOPS/opencode-plugin-otel">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>opencode-snip</b> <img src="https://badgen.net/github/stars/VincentHardouin/opencode-snip" height="14"/> - <i>OpenCode plugin that prefixes shell commands with snip to reduce LLM token consumption by 60-90%</i></summary>
  <blockquote>
    Automatically prefixes supported shell commands (git, go, cargo, npm, docker, etc.) with snip to filter output before it reaches your LLM context window.
    <br><br><a href="https://github.com/VincentHardouin/opencode-snip">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>OpenHax Codex</b> <img src="https://badgen.net/github/stars/open-hax/codex" height="14"/> - <i>OAuth authentication</i></summary>
  <blockquote>
    OAuth authentication plugin for personal coding assistance with ChatGPT Plus/Pro subscriptions.
    <br><br><a href="https://github.com/open-hax/codex">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>Openskills</b> <img src="https://badgen.net/github/stars/numman-ali/openskills" height="14"/> - <i>Alternative skills manager</i></summary>
  <blockquote>
    Alternative skills management plugin for opencode with enhanced features.
    <br><br><a href="https://github.com/numman-ali/openskills">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>OpenSpec</b> <img src="https://badgen.net/github/stars/Octane0411/opencode-plugin-openspec" height="14"/> - <i>Add Architecture planning and specification agent for OpenSpec</i></summary>
  <blockquote>
    An OpenCode plugin that integrates OpenSpec, providing a dedicated agent for planning and specifying software architecture.
    <br><br><a href="https://github.com/Octane0411/opencode-plugin-openspec">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>Optimal Model Temps</b> <img src="https://badgen.net/github/stars/Lyapsus/opencode-optimal-model-temps" height="14"/> - <i>Optimal sampling temperatures</i></summary>
  <blockquote>
    Minimal plugin that nudges specific models to their preferred sampling temperature.
    <br><br><a href="https://github.com/Lyapsus/opencode-optimal-model-temps">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>Pilot</b> <img src="https://badgen.net/github/stars/athal7/opencode-pilot" height="14"/> - <i>Automation daemon</i></summary>
  <blockquote>
    Automation daemon that polls for work from GitHub issues and Linear tickets.
    <br><br><a href="https://github.com/athal7/opencode-pilot">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>Plannotator</b> <img src="https://badgen.net/github/stars/backnotprop/plannotator" height="14"/> - <i>Interactive plan review UI</i></summary>
  <blockquote>
    Plan review UI with visual annotation, private/offline sharing, and Obsidian/Bear integration.
    <br><br><a href="https://github.com/backnotprop/plannotator">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>Plugin Template</b> <img src="https://badgen.net/github/stars/zenobi-us/opencode-plugin-template" height="14"/> - <i>CICD setup for plugins</i></summary>
  <blockquote>
    Focuses on providing the CICD setup with generator script, release please, bun publish, npm trusted publishing, and mise tasks.
    <br><br><a href="https://github.com/zenobi-us/opencode-plugin-template">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>Pocket Universe</b> <img src="https://badgen.net/github/stars/spoons-and-mirrors/pocket-universe" height="14"/> - <i>A subagent driven pocket universe for your primary agent</i></summary>
  <blockquote>
    Async agents can be powerful, but orchestration is at best finicky; they fire and forget, orphan work, lose context, waste time... and tokens. This plugin extends the native opencode subagent paradigm to provide closed loop, resilient, async agents, blocking main thread execution. A "pocket universe". This ships with three tools creating a robust system for parallel subagents to communicate and coordinate work
    <br><br><a href="https://github.com/spoons-and-mirrors/pocket-universe">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>Ralph Wiggum</b> <img src="https://badgen.net/github/stars/Th0rgal/opencode-ralph-wiggum" height="14"/> - <i>Self-correcting agent loops</i></summary>
  <blockquote>
    Iterative AI development loops with self-correcting agents based on the Ralph Wiggum technique.
    <br><br><a href="https://github.com/Th0rgal/opencode-ralph-wiggum">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>Ring a Bell Example</b> - <i>Simple terminal bell plugin</i></summary>
  <blockquote>
    A simple plugin to ring the terminal bell once a request is complete.
    <br><br><a href="https://gist.github.com/ahosker/267f375a65378bcb9a867fd9a195db1e">🔗 <b>View Gist</b></a>
  </blockquote>
</details>

<details>
  <summary><b>Security Best Practices</b> <img src="https://badgen.net/github/stars/awesome-opencode/opencode-security" height="14"/> - <i>Security patterns - encryption, rate limiting, CSP headers, CSRF protection</i></summary>
  <blockquote>
    Opencode plugin providing security best practices for production applications.
Features: - AES-256-GCM encryption utilities - Rate limiting with Upstash Redis - Content Security Policy (CSP) - CSRF protection patterns - Input sanitization - Secure headers via middleware - Security audit checklists
Essential for banking and financial applications.

    <br><br><a href="https://github.com/awesome-opencode/opencode-security">🔗 <b>View Repository</b></a>

  </blockquote>
</details>

<details>
  <summary><b>Shell Strategy</b> <img src="https://badgen.net/github/stars/JRedeker/opencode-shell-strategy" height="14"/> - <i>Avoid interactive shell hangs</i></summary>
  <blockquote>
    Instructions file that teaches LLMs how to avoid interactive shell commands that hang in non-TTY environments.
    <br><br><a href="https://github.com/JRedeker/opencode-shell-strategy">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>Simple Memory</b> <img src="https://badgen.net/github/stars/cnicolov/opencode-plugin-simple-memory" height="14"/> - <i>Git-based memory</i></summary>
  <blockquote>
    Simple plugin to manage memory inside a git repo that can be committed and reviewed by team members.
    <br><br><a href="https://github.com/cnicolov/opencode-plugin-simple-memory">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>Smart Title</b> <img src="https://badgen.net/github/stars/Tarquinen/opencode-smart-title" height="14"/> - <i>Auto-generate session titles</i></summary>
  <blockquote>
    Auto-generates meaningful session titles using AI.
    <br><br><a href="https://github.com/Tarquinen/opencode-smart-title">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>Smart Voice Notify</b> <img src="https://badgen.net/github/stars/MasuRii/opencode-smart-voice-notify" height="14"/> - <i>Intelligent voice notifications</i></summary>
  <blockquote>
    Smart voice notification plugin with multiple TTS engines (ElevenLabs, Edge TTS, SAPI) and intelligent reminder system.
    <br><br><a href="https://github.com/MasuRii/opencode-smart-voice-notify">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>Subtask2</b> <img src="https://badgen.net/github/stars/spoons-and-mirrors/subtask2" height="14"/> - <i>Orchestration system</i></summary>
  <blockquote>
    Extend opencode /commands into a powerful orchestration system with granular flow control.
    <br><br><a href="https://github.com/spoons-and-mirrors/subtask2">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>Swarm Plugin</b> <img src="https://badgen.net/github/stars/joelhooks/opencode-swarm-plugin" height="14"/> - <i>Swarm intelligence</i></summary>
  <blockquote>
    Swarm plugin for opencode enabling swarm-based agent coordination.
    <br><br><a href="https://github.com/joelhooks/opencode-swarm-plugin">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>Testing</b> <img src="https://badgen.net/github/stars/awesome-opencode/opencode-testing" height="14"/> - <i>Testing patterns - Vitest unit tests, Playwright E2E, component testing</i></summary>
  <blockquote>
    Opencode plugin providing testing patterns for production applications.
Features: - Vitest unit test patterns - Server Action testing - DAL testing with mocks - Playwright E2E patterns - Component testing with Testing Library - Auth flow testing - API testing patterns
Includes examples for banking application testing.

    <br><br><a href="https://github.com/awesome-opencode/opencode-testing">🔗 <b>View Repository</b></a>

  </blockquote>
</details>

<details>
  <summary><b>Tokenscope</b> <img src="https://badgen.net/github/stars/ramtinJ95/opencode-tokenscope" height="14"/> - <i>Token analysis & cost tracking</i></summary>
  <blockquote>
    Tokenscope, Comprehensive token usage analysis and cost tracking for opencode sessions.
    <br><br><a href="https://github.com/ramtinJ95/opencode-tokenscope">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>UNMOJI</b> - <i>Strip emojis from output</i></summary>
  <blockquote>
    A simple plugin that strips ALL emojis from agent outputs in Opencode.
    <br><br><a href="https://codeberg.org/bastiangx/opencode-unmoji">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>Vibe Coding Slack Notifier</b> <img src="https://badgen.net/github/stars/Wangmerlyn/vibe-coding-slack-notifier" height="14"/> - <i>Slack DM alerts for OpenCode task completion</i></summary>
  <blockquote>
    OpenCode-compatible Slack notifier plugin and toolkit for Codex, OpenCode, Claude Code, and Gemini workflows.
    <br><br><a href="https://github.com/Wangmerlyn/vibe-coding-slack-notifier">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>WakaTime</b> <img src="https://badgen.net/github/stars/angristan/opencode-wakatime" height="14"/> - <i>WakaTime integration</i></summary>
  <blockquote>
    WakaTime integration plugin for tracking coding activity in opencode sessions.
    <br><br><a href="https://github.com/angristan/opencode-wakatime">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>Warcraft Notifications</b> <img src="https://badgen.net/github/stars/pantheon-org/opencode-warcraft-notifications" height="14"/> - <i>Fun sound notifications</i></summary>
  <blockquote>
    Notification plugin with Warcraft sounds for opencode completion alerts.
    <br><br><a href="https://github.com/pantheon-org/opencode-warcraft-notifications">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>With Context MCP</b> <img src="https://badgen.net/github/stars/boxpositron/with-context-mcp" height="14"/> - <i>Project-specific markdown notes</i></summary>
  <blockquote>
    MCP server for managing project-specific markdown notes with templates, batch edits, and ignore patterns.
    <br><br><a href="https://github.com/boxpositron/with-context-mcp">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>Xquik</b> <img src="https://badgen.net/github/stars/Xquik-dev/x-twitter-scraper" height="14"/> - <i>X/Twitter data skill & MCP server</i></summary>
  <blockquote>
    X/Twitter data skill — MCP server, REST API, 20 extraction tools. Works with Claude Code, Cursor, Codex, and 40+ agents.
    <br><br><a href="https://github.com/Xquik-dev/x-twitter-scraper">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>Zellij Namer</b> <img src="https://badgen.net/github/stars/24601/opencode-zellij-namer" height="14"/> - <i>Auto-rename Zellij sessions</i></summary>
  <blockquote>
    Keeps your Zellij session name in sync with your work.
    <br><br><a href="https://github.com/24601/opencode-zellij-namer">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<br>
<a href="https://github.com/awesome-opencode/awesome-opencode/blob/main/contributing.md"><b>➕ Add a Plugin via PR</b></a>
</details>

<br>

<div id="themes"></div>

<details>
<summary><strong>🎨 THEMES</strong></summary>
<br>

<details>
  <summary><b>Ayu Dark</b> <img src="https://badgen.net/github/stars/postrednik/opencode-ayu-theme" height="14"/> - <i>Port of the popular Ayu Dark color scheme with golden yellow accent.</i></summary>
  <blockquote>
    Port of the popular Ayu Dark color scheme with golden yellow accent.
    <br><br><a href="https://github.com/postrednik/opencode-ayu-theme">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>Lavi</b> <img src="https://badgen.net/github/stars/b0o/lavi" height="14"/> - <i>A soft and sweet colorscheme for Opencode and 15+ other apps</i></summary>
  <blockquote>
    A soft, sweet dark theme for Opencode with rich purple tones and carefully tuned syntax and diff colors. Part of the Lavi colorscheme family, which also provides matching themes for Neovim, Alacritty, Ghostty, Kitty, Wezterm, Zellij, and other tools, with Nix flake and home-manager support.
    <br><br><a href="https://github.com/b0o/lavi/tree/main/contrib/opencode">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>Moonlight</b> <img src="https://badgen.net/github/stars/brunogabriel/opencode-moonlight-theme" height="14"/> - <i>A moonlight color theme for OpenCode based on the popular moonlight-vscode-theme.</i></summary>
  <blockquote>
    A moonlight color theme for OpenCode based on the popular moonlight-vscode-theme by atomiks. Features a dark, cool-toned palette inspired by moonlight aesthetics.
    <br><br><a href="https://github.com/brunogabriel/opencode-moonlight-theme">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>Poimandres Theme</b> <img src="https://badgen.net/github/stars/ajaxdude/opencode-ai-poimandres-theme" height="14"/> - <i>Poimandres theme</i></summary>
  <blockquote>
    Poimandres theme for opencode.
    <br><br><a href="https://github.com/ajaxdude/opencode-ai-poimandres-theme">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<br>
<a href="https://github.com/awesome-opencode/awesome-opencode/blob/main/contributing.md"><b>➕ Add a Theme via PR</b></a>
</details>

<br>

<div id="agents"></div>

<details>
<summary><strong>🤖 AGENTS</strong></summary>
<br>

<details>
  <summary><b>Agentic</b> <img src="https://badgen.net/github/stars/Cluster444/agentic" height="14"/> - <i>Modular AI agents</i></summary>
  <blockquote>
    Modular AI agents and commands for structured software development with opencode.
    <br><br><a href="https://github.com/Cluster444/agentic">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>Banking Agent</b> <img src="https://badgen.net/github/stars/awesome-opencode/opencode-banking" height="14"/> - <i>AI agent specialized in banking application development with Next.js 16, Plaid, Dwolla, and Drizzle ORM</i></summary>
  <blockquote>
    Pre-configured AI agent for banking application development. Specializes in:
- NextAuth.js v4 authentication and session management - Plaid API integration for bank account linking - Dwolla API for ACH transfers and payments - Drizzle ORM with PostgreSQL - Zod schema validation - Server Actions for all mutations - N+1 query prevention patterns - shadcn/ui component patterns - Security best practices (encryption, rate limiting)
Based on production patterns from the Banking project template.

    <br><br><a href="https://github.com/awesome-opencode/opencode-banking">🔗 <b>View Repository</b></a>

  </blockquote>
</details>

<details>
  <summary><b>Claude Subagents</b> <img src="https://badgen.net/github/stars/VoltAgent/awesome-claude-code-subagents" height="14"/> - <i>Claude Code subagents</i></summary>
  <blockquote>
    Comprehensive reference repository for production-ready Claude Code subagents.
    <br><br><a href="https://github.com/VoltAgent/awesome-claude-code-subagents">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>NextJS Architect</b> <img src="https://badgen.net/github/stars/awesome-opencode/opencode-nextjs-dev" height="14"/> - <i>AI architect agent for Next.js 16 App Router, Suspense boundaries, and Server Actions</i></summary>
  <blockquote>
    Pre-configured AI agent for Next.js 16 development. Specializes in App Router patterns, Suspense boundaries for async auth, Server Actions with Zod validation, DAL pattern enforcement (N+1 prevention), and TypeScript strict mode. Includes skills for:
- SuspenseSkill: Handle async auth without blocking route rendering - ServerActionSkill: Zod validation and error handling - DalSkill: N+1 prevention with JOIN patterns
Based on production patterns from the Banking project template.

    <br><br><a href="https://github.com/awesome-opencode/opencode-nextjs-dev">🔗 <b>View Repository</b></a>

  </blockquote>
</details>

<details>
  <summary><b>Opencode Agents</b> <img src="https://badgen.net/github/stars/darrenhinde/opencode-agents" height="14"/> - <i>Enhanced workflows</i></summary>
  <blockquote>
    A set of opencode configurations, prompts, agents, and plugins for enhanced development workflows.
    <br><br><a href="https://github.com/darrenhinde/opencode-agents">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>Redstone</b> <img src="https://badgen.net/github/stars/BackGwa/Redstone" height="14"/> - <i>AI-built Minecraft plugins</i></summary>
  <blockquote>
    an Opencode agent that simplifies Minecraft plugin development and deployment.
    <br><br><a href="https://github.com/BackGwa/Redstone">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<br>
<a href="https://github.com/awesome-opencode/awesome-opencode/blob/main/contributing.md"><b>➕ Add an Agent via PR</b></a>
</details>

<br>

<div id="projects"></div>

<details>
<summary><strong>🛠 PROJECTS</strong></summary>
<br>

<details>
  <summary><b>Agent of Empires</b> <img src="https://badgen.net/github/stars/njbrake/agent-of-empires" height="14"/> - <i>Multi-session TUI for OpenCode</i></summary>
  <blockquote>
    A terminal UI for managing multiple OpenCode sessions in tmux with git worktree integration and Docker sandboxing.
    <br><br><a href="https://github.com/njbrake/agent-of-empires">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>Beads</b> <img src="https://badgen.net/github/stars/steveyegge/beads" height="14"/> - <i>Project task management</i></summary>
  <blockquote>
    Steve Yegge's project/task management system for agents (with beads_viewer UI).
    <br><br><a href="https://github.com/steveyegge/beads">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>CLI Proxy API</b> <img src="https://badgen.net/github/stars/router-for-me/CLIProxyAPI" height="14"/> - <i>Multi-model proxy</i></summary>
  <blockquote>
    A proxy server providing compatible API interfaces for multiple model CLIs.
    <br><br><a href="https://github.com/router-for-me/CLIProxyAPI">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>Codex Proxy Server</b> <img src="https://badgen.net/github/stars/unluckyjori/Codex-Proxy-Server" height="14"/> - <i>Local API proxy</i></summary>
  <blockquote>
    A proxy server that provides a local API proxy for Codex/ChatGPT-like models.
    <br><br><a href="https://github.com/unluckyjori/Codex-Proxy-Server">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>Cupcake</b> <img src="https://badgen.net/github/stars/eqtylab/cupcake" height="14"/> - <i>Policy enforcement layer</i></summary>
  <blockquote>
    A native policy-layer for AI coding agents built on OPA/Rego with native OpenCode plugin support.
    <br><br><a href="https://github.com/eqtylab/cupcake">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>Gemini CLI to API</b> <img src="https://badgen.net/github/stars/gzzhongqi/geminicli2api" height="14"/> - <i>Gemini proxy</i></summary>
  <blockquote>
    A proxy that converts the Gemini CLI tool into OpenAI-compatible endpoints.
    <br><br><a href="https://github.com/gzzhongqi/geminicli2api">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>GolemBot</b> <img src="https://badgen.net/github/stars/0xranx/golembot" height="14"/> - <i>Unified AI assistant framework for multiple Coding Agent CLIs</i></summary>
  <blockquote>
    Wraps Claude Code, Cursor, OpenCode, and Codex behind a single API with a Skill system, IM channel adapters (Feishu/Slack/Telegram/Discord), fleet mode, and an interactive onboard wizard.
    <br><br><a href="https://github.com/0xranx/golembot">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>Handy</b> <img src="https://badgen.net/github/stars/cjpais/Handy" height="14"/> - <i>Speech to Text</i></summary>
  <blockquote>
    Easy Open Source Speech to Text.
    <br><br><a href="https://github.com/cjpais/Handy">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>hcom</b> <img src="https://badgen.net/github/stars/aannoo/hcom" height="14"/> - <i>Let AI agents message, watch, and spawn each other across terminals</i></summary>
  <blockquote>
    Claude Code, Gemini CLI, Codex CLI, and OpenCode agents in separate terminals can message each other, detect file edit collisions, read transcripts, view terminal screens, subscribe to activity, and spawn/fork/resume agents. First-class OpenCode support with native plugin. Includes TUI dashboard, cross-device relay, Python API, and multi-agent workflow scripts. pip installable, MIT licensed.
    <br><br><a href="https://github.com/aannoo/hcom">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>Kimaki</b> <img src="https://badgen.net/github/stars/remorses/kimaki" height="14"/> - <i>Discord bot controller</i></summary>
  <blockquote>
    A Discord bot to control opencode sessions on any computer via Discord.
    <br><br><a href="https://github.com/remorses/kimaki/">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>MCP Voice Interface</b> <img src="https://badgen.net/github/stars/shantur/mcp-voice-interface" height="14"/> - <i>Talk to AI assistants</i></summary>
  <blockquote>
    Talk to AI assistants using your voice through a web browser. Compatible with Claude Desktop and opencode.
    <br><br><a href="https://github.com/shantur/mcp-voice-interface">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>OC Context (occtx)</b> <img src="https://badgen.net/github/stars/hungthai1401/occtx" height="14"/> - <i>Switch contexts quickly</i></summary>
  <blockquote>
    A command-line tool for switching between different opencode contexts quickly.
    <br><br><a href="https://github.com/hungthai1401/occtx">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>OC Manager</b> <img src="https://badgen.net/github/stars/kcrommett/oc-manager" height="14"/> - <i>Metadata TUI</i></summary>
  <blockquote>
    Terminal UI for inspecting, filtering, and pruning OpenCode metadata stored on disk.
    <br><br><a href="https://github.com/kcrommett/oc-manager">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>OC Monitor Share</b> <img src="https://badgen.net/github/stars/Shlomob/ocmonitor-share" height="14"/> - <i>CLI monitoring tool</i></summary>
  <blockquote>
    A CLI tool for monitoring and analysing opencode AI coding usage.
    <br><br><a href="https://github.com/Shlomob/ocmonitor-share">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>Octto</b> <img src="https://badgen.net/github/stars/vtemian/octto" height="14"/> - <i>Interactive browser UI for AI brainstorming</i></summary>
  <blockquote>
    Interactive browser UI for AI brainstorming with multi-question forms, parallel exploration branches, and visual feedback.
    <br><br><a href="https://github.com/vtemian/octto">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>OCX</b> <img src="https://badgen.net/github/stars/kdcokenny/ocx" height="14"/> - <i>OpenCode package manager</i></summary>
  <blockquote>
    The missing package manager for OpenCode extensions - ShadCN model with Ghost Mode.
    <br><br><a href="https://github.com/kdcokenny/ocx">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>Open Agent</b> <img src="https://badgen.net/github/stars/Th0rgal/openagent" height="14"/> - <i>Self-hosted control plane</i></summary>
  <blockquote>
    Self-hosted control plane for OpenCode agents with isolated Linux workspaces (systemd-nspawn), git-backed Library configuration, and multi-platform dashboards (Next.js web, SwiftUI iOS).
    <br><br><a href="https://github.com/Th0rgal/openagent">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>Open Dispatch</b> <img src="https://badgen.net/github/stars/bobum/open-dispatch" height="14"/> - <i>Control OpenCode from Slack or Microsoft Teams</i></summary>
  <blockquote>
    Bridge app connecting chat platforms (Slack/Teams) to AI coding assistants. Start sessions on desktop, guide them from your phone. Supports 75+ AI providers via OpenCode integration with session persistence and smart message routing.
    <br><br><a href="https://github.com/bobum/open-dispatch">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>OpenChamber</b> <img src="https://badgen.net/github/stars/btriapitsyn/openchamber" height="14"/> - <i>GUI for OpenCode</i></summary>
  <blockquote>
    A fan-made web and desktop interface for OpenCode with VS Code extension, multiple sessions, and git worktrees management.
    <br><br><a href="https://github.com/btriapitsyn/openchamber">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>Opencode DDEV</b> <img src="https://badgen.net/github/stars/JUVOJustin/opencode-ddev" height="14"/> - <i>DDEV container wrapper</i></summary>
  <blockquote>
    Wraps bash commands to execute inside the DDEV container (Docker-based PHP development environments).
    <br><br><a href="https://github.com/JUVOJustin/opencode-ddev">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>Opencode Neovim</b> <img src="https://badgen.net/github/stars/NickvanDyke/opencode.nvim" height="14"/> - <i>Neovim plugin</i></summary>
  <blockquote>
    Neovim plugin for making convenient editor-aware prompts.
    <br><br><a href="https://github.com/NickvanDyke/opencode.nvim">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>Opencode Session Manager</b> <img src="https://badgen.net/github/stars/GNITOAHC/opencode-session" height="14"/> - <i>Session viewer & manager</i></summary>
  <blockquote>
    View & Manage sessions for opencode, also detect orphan sessions for deletion
    <br><br><a href="https://github.com/GNITOAHC/opencode-session">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>Opencode Sessions</b> <img src="https://badgen.net/github/stars/malhashemi/opencode-sessions" height="14"/> - <i>Session tracker</i></summary>
  <blockquote>
    Session management tool for opencode to track and organise coding sessions.
    <br><br><a href="https://github.com/malhashemi/opencode-sessions">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>Opencode Skills</b> <img src="https://badgen.net/github/stars/malhashemi/opencode-skills" height="14"/> - <i>Skills management</i></summary>
  <blockquote>
    Skills management system for organising and tracking opencode capabilities.
    <br><br><a href="https://github.com/malhashemi/opencode-skills">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>Opencode Telegram Bot</b> <img src="https://badgen.net/github/stars/grinev/opencode-telegram-bot" height="14"/> - <i>Telegram bot client for OpenCode CLI</i></summary>
  <blockquote>
    Run and monitor AI coding tasks from your phone while everything runs locally on your machine.
    <br><br><a href="https://github.com/grinev/opencode-telegram-bot">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>Opencode Web</b> <img src="https://badgen.net/github/stars/kcrommett/opencode-web" height="14"/> - <i>Browser-based access</i></summary>
  <blockquote>
    Web interface for opencode - browser-based access to AI coding agent.
    <br><br><a href="https://github.com/kcrommett/opencode-web">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>OpenSpec</b> <img src="https://badgen.net/github/stars/Fission-AI/OpenSpec" height="14"/> - <i>Spec-driven development</i></summary>
  <blockquote>
    Spec-driven development with opencode - structured specification management.
    <br><br><a href="https://github.com/Fission-AI/OpenSpec">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>OpenWork</b> <img src="https://badgen.net/github/stars/different-ai/openwork" height="14"/> - <i>Desktop GUI for OpenCode workflows</i></summary>
  <blockquote>
    Open-source alternative to Claude Cowork built on top of OpenCode. Provides a polished desktop UI for sessions, skills, plugins, and templates.
    <br><br><a href="https://github.com/different-ai/openwork">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>Qwen Code OAI Proxy</b> <img src="https://badgen.net/github/stars/aptdnfapt/qwen-code-oai-proxy" height="14"/> - <i>Qwen model proxy</i></summary>
  <blockquote>
    An OpenAI-Compatible Proxy Server for Qwen models.
    <br><br><a href="https://github.com/aptdnfapt/qwen-code-oai-proxy">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>Tokscale</b> <img src="https://badgen.net/github/stars/junhoyeo/tokscale" height="14"/> - <i>Token usage tracking CLI</i></summary>
  <blockquote>
    A CLI tool for tracking token usage from OpenCode and other coding agents (Claude Code, Codex, Gemini CLI, and Cursor IDE).
    <br><br><a href="https://github.com/junhoyeo/tokscale">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>Universal LLM API Proxy</b> <img src="https://badgen.net/github/stars/Mirrowel/LLM-API-Key-Proxy" height="14"/> - <i>Universal multi-model proxy and library - made with Opencode community</i></summary>
  <blockquote>
    Universal LLM Gateway: One API, every LLM. OpenAI/Anthropic-compatible endpoints with multi-provider translation and intelligent load-balancing. Works with any application that supports custom OpenAI/Anthropic base URLs—no code changes required in your existing tools. Best support for Antigravity/Gemini CLI out of the competition. Deploy anywhere. <a href='https://discord.com/channels/1391832426048651334/1449788759917858959'>Opencode Discord discussion</a>
    <br><br><a href="https://github.com/Mirrowel/LLM-API-Key-Proxy">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>Vibe Kanban</b> <img src="https://badgen.net/github/stars/BloopAI/vibe-kanban" height="14"/> - <i>Manage AI in parallel</i></summary>
  <blockquote>
    A Kanban board to manage and orchestrate AI coding agents in parallel.
    <br><br><a href="https://github.com/BloopAI/vibe-kanban">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<br>
<a href="https://github.com/awesome-opencode/awesome-opencode/blob/main/contributing.md"><b>➕ Add a Project via PR</b></a>
</details>

<br>

<div id="resources"></div>

<details>
<summary><strong>📚 RESOURCES</strong></summary>
<br>

<details>
  <summary><b>alibaba-rate-limit-handling</b> - <i>```</i></summary>
  <blockquote>
    How to handle Alibaba API rate-limit errors — adjust client logic to scale requests smoothly
    <br><br><a href=".opencode\instructions/">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>auth-testing</b> - <i>```typescript</i></summary>
  <blockquote>
    NextAuth v4 patterns and Testing patterns (Vitest, Playwright)
    <br><br><a href=".opencode\instructions/">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>AuthSkill</b> - <i>This skill provides guidance on NextAuth.js v4 authentication patterns for the Banking project.</i></summary>
  <blockquote>
    NextAuth.js v4 authentication patterns, session management, OAuth providers, and protected routes for the Banking app. Use when working with auth, sessions, or user authentication flows.
    <br><br><a href=".opencode\skills\auth-skill/">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>commands-ref</b> - <i>```bash</i></summary>
  <blockquote>
    Command reference and workflow guidance for Banking project
    <br><br><a href=".opencode\instructions/">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>core-standards</b> - <i>Critical rules that MUST be followed. PRs will be blocked if violated.</i></summary>
  <blockquote>
    Critical coding standards and PR-blocking rules for Banking project
    <br><br><a href=".opencode\instructions/">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>dal-patterns</b> - <i>All database access must go through `lib/dal/`.</i></summary>
  <blockquote>
    Drizzle ORM patterns, DAL pattern, and N+1 prevention
    <br><br><a href=".opencode\instructions/">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>DBSkill</b> - <i>This skill provides guidance on Drizzle ORM patterns for the Banking project.</i></summary>
  <blockquote>
    Drizzle ORM patterns for the Banking app - schema definition, migrations, queries, and N+1 prevention. Use when working with database, schema, or data access layer.
    <br><br><a href=".opencode\skills\db-skill/">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>Debug Log to Text File</b> - <i>Troubleshooting guide</i></summary>
  <blockquote>
    How to output a debug log from opencode to a text file for troubleshooting.
    <br><br><a href="https://github.com/awesome-opencode/awesome-opencode/discussions/19">🔗 <b>View Discussion</b></a>
  </blockquote>
</details>

<details>
  <summary><b>DeploymentSkill</b> - <i>This skill provides guidance on deployment patterns for the Banking project.</i></summary>
  <blockquote>
    Deployment patterns for the Banking app - Vercel, Docker, Railway, and CI/CD pipelines. Use when deploying the app or setting up automated deployments.
    <br><br><a href=".opencode\skills\deployment-skill/">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>DwollaSkill</b> - <i>This skill provides guidance on Dwolla API integration for ACH transfers in the Banking project.</i></summary>
  <blockquote>
    Dwolla API integration for ACH transfers, payment processing, and bank account verification in the Banking app. Use when working with transfers, ACH, or payment flows.
    <br><br><a href=".opencode\skills\dwolla-skill/">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>Everything Guide</b> <img src="https://badgen.net/github/stars/wesammustafa/OpenCode-Everything-You-Need-to-Know" height="14"/> - <i>All-in-one comprehensive OpenCode guide</i></summary>
  <blockquote>
    The ultimate all-in-one guide to mastering OpenCode. From installation, Zen model router setup, TUI mastery, commands, skills, agents, workflows, automation, and integrations, to MCP servers. Packed with step-by-step tutorials.
    <br><br><a href="https://github.com/wesammustafa/OpenCode-Everything-You-Need-to-Know">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>GoTTY</b> <img src="https://badgen.net/github/stars/sorenisanerd/gotty" height="14"/> - <i>Turn CLI into Web App</i></summary>
  <blockquote>
    A simple command-line tool that turns your CLI tools, like opencode, into web applications.
    <br><br><a href="https://github.com/sorenisanerd/gotty">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>nextjs-patterns</b> - <i>- Next.js 16 (App Router)</i></summary>
  <blockquote>
    Next.js patterns, App Router, Cache Components, and Server Actions
    <br><br><a href=".opencode\instructions/">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>Opencode Config Starter</b> <img src="https://badgen.net/github/stars/jjmartres/opencode" height="14"/> - <i>Flexible config starting point</i></summary>
  <blockquote>
    A powerful custom opencode configuration with agents, commands, rules, skills, and pre-configured MCP server.
    <br><br><a href="https://github.com/jjmartres/opencode">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>OpenCode Discord</b> - <i>Official community Discord server</i></summary>
  <blockquote>
    Join the official Anomaly community Discord to connect with other OpenCode users, get help, share tips, and stay updated on new features.
    <br><br><a href="https://discord.gg/anomaly">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>OpenCode Docs</b> - <i>Official documentation portal for OpenCode</i></summary>
  <blockquote>
    Complete official documentation for OpenCode AI coding agent. Covers installation, configuration, providers, tools, commands, skills, agents, plugins, and more.
    <br><br><a href="https://opencode.ai/docs/">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>OpenCode GitHub</b> <img src="https://badgen.net/github/stars/anomalyco/opencode" height="14"/> - <i>Official GitHub repository</i></summary>
  <blockquote>
    The official GitHub repository for the OpenCode AI coding agent. Star the repo, report issues, contribute code, and stay updated with the latest releases.
    <br><br><a href="https://github.com/anomalyco/opencode">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>OpenCode SDKs</b> - <i>Official SDKs for JavaScript, Go, and Python</i></summary>
  <blockquote>
    Official software development kits for integrating OpenCode into your applications. Available for JavaScript/TypeScript, Go, and Python.
    <br><br><a href="https://github.com/anomalyco">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>OpenCode Tutorial Docs</b> - <i>Community-maintained tutorial documentation</i></summary>
  <blockquote>
    Community-maintained tutorial documentation synced from the official repository. Includes configuration, providers, tools, MCP servers, and comprehensive guides.
    <br><br><a href="https://opencode-tutorial.com/en/docs">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>PlaidSkill</b> - <i>This skill provides guidance on Plaid API integration for the Banking project.</i></summary>
  <blockquote>
    Plaid API integration for bank account linking, transaction retrieval, and balance fetching in the Banking app. Use when working with PlaidLink, bank connections, or financial data.
    <br><br><a href=".opencode\skills\plaid-skill/">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>SecuritySkill</b> - <i>This skill provides guidance on security patterns for the Banking project.</i></summary>
  <blockquote>
    Security patterns for the Banking app - encryption, input sanitization, CSRF protection, and secure headers. Use when handling sensitive data, authentication, or security-critical code.
    <br><br><a href=".opencode\skills\security-skill/">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>ServerActionSkill</b> - <i>This skill provides guidance on Server Action patterns for the Banking project.</i></summary>
  <blockquote>
    Server Action patterns for mutations, form handling, revalidation, and error handling in the Banking app. Use when creating forms, mutations, or data updates.
    <br><br><a href=".opencode\skills\server-action-skill/">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>task-sync-note</b> - <i>This project uses TaskSync for terminal-based task management. However, TaskSync protocol (PowerShell-based) is not c...</i></summary>
  <blockquote>
    TaskSync protocol compatibility note for OpenCode
    <br><br><a href=".opencode\instructions/">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>TestingSkill</b> - <i>This skill provides guidance on testing patterns for the Banking project.</i></summary>
  <blockquote>
    Testing patterns for the Banking app using Vitest and Playwright. Use when writing tests, unit tests, integration tests, or E2E tests.
    <br><br><a href=".opencode\skills\testing-skill/">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>ui-validation</b> - <i>Components are in `components/ui/`.</i></summary>
  <blockquote>
    shadcn/UI components, Zod validation, and forms
    <br><br><a href=".opencode\instructions/">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>UISkill</b> - <i>This skill provides guidance on shadcn/ui and Tailwind CSS patterns for the Banking project.</i></summary>
  <blockquote>
    shadcn/ui component patterns and Tailwind CSS styling for the Banking app. Use when building forms, tables, dialogs, or UI components.
    <br><br><a href=".opencode\skills\ui-skill/">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>upstream-error-handling</b> - <i>When you encounter a transient rate-limit or upstream error from the AI provider (e.g., "Request rate increased too q...</i></summary>
  <blockquote>
    How to handle transient AI provider rate-limit errors — do NOT add them to AGENTS.md
    <br><br><a href=".opencode\instructions/">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<details>
  <summary><b>ValidationSkill</b> - <i>This skill provides guidance on Zod schema validation patterns for the Banking project.</i></summary>
  <blockquote>
    Zod schema validation patterns for forms, API inputs, and type-safe data in the Banking app. Use when creating schemas, validating user input, or implementing form validation.
    <br><br><a href=".opencode\skills\validation-skill/">🔗 <b>View Repository</b></a>
  </blockquote>
</details>

<br>
<a href="https://github.com/awesome-opencode/awesome-opencode/blob/main/contributing.md"><b>➕ Add a Resource via PR</b></a>
</details>

<br><br>

<div align="center">
<h3>🤝 Contributing</h3>
Found an Awesome Opencode project? <br>
<a href="https://github.com/awesome-opencode/awesome-opencode/blob/main/contributing.md"><b>Submit a Pull Request</b></a> to add it to the list!
<br><br>
<sub>Released under <a href="https://creativecommons.org/publicdomain/zero/1.0/">CC0 1.0 Universal</a>.</sub>
</div>
