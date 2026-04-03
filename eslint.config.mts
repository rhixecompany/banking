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
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import security from "eslint-plugin-security";
import sonarjs from "eslint-plugin-sonarjs";
import testingLibrary from "eslint-plugin-testing-library";
import unicorn from "eslint-plugin-unicorn";
import vitest from "eslint-plugin-vitest";
import zod from "eslint-plugin-zod";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tsEslint from "typescript-eslint";

export default defineConfig([
  js.configs.recommended,
  tsEslint.configs.recommended,
  tsEslint.configs.strict,
  tsEslint.configs.stylistic,

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
    ".opencode/**",
    "eng/**",
    "fix-constants2.cjs",
    "fix-dwolla.cjs",
  ]),
  {
    files: ["**/*.{js,jsx,ts,tsx,cjs,mts,cts}"],
    languageOptions: {
      ecmaVersion: 2022,
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
        ...globals.jest,
        afterAll: "readonly",
        afterEach: "readonly",
        beforeAll: "readonly",
        beforeEach: "readonly",
        describe: "readonly",
        expect: "readonly",
        it: "readonly",
        test: "readonly",
        vi: "readonly",
      },
      parser: tsEslintParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 2022,
        projectService: {
          allowDefaultProject: [".prettierrc.ts", "postcss.config.mjs"],
        },
        sourceType: "module",
      },
      sourceType: "module",
    },
    linterOptions: {
      noInlineConfig: true,
      reportUnusedDisableDirectives: true, // Too strict
    },
    plugins: {
      "@typescript-eslint": tsEslint.plugin,
      "better-tailwindcss": betterTailwind,
      drizzle,
      "import-x": importX,
      jest,
      js,
      n: nodePlugin,
      perfectionist,

      playwright,
      react: reactPlugin,
      "react-hooks": reactHooks as unknown as typeof importX,
      "react-refresh": reactRefresh,
      security: security as unknown as typeof importX,
      sonarjs,
      "testing-library": testingLibrary,
      unicorn,
      vitest,
      zod,
    },
    rules: {
      "@next/next/no-img-element": "warn", // Sometimes intentional
      "@typescript-eslint/explicit-function-return-type": "off", // Too strict
      "@typescript-eslint/explicit-module-boundary-types": "off", // Too strict
      "@typescript-eslint/no-explicit-any": "off", // Sometimes needed
      "@typescript-eslint/no-floating-promises": "warn", // Too strict
      "@typescript-eslint/no-misused-promises": "off", // React forms need async handlers
      "@typescript-eslint/no-unsafe-assignment": "off", // Sometimes needed
      "@typescript-eslint/no-unsafe-call": "off", // Sometimes needed
      "@typescript-eslint/no-unsafe-member-access": "off", // Sometimes needed
      // =====================================================
      // TYPESCRIPT-ESLINT - TypeScript Best Practices
      // =====================================================
      "@typescript-eslint/no-unused-vars": "off", // Sometimes intentional
      "@typescript-eslint/prefer-nullish-coalescing": "warn", // Sometimes || is intentional
      "@typescript-eslint/prefer-optional-chain": "warn", // Sometimes intentional

      "@typescript-eslint/require-await": "warn", // Too strict
      // =====================================================
      // BETTER TAILWINDCSS - Tailwind CSS Best Practices
      // =====================================================
      "better-tailwindcss/enforce-consistent-class-order": "error",
      "better-tailwindcss/enforce-shorthand-classes": "warn", // Too strict
      "better-tailwindcss/no-conflicting-classes": "warn", // Too strict
      "better-tailwindcss/no-deprecated-classes": "warn",
      "better-tailwindcss/no-duplicate-classes": "warn",

      "better-tailwindcss/no-unknown-classes": [
        "warn",
        {
          ignore: [
            // Tailwind v4 animation classes
            "animate-in",
            "animate-out",
            "fade-in-",
            "fade-out-",
            "zoom-in-",
            "zoom-out-",
            "slide-in",
            "slide-out",
            // Tailwind v4 data-attribute patterns
            "data-\\[state=",
            "data-\\[side=",
            // Sonner toast component class
            "toaster",
          ],
        },
      ], // Tailwind v4 animation classes
      curly: ["error", "all"],
      // =====================================================
      // DRIZZLE ORM - Database Best Practices
      // =====================================================
      "drizzle/enforce-delete-with-where": "off", // False positives on non-DB files
      "drizzle/enforce-update-with-where": "warn", // Sometimes intentional

      eqeqeq: "warn", // Sometimes == is intentional
      "import-x/default": "warn", // Too strict
      "import-x/named": "warn", // Too strict
      "import-x/namespace": "warn", // Too strict
      "import-x/no-duplicates": "warn", // Allow duplicates
      "import-x/no-unresolved": "warn", // Let TypeScript handle this
      // =====================================================
      // IMPORT-X - Import Organization
      // =====================================================
      "import-x/order": "off", // Conflicts with perfectionist/sort-imports

      // =====================================================
      // NODE.JS - Node.js Best Practices
      // =====================================================
      "n/no-process-env": "warn", // Config files need this
      "n/no-unpublished-import": "warn", // Too strict

      "n/no-unsupported-features/es-builtins": "warn", // Too strict
      // =====================================================
      // GENERAL JavaScript - Base ESLint Rules
      // =====================================================
      "no-console": "warn", // Console.log is intentional
      "no-debugger": "error",
      "no-dupe-else-if": "error",
      "no-duplicate-case": "error",
      "no-empty": "warn",
      "no-extra-semi": "warn", // Handled by Prettier
      "no-param-reassign": "warn", // Sometimes needed

      "no-unreachable": "error",
      "no-unsafe-negation": "error",
      "no-unsafe-optional-chaining": "error",
      // Disable strict rules that cause errors
      "no-useless-assignment": "warn", // Too strict
      "no-var": "error",
      // =====================================================
      // PERFECTIONIST - Auto-sorting
      // =====================================================
      "perfectionist/sort-imports": "warn", // Too strict
      "perfectionist/sort-intersection-types": "warn", // Too strict

      "perfectionist/sort-objects": "warn", // Too strict
      "perfectionist/sort-union-types": "warn", // Too strict
      "prefer-const": "error",
      "preserve-caught-error": "warn", // Not all errors need cause
      "react-hooks/exhaustive-deps": "warn",
      "react-hooks/incompatible-library": "off", // TanStack Table can't be fixed

      "react-hooks/purity": "warn", // React compiler warnings
      "react-hooks/rules-of-hooks": "error",

      // =====================================================
      // REACT REFRESH - Hot Reloading Compatibility
      // =====================================================
      "react-refresh/only-export-components": "off", // Too strict for this project
      // =====================================================
      // REACT - React Best Practices
      // =====================================================
      "react/jsx-uses-react": "warn", // Automatic JSX transform in React 17+
      "react/prop-types": "warn", // Using TypeScript
      "react/react-in-jsx-scope": "off", // Not needed for React 17+
      "require-await": "warn", // Too strict
      "security/detect-eval-with-expression": "error",

      "security/detect-non-literal-fs-filename": "error",
      "security/detect-non-literal-regexp": "warn", // Test files use dynamic regex
      "security/detect-non-literal-require": "error",

      "security/detect-possible-timing-attacks": "warn", // Too strict
      // =====================================================
      // SECURITY - Node.js Security
      // =====================================================
      "security/detect-unsafe-regex": "error",
      "sonarjs/cognitive-complexity": "off", // Sometimes intentional
      // =====================================================
      // SONARJS - Code Quality & Bugs
      // Using recommended config from plugin
      // =====================================================
      "sonarjs/no-all-duplicated-branches": "warn", // Too strict
      "sonarjs/no-collapsible-if": "warn", // Too strict
      "sonarjs/no-duplicate-string": "off", // Sometimes intentional
      "sonarjs/no-redundant-jump": "warn", // Too strict
      "sonarjs/no-small-switch": "warn", // Sometimes intentional
      // =====================================================
      // UNICORN - Modern JavaScript/TypeScript Best Practices
      // =====================================================
      "unicorn/filename-case": [
        "error",
        {
          cases: {
            camelCase: true,
            kebabCase: true,
            pascalCase: true,
          },
          ignore: [
            "^\\.env",
            "^\\.gitignore",
            "^tsconfig",
            "^next",
            "^jest",
            "^vitest",
            "^playwright",
          ],
        },
      ],
      "unicorn/no-abusive-eslint-disable": "error",
      "unicorn/no-array-for-each": "warn", // forEach is readable
      "unicorn/no-null": "warn", // Project uses null intentionally

      "unicorn/prefer-at": "warn", // Too strict
      "unicorn/prefer-includes": "error",
      "unicorn/prefer-number-properties": "warn", // Too strict
      "unicorn/prefer-object-from-entries": "warn", // Too strict
      "unicorn/prefer-optional-catch-binding": "warn", // Too strict
      "unicorn/prefer-string-replace-all": "warn", // Too strict
      "unicorn/prefer-string-slice": "error",
      "unicorn/throw-new-error": "error",
      "zod/no-any-schema": "error",
      "zod/no-empty-custom-schema": "error",
      "zod/no-optional-and-default-together": "error",
      "zod/no-unknown-schema": "error",
      "zod/prefer-meta": "error",
      "zod/prefer-string-schema-with-trim": "warn", // Too strict
      // =====================================================
      // ZOD - Schema Validation Best Practices
      // =====================================================
      "zod/require-error-message": "error",
      "zod/require-schema-suffix": "off", // Too strict
    },
    settings: {
      "better-tailwindcss": {
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
        entryPoint: "app/globals.css",
        // Tailwind v4 animation patterns
        knownAnimations: [
          "animate-in",
          "animate-out",
          "fade-in",
          "fade-out",
          "zoom-in",
          "zoom-out",
          "slide-in",
          "slide-out",
        ],
        tags: ["myTag"],
        tailwindConfig: "",
        variables: ["className", "classNames", "classes", "style", "styles"],
      },
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
    },
  },
  prettier,

  // =====================================================
  // TEST FILES CONFIGURATION - Jest Rules
  // =====================================================
  {
    files: ["tests/unit/**/*.ts", "tests/unit/**/*.test.ts"],
    plugins: {
      jest,
    },
    rules: {
      "jest/expect-expect": "error",
      "jest/no-conditional-expect": "error",
      "jest/no-disabled-tests": "warn",
      "jest/no-focused-tests": "error",
      "jest/prefer-to-contain": "error",
      "jest/prefer-to-have-length": "error",
      "jest/valid-title": "error",
    },
  },

  // =====================================================
  // TEST FILES CONFIGURATION - Vitest Rules
  // =====================================================
  {
    files: ["tests/**/*.test.ts", "tests/**/*.spec.ts"],
    plugins: {
      vitest,
    },
    rules: {
      "vitest/consistent-test-it": "error", // Disabled - existing tests use both test and it
      "vitest/no-commented-out-tests": "error",
      "vitest/no-conditional-expect": "error",
      "vitest/no-duplicate-hooks": "error",
      "vitest/no-test-prefixes": "error",
      "vitest/valid-title": "error",
    },
  },

  // =====================================================
  // E2E TEST FILES - Playwright Rules
  // =====================================================
  {
    files: ["tests/e2e/**/*.ts", "tests/e2e/**/*.spec.ts"],
    plugins: {
      playwright,
    },
    rules: {
      "playwright/no-element-handle": "error",
      "playwright/no-force-option": "error",
      "playwright/no-wait-for-selector": "error",
      "playwright/no-wait-for-timeout": "warn", // Sometimes needed
      "playwright/require-soft-assertions": "warn", // Sometimes hard assertions are needed
      "security/detect-non-literal-regexp": "off", // Test files use dynamic URL patterns
    },
  },

  // =====================================================
  // DATABASE FILES - Drizzle ORM Rules
  // =====================================================
  {
    files: ["database/**/*.ts", "lib/dal/**/*.ts"],
    plugins: {
      drizzle,
    },
    rules: {
      "drizzle/enforce-delete-with-where": "error",
      "drizzle/enforce-update-with-where": "error",
    },
  },

  // =====================================================
  // CONFIG FILES - Allow process.env
  // =====================================================
  {
    files: [
      "next.config.*",
      "drizzle.config.*",
      "playwright.config.*",
      "next-sitemap.config.*",
      "database/db.ts",
      "lib/env.ts",
    ],
    rules: {
      "n/no-process-env": "off",
    },
  },

  // =====================================================
  // PROXY (EDGE MIDDLEWARE) - Allow process.env
  // Cannot import lib/env.ts in edge middleware context
  // =====================================================
  {
    files: ["proxy.ts"],
    rules: {
      "n/no-process-env": "off",
    },
  },

  // =====================================================
  // UNIT TEST TSX - Allow <img> in next/image mocks
  // Tests mock next/image with plain <img> elements
  // =====================================================
  {
    files: ["tests/unit/**/*.tsx"],
    rules: {
      "@next/next/no-img-element": "off",
    },
  },

  // =====================================================
  // DB SEED CLI - process.argv / process.env guards and console
  // =====================================================
  {
    files: ["scripts/seed/**/*.ts"],
    rules: {
      "n/no-process-env": "off",
      "no-console": "off",
    },
  },

  // =====================================================
  // SCRIPTS - Custom rules for code generation and validation scripts
  // =====================================================
  {
    files: ["scripts/**/*.ts"],
    rules: {
      // Nullish coalescing: Keep as warn
      "@typescript-eslint/prefer-nullish-coalescing": "warn",
      // Async: Allow - functions may be async for future use
      "@typescript-eslint/require-await": "off",
      // Console: Allow warn/error, disallow log
      "no-console": ["warn", { allow: ["warn", "error"] }],
      // Assignments: Allow - may be intentional for future use
      "no-useless-assignment": "off",
      // Prefer const: Keep as error
      "prefer-const": "error",
      // Error handling: Allow - cause may not always be available
      "preserve-caught-error": "off",
      "require-await": "off",
      // FS Security: Disabled - scripts use dynamic paths that are validated
      "security/detect-non-literal-fs-filename": "off",
      "security/detect-non-literal-regexp": "off",
      // Regex Security: Disabled - scripts validate regex patterns safely
      "security/detect-unsafe-regex": "off",
      // Code quality: Allow - collapsible if may improve readability
      "sonarjs/no-collapsible-if": "off",
      // Null: Allow - scripts may use null for compatibility
      "unicorn/no-null": "off",
    },
  },

  // =====================================================
  // TESTING LIBRARY - React Testing Library Rules
  // =====================================================
  {
    files: ["tests/**/*.tsx", "tests/**/*.ts"],
    plugins: {
      "testing-library": testingLibrary,
    },
    rules: {
      "testing-library/no-container": "warn",
      "testing-library/no-manual-cleanup": "off", // Vitest happy-dom + forks pool requires manual afterEach(cleanup)
      "testing-library/no-render-in-lifecycle": "warn",
      "testing-library/no-unnecessary-act": "warn",
    },
  },

  // =====================================================
  // UI COMPONENTS - Disable strict prop-types for library components
  // =====================================================
  {
    files: ["components/ui/calendar.tsx", "components/ui/table.tsx"],
    rules: {
      "react/prop-types": "off", // Library components with complex prop spreading
    },
  },

  // =====================================================
  // PLAID-LINK - Disable nullish coalescing for boolean logic
  // =====================================================
  {
    files: ["components/plaid-link.tsx"],
    rules: {
      "@typescript-eslint/prefer-nullish-coalescing": "off", // Boolean logic requires ||
    },
  },

  // =====================================================
  // DATA TABLE - Module augmentation requires unused generics
  // =====================================================
  {
    files: ["components/shadcn-studio/data-table/**/*.tsx"],
    rules: {
      "@typescript-eslint/no-unused-vars": "off", // Module augmentation needs unused generics
    },
  },

  // =====================================================
  // SERVER ACTIONS - Allow console for error logging
  // =====================================================
  {
    files: ["lib/actions/**/*.ts"],
    rules: {
      "@typescript-eslint/require-await": "off", // Server Actions may not always await
      "no-console": "off",
      "require-await": "off", // Server Actions may not always await
    },
  },

  // =====================================================
  // TYPE COMPATIBILITY - Allow null for types that expect null
  // =====================================================
  {
    files: [
      "components/plaid-link.tsx",
      "components/plaid-context.tsx",
      "components/ui/number-input.tsx",
      "lib/actions/plaid.actions.ts",
      "lib/auth-config.ts",
      "lib/auth-options.ts",
    ],
    rules: {
      "unicorn/no-null": "off", // Type definitions require null in some places
    },
  },

  // =====================================================
  // BASE DAL - Disable rules for generic utility functions
  // =====================================================
  {
    files: ["lib/dal/base.dal.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off", // Generic utility functions need any type
      "perfectionist/sort-intersection-types": "off", // TypeScript generics ordering
    },
  },

  // =====================================================
  // PLAYWRIGHT FIXTURES - Disable react-hooks for Playwright fixture files
  // =====================================================
  {
    files: ["tests/fixtures/**/*.ts"],
    rules: {
      "react-hooks/rules-of-hooks": "off", // Playwright fixtures use `use` method, not React hooks
    },
  },

  // =====================================================
  // PLAYWRIGHT GLOBAL SETUP - Allow process.env and console for test setup
  // =====================================================
  {
    files: ["tests/e2e/global-setup.ts"],
    rules: {
      "@typescript-eslint/require-await": "off", // Playwright global setup is async by convention
      "n/no-process-env": "off", // Playwright requires process.env for test configuration
      "no-console": "off", // Global setup uses console.log for debugging
      "require-await": "off", // Playwright global setup is async by convention
    },
  },

  // =====================================================
  // PLAYWRIGHT HELPERS - Allow process.env for test helpers
  // =====================================================
  {
    files: ["tests/e2e/helpers/**/*.ts"],
    rules: {
      "n/no-process-env": "off", // Playwright helpers require process.env for DB configuration
    },
  },

  // =====================================================
  // SHADCN BLOCKS - Third-party block components
  // These are vendor-provided UI blocks; not subject to project lint rules
  // =====================================================
  {
    files: ["components/shadcn-studio/blocks/**/*.tsx"],
    rules: {
      "@next/next/no-img-element": "off", // Blocks use <img> intentionally for demo images
      "@typescript-eslint/prefer-nullish-coalescing": "off", // Block code uses || intentionally
      "@typescript-eslint/require-await": "off", // Some block async fns may not await
      "better-tailwindcss/no-unknown-classes": "off", // Blocks may use custom/non-standard classes
      "require-await": "off", // Some block async fns may not await
      "unicorn/no-null": "off", // Block components may return null intentionally
    },
  },

  // =====================================================
  // SHADCN UI - Generated UI library components
  // These are shadcn/ui generated files; not subject to project lint rules
  // =====================================================
  {
    files: ["components/ui/**/*.tsx"],
    rules: {
      "@typescript-eslint/prefer-nullish-coalescing": "off", // UI lib uses || intentionally
      "@typescript-eslint/require-await": "off", // UI lib async fns may not await
      "better-tailwindcss/no-unknown-classes": "off", // UI lib may use data-attribute classes
      "no-param-reassign": "off", // UI lib assigns to params intentionally
      "react-hooks/purity": "off", // UI lib uses Math.random() in useMemo intentionally
      "require-await": "off", // UI lib async fns may not await
      "unicorn/no-null": "off", // UI lib uses null intentionally for refs/context
    },
  },

  // =====================================================
  // ADMIN SERVER WRAPPER - Allow async server component without await
  // =====================================================
  {
    files: ["components/admin/admin-dashboard-server-wrapper.tsx"],
    rules: {
      "@typescript-eslint/require-await": "off", // Server component wrapper may not need await yet
      "require-await": "off", // Server component wrapper may not need await yet
    },
  },

  // =====================================================
  // ADMIN LAYOUT - Allow null for NextAuth session type compatibility
  // =====================================================
  {
    files: ["app/(admin)/layout.tsx"],
    rules: {
      "unicorn/no-null": "off", // NextAuth session type requires null comparison
    },
  },

  // =====================================================
  // PLAID CONTEXT - Allow null for Plaid type compatibility
  // =====================================================
  {
    files: [
      "components/plaid-context/plaid-context.tsx",
      "components/plaid-link/plaid-link.tsx",
    ],
    rules: {
      "@typescript-eslint/prefer-nullish-coalescing": "off", // Plaid boolean logic requires ||
      "unicorn/no-null": "off", // Plaid type definitions require null
    },
  },
]);
