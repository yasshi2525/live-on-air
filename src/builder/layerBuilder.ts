import { LayerConfigure, LayerConfigureImpl } from './layerConfigure'
import { LayerConfigSupplier } from '../value/layerConfig'

/**
 * レイアウト情報をもとに g.Scene に配置する各エンティティ ({@link Layer}) の構築を支援します.
 *
 * Layer は本クラスを用いて作成してください.
 */
export class LayerBuilder extends LayerConfigureImpl {
  private static lastUsedScene?: g.Scene
  private static defaultConfig?: LayerConfigSupplier
  private static defaultConfigure?: LayerConfigure

  constructor (scene: g.Scene) {
    super(false, scene, new LayerConfigSupplier(LayerBuilder.getDefaultConfig(scene).get()))
  }

  /**
   * 各属性値に値を設定しなかった際に使用されるデフォルト値を設定します.
   *
   * @param scene 現在の scene を指定してください.
   */
  static getDefault (scene: g.Scene): LayerConfigure {
    if (LayerBuilder.lastUsedScene !== scene) {
      LayerBuilder.resetDefault()
    }
    if (!LayerBuilder.defaultConfigure) {
      LayerBuilder.defaultConfigure = new LayerConfigureImpl(true, scene, LayerBuilder.getDefaultConfig(scene))
    }
    LayerBuilder.lastUsedScene = scene
    return LayerBuilder.defaultConfigure
  }

  private static getDefaultConfig (scene: g.Scene): LayerConfigSupplier {
    if (LayerBuilder.lastUsedScene !== scene) {
      LayerBuilder.resetDefault()
    }
    if (!LayerBuilder.defaultConfig) {
      LayerBuilder.defaultConfig = new LayerConfigSupplier({
        field: { x: 100, y: 100, width: scene.game.width - 200, height: scene.game.height - 200 },
        screen: { x: 100, y: 100, width: scene.game.width - 200, height: scene.game.height - 200 }
      })
    }
    LayerBuilder.lastUsedScene = scene
    return LayerBuilder.defaultConfig
  }

  /**
   * {@link getDefault} で設定した変更を消去します.
   *
   * @internal
   */
  private static resetDefault () {
    delete LayerBuilder.defaultConfig
    delete LayerBuilder.defaultConfigure
  }
}
