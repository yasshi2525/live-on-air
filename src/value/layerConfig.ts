import { OptionalValueSupplier, RecordSupplier, ValueSupplier } from './value'

/**
 * {@link Layer} のレイアウトのためのレイヤ名一覧
 */
export const layerTypes = ['field', 'screen', 'comment', 'header'] as const

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
  /**
   * {@link CommentDeployer} がコメントを配置する領域の大きさ
   */
  comment: g.CommonArea
  /**
   * {@link Scorer} が得点、 {@link Ticker} が残り時間を配置する領域の大きさ
   */
  header: g.CommonArea
  /**
   * ライブラリ利用者が自由に使えるフィールドです
   */
  vars: unknown
}

export class LayerConfigSupplier implements ValueSupplier<LayerConfig> {
  private layouts: RecordSupplier<LayerType, g.CommonArea>
  private readonly vars: OptionalValueSupplier<unknown>

  constructor (initial: LayerConfig) {
    this.layouts = RecordSupplier.create({
      field: initial.field,
      screen: initial.screen,
      comment: initial.comment,
      header: initial.header
    })
    this.vars = OptionalValueSupplier.create(initial.vars)
  }

  get (): LayerConfig {
    return {
      ...this.layouts.get(),
      vars: this.vars.get()
    }
  }

  setIf (obj: Partial<LayerConfig>) {
    this.layouts.setIf(obj)
    this.vars.setIf(obj.vars)
  }

  default (): LayerConfig {
    return {
      ...this.layouts.default(),
      vars: this.vars.default()
    }
  }

  defaultIf (obj: Partial<LayerConfig>) {
    this.layouts.defaultIf(obj)
    this.vars.defaultIf(obj.vars)
  }
}
