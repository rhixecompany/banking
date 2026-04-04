# eslint-plugin-react-refresh Context

## Overview

eslint-plugin-react-refresh validates that your React components can safely be updated with Fast Refresh (Hot Reloading). It helps catch issues that would prevent components from properly updating during development.

## Installation

```bash
npm install eslint-plugin-react-refresh
```

## Usage

### In ESLint Configuration

```javascript
import reactRefresh from "eslint-plugin-react-refresh";

export default [
  {
    plugins: {
      "react-refresh": reactRefresh
    },
    rules: {
      "react-refresh/no-unused-vars": "warn",
      "react-refresh/only-export-components": "warn"
    }
  }
];
```

## Key Rules

- **only-export-components**: Warn if files export components that shouldn't be hot-reloaded
- **no-unused-vars**: Warn about unused variables that may break Fast Refresh

## Configuration

You can configure which components should be treated as React components:

```javascript
{
  rules: {
    'react-refresh/only-export-components': ['warn', {
      allowConstantExport: true,
    }],
  },
}
```

## Common Issues Fixed

The plugin helps catch these issues:

1. **Named function exports**: React components should be default exports or use hooks
2. **HOCs**: Higher-order components may lose state

- **Dynamic hooks outside custom hooks**: Hooks called dynamically may not preserve state
- **Class components**: These cannot be hot reloaded

## Requirements

- ESLint 9+
- Node.js 20+
- Supports both ESLint flat config and legacy config

## Resources

- [GitHub Repository](https://github.com/ArnaudBarre/eslint-plugin-react-refresh)
- [npm Package](https://www.npmjs.com/package/eslint-plugin-react-refresh)
