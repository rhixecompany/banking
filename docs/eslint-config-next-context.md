# eslint-config-next Context

## Overview

eslint-config-next is the official ESLint configuration package provided by Next.js. It makes it easy to catch common issues in your Next.js application by including the @next/eslint-plugin-next plugin along with recommended rules.

## Installation

```bash
npm install eslint-config-next
```

## Usage

### In ESLint Configuration (eslint.config.js)

```javascript
import nextPlugin from "@next/eslint-plugin-next";
import nextConfig from "eslint-config-next";

export default [...nextConfig];
```

## Included Plugins

- @next/eslint-plugin-next - Next.js specific linting rules

## Key Rules

- **@next/next/google-font-display**: Enforce display: swap with Google Fonts
- **@next/next/google-font-preconnect**: Enforce preconnect with Google Fonts
- **@next/next/no-assign-module-variable**: Prevent assignment to module variable
- **@next/next/no-html-link-for-pages**: Avoid plain HTML links to pages
- **@next/next/no-img-element**: Prevent usage of `<img>` element
- **@next/next/no-sync-scripts**: Prevent synchronous scripts
- **@next/next/no-unwanted-polyfillio**: Avoid unwanted polyfills from polyfill.io

## Resources

- [Official Documentation](https://nextjs.org/docs/app/api-reference/config/eslint)
- [GitHub Repository](https://github.com/vercel/next.js)
- [npm Package](https://www.npmjs.com/package/eslint-config-next)
