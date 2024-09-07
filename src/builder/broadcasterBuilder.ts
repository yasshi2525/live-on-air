import { image } from '../util/loader'
import { BroadcasterConfigure, BroadcasterConfigureImpl } from './broadcasterConfigure'
import { BroadcasterConfigSupplier } from '../value/broadcasterConfig'

/**
 * 放送者（プレイヤー） {@link Broadcaster} を簡便に作るためのクラス.
 *
 * Broadcaster は本クラスを用いて作成してください.
 */
export class BroadcasterBuilder extends BroadcasterConfigureImpl {
  private static lastUsedScene?: g.Scene
  private static defaultConfig?: BroadcasterConfigSupplier
  private static defaultConfigure?: BroadcasterConfigure

  constructor (scene: g.Scene) {
    super(false, scene, new BroadcasterConfigSupplier(BroadcasterBuilder.getDefaultConfig(scene).get()))
  }

  /**
   * 各属性値に値を設定しなかった際に使用されるデフォルト値を設定します.
   *
   * @param scene 現在の scene を指定してください.
   */
  static getDefault (scene: g.Scene): BroadcasterConfigure {
    if (BroadcasterBuilder.lastUsedScene !== scene) {
      BroadcasterBuilder.resetDefault()
    }
    if (!BroadcasterBuilder.defaultConfigure) {
      BroadcasterBuilder.defaultConfigure = new BroadcasterConfigureImpl(true, scene, BroadcasterBuilder.getDefaultConfig(scene))
    }
    BroadcasterBuilder.lastUsedScene = scene
    return BroadcasterBuilder.defaultConfigure
  }

  private static getDefaultConfig (scene: g.Scene): BroadcasterConfigSupplier {
    if (BroadcasterBuilder.lastUsedScene !== scene) {
      BroadcasterBuilder.resetDefault()
    }
    if (!BroadcasterBuilder.defaultConfig) {
      BroadcasterBuilder.defaultConfig = new BroadcasterConfigSupplier({
        x: 0, y: 0, speed: 1, asset: image(scene, 'image/broadcaster.default.png')
      })
    }
    BroadcasterBuilder.lastUsedScene = scene
    return BroadcasterBuilder.defaultConfig
  }

  /**
   * {@link getDefault} で設定した変更を消去します.
   * @internal
   */
  private static resetDefault () {
    delete BroadcasterBuilder.defaultConfig
    delete BroadcasterBuilder.defaultConfigure
  }
}
