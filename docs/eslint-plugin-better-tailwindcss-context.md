# eslint-plugin-better-tailwindcss Context

## Overview

eslint-plugin-better-tailwindcss is an ESLint plugin that helps you write better Tailwind CSS by improving readability with formatting rules and enforcing best practices with linting rules.

## Installation

```bash
npm install eslint-plugin-better-tailwindcss
```

## Usage

### In ESLint Configuration

```javascript
import betterTailwindcss from "eslint-plugin-better-tailwindcss";

export default [
  {
    plugins: {
      "better-tailwindcss": betterTailwindcss
    },
    rules: {
      "better-tailwindcss/enforces-default-imports": "error",
      "better-tailwindcss/enforces-qualified-class-names": "error",
      "better-tailwindcss/no-unnecessary-fallback": "error",
      "better-tailwindcss/no-unsafe-classlist-element": "error"
    }
  }
];
```

## Key Rules

- **enforces-default-imports**: Enforces using default imports from 'tailwindcss'
- **enforces-qualified-class-names**: Enforces using qualified class names (e.g., text-center instead of .text-center)
- **no-unsafe-classlist-element**: Prevents unsafe classList manipulation
- **no-unnecessary-fallback**: Removes unnecessary fallback values

## Configuration Options

The plugin supports customization through its options:

```javascript
{
  rules: {
    'better-tailwindcss/enforces-default-imports': ['error', {
      'imports': ['clsx', 'cva', 'twMerge'],
    }],
  },
}
```

## Resources

- [GitHub Repository](https://github.com/schoero/eslint-plugin-better-tailwindcss)
- [npm Package](https://www.npmjs.com/package/eslint-plugin-better-tailwindcss)
