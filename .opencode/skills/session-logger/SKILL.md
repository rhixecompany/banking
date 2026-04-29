---
name: session-logger
description: >-
  Logs all opencode coding agent session activity for audit and analysis. Use when tracking agent activity, auditing decisions, or analyzing session patterns.
metadata:
  surfaces:
    - cli
    - ide
    - chat
---

# Session Logger

Log all AI agent session activity for audit, analysis, and improvement. This comprehensive skill covers session logging patterns, implementation, and best practices across all AI agent platforms (OpenCode, Cursor, GitHub Copilot).

## When to Use This Skill

- Tracking agent activity during coding sessions
- Auditing agent decisions and actions
- Analyzing session patterns for improvement
- Compliance and debugging requirements
- Creating session reports

## Platform-Specific Considerations

### OpenCode

In OpenCode:
- Use built-in session logging features
- Access logs via session management tools
- Export session data for analysis
- Configure log levels and outputs

### Cursor

In Cursor IDE:
- Use the Activity Log panel
- Access session history in the sidebar
- Export session data via settings
- Configure logging preferences

### GitHub Copilot

In Copilot CLI or VS Code:
- Use VS Code's Output panel for logs
- Access Copilot chat history
- Configure telemetry settings
- Export session data

## 1. Session Logging Basics

### What to Log

| Category | Examples | Importance |
|----------|----------|------------|
| **Actions** | File reads, writes, edits | High |
| **Decisions** | Code choices, refactoring | High |
| **Errors** | Failures, exceptions | Critical |
| **Tool Usage** | Commands, API calls | Medium |
| **Context** | User requests, clarifications | High |
| **Outcomes** | Results, completions | High |

### Log Entry Structure

```json
{
  "timestamp": "2026-04-29T12:00:00Z",
  "sessionId": "session-123",
  "action": "file_read",
  "target": "src/app/page.tsx",
  "context": "User requested homepage update",
  "outcome": "success",
  "duration": 150
}
```

## 2. Implementation Patterns

### Pattern 1: Automatic Session Logging

Automatically capture all session activity:

```typescript
// OpenCode: Use session management
class SessionLogger {
  private sessionId: string;
  private logs: LogEntry[] = [];

  constructor(sessionId: string) {
    this.sessionId = sessionId;
  }

  log(action: string, target: string, context: string): void {
    this.logs.push({
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      action,
      target,
      context,
      outcome: "success"
    });
  }

  export(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}
```

### Pattern 2: Action-Based Logging

Log specific actions with rich context:

```typescript
// Log file operations
async function logFileOperation(
  operation: "read" | "write" | "edit",
  path: string,
  details: object
): Promise<void> {
  const entry = {
    timestamp: new Date().toISOString(),
    type: "file_operation",
    operation,
    path,
    ...details
  };
  await sessionLogger.addEntry(entry);
}
```

### Pattern 3: Decision Logging

Capture agent decisions with rationale:

```typescript
// Log decisions with context
function logDecision(
  decision: string,
  rationale: string,
  alternatives: string[],
  selected: string
): void {
  sessionLogger.log({
    type: "decision",
    decision,
    rationale,
    alternatives,
    selected,
    confidence: "high" // or "medium", "low"
  });
}
```

## 3. Session Metadata

### Essential Metadata

```typescript
interface SessionMetadata {
  sessionId: string;
  startTime: string;
  endTime?: string;
  agent: string;
  userId?: string;
  project?: string;
  tags: string[];
}
```

### Optional Metadata

```typescript
interface ExtendedMetadata extends SessionMetadata {
  model?: string;
  temperature?: number;
  tools?: string[];
  context?: object;
  environment?: {
    os: string;
    editor: string;
    version: string;
  };
}
```

## 4. Log Storage and Management

### Storage Options

| Storage Type | Use Case | Pros | Cons |
|--------------|----------|------|------|
| **Local Files** | Single sessions | Simple, private | No sharing |
| **Database** | Long-term storage | Searchable, scalable | Setup required |
| **Cloud Storage** | Team sharing | Accessible, backup | Privacy concerns |
| **Memory** | Short sessions | Fast, no I/O | Lost on restart |

