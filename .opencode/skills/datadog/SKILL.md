---
name: datadog
description: "Datadog observability for debugging and incident triage. Use when investigating production errors, tracing distributed requests, comparing error trends, or checking service health. Covers log search, metrics queries, error patterns, and real-time log tailing. Trigger phrases: 'check Datadog', 'search logs', 'what errors happened', 'compare error rates', 'is service X healthy', 'tail errors', 'trace this request ID', 'find log patterns', 'what's the error distribution'."
---

# Datadog

This skill helps you interact with Datadog through the unofficial datadog-cli to search logs, query metrics, tail logs in real-time, trace distributed requests, investigate errors, compare time periods, and identify log patterns.

## Before You Start

**MANDATORY**: Ensure DD_API_KEY and DD_APP_KEY environment variables are set. Consult [`reference/installation.md`](reference/installation.md) for setup instructions if needed.

## When to Use This Skill

Use when:

1. **Investigating production errors or anomalies** — diagnose failures, trace error sources
2. **Comparing error rates across time periods** — detect regressions, verify fixes
3. **Tracing distributed requests via trace IDs** — follow requests across services
4. **Checking service health during incidents** — verify system status, identify bottlenecks
5. **Analyzing log patterns to find root cause** — discover common signatures, spot trends

Trigger phrases:

- "check Datadog", "search logs", "what errors happened", "compare error rates"
- "is service X healthy", "tail errors", "trace this request ID"
- "find log patterns", "what's the error distribution", "compare error trends"

---

## Observability Thinking: Mental Models for Expert Debugging

Before running any Datadog command, establish your **investigation framework**. Experts think this way:

### Frame 1: Is This NEW or REGRESSION?

```
NEW ERROR (never seen before):
  ├─ Check recent deployments (likely root cause)
  ├─ Check config changes (env, feature flags, quota updates)
  └─ Baseline: Compare to 24h ago — if similar volume, it's a normal fluctuation

REGRESSION (error was fine, now broken):
  ├─ Compare error signature to baseline (same error type?)
  ├─ Check deployment timeline (when did it start?)
  └─ Use log patterns to find what changed in the error message
```

**Mental model**: Narrowing scope first (Is this actually new?) saves hours of misdirected investigation.

### Frame 2: Scope — ALL Users or SEGMENT?

```
ALL USERS affected:
  └─ Likely infrastructure/deployment/API issue

SEGMENT affected (region, browser, user group):
  ├─ Check user attributes (geo, app version, client type)
  ├─ Use facet queries: --facet @http.user_agent, @geo.country
  └─ Segment issues often hide in client-specific code paths
```

**Mental model**: Segmented failures reveal which layer failed (client code? regional API? specific version?).

### Frame 3: Choose Your Search Strategy

| Scenario | Best Command | Why | Example |
| --- | --- | --- | --- |
| You have exact error message | `logs search` | Precise match finds all instances | `service:api "DatabaseConnectionError"` |
| You have trace ID | `logs trace --id` | Follow request through all services | Correlates across service boundaries |
| You know affected service but not error | `logs agg --facet status` | See error distribution before diving deep | Find "is 50% 500s or 1% of errors?" |
| You only know time window | `logs patterns` | Discover common signatures blindly | "What broke at 3am?" |
| Broad investigation (no specifics) | `logs patterns` + `compare` | Find NEW signatures that didn't exist 24h ago | Spot emerging issues |

**Mental model**: Match your command to what you already know. Knowing→Precision. Blind→Patterns.

### Frame 4: Distributed Systems RULE #1: Correlate with Trace IDs

```
WRONG: "These logs at 10:30:00 look related."
         ↓
         Danger: Could be different requests (timestamp collision)

CORRECT: "These logs share trace ID abc123, across 5 services."
          ↓
          Verified: Same request, full context
```

**Mental model**: Timestamps are worthless in distributed systems. Always verify with trace IDs, service names, or correlation IDs.

