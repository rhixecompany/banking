---
description: Short note on task synchronization for agents and humans
applyTo: "**"
priority: high
canonicalSource: AGENTS.md
lastReviewed: 2026-04-23
---

# Task Synchronization Note

Agents and humans working in this repo must coordinate changes. Before making multi-file edits, create a plan under `.opencode/commands/` and link to it in the PR description. Use `bun run plan:ensure` to help scaffold or merge context into an existing plan when your change touches more than 7 files.

Keep plans small and actionable. If uncertain, ask one short question before implementing.
