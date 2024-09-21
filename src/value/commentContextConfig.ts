import { OptionalValueSupplier, ValueSupplier } from './value'

/**
 * {@link CommentContext} 生成時に利用する設定値
 */
export interface CommentContextConfig {
  /**
   * ライブラリ利用者が自由に使えるフィールドです
   */
  vars: unknown
}

/**
 * {@link CommentContext} 生成に必要な属性値を設定します.
 */
export class CommentContextConfigSupplier implements ValueSupplier<CommentContextConfig> {
  private readonly vars: OptionalValueSupplier<unknown>

  constructor (initial: CommentContextConfig) {
    this.vars = OptionalValueSupplier.create(initial.vars)
  }

  get (): CommentContextConfig {
    return { vars: this.vars.get() }
  }

  setIf (obj: Partial<CommentContextConfig>) {
    this.vars.setIf(obj.vars)
  }

  default (): CommentContextConfig {
    return { vars: this.vars.default() }
  }

  defaultIf (obj: Partial<CommentContextConfig>) {
    this.vars.defaultIf(obj.vars)
  }
}
