import js from "@eslint/js";
import tsEslintParser from "@typescript-eslint/parser";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier";
import betterTailwind from "eslint-plugin-better-tailwindcss";
// @ts-expect-error - no bundled types for eslint-plugin-drizzle
import drizzle from "eslint-plugin-drizzle";
import importX from "eslint-plugin-import-x";
import jest from "eslint-plugin-jest";
import nodePlugin from "eslint-plugin-n";
import perfectionist from "eslint-plugin-perfectionist";
import playwright from "eslint-plugin-playwright";
import reactRefresh from "eslint-plugin-react-refresh";
import security from "eslint-plugin-security";
import sonarjs from "eslint-plugin-sonarjs";
import testingLibrary from "eslint-plugin-testing-library";
import unicorn from "eslint-plugin-unicorn";
import zod from "eslint-plugin-zod";

import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tsEslint from "typescript-eslint";

export default defineConfig([
  js.configs.recommended,
  tsEslint.configs.recommended,
  nextVitals,
  nextTs,

  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "dist/**",
    "node_modules/**",
    "next-env.d.ts",
    ".references/**",
    "logs/**",
    "coverage/**",
    "test-results/**",
    "playwright-report/**",
    ".vercel/**",
    ".github/skills/**",
  ]),
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
        ...globals.jest,
        describe: "readonly",
        it: "readonly",
        test: "readonly",
        expect: "readonly",
        beforeAll: "readonly",
        beforeEach: "readonly",
        afterAll: "readonly",
        afterEach: "readonly",
        vi: "readonly",
      },
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
        projectService: {
          allowDefaultProject: [".prettierrc.ts", "postcss.config.mjs"],
        },
      },
      parser: tsEslintParser,
    },
    linterOptions: {
      noInlineConfig: false,
      reportUnusedDisableDirectives: true,
    },
    settings: {
      "import-x/resolver": [
        {
          typescript: {
            alwaysTryTypes: true,
            project: "./tsconfig.json",
          },
        },
        "node",
      ],
      react: {
        version: "detect",
      },
      "better-tailwindcss": {
        entryPoint: "app/globals.css",
        tailwindConfig: "",
        attributes: ["class", "className"],
        callees: [
          "cc",
          "clb",
          "clsx",
          "cn",
          "cnb",
          "ctl",
          "cva",
          "cx",
          "dcnb",
          "objstr",
          "tv",
          "twJoin",
          "twMerge",
        ],
        variables: ["className", "classNames", "classes", "style", "styles"],
        tags: ["myTag"],
      },
    },
    files: ["**/*.{js,jsx,ts,tsx,cjs,mts,cts}"],
    plugins: {
      "import-x": importX,
      "@typescript-eslint": tsEslint.plugin,
      unicorn,
      security: security as unknown as typeof importX,
      sonarjs,
      perfectionist,
      n: nodePlugin,
      "react-refresh": reactRefresh,

      drizzle,
      "better-tailwindcss": betterTailwind,
      zod,
      jest,
      "testing-library": testingLibrary,
      playwright,
      js,
    },
    rules: {
      // Add minimal rules here or leave empty for now
    },
  },
  prettier,
]);
