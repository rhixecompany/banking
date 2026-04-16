---
name: optimize-docker-compose
overview: "Harden and simplify the existing Docker Compose + Dockerfile setup: remove secret leakage via build args, make env handling consistent with the repo’s scripts, and improve dev/prod ergonomics (healthchecks, profiles, Node version pinning)."
todos:
  - id: scan-docker-assets
    content: Review existing Dockerfile/Compose/scripts and identify inconsistencies (env files, healthchecks, secret handling).
    status: completed
  - id: remove-build-secret-args
    content: Refactor Dockerfile/Compose to avoid passing secrets as build args and avoid baking them into layers.
    status: completed
  - id: fix-env-validation-build-phase
    content: Adjust lib/env.ts validation to skip during Next production build while keeping runtime validation.
    status: completed
  - id: align-env-files-and-examples
    content: Align compose + quickstart scripts on .envs/local/.env.local and add example env files.
    status: completed
  - id: healthchecks-and-local-ports
    content: Fix Traefik healthcheck and ensure local profile exposes app port directly.
    status: completed
  - id: validate-compose-flow
    content: Run minimal docker compose build/up/healthcheck and init migration flows.
    status: completed
isProject: false
---

# Optimize Dockerfile + Docker Compose

## Goals

- Ensure **secrets are not baked into image layers** (avoid `ARG`/`ENV` secret injection during build).
- Make **environment file usage consistent** across `docker-compose.yml` and `scripts/docker/*quickstart*`.
- Improve container **reproducibility and security defaults** (pin Node base, non-root runtime stays, sensible healthchecks).
- Keep changes minimal and aligned with repo standards (typed env via `app-config.ts`/`lib/env.ts`).

## Scope

- In scope: `docker-compose.yml`, `compose/dev/node/Dockerfile`, docker helper scripts, and a small adjustment to env validation so production builds don’t require runtime secrets.
- Out of scope: changing app features, DB schema, or CI.

## Target Files

- [c:\Users\Alexa\Desktop\SandBox\Banking\docker-compose.yml](c:\Users\Alexa\Desktop\SandBox\Banking\docker-compose.yml)
- [c:\Users\Alexa\Desktop\SandBox\Banking\compose\dev\node\Dockerfile](c:\Users\Alexa\Desktop\SandBox\Banking\compose\dev\node\Dockerfile)
- [c:\Users\Alexa\Desktop\SandBox\Banking\lib\env.ts](c:\Users\Alexa\Desktop\SandBox\Banking\lib\env.ts)
- [c:\Users\Alexa\Desktop\SandBox\Banking\scripts\docker\docker-quickstart.sh](c:\Users\Alexa\Desktop\SandBox\Banking\scripts\docker\docker-quickstart.sh)
- [c:\Users\Alexa\Desktop\SandBox\Banking\scripts\docker\docker-quickstart.ps1](c:\Users\Alexa\Desktop\SandBox\Banking\scripts\docker\docker-quickstart.ps1)
- (New) `.envs/local/.env.local.example` and `.envs/production/.env.production.example` (example-only, non-secret)

## Risks

- **Build-time env validation**: current `lib/env.ts` validates required secrets when `NODE_ENV=production`; during `next build` this can force passing secrets as build args (which risks leaking into image layers).
- **Env-file mismatch**: `docker-compose.yml` references `.envs/local/.env` but scripts use `.envs/local/.env.local` (and the repo currently contains no `.envs/*` files), leading to confusing “works on my machine” failures.
- **Healthcheck tooling**: `traefik` healthcheck uses `wget`, which may not exist in the Traefik image.

## Planned Changes

- **Stop secret leakage via build args**
  - Update `compose/dev/node/Dockerfile` to remove secret `ARG` → `ENV` wiring for `ENCRYPTION_KEY`, `NEXTAUTH_SECRET`, `DATABASE_URL`, etc.
  - Keep only non-secret build args if truly required (e.g., `NEXT_PUBLIC_SITE_URL`).
  - If any build step still needs DB (it shouldn’t for Next build), explicitly document and handle it separately.

- **Make production build not require runtime secrets**
  - Update `lib/env.ts` to skip `validateRequiredConfig()` during Next’s build phase.
  - Use `process.env.NEXT_PHASE === "phase-production-build"` (and optionally `phase-development-server`) to decide when to validate.
  - Result: Docker build can run without passing secrets; runtime container still validates in `NODE_ENV=production`.

- **Fix env file consistency & provide examples**
  - Update `docker-compose.yml` `env_file` entries to use `.envs/local/.env.local` consistently (matching the quickstart scripts).
  - Add `.envs/local/.env.local.example` with required variables + safe defaults (no secrets).
  - Add `.envs/production/.env.production.example` aligned with `scripts/docker/generate-env.*` output.

- **Healthcheck correctness**
  - Replace Traefik `wget` healthcheck with a command that exists in the image (e.g., `traefik healthcheck` if available, or switch to a TCP check pattern).
  - Keep app healthcheck via `curl` (already installed in the dev image).

- **Node base image pinning**
  - Change `ARG NODE_VERSION` default from `22` to a safer LTS default (recommend `20`) while keeping it overrideable.
  - Ensure dev/prod stages use the same base family for consistency.

- **Compose UX improvements (low-risk)**
  - Ensure the `local` profile exposes ports directly when Traefik is not running (currently the app is only reachable via Traefik labels + network; add `ports: ["3000:3000"]` under `profiles: [local]`).
  - Confirm `db` and `redis` expose ports only in `local` profile (optional).

### Assumptions

- You want **Postgres in Compose** for local/dev/test (since the current `docker-compose.yml` already defines `db:`). If you later prefer external DB, we’ll add an alternate override file (e.g., `docker-compose.external-db.yml`).

## Validation

- Build images:
  - `docker compose build`
- Start local stack (no Traefik):
  - `docker compose --profile local --env-file .envs/local/.env.local up -d`
- Verify health:
  - `curl http://localhost:3000/api/health`
- Smoke check migrations profile:
  - `docker compose --profile init --env-file .envs/local/.env.local up` then `down`

## Rollback or Mitigation

- Keep changes isolated to Docker + env validation gate.
- If env validation change causes unexpected runtime behavior, revert `lib/env.ts` guard and temporarily reintroduce build secrets (as buildkit secrets, not args) while diagnosing.
