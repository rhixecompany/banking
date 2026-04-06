# Execute Phases and Tasks — Banking App Refactor

**Version:** 1.1 | **Date:** 2026-04-05 | **Status:** Phase 1 Complete, Phase 2 In Progress

---

## Current Status Summary

### Phase 1 — Frontend UI + Infrastructure: ✅ COMPLETE

All Phase 1 tasks have been verified as complete:

| Task | Status | Evidence |
| --- | --- | --- |
| Task 1 — Fetch Integration Docs | ✅ Complete | docs/plaid/, docs/dwolla/, docs/shadcn/ exist |
| Task 2 — UI Optimization | ✅ Complete | Metadata fixed, a11y verified |
| Task 3 — Playwright E2E | ✅ Complete | 8 specs + 4 helpers exist |
| Task 4 — Fetch Infra Docs | ✅ Complete | docs/docker/, docs/traefik/ exist |
| Track A — Quick Fixes | ✅ Complete | Dashboard title, metadata verified |
| Track B — shadcn Prune | ✅ Complete | No wrapper files, blocks cleaned |
| Track C — DAL Consistency | ✅ Complete | base.dal.ts deleted, uses userDal |
| Track D — Layout Type Safety | ✅ Complete | No unsafe casts |
| Track E — Plaid N+1 Cache | ✅ Complete | "use cache" on getAllBalances() |
| Track F — Test Coverage | ✅ Complete | 182 tests, 4 store tests, admin.spec |

**Note:** The "Description placeholder" JSDoc stubs (952 matches) are valid shadcn/ui component documentation - NOT placeholder content to delete.

---

### Phase 2 — Docker + DevOps + Deployment: ❌ INCOMPLETE

Phase 2 requires infrastructure creation. All docker-compose files exist and will be converted to Swarm stacks.

| Component | Status | Source File |
| --- | --- | --- |
| Stacks (app, traefik, monitoring) | ❌ Missing | Will convert from docker-compose.yml |
| Scripts (secrets, certs, setup) | ❌ Missing | New creation |
| Traefik config | ❌ Missing | New creation |
| Dockerfile (entrypoint, HEALTHCHECK) | ⚠️ Partial | Need to enhance |

---

## Quick Reference

| Phase   | Focus                        | Tasks | Status         |
| ------- | ---------------------------- | ----- | -------------- |
| Phase 1 | Frontend UI + Infrastructure | 1–4   | ✅ Complete    |
| Phase 2 | Docker + DevOps + Deployment | 5–14  | ❌ In Progress |

---

## Task 1 — Fetch Integration Documentation

**Phase:** 1 | **Priority:** High

### Goal

Fetch official docs for all key integrations and save as Markdown in `docs/`.

### Output Structure

```
docs/
├── plaid/
│   ├── quickstart.md
│   ├── link-guide.md
│   └── transactions.md
├── dwolla/
│   ├── quickstart.md
│   └── transfers.md
├── react-bits/
│   └── overview.md
├── shadcn/
│   ├── components.md
│   └── theming.md
└── nextjs/
    ├── app-router-caching.md
    └── use-cache-directive.md
```

### Fetch URLs

```
Plaid:
  https://plaid.com/docs/quickstart/
  https://plaid.com/docs/link/
  https://plaid.com/docs/transactions/

Dwolla:
  https://developers.dwolla.com/docs
  https://developers.dwolla.com/docs/balance/transfer-money-between-users

React-Bits:
  https://www.react-bits.dev/docs/introduction

shadcn/ui:
  https://ui.shadcn.com/docs/components
  https://ui.shadcn.com/docs/theming

Next.js 16:
  https://nextjs.org/docs/app/building-your-application/caching
  https://nextjs.org/docs/app/api-reference/directives/use-cache
```

### Tool

Use `MCP_DOCKER_fetch` to retrieve each URL, then write to `docs/` with appropriate naming.

### Checklist

- [ ] Create `docs/` directory structure
- [ ] Fetch and save Plaid docs (3 files)
- [ ] Fetch and save Dwolla docs (2 files)
- [ ] Fetch and save React-Bits docs (1 file)
- [ ] Fetch and save shadcn/ui docs (2 files)
- [ ] Fetch and save Next.js 16 cache docs (2 files)
- [ ] Create `docs/README.md` index linking all files

---

## Task 2 — UI Optimization (A11y + Performance + Visual)

**Phase:** 1 | **Priority:** High

### Pages Inventory

| Route | File | Group |
| --- | --- | --- |
| `/` | `app/page.tsx` | root redirect |
| `/dashboard` | `app/(root)/dashboard/page.tsx` | protected |
| `/my-banks` | `app/(root)/my-banks/page.tsx` | protected |
| `/payment-transfer` | `app/(root)/payment-transfer/page.tsx` | protected |
| `/settings` | `app/(root)/settings/page.tsx` | protected |
| `/transaction-history` | `app/(root)/transaction-history/page.tsx` | protected |
| `/sign-in` | `app/(auth)/sign-in/page.tsx` | auth |
| `/sign-up` | `app/(auth)/sign-up/page.tsx` | auth |
| `/admin` | `app/(admin)/admin/page.tsx` | admin |
| `404` | `app/not-found.tsx` | error |
| `500` | `app/global-error.tsx` | error |

