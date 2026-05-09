# Dependencies

## Rules

- Use official/canonical packages only — no unmaintained or malicious packages
- Pin major versions in `package.json` — allow minor/patch updates
- Audit dependencies regularly with `bun audit` or `npm audit`
- Use `lib/utils` for encryption utilities — never implement crypto yourself

## Approved Packages

### Core

| Package      | Version | Purpose     |
| ------------ | ------- | ----------- |
| `next`       | ^16.0.0 | Framework   |
| `react`      | ^19.0.0 | UI library  |
| `typescript` | ^5.7.0  | Type safety |

### Database

| Package                    | Version | Purpose                 |
| -------------------------- | ------- | ----------------------- |
| `drizzle-orm`              | ^0.40.0 | ORM                     |
| `postgres`                 | ^3.4.0  | PostgreSQL driver       |
| `@neondatabase/serverless` | ^0.10.0 | Neon/serverless support |

### Auth & Security

| Package     | Version | Purpose          |
| ----------- | ------- | ---------------- |
| `next-auth` | ^4.24.0 | Authentication   |
| `bcrypt`    | ^5.1.0  | Password hashing |
| `jose`      | ^5.9.0  | JWT handling     |

### Forms & Validation

| Package               | Version | Purpose           |
| --------------------- | ------- | ----------------- |
| `react-hook-form`     | ^7.54.0 | Form state        |
| `@hookform/resolvers` | ^3.10.0 | Schema validation |
| `zod`                 | ^3.24.0 | Schema validation |

### External APIs

| Package              | Version | Purpose    |
| -------------------- | ------- | ---------- |
| `plaid`              | ^23.0.0 | Plaid SDK  |
| `dwolla-rest-client` | ^2.0.0  | Dwolla SDK |

### UI & Styling

| Package          | Version  | Purpose        |
| ---------------- | -------- | -------------- |
| `tailwindcss`    | ^4.0.0   | CSS framework  |
| `lucide-react`   | ^0.500.0 | Icons          |
| `clsx`           | ^2.1.0   | Class merging  |
| `tailwind-merge` | ^2.6.0   | Tailwind utils |

### Logging

| Package       | Version | Purpose            |
| ------------- | ------- | ------------------ |
| `pino`        | ^9.0.0  | Structured logging |
| `pino-pretty` | ^11.0.0 | Log formatting     |

## Anti-patterns

### Don't Use Unmaintained Packages

```json
// BAD: Unmaintained or vulnerable packages
{
  "some-random-package": "^1.0.0" // ❌ No maintenance
}
```

### Don't Bypass Security Warnings

```bash
# BAD: Ignoring security audit failures
bun audit --ignore-all # ❌
```
