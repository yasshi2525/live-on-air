import standard from 'eslint-config-standard'
import pluginImport from 'eslint-plugin-import'
import n from 'eslint-plugin-n'
import promise from 'eslint-plugin-promise'
import tslint from 'typescript-eslint'

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
  ...tslint.configs.stylistic
]
