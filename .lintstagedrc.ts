/**
 * @filename: .lintstagedrc.ts
 * @type {import('lint-staged').Configuration}
 */
const config: import("lint-staged").Configuration = {
  // Run Prettier on other supported formats
  "*.{json,md,css,js,jsx,ts,tsx,cjs,mts,cts}": ["npm run format"],
  // Run Prettier and ESLint on staged TS and JS files
  // "*.{json,md,js,jsx,ts,tsx,mts,cts}": ["npm run lint:fix:all"],
  // Run Prettier on other supported formats
  // "*.{md}": ["npm run format:markdown:fix"],
};
export default config;
