# @typescript-eslint/parser Context

## Overview

@typescript-eslint/parser is an ESLint parser used to parse TypeScript code into ESLint-compatible nodes, as well as provide backing TypeScript programs. It is necessary because TypeScript is not supported by default in ESLint.

## Installation

```bash
npm install @typescript-eslint/parser
```

## Usage

### In ESLint Configuration (eslint.config.js)

```javascript
import tseslint from "typescript-eslint";

export default tseslint.config({
  files: ["**/*.ts", "**/*.tsx"],
  languageOptions: {
    parser: tseslint.parser
  }
});
```

### Parser Options

The parser supports several options:

- `project`: Specify the path to the TypeScript project (tsconfig.json)
- `projectFolderIgnoreList`: Patterns to ignore when looking for tsconfig.json
- `tsconfigRootDir`: Path to the root directory of the TypeScript project
- `extraFileExtensions`: Additional file extensions to parse
- `ecmaVersion`: ECMAScript version (default: 2020)
- `sourceType`: 'module' or 'script' (default: 'module')

## Key Features

- Parses TypeScript into ESTree-compatible AST
- Provides TypeScript program for type-aware rules
- Supports all TypeScript syntax including decorators and optional chaining
- Enables type checking rules via TypeScript compiler

## Resources

- [Official Documentation](https://typescript-eslint.io/packages/parser/)
- [GitHub Repository](https://github.com/typescript-eslint/typescript-eslint)
- [npm Package](https://www.npmjs.com/package/@typescript-eslint/parser)
