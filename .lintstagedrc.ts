/**
 * @filename: lint-staged.config.js
 * @type {import('lint-staged').Configuration}
 */
export default {
  // Run Prettier on other supported formats
  "*.{json,md,css}": ["npm run format"],
  // Run Prettier and ESLint on staged TS and JS files
  // "*.{ts,tsx,js,jsx}": ["npm run lint:fix:all"],
  // Run Prettier on other supported formats
  // "*.{md}": ["npm run format:markdown:fix"],
};
