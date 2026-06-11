# Section 12 — Error Handling & Logging

- Surface actionable error messages without leaking sensitive details.
- Use a central logger and include context (user id, request id) where appropriate.

Example:

```ts
try {
  await someOperation();
} catch (err) {
  logger.error("Failed to perform operation", { error: err.message });
  return { ok: false, error: "Operation failed" };
}
```
