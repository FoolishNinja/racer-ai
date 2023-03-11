module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['plugin:vue/vue3-essential', '@vue/airbnb', '@vue/typescript/recommended'],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'class-methods-use-this': 'off',
    'lines-between-class-members': 'off',
    'import/prefer-default-export': 'off',
    'no-param-reassign': 'off',
    'operator-linebreak': 'off',
    'comma-dangle': 'off',
    'no-plusplus': 'off',
    'implicit-arrow-linebreak': 'off',
    'function-paren-newline': 'off',
    'no-bitwise': 'off',
  },
};