---

## Anti-Patterns: NEVER Do These

These are expert-learned warnings. Breaking these causes lost hours of debugging:

### NEVER use overly broad queries

```
❌ WRONG: datadog logs search --query "*" --from 24h
         (Query timeout in large systems. Query returns nothing but takes forever.)

✅ CORRECT: datadog logs search --query "status:error" --from 1h
           (Narrow first: target status, service, or known attribute)
```

**Why**: Distributed systems log 1000s of events/minute. `*` means "give me everything" → timeouts.

---

### NEVER assume `--limit` means "all errors"

```
❌ WRONG: datadog logs search --query "status:error" --limit 100
         "I got 100 errors, so the system is mostly broken"

✅ CORRECT: datadog logs agg --query "status:error" --facet service --from 1h
           "I got 100 errors out of 50,000 total requests (0.2% error rate)"
```

**Why**: High-volume systems can have thousands of errors/minute. Limit=100 is just the first page.

---

### NEVER correlate logs by timestamp alone

```
❌ WRONG: "These error logs at 10:30:00 must be related to the web UI timeout"
         (Different services, same second ≠ related)

✅ CORRECT: datadog logs trace --id "trace_abc123"
           (Follow request through all services via trace ID)
```

**Why**: Many services log at the same second. Coincidence ≠ causation.

---

### NEVER alert on raw metrics without baseline

```
❌ WRONG: Alert when avg:system.cpu.user > 50%
         (Triggers daily at 10am when users wake up; alert fatigue)

✅ CORRECT: Alert when avg:system.cpu.user > 50% AND > 2 std dev from rolling baseline
           (Alerts only on abnormal spikes, not normal workload)
```

**Why**: Raw thresholds breed false positives. Use anomaly detection or baseline comparison.

---

### NEVER skip checking trace context

```
❌ WRONG: "Found an error log, that's the problem"
         (Single error is useless; need context)

✅ CORRECT: datadog logs trace --id "trace_from_error" --from 30m
           (See what happened before/after in all related services)
```

**Why**: Errors are symptoms. Traces show the disease. A single error log is a data point, not a diagnosis.

---

### NEVER trust log patterns as RCA (Root Cause Analysis)

```
❌ WRONG: "Patterns show 'Connection refused', so the database is down"
         (Pattern is what broke, not why)

✅ CORRECT: "Patterns show 'Connection refused'. Now trace those errors to find:
            - Which service originated the request?
            - What changed in that service recently?"
           (Pattern tells you what to investigate, not what caused it)
```

**Why**: Patterns show signatures, not causation. They narrow the investigation scope.

---

### NEVER set query FROM to future timestamp

```
❌ WRONG: datadog logs search --query "status:error" --from 1h
         (If you ran this at 10:05am, you miss logs from 10:00-10:05)

✅ CORRECT: datadog logs search --query "status:error" --from "2024-01-15T09:00:00Z" --to "2024-01-15T10:00:00Z"
           (Absolute timestamps ensure you capture all historical logs)
```

**Why**: Relative times (`1h`) are calculated when the command runs. Add 5m delay and you miss recent logs.

---

### NEVER ignore percentiles when checking performance

```
❌ WRONG: "avg latency is 100ms, so performance is fine"
         (Average hides tail latency; 99th percentile might be 5s)

✅ CORRECT: datadog metrics query --query "p99:trace.http.request.duration{service:api}"
           (P99 shows what slow users experience)
```

**Why**: Averages hide the bad experiences. Percentiles (p50, p95, p99) reveal user impact.

---

### NEVER query without time windows

```
❌ WRONG: datadog logs search --query "status:error"
         (Searches all time; unbounded query = timeout)

✅ CORRECT: datadog logs search --query "status:error" --from 1h
           (Scoped to 1 hour; bounded query = fast response)
```

**Why**: Unbounded queries timeout. Always include `--from` and optionally `--to`.