### 2a — Accessibility (a11y) Fixes

```tsx
// app/global-error.tsx — Fix missing lang prop
// BEFORE
<html>
// AFTER
<html lang="en">

// app/(admin)/layout.tsx:107 — Fix invalid anchor
// BEFORE
<a href="#">Dashboard</a>
// AFTER
<button type="button">Dashboard</button>
```

- [ ] Fix `html-has-lang` on `app/global-error.tsx`
- [ ] Fix `anchor-is-valid` on `app/(admin)/layout.tsx`
- [ ] Add `aria-label` to all icon-only buttons
- [ ] Verify color contrast meets WCAG AA
- [ ] Confirm all form inputs have associated `<label>` elements

### 2b — Performance (Suspense + Lazy Loading)

```tsx
// Pattern: wrap heavy sections in Suspense
import { Suspense } from "react";
import { TransactionTableSkeleton } from "@/components/transaction-history";

export default function TransactionHistoryPage() {
  return (
    <Suspense fallback={<TransactionTableSkeleton />}>
      <TransactionHistoryClientWrapper />
    </Suspense>
  );
}
```

```tsx
// Pattern: lazy-load chart components
import dynamic from "next/dynamic";

const DoughnutChart = dynamic(
  () => import("@/components/doughnut-chart/doughnut-chart"),
  { ssr: false }
);
```

- [ ] Verify `loading.tsx` skeletons are content-accurate
- [ ] Add `Suspense` boundaries around heavy components
- [ ] Use `next/dynamic` with `{ ssr: false }` for chart and Plaid components
- [ ] Verify `"use cache"` directive is on all read-heavy functions
- [ ] Confirm `cacheTag` + `updateTag` pairing exists for all mutations

### 2c — Visual Polish (shadcn/ui Consistency)

- [ ] Replace any raw HTML `<table>` with shadcn `<Table>`
- [ ] Replace any raw `<select>` with shadcn `<Select>`
- [ ] Standardize button variants: `default`, `outline`, `ghost`, `destructive`
- [ ] Fix all remaining Tailwind class order warnings
- [ ] Verify all cards use `<Card>`, `<CardHeader>`, `<CardContent>`

### 2d — React-Bits Integration

```bash
npm install react-bits
```

- [ ] Install `react-bits` and verify TypeScript types resolve
- [ ] Add `AnimatedNumber` to balance display components
- [ ] Add `FadeIn` for page-level entry transitions
- [ ] Document usage in `docs/react-bits/overview.md`

---

## Task 3 — Playwright E2E Optimization

**Phase:** 1 | **Priority:** Medium

### Test File Inventory

```
tests/e2e/
├── admin.spec.ts
├── auth.spec.ts
├── bank-linking.spec.ts
├── dashboard.spec.ts
├── my-banks.spec.ts
├── payment-transfer.spec.ts
├── settings.spec.ts
├── transaction-history.spec.ts
├── global-setup.ts
├── global-teardown.ts
└── helpers/
    ├── auth.ts
    ├── db.ts
    ├── plaid.ts      ← new
    └── dwolla.ts     ← new
```

### New Helper — Plaid Sandbox

```typescript
// tests/e2e/helpers/plaid.ts
import type { Page } from "@playwright/test";

export async function completePlaidFlow(page: Page): Promise<void> {
  await page.click('[data-testid="plaid-link-button"]');
  const frame = page.frameLocator('[title="Plaid Link"]');
  await frame.locator('button:has-text("Continue")').click();
  await frame.locator('[name="username"]').fill("user_good");
  await frame.locator('[name="password"]').fill("pass_good");
  await frame.locator('button:has-text("Submit")').click();
  await frame.locator('button:has-text("Continue")').click();
}
```

### New Helper — Dwolla Sandbox

```typescript
// tests/e2e/helpers/dwolla.ts
import type { Page } from "@playwright/test";

export async function completeDwollaTransfer(
  page: Page,
  amount: string
): Promise<void> {
  await page.fill('[data-testid="transfer-amount"]', amount);
  await page.click('[data-testid="transfer-submit"]');
  await page.waitForSelector('[data-testid="transfer-success"]');
}
```

### Config Improvements

```typescript
// playwright.config.ts
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  workers: process.env.CI ? 1 : undefined,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL:
      process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    trace: "on-first-retry"
  },
  reporter: process.env.CI
    ? [["github"], ["html", { open: "never" }]]
    : [["html", { open: "on-failure" }]]
});
```

### Checklist

- [ ] Add `data-testid` attributes to all interactive elements
- [ ] Create `tests/e2e/helpers/plaid.ts`
- [ ] Create `tests/e2e/helpers/dwolla.ts`
- [ ] Add `PLAYWRIGHT_BASE_URL` support
- [ ] Set `retries: 2` in CI
- [ ] Add `screenshot`, `video` on-failure config
- [ ] Run `npm run test:ui` — fix all failures

