import { SpotConfigure, SpotConfigureImpl } from './spotConfigure'
import { image } from '../util/loader'
import { SpotConfigSupplier } from '../value/spotConfig'
import { SampleLive } from '../model/live'

/**
 * 訪問先 {@link Spot} を簡便に作るためのクラス.
 *
 * Spot は本クラスを用いて作成してください.
 */
export class SpotBuilder extends SpotConfigureImpl {
  private static lastUsedScene?: g.Scene
  private static defaultConfig?: SpotConfigSupplier
  private static defaultConfigure?: SpotConfigure

  constructor (scene: g.Scene) {
    super(false, scene, SpotBuilder.getDefaultConfig(scene))
  }

  /**
   * {@link build} を使用して Spot を作成する際、
   * 個別の設定を省略した際のデフォルト値.
   *
   * 個々の Spot によらず共通の設定をしたい場合は、
   * 本パラメタを利用して設定を変更してください.
   */
  static getDefault (scene: g.Scene): SpotConfigure {
    if (SpotBuilder.lastUsedScene !== scene) {
      SpotBuilder.resetDefault()
    }
    if (!SpotBuilder.defaultConfigure) {
      SpotBuilder.defaultConfigure = new SpotConfigureImpl(true, scene, SpotBuilder.getDefaultConfig(scene))
    }
    SpotBuilder.lastUsedScene = scene
    return SpotBuilder.defaultConfigure
  }

  private static getDefaultConfig (scene: g.Scene): SpotConfigSupplier {
    if (SpotBuilder.lastUsedScene !== scene) {
      SpotBuilder.resetDefault()
    }
    if (!SpotBuilder.defaultConfig) {
      SpotBuilder.defaultConfig = new SpotConfigSupplier({
        x: 0,
        y: 0,
        locked: image(scene, 'image/spot.default.locked.png'),
        unvisited: image(scene, 'image/spot.default.unvisited.png'),
        disabled: image(scene, 'image/spot.default.disabled.png'),
        normal: image(scene, 'image/spot.default.normal.png'),
        liveClass: SampleLive
      })
    }
    SpotBuilder.lastUsedScene = scene
    return SpotBuilder.defaultConfig
  }

  /**
   * {@link getDefault} で設定した変更を消去します.
   * @internal
   */
  private static resetDefault () {
    delete SpotBuilder.defaultConfig
    delete SpotBuilder.defaultConfigure
  }
}
