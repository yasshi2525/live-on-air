import { FieldConfig, FieldConfigSupplier } from '../value/fieldConfig'
import { Field, FieldImpl } from '../model/field'

/**
 * {@link Field} を新規作成する際の各種設定を保持します.
 */
export interface FieldConfigure {
  /**
   * 作成する Field のライブラリ利用者が自由に使えるフィールドを取得します.
   */
  vars (): unknown

  /**
   * 作成する Field のライブラリ利用者が自由に使えるフィールドを設定します.
   *
   * @param vars ライブラリ利用者が自由に使えるフィールド
   */
  vars (vars: unknown): FieldConfigure
}

export class FieldConfigureImpl implements FieldConfigure {
  private readonly getter: () => FieldConfig
  private readonly setter: (obj: Partial<FieldConfig>) => void

  constructor (isDefault: boolean, private readonly config: FieldConfigSupplier) {
    this.getter = () => isDefault ? config.default() : config.get()
    this.setter = obj => isDefault ? config.defaultIf(obj) : config.setIf(obj)
  }

  vars (): unknown

  vars (vars: unknown): FieldConfigure

  vars (args?: unknown): unknown | FieldConfigure {
    if (arguments.length > 0) {
      this.setter({ vars: args })
      return this
    }
    return this.getter().vars
  }

  /**
   * Field を作成します.
   */
  build (): Field {
    const config = this.config.get()
    return new FieldImpl({ vars: config.vars })
  }
}
