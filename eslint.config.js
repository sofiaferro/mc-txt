import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

export default [
  { ignores: ['dist'] },
  js.configs.recommended,
  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],
  reactHooks.configs.flat['recommended-latest'],
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      globals: { ...globals.browser },
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      'react/prop-types': 'off',
    },
  },
];