---

### NEVER assume service names are stable

```
❌ WRONG: service:api-server
         (Service renamed to "backend-api" last week; no results)

✅ CORRECT: datadog services --from 24h
           (List actual service names in your system right now)
```

**Why**: Service names change with deployments. Verify current names first.

---

## Investigation Workflow: Step-by-Step Thinking

Follow this workflow when investigating incidents. Each step narrows scope:

### Step 1: Establish Baseline (What's normal?)

**Before querying**, answer:

- **When did it start?** (recent? during a deployment?)
  - Check: `datadog logs compare --query "status:error" --period 1h` (now vs 1h ago)
  - Check: Recent git log or deployment history
- **Who's affected?**
  - All users → Infrastructure issue
  - Segment → Client/version-specific issue (use facets: `@geo.country`, `@http.user_agent`)

- **Is this new or regression?**
  - New: No baseline exists
  - Regression: Compare error signature to 24h ago
    ```bash
    datadog logs patterns --query "status:error" --from 1h
    datadog logs patterns --query "status:error" --from "2024-01-14T10:00:00Z" --from "2024-01-14T11:00:00Z"
    # Compare signatures: Are the patterns the same?
    ```

### Step 2: Search Strategy (What command?)

**Match command to what you know:**

| You Know | Command | Purpose |
| --- | --- | --- |
| Exact error message | `logs search` | Pinpoint matching logs |
| Trace ID | `logs trace --id` | Follow across services |
| Service name only | `logs agg --facet` | See error distribution |
| Time window only | `logs patterns` | Discover signatures blindly |
| Nothing specific | `logs compare` | Is this new vs 24h ago? |

### Step 3: Narrow Scope (Reduce noise)

```bash
# Wrong: Too broad
datadog logs search --query "status:error" --from 24h

# Right: Scoped to service + time
datadog logs search --query "service:api status:error" --from 1h

# Better: Include failure type
datadog logs search --query "service:api status:error @http.status_code:500" --from 1h
```

### Step 4: Follow the Trace (Multi-service context)

```bash
# Found an error? Get its trace ID from the log output
datadog logs trace --id "trace_abc123def456"

# This shows the FULL picture across all services involved
# Check: Did service-A call service-B? Where did it fail?
```

### Step 5: Compare to Baseline (Is it new?)

```bash
# Compare current errors to 24h ago
datadog logs compare --query "status:error service:api" --period 1h
# Output: "Now: 50 errors, 24h ago: 2 errors" → 25x increase (regression!)
```

### Step 6: Extract Actionable Insight

- ✅ If NEW: Check recent changes (deployments, config, feature flags)
- ✅ If REGRESSION: Compare error signatures to find what changed
- ✅ If SEGMENT: Use facets to identify the pattern (geo? browser? user group?)
- ✅ If SPIKE: Check metrics for infrastructure impact (CPU, memory, disk)

---

## Command Reference

```bash
datadog logs search --query "<query>" [--from <time>] [--to <time>] [--limit <n>] [--sort <order>]
```

**Examples:**

```bash
datadog logs search --query "status:error" --from 1h
datadog logs search --query "service:api status:error @http.status_code:500" --from 1h
```

### Live Tail (Real-time Streaming)

Stream logs as they arrive. Press Ctrl+C to stop.

```bash
datadog logs tail --query "<query>" [--interval <seconds>]
```

**Examples:**

```bash
datadog logs tail --query "status:error"
datadog logs tail --query "service:api" --interval 5
```

### Trace Correlation

Find all logs for a distributed trace across services.

```bash
datadog logs trace --id "<trace-id>" [--from <time>] [--to <time>]
```

**Example:**

```bash
datadog logs trace --id "abc123def456" --from 24h
```

### Log Context

Get logs before and after a specific timestamp to understand what happened.

```bash
datadog logs context --timestamp "<iso-timestamp>" [--before <time>] [--after <time>] [--service <svc>]
```

