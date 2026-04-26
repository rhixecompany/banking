# Tech Stack

This file lists the exact technology versions and key libraries observed in the repository. It is generated from package.json and must match that file exactly.

## Core Runtime

| Technology | Version | Notes                         |
| ---------- | ------- | ----------------------------- |
| Next.js    | 16.2.2  | App Router, Server Components |
| React      | 19      | Server Components by default  |
| TypeScript | 6.0.2   | strict mode enabled           |
| Node.js    | 18+     | Recommended                   |

## Backend / ORM

| Technology  | Version | Notes             |
| ----------- | ------- | ----------------- |
| Drizzle ORM | 0.45.2  | PostgreSQL access |
| drizzle-kit | 0.31.10 | Migrations        |
| PostgreSQL  | latest  | Database          |
| postgres    | 3.4.8   | Node driver       |

## Authentication

| Technology            | Version | Notes                   |
| --------------------- | ------- | ----------------------- |
| next-auth             | 4.24.13 | Session management      |
| @auth/drizzle-adapter | 1.11.1  | Drizzle session storage |

## Testing

| Technology | Version | Notes |
| --- | --- | --- |
| Playwright | 1.59.1 | E2E testing |
| Vitest | 4.1.2 | Unit testing |
| MSW | 1.2.1 | Network mocking (unit tests) |
| @vitest/browser-playwright | 4.1.2 | Browser testing |

## Validation & Forms

| Technology          | Version | Notes             |
| ------------------- | ------- | ----------------- |
| Zod                 | ^4.3.6  | Schema validation |
| react-hook-form     | ^7.72.1 | Form handling     |
| @hookform/resolvers | 5.2.2   | Zod resolvers     |

## Integrations

| Technology         | Version | Notes               |
| ------------------ | ------- | ------------------- |
| Plaid              | 41.4.0  | Bank linking        |
| react-plaid-link   | 4.1.1   | Plaid React SDK     |
| Dwolla             | 3.4.0   | ACH transfers       |
| @upstash/redis     | 1.37.0  | Rate limiting/cache |
| @upstash/ratelimit | 2.0.8   | Rate limiting       |

## UI & Styling

| Technology   | Version | Notes               |
| ------------ | ------- | ------------------- |
| Tailwind CSS | v4      | Styling             |
| shadcn/ui    | latest  | Component library   |
| Radix UI     | 1.4.3   | Headless components |
| lucide-react | 1.8.0   | Icons               |
| recharts     | 3.8.0   | Charts              |
| date-fns     | 4.1.0   | Date utilities      |

## Build Tools

| Technology  | Version | Notes                |
| ----------- | ------- | -------------------- |
| tsx         | 4.21.0  | TypeScript execution |
| eslint      | 9.0.0   | Linting              |
| prettier    | 3.8.1   | Formatting           |
| drizzle-kit | 0.31.10 | ORM tooling          |
| Husky       | 9.1.7   | Git hooks            |
| lint-staged | 16.4.0  | Pre-commit hooks     |

## Notes

- These versions are authoritative and were extracted from package.json. When adding new dependencies, update this file and package.json together.
- **Never use language/framework features not available in these detected versions.**

## Version Compatibility Matrix

| Package     | Compatible With |
| ----------- | --------------- |
| drizzle-orm | 0.45.2+         |
| drizzle-kit | 0.31.10+        |
| next-auth   | 4.24.x          |
| next.js     | 16.x            |
| react       | 19.x            |
| TypeScript  | 6.x             |

## Provenance

This file is auto-generated from package.json. Run `npm run validate` to verify versions match.

Last updated: 2026-04-24