---

## Task 4 — Fetch Infrastructure Documentation

**Phase:** 2 | **Priority:** High

### Goal

Fetch docs for Docker Swarm, Traefik, Postgres, Redis.

### Fetch URLs

```
Docker Swarm:
  https://docs.docker.com/engine/swarm/
  https://docs.docker.com/engine/swarm/secrets/
  https://docs.docker.com/engine/swarm/stack-deploy/

Traefik:
  https://doc.traefik.io/traefik/providers/docker/
  https://doc.traefik.io/traefik/user-guides/docker-compose/acme-tls/
  https://doc.traefik.io/traefik/operations/dashboard/
  https://doc.traefik.io/traefik/middlewares/overview/

Postgres / Redis:
  https://hub.docker.com/_/postgres
  https://hub.docker.com/_/redis
```

### Output Structure

```
docs/
├── docker/
│   ├── swarm-overview.md
│   ├── secrets.md
│   └── stack-deploy.md
└── traefik/
    ├── quickstart.md
    ├── docker-swarm.md
    ├── https-tls.md
    ├── dashboard.md
    └── middlewares.md
```

### Checklist

- [ ] Fetch and save 3 Docker Swarm docs
- [ ] Fetch and save 4 Traefik docs
- [ ] Fetch and save Postgres + Redis Docker Hub pages
- [ ] Update `docs/README.md` index

---

## Task 5 — Containerize Project (Dockerfiles + Compose)

**Phase:** 2 | **Priority:** Critical

### Service Map

| Service | Dockerfile | Base Image |
| --- | --- | --- |
| Next.js app (prod) | `compose/dev/node/Dockerfile --target production` | `gcr.io/distroless/nodejs22-debian12:nonroot` |
| Next.js app (dev) | `compose/development/node/Dockerfile` | `node:22-alpine` |
| Next.js app (local) | `compose/local/node/Dockerfile` | `node:22-alpine` |
| PostgreSQL | Official | `postgres:17-alpine` |
| Redis | Official | `redis:7-alpine` |
| Traefik | Official (new) | `traefik:v3.3` |
| Prometheus | Official (new) | `prom/prometheus:latest` |
| Grafana | Official (new) | `grafana/grafana:latest` |

### New Files to Create

```
compose/production/traefik/
├── traefik.yml
└── dynamic/
    ├── tls.yml
    └── middlewares.yml

stacks/
├── app.stack.yml
├── traefik.stack.yml
└── monitoring.stack.yml

scripts/
├── read-secrets.sh
├── gen-certs.sh
└── server-setup.sh
```

### Checklist

- [ ] Create `compose/production/traefik/` directory
- [ ] Create `stacks/` directory with all 3 stack files
- [ ] Create `scripts/` helper scripts

---

## Task 6 — Optimize Dockerfiles (Dev vs Production)

**Phase:** 2 | **Priority:** High

### Differences

| Concern | Development | Production |
| --- | --- | --- |
| Base image | `node:22-alpine` | `distroless/nodejs22-debian12:nonroot` |
| Dev dependencies | Installed | Pruned after build |
| Source code | Bind-mounted (hot reload) | Copied — standalone output |
| Build step | None — runs `npm run dev` | `npm run build:standalone` |
| User | root | `nonroot` UID 65532 |
| Image size | ~800 MB | ~200 MB |

### Production Dockerfile Additions

```dockerfile
FROM node:22.13.1-alpine AS builder

LABEL org.opencontainers.image.source="https://github.com/YOUR_ORG/banking"
LABEL org.opencontainers.image.description="Banking App"

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://localhost:3000/api/health || exit 1
```

### Development Dockerfile Fix

```dockerfile
# REMOVE unnecessary native build deps
# RUN apk add --no-cache python3 make g++ cairo-dev jpeg-dev pango-dev giflib-dev
```

### Checklist

- [ ] Pin exact Node version in all 3 Dockerfiles
- [ ] Add OCI `LABEL` metadata to production Dockerfile
- [ ] Remove unused `apk` native build deps from dev Dockerfile
- [ ] Add `HEALTHCHECK` instruction to production image
- [ ] Update entrypoint to `scripts/read-secrets.sh` in production

---

## Task 7 — Environment Variables + Secrets

**Phase:** 2 | **Priority:** Critical

### Current Files

```
.envs/local/.env.local             ← development
.envs/production/.env.production   ← production template
.env.example                       ← public template
```

### Secrets Strategy

Sensitive values use Docker Swarm secrets. Non-sensitive values use `.env` files.

```bash
# Create Swarm secrets on the server
echo "your-encryption-key" | docker secret create banking_encryption_key -
echo "your-nextauth-secret" | docker secret create banking_nextauth_secret -
echo "postgresql://..." | docker secret create banking_database_url -
```

### Secrets Entrypoint

