# eslint-plugin-unicorn Context

## Overview

eslint-plugin-unicorn provides more than 100 powerful ESLint rules for improving code quality. Created by Sindre Sorhus, it focuses on modern JavaScript/TypeScript best practices.

## Installation

```bash
npm install eslint-plugin-unicorn
```

## Usage

### In ESLint Configuration

```javascript
import unicorn from "eslint-plugin-unicorn";

export default [
  {
    plugins: {
      unicorn: unicorn
    },
    rules: {
      "unicorn/filename-case": "error",
      "unicorn/no-abusive-eslint-disable": "error",
      "unicorn/no-array-instanceof": "error",
      "unicorn/no-null": "error",
      "unicorn/prefer-includes": "error",
      "unicorn/prefer-string-slice": "error",
      "unicorn/throw-new-error": "error"
    }
  }
];
```

## Key Rules

### Best Practices

- **prefer-includes**: Prefer includes over indexOf
- **prefer-string-slice**: Prefer slice over substring/substr
- **prefer-number-properties**: Prefer Number static properties
- **prefer-optional-catch-binding**: Prefer optional catch binding
- **prefer-string-replace-all**: Prefer String replaceAll over replace with regex
- **prefer-at**: Prefer at() over bracket notation for last items
- **prefer-object-from-entries**: Prefer Object.fromEntries over reduce

### Style

- **filename-case**: Enforce filename case (e.g., camelCase, kebab-case)
- **no-abusive-eslint-disable**: Disallow abusive eslint-disable comments
- **no-null**: Disallow null
- **throw-new-error**: Require throwing errors with new keyword

### Performance

- **no-array-for-each**: Disallow forEach
- **no-new-buffer**: Disallow new Buffer

### Security

- **no-new-regexp-selectors**: Disallow new RegExp from untrusted input

## Rule Categories

The plugin includes rules for:

- Bug prevention
- Code simplification
- Performance
- Style
- Security

## Resources

- [GitHub Repository](https://github.com/sindresorhus/eslint-plugin-unicorn)
- [npm Package](https://www.npmjs.com/package/eslint-plugin-unicorn)
