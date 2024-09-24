import { OptionalValueSupplier, ValueSupplier } from './value'

/**
 * {@link LiveContext} 生成時に利用する設定値
 */
export interface LiveContextConfig {
  /**
   * ライブラリ利用者が自由に使えるフィールドです
   */
  vars: unknown
}

/**
 * {@link CommentContext} 生成に必要な属性値を設定します.
 */
export class LiveContextConfigSupplier implements ValueSupplier<LiveContextConfig> {
  private readonly vars: OptionalValueSupplier<unknown>

  constructor (initial: LiveContextConfig) {
    this.vars = OptionalValueSupplier.create(initial.vars)
  }

  get (): LiveContextConfig {
    return { vars: this.vars.get() }
  }

  setIf (obj: Partial<LiveContextConfig>) {
    this.vars.setIf(obj.vars)
  }

  default (): LiveContextConfig {
    return { vars: this.vars.default() }
  }

  defaultIf (obj: Partial<LiveContextConfig>) {
    this.vars.defaultIf(obj.vars)
  }
}
