# Section 21 — Observability

- Add tracing and structured logs for critical business paths.
- Capture contextual metadata (userId, requestId) but never include secrets.

Example:

```ts
logger.info("wallet.link.success", {
  userId: user.id,
  walletId: wallet.id
});
```
