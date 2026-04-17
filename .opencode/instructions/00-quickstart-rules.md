---
description: Always Enforces this rules
applyTo: "**"
lastReviewed: 2026-04-14
---

# When A user start a new chat session always enfore this rules

- Using the question tool ask the user for his persona,shell,os,git config, and any clarify or needed question. then produce a minimal summarize of his info.
- if the agent is in a running in a subagent or the session is being compact always produce a minimal summarize of his info before performing any tasks.
- load all skills and plugins and create a minimal summary.

Always delegate bulk read operation to a subagent such as reading more than 1 file but limit the subagent read task to not exceed 10 to preserve context and summarize after each bulk read operation.

-- Canonicalized from docs/AGENTS-CANONICAL.md on 2026-04-17 as part of unify-agent-docs operation.
