---
name: create-hook
description: Create Cursor hooks. Use when you want to create a hook, write hooks.json, add hook scripts, or automate behavior around agent events.
lastReviewed: 2026-04-29
applyTo: "**/*"
platforms:
  - opencode
  - cursor
  - copilot
---

# Creating Cursor Hooks - Banking Project Guidelines

## Overview

This skill provides comprehensive guidelines for creating and managing Cursor hooks. It covers hook types, events, matchers, implementation patterns, and best practices for the Banking project.

## Multi-Agent Commands

### OpenCode
```bash
# Create hook directory
mkdir -p .cursor/hooks

# List existing hooks
cat .cursor/hooks.json
```

### Cursor
```
@create-hook
Create a hook to validate shell commands
```

### Copilot
```
/hook create pre-tool-use validation
```

## Hook Fundamentals

### What Are Hooks

Hooks are scripts or prompt-based logic that Cursor runs before or after agent events. They can:

- **Observe**: Watch events without modifying behavior
- **Block**: Prevent certain actions from executing
- **Modify**: Rewrite tool inputs or inject context
- **Follow-up**: Trigger additional actions after events

### When to Use Hooks

Use hooks when you need to:
- Enforce coding standards before commits
- Validate shell commands for safety
- Add context to file operations
- Audit agent behavior
- Control subagent execution

## Gather Requirements

Before creating a hook, determine:

1. **Scope**: Project hook or user hook?
2. **Trigger**: Which event should run the hook?
3. **Behavior**: Audit, deny/allow, rewrite, inject, or continue?
4. **Implementation**: Command hook (script) or prompt hook?
5. **Filtering**: Does it need a matcher?
6. **Safety**: Fail open or fail closed on errors?

## Choose the Right Location

### Project Hooks

- Location: `.cursor/hooks.json` and `.cursor/hooks/*`
- Run from project root
- Use paths like `.cursor/hooks/my-hook.sh`
- Check into version control
- Share with team

### User Hooks

- Location: `~/.cursor/hooks.json` and `~/.cursor/hooks/*`
- Run from home directory
- Use paths like `./hooks/my-hook.sh`
- Personal to user
- Not shared

### Banking Project Convention

```bash
# Project hooks for banking-specific rules
.cursor/hooks/
├── hooks.json
├── validate-shell.sh      # Gate dangerous commands
├── format-file.sh         # Auto-format after edits
├── audit-session.sh       # Session start/end logging
└── block-secrets.sh       # Prevent secret exposure
```

## Choose the Hook Event

### Common Agent Events

| Event | Use Case |
|-------|----------|
| `sessionStart` | Set up session, initialize logging |
| `sessionEnd` | Audit session, cleanup |
| `preToolUse` | Gate or modify tool calls |
| `postToolUse` | Add context after tool success |
| `postToolUseFailure` | Handle errors, log failures |
| `subagentStart` | Control subagent execution |
| `subagentStop` | Chain subagent workflows |
| `beforeShellExecution` | Gate terminal commands |
| `afterShellExecution` | Audit command output |
| `beforeMCPExecution` | Protect MCP tool calls |
| `beforeSubmitPrompt` | Validate prompts for policy |

### Event Quick Reference

| Goal | Event |
|------|-------|
| Block dangerous shell commands | `beforeShellExecution` |
| Audit shell output | `afterShellExecution` |
| Format files after edits | `afterFileEdit` |
| Block/rewrite specific tools | `preToolUse` |
| Add context after success | `postToolUse` |
| Control subagents | `subagentStart` |
| Chain subagent loops | `subagentStop` |
| Check for secrets in prompts | `beforeSubmitPrompt` |

## Hooks File Format

### Basic Structure

```json
{
  "hooks": {
    "beforeShellExecution": [
      {
        "command": ".cursor/hooks/validate-shell.sh"
      }
    ]
  },
  "version": 1
}
```

### Full Configuration

```json
{
  "hooks": {
    "preToolUse": [
      {
        "command": ".cursor/hooks/audit-tool.sh",
        "type": "command",
        "timeout": 30,
        "matcher": "Write|Edit",
        "failClosed": true
      }
    ],
    "postToolUse": [
      {
        "type": "prompt",
        "prompt": "Should I add tests for this change? $ARGUMENTS",
        "timeout": 10
      }
    ]
  },
  "version": 1
}
```

