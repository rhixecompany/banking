# eslint-plugin-testing-library Context

## Overview

eslint-plugin-testing-library provides ESLint rules to follow best practices and anticipate common mistakes when writing tests with Testing Library (React Testing Library, Vue Testing Library, etc.).

## Installation

```bash
npm install eslint-plugin-testing-library
```

## Usage

### In ESLint Configuration

```javascript
import testingLibrary from "eslint-plugin-testing-library";

export default [
  {
    plugins: {
      "testing-library": testingLibrary
    },
    rules: {
      "testing-library/no-render-in-lifecycle": "error",
      "testing-library/no-unnecessary-act": "error",
      "testing-library/prefer-query-matchers": "error",
      "testing-library/render-result-naming-convention": "error"
    }
  }
];
```

## Key Rules

- **no-render-in-lifecycle**: Disallow render in component lifecycle methods
- **no-unnecessary-act**: Disallow unnecessary async act() calls
- **prefer-query-matchers**: Prefer query matchers over manual element searching
- **render-result-naming-convention**: Enforce naming convention for render result
- **no-container**: Disallow querying rendered container
- **no-element-from-queries-bound-to-window**: Disallow elements from queries bound to window
- **no-manual-cleanup**: Disallow manual cleanup in tests
- **no-promise-in-fire-event**: Disallow promises in fire event methods
- **no-wait-for-side-effects**: Disallow side effects in waitFor

## Framework-Specific Rules

The plugin includes rules specific to different Testing Library adapters:

- **react**: React Testing Library rules
- **vue**: Vue Testing Library rules
- **angular**: Angular Testing Library rules
- **marko**: Marko Testing Library rules

## Configuration

```javascript
{
  settings: {
    'testing-library': {
      framework: 'react',
    },
  },
}
```

## Resources

- [GitHub Repository](https://github.com/testing-library/eslint-plugin-testing-library)
- [Official Documentation](https://testing-library.com/docs/ecosystem-eslint-plugin-testing-library/)
- [npm Package](https://www.npmjs.com/package/eslint-plugin-testing-library)
