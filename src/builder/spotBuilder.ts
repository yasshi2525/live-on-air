import { SpotConfigure, SpotConfigureImpl } from './spotConfigure'
import { image } from '../util/loader'
import { SpotAssetRecord, SpotConfigSupplier } from '../value/spotConfig'
import { Live, SampleLive } from '../model/live'

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
    super(false, scene, new SpotConfigSupplier(SpotBuilder.getDefaultConfig(scene).get()))
  }

  /**
   * 描画に使用する画像アセットを設定します.
   *
   * @param assets 状態ごとに使用する画像アセット
   */
  image(assets: Partial<SpotAssetRecord>): SpotBuilder

  /**
   * 描画に使用される画像アセットをすべての状態について取得します.
   */
  image (): Readonly<SpotAssetRecord>

  image (args?: Partial<SpotAssetRecord>): SpotBuilder | Readonly<SpotAssetRecord> {
    if (args) {
      super.image(args)
      return this
    }
    return super.image()
  }

  /**
   * 作成する Spot を配置する座標を設定します.
   *
   * @param location Spot を配置する座標
   */
  location (location: g.CommonOffset): SpotBuilder

  /**
   * 作成する Spot を配置する座標を取得します.
   */
  location (): Readonly<g.CommonOffset>

  location (args?: g.CommonOffset): SpotBuilder | Readonly<g.CommonOffset> {
    if (args) {
      super.location(args)
      return this
    }
    return super.location()
  }

  /**
   * 作成する Spot に到達すると開始する生放送を取得します.
   */
  liveClass(): new () => Live

  /**
   * 作成する Spot に到達すると開始する生放送を設定します.
   *
   * @param liveClass 開始する生放送クラス名. インスタンスでない点にご留意ください.
   */
  liveClass(liveClass: new () => Live): SpotBuilder

  liveClass (args?: new () => Live): SpotBuilder | Readonly<new () => Live> {
    if (args) {
      super.liveClass(args)
      return this
    }
    return super.liveClass()
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