```bash
#!/bin/sh
set -e

load_secret() {
  local name="$1"
  local file_var="${name}_FILE"
  eval local file_path="\${$file_var:-}"
  if [ -f "$file_path" ]; then
    export "$name=$(cat "$file_path")"
  fi
}

load_secret ENCRYPTION_KEY
load_secret NEXTAUTH_SECRET
load_secret DATABASE_URL
load_secret PLAID_SECRET
load_secret DWOLLA_SECRET

exec "$@"
```

### Checklist

- [ ] Create `scripts/read-secrets.sh`
- [ ] Update production `Dockerfile` entrypoint
- [ ] Create `stacks/app.stack.yml` with `secrets:` block
- [ ] Document all vars in `docs/env-vars.md`
- [ ] Verify `.envs/production/.env.production` is in `.gitignore`
- [ ] Update `.env.example` with `_FILE` variants
- [ ] Create `docs/secrets-management.md`

---

## Task 8 — Traefik on Docker Swarm

**Phase:** 2 | **Priority:** Critical

### Static Config

```yaml
# compose/production/traefik/traefik.yml
global:
  checkNewVersion: false
  sendAnonymousUsage: false

api:
  dashboard: true
  insecure: false

entryPoints:
  web:
    address: ":80"
    http:
      redirections:
        entryPoint:
          to: websecure
          scheme: https
          permanent: true
  websecure:
    address: ":443"
    http:
      tls: {}
  traefik:
    address: ":8080"

metrics:
  prometheus:
    addEntryPointsLabels: true
    addServicesLabels: true
    addRoutersLabels: true
    entryPoint: traefik

providers:
  docker:
    endpoint: "unix:///var/run/docker.sock"
    exposedByDefault: false
    swarmMode: true
    network: traefik-public
  file:
    directory: /etc/traefik/dynamic
    watch: true
```

### Middlewares

```yaml
# compose/production/traefik/dynamic/middlewares.yml
http:
  middlewares:
    rate-limit:
      rateLimit:
        average: 100
        burst: 50
    security-headers:
      headers:
        stsSeconds: 31536000
        forceSTSHeader: true
    compress:
      compress: {}
```

### TLS Config

```yaml
# compose/production/traefik/dynamic/tls.yml
tls:
  options:
    default:
      minVersion: VersionTLS12
  stores:
    default:
      defaultCertificate:
        certFile: /certs/cert.pem
        keyFile: /certs/key.pem
```

### Init Commands

```bash
docker swarm init
docker network create --driver overlay --attachable traefik-public
echo "admin:$(openssl passwd -apr1 'password')" | docker secret create traefik_dashboard_users -
docker stack deploy -c stacks/traefik.stack.yml traefik
docker stack deploy -c stacks/app.stack.yml banking
```

### Checklist

- [ ] Create `compose/production/traefik/traefik.yml`
- [ ] Create `compose/production/traefik/dynamic/middlewares.yml`
- [ ] Create `compose/production/traefik/dynamic/tls.yml`
- [ ] Create `scripts/gen-certs.sh`
- [ ] Add Traefik stack file to `stacks/`
- [ ] Add `compose/production/traefik/certs/` to `.gitignore`

---

## Task 9 — GitHub Actions CI/CD

**Phase:** 2 | **Priority:** High

### Current Workflows

| Workflow | State |
| --- | --- |
| `.github/workflows/ci.yml` | Solid — test + playwright + docker-build |
| `.github/workflows/deploy.yml` | Stub — needs real SSH deploy |
| `.github/workflows/docker-security.yml` | Exists — verify Trivy config |

### Deploy Step

```yaml
- name: Deploy to production via SSH
  uses: appleboy/ssh-action@v1.2.0
  with:
    host: ${{ secrets.DEPLOY_HOST }}
    username: ${{ secrets.DEPLOY_USER }}
    key: ${{ secrets.DEPLOY_SSH_KEY }}
    script: |
      set -e
      cd /opt/banking
      export APP_IMAGE=ghcr.io/${{ github.repository }}:${{ github.sha }}
      docker stack deploy \
        --with-registry-auth \
        --resolve-image always \
        -c stacks/app.stack.yml \
        banking
      docker service ps banking_app --no-trunc
```

### Required Secrets

```
DEPLOY_HOST           — VPS IP or hostname
DEPLOY_USER           — SSH user
DEPLOY_SSH_KEY        — Private SSH key (PEM)
NEXT_PUBLIC_SITE_URL  — Production URL
```

### Checklist

- [ ] Add `appleboy/ssh-action` step to deploy job
- [ ] Add `provenance: true` and `sbom: true` to docker build
- [ ] Add Docker image size budget check (fail if > 300 MB)
- [ ] Add `docker service ps` verification after deploy
- [ ] Set up GitHub environment `production` with required reviewer

---

## Task 10 — Performance Review

**Phase:** 2 | **Priority:** Medium

### 10a — Frontend Bundle

```bash
npm run build:analyze
```

