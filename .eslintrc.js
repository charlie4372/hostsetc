var path = require('path');

module.exports = {
  plugins: [
    '@typescript-eslint',
    'vue'
  ],
  env: {
    browser: true,
  },
  extends: [
    'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    'plugin:vue/recommended'
  ],
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: '@typescript-eslint/parser', // Specifies the ESLint parser
    // project: path.resolve(__dirname, './tsconfig.json'),
    tsconfigRootDir: __dirname,
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
  },
  rules: {
    // override/add rules settings here, such as:
    // 'vue/no-unused-vars': 'error'
  }
}
