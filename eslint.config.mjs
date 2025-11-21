// @ts-check
import vue from 'eslint-plugin-vue';
import vueParser from 'vue-eslint-parser';
import tsParser from '@typescript-eslint/parser';
import prettierPlugin from 'eslint-plugin-prettier';
import perfectionist from 'eslint-plugin-perfectionist';

export default [
  {
    files: ['**/*.ts', '**/*.vue', '**/*.js'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      'vue/html-self-closing': 'off',
      'vue/require-default-prop': 'off',
      'vue/no-multiple-template-root': 'off',
      'vue/multi-word-component-names': 'off',
      '@typescript-eslint/no-explicit-any': 'off',

      // Environmental Rules
      'no-console': process.env.NODE_ENV?.toLowerCase().startsWith('prod') ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV?.toLowerCase().startsWith('prod') ? 'warn' : 'off',
    },
  },
  { plugins: { prettier: prettierPlugin }, rules: { 'prettier/prettier': ['warn', { endOfLine: 'auto' }] } },
  {
    plugins: {
      perfectionist,
    },
    rules: {
      'perfectionist/sort-imports': [
        'warn',
        {
          type: 'line-length',
          order: 'asc',
        },
      ],
    },
  },
];
