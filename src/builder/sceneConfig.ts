import { SpotImageConfig } from './spotConfig'

/**
 * {@link Player} 生成時に利用する設定値
 */
export interface ScenePlayerConfig {
  /**
   * 作成する Player に設定する移動速度
   */
  speed: number
  /**
   * 作成する Player に設定するx座標
   */
  x: number
  /**
   * 作成する Player に設定するy座標
   */
  y: number
  /**
   * 作成する Player に使用される画像アセット
   */
  asset: g.ImageAsset
}

/**
 * {@link Spot} 生成時に利用する設定値
 */
export interface SceneSpotConfig extends SpotImageConfig {
  /**
   * 作成する Spot に設定する x 座標.
   */
  x: number
  /**
   * 作成する Spot に設定する y 座標
   */
  y: number
}