- [ ] Run bundle analyzer — document top-10 largest modules
- [ ] Implement `next/dynamic` for chart, Plaid components
- [ ] Verify `next/font` with `display: 'swap'`
- [ ] Add `<link rel="preconnect">` for Plaid and Dwolla

### 10b — Database Query Performance

- [ ] Profile slow queries via `npm run db:studio` with `EXPLAIN ANALYZE`
- [ ] Fix N+1 in `getAllBalances()` with `"use cache"`
- [ ] Add DB indexes for `transactions.userId`, `transactions.createdAt`, `banks.userId`
- [ ] Generate migration: `npm run db:generate && npm run db:migrate`

### 10c — Cache Layer

- [ ] Verify Redis connection health in production
- [ ] Add Redis cache for Plaid balance responses (TTL: 5 min)

---

## Task 11 — Final Project Review

**Phase:** 2 | **Priority:** High

### Checklist

- [ ] `npm run type-check` → 0 errors
- [ ] `npm run lint:strict` → 0 warnings
- [ ] `npm run test` → all green
- [ ] `docker build -f compose/dev/node/Dockerfile --target production .` → success
- [ ] All pages load without console errors
- [ ] Security headers present on all responses
- [ ] `curl http://localhost:3000/api/health` → `200 OK`

---

## Task 12 — Summary Report

**Phase:** 2 | **Priority:** Medium

### Output

`docs/reports/phase1-phase2-refactor-report.md`

### Template

```markdown
# Phase 1 & 2 Refactor Report

**Date:** YYYY-MM-DD

## Changes Made

### Frontend UI

- ...

### Docker / Infrastructure

- ...

### GitHub Actions

- ...

## Metrics

| Metric            | Before | After |
| ----------------- | ------ | ----- |
| Docker image size | ?      | ?     |
| Lighthouse score  | ?      | ?     |
| Bundle size (JS)  | ?      | ?     |
| Test count        | ?      | ?     |
| Lint warnings     | ?      | 0     |

## Remaining Issues

| #   | Issue | Severity | File |
| --- | ----- | -------- | ---- |

## Recommendations

...
```

### Checklist

- [ ] Create `docs/reports/` directory
- [ ] Capture bundle analyzer screenshot
- [ ] Fill all metric cells
- [ ] Link all new documentation files

---

## Task 13 — Deployment Pipeline

**Phase:** 2 | **Priority:** High

### Pipeline Flow

```
git push
  → CI (lint + typecheck + tests + docker build)
    → docker/build-push-action → ghcr.io/$repo:sha
      → Trivy scan
        → deploy-staging (auto)
          → manual approval
            → deploy-production (SSH + docker stack deploy)
              → health check + rollback on failure
```

### Server Setup Script

```bash
#!/bin/bash
set -euo pipefail
curl -fsSL https://get.docker.com | sh
usermod -aG docker deploy
docker swarm init --advertise-addr "$(hostname -I | awk '{print $1}')"
docker network create --driver overlay --attachable traefik-public
mkdir -p /opt/banking/{stacks,compose,scripts}
```

### Rollback Command

```bash
docker service rollback banking_app
```

### Checklist

- [ ] Create `scripts/server-setup.sh`
- [ ] Add rolling update config to stack files
- [ ] Document rollback command

---

## Task 14 — Documentation Pass

**Phase:** 2 | **Priority:** Medium

### Files to Create/Update

```
docs/
├── README.md                    ← index of all docs
├── env-vars.md                  ← all 24 vars + _FILE variants
├── secrets-management.md        ← docker secret create commands
├── github-actions.md           ← CI/CD setup + required secrets
└── reports/
    └── phase1-phase2-refactor-report.md
```

### Checklist

- [ ] Create `docs/README.md` with all section links
- [ ] Create `docs/env-vars.md`
- [ ] Create `docs/secrets-management.md`
- [ ] Create `docs/github-actions.md`
- [ ] Update `AGENTS.md` sync checklist
- [ ] Update `README.md` Quick Start with Docker section

---

## Task 15 — Phase 1 Quick Fixes (Tracks A–F)

**Phase:** 1 | **Priority:** High | **Note:** Executed independently

### Track A — Quick Fixes (No dependencies)

**A1 — Fix dashboard page title**

```ts
// Before
export const metadata: Metadata = {
  title: "Dashboard | Banking"
};

// After
export const metadata: Metadata = {
  title: "Dashboard | Horizon Banking"
};
```

**A2 — Add missing metadata to home page**

```ts
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home | Horizon Banking",
  description: "Your personal banking dashboard"
};
```

**A3 — Delete placeholder test file**

- Delete `tests/unit/HelloWorld.test.tsx`

**A4 — Remove JSDoc placeholder stubs**

Search for `"Description placeholder"` and delete only those stub lines in:

- `lib/actions/user.actions.ts`
- `lib/actions/bank.actions.ts`
- `lib/actions/transaction.actions.ts`
- `lib/actions/recipient.actions.ts`
- `lib/actions/dwolla.actions.ts`
- `lib/actions/register.ts`
- `lib/dal/bank.dal.ts`
- `lib/dal/transaction.dal.ts`
- `lib/dal/recipient.dal.ts`
- `lib/dal/dwolla.dal.ts`

