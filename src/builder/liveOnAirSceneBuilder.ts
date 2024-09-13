import { LiveOnAirSceneConfigSupplierOptions, LiveOnAirSceneConfigure, LiveOnAirSceneConfigureImpl } from './liveOnAirSceneConfigure'
import { image } from '../util/loader'
import { BroadcasterConfigSupplier } from '../value/broadcasterConfig'
import { LayerConfigSupplier } from '../value/layerConfig'
import { SpotConfigSupplier } from '../value/spotConfig'
import { FieldConfigSupplier } from '../value/fieldConfig'
import { ScreenConfigSupplier } from '../value/screenConfig'
import { SampleLive } from '../model/live'
import { CommentSupplierConfigSupplier } from '../value/commentSupplierConfig'
import { CommentDeployerConfigSupplier } from '../value/commentDeployerConfig'

/**
 * ゲームが動作する g.Scene を簡便に作るためのクラス.
 */
export class LiveOnAirSceneBuilder extends LiveOnAirSceneConfigureImpl {
  private static lastUsedScene?: g.Scene
  private static defaultConfig?: Omit<LiveOnAirSceneConfigSupplierOptions, 'isDefault'>
  private static defaultConfigure?: LiveOnAirSceneConfigure

  constructor (game: g.Game) {
    super({ isDefault: false, ...LiveOnAirSceneBuilder.getDefaultConfig(game) })
  }

  /**
   * 各属性値に値を設定しなかった際に使用されるデフォルト値を設定します.
   *
   * @param game g.game を指定してください.
   */
  static getDefault (game: g.Game): LiveOnAirSceneConfigure {
    if (LiveOnAirSceneBuilder.lastUsedScene !== game.scene()) {
      LiveOnAirSceneBuilder.resetDefault()
    }
    if (!LiveOnAirSceneBuilder.defaultConfigure) {
      LiveOnAirSceneBuilder.defaultConfigure = new LiveOnAirSceneConfigureImpl({ isDefault: true, ...LiveOnAirSceneBuilder.getDefaultConfig(game) })
    }
    this.lastUsedScene = game.scene()
    return LiveOnAirSceneBuilder.defaultConfigure
  }

  private static getDefaultConfig (game: g.Game): Omit<LiveOnAirSceneConfigSupplierOptions, 'isDefault'> {
    if (LiveOnAirSceneBuilder.lastUsedScene !== game.scene()) {
      LiveOnAirSceneBuilder.resetDefault()
    }
    if (!LiveOnAirSceneBuilder.defaultConfig) {
      const layer = new LayerConfigSupplier({
        field: { x: 100, y: 100, width: game.width - 200, height: game.height - 200 },
        screen: { x: 100, y: 100, width: game.width - 200, height: game.height - 200 },
        comment: { x: 100, y: 100, width: game.width - 200, height: game.height - 200 }
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
      const commentSupplier = new CommentSupplierConfigSupplier({
        interval: 1000,
        comments: [] // ここにいれると CommentSupplierBuilder が更にデフォルト値を足してしまう
      })
      const commentDeployer = new CommentDeployerConfigSupplier({
        speed: 1,
        intervalY: 40,
        font: new g.DynamicFont({ game, fontFamily: 'sans-serif', size: 35 })
      })
      LiveOnAirSceneBuilder.defaultConfig = { game, layer, field, broadcaster, screen, spot, commentSupplier, commentDeployer }
    }
    this.lastUsedScene = game.scene()
    return LiveOnAirSceneBuilder.defaultConfig
  }

  /**
   * {@link getDefault} で設定した変更を消去します.
   * @internal
   */
  private static resetDefault () {
    delete LiveOnAirSceneBuilder.defaultConfig
    delete LiveOnAirSceneBuilder.defaultConfigure
  }
}
