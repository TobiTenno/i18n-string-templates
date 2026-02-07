import eslintPluginUnicorn from 'eslint-plugin-unicorn';

export default [
  eslintPluginUnicorn.configs.recommended,
  {
    rules: {
      'unicorn/no-array-reduce': 'off',
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/no-array-callback-reference': 'off',
      'unicorn/prefer-string-replace-all': 'off',
    }
  }
];
