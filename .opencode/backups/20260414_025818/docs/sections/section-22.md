# Section 22 — Code Review Checklist

- No `any` types; zero TypeScript errors.
- No ESLint warnings; run `npm run lint:strict`.
- All DB access via DAL.

Reviewer tip: Run `npm run type-check` locally before approving.
