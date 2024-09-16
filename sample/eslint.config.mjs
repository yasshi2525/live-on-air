// @ts-check
import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import standard from 'eslint-config-standard'
import pluginImport from 'eslint-plugin-import'
import n from 'eslint-plugin-n'
import promise from 'eslint-plugin-promise'
import stylistic from '@stylistic/eslint-plugin'
import globals from 'globals'

delete standard.parserOptions
delete standard.env
delete standard.globals

standard.plugins = {
  import: pluginImport,
  n,
  promise
}

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended, {
    languageOptions: {
      globals: {
        ...globals.node,
        g: 'readonly'
      }
    },
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'error'
    }
  },
  {
    ...standard,
    ignores: ['src/**/*.ts']
  }, {
    ...standard,
    plugins: {
      ...standard.plugins,
      '@stylistic': stylistic
    },
    rules: {
      ...standard.rules,
      semi: 'error',
      '@stylistic/space-before-function-paren': 'error'
    },
    files: ['src/**/*.ts']
  }, {
    ignores: ['script', '_bootstrap.ts']
  }
)
