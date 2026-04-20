---
applyTo: "**/*"
---

# Security Guidelines

- Never commit secrets or .env files. Use app-config.ts and environment management.
- Validate and sanitize all external inputs; use Zod and strict typing.
- Follow the principle of least privilege for secrets and external services.
- Add logging and monitoring for auth failures and suspicious activity.
- Keep dependencies up-to-date and respond to known CVEs promptly.
