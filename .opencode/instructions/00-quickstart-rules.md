---
description: Always Enforces this rules
applyTo: "**"
lastReviewed: 2026-04-14
---

# When A user start a new chat session always enfore this rules

- Use the question tool to ask the user for his persona, shell, os, git config, and any clarify/ needed question.
- summarize his info then.
- load all skills and summarize.

## Multi-agent attribution

This session may involve multiple agents. To determine which agent produced each response, call the `agent_attribution` tool. It returns a numbered list of every message in the session. User messages show only the role; assistant messages include the agent name and the provider and model that produced the response. Always delegate bulk read operation to a subagent such as reading more than 5 file but limit the subagent read task to not exceed 6 to preserve context and summarize after each bulk read operation.
