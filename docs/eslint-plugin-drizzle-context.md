# eslint-plugin-drizzle Context

## Overview

eslint-plugin-drizzle is an ESLint plugin specifically designed for Drizzle ORM users to avoid common pitfalls. It provides rules to enforce best practices when working with Drizzle ORM.

## Installation

```bash
npm install eslint-plugin-drizzle
```

## Usage

### In ESLint Configuration

```javascript
import drizzle from "eslint-plugin-drizzle";

export default [
  {
    plugins: {
      drizzle: drizzle
    },
    rules: {
      "drizzle/enforce-delete-with-where": "error",
      "drizzle/enforce-update-with-where": "error"
    }
  }
];
```

## Key Rules

- **enforce-delete-with-where**: Requires WHERE clause in delete operations to prevent accidental data loss
- **enforce-update-with-where**: Requires WHERE clause in update operations to prevent accidental data loss
- **no-delete-all**: Prevents using .delete(table) without a where condition

## Note

This plugin is recommended to be installed as a regular dependency (not dev dependency) in some configurations.

## Resources

- [GitHub Repository](https://github.com/drizzle-team/drizzle-orm/tree/main/eslint-plugin-drizzle)
- [Drizzle ORM Documentation](https://orm.drizzle.team/docs/eslint-plugin)
- [npm Package](https://www.npmjs.com/package/eslint-plugin-drizzle)
