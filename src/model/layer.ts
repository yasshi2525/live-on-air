import { LayerConfig, LayerType } from '../builder/layerConfig'

/**
 * ゲーム Scene 上にエンティティを前後適切に配置するためのレイヤ層.
 */
export interface Layer {
  /**
   * マップ層.
   *
   * Spot, Player を配置するためのレイヤ.
   */
  readonly field: g.E
}

export class LayerImpl implements Layer {
  readonly field: g.E

  constructor (private readonly scene: g.Scene, private readonly config: LayerConfig) {
    this.field = this.createEntity('field')
  }

  private createEntity (typ: LayerType) {
    return new g.E({ scene: this.scene, parent: this.scene, ...this.config[typ] })
  }
}
