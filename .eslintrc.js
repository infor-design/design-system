module.exports = {
  env: {
    browser: true,
    es6: true
  },
  extends: [
    'airbnb-base',
    'plugin:json/recommended'
  ],
  globals: {
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  rules: {
    semi: ['error'],
    indent: ['error', 2],
    'jsdoc/newline-after-description': 0,
    'comma-dangle': ['error', 'never'],
    'import/no-extraneous-dependencies': ["error", { devDependencies: true, }],
    'wc/no-self-class': 0,
    'no-plusplus': [2, { allowForLoopAfterthoughts: true }]
  }
}
