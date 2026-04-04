# eslint-plugin-perfectionist Context

## Overview

eslint-plugin-perfectionist is an ESLint plugin designed to automatically sort and organize code. It provides rules for sorting various data structures including imports, objects, types, enums, and JSX props.

## Installation

```bash
npm install eslint-plugin-perfectionist
```

## Usage

### In ESLint Configuration

```javascript
import perfectionist from "eslint-plugin-perfectionist";

export default [
  {
    plugins: {
      perfectionist: perfectionist
    },
    rules: {
      "perfectionist/sort-enums": "error",
      "perfectionist/sort-imports": "error",
      "perfectionist/sort-objects": "error",
      "perfectionist/sort-types": "error"
    }
  }
];
```

## Key Rules

- **sort-imports**: Sort import statements alphabetically and by type
- **sort-objects**: Sort object properties
- **sort-enums**: Sort enum members
- **sort-types**: Sort type definitions
- **sort-intersection-types**: Sort intersection types
- **sort-union-types**: Sort union types
- **sort-jsx-props**: Sort JSX props

## Available Configs

The plugin provides several preset configurations:

- `recommended`: Default recommended rules
- 'recommended-alphabetical': Alphabetical sorting
- 'natural': Natural sorting (alphabetical with numbers)

## Custom Sorting

You can customize the sorting order:

```javascript
{
  rules: {
    'perfectionist/sort-imports': ['error', {
      order: 'asc',
      type: 'natural',
      groups: [
        ['react', 'react-dom'],
        'builtin',
        'external',
        'internal',
        'parent',
        'sibling',
        'index',
      ],
    }],
  },
}
```

## Resources

- [Official Documentation](https://perfectionist.dev/)
- [GitHub Repository](https://github.com/azat-io/eslint-plugin-perfectionist)
- [npm Package](https://www.npmjs.com/package/eslint-plugin-perfectionist)
