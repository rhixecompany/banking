# Agent-Centric Design Principles for MCP Tools

This document contains detailed guidance on designing tools for AI agents. This is supplementary reading; the main SKILL.md focuses on MCP-specific implementation patterns.

## Build for Workflows, Not Just API Endpoints

Don't simply wrap existing API endpoints—build thoughtful, high-impact workflow tools that agents can use to accomplish real tasks.

- **Consolidate related operations**: Create composite tools that combine multiple API calls. Example: `schedule_event` tool that both checks availability AND creates the event, rather than separate `check_availability` and `create_event` tools.
- **Focus on complete tasks**: Design tools that enable agents to accomplish meaningful work, not just expose individual API endpoints.
- **Consider agent workflows**: Think about what multi-step workflows agents actually need to accomplish, then design tools that enable those workflows efficiently.

## Optimize for Limited Context

Agents have constrained context windows. Every response token counts. Design your tools with this scarcity in mind.

- **Return high-signal information only**: Don't return exhaustive data dumps. Return only the information the agent actually needs.
- **Provide response detail options**: Support "concise" and "detailed" response modes. Default to concise.
- **Use human-readable identifiers**: Prefer names over technical IDs in responses. Agents understand "John Smith" better than "user_12847".
- **Consider context budget as a resource**: If pagination is available, use it. If truncation is necessary, truncate intelligently.

## Design Actionable Error Messages

Error messages should guide agents toward successful tool usage, not just report failures.

- **Guide toward correct usage**: Suggest specific next steps. Example: "Try using filter='active_only' to reduce results" instead of "Too many results".
- **Make errors educational**: Help agents learn proper usage patterns through clear, specific feedback.
- **Be actionable**: Every error message should suggest what the agent should try next.

## Follow Natural Task Subdivisions

Design tool names and groupings that match how humans think about tasks.

- **Use consistent prefixes**: Group related tools with consistent naming patterns (`search_*`, `get_*`, `list_*`, `create_*`).
- **Tool names reflect human workflows**: "schedule_meeting" is better than "create_calendar_event" because it matches how users think about the task.
- **Design around workflows, not API structure**: Don't expose the API structure directly; abstract it into natural task workflows.

## Use Evaluation-Driven Development

Test your MCP server against realistic agent use cases early and often.

- **Create evaluation scenarios early**: Before implementation, sketch out realistic questions agents might ask.
- **Let agent feedback drive improvements**: Use agent performance to identify which tools are missing or poorly designed.
- **Prototype and iterate quickly**: Build a basic server, test it with evaluation questions, then improve based on results.
