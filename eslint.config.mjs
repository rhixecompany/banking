import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import zod from "eslint-plugin-zod";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript", "prettier"),
  {
    rules: {
      // turns a rule on with no configuration (i.e. uses the default configuration)
      "@typescript-eslint/array-type": "error",
      // turns on a rule with configuration
      // Banning confusing property uses
      "no-restricted-syntax": [
        "error",
        // Ban accessing `constructor.name`:
        {
          selector:
            "MemberExpression[object.property.name='constructor'][property.name='name']",
          message:
            "'constructor.name' is not reliable after code minifier usage.",
        },

        // Ban get and set accessors:
        {
          selector:
            'Property:matches([kind = "get"], [kind = "set"]), MethodDefinition:matches([kind = "get"], [kind = "set"])',
          message: "Don't use get and set accessors.",
        },
        // Ban `private` members:
        {
          selector:
            ':matches(PropertyDefinition, MethodDefinition)[accessibility="private"]',
          message: "Use `#private` members instead.",
        },

        // Ban `#private` members:
        {
          selector:
            ":matches(PropertyDefinition, MethodDefinition) > PrivateIdentifier.key",
          message: "Use the `private` modifier instead.",
        },

        // Ban static `this`:
        {
          selector: "MethodDefinition[static = true] ThisExpression",
          message: "Prefer using the class's name directly.",
        },
        // Ban all enums:
        {
          selector: "TSEnumDeclaration",
          message: "My reason for not using any enums at all.",
        },

        // Ban just `const` enums:
        {
          selector: "TSEnumDeclaration[const=true]",
          message: "My reason for not using const enums.",
        },

        // Ban just non-`const` enums:
        {
          selector: "TSEnumDeclaration:not([const=true])",
          message: "My reason for not using non-const enums.",
        },
        // enforce tuple members have labels
        {
          selector: "TSTupleType > :not(TSNamedTupleMember)",
          message: "All tuples should have labels.",
        },
      ],
      "zod/require-strict": 2,
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-misused-promises": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
    },
    plugins: { zod },
  },
];

export default eslintConfig;
