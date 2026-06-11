# eslint-config-prettier Context

## Overview

eslint-config-prettier turns off all ESLint rules that are unnecessary or might conflict with Prettier. This ensures that your code formatting is handled entirely by Prettier without any interference from ESLint.

## Installation

```bash
npm install eslint-config-prettier
```

## Usage

### In ESLint Configuration (eslint.config.js)

```javascript
import prettier from "eslint-config-prettier";
import someOtherConfig from "eslint-config-some-other";

export default [someOtherConfig, prettier];
```

## How It Works

The config disables formatting-related ESLint rules that might conflict with Prettier's code style. This includes rules about:

- Semicolons
- Quotes
- Tabs vs spaces
- Trailing commas
- Single vs double quotes
- And many other formatting rules

## Supported Configs

eslint-config-prettier can be combined with:

- eslint-config-standard
- eslint-config-standard-react
- eslint-config-prettier/react
- eslint-config-prettier/vue
- eslint-config-prettier/flow
- eslint-config-prettier/standard
- And many others

## Resources

- [GitHub Repository](https://github.com/prettier/eslint-config-prettier)
- [npm Package](https://www.npmjs.com/package/eslint-config-prettier)