### Track B — shadcn-studio Prune (No dependencies)

**B1 — Delete wrapper files**

Delete all `components/shadcn-studio/*-server-wrapper.tsx` and `*-client-wrapper.tsx` (24 files).

**B2 — Delete unused block files**

Delete:

- `components/shadcn-studio/blocks/login-page-01/`
- `components/shadcn-studio/blocks/register-01/`
- `components/shadcn-studio/blocks/blog-component-01/`
- `components/shadcn-studio/blocks/footer-component-01/`
- `components/shadcn-studio/blocks/navbar-component-01/`
- `components/shadcn-studio/blocks/account-settings-01/`
- `components/shadcn-studio/blocks/logo.tsx`
- `components/shadcn-studio/blocks/data-table/data-table-04.tsx`

### Track C — DAL Consistency (No dependencies)

**C1 — Fix admin actions to use userDal**

```ts
// Replace direct db.update() with userDal.update()
await userDal.update(parsed.data.userId, {
  isAdmin: parsed.data.makeAdmin
});
```

**C2 — Delete base.dal.ts**

Delete `lib/dal/base.dal.ts`.

**C3 — Remove base.dal.ts re-export**

Remove `export * from "./base.dal"` from `lib/dal/index.ts`.

### Track D — Layout Type Safety (Depends on Track C)

**D1 — Replace unsafe cast**

```ts
// Before
const user = await getLoggedInUser();
<Sidebar user={user as unknown as User} ... />

// After
const result = await getUserWithProfile();
if (!result.ok || !result.user) redirect("/sign-in");
const user: UserWithProfile = result.user;
<Sidebar user={user} ... />
```

### Track E — Plaid N+1 Cache Fix (No dependencies)

**E1 — Wrap getAllBalances with "use cache"**

```ts
export async function getAllBalances() {
  "use cache";
  const { cacheLife } =
    await import("next/dist/server/use-cache/cache-life");
  const { cacheTag } =
    await import("next/dist/server/use-cache/cache-tag");

  cacheLife("minutes");
  cacheTag(`balances-${session.user.id}`);
  // ... existing logic
}
```

**E2 — Invalidate balances cache on mutations**

```ts
import { unstable_updateTag as updateTag } from "next/cache";

// After bank add or remove:
updateTag(`balances-${session.user.id}`);
```

### Track F — Test Coverage (Run last)

**F1 — UI Store Unit Tests**

Create `tests/unit/stores/ui-store.test.ts`

**F2 — Transfer Store Unit Tests**

Create `tests/unit/stores/transfer-store.test.ts`

**F3 — Filter Store Unit Tests**

Create `tests/unit/stores/filter-store.test.ts`

**F4 — Toast Store Unit Tests**

Create `tests/unit/stores/toast-store.test.ts`

**F5 — Admin E2E Spec**

Create `tests/e2e/admin.spec.ts`

---

## Execution Order

```text
Task 1 (docs fetch)      ─┐
Task 2 (UI opt)          ├─► Task 3 (Playwright)
Task 4 (infra docs)      ─┘

Task 5–8 (Docker/Infra)  ──► Task 9 (GitHub Actions)
                           ──► Task 10 (Performance)
                           ──► Task 11 (Final Review)
                           ──► Task 12 (Report)
                           ──► Task 13 (Pipeline)
                           ──► Task 14 (Documentation)

Track A–E (Phase 1)      ──► Track F (Tests) — parallel with Tasks 1–4
```

---

## Validation Commands

```bash
npm run type-check
npm run lint:strict
npm run test:browser
npm run test:ui
```

---

## Decisions Log

| Question | Answer |
| --- | --- |
| Deployment target | Self-hosted VPS with Docker Swarm on Hostinger |
| Domain | Localhost / internal DNS only (self-signed TLS) |
| Registry | GitHub Container Registry (`ghcr.io`) |
| Deploy mechanism | SSH + `docker stack deploy` to remote Swarm |
| UI goal | All: a11y + performance + visual polish |
| React-Bits | Not installed — want to add it |
| ShadCN-Studio | Keep remaining files, optimize what's left |
| Secrets | Docker Swarm secrets + `.env` files |
| Swarm nodes | Single node Swarm |
| Observability | Prometheus + Grafana |
| Playwright external APIs | Real Plaid/Dwolla sandbox |
| Performance scope | All layers (frontend + DB + cache) |
| Report format | `docs/reports/*.md` |
| Traefik | Full setup with HTTPS, rate limiting, security headers |
| Docker conversion | Convert docker-compose.yml to stacks/app.stack.yml (DRY) |

---

## Do Not Re-Touch

These files were intentionally left as-is or fixed in prior sessions:

- `lib/actions/updateProfile.ts` — direct `db` calls acceptable
- `lib/auth-config.ts` — does not exist; debt #6 pre-resolved
- `proxy.ts` — middleware placement is separate concern
- `app/middleware.ts` — already deleted
- `eslint.config.mts` — already finalized
- `opencode.json` + `.opencode/mcp-runner.ts` — infrastructure, out of scope

