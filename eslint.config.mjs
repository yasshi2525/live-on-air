import standard from 'eslint-config-standard'
import pluginImport from 'eslint-plugin-import'
import n from 'eslint-plugin-n'
import promise from 'eslint-plugin-promise'
import tslint from 'typescript-eslint'
import stylistic from '@stylistic/eslint-plugin'

standard.plugins = {
  import: pluginImport,
  n,
  promise
}
delete standard.parserOptions
delete standard.env
delete standard.globals

export default [
  standard,
  ...tslint.configs.recommended,
  ...tslint.configs.stylistic, {
    plugins: {
      '@stylistic': stylistic
    },
    rules: {
      '@stylistic/space-before-function-paren': 'error'
    }
  },
  {
    ignores: ['lib', 'tmp', 'sample']
  }
]
