import { SceneConfigSupplierOptions, SceneConfigure, SceneConfigureImpl } from './sceneConfigure'
import { image } from '../util/loader'
import { BroadcasterConfigSupplier } from '../value/broadcasterConfig'
import { LayerConfigSupplier } from '../value/layerConfig'
import { SpotConfigSupplier } from '../value/spotConfig'
import { FieldConfigSupplier } from '../value/fieldConfig'
import { ScreenConfigSupplier } from '../value/screenConfig'
import { SampleLive } from '../model/live'

/**
 * ゲームが動作する g.Scene を簡便に作るためのクラス.
 */
export class SceneBuilder extends SceneConfigureImpl {
  private static lastUsedScene?: g.Scene
  private static defaultConfig?: Omit<SceneConfigSupplierOptions, 'isDefault'>
  private static defaultConfigure?: SceneConfigure

  constructor (game: g.Game) {
    super({ isDefault: false, ...SceneBuilder.getDefaultConfig(game) })
  }

  /**
   * 各属性値に値を設定しなかった際に使用されるデフォルト値を設定します.
   *
   * @param game g.game を指定してください.
   */
  static getDefault (game: g.Game): SceneConfigure {
    if (SceneBuilder.lastUsedScene !== game.scene()) {
      SceneBuilder.resetDefault()
    }
    if (!SceneBuilder.defaultConfigure) {
      SceneBuilder.defaultConfigure = new SceneConfigureImpl({ isDefault: true, ...SceneBuilder.getDefaultConfig(game) })
    }
    this.lastUsedScene = game.scene()
    return SceneBuilder.defaultConfigure
  }

  private static getDefaultConfig (game: g.Game): Omit<SceneConfigSupplierOptions, 'isDefault'> {
    if (SceneBuilder.lastUsedScene !== game.scene()) {
      SceneBuilder.resetDefault()
    }
    if (!SceneBuilder.defaultConfig) {
      const layer = new LayerConfigSupplier({
        field: { x: 100, y: 100, width: game.width - 200, height: game.height - 200 },
        screen: { x: 100, y: 100, width: game.width - 200, height: game.height - 200 }
      })
      const field = new FieldConfigSupplier({})
      const broadcaster = new BroadcasterConfigSupplier({
        x: 0, y: 0, speed: 1, asset: image(game, 'image/broadcaster.default.png')
      })
      const screen = new ScreenConfigSupplier({})
      const spot = new SpotConfigSupplier({
        x: 0,
        y: 0,
        locked: image(game.scene()!, 'image/spot.default.locked.png'),
        unvisited: image(game.scene()!, 'image/spot.default.unvisited.png'),
        disabled: image(game.scene()!, 'image/spot.default.disabled.png'),
        normal: image(game.scene()!, 'image/spot.default.normal.png'),
        liveClass: SampleLive
      })
      SceneBuilder.defaultConfig = { game, layer, field, broadcaster, screen, spot }
    }
    this.lastUsedScene = game.scene()
    return SceneBuilder.defaultConfig
  }

  /**
   * {@link getDefault} で設定した変更を消去します.
   * @internal
   */
  private static resetDefault () {
    delete SceneBuilder.defaultConfig
    delete SceneBuilder.defaultConfigure
  }
}
