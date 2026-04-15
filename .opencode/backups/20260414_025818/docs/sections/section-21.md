# Section 21 — Observability

- Add tracing and structured logs for critical paths.
- Capture errors with context (user id, request id) but never include secrets.

Example structured log call (pseudo):

```ts
logger.info("wallet.link.success", {
  userId: user.id,
  walletId: wallet.id
});
```
