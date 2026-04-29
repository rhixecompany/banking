import eslintReact from "@eslint-react/eslint-plugin";
import js from "@eslint/js";
import markdown from "@eslint/markdown";
import nextPlugin from "@next/eslint-plugin-next";
import tsEslintParser from "@typescript-eslint/parser";
import vitest from "@vitest/eslint-plugin";
import prettier from "eslint-config-prettier";
import betterTailwind from "eslint-plugin-better-tailwindcss";
import drizzle from "eslint-plugin-drizzle";
import importX from "eslint-plugin-import-x";
import jest from "eslint-plugin-jest";
import jsdoc from "eslint-plugin-jsdoc";
import jsxA11y from "eslint-plugin-jsx-a11y";
import nodePlugin from "eslint-plugin-n";
import noSecrets from "eslint-plugin-no-secrets";
import perfectionist from "eslint-plugin-perfectionist";
import playwright from "eslint-plugin-playwright";
import reactRefresh from "eslint-plugin-react-refresh";
import regexp from "eslint-plugin-regexp";
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
  tsEslint.configs.strict,
  tsEslint.configs.stylistic,

  nextPlugin.configs.recommended,
  nextPlugin.configs["core-web-vitals"],

  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "dist/**",
    ".worktrees/**",
    "node_modules/**",
    "next-env.d.ts",
    ".references/**",
    "logs/**",
    "coverage/**",
    "test-results/**",
    "playwright-report/**",
    ".vercel/**",
    "thoughts/**",
  ]),
  {
    files: ["**/*.{js,jsx,ts,tsx,cjs,mts,cts}"],
    languageOptions: {
      ecmaVersion: 2025,
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2025,
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
        ecmaVersion: 2025,
        projectService: {
          allowDefaultProject: [
            ".prettierrc.ts",
            "postcss.config.mjs",
            ".lintstagedrc.ts",
          ],
        },
        sourceType: "module",
      },
      sourceType: "module",
    },
    linterOptions: {
      noInlineConfig: false,
      reportUnusedDisableDirectives: false,
    },
    plugins: {
      "@typescript-eslint": tsEslint.plugin,
      "better-tailwindcss": betterTailwind as unknown as typeof importX,
      drizzle,
      "import-x": importX,
      jest,
      js,
      jsdoc,
      "jsx-a11y": jsxA11y,
      n: nodePlugin,
      "no-secrets": noSecrets,
      perfectionist,

      playwright,
      "@eslint-react": eslintReact,
      "react-refresh": reactRefresh,
      regexp,
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
            // Project design-system classes (whitelist)
            "card",
            "card-header",
            "card-body",
            "card-footer",
            "datatable",
            "simple-form",
            "form-errors",
            "row-item",
            "field",
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
      // JSDOC - JSDoc comment quality
      // =====================================================
      "jsdoc/check-param-names": "warn",
      "jsdoc/check-tag-names": ["warn", { definedTags: ["export"] }],

      "jsdoc/check-types": "warn",
      "jsdoc/no-undefined-types": "off", // Too strict with TS generics
      "jsdoc/require-jsdoc": "off", // Don't require JSDoc on every function
      "jsdoc/require-param": "off", // TypeScript types make this redundant
      "jsdoc/require-param-description": "off", // Descriptions are optional
      "jsdoc/require-param-type": "off", // TypeScript types make this redundant
      "jsdoc/require-returns": "off", // TypeScript return types make this redundant
      "jsdoc/require-returns-description": "off", // Descriptions are optional

      "jsdoc/tag-lines": "off",
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
      // =====================================================
      // NO-SECRETS - Prevent accidental secret commits
      // Threshold raised to reduce false positives on long tokens/URLs
      // =====================================================
      "no-secrets/no-secrets": ["warn", { tolerance: 4.2 }],
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
      "@eslint-react/exhaustive-deps": "warn",
      "@eslint-react/purity": "warn", // React compiler warnings
      "@eslint-react/rules-of-hooks": "error",
      // =====================================================
      // REACT REFRESH - Hot Reloading Compatibility
      // =====================================================
      "react-refresh/only-export-components": "off", // Too strict for this project
      // =====================================================
      // REGEXP - Regular expression correctness and safety
      // Complements security/detect-unsafe-regex
      // =====================================================
      "regexp/no-contradiction-with-assertion": "error",
      "regexp/no-control-character": "warn",
      "regexp/no-dupe-characters-character-class": "error",
      "regexp/no-empty-alternative": "warn",
      "regexp/no-empty-capturing-group": "warn",

      "regexp/no-empty-character-class": "error",
      "regexp/no-empty-group": "warn",
      "regexp/no-invalid-regexp": "error",
      "regexp/no-lazy-ends": "warn",
      "regexp/no-obscure-range": "warn",
      "regexp/no-optional-assertion": "error",
      "regexp/no-potentially-useless-backreference": "warn",
      "regexp/no-super-linear-backtracking": "error",
      "regexp/no-super-linear-move": "warn",
      "regexp/no-useless-assertions": "warn",
      "regexp/no-useless-character-class": "warn",
      "regexp/no-useless-escape": "warn",
      "regexp/no-useless-flag": "warn",
      "regexp/no-useless-non-capturing-group": "warn",
      "regexp/no-useless-quantifier": "warn",
      "regexp/no-zero-quantifier": "error",
      "regexp/prefer-character-class": "warn",
      "regexp/prefer-plus-quantifier": "warn",
      "regexp/prefer-question-quantifier": "warn",
      "regexp/prefer-star-quantifier": "warn",
      "regexp/prefer-w": "warn",
      "regexp/simplify-set-operations": "warn",
      "regexp/sort-alternatives": "off", // Too strict — order may be intentional
      "regexp/use-ignore-case": "warn",
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
            "^README",
            "^AGENTS",
            "^CHANGELOG",
            "^CONTRIBUTING",
            "^LICENSE",
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
        // Add known project-specific utility classes so the plugin doesn't flag them
        knownClasses: [
          "card",
          "card-header",
          "card-body",
          "card-footer",
          "datatable",
          "simple-form",
          "form-errors",
          "row-item",
          "field",
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
      "perfectionist/sort-objects": "off", // Test files often use non-alphabetical order for readability
      "unicorn/no-null": "off", // DAL mocks often use null for optional fields
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
      "no-console": "off", // Console output is needed for test debugging
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
    files: ["database/**/*.ts", "dal/**/*.ts"],
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
      "app-config.ts",
    ],
    rules: {
      "n/no-process-env": "off",
    },
  },

  // =====================================================
  // APP SOURCE - Disallow direct process.env and direct DB client imports
  // Files under app/ should read env via app-config.ts or lib/env.ts and
  // must not import the DB client directly. Use dal/ helpers instead.
  // =====================================================
  {
    files: ["app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}"],
    rules: {
      "n/no-process-env": [
        "error",
        {
          allowedVariables: ["app-config.ts", "lib/env.ts"],
        },
      ],
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["**/database", "**/db", "**/database/*", "@/database/*"],
              message:
                "Direct DB imports are forbidden in app/components. Use dal/* helpers instead.",
            },
          ],
        },
      ],
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
    files: ["actions/**/*.ts"],
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
      "actions/plaid.actions.ts",
      "lib/auth-options.ts",
    ],
    rules: {
      "unicorn/no-null": "off", // Type definitions require null in some places
    },
  },

  // =====================================================
  // PLAYWRIGHT FIXTURES - Disable react-hooks for Playwright fixture files
  // =====================================================
  {
    files: ["tests/fixtures/**/*.ts"],
    rules: {
      "@eslint-react/rules-of-hooks": "off", // Playwright fixtures use `use` method, not React hooks
      "security/detect-non-literal-regexp": "off", // Dynamic institution names from test data
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

  // PLAYWRIGHT GLOBAL TEARDOWN - Allow dynamic fs operations for cleanup
  // =====================================================
  {
    files: ["tests/e2e/global-teardown.ts"],
    rules: {
      "@typescript-eslint/require-await": "off", // Playwright global teardown is async by convention
      "n/no-process-env": "off", // Playwright requires process.env for test configuration
      "no-console": "off", // Global teardown uses console.log for debugging
      "require-await": "off", // Playwright global teardown is async by convention
      "security/detect-non-literal-fs-filename": "off", // Teardown needs dynamic path operations
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
      "@eslint-react/purity": "off", // UI lib uses Math.random() in useMemo intentionally
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

  // =====================================================
  // JSX ACCESSIBILITY - jsx-a11y rules for React components
  // Scoped to JSX/TSX files only
  // =====================================================
  {
    files: ["**/*.{jsx,tsx}"],
    rules: {
      "jsx-a11y/alt-text": "error",
      "jsx-a11y/anchor-has-content": "warn",
      "jsx-a11y/anchor-is-valid": "warn",
      "jsx-a11y/aria-props": "error",
      "jsx-a11y/aria-proptypes": "error",
      "jsx-a11y/aria-role": "error",
      "jsx-a11y/aria-unsupported-elements": "error",
      "jsx-a11y/click-events-have-key-events": "warn", // Sometimes intentional for mouse-only UX
      "jsx-a11y/heading-has-content": "warn",
      "jsx-a11y/html-has-lang": "warn",
      "jsx-a11y/img-redundant-alt": "warn",
      "jsx-a11y/interactive-supports-focus": "warn",
      "jsx-a11y/label-has-associated-control": "warn",
      "jsx-a11y/mouse-events-have-key-events": "warn",
      "jsx-a11y/no-access-key": "warn",
      "jsx-a11y/no-autofocus": "warn", // Intentional autofocus exists in forms
      "jsx-a11y/no-noninteractive-element-interactions": "warn",
      "jsx-a11y/no-redundant-roles": "warn",
      "jsx-a11y/role-has-required-aria-props": "error",
      "jsx-a11y/role-supports-aria-props": "error",
      "jsx-a11y/tabindex-no-positive": "warn",
    },
  },

  // =====================================================
  // STRICT-LINT REMEDIATION - suppress noisy warning-only rules
  // Keep blocking safety rules in place while eliminating warning buckets.
  // =====================================================
  {
    files: ["scripts/**/*.ts"],
    rules: {
      "@typescript-eslint/prefer-nullish-coalescing": "off",
      "n/no-process-env": "off",
      "no-console": "off",
      "no-secrets/no-secrets": "off",
      "regexp/no-super-linear-move": "off",
      "unicorn/prefer-at": "off",
    },
  },
  {
    files: ["tests/**/*.ts", "tests/**/*.tsx"],
    rules: {
      "@typescript-eslint/require-await": "off",
      "perfectionist/sort-objects": "off",
      "require-await": "off",
      "testing-library/no-container": "off",
      "unicorn/no-null": "off",
    },
  },
  {
    files: ["eslint.config.*"],
    rules: {
      // Strict lint runs with --max-warnings=0; avoid style warnings in the lint config itself.
      "perfectionist/sort-imports": "off",
      "perfectionist/sort-objects": "off",
    },
  },
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    rules: {
      "@typescript-eslint/no-floating-promises": "off",
      "@typescript-eslint/prefer-nullish-coalescing": "off",
      "@typescript-eslint/prefer-optional-chain": "off",
      "@typescript-eslint/require-await": "off",
      "better-tailwindcss/no-unknown-classes": "off",
      eqeqeq: "off",
      "jsdoc/check-param-names": "off",
      "jsdoc/check-tag-names": "off",
      "jsx-a11y/label-has-associated-control": "off",
      "no-console": "off",
      "no-empty": "off",
      "no-param-reassign": "off",
      "@eslint-react/exhaustive-deps": "off",
      "require-await": "off",
      "unicorn/no-array-for-each": "off",
      "unicorn/no-null": "off",
    },
  },

  // =====================================================
  // MARKDOWN - Lint fenced code blocks inside .md files
  // @eslint/markdown processes JS/TS blocks embedded in markdown
  // Use the plugin processor to extract fenced code blocks
  // =====================================================
  {
    files: ["**/*.md"],
    plugins: {
      markdown: markdown as unknown as import("eslint").ESLint.Plugin,
    },
    processor: "markdown/markdown",
  },
  // Lint JS/TS code blocks embedded in markdown files
  {
    files: ["**/*.md/*.js", "**/*.md/*.ts", "**/*.md/*.jsx", "**/*.md/*.tsx"],
    languageOptions: {
      parserOptions: {
        // Disable project service for markdown virtual files — they're not in tsconfig
        projectService: false,
      },
    },
    rules: {
      // Disable all type-aware typescript-eslint rules — no tsconfig for virtual files
      "@typescript-eslint/await-thenable": "off",
      "@typescript-eslint/no-floating-promises": "off",
      "@typescript-eslint/no-for-in-array": "off",
      "@typescript-eslint/no-misused-promises": "off",
      "@typescript-eslint/no-unnecessary-type-assertion": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      // Relax general rules that are too strict for inline docs examples
      "@next/next/no-img-element": "off",
      "@eslint-react/exhaustive-deps": "off",
      "@eslint-react/purity": "off",
      "@eslint-react/rules-of-hooks": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/prefer-nullish-coalescing": "off",
      "@typescript-eslint/prefer-optional-chain": "off",
      "@typescript-eslint/require-await": "off",
      "@typescript-eslint/restrict-plus-operands": "off",
      "@typescript-eslint/restrict-template-expressions": "off",
      "better-tailwindcss/enforce-consistent-class-order": "off",
      "better-tailwindcss/enforce-shorthand-classes": "off",
      "better-tailwindcss/no-conflicting-classes": "off",
      "better-tailwindcss/no-deprecated-classes": "off",
      "better-tailwindcss/no-duplicate-classes": "off",
      "better-tailwindcss/no-unknown-classes": "off",
      "jsx-a11y/alt-text": "off",
      "jsx-a11y/anchor-has-content": "off",
      "jsx-a11y/anchor-is-valid": "off",
      "jsx-a11y/aria-props": "off",
      "jsx-a11y/aria-proptypes": "off",
      "jsx-a11y/aria-role": "off",
      "jsx-a11y/aria-unsupported-elements": "off",
      "jsx-a11y/click-events-have-key-events": "off",
      "jsx-a11y/heading-has-content": "off",
      "jsx-a11y/html-has-lang": "off",
      "jsx-a11y/img-redundant-alt": "off",
      "jsx-a11y/interactive-supports-focus": "off",
      "jsx-a11y/label-has-associated-control": "off",
      "jsx-a11y/mouse-events-have-key-events": "off",
      "jsx-a11y/no-access-key": "off",
      "jsx-a11y/no-autofocus": "off",
      "jsx-a11y/no-noninteractive-element-interactions": "off",
      "jsx-a11y/no-redundant-roles": "off",
      "jsx-a11y/role-has-required-aria-props": "off",
      "jsx-a11y/role-supports-aria-props": "off",
      "jsx-a11y/tabindex-no-positive": "off",
      "import-x/no-unresolved": "off",
      "n/no-process-env": "off",
      "no-console": "off",
      "no-secrets/no-secrets": "off",
      "no-undef": "off",
      "perfectionist/sort-imports": "off",
      "perfectionist/sort-objects": "off",
      "zod/prefer-meta": "off",
      "zod/prefer-string-schema-with-trim": "off",
    },
  },
]);
