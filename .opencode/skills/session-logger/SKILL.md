---
name: session-logger
description: Logs all opencode coding agent session activity for audit and analysis.
tags: ["logging", "audit", "analytics"]
lastReviewed: 2026-04-17
applyTo: ".opencode/skills/session-logger/**"
---

# Session Logger Hook

Comprehensive logging for opencode coding agent sessions, tracking session starts, ends, and user prompts for audit trails and usage analytics.

## Overview

This hook provides detailed logging of opencode coding agent activity:

- Session start/end times with working directory context
- User prompt submission events
- Configurable log levels

## Features

- **Session Tracking**: Log session start and end events
- **Prompt Logging**: Record when user prompts are submitted
- **Structured Logging**: JSON format for easy parsing
- **Privacy Aware**: Configurable to disable logging entirely

## Installation

1. Copy this hook folder to your repository's `.opencode/skills/` directory:

   ```bash
   cp -r skills/session-logger .opencode/skills/
   ```

2. Create the logs directory:

   ```bash
   mkdir -p logs/opencode
   ```

3. Ensure scripts are executable:

   ```bash
   chmod +x .opencode/skills/session-logger/*.sh
   ```

4. Commit the hook configuration to your repository's default branch

## Log Format

Session events are written to `logs/opencode/session.log` and prompt events to `logs/opencode/prompts.log` in JSON format:

```json
{"timestamp":"2024-01-15T10:30:00Z","event":"sessionStart","cwd":"/workspace/project"}
{"timestamp":"2024-01-15T10:35:00Z","event":"sessionEnd"}
```

## Privacy & Security

- Add `logs/` to `.gitignore` to avoid committing session data
- Use `LOG_LEVEL=ERROR` to only log errors
- Set `SKIP_LOGGING=true` environment variable to disable
- Logs are stored locally only
