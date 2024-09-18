import { OptionalValueSupplier, ValueSupplier } from './value'

/**
 * {@link Field} 生成時に利用する設定値
 */
export interface FieldConfig {
  /**
   * ライブラリ利用者が自由に使えるフィールドです
   */
  vars: unknown
}

export class FieldConfigSupplier implements ValueSupplier<FieldConfig> {
  private readonly vars: OptionalValueSupplier<unknown>

  constructor (initial: FieldConfig) {
    this.vars = OptionalValueSupplier.create(initial.vars)
  }

  get (): FieldConfig {
    return { vars: this.vars.get() }
  }

  setIf (obj: Partial<FieldConfig>) {
    this.vars.setIf(obj.vars)
  }

  default (): FieldConfig {
    return { vars: this.vars.default() }
  }

  defaultIf (obj: Partial<FieldConfig>) {
    this.vars.defaultIf(obj.vars)
  }
}