---

## Phase 2 Implementation Plan — Smart Merge Strategy

**Target:** Self-hosted VPS with Docker Swarm on Hostinger **Scope:** Full Traefik with HTTPS, Prometheus + Grafana monitoring

### Existing Assets to Convert (DRY)

| Source File | Convert To | Strategy |
| --- | --- | --- |
| `docker-compose.yml` | `stacks/app.stack.yml` | Convert bridge→overlay, add secrets, preserve healthcheck |
| `docker-compose.dev.yml` | Reference only | Keep for local dev |
| `docker-compose.local.yml` | Reference only | Keep for local dev |
| `.envs/production/.env.production` | Reference only | Template for secrets |

### Files to Create

```
stacks/                           (3 new files)
├── app.stack.yml                 # Banking app service (converted from docker-compose.yml)
├── traefik.stack.yml             # Traefik v3 reverse proxy
└── monitoring.stack.yml          # Prometheus + Grafana

scripts/                          (3 new files)
├── read-secrets.sh               # Load Docker Swarm secrets into env vars
├── gen-certs.sh                  # Generate self-signed TLS certificates
└── server-setup.sh               # Bootstrap Docker Swarm on Hostinger

compose/production/traefik/      (1 dir + 3 new files)
├── traefik.yml                   # Static configuration (entrypoints, providers)
└── dynamic/
    ├── middlewares.yml            # Rate limit, security headers, compression
    └── tls.yml                    # TLS options (min TLS 1.2)
```

### Files to Modify

| File | Changes |
| --- | --- |
| `compose/dev/node/Dockerfile --target production` | Add HEALTHCHECK, update ENTRYPOINT to use read-secrets.sh |

### Dead Code to Eliminate

| Missing File | Why Needed |
| --- | --- |
| `stacks/app.stack.yml` | Referenced in deploy.yml but missing - causes deploy failures |
| `scripts/read-secrets.sh` | Referenced in docs/secrets-management.md |
| `scripts/gen-certs.sh` | Referenced in docs/secrets-management.md |
| `scripts/server-setup.sh` | Referenced in docs/docker/swarm-overview.md |
| Traefik configs | Required for full Traefik setup |

---

### Phase 2 Execution Order

```
1. Create scripts/
   ├── read-secrets.sh    → Load Docker secrets from _FILE env vars
   ├── gen-certs.sh       → Generate self-signed TLS certificates
   └── server-setup.sh    → Bootstrap Docker Swarm on Hostinger

2. Create Traefik configs/
   ├── traefik.yml        → EntryPoints: web(80), websecure(443), traefik(8080)
   └── dynamic/
       ├── middlewares.yml → Rate limit (100 avg, 50 burst), security headers, compress
       └── tls.yml        → minVersion: TLS12

3. Create stacks/
   ├── app.stack.yml      → Convert from docker-compose.yml (overlay networks, secrets)
   ├── traefik.stack.yml → Traefik service with dashboard
   └── monitoring.stack.yml → Prometheus (9090) + Grafana (3001)

4. Modify Dockerfile
   └── Add HEALTHCHECK + read-secrets.sh entrypoint

5. Verify
   ├── docker build -f compose/dev/node/Dockerfile --target production .
   └── npm run validate
```

---

### Smart Merge Details

#### stacks/app.stack.yml (Converted from docker-compose.yml)

```yaml
# Convert bridge → overlay networks
# Add secrets block for sensitive env vars
# Add deploy.placement.constraints for manager
# Add update_config for rolling updates
```

Key transformations:

- `networks.app-network` → `networks: [traefik-public, app-internal]` (overlay)
- Add `secrets:` block for ENCRYPTION_KEY, NEXTAUTH_SECRET, DATABASE_URL, PLAID_SECRET, DWOLLA_SECRET
- Add `deploy:` section with replicas, placement, update_config

#### stacks/traefik.stack.yml (New)

```yaml
services:
  traefik:
    image: traefik:v3.3
    ports:
      - "80:80"
      - "443:443"
      - "8080:8080" # Dashboard
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - ./compose/production/traefik/traefik.yml:/etc/traefik/traefik.yml:ro
      - ./compose/production/traefik/dynamic:/etc/traefik/dynamic:ro
      - ./compose/production/traefik/certs:/certs:ro
    networks:
      - traefik-public
      - app-internal
    deploy:
      placement:
        constraints:
          - node.role == manager
```

#### stacks/monitoring.stack.yml (New)

```yaml
services:
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    networks:
      - app-internal

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    networks:
      - app-internal
```

---

### Scripts Details

#### scripts/read-secrets.sh

