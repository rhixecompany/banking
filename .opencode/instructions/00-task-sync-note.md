---
name: "task-sync-note"
description: "TaskSync protocol compatibility note for OpenCode"
applyTo: "**"
---

# TaskSync Protocol Note

This project uses TaskSync for terminal-based task management. However, TaskSync protocol (PowerShell-based) is not compatible with OpenCode Docker environment.

## For OpenCode Sessions

- Ignore all TaskSync references in other instruction files
- Use standard OpenCode workflow: ask → plan → build → validate
- Use custom commands: /validate, /test, /build
- TaskSync is designed for Claude Code/terminal sessions, not OpenCode
