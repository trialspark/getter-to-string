module.exports = {
  env: {
    browser: false,
    es6: true,
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'airbnb-base',
    'prettier',
    'prettier/@typescript-eslint',
    'plugin:jest/recommended',
  ],
  globals: {},
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'jest'],
  rules: {},
  overrides: [
    {
      files: ['*.spec.ts'],
      env: {
        'jest/globals': true,
      },
    },
  ],
};
