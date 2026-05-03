---
category: quality
source: github-prompts
tags: [code-review, quality, best-practices]
date: 2026-05-03
---

# Code Review Prompt

Review code for the Banking app with focus on quality and best practices.

## Review Focus Areas

### Correctness

- Logic correctness and edge cases
- Error handling
- Input validation

### Security

- No hardcoded secrets
- Proper authentication/authorization
- SQL injection prevention (use Drizzle!)

### Performance

- N+1 query detection
- Unnecessary re-renders in React
- Bundle size considerations

### Maintainability

- Clear naming
- Code organization
- Documentation where needed

### Banking App Standards (from AGENTS.md)

- ✅ Use Server Actions for mutations
- ✅ Use DAL helpers for DB access
- ✅ Use `app-config.ts` for env vars
- ✅ Zod for validation
- ✅ TypeScript strict mode - no `any`

## Review Template

```markdown
## Review: {File/Feature}

### Issues Found

- **Critical**: {description}
- **Major**: {description}
- **Minor**: {description}

### Suggestions

- Improvement 1
- Improvement 2

### What Looks Good

- Good pattern 1
- Good pattern 2
```

## Banking-Specific Checks

- Financial calculations use proper decimal handling
- Transaction boundaries are correct
- Audit logging where needed
- No auth calls in home page (`app/page.tsx`)

For detailed patterns, see `.github/prompts/code-review.prompt.md`
