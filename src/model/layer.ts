import { LayerConfig, LayerType } from '../value/layerConfig'

/**
 * ゲーム g.Scene 上にエンティティを前後適切に配置するためのレイヤ層.
 *
 * {@link LayerBuilder} を使ってインスタンスを作成してください.
 */
export interface Layer {
  /**
   * マップ層.
   *
   * {@link Spot}, {@link Player} を配置するためのレイヤ.
   */
  readonly field: g.E
  /**
   * 生放送層.
   *
   * {@link Live}, を配置するためのレイヤ.
   */
  readonly screen: g.E
  /**
   * ライブラリ利用者が自由に使えるフィールドです.
   */
  vars?: unknown
}

export class LayerImpl implements Layer {
  readonly field: g.E
  readonly screen: g.E
  vars?: unknown

  constructor (private readonly scene: g.Scene, private readonly config: LayerConfig) {
    this.field = this.createEntity('field')
    this.screen = this.createEntity('screen')
  }

  private createEntity (typ: LayerType) {
    return new g.E({
      scene: this.scene,
      parent: this.scene,
      x: this.config[typ].x,
      y: this.config[typ].y,
      width: this.config[typ].width,
      height: this.config[typ].height
    })
  }
}