### File-Based Storage

```bash
# Store sessions in project
mkdir -p .opencode/sessions

# Name format: YYYY-MM-DD-sessionId.json
# Example: 2026-04-29-abc123.json
```

### Database Storage

```typescript
// Store in database
async function saveSession(session: Session): Promise<void> {
  await db.sessions.insert({
    id: session.id,
    metadata: session.metadata,
    logs: session.logs,
    createdAt: new Date()
  });
}
```

## 5. Log Analysis

### Common Analysis Patterns

#### Session Duration

```typescript
// Calculate session duration
function analyzeSessionDuration(logs: LogEntry[]): DurationStats {
  const start = new Date(logs[0].timestamp);
  const end = new Date(logs[logs.length - 1].timestamp);
  return {
    total: end.getTime() - start.getTime(),
    averageActionTime: calculateAverage(logs)
  };
}
```

#### Action Frequency

```typescript
// Count action types
function analyzeActionFrequency(logs: LogEntry[]): Record<string, number> {
  return logs.reduce((acc, log) => {
    acc[log.action] = (acc[log.action] || 0) + 1;
    return acc;
  }, {});
}
```

#### Error Patterns

```typescript
// Identify error patterns
function analyzeErrors(logs: LogEntry[]): ErrorAnalysis {
  const errors = logs.filter(l => l.outcome === "error");
  return {
    total: errors.length,
    byType: groupBy(errors, "errorType"),
    byFile: groupBy(errors, "target")
  };
}
```

## 6. Session Replay

### Replay Implementation

```typescript
// Replay session from logs
async function replaySession(logs: LogEntry[]): Promise<void> {
  for (const log of logs) {
    await executeAction(log);
    await delay(100); // Add delay for readability
  }
}
```

### Replay Options

| Option | Description |
|--------|-------------|
| `real-time` | Replay at original speed |
| `fast` | Skip delays, show key moments |
| `step` | Manual stepping through logs |

## 7. Audit Trail

### Creating Audit Trails

```typescript
// Create audit trail for compliance
function createAuditTrail(session: Session): AuditTrail {
  return {
    sessionId: session.id,
    userId: session.userId,
    actions: session.logs.map(l => ({
      timestamp: l.timestamp,
      action: l.action,
      target: l.target,
      result: l.outcome
    })),
    exportedAt: new Date().toISOString()
  };
}
```

### Audit Trail Format

```json
{
  "auditTrail": {
    "sessionId": "session-123",
    "userId": "user-456",
    "exportedAt": "2026-04-29T12:00:00Z",
    "entries": [
      {
        "timestamp": "2026-04-29T10:00:00Z",
        "action": "file_write",
        "target": "src/app.tsx",
        "result": "success"
      }
    ]
  }
}
```

## 8. Configuration

### Log Level Configuration

```json
{
  "sessionLogger": {
    "level": "verbose",
    "levels": {
      "error": true,
      "warning": true,
      "info": true,
      "debug": false
    },
    "filters": {
      "excludePaths": ["node_modules", ".git"],
      "excludeActions": ["heartbeat", "ping"]
    }
  }
}
```

### Output Configuration

```json
{
  "sessionLogger": {
    "output": {
      "console": false,
      "file": {
        "enabled": true,
        "path": ".opencode/sessions",
        "format": "json"
      },
      "database": {
        "enabled": false,
        "connection": "postgresql://localhost:5432/logs"
      }
    }
  }
}
```

## 9. Privacy and Security

### Data Handling

```typescript
// Sanitize sensitive data
function sanitizeLogEntry(entry: LogEntry): LogEntry {
  return {
    ...entry,
    context: removeSensitiveData(entry.context),
    userId: hashUserId(entry.userId)
  };
}

// Remove patterns
function removeSensitiveData(text: string): string {
  return text
    .replace(/password=[^\s]+/g, "password=***")
    .replace(/apiKey=[^\s]+/g, "apiKey=***")
    .replace(/\b\d{3}-\d{2}-\d{4}\b/g, "***-**-****"); // SSN
}
```

