import js from '@eslint/js';
import globals from 'globals';
import { globalIgnores } from 'eslint/config';

export default [
  globalIgnores(['node_modules']),
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: globals.node,
    },
    rules: {
      'no-unused-vars': 'error',
    },
  },
];
