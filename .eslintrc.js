module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      node: {
        paths: ['src'],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  env: {
    browser: true,
    amd: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:jsx-a11y/recommended',
    'react-app',
    'prettier', // Make sure this is always the last element in the array.
  ],
  plugins: ['react', 'react-hooks', 'simple-import-sort', 'prettier'],
  rules: {
    'prettier/prettier': [
      'error',
      {},
      { usePrettierrc: true, endOfLine: 'auto' },
    ],
    'react/react-in-jsx-scope': 'off',
    'jsx-a11y/accessible-emoji': 'off',
    'react/prop-types': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    'no-undef': 'error',
    'no-restricted-syntax': [
      'warn',
      {
        selector:
          "CallExpression[callee.object.name='console'][callee.property.name!=/^(warn|error|info|trace)$/]",
        message: 'Unexpected property on console object was called',
      },
    ],
  },
};
