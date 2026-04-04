# eslint-plugin-security Context

## Overview

eslint-plugin-security provides ESLint rules for Node.js security. It helps detect potential security vulnerabilities and enforce secure coding practices in your codebase.

## Installation

```bash
npm install eslint-plugin-security
```

## Usage

### In ESLint Configuration

```javascript
import security from "eslint-plugin-security";

export default [
  {
    plugins: {
      security: security
    },
    rules: {
      "security/detect-non-literal-fs-filename": "error",
      "security/detect-non-literal-regexp": "error",
      "security/detect-non-literal-require": "error",
      "security/detect-unsafe-regex": "error"
    }
  }
];
```

## Key Rules

- **detect-unsafe-regex**: Detects potentially unsafe regular expressions that could cause ReDoS
- **detect-non-literal-fs-filename**: Detects non-literal filenames passed to fs functions
- **detect-non-literal-regexp**: Detects non-literal regular expressions
- **detect-non-literal-require**: Detects non-literal require calls
- **detect-buffer-noassert**: Detects Buffer.noAssert usage
- **detect-child-process**: Detects child process usage
- **detect-eval-with-expression**: Detects eval with expressions
- **detect-possible-timing-attacks**: Detects possible timing attacks

## Security Categories

The rules cover several security categories:

1. **Code Execution**: Detects eval, new Function, setTimeout with strings
2. **Path Traversal**: Detects unsafe file path operations
3. **Command Injection**: Detects unsafe command executions
4. **Denial of Service**: Detects unsafe regular expressions
5. **Prototype Pollution**: Detects unsafe object operations

## Note

This plugin is community-maintained. Consider using additional security tools like:

- eslint-plugin-secure-coding
- CodeQL
- Snyk

## Resources

- [GitHub Repository](https://github.com/eslint-community/eslint-plugin-security)
- [npm Package](https://www.npmjs.com/package/eslint-plugin-security)
