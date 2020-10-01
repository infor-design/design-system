module.exports = {
  env: {
    browser: true,
    es2020: true,
  },
  extends: [
    'airbnb-base',
    'plugin:json/recommended',
  ],
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module',
  },
  rules: {
    'import/no-extraneous-dependencies': ['off'],
    'no-plusplus': ['off'],
    'no-continue': ['off'],
    'no-restricted-syntax': ['off'],
    'quote-props': ['off'],
    'arrow-parens': ['off'],
    'comma-dangle': ['off'],
  },
};
