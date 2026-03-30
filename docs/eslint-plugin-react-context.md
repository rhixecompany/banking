# eslint-plugin-react Context

## Overview

eslint-plugin-react provides React-specific linting rules for ESLint. It helps enforce best practices and catch common mistakes when writing React applications.

## Installation

```bash
npm install eslint-plugin-react
```

## Usage

### In ESLint Configuration

```javascript
import react from "eslint-plugin-react";

export default [
  {
    plugins: {
      react: react
    },
    rules: {
      "react/jsx-uses-react": "error",
      "react/react-in-jsx-scope": "error",
      "react/prop-types": "warn",
      "react/no-unused-prop-types": "warn"
    }
  },
  {
    settings: {
      react: {
        version: "detect"
      }
    }
  }
];
```

## Key Rules

- **react/jsx-uses-react**: Prevent React to be incorrectly marked as unused
- **react/react-in-jsx-scope**: Enforce React to be in scope (for older React versions)
- **react/prop-types**: Validate prop types are defined
- **react/no-unused-prop-types**: Disallow unused prop types
- **react/display-name**: Require display name for components
- **react/jsx-key**: Enforce keys in JSX lists
- **react/no-array-key**: Disallow array index as key
- **react/hook-use-state**: Enforce proper useState naming

## React Hooks Rules

When using React Hooks, consider these rules:

- **react-hooks/rules-of-hooks**: Enforce Rules of Hooks
- **react-hooks/exhaustive-deps**: Enforce dependencies in useEffect

## Configuration

The plugin can automatically detect React version:

```javascript
{
  settings: {
    react: {
      version: 'detect',
    },
  },
}
```

## Resources

- [GitHub Repository](https://github.com/jsx-eslint/eslint-plugin-react)
- [npm Package](https://www.npmjs.com/package/eslint-plugin-react)
- [Rules Documentation](https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules)