### Privacy Settings

```json
{
  "sessionLogger": {
    "privacy": {
      "excludeSensitivePaths": [".env", "*.pem", "*.key"],
      "maskEnvironmentVars": true,
      "hashUserIds": true,
      "retentionDays": 30
    }
  }
}
```

## 10. Integration Patterns

### Integration with Tools

```typescript
// Integrate with OpenCode
class OpenCodeSessionLogger extends SessionLogger {
  async logToolUsage(tool: string, args: object): Promise<void> {
    this.log({
      type: "tool_usage",
      tool,
      args: sanitizeArgs(args),
      timestamp: new Date().toISOString()
    });
  }
}

// Integrate with Cursor
class CursorSessionLogger extends SessionLogger {
  async logEditorAction(action: EditorAction): Promise<void> {
    this.log({
      type: "editor_action",
      action: action.type,
      file: action.file,
      timestamp: new Date().toISOString()
    });
  }
}
```

### Export Formats

```typescript
// Export to various formats
enum ExportFormat {
  JSON = "json",
  CSV = "csv",
  Markdown = "md",
  HTML = "html"
}

async function exportSession(
  session: Session,
  format: ExportFormat
): Promise<string> {
  switch (format) {
    case ExportFormat.JSON:
      return JSON.stringify(session, null, 2);
    case ExportFormat.CSV:
      return convertToCSV(session.logs);
    case ExportFormat.Markdown:
      return convertToMarkdown(session);
    case ExportFormat.HTML:
      return convertToHTML(session);
  }
}
```

## 11. Best Practices

### Logging Best Practices

1. **Log consistently** - Use same structure for all entries
2. **Include timestamps** - Always include ISO timestamps
3. **Add context** - Include why, not just what
4. **Track outcomes** - Log success and failure
5. **Sanitize data** - Remove sensitive information
6. **Set retention** - Don't keep logs forever

### Session Management

1. **Unique session IDs** - Generate UUIDs for each session
2. **Clean startup/teardown** - Initialize and close properly
3. **Handle errors** - Log even when errors occur
4. **Export regularly** - Save session data periodically

### Analysis Best Practices

1. **Regular reviews** - Analyze sessions periodically
2. **Identify patterns** - Look for recurring issues
3. **Track improvements** - Measure progress over time
4. **Share insights** - Document findings for team

## 12. Troubleshooting

### Issue: Logs not being created

**Solution:**
1. Check log level configuration
2. Verify file/DB permissions
3. Check disk space

### Issue: Large log files

**Solution:**
1. Enable log rotation
2. Compress old logs
3. Set retention policy
4. Filter unnecessary entries

### Issue: Privacy concerns

**Solution:**
1. Enable sanitization
2. Hash user identifiers
3. Exclude sensitive paths
4. Set retention to minimum

## 13. Advanced Features

### Real-Time Monitoring

```typescript
// Real-time session monitoring
async function monitorSession(
  sessionId: string,
  onEvent: (event: LogEntry) => void
): Promise<void> {
  const stream = await sessionLogger.stream(sessionId);
  for await (const entry of stream) {
    onEvent(entry);
  }
}
```

### Session Comparison

```typescript
// Compare two sessions
function compareSessions(
  sessionA: Session,
  sessionB: Session
): SessionComparison {
  return {
    durationDiff: sessionB.duration - sessionA.duration,
    actionCountDiff: sessionB.logs.length - sessionA.logs.length,
    errorRateDiff: calculateErrorRate(sessionB) - calculateErrorRate(sessionA)
  };
}
```

## Cross-Platform Commands

| Platform | Command |
|----------|---------|
| OpenCode | Use session management tools |
| Cursor | Use Activity Log panel |
| Copilot | Use Output panel |

## Related Skills

- `code-review` - For reviewing session logs
- `agent-governance` - For governance patterns
- `create-skill` - For creating logging skills

## Notes

- Always respect privacy when logging
- Set appropriate retention policies
- Sanitize sensitive data before storage
- Regularly analyze logs for patterns