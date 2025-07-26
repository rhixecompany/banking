import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import zod from 'eslint-plugin-zod';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./packages/*/tsconfig.json'],
  },
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript', 'prettier'),
  {
    rules: {
      'zod/require-strict': 2,
      'no-plusplus': 0,
      'no-nested-ternary': 0,
      'no-alert': 0,
      'import/no-extraneous-dependencies': 0,
      'react/no-array-index-key': 0,
      'react/react-in-jsx-scope': 0,
      'react/no-unused-prop-types': 0,
      'react/require-default-props': 0,
      'react/prop-types': 0,
      'no-console': 1,
      'class-methods-use-this': 0,
      'no-restricted-syntax': 0,
    },
    plugins: { zod },
  },
];

export default eslintConfig;