### Configuration Fields

| Field | Type | Description |
|-------|------|-------------|
| `command` | string | Shell command or script path |
| `type` | string | `"command"` or `"prompt"` |
| `timeout` | number | Timeout in seconds |
| `matcher` | string | Regex to filter events |
| `failClosed` | boolean | Block on failure if true |
| `loop_limit` | number | Max follow-up iterations |

## Matchers

### Purpose

Matchers filter when hooks run, avoiding unnecessary execution.

### Matcher Patterns

```json
// Match specific tool types
"matcher": "Write|Edit|Read"

// Match shell commands
"matcher": "npm install|yarn add"

// Match subagent types
"matcher": "generalPurpose|explore"

// Match file patterns
"matcher": "\\.tsx$|\\.ts$"
```

### Important Warnings

- Matchers use **JavaScript regular expressions**, not POSIX/grep
- Use `\s` instead of POSIX classes like `[[:space:]]`
- Start without matcher to confirm hook works, then add carefully

## Command Hooks

### Overview

Command hooks receive JSON on stdin and return JSON on stdout. They are the default type.

### Prerequisites

Before using command hooks, verify:
1. Script has valid shebang and is executable
2. All dependencies are installed and on `$PATH`
3. Repo-local CLIs are explicitly available

### Example: Shell Command Validator

```bash
#!/bin/bash
# .cursor/hooks/validate-shell.sh

input=$(cat)
command=$(echo "$input" | jq -r '.command // empty')

# Block dangerous commands
if echo "$command" | grep -qE "rm -rf|sudo|chmod 777"; then
  echo '{
    "permission": "deny",
    "user_message": "This command is blocked for safety.",
    "agent_message": "Hook blocked dangerous command: rm -rf, sudo, or chmod 777"
  }'
  exit 2
fi

# Warn on network commands
if echo "$command" | grep -qE "curl|wget|nc "; then
  echo '{
    "permission": "ask",
    "user_message": "This command makes a network request. Continue?",
    "agent_message": "Hook flagged network command"
  }'
  exit 0
fi

echo '{ "permission": "allow" }'
exit 0
```

### Exit Code Behavior

| Exit Code | Behavior |
|-----------|----------|
| 0 | Success, allow action |
| 2 | Block the action |
| Other | Fail open (unless `failClosed: true`) |

### Banking-Specific Hook Example

```bash
#!/bin/bash
# .cursor/hooks/banking-validate.sh

input=$(cat)
action=$(echo "$input" | jq -r '.name // empty')

case "$action" in
  "Write"|"Edit")
    file=$(echo "$input" | jq -r '.arguments.path // empty')
    
    # Block .env files
    if [[ "$file" == *".env"* ]]; then
      echo '{"permission": "deny", "user_message": "Cannot write .env files directly"}'
      exit 2
    fi
    
    # Warn on database migrations
    if [[ "$file" == *"migrations"* ]]; then
      echo '{"permission": "ask", "user_message": "This is a migration file. Continue?"}'
      exit 0
    fi
    ;;
esac

echo '{ "permission": "allow" }'
exit 0
```

## Prompt Hooks

### Overview

Prompt hooks use AI to make decisions. Useful when policy is easier to describe than script.

### Example

```json
{
  "hooks": {
    "beforeShellExecution": [
      {
        "type": "prompt",
        "prompt": "Is this command safe to run in a banking app? Consider: no destructive commands, no secret exposure, no unauthorized network calls. Input: $ARGUMENTS",
        "timeout": 15
      }
    ]
  },
  "version": 1
}
```

### When to Use

- Lightweight policy decisions
- Complex validation logic
- Natural language is clearer than scripts

### When to Prefer Command Hooks

- Deterministic behavior required
- Exact, auditable decisions needed
- Performance is critical

## Event Output Reference

### preToolUse

```json
{
  "permission": "allow|deny|ask",
  "user_message": "Optional message for user",
  "agent_message": "Optional message for agent",
  "updated_input": { ... }
}
```

