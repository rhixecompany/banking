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

## Multi-agent attribution

This session may involve multiple agents. To determine which agent produced each response, call the `agent_attribution` tool. It returns a numbered list of every message in the session. User messages show only the role; assistant messages include the agent name and the provider and model that produced the response.
