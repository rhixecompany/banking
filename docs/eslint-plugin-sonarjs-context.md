# eslint-plugin-sonarjs Context

## Overview

eslint-plugin-sonarjs provides SonarJS rules for ESLint. It's maintained by SonarSource and brings their code quality rules to ESLint. It helps detect bugs, code smells, and security vulnerabilities.

## Installation

```bash
npm install eslint-plugin-sonarjs
```

## Usage

### In ESLint Configuration

```javascript
import sonarjs from "eslint-plugin-sonarjs";

export default [
  {
    plugins: {
      sonarjs: sonarjs
    },
    rules: {
      "sonarjs/no-all-duplicated-branches": "error",
      "sonarjs/no-collapsible-if": "error",
      "sonarjs/no-duplicate-string": "warn",
      "sonarjs/no-gratuitous-css": "error",
      "sonarjs/no-redundant-jump": "error"
    }
  }
];
```

## Key Rules

### Bug Detection

- **no-all-duplicated-branches**: Conditionals with identical implementations
- **no-collapsible-if**: Collapsible if statements
- **no-redundant-jump**: Redundant jump statements
- **no-small-switch**: Switch with less than 3 cases

### Code Quality

- **no-duplicate-string**: Duplicated string literals
- **cognitive-complexity**: Enforce cognitive complexity limits
- **no-gratuitous-css**: CSS selectors with no effect
- **max-lines**: Maximum number of lines per file
- **max-lines-per-function**: Maximum lines per function

### Security

- **no-hardcoded-credentials**: Hardcoded credentials
- **no-weak-cipher**: Weak cryptographic algorithms

## Configurations

The plugin provides recommended configurations:

- `sonarts`: Basic recommended rules
- `sonarts-with-recommended`: All recommended rules

```javascript
import sonarjs from "eslint-plugin-sonarjs";

export default [...sonarjs.configs["sonarts-with-recommended"]];
```

## Resources

- [GitHub Repository](https://github.com/SonarSource/eslint-plugin-sonarjs)
- [npm Package](https://www.npmjs.com/package/eslint-plugin-sonarjs)
