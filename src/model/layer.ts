import { LayerConfig, LayerType } from '../builder/layerConfig'
import { image } from '../util/loader'

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
    const parent = new g.E({ scene: this.scene, parent: this.scene, ...this.config[typ] })
    parent.append(new g.FilledRect({
      scene: this.scene,
      width: parent.width,
      height: parent.height,
      cssColor: '#888888',
      opacity: 0.25
    }))
    parent.append(new g.Sprite({
      scene: this.scene,
      src: image(this.scene, 'image/layer.field.label.png'),
      x: parent.width / 2,
      anchorX: 0.5
    }))
    return parent
  }
}
