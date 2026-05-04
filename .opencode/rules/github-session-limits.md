# GitHub Session Limits Rule

## Rule

When encountering the error "Too Many Requests: Sorry, you've exceeded your 5 hour session limits", implement the following mitigation strategy:

### Prevention

- Monitor session usage proactively using the `mystatus` tool
- Plan work sessions to stay within the 5-hour limit
- Take breaks between intensive coding sessions to reset the timer

### Mitigation

When the limit is hit:

1. **Wait it out** - The 5-hour session limit resets automatically after some time
2. **Use alternative tools** - Switch to alternative tools like:
   - Direct file editing
   - Command-line git operations
   - Local code analysis without AI assistance
3. **Plan around limits** - Schedule heavy AI-assisted work in shorter bursts

### Workaround

If the limit is frequently hit:

- Use the `mystatus` tool regularly to track quota usage
- Implement batch operations to maximize session efficiency
- Prioritize critical tasks during active sessions

## Reason

GitHub Copilot enforces a 5-hour session limit to prevent abuse. Understanding and working around this limit ensures continuous productivity.

## Enforcement

This rule is advisory - use `mystatus` to proactively monitor and avoid hitting session limits.
