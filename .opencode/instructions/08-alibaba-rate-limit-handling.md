---
name: "alibaba-rate-limit-handling"
description: "How to handle Alibaba API rate-limit errors — adjust client logic to scale requests smoothly"
applyTo: "**"
---

# Alibaba AI Provider Rate Limit Handling

## Error Message

```
Upstream error from Alibaba: Request rate increased too quickly. To ensure system stability, please scale requests more smoothly over time.
```

## Root Cause

Alibaba's API enforces rate limits to protect system stability. When too many requests are sent in a short burst, the API rejects them with this error.

## Fixes

### 1. Add Exponential Backoff with Jitter

```typescript
async function fetchWithRetry(
  fn: () => Promise<unknown>,
  maxRetries = 3
): Promise<unknown> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      const isRateLimit =
        error instanceof Error &&
        error.message.includes("Request rate increased too quickly");

      if (!isRateLimit || i === maxRetries - 1) throw error;

      // Exponential backoff with jitter: 1s, 2s, 4s + random
      const delay =
        Math.min(1000 * 2 ** i, 8000) + Math.random() * 1000;
      await new Promise(r => setTimeout(r, delay));
    }
  }
}
```

### 2. Reduce Parallel Tool Calls

**BAD** — Sends all requests simultaneously:

```typescript
// Too many parallel calls triggers rate limit
const [a, b, c, d, e] = await Promise.all([
  fetchA(),
  fetchB(),
  fetchC(),
  fetchD(),
  fetchE()
]);
```

**GOOD** — Batch with controlled concurrency:

```typescript
// Process in smaller batches with delays
async function batchProcess<T>(
  items: T[],
  batchSize: number,
  fn: (item: T) => Promise<unknown>
): Promise<void> {
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    await Promise.all(batch.map(fn));
    if (i + batchSize < items.length) {
      await new Promise(r => setTimeout(r, 1500)); // 1.5s between batches
    }
  }
}
```

### 3. Sequential Processing for Heavy Operations

```typescript
// Process one at a time for rate-limited APIs
for (const item of items) {
  await processItem(item);
  await new Promise(r => setTimeout(r, 500)); // 500ms between requests
}
```

### 4. Request Queue with Rate Limiter

```typescript
class RateLimitedQueue {
  private queue: Array<() => Promise<unknown>> = [];
  private running = false;

  constructor(
    private maxConcurrent: number,
    private delayMs: number
  ) {}

  async add<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          resolve(await fn());
        } catch (error) {
          reject(error);
        }
      });
      this.process();
    });
  }

  private async process(): Promise<void> {
    if (this.running || this.queue.length === 0) return;
    this.running = true;

    while (this.queue.length > 0) {
      const batch = this.queue.splice(0, this.maxConcurrent);
      await Promise.all(batch.map(fn => fn()));
      if (this.queue.length > 0) {
        await new Promise(r => setTimeout(r, this.delayMs));
      }
    }
    this.running = false;
  }
}

// Usage: max 2 concurrent, 1s between batches
const queue = new RateLimitedQueue(2, 1000);
await queue.add(() => fetchWithRetry(expensiveApi));
```

## Best Practices

| Practice                | Value       |
| ----------------------- | ----------- |
| Max concurrent requests | 2-3         |
| Delay between batches   | 1000-2000ms |
| Max retries             | 3           |
| Base backoff delay      | 1000ms      |
| Max backoff delay       | 8000ms      |
| Jitter range            | 0-1000ms    |

## What NOT To Do

- Do NOT add rate limit error messages to AGENTS.md or project documentation
- Do NOT create documentation files about rate limits (this file is the exception)
- Do NOT modify project files to "fix" upstream errors
- Do NOT commit changes that reference provider errors

## When This Applies

This instruction applies to any tool call that hits the Alibaba AI API, including:

- Web search operations
- Code search operations
- Documentation fetch operations
- Any parallel tool calls that generate multiple API requests

Agentic note: If you encounter these errors while running parallel tool calls, reduce concurrency and retry. Do not document transient upstream messages in repo docs.

## Quick Fix Checklist

1. [ ] Identify the operation causing rate limits
2. [ ] Reduce parallel calls to sequential or batched
3. [ ] Add 500-1500ms delays between batches
4. [ ] Implement exponential backoff with jitter
5. [ ] Test with reduced concurrency (max 2-3 parallel)
