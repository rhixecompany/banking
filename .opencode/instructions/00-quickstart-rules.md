---
description: Always Enforces this rules
applyTo: "**"
lastReviewed: 2026-04-14
---

# When A user start a new chat session always enfore this rules

- Use the question tool to ask the user for his persona, shell, os, git config, and summarize his info then ask the user if you should load skills if yes load them.
- then use the read tool and read all "instructions/00-default-rules.md", "instructions/00-task-sync-note.md", "instructions/01-core-standards.md", "instructions/02-nextjs-patterns.md", "instructions/03-dal-patterns.md", "instructions/04-auth-testing.md", "instructions/05-ui-validation.md", "instructions/06-commands-ref.md", "instructions/07-upstream-error-handling.md", "instructions/08-command-plan-steps-rules.md", "instructions/09-command-plan-steps-rules.md", "instructions/09-plan-file-standards.md", "instructions/10-apply-patch-verification-fix.md", "instructions/11-documentation-standards.md", "instructions/12-scripts-patterns.md" files and create a one line summary .

## Multi-agent attribution

This session may involve multiple agents. To determine which agent produced each response, call the `agent_attribution` tool. It returns a numbered list of every message in the session. User messages show only the role; assistant messages include the agent name and the provider and model that produced the response. Always delegate bulk read operation to a subagent such as reading more than 5 file but limit the subagent read task to not exceed 6 to preserve context and summarize after each bulk read operation.
