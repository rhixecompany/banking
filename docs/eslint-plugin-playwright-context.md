# eslint-plugin-playwright Context

## Overview

eslint-plugin-playwright provides ESLint rules specifically designed for Playwright testing. It helps enforce best practices and prevent common mistakes when writing end-to-end tests with Playwright.

## Installation

```bash
npm install eslint-plugin-playwright
```

## Usage

### In ESLint Configuration

```javascript
import playwright from "eslint-plugin-playwright";

export default [
  {
    plugins: {
      playwright: playwright
    },
    rules: {
      "playwright/no-wait-for-selector": "error",
      "playwright/no-element-handle": "error",
      "playwright/no-page-pause": "error",
      "playwright/prefer-to-have-count": "error"
    }
  }
];
```

## Key Rules

- **no-wait-for-selector**: Disallow usage of page.waitForSelector
- **no-element-handle**: Disallow usage of elementHandle
- **no-page-pause**: Disallow page.pause() in tests
- **prefer-to-have-count**: Prefer toHaveCount over expect(list.length).toBe()
- **prefer-comparison-matcher**: Suggest using built-in comparison matchers
- **prefer-web-first-assertions**: Suggest using web-first assertions
- **no-conditional-expect**: Disallow conditional expect

## Configuration

The plugin can be configured to match your Playwright setup:

```javascript
{
  rules: {
    'playwright/no-wait-for-selector': ['error', { timeout: 10000 }],
  },
}
```

## Resources

- [GitHub Repository](https://github.com/mskelton/eslint-plugin-playwright)
- [npm Package](https://www.npmjs.com/package/eslint-plugin-playwright)