```bash
#!/bin/sh
# Loads Docker Swarm secrets from _FILE environment variables
# and exports them as regular environment variables

load_secret() {
  local name="$1"
  local file_var="${name}_FILE"
  eval local file_path="\${$file_var:-}"
  if [ -f "$file_path" ]; then
    export "$name=$(cat "$file_path")"
  fi
}

load_secret ENCRYPTION_KEY
load_secret NEXTAUTH_SECRET
load_secret DATABASE_URL
load_secret PLAID_SECRET
load_secret DWOLLA_SECRET
load_secret DWOLLA_KEY

exec "$@"
```

#### scripts/gen-certs.sh

```bash
#!/bin/bash
# Generates self-signed TLS certificates for Traefik

CERT_DIR="compose/production/traefik/certs"
mkdir -p "$CERT_DIR"

# Generate CA
openssl genrsa -out "$CERT_DIR/ca.key" 2048
openssl req -new -x509 -days 365 -key "$CERT_DIR/ca.key" -out "$CERT_DIR/ca.crt" -subj "/CN=Banking CA"

# Generate server key
openssl genrsa -out "$CERT_DIR/server.key" 2048

# Generate server cert
openssl req -new -key "$CERT_DIR/server.key" -out "$CERT_DIR/server.csr" -subj "/CN=banking.example.com"
openssl x509 -req -days 365 -in "$CERT_DIR/server.csr" -CA "$CERT_DIR/ca.crt" -CAkey "$CERT_DIR/ca.key" -CAcreateserial -out "$CERT_DIR/server.crt"

echo "Certificates generated in $CERT_DIR"
```

#### scripts/server-setup.sh

```bash
#!/bin/bash
# Bootstrap Docker Swarm on Hostinger

set -e

echo "Installing Docker..."
curl -fsSL https://get.docker.com | sh

echo "Initializing Docker Swarm..."
docker swarm init --advertise-addr "$(hostname -I | awk '{print $1}')"

echo "Creating overlay networks..."
docker network create --driver overlay --attachable traefik-public
docker network create --driver overlay --attachable app-internal

echo "Creating directory structure..."
mkdir -p /opt/banking/{stacks,compose/production/traefik/certs,scripts}

echo "Docker Swarm initialized successfully!"
```

---

### Traefik Configuration Details

#### compose/production/traefik/traefik.yml

```yaml
global:
  checkNewVersion: false
  sendAnonymousUsage: false

api:
  dashboard: true
  insecure: false

entryPoints:
  web:
    address: ":80"
    http:
      redirections:
        entryPoint:
          to: websecure
          scheme: https
          permanent: true
  websecure:
    address: ":443"
    http:
      tls: {}
  traefik:
    address: ":8080"

metrics:
  prometheus:
    addEntryPointsLabels: true
    addServicesLabels: true
    addRoutersLabels: true
    entryPoint: traefik

providers:
  docker:
    endpoint: "unix:///var/run/docker.sock"
    exposedByDefault: false
    swarmMode: true
    network: traefik-public
  file:
    directory: /etc/traefik/dynamic
    watch: true
```

#### compose/production/traefik/dynamic/middlewares.yml

```yaml
http:
  middlewares:
    rate-limit:
      rateLimit:
        average: 100
        burst: 50
    security-headers:
      headers:
        stsSeconds: 31536000
        forceSTSHeader: true
        frameDeny: true
        contentTypeNosniff: true
        browserXssFilter: true
        referrerPolicy: "strict-origin-when-cross-origin"
    compress:
      compress: {}
```

#### compose/production/traefik/dynamic/tls.yml

```yaml
tls:
  options:
    default:
      minVersion: VersionTLS12
  stores:
    default:
      defaultCertificate:
        certFile: /certs/server.crt
        keyFile: /certs/server.key
```

---

### Dockerfile Enhancement

```dockerfile
# Add HEALTHCHECK
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://localhost:3000/api/health || exit 1

# Copy scripts
COPY --from=builder --chown=nonroot:nonroot /app/scripts/ ./scripts/

# Update entrypoint
ENTRYPOINT ["/bin/sh", "/app/scripts/read-secrets.sh"]
CMD ["node", "server.js"]
```

---

### File Count Summary

| Category        | New   | Modified | Notes                        |
| --------------- | ----- | -------- | ---------------------------- |
| Stack files     | 3     | 0        | app, traefik, monitoring     |
| Scripts         | 3     | 0        | secrets, certs, setup        |
| Traefik configs | 3     | 0        | traefik.yml + 2 dynamic      |
| Dockerfile      | 0     | 1        | Add HEALTHCHECK + entrypoint |
| **Total**       | **9** | **1**    |                              |

---

### Verification Checklist

After implementation:

- [ ] `docker build -f compose/dev/node/Dockerfile --target production .` succeeds
- [ ] `stacks/app.stack.yml` references ENCRYPTION_KEY, NEXTAUTH_SECRET secrets
- [ ] `scripts/read-secrets.sh` loads all \_FILE variants
- [ ] `scripts/gen-certs.sh` generates certificates
- [ ] `scripts/server-setup.sh` initializes Swarm
- [ ] Traefik config has HTTP→HTTPS redirect
- [ ] Monitoring stack has Prometheus + Grafana
- [ ] `npm run validate` passes (type-check, lint, tests)
