module.exports = {
  parserOptions: {
    ecmaVersion: 2015,
    sourceType: 'module',
  },
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
    'arrow-parens': ['error', 'always'],
    'no-plusplus': [
      'warn',
      {
        allowForLoopAfterthoughts: true,
      },
    ],
    'no-param-reassign': ['error', { props: false }],
  },
};
