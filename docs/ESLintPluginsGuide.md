# ESLint Plugins Guide

## Quick Setup

```bash
npm install eslint-plugin-react eslint-plugin-zod eslint-plugin-drizzle eslint-plugin-import-x
```

```javascript
// eslint.config.js
import react from "eslint-plugin-react";
import zod from "eslint-plugin-zod";
import drizzle from "eslint-plugin-drizzle";
import importX from "eslint-plugin-import-x";

export default [
  { plugins: { react, zod, drizzle, "import-x": importX } },
  {
    rules: {
      /* add rules below */
    }
  }
];
```

---

## React (`eslint-plugin-react`)

```javascript
{
  rules: {
    "react/jsx-uses-react": "error",
    "react/jsx-key": "error",
    "react/no-unused-prop-types": "warn",
    "react/prop-types": "warn",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  },
  settings: { react: { version: "detect" } }
}
```

**Key Rules:**

- `jsx-key`: Enforce keys in JSX lists
- `no-array-key`: Disallow array index as key
- `hook-use-state`: Enforce proper useState naming

---

## Zod (`eslint-plugin-zod`)

```javascript
{
  rules: {
    "zod/require-error-message": "error",
    "zod/require-validation": "error",
    "zod/no-default-exports": "error",
    "zod/no-nested-objects": "error"
  }
}
```

**Key Rules:**

- `require-error-message`: Require error message in Zod validations
- `require-validation`: Require Zod schema to have validations
- `no-default-exports`: Disallow default exports for schemas

---

## Drizzle (`eslint-plugin-drizzle`)

```javascript
{
  rules: {
    "drizzle/enforce-delete-with-where": "error",
    "drizzle/enforce-update-with-where": "error"
  }
}
```

**Key Rules:**

- `enforce-delete-with-where`: Requires WHERE in delete operations
- `enforce-update-with-where`: Requires WHERE in update operations

---

## Import X (`eslint-plugin-import-x`)

```javascript
{
  rules: {
    "import-x/order": ["error", { "newlines-between": "always" }],
    "import-x/no-duplicates": "error",
    "import-x/no-unresolved": "warn"
  }
}
```

**Key Rules:**

- `order`: Enforce import ordering
- `no-duplicates`: Disallow duplicate imports
- `no-unresolved`: Warn about unresolved imports

---

## Other Useful Plugins

| Plugin | Purpose | Install |
| --- | --- | --- |
| `eslint-plugin-security` | Security scanning | `npm i -D eslint-plugin-security` |
| `eslint-plugin-unicorn` | Modern JS best practices | `npm i -D eslint-plugin-unicorn` |
| `eslint-plugin-playwright` | Playwright test best practices | `npm i -D eslint-plugin-playwright` |
| `eslint-plugin-vitest` | Vitest test best practices | `npm i -D eslint-plugin-vitest` |
| `eslint-plugin-testing-library` | Testing Library best practices | `npm i -D eslint-plugin-testing-library` |
| `eslint-plugin-perfectionist` | Sort imports, enums, etc | `npm i -D eslint-plugin-perfectionist` |

---

## Resources

- [ESLint Config](https://eslint.org/docs/latest/user-guide/configuring/configuration-files)
- [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react)
- [eslint-plugin-zod](https://github.com/marcalexiei/eslint-plugin-zod)
- [eslint-plugin-drizzle](https://github.com/drizzle-team/drizzle-orm/tree/main/eslint-plugin-drizzle)
