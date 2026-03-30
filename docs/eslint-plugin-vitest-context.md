# eslint-plugin-vitest Context

## Overview

eslint-plugin-vitest provides ESLint rules specifically designed for Vitest (the Vite-native testing framework). It helps enforce best practices and catch common mistakes when writing tests with Vitest.

## Installation

```bash
npm install eslint-plugin-vitest
```

Note: There are two packages - @vitest/eslint-plugin (official) and eslint-plugin-vitest (community version).

## Usage

### In ESLint Configuration

```javascript
import vitest from "eslint-plugin-vitest";

export default [
  {
    plugins: {
      vitest: vitest
    },
    rules: {
      "vitest/prefer-vi-mocked": "error",
      "vitest/no-commented-out-tests": "error",
      "vitest/no-duplicate-hooks": "error",
      "vitest/consistent-test-it": "error"
    }
  }
];
```

## Key Rules

- **prefer-vi-mocked**: Prefer vi.mocked() over fn as Mock
- **no-commented-out-tests**: Disallow commented-out tests
- **no-duplicate-hooks**: Disallow duplicate hooks in a describe block
- **consistent-test-it**: Enforce consistent test and it usage
- **no-test-prefixes**: Disallow 'test' and 'it' prefixes
- **prefer-vi-test-globals**: Prefer global test and it functions
- **valid-title**: Enforce valid test titles
- **no-conditional-expect**: Disallow conditional expect

## Configuration

```javascript
{
  rules: {
    'vitest/consistent-test-it': ['error', {
      fn: 'test',
    }],
  },
}
```

## Vitest-Specific Features

The plugin understands Vitest-specific APIs:

- vi.fn(), vi.mock(), vi.spyOn()
- describe(), test(), it(), beforeEach(), afterEach()
- expect().toHaveBeenCalled(), etc.
- Only(), skip(), todo() modifiers

## Resources

- [GitHub Repository](https://github.com/vitest-dev/eslint-plugin-vitest)
- [npm Package](https://www.npmjs.com/package/eslint-plugin-vitest)
- [Official @vitest/eslint-plugin](https://www.npmjs.com/package/@vitest/eslint-plugin)
