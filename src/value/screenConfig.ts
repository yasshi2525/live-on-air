import { OptionalValueSupplier, ValueSupplier } from './value'

/**
 * {@link Screen} 生成時に利用する設定値
 */
export interface ScreenConfig {
  /**
   * ライブラリ利用者が自由に使えるフィールドです
   */
  vars: unknown
}

export class ScreenConfigSupplier implements ValueSupplier<ScreenConfig> {
  private readonly vars: OptionalValueSupplier<unknown>

  constructor (initial: ScreenConfig) {
    this.vars = OptionalValueSupplier.create(initial.vars)
  }

  get (): ScreenConfig {
    return { vars: this.vars.get() }
  }

  setIf (obj: Partial<ScreenConfig>) {
    this.vars.setIf(obj.vars)
  }

  default (): ScreenConfig {
    return { vars: this.vars.default() }
  }

  defaultIf (obj: Partial<ScreenConfig>) {
    this.vars.defaultIf(obj.vars)
  }
}
