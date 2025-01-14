const braceStyle = ['error', '1tbs', { allowSingleLine: false }];

module.exports = {
  root: true,
  reportUnusedDisableDirectives: true,
  env: {
    node: true,
    es2022: true,
  },
  extends: [
    'plugin:vue/vue3-recommended',
    '@vue/eslint-config-typescript/recommended',
    '@vue/eslint-config-airbnb-with-typescript',
    '@vue/eslint-config-airbnb-with-typescript/allow-js-in-vue',
  ],
  plugins: ['simple-import-sort', '@typescript-eslint', 'chameleon', 'filenames'],
  rules: {
    'arrow-parens': ['error', 'as-needed', { requireForBlockBody: true }],
    'brace-style': braceStyle,
    curly: ['error', 'all'],
    'default-param-last': 'off',
    'max-len': 'off',
    'max-statements-per-line': ['error', { max: 1 }],
    'multiline-ternary': ['error', 'always-multiline'],
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-multiple-empty-lines': ['error', { max: 1 }],
    'no-param-reassign': ['error', { props: false }],
    'no-plusplus': 'off', // we don't need this rule, we DO use semicolons!
    'no-restricted-exports': 'off',
    'no-restricted-syntax': 'off',
    'no-underscore-dangle': ['error'],
    'no-use-before-define': 'off',
    'require-await': ['error'],
    'import/prefer-default-export': 'off',
    'simple-import-sort/imports': ['error', {
      groups: [
        ['^@?(?!ebury)\\w'], // vendor
        ['^@ebury\\/'], // ebury lib
        ['^[^.\\u0000]', '^\\.', '^'], // both absolute and relative imports
        ['^\\u0000'], // side effect imports
      ],
    }],
    'simple-import-sort/exports': 'error',
    'vue/attributes-order': ['error', {
      order: [
        'GLOBAL',
        'DEFINITION',
        'LIST_RENDERING',
        'UNIQUE',
        'CONDITIONALS',
        'RENDER_MODIFIERS',
        'TWO_WAY_BINDING',
        'OTHER_DIRECTIVES',
        'OTHER_ATTR',
        'CONTENT',
        'EVENTS',
      ],
    }],
    'vue/block-order': 'error',
    'vue/block-tag-newline': 'error',
    'vue/brace-style': braceStyle,
    'vue/component-name-in-template-casing': ['error', 'kebab-case'],
    'vue/custom-event-name-casing': ['error', 'kebab-case'],
    'vue/define-emits-declaration': ['error', 'type-based'],
    'vue/define-props-declaration': ['error', 'type-based'],
    'vue/no-empty-component-block': 'error',
    'vue/html-button-has-type': 'error',
    'vue/html-comment-content-spacing': ['error', 'always'],
    'vue/html-comment-indent': 'error',
    'vue/max-len': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/multiline-html-element-content-newline': 'off',
    'vue/next-tick-style': ['error', 'promise'],
    'vue/no-duplicate-attr-inheritance': 'error',
    'vue/no-multiple-objects-in-class': 'error',
    'vue/no-restricted-syntax': 'off',
    'vue/no-setup-props-destructure': 'off',
    'vue/no-static-inline-styles': 'error',
    'vue/no-useless-mustaches': 'error',
    'vue/no-useless-v-bind': 'error',
    'vue/one-component-per-file': 'off',
    'vue/padding-line-between-blocks': ['error', 'always'],
    'vue/prefer-define-options': ['error'],
    'vue/require-default-prop': 'off',
    'vue/require-macro-variable-name': 'error',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/valid-define-options': 'error',
    // TODO: enable a11y rules
    'vuejs-accessibility/anchor-has-content': 'off',
    'vuejs-accessibility/click-events-have-key-events': 'off',
    'vuejs-accessibility/form-control-has-label': 'off',
    'vuejs-accessibility/label-has-for': 'off',
    'vuejs-accessibility/mouse-events-have-key-events': 'off',
    '@typescript-eslint/brace-style': braceStyle,
    '@typescript-eslint/no-duplicate-enum-values': 'error',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-var-requires': 'off',
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        '': 'never',
        js: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'filenames/match-regex': [
      'error',
      '^[.a-z0-9-]+$',
    ],
  },
  overrides: [
    {
      files: [
        '**/src/**/*.spec.js',
      ],
      rules: {
        'vue/require-prop-types': 'off',
      },
    },
    {
      files: [
        '**/*.story.js',
      ],
      rules: {
        'import/no-extraneous-dependencies': 'off',
        'vue/require-prop-types': 'off',
      },
    },
    {
      files: [
        '**/*.vue',
      ],
      rules: {
        'import/first': 'off',
        'chameleon/vue-props-interface': 'error',
        'vue/no-restricted-component-names': ['error', '/^(?!Ec)/'],
        'vue/require-typed-ref': 'error',

        // to avoid "You have used a rule which requires parserServices to be generated." issues in vue files, we have to disable some
        // typescript rules in vue files hoping that these bugs will be resolved one day:
        // https://github.com/vuejs/vue-eslint-parser/issues/104
        // https://github.com/vuejs/create-vue/issues/123
        '@typescript-eslint/naming-convention': 'off',
        '@typescript-eslint/dot-notation': 'off',
        '@typescript-eslint/no-implied-eval': 'off',
        '@typescript-eslint/no-throw-literal': 'off',
        '@typescript-eslint/return-await': 'off',
      },
    },
    {
      files: [
        '**/*.ts',
      ],
      rules: {
        'no-shadow': 'off',
        '@typescript-eslint/no-shadow': 'error',
      },
    },
  ],
  parserOptions: {
    // there is a gigantic clash in all plugins and extended configs we use and at the end, the preferred parser chosen for everything is
    // @typescript/parser and that is wrong. we don't want JS and JSX files to be parsed by the TS.
    parser: {
      js: 'espree',
      jsx: 'espree',
    },
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
};
