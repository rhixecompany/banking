# Contributing to Banking

## Welcome

Thank you for considering contributing to the Banking application. This document outlines how to contribute effectively.

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Accept constructive criticism positively
- Focus on what's best for the community

## How to Contribute

### Reporting Bugs

1. **Check existing issues** - Avoid duplicates
2. **Use bug report template** - Include:
   - Clear title
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details
3. **Be specific** - More details = faster fix

### Suggesting Features

1. **Search existing proposals** - Avoid duplicates
2. **Describe the use case** - Why is this needed?
3. **Propose solutions** - Don't just point out problems
4. **Consider alternatives** - Is this the best approach?

### Pull Requests

#### Before You Start

1. **Check existing PRs** - Avoid duplicate work
2. **Discuss big changes** - Create an issue first
3. **Check the roadmap** - Is this aligned with plans?

#### PR Process

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/your-feature`
3. **Make changes** following the coding standards
4. **Run quality checks**:
   ```bash
   bun run format
   bun run type-check
   bun run lint:strict
   ```
5. **Write tests** if adding new functionality
6. **Update documentation** if needed
7. **Submit PR** with clear description

#### PR Description Template

```markdown
## Description

Brief explanation of what you changed

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

How did you test the changes?

## Checklist

- [ ] Code follows style guidelines
- [ ] Tests pass locally
- [ ] Documentation updated
```

## Coding Standards

### Naming Conventions

| Type           | Convention      | Example          |
| -------------- | --------------- | ---------------- |
| Server Actions | `dot.camelCase` | `auth.signin.ts` |
| Components     | `PascalCase`    | `BankInfo.tsx`   |
| Utils/Hooks    | `camelCase`     | `useAuth.ts`     |
| Database       | `snake_case`    | `user_profiles`  |

### Code Quality

- **TypeScript**: Strict mode, no `any`
- **Zod**: Validate all action inputs
- **Error Handling**: Always return error objects, never throw
- **Soft Delete**: Never hard delete user data

### Documentation

- Add JSDoc for public functions
- Update relevant docs when changing behavior
- Keep README and guides current

## Testing

### Unit Tests

```bash
bun run test:unit
```

### E2E Tests

```bash
bun run test:e2e
```

### Test Structure

```typescript
describe("Feature", () => {
  it("should do something", () => {
    // Arrange
    // Act
    // Assert
  });
});
```

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

[optional body]
```

Types:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructure
- `test`: Tests
- `chore`: Maintenance

## Review Process

1. **Automated checks** must pass (lint, type-check, tests)
2. **At least one review** required
3. **Address feedback** promptly
4. **Squash commits** before merge

## Getting Help

- **Discord**: Join our community channel
- **Issues**: Use GitHub issues for questions
- **Discussions**: Use GitHub discussions

## Recognition

Contributors will be added to the README and `docs/THANKS.md`.

## License

By contributing, you agree that your contributions will be licensed under the project's license.

---

## Quick Reference

```bash
# Setup
git clone https://github.com/rhixecompany/banking.git
cd banking
bun install

# Create branch
git checkout -b feature/my-feature

# Make changes and test
bun run format
bun run type-check
bun run lint:strict

# Commit
git add .
git commit -m "feat(scope): description"

# Push and create PR
git push -u origin feature/my-feature
```

Thank you for contributing!
