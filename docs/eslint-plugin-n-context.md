# eslint-plugin-n Context

## Overview

eslint-plugin-n provides additional ESLint rules for Node.js. It helps enforce best practices and detect common issues specific to Node.js development.

## Installation

```bash
npm install eslint-plugin-n
```

## Usage

### In ESLint Configuration

```javascript
import n from "eslint-plugin-n";

export default [
  {
    plugins: {
      n: n
    },
    rules: {
      "n/no-deprecated-api": "error",
      "n/no-process-env": "error",
      "n/no-process-exit": "error"
    }
  }
];
```

## Key Rules

- **no-process-env**: Disallow the use of process.env (encourages using env files)
- **no-process-exit**: Disallow process.exit()
- **no-deprecated-api**: Disallow deprecated Node.js APIs
- **no-unpublished-required**: Disallow unpublished packages in dependencies
- **no-unsupported-features**: Disallow unsupported Node.js features
- **callback-return**: Enforce return statements in callbacks
- **handle-callback-err**: Enforce error handling in callbacks

## Node.js Version Support

The plugin allows specifying the minimum Node.js version to ensure compatibility:

```javascript
{
  rules: {
    'n/no-unsupported-features': ['error', { version: '20.0.0' }],
  },
}
```

## Resources

- [GitHub Repository](https://github.com/eslint-community/eslint-plugin-n)
- [npm Package](https://www.npmjs.com/package/eslint-plugin-n)