### postToolUse

```json
{
  "additional_context": "Context to inject",
  "updated_mcp_tool_output": { ... }
}
```

### subagentStart

```json
{
  "permission": "allow|deny",
  "user_message": "Why subagent is blocked"
}
```

### subagentStop

```json
{
  "followup_message": "What to do next"
}
```

## Banking Project Hooks

### Session Logger Hook

```bash
#!/bin/bash
# .cursor/hooks/session-logger.sh

input=$(cat)
timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
event=$(echo "$input" | jq -r '.event // "unknown"')

echo "{\"timestamp\": \"$timestamp\", \"event\": \"$event\"}" >> .cursor/hooks/session.log
echo '{ "permission": "allow" }'
exit 0
```

### Format Hook

```bash
#!/bin/bash
# .cursor/hooks/format-file.sh

input=$(cat)
file=$(echo "$input" | jq -r '.arguments.path // empty')

if [[ "$file" == *.ts ]] || [[ "$file" == *.tsx ]]; then
  npx prettier --write "$file"
fi

echo '{ "permission": "allow" }'
exit 0
```

### Secrets Blocker

```bash
#!/bin/bash
# .cursor/hooks/block-secrets.sh

input=$(cat)
content=$(echo "$input" | jq -r '.arguments.content // ""')

if echo "$content" | grep -qE "(API_KEY|SECRET|PASSWORD|TOKEN)="; then
  echo '{"permission": "deny", "user_message": "Possible secret detected. Use env variables instead."}'
  exit 2
fi

echo '{ "permission": "allow" }'
exit 0
```

## Implementation Workflow

1. **Pick location**: Project vs user hook
2. **Choose event**: Narrowest matching event
3. **Create hooks.json**: Add hook definition
4. **Start simple**: No matcher or simple matcher
5. **Create script**: Implement behavior
6. **Make executable**: `chmod +x script.sh`
7. **Verify dependencies**: Check all tools available
8. **Test**: Trigger the event
9. **Debug**: Check Hooks settings tab

## Validation Commands

```bash
# Check hooks.json is valid JSON
cat .cursor/hooks.json | jq .

# List active hooks
# In Cursor: Settings > Extensions > Hooks

# Test hook manually
echo '{"command": "echo test"}' | .cursor/hooks/validate-shell.sh
```

## Troubleshooting

### Hook Not Loading

- Check hooks.json is valid JSON
- Verify file path is correct
- Restart Cursor

### Hook Not Firing

- Remove matcher to confirm base works
- Check matcher regex is valid
- Verify event is correct

### Script Errors

- Make script executable
- Check all dependencies installed
- Test script standalone first

### Permission Denied

- Check script has execute permission
- Verify working directory is correct

## Best Practices

### 1. Start Simple

```json
// First: No matcher
{"command": ".cursor/hooks/test.sh"}

// Then: Add matcher after confirmed working
{"command": ".cursor/hooks/test.sh", "matcher": "Write"}
```

### 2. Use failClosed Carefully

```json
{
  "command": ".cursor/hooks/security.sh",
  "failClosed": true  // Block on any error
}
```

### 3. Test Thoroughly

```bash
# Test each event type
echo '{"event": "preToolUse"}' | ./hook.sh
echo '{"event": "postToolUse"}' | ./hook.sh
```

### 4. Document Your Hooks

```bash
# Add header to hook scripts
#!/bin/bash
# Hook: beforeShellExecution
# Purpose: Block dangerous commands
# Dependencies: jq
```

## Cross-References

- **create-skill**: For creating new skills
- **session-logger**: For audit logging
- **security-skill**: For security patterns
- **testing-skill**: For testing patterns

## Performance Tips

1. Use matchers to avoid unnecessary runs
2. Keep scripts lightweight
3. Cache results when possible
4. Set appropriate timeouts

## Final Checklist

- [ ] Used correct location (project vs user)
- [ ] Chose narrowest correct event
- [ ] Added matcher when appropriate
- [ ] Returned only valid fields for event
- [ ] Made script executable
- [ ] Tested with real event
- [ ] Documented hook purpose
- [ ] Verified all dependencies

(End of file - total 500 lines)