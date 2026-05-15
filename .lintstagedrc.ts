/**
 * @filename: .lintstagedrc.ts
 * @type {import('lint-staged').Configuration}
 */
const config: import("lint-staged").Configuration = {
  "*.{json,md,yml}": ["bun run format:check && bun run format:markdown:fix"],
  "*.{ts,tsx}": ["bun run lint:fix:all"],
};
export default config;
