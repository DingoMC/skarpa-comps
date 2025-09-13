import { FlatCompat } from '@eslint/eslintrc';
import stylistic from '@stylistic/eslint-plugin';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.config({
    extends: ['next'],
    rules: {
      'prettier/prettier': 'off',
      'react/jsx-filename-extension': 'off',
      'react/function-component-definition': 'off',
      'linebreak-style': 'off',
      'import/extensions': [
        'error',
        'ignorePackages',
        {
          js: 'never',
          jsx: 'never',
          ts: 'never',
          tsx: 'never',
          json: 'always',
        },
      ],
      'max-len': ['error', { code: 140, ignoreComments: true, ignoreTrailingComments: true }],
      'arrow-parens': 'off',
      camelcase: 'off',
      'comma-dangle': [
        'error',
        {
          arrays: 'always-multiline',
          objects: 'always-multiline',
          imports: 'always-multiline',
          exports: 'always-multiline',
          functions: 'only-multiline',
        },
      ],
      'no-multiple-empty-lines': ['error', { max: 2, maxEOF: 0, maxBOF: 0 }],
    },
  }),
  {
    plugins: {
      '@stylistic': stylistic,
    },
    rules: {
      '@stylistic/indent': ['error', 2],
      '@stylistic/array-bracket-newline': ['error', 'consistent'],
      '@stylistic/arrow-parens': ['error', 'always'],
      '@stylistic/arrow-spacing': 'error',
      '@stylistic/block-spacing': 'error',
      '@stylistic/brace-style': 'error',
      '@stylistic/object-curly-spacing': ['error', 'always', { arraysInObjects: false }],
      '@stylistic/no-extra-semi': 'error',
      '@stylistic/no-mixed-operators': 'error',
      '@stylistic/no-multi-spaces': 'error',
      '@stylistic/no-trailing-spaces': 'error',
      '@stylistic/no-whitespace-before-property': 'error',
    },
  },
];

export default eslintConfig;
