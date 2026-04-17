---
name: deployment-skill
description: Deployment patterns for Vercel, Railway, and Docker for the Banking app.
lastReviewed: 2026-04-13
applyTo: "deploy/**"
---

# DeploymentSkill — Deployment Patterns

Overview

Follow platform docs; ensure ENCRYPTION_KEY and NEXTAUTH_SECRET are present in production envs.

Vercel Notes

- Use Environment variables in project settings; set `NEXTAUTH_URL`.

Railway / Docker

- Ensure DATABASE_URL and any provider credentials are configured.

Validation

- Run `npm run build` to verify production build.
