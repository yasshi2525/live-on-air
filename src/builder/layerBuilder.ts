import { Configure } from '../util/configure'
import { LayerType } from './layerConfig'
import { Layer, LayerImpl } from '../model/layer'

/**
 * レイアウト情報をもとに scene に配置する各エンティティの構築を支援します.
 */
export class LayerBuilder {
  private readonly config: Configure<LayerType, g.CommonArea>

  constructor (private readonly scene: g.Scene) {
    this.config = new Configure(
      { x: 0, y: 0, width: scene.game.width, height: scene.game.height },
      {
        field: { x: 100, y: 100, width: scene.game.width - 200, height: scene.game.height - 200 }
      }
    )
  }

  /**
   * Spot, Player が配置されるマップの大きさを設定します.
   *
   * @param area 設定する領域
   */
  field (area: g.CommonArea): LayerBuilder {
    this.config.put('field', area)
    return this
  }

  /**
   * 設定されたレイアウト情報をもとに各レイヤを作成し、sceneに登録します
   */
  build (): Layer {
    return new LayerImpl(this.scene, { field: this.config.get('field') })
  }
}
