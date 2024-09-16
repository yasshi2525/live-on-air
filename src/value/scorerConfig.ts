import { ValueSupplier } from './value'
import { NumberLabelConfig, NumberLabelConfigSupplier } from './numberLabelConfig'

/**
 * {@link Scorer} 生成時に利用する設定値
 */
export type ScorerConfig = NumberLabelConfig

export class ScorerConfigSupplier extends NumberLabelConfigSupplier implements ValueSupplier<ScorerConfig> {}
