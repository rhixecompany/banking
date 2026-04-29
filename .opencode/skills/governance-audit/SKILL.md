---
name: governance-audit
description: Scans opencode agent prompts for threat signals and logs governance events
lastReviewed: 2026-04-29
applyTo: "opencode/**"
platforms:
  - opencode
  - cursor
  - copilot
---

# Governance Audit - AI Agent Safety

## Overview

This skill provides patterns and techniques for adding governance, safety, and trust controls to AI agent systems. It covers policy enforcement, audit trails, and threat detection.

## Multi-Agent Commands

### OpenCode
```bash
# Run governance scan
bun run scripts/governance-scan.ts

# Check audit logs
tail -f logs/governance.log

# Verify policies
bun run verify:policies
```

### Cursor
```
@governance-audit
Add governance to the banking agent
```

### Copilot
```
/governance enable audit
```

## Governance Architecture

### Components

1. **Policy Engine**: Enforces rules
2. **Audit Logger**: Records all actions
3. **Threat Detector**: Identifies dangerous prompts
4. **Trust Scorer**: Scores agent confidence

### Flow

```
User Prompt → Threat Detector → Policy Engine → Agent Action → Audit Logger
                    ↓                                    ↓
              Block/Flag                          Log Event
```

## Policy Enforcement

### Policy Types

```typescript
// Allow/Block policies
type Policy = {
  id: string;
  name: string;
  type: 'allow' | 'block' | 'rate_limit';
  condition: (prompt: string) => boolean;
  action: 'block' | 'flag' | 'log';
};

// Rate limiting
type RateLimit = {
  windowMs: number;
  maxRequests: number;
  scope: 'user' | 'agent';
};
```

### Policy Examples

```typescript
const policies: Policy[] = [
  {
    id: 'no-system-override',
    name: 'Block system prompt override',
    type: 'block',
    condition: (prompt) => /ignore (previous|all) (instructions|prompts)/i.test(prompt),
    action: 'block'
  },
  {
    id: 'no-credential-access',
    name: 'Block credential access',
    type: 'block',
    condition: (prompt) => /show (me )?(password|secret|token|key)/i.test(prompt),
    action: 'block'
  },
  {
    id: 'sensitive-data-flag',
    name: 'Flag sensitive data queries',
    type: 'allow',
    condition: (prompt) => /(ssn|social security|credit card|bank account)/i.test(prompt),
    action: 'flag'
  }
];
```

## Threat Detection

### Semantic Classification

```typescript
interface ThreatClassification {
  category: 'injection' | 'extraction' | 'bypass' | 'none';
  confidence: number; // 0-1
  signals: string[];
}

function classifyThreat(prompt: string): ThreatClassification {
  const signals: string[] = [];

  // Injection patterns
  if (prompt.includes('ignore') && prompt.includes('instructions')) {
    signals.push('instruction_override_detected');
  }

  // Extraction patterns
  if (prompt.match(/show\s+(all|every)\s+(file|secret)/i)) {
    signals.push('bulk_extraction_detected');
  }

  // Bypass patterns
  if (prompt.includes('jailbreak') || prompt.includes(' DAN ')) {
    signals.push('bypass_attempt_detected');
  }

  const category = signals.length > 0 ? 'injection' : 'none';
  const confidence = signals.length > 0 ? 0.8 : 0.0;

  return { category, confidence, signals };
}
```

### Intent Classification

```typescript
type Intent = 'read' | 'write' | 'execute' | 'admin' | 'unknown';

function classifyIntent(prompt: string): Intent {
  const writePatterns = /(delete|remove|update|modify|create)/i;
  const executePatterns = /(run|execute|install|deploy)/i;
  const adminPatterns = /(admin|root|sudo|grant)/i;

  if (adminPatterns.test(prompt)) return 'admin';
  if (executePatterns.test(prompt)) return 'execute';
  if (writePatterns.test(prompt)) return 'write';
  if (prompt.includes('get') || prompt.includes('show')) return 'read';

  return 'unknown';
}
```

## Trust Scoring

### Score Calculation

```typescript
interface TrustScore {
  overall: number;        // 0-100
  components: {
    intent: number;
    history: number;
    context: number;
  };
  factors: string[];
}

function calculateTrustScore(
  userId: string,
  prompt: string,
  context: AgentContext
): TrustScore {
  let score = 100;

  // Intent-based scoring
  const intent = classifyIntent(prompt);
  if (intent === 'admin') score -= 30;
  if (intent === 'execute') score -= 20;
  if (intent === 'unknown') score -= 10;

  // History-based scoring
  const userHistory = getUserHistory(userId);
  const violationCount = userHistory.filter(h => h.violation).length;
  score -= violationCount * 10;

  // Context-based scoring
  if (context.ipChanged) score -= 20;
  if (context.timeOfDay === 'suspicious') score -= 10;

  return {
    overall: Math.max(0, score),
    components: {
      intent: intent === 'read' ? 100 : 50,
      history: Math.max(0, 100 - violationCount * 20),
      context: context.trusted ? 100 : 60
    },
    factors: ['intent_check', 'history_check', 'context_check']
  };
}
```

