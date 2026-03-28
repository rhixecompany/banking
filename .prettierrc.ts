/**
 * @file .prettierrc.ts
 * @description Prettier configuration for ComicWise
 * @author ComicWise Team
 * @date 2026-01-30
 */

import type { Options } from "prettier";

/**
 * Description placeholder
 *
 * @type {Options}
 */
const config: Options = {
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: false,
  trailingComma: "all",
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: "always",
  endOfLine: "lf",
  jsxSingleQuote: false,
  // ═══════════════════════════════════════════════════
  // File-Specific Overrides
  // ═══════════════════════════════════════════════════
  overrides: [
    {
      files: "*.md",
      options: {
        printWidth: 70,
        useTabs: false,
        trailingComma: "none",
        arrowParens: "avoid",
        proseWrap: "never",
      },
    },
    {
      files: "*.{json,babelrc,eslintrc,remarkrc,prettierrc}",
      options: {
        useTabs: false,
      },
    },
    {
      files: "*.json",
      options: {
        printWidth: 70,
      },
    },

    {
      files: "*.yaml",
      options: {
        tabWidth: 2,
      },
    },
    {
      files: "*.yml",
      options: {
        tabWidth: 2,
      },
    },
  ],
  // ═══════════════════════════════════════════════════
  // Plugin Configuration
  // ═══════════════════════════════════════════════════
  plugins: [  "prettier-plugin-tailwindcss",
    "prettier-plugin-organize-imports",
    "prettier-plugin-packagejson",
    "prettier-plugin-sort-json",],

  // Prettier Plugin: Tailwind CSS
  tailwindStylesheet: "./app/globals.css",
  tailwindConfig: "",
  tailwindAttributes: ["class", "className"],
  tailwindFunctions: ["clsx", "cn", "cva", "twMerge", "twJoin", "tw"],
};

export default config;
