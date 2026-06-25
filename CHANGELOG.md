# Banking — Changelog

## [0.1.0] — 2026-05-27

### Added
- Next.js 16 App Router setup with TypeScript strict mode
- PostgreSQL database with Drizzle ORM integration
- User authentication via NextAuth v4 (Credentials flow)
- Plaid Link token generation and exchange flow
- Dwolla customer creation and ACH transfers
- Dashboard with balance overview and transaction list
- Wallet management with connected bank accounts
- Transaction history with filtering
- Recipient management for transfers
- Admin panel foundation
- Rate limiting with Upstash Redis
- Responsive UI with shadcn/ui components
- Dark/light theme support
- Zod validation for all server actions
- Constructor-based Data Access Layer (DAL)
- Server Actions for all mutations
- Playwright E2E test suite
- Vitest unit test framework
- CI/CD pipeline with GitHub Actions
- Docker support with multi-stage build
- Environment variable validation
- Code formatting with Prettier
- ESLint with strict rules (no `any` types)
- Husky pre-commit hooks
- Automated contributors management

### Changed
- Initial release

### Security
- bcrypt password hashing
- Encrypted Plaid access token storage
- Rate limiting on auth endpoints
- Idempotency keys for all financial transactions
- Soft-delete pattern for user data
- CSRF protection via Server Actions
