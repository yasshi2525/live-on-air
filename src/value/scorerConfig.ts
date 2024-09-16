import { ValueSupplier } from './value'
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
}

export class ScorerConfigSupplier extends NumberLabelConfigSupplier implements ValueSupplier<ScorerConfig> {}
