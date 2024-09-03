/**
 * レイアウトのためのレイヤ名一覧
 */
export const layerTypes = ['field'] as const

/**
 * レイアウトのためのレイヤ名一覧
 */
export type LayerType = typeof layerTypes[number]

/**
 * scene 上に配置するエンティティのレイアウト情報
 */
export interface LayerConfig {
  /**
   * Spot, Player が配置されるマップの大きさ.
   */
  field: g.CommonArea
}
