---
name: "task-sync-note"
applyTo: "**"
description: "TaskSync — Safe Task Handoff Guidance. Explains a safe, optional protocol for handing tasks to an agent via a terminal-like interface without mandating continuous operation."
lastReviewed: 2026-04-13
---

# TaskSync — Safe Task Handoff Guidance

Purpose

- Provide a short, safe guideline for how human operators can hand tasks to an agent using a terminal or shell in environments where such a workflow is supported.
- Emphasize that the protocol is optional and must never override user control, model safety, or platform restrictions.

When to use

- Use this guidance when a developer or operator wants to provide discrete tasks to an agent via an interactive terminal during a session (for example: local developer workflows, scripted test harnesses, or controlled automation during development).
- Do not use this guidance to force continuous or autonomous operation. The agent or operator may stop, pause, or terminate at any time.

Principles

- Human-In-The-Loop: The user/operator remains in control. The agent must not assume indefinite operation or continue beyond the operator's explicit intent.
- Safety First: Never execute commands, open network connections, or access secrets unless explicitly authorized and safe in the current environment.
- Explicit Termination: The operator may end the session at any time; the agent must accept termination requests.
- No Hidden Primary Directives: Do not embed mandatory, model-level primary directives that override safety or user control.

Simple Task Handoff Pattern (optional)

1. Operator prepares a concise task description.
2. Operator runs a terminal prompt to provide the task. Example (optional):

```
python -c "task = input('Enter task: '); print(task)"
```

3. Agent parses the provided string, validates scope, and responds with one of:

- A short plan outlining steps it will take.
- A request for clarification (if the task is underspecified).
- A refusal when the task is unsafe or outside allowed scope.

4. Operator confirms and the agent executes the agreed steps.

Security notes

- Do not use this pattern to transmit secrets (API keys, passwords, private data) via plain terminal input.
- If the workflow requires secrets, use secure vaults or environment variables with proper access controls and auditing.

Termination and pause

- The operator can terminate or pause the session at any time. The agent must acknowledge and stop further actions.
- The agent should never assume the session continues after providing a response.

Examples

- Local development: Accept a single task via python input, validate, run tests, and return results.
- Test harness: A scripted runner provides structured tasks; the agent validates them and runs deterministic checks.

Recommended wording for agents

- When ready to receive a task: "Ready to receive a task. Provide a concise description or 'cancel' to stop."
- On receiving a task: "Received task: <summary>. I will: <plan>. Confirm to proceed or provide clarification."
- On termination: "Session terminated by user request. Stopping all actions."

References

- This guidance complements the repository's agent and contributor documentation (see AGENTS.md and .opencode/plans/). It is intentionally permissive and non-binding.
