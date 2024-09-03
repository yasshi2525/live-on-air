import { image } from '../util/loader'
import { PlayerConfigure, PlayerConfigureImpl } from './playerConfigure'
import { PlayerConfigSupplier } from '../value/playerConfig'

/**
 * プレイヤー {@link Player} を簡便に作るためのクラス.
 *
 * Player は本クラスを用いて作成してください.
 */
export class PlayerBuilder extends PlayerConfigureImpl {
  private static lastUsedScene?: g.Scene
  private static defaultConfig?: PlayerConfigSupplier
  private static defaultConfigure?: PlayerConfigure

  constructor (scene: g.Scene) {
    super(false, scene, new PlayerConfigSupplier(PlayerBuilder.getDefaultConfig(scene).get()))
  }

  /**
   * 各属性値に値を設定しなかった際に使用されるデフォルト値を設定します.
   *
   * @param scene 現在の scene を指定してください.
   */
  static getDefault (scene: g.Scene): PlayerConfigure {
    if (PlayerBuilder.lastUsedScene !== scene) {
      PlayerBuilder.resetDefault()
    }
    if (!PlayerBuilder.defaultConfigure) {
      PlayerBuilder.defaultConfigure = new PlayerConfigureImpl(true, scene, PlayerBuilder.getDefaultConfig(scene))
    }
    PlayerBuilder.lastUsedScene = scene
    return PlayerBuilder.defaultConfigure
  }

  private static getDefaultConfig (scene: g.Scene): PlayerConfigSupplier {
    if (PlayerBuilder.lastUsedScene !== scene) {
      PlayerBuilder.resetDefault()
    }
    if (!PlayerBuilder.defaultConfig) {
      PlayerBuilder.defaultConfig = new PlayerConfigSupplier({
        x: 0, y: 0, speed: 1, asset: image(scene, 'image/player.default.png')
      })
    }
    PlayerBuilder.lastUsedScene = scene
    return PlayerBuilder.defaultConfig
  }

  /**
   * {@link getDefault} で設定した変更を消去します.
   * @internal
   */
  private static resetDefault () {
    delete PlayerBuilder.defaultConfig
    delete PlayerBuilder.defaultConfigure
  }
}
