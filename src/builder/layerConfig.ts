/**
 * {@link Layer} のレイアウトのためのレイヤ名一覧
 */
export const layerTypes = ['field'] as const

/**
 * {@link Layer} のレイアウトのためのレイヤ名一覧
 */
export type LayerType = typeof layerTypes[number]

/**
 * g.Scene 上に配置するエンティティ ({@link Layer}) のレイアウト情報
 */
export interface LayerConfig {
  /**
   * {@link Spot}, {@link Player} が配置されるマップの大きさ.
   */
  field: g.CommonArea
}
