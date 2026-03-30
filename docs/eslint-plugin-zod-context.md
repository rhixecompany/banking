# eslint-plugin-zod Context

## Overview

eslint-plugin-zod provides ESLint rules that add custom linting rules to enforce best practices when using Zod (the TypeScript-first schema validation library).

## Installation

```bash
npm install eslint-plugin-zod
```

## Usage

### In ESLint Configuration

```javascript
import zod from "eslint-plugin-zod";

export default [
  {
    plugins: {
      zod: zod
    },
    rules: {
      "zod/require-error-message": "error",
      "zod/require-validation": "error",
      "zod/no-default-exports": "error",
      "zod/no-unknown-types": "warn"
    }
  }
];
```

## Key Rules

- **require-error-message**: Require error message in Zod validations
- **require-validation**: Require Zod schema to have validations
- **no-default-exports**: Disallow default exports for schemas
- **no-unknown-types**: Warn about unknown types in Zod schemas
- **consistent-error-handling-map**: Enforce consistent error handling in .transform()
- **no-nested-objects**: Disallow nested Zod objects in schemas
- **no-partials**: Disallow ZodPartial usage

## Configuration

```javascript
{
  rules: {
    'zod/require-error-message': ['error', {
      allowedMethods: ['transform', 'refine'],
    }],
  },
}
```

## Common Use Cases

### Schema Validation Rules

```javascript
const UserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  age: z.number().positive("Age must be positive")
});
```

### Error Handling

```javascript
const result = UserSchema.safeParse(data);
if (!result.success) {
  console.log(result.error.issues);
}
```

## Zod OpenAPI

For Zod OpenAPI integration, consider:

- [eslint-plugin-zod-openapi](https://github.com/samchungy/eslint-plugin-zod-openapi)

## Resources

- [GitHub Repository](https://github.com/marcalexiei/eslint-plugin-zod)
- [npm Package](https://www.npmjs.com/package/eslint-plugin-zod)