## Audit Trail

### Event Structure

```typescript
interface GovernanceEvent {
  id: string;
  timestamp: Date;
  eventType: 'prompt' | 'action' | 'response' | 'violation';
  userId: string;
  agentId: string;
  prompt?: string;
  action?: string;
  response?: string;
  threatLevel: 'none' | 'low' | 'medium' | 'high';
  trustScore: number;
  metadata: Record<string, unknown>;
}
```

### Logging Events

```typescript
async function logEvent(event: GovernanceEvent): Promise<void> {
  const logEntry = {
    ...event,
    timestamp: event.timestamp.toISOString(),
    // Hash sensitive data
    prompt: event.prompt ? hashSensitive(event.prompt) : undefined
  };

  await db.governanceLogs.insert(logEntry);

  // Alert on high severity
  if (event.threatLevel === 'high') {
    await alertSecurityTeam(event);
  }
}
```

### Querying Logs

```typescript
async function getAuditTrail(
  userId: string,
  options: { startDate?: Date; endDate?: Date }
): Promise<GovernanceEvent[]> {
  return db.governanceLogs
    .select()
    .from(users)
    .where(eq(governanceLogs.userId, userId))
    .orderBy(desc(governanceLogs.timestamp));
}
```

## Rate Limiting

### Implementation

```typescript
class RateLimiter {
  private limits = new Map<string, RateLimitState>();

  async check(userId: string, scope: string): Promise<boolean> {
    const key = `${userId}:${scope}`;
    const state = this.limits.get(key) || { count: 0, windowStart: Date.now() };

    const windowMs = 60000; // 1 minute
    const maxRequests = 10;

    if (Date.now() - state.windowStart > windowMs) {
      state.count = 0;
      state.windowStart = Date.now();
    }

    state.count++;
    this.limits.set(key, state);

    if (state.count > maxRequests) {
      await logEvent({
        eventType: 'violation',
        userId,
        threatLevel: 'medium',
        action: 'rate_limit_exceeded'
      });
      return false;
    }

    return true;
  }
}
```

## Banking-Specific Governance

### Financial Actions

```typescript
const financialPolicies: Policy[] = [
  {
    id: 'large-transfer-approval',
    name: 'Require approval for large transfers',
    type: 'allow',
    condition: (prompt) => /transfer.*(\$|amount).*(10000|10k)/i.test(prompt),
    action: 'flag'
  },
  {
    id: 'bulk-export-restrict',
    name: 'Restrict bulk data export',
    type: 'block',
    condition: (prompt) => /export.*(all|every|bulk).*(transaction|user)/i.test(prompt),
    action: 'block'
  }
];
```

### Data Access

```typescript
const dataPolicies: Policy[] = [
  {
    id: 'pii-access-log',
    name: 'Log all PII access',
    type: 'allow',
    condition: (prompt) => /(ssn|address|phone|email).*(get|show|list)/i.test(prompt),
    action: 'log'
  }
];
```

## Best Practices

### 1. Fail Securely

```typescript
function enforcePolicy(prompt: string): PolicyResult {
  for (const policy of policies) {
    if (policy.condition(prompt) && policy.type === 'block') {
      return { allowed: false, reason: policy.name };
    }
  }
  return { allowed: true };
}
```

### 2. Log Everything

```typescript
// Always log, even allowed actions
await logEvent({
  eventType: 'prompt',
  prompt: prompt.substring(0, 1000), // Truncate long prompts
  allowed: true
});
```

### 3. Regular Audits

```typescript
// Daily audit report
async function generateDailyReport(): Promise<AuditReport> {
  const events = await db.governanceLogs
    .select()
    .where(gte(governanceLogs.timestamp, yesterday()));

  return {
    totalEvents: events.length,
    violations: events.filter(e => e.threatLevel !== 'none').length,
    topThreats: getTopThreats(events),
    recommendations: generateRecommendations(events)
  };
}
```

## Cross-References

- **agent-governance**: For governance patterns
- **security-skill**: For security implementation
- **testing-skill**: For testing patterns

## Validation Commands

```bash
# Run audit scan
bun run scripts/governance-scan.ts

# Check policy violations
grep -r "VIOLATION" logs/governance.log

# Generate report
bun run governance:report --daily
```

## Performance Tips

1. Use async logging
2. Batch database writes
3. Implement log rotation
4. Cache policy results