import { LiveOnAirSceneConfigSupplierOptions, LiveOnAirSceneConfigure, LiveOnAirSceneConfigureImpl } from './liveOnAirSceneConfigure'
import { image } from '../util/loader'
import { BroadcasterConfig, BroadcasterConfigSupplier } from '../value/broadcasterConfig'
import { LayerConfig, LayerConfigSupplier } from '../value/layerConfig'
import { SpotConfig, SpotConfigSupplier } from '../value/spotConfig'
import { FieldConfigSupplier } from '../value/fieldConfig'
import { ScreenConfigSupplier } from '../value/screenConfig'
import { SampleLive } from '../model/live'
import { CommentSupplierConfig, CommentSupplierConfigSupplier } from '../value/commentSupplierConfig'
import { CommentDeployerConfig, CommentDeployerConfigSupplier } from '../value/commentDeployerConfig'
import { ScorerConfig, ScorerConfigSupplier } from '../value/scorerConfig'

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
   * g.Scene 上に配置される各レイヤーの領域値を設定します.
   *
   * @param config 設定されている各レイヤーについての領域の位置・大きさ
   */
  layer(config: Partial<LayerConfig>): LiveOnAirSceneBuilder

  /**
   * g.Scene 上に配置される各レイヤーの領域値を取得します.
   *
   */
  layer (): Readonly<LayerConfig>

  layer (args?: Partial<LayerConfig>): LiveOnAirSceneBuilder | Readonly<LayerConfig> {
    if (args) {
      super.layer(args)
      return this
    }
    return super.layer()
  }

  /**
   * マップ ({@link Field}) の属性情報を設定します.
   *
   * @param config Field の設定値
   */
  field(config: object): LiveOnAirSceneBuilder

  /**
   * マップ ({@link Field}) の属性情報を取得します.
   */
  field (): Readonly<object>

  field (args?: object): LiveOnAirSceneBuilder | Readonly<object> {
    if (args) {
      super.field(args)
      return this
    }
    return super.field()
  }

  /**
   * 作成する {@link Broadcaster} の属性情報を設定します.
   *
   * @param config Broadcaster の設定値
   */
  broadcaster(config: Partial<BroadcasterConfig>): LiveOnAirSceneBuilder

  /**
   * 作成する {@link Broadcaster} の属性情報を取得します.
   */
  broadcaster (): Readonly<BroadcasterConfig>

  broadcaster (args?: Partial<BroadcasterConfig>): LiveOnAirSceneBuilder | Readonly<BroadcasterConfig> {
    if (args) {
      super.broadcaster(args)
      return this
    }
    return super.broadcaster()
  }

  /**
   * 生放送の画面 ({@link Screen}) の属性情報を設定します.
   *
   * @param config Field の設定値
   */
  screen(config: object): LiveOnAirSceneBuilder

  /**
   * 生放送の画面 ({@link Screen}) の属性情報を取得します.
   */
  screen (): Readonly<object>

  screen (args?: object): LiveOnAirSceneBuilder | Readonly<object> {
    if (args) {
      super.screen(args)
      return this
    }
    return super.screen()
  }

  /**
   * 作成する {@link Spot} の属性情報を設定します.
   *
   * @param config Spot の設定値
   */
  spot(config: Partial<SpotConfig>): LiveOnAirSceneBuilder

  /**
   * 作成する {@link Spot} の属性情報を取得します.
   */
  spot (): readonly SpotConfig[]

  spot (args?: Partial<SpotConfig>): LiveOnAirSceneBuilder | readonly SpotConfig[] {
    if (args) {
      super.spot(args)
      return this
    }
    return super.spot()
  }

  /**
   * 作成する {@link CommentSupplier} の属性情報を設定します.
   *
   * @param config CommentSupplier の設定値
   */
  commentSupplier(config: Partial<CommentSupplierConfig>): LiveOnAirSceneBuilder

  /**
   * 作成する {@link CommentSupplier} の属性情報を取得します.
   */
  commentSupplier (): Readonly<CommentSupplierConfig>

  commentSupplier (args?: Partial<CommentSupplierConfig>): LiveOnAirSceneBuilder | Readonly<CommentSupplierConfig> {
    if (args) {
      super.commentSupplier(args)
      return this
    }
    return super.commentSupplier()
  }

  /**
   * 作成する {@link CommentSupplier} の属性情報を設定します.
   *
   * @param config CommentSupplier の設定値
   */
  commentDeployer(config: Partial<CommentDeployerConfig>): LiveOnAirSceneBuilder

  /**
   * 作成する {@link CommentSupplier} の属性情報を取得します.
   */
  commentDeployer (): Readonly<CommentDeployerConfig>

  commentDeployer (args?: Partial<CommentDeployerConfig>): LiveOnAirSceneBuilder | Readonly<CommentDeployerConfig> {
    if (args) {
      super.commentDeployer(args)
      return this
    }
    return super.commentDeployer()
  }

  /**
   * 作成する {@link Scorer} の属性情報を設定します.
   * @param config Scorer の設定値
   */
  scorer(config: Partial<ScorerConfig>): LiveOnAirSceneBuilder

  /**
   * 作成する{@link Scorer} の属性情報を取得します.
   */
  scorer(): Readonly<ScorerConfig>

  scorer (args?: Partial<ScorerConfig>): LiveOnAirSceneBuilder | Readonly<ScorerConfig> {
    if (args) {
      super.scorer(args)
      return this
    }
    return super.scorer()
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
        comment: { x: 100, y: 100, width: game.width - 200, height: game.height - 200 },
        header: { x: 0, y: 0, width: game.width, height: 100 }
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
      const scorer = new ScorerConfigSupplier({
        font: new g.DynamicFont({ game, fontFamily: 'monospace', size: 40 }),
        digit: 4,
        prefix: 'スコア',
        suffix: '点'
      })
      LiveOnAirSceneBuilder.defaultConfig = { game, layer, field, broadcaster, screen, spot, commentSupplier, commentDeployer, scorer }
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
