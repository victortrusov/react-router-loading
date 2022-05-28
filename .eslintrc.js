module.exports = {
  'env': {
      'browser': true,
      'es2021': true
  },
  'extends': [
      'eslint:recommended',
      'plugin:react/recommended',
      'plugin:@typescript-eslint/recommended'
  ],
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
      'ecmaFeatures': {
          'jsx': true
      },
      'ecmaVersion': 'latest',
      'sourceType': 'module'
  },
  'plugins': [
      'react',
      '@typescript-eslint'
  ],
  'rules': {
    'no-var': 'error',
    'no-undef': 'off',
    'no-empty': 'off',
    'no-console': 'warn',
    'no-debugger': 'warn',
    'prefer-const': 'warn',
    'camelcase': 'warn',
      'indent': [
          'warn',
          2,
          {
            'SwitchCase': 1
          }
      ],
      'linebreak-style': [
          'warn',
          'unix'
      ],
    'quotes': [
        'warn',
        'single',
        {
          'avoidEscape': true
        }
    ],
    'semi': [
        'warn',
        'always'
    ],
    'comma-dangle': [
      'warn',
      'only-multiline'
    ],
    'key-spacing': 'warn',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/member-delimiter-style': 'warn',
    '@typescript-eslint/type-annotation-spacing': 'warn',
    '@typescript-eslint/comma-spacing': 'warn',
    '@typescript-eslint/func-call-spacing': 'warn',
    '@typescript-eslint/keyword-spacing': 'warn',
    '@typescript-eslint/object-curly-spacing': [
      'warn',
      'always'
    ],
    '@typescript-eslint/space-before-function-paren': ['warn', {
      'anonymous': 'never',
      'named': 'never',
      'asyncArrow': 'always'
    }],
  }
};
