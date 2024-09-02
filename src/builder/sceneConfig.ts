import { SpotImageConfig } from './spotConfig'

/**
 * player 生成時に利用する設定値
 */
export interface ScenePlayerConfig {
  /**
   * 作成する player に設定する移動速度
   */
  speed: number
  /**
   * 作成する player に設定するx座標
   */
  x: number
  /**
   * 作成する player に設定するy座標
   */
  y: number
  /**
   * 作成する player に使用される画像アセット
   */
  asset: g.ImageAsset
}

/**
 * spot 生成時に利用する設定値
 */
export interface SceneSpotConfig extends SpotImageConfig {
  /**
   * 作成する spot に設定する x 座標.
   */
  x: number
  /**
   * 作成する spot に設定する y 座標
   */
  y: number
}
