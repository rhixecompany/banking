/**
 * @filename: .lintstagedrc.ts
 * @type {import('lint-staged').Configuration}
 */
const config: import("lint-staged").Configuration = {
  "*.{ts,tsx}": [
    "bun run lint:fix:all",
  ],
  "*.{json,md,yml}": [
    "bun run format:fix && bun run format:markdown:fix"
  ]
};
export default config;
