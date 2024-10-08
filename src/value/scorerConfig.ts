import { OptionalValueSupplier, PrimitiveValueSupplier, ValueSupplier } from './value'
import { NumberLabelConfig, NumberLabelConfigSupplier } from './numberLabelConfig'

/**
 * {@link Scorer} 生成時に利用する設定値
 */
export interface ScorerConfig extends NumberLabelConfig {
  /**
   * 作成する Scorer に設定する描画に使用するフォント
   */
  font: g.Font
  /**
   * 作成する Scorer に設定する表示桁数
   */
  digit: number
  /**
   * 作成する Scorer に設定する前置テキスト
   */
  prefix: string
  /**
   * 作成する Scorer に設定する後置テキスト
   */
  suffix: string
  /**
   * 作成する Scorer に設定する、得点をサーバーに送信するかどうか
   */
  refrainsSendingScore: boolean
  /**
   * ライブラリ利用者が自由に使えるフィールドです
   */
  vars: unknown
}

export class ScorerConfigSupplier extends NumberLabelConfigSupplier implements ValueSupplier<ScorerConfig> {
  private readonly refrainsSendingScore: PrimitiveValueSupplier<boolean>
  private readonly vars: OptionalValueSupplier<unknown>

  constructor (initial: ScorerConfig) {
    super(initial)
    this.refrainsSendingScore = PrimitiveValueSupplier.create(initial.refrainsSendingScore)
    this.vars = OptionalValueSupplier.create(initial.vars)
  }

  override setIf (obj: Partial<ScorerConfig>) {
    super.setIf(obj)
    this.refrainsSendingScore.setIf(obj.refrainsSendingScore)
    this.vars.setIf(obj.vars)
  }

  override get (): ScorerConfig {
    return {
      ...super.get(),
      refrainsSendingScore: this.refrainsSendingScore.get(),
      vars: this.vars.get()
    }
  }

  override defaultIf (obj: Partial<ScorerConfig>) {
    super.defaultIf(obj)
    this.refrainsSendingScore.defaultIf(obj.refrainsSendingScore)
    this.vars.defaultIf(obj.vars)
  }

  override default (): ScorerConfig {
    return {
      ...super.default(),
      refrainsSendingScore: this.refrainsSendingScore.default(),
      vars: this.vars.default()
    }
  }
}
