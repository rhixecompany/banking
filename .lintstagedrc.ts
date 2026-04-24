/**
 * @filename: .lintstagedrc.ts
 * @type {import('lint-staged').Configuration}
 */
const config: import("lint-staged").Configuration = {
  "*.{md}": ["npm run format:markdown:fix"],
  // "*.{json,md,css,js,jsx,ts,tsx,cjs,mts,cts}": ["npm run format:check"],
  // "*.{json,md,js,jsx,ts,tsx,mts,cts}": ["npm run lint:fix:all"],
};
export default config;
