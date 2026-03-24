---
applyTo: "**/*.ts,**/*.tsx,**/*.js,**/*.jsx"
description: "Security best practices for Next.js/TypeScript projects."
---

# Security Best Practices

- Sanitize all user input (use zod/yup)
- Use HTTPS in production
- Set secure HTTP headers
- Never trust client input for authorization
- Store secrets in `.env.local` and never commit them
- Use server-side checks for sensitive actions
