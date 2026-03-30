/**
 * @file .prettierrc.ts
 * @description Prettier configuration for Banking
 * @author Banking Team
 * @date 2026-03-29
 */

import type { Options } from "prettier";

const config: Options = {
  arrowParens: "always",
  bracketSameLine: false,
  bracketSpacing: true,
  endOfLine: "lf",
  jsxSingleQuote: false,
  // ═══════════════════════════════════════════════════
  // File-Specific Overrides
  // ═══════════════════════════════════════════════════
  overrides: [
    {
      files: "*.md",
      options: {
        arrowParens: "avoid",
        printWidth: 70,
        proseWrap: "never",
        trailingComma: "none",
        useTabs: false,
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
  plugins: [
    "prettier-plugin-tailwindcss",
    "prettier-plugin-organize-imports",
    "prettier-plugin-packagejson",
    "prettier-plugin-sort-json",
  ],
  printWidth: 80,
  semi: true,
  singleQuote: false,
  tabWidth: 2,
  tailwindAttributes: ["class", "className"],
  tailwindConfig: "",

  tailwindFunctions: ["clsx", "cn", "cva", "twMerge", "twJoin", "tw"],
  // Prettier Plugin: Tailwind CSS
  tailwindStylesheet: "./app/globals.css",
  trailingComma: "all",
  useTabs: false,
};

export default config;
