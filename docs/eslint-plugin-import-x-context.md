# eslint-plugin-import-x Context

## Overview

eslint-plugin-import-x is a fork of eslint-plugin-import that aims to provide a more performant and more lightweight version of the original plugin. It helps enforce import/export rules and detect issues with module imports.

## Installation

```bash
npm install eslint-plugin-import-x
```

## Usage

### In ESLint Configuration

```javascript
import importX from "eslint-plugin-import-x";

export default [
  {
    plugins: {
      "import-x": importX
    },
    rules: {
      "import-x/order": "error",
      "import-x/no-duplicates": "error",
      "import-x/named": "error"
    }
  }
];
```

## Key Rules

- **order**: Enforce a specific order for imports (e.g., external, internal, relative)
- **no-duplicates**: Disallow duplicate imports
- **named**: Enforce named exports to match import names
- **namespace**: Enforce namespace imports
- **default**: Enforce default exports
- **extensions**: Enforce file extensions in imports
- **no-unresolved**: Disallow unresolved imports

## Key Features

- Uses get-tsconfig for better TypeScript support
- More performant than the original eslint-plugin-import
- Supports ESLint 9 flat config
- Lighter weight implementation

## Resources

- [GitHub Repository](https://github.com/un-ts/eslint-plugin-import-x)
- [npm Package](https://www.npmjs.com/package/eslint-plugin-import-x)
