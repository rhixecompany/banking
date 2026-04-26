# Documentation Index

## Markdown Catalog

- [Markdown Catalog](./markdown-catalog.md) - Generated inventory of tracked Markdown docs.

Note: Legacy plan docs may live under `docs/plans/`, but canonical plans are under `.opencode/commands/`.

Regenerate the catalog with `bun run docs:markdown-catalog`.

## Docker & Containerization

### Docker (Primary)

- [Docker Docs Home](docker/README.md) - Main Docker documentation
- [Quick Start](docker/quickstart.md) - Get up and running in 5 minutes
- [Development](docker/development.md) - Local development with hot-reload
- [Production](docker/production.md) - Production deployment with Traefik
- [Troubleshooting](docker/troubleshooting.md) - Common issues and solutions
- [Reference](docker/reference.md) - Environment variables, ports, commands

### Automation Scripts

- [Scripts Index](../scripts/README.md) - All automation scripts (Bash/PowerShell/BAT)

### Docker Services

- [Next.js Docker Images](services/nextjs-docker.md) - Docker image configuration

## Infrastructure

- [Environment Variables](env-vars.md)
- [Secrets Management](secrets-management.md)
- [GitHub Actions CI/CD](github-actions.md)
- [Traefik Guide](services/traefik.md)

## Integration Docs

### Plaid

- [Plaid Quickstart](plaid/quickstart.md)
- [Plaid Link](plaid/link-guide.md)
- [Plaid Transactions](plaid/transactions.md)
- [Plaid Auth](plaid-auth.md)
- [Plaid Balance](plaid-balance.md)
- [Plaid API Documentation](services/plaid-api.md)

### Dwolla

- [Dwolla Context](dwolla-context.md)
- [Dwolla Send Money](dwolla-send-money.md)
- [Dwolla Transfer Between Users](dwolla-transfer-between-users.md)
- [Dwolla API Documentation](services/dwolla-api.md)

### React-Bits

- [React-Bits Overview](react-bits.md)
- [React Patterns](services/react-patterns.md)

### shadcn/ui

- [shadcn/ui Intro](shadcn-ui-intro.md)
- [shadcn Theming](shadcn.md)
- [shadcn/ui Documentation](services/shadcn-ui.md)
- [shadcn/studio](services/shadcn-studio.md)

## Database & ORM

- [Drizzle PostgreSQL](GetStartedWithDrizzleAndPostgreSQL-context.md)
- [Drizzle Neon](GetStartedWithDrizzleAndNeon-context.md)
- [Drizzle Adapter](Drizzle-ORM-Adapter-context.md)
- [Drizzle ORM Guides](DrizzleORMGuides-context.md)
  - [Cursor Pagination](DrizzleORMGuide-Cursor-Based-Pagination.md)
  - [Limit/Offset](DrizzleORMGuide-Limit-Offset-Pagination.md)
  - [Upsert](DrizzleORMGuide-Upsert.md)
  - [Count Rows](DrizzleORMGuide-Count-Rows.md)
  - [Include/Exclude](DrizzleORMGuide-Include-Exclude-Columns.md)
  - [Toggle Boolean](DrizzleORMGuide-Toggle-Boolean.md)
  - [Timestamp Default](DrizzleORMGuide-Timestamp-Default-Value.md)
  - [Conditional Increment](DrizzleORMGuide-Conditional-Increment-Decrement.md)

## Framework Docs

- [Next.js Context](Next-js-context.md)
- [Next.js Caching](nextjs/app-router-caching.md)
- [TypeScript Context](TypeScript-context.md)
- [Getting Started Example](Getting-Started-Example-context.md)

## Audits & Inventories

- [App Pages Documentation](app-pages.md)
- [Custom Components](custom-components.md)
- [Test Context](test-context.md)
- [Server Actions Audit](actions-audit.md)
- [DAL Audit](dal-audit.md)
- [Zod Audit](zod-audit.md)
- [Database Schema Audit](db-schema-audit.md)
- [Evidence Map](evidence_map.md)
- [Review Comments](review-comments.md)

## ESLint & Tools

- [ESLint Config Next](eslint-config-next-context.md)
- [ESLint Config Prettier](eslint-config-prettier-context.md)
- [ESLint Plugin Better Tailwind CSS](eslint-plugin-better-tailwindcss-context.md)
- [ESLint Plugin Drizzle](eslint-plugin-drizzle-context.md)
- [ESLint Plugin Import X](eslint-plugin-import-x-context.md)
- [ESLint Plugin Jest](eslint-plugin-jest-context.md)
- [ESLint Plugin N](eslint-plugin-n-context.md)
- [ESLint Plugin Perfectionist](eslint-plugin-perfectionist-context.md)
- [ESLint Plugin Playwright](eslint-plugin-playwright-context.md)
- [ESLint Plugin React](eslint-plugin-react-context.md)
- [ESLint Plugin React Refresh](eslint-plugin-react-refresh-context.md)
- [ESLint Plugin Security](eslint-plugin-security-context.md)
- [ESLint Plugin SonarJS](eslint-plugin-sonarjs-context.md)
- [ESLint Plugin Testing Library](eslint-plugin-testing-library-context.md)
- [ESLint Plugin Unicorn](eslint-plugin-unicorn-context.md)
- [ESLint Plugin Vitest](eslint-plugin-vitest-context.md)
- [ESLint Plugin Zod](eslint-plugin-zod-context.md)

## Deployment

- [Deploy to Vercel](deploy-to-vercel.md)
- [Deploy to Vercel CLI](deploy-to-vercel-cli.md)
- [Deploy to Railway](deploy-to-railway.md)
- [Deploy to Hostinger](deploy-to-hostinger.md)

## Reports

- [Phase 1 & 2 Refactor Report](reports/phase1-phase2-refactor-report.md)
- [Phase 1 & 2 Refactor Status](reports/phase1-phase2-refactor-status.md)

## Other

- [Credentials Provider](Credentials-Provider-context.md)
- [Migration Summary](MIGRATION-SUMMARY.md)
- [Optimization Plan](optimization-plan.md)

## Legacy Plan Mirrors

- [Legacy Plans](plans/markdown-docs-consolidation.md)
- [Specs](specs/enhance-pages-spec.md)
- [Issue Catalog](issue-catalog.md)