**Examples:**

```bash
datadog logs context --timestamp "2024-01-15T10:30:00Z" --before 5m --after 2m
datadog logs context --timestamp "2024-01-15T10:30:00Z" --service api --before 10m
```

### Error Summary

Quick breakdown of errors by service, type, and message.

```bash
datadog errors [--from <time>] [--to <time>] [--service <svc>]
```

**Examples:**

```bash
datadog errors --from 1h
datadog errors --service payment-api --from 24h
```

### Period Comparison

Compare log counts between current period and previous period.

```bash
datadog logs compare --query "<query>" --period <time>
```

**Examples:**

```bash
datadog logs compare --query "status:error" --period 1h
datadog logs compare --query "service:api status:error" --period 6h
```

### Log Patterns

Group similar log messages to find patterns (replaces UUIDs, numbers, etc.).

```bash
datadog logs patterns --query "<query>" [--from <time>] [--limit <n>]
```

**Examples:**

```bash
datadog logs patterns --query "status:error" --from 1h
datadog logs patterns --query "service:api" --from 6h --limit 1000
```

### Service Discovery

List all services with recent log activity.

```bash
datadog services [--from <time>] [--to <time>]
```

**Example:**

```bash
datadog services --from 24h
```

### Log Aggregation

```bash
datadog logs agg --query "<query>" --facet <facet> [--from <time>]
```

**Common facets:** `status`, `service`, `host`, `@http.status_code`, `@error.kind`

**Examples:**

```bash
datadog logs agg --query "*" --facet status --from 1h
datadog logs agg --query "status:error" --facet service --from 24h
```

### Multiple Queries

Run multiple queries in parallel.

```bash
datadog logs multi --queries "name1:query1,name2:query2" [--from <time>]
```

**Example:**

```bash
datadog logs multi --queries "errors:status:error,warnings:status:warn" --from 1h
```

### Metrics Query

```bash
datadog metrics query --query "<metrics-query>" [--from <time>] [--to <time>]
```

**Query format:** `<aggregation>:<metric>{<tags>}`

**Examples:**

```bash
datadog metrics query --query "avg:system.cpu.user{*}" --from 1h
datadog metrics query --query "avg:system.cpu.user{service:api}" --from 1h
datadog metrics query --query "sum:trace.http.request.errors{service:api}.as_count()" --from 1h
```

## Global Flags

| Flag              | Description                         |
| ----------------- | ----------------------------------- |
| `--pretty`        | Human-readable output with colors   |
| `--output <file>` | Export results to JSON file         |
| `--site <site>`   | Datadog site (e.g., `datadoghq.eu`) |

## Time Formats

- Relative: `30m`, `1h`, `6h`, `24h`, `7d`
- ISO 8601: `2024-01-15T10:30:00Z`

## Common Workflows

### Incident Triage

```bash
# 1. Quick error overview
datadog errors --from 1h

# 2. Is this new? Compare to previous period
datadog logs compare --query "status:error" --period 1h

# 3. What patterns are we seeing?
datadog logs patterns --query "status:error" --from 1h

# 4. Narrow down by service
datadog logs search --query "status:error service:payment-api" --from 1h

# 5. Get context around a specific timestamp
datadog logs context --timestamp "2024-01-15T10:30:00Z" --service api --before 5m --after 2m

# 6. Follow the distributed trace
datadog logs trace --id "TRACE_ID"
```

### Real-time Debugging

```bash
# Stream errors as they happen
datadog logs tail --query "status:error"

# Watch specific service
datadog logs tail --query "service:api status:error"
```

### Service Health Check

```bash
# List services
datadog services --from 24h

# Check error distribution
datadog logs agg --query "service:api" --facet status --from 1h

# Check CPU/memory
datadog metrics query --query "avg:system.cpu.user{service:api}" --from 1h
```

### Export for Sharing

