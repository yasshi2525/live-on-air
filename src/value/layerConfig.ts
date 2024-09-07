import { RecordSupplier, ValueSupplier } from './value'

/**
 * {@link Layer} のレイアウトのためのレイヤ名一覧
 */
export const layerTypes = ['field', 'screen'] as const

/**
 * {@link Layer} のレイアウトのためのレイヤ名一覧
 */
export type LayerType = typeof layerTypes[number]

/**
 * g.Scene 上に配置するエンティティ ({@link Layer}) のレイアウト情報
 */
export interface LayerConfig {
  /**
   * {@link Spot}, {@link Broadcaster} が配置されるマップの大きさ.
   */
  field: g.CommonArea
  /**
   * {@link Live} が配置されるマップの大きさ
   */
  screen: g.CommonArea
}

export class LayerConfigSupplier implements ValueSupplier<LayerConfig> {
  private layouts: RecordSupplier<LayerType, g.CommonArea>

  constructor (initial: LayerConfig) {
    this.layouts = RecordSupplier.create({
      field: initial.field,
      screen: initial.screen
    })
  }

  get (): LayerConfig {
    return {
      ...this.layouts.get()
    }
  }

  setIf (obj: Partial<LayerConfig>) {
    this.layouts.setIf(obj)
  }

  default (): LayerConfig {
    return {
      ...this.layouts.default()
    }
  }

  defaultIf (obj: Partial<LayerConfig>) {
    this.layouts.defaultIf(obj)
  }
}
