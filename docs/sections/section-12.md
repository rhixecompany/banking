# Section 12 — Error Handling & Logging

- Surface actionable error messages; avoid leaking secrets.
- Use a central logger utility when available.

Example pattern:

```ts
try {
  await someOperation();
} catch (err) {
  logger.error("Failed to perform operation", { error: err.message });
  return { ok: false, error: "Operation failed" };
}
```