```bash
# Save search results
datadog logs search --query "status:error" --from 1h --output errors.json

# Save error summary
datadog errors --from 24h --output error-report.json
```

## Datadog Query Syntax

| Operator  | Example                       | Description        |
| --------- | ----------------------------- | ------------------ |
| `AND`     | `service:api status:error`    | Both conditions    |
| `OR`      | `status:error OR status:warn` | Either condition   |
| `-`       | `-status:info`                | Exclude            |
| `*`       | `service:api-*`               | Wildcard           |
| `>=` `<=` | `@http.status_code:>=400`     | Numeric comparison |
| `[TO]`    | `@duration:[1000 TO 5000]`    | Range              |

### Common Attributes

- `service` - Service name
- `status` - Log level (error, warn, info, debug)
- `host` - Hostname
- `@http.status_code` - HTTP status code
- `@error.kind` - Error type
- `@trace_id` / `@dd.trace_id` - Trace ID

---

## Troubleshooting: What If...

### Query Times Out

**Problem**: Command returns nothing or takes >30 seconds

**Solution**:

1. Add more restrictive filters: `status:error service:api @http.status_code:500`
2. Reduce time window: `--from 30m` instead of `--from 24h`
3. Switch to `logs patterns` instead (slower but more forgiving)

**Why**: Broad queries scan more data. Every filter reduces scan size exponentially.

---

### Trace ID Returns No Results

**Problem**: `datadog logs trace --id "abc123"` finds nothing

**Solution**:

1. Verify trace ID format (should be UUID or hex string)
2. Check if time window includes when trace was generated: `--from 30m --to now`
3. Fall back to `logs search` with service name and timestamp

**Why**: Trace IDs expire. Long-running traces may have traces beyond retention window.

---

### No Results from Logs Search

**Problem**: Query looks correct but returns empty

**Solution**:

1. Verify service name exists: `datadog services --from 1h`
2. Check if time window has activity: Try `--from 24h` (wider window)
3. Remove filters one by one to find which one is too restrictive
4. Try `logs patterns --query "*"` to see what data exists

**Why**: Typos in service names or attributes are silent failures. Verify baseline data exists.

---

### Metrics Query Returns Unexpected Aggregation

**Problem**: `avg:system.cpu.user` hides spikes (average can be 50% but p99 is 95%)

**Solution**:

- Always check percentiles: `p95:system.cpu.user`, `p99:system.cpu.user`
- For latency: Use `p99` not `avg` (users experience the tail)
- For errors: Use `count` or `sum` not `avg` (aggregating percentages is misleading)

**Why**: Averages hide tail behavior. Percentiles show what users actually experience.

---

## Decision Tree: Which Command?

```
START: "I need to investigate an issue"
│
├─ Do I have a trace ID?
│  ├─ YES → Use: datadog logs trace --id "..."
│  └─ NO ↓
│
├─ Do I have an exact error message?
│  ├─ YES → Use: datadog logs search --query "error message"
│  └─ NO ↓
│
├─ Do I know the affected service?
│  ├─ YES, and service name → Use: datadog logs agg --facet status
│  └─ NO ↓
│
├─ Do I only have a time window?
│  ├─ YES → Use: datadog logs patterns --from ...
│  └─ NO ↓
│
└─ Need to detect NEW issues (vs baseline)?
   └─ Use: datadog logs compare --period 1h
```

---

## Expert Tips

1. **Always start with `logs patterns`** — Find common signatures first, then narrow with search
2. **Never trust a single log** — Always follow with trace ID to see the full context
3. **Compare before investigating** — Is this actually new? `logs compare` answers in seconds
4. **Use facets to segment** — Before deep-diving, break down by service/status/geo to find patterns
5. **Trace ID is your friend** — When you find an error, its trace ID links to all related logs across services
6. **Percentiles > Averages** — For performance, always check p99 not avg
7. **Service names change** — Verify with `datadog services --from 1h` before assuming names
