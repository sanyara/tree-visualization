import pluginJs from '@eslint/js';
import globals from 'globals';

export default [
  {
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      semi: 'off',
      quotes: ['error', 'single'],
    },
  },
  pluginJs.configs.recommended,
];
