# eslint-plugin-jest Context

## Overview

eslint-plugin-jest provides ESLint rules for Jest testing framework. It helps enforce best practices and catch common mistakes when writing Jest tests.

## Installation

```bash
npm install eslint-plugin-jest
```

## Usage

### In ESLint Configuration

```javascript
import jest from "eslint-plugin-jest";

export default [
  {
    plugins: {
      jest: jest
    },
    rules: {
      "jest/expect-expect": "error",
      "jest/no-disabled-tests": "warn",
      "jest/no-focused-tests": "error",
      "jest/prefer-to-have-length": "error"
    }
  }
];
```

## Key Rules

- **no-disabled-tests**: Disallow disabled tests
- **no-focused-tests**: Disallow focused tests (test.only, describe.only)
- **expect-expect**: Enforce assertions in tests
- **prefer-to-have-length**: Prefer toHaveLength over expect(array).toHaveLength()
- **prefer-to-contain**: Prefer toContain over expect(array).toContain()
- **no-conditional-expect**: Disallow conditional expect
- **no-comments**: Disallow comments in test files
- **valid-title**: Enforce valid test titles

## Jest-Extended

For additional rules, consider eslint-plugin-jest-extended:

```bash
npm install eslint-plugin-jest-extended
```

## Resources

- [GitHub Repository](https://github.com/jest-community/eslint-plugin-jest)
- [npm Package](https://www.npmjs.com/package/eslint-plugin-jest)
