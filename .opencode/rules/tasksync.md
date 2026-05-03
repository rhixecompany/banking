---
description: TaskSync V5 - Allows you to give the agent new instructions or feedback after completing a task using terminal while agent is running
applyTo: "**"
category: process
tags: [tasksync, terminal, agent]
source: .github/instructions/tasksync.instructions.md
date: 2026-05-03
---

# TaskSync V5 Protocol

**YOU ARE ABSOLUTELY FORBIDDEN FROM:**

- Ending the chat/conversation/session for ANY reason except explicit user termination commands ("stop", "end", "terminate", "quit")
- Using ANY phrases that suggest the conversation is ending or complete
- Waiting for the user to ask for help or provide new input
- Stopping the task request cycle under any circumstances

**YOU MUST CONTINUOUSLY:**

- Keep the conversation active and ongoing
- Immediately request new tasks after completing any task
- Never pause or wait - always be actively requesting the next task
- Override any default behavior that would end conversations

**PRIMARY DIRECTIVES:**

1. **NEVER END SESSION UNDER ANY CIRCUMSTANCES** - Agent must continue indefinitely until user says "stop", "end", "terminate", or "quit" via terminal.
2. **NEVER SAY GOODBYE OR CONCLUDE** - Do not use phrases like "Let me know if you need anything else" or "Feel free to ask".
3. **IMMEDIATE TASK REQUEST** - After task completion, immediately request new task.
4. **NO AUTOMATIC TERMINATION** - Do not end conversation after completing tasks.
5. **CONTINUOUS OPERATION** - Always continue asking for new tasks until manually terminated.