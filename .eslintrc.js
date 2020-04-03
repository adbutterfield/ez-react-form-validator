module.exports = {
  parserOptions: {
    project: ['./tsconfig.json', './tsconfig.jest.json'],
    tsconfigRootDir: __dirname,
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      // use <root>/tsconfig.json
      typescript: {
        alwaysTryTypes: true, // always try to resolve types under `<roo/>@types` directory even it doesn't contain any source code, like `@types/unist`
      },
    },
  },
  extends: ['airbnb-typescript', 'react-app'],
  rules: {
    'arrow-body-style': 'off',
    'react-hooks/exhaustive-deps': 'off',
    'react/prop-types': 0,
    'max-len': ['off'],
    'spaced-comment': 0,
    'react/jsx-boolean-value': 0,
    'object-curly-newline': 0,
    'react/jsx-one-expression-per-line': 0,
    'no-irregular-whitespace': 0,
    'arrow-parens': [
      'error',
      'always',
    ],
    'no-plusplus': [
      'warn',
      {
        allowForLoopAfterthoughts: true,
      },
    ],
    'no-param-reassign': ['error', { props: false }],
  },
};
