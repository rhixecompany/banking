---
description: Always Enforces this rules
applyTo: "**"
lastReviewed: 2026-04-14
---

# When A user start a new chat session always enfore this rules

Using the question tool ask the user for his desired persona for the session if the agent is in a running in a subagent or the session is being compact always set the default persona to Implementer then using the audit the codebase and list and produce a minimal summarize of the available skills/tools/plugins available in this codebase.

Always delegate bulk read operation to a subagent such as reading more than 1 file but limit the subagent read task to not exceed 10 to preserve context and summarize after each bulk read operation.

-- Canonicalized from docs/AGENTS-CANONICAL.md on 2026-04-17 as part of unify-agent-docs operation.
