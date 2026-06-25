# Technology Stack — Banking

## Overview
Next.js 16 fintech banking application with PostgreSQL, Drizzle ORM, and Plaid/Dwolla integrations.

## Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.2.4 | React framework with App Router |
| React | 19.2.5 | UI library |
| TypeScript | 6.0.3 | Type safety |
| Tailwind CSS | 4.2.4 | Utility-first styling |
| shadcn/ui | ^4.6.0 | Component library (Radix UI primitives) |
| Zustand | 5.0.12 | State management |
| React Hook Form | 7.75.0 | Form handling |
| Zod | 4.4.3 | Schema validation |
| TanStack Table | 8.21.3 | Data tables |
| Recharts | 3.8.1 | Charts |
| Lucide React | 1.14.0 | Icons |
| Framer Motion | — | Animations (via sonner/vaul deps) |

## Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js API Routes | 16.2.4 | API endpoints |
| Drizzle ORM | 0.45.2 | Database ORM |
| PostgreSQL | — | Database (via pg, postgres) |
| NextAuth.js | 4.24.14 | Authentication |
| Upstash Redis | 1.37.0 | Rate limiting / caching |

## Integrations
| Integration | Package | Purpose |
|-------------|---------|---------|
| Plaid | 42.2.0 | Bank account linking |
| Dwolla | dwolla-v2 3.4.0 | ACH transfers |
| Resend | — | Email (via nodemailer) |
| Upstash Ratelimit | 2.0.8 | Rate limiting |

## Dev & Quality
| Tool | Version | Purpose |
|------|---------|---------|
| Bun | 1.3.14 | Package manager / runtime |
| ESLint | 10.3.0 | Linting |
| Prettier | 3.8.3 | Code formatting |
| Vitest | 4.1.5 | Unit testing |
| Playwright | 1.59.1 | E2E testing |
| Husky | 9.1.7 | Git hooks |
| lint-staged | 16.4.0 | Staged linting |
| TypeScript | 6.0.3 | Type checking |
| Drizzle Kit | 0.31.10 | DB migrations |
