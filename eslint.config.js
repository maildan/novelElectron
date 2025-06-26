import { FlatCompat } from '@eslint/eslintrc';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals'),
  {
    rules: {
      '@next/next/no-css-tags': 'off',
      'react/no-unknown-property': 'off'
    }
  },
  {
    files: ['**/*.css'],
    rules: {
      'no-unused-vars': 'off',
      'no-undef': 'off'
    }
  },
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      '.next/**',
      'out/**'
    ]
  }
];

export default eslintConfig;
