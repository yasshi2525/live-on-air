import { LiveOnAirSceneConfigSupplierOptions, LiveOnAirSceneConfigure, LiveOnAirSceneConfigureImpl } from './liveOnAirSceneConfigure'
import { image } from '../util/loader'
import { BroadcasterConfig, BroadcasterConfigSupplier } from '../value/broadcasterConfig'
import { LayerConfig, LayerConfigSupplier } from '../value/layerConfig'
import { SpotConfig, SpotConfigSupplier } from '../value/spotConfig'
import { FieldConfig, FieldConfigSupplier } from '../value/fieldConfig'
import { ScreenConfig, ScreenConfigSupplier } from '../value/screenConfig'
import { SampleLive } from '../model/live'
import { CommentSupplierConfig, CommentSupplierConfigSupplier } from '../value/commentSupplierConfig'
import { CommentDeployerConfig, CommentDeployerConfigSupplier } from '../value/commentDeployerConfig'
import { ScorerConfig, ScorerConfigSupplier } from '../value/scorerConfig'
import { TickerConfig, TickerConfigSupplier } from '../value/tickerConfig'
import { CommentContextConfig, CommentContextConfigSupplier } from '../value/commentContextConfig'
import { LiveContextConfig, LiveContextConfigSupplier } from '../value/liveContextConfig'

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
  override layer (config: Partial<LayerConfig>): LiveOnAirSceneBuilder

  /**
   * g.Scene 上に配置される各レイヤーの領域値を取得します.
   *
   */
  override layer (): Readonly<LayerConfig>

  override layer (args?: Partial<LayerConfig>): LiveOnAirSceneBuilder | Readonly<LayerConfig> {
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
  override field (config: Partial<FieldConfig>): LiveOnAirSceneBuilder

  /**
   * マップ ({@link Field}) の属性情報を取得します.
   */
  override field (): Readonly<FieldConfig>

  override field (args?: Partial<FieldConfig>): LiveOnAirSceneBuilder | Readonly<FieldConfig> {
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
  override broadcaster (config: Partial<BroadcasterConfig>): LiveOnAirSceneBuilder

  /**
   * 作成する {@link Broadcaster} の属性情報を取得します.
   */
  override broadcaster (): Readonly<BroadcasterConfig>

  override broadcaster (args?: Partial<BroadcasterConfig>): LiveOnAirSceneBuilder | Readonly<BroadcasterConfig> {
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
  override screen (config: Partial<ScreenConfig>): LiveOnAirSceneBuilder

  /**
   * 生放送の画面 ({@link Screen}) の属性情報を取得します.
   */
  override screen (): Readonly<ScreenConfig>

  override screen (args?: Partial<ScreenConfig>): LiveOnAirSceneBuilder | Readonly<ScreenConfig> {
    if (args) {
      super.screen(args)
      return this
    }
    return super.screen()
  }

  /**
   * {@link LiveContext} の初期値を取得します.
   */
  override liveContext (): Readonly<LiveContextConfig>

  /**
   * {@link LiveContext} の初期値を設定します.
   *
   * @param config LiveContext の初期値
   */
  override liveContext (config: Partial<LiveContextConfig>): LiveOnAirSceneBuilder

  override liveContext (args?: Partial<LiveContextConfig>): LiveOnAirSceneBuilder | Readonly<LiveContextConfig> {
    if (args) {
      super.liveContext(args)
      return this
    }
    return super.liveContext()
  }

  /**
   * 作成する {@link Spot} の属性情報を設定します.
   *
   * @param config Spot の設定値
   */
  override spot (config: Partial<SpotConfig>): LiveOnAirSceneBuilder

  /**
   * 作成する {@link Spot} の属性情報を取得します.
   */
  override spot (): readonly SpotConfig[]

  override spot (args?: Partial<SpotConfig>): LiveOnAirSceneBuilder | readonly SpotConfig[] {
    if (args) {
      super.spot(args)
      return this
    }
    return super.spot()
  }

  /**
   * 作成する {@link CommentContext} の属性情報を設定します.
   *
   * @param config CommentContext の設定値
   */
  override commentContext (config: Partial<CommentContextConfig>): LiveOnAirSceneBuilder

  /**
   * 作成する {@link CommentContext} の属性情報を取得します.
   */
  override commentContext (): Readonly<CommentContextConfig>

  override commentContext (args?: Partial<CommentContextConfig>): LiveOnAirSceneBuilder | Readonly<CommentContextConfig> {
    if (args) {
      super.commentContext(args)
      return this
    }
    return super.commentContext()
  }

  /**
   * 作成する {@link CommentSupplier} の属性情報を設定します.
   *
   * @param config CommentSupplier の設定値
   */
  override commentSupplier (config: Partial<CommentSupplierConfig>): LiveOnAirSceneBuilder

  /**
   * 作成する {@link CommentSupplier} の属性情報を取得します.
   */
  override commentSupplier (): Readonly<CommentSupplierConfig>

  override commentSupplier (args?: Partial<CommentSupplierConfig>): LiveOnAirSceneBuilder | Readonly<CommentSupplierConfig> {
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
  override commentDeployer (config: Partial<CommentDeployerConfig>): LiveOnAirSceneBuilder

  /**
   * 作成する {@link CommentSupplier} の属性情報を取得します.
   */
  override commentDeployer (): Readonly<CommentDeployerConfig>

  override commentDeployer (args?: Partial<CommentDeployerConfig>): LiveOnAirSceneBuilder | Readonly<CommentDeployerConfig> {
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
  override scorer (config: Partial<ScorerConfig>): LiveOnAirSceneBuilder

  /**
   * 作成する{@link Scorer} の属性情報を取得します.
   */
  override scorer (): Readonly<ScorerConfig>

  override scorer (args?: Partial<ScorerConfig>): LiveOnAirSceneBuilder | Readonly<ScorerConfig> {
    if (args) {
      super.scorer(args)
      return this
    }
    return super.scorer()
  }

  /**
   * 作成する {@link Ticker} の属性情報を設定します.
   * @param config Ticker の設定値
   */
  override ticker (config: Partial<TickerConfig>): LiveOnAirSceneBuilder

  /**
   * 作成する{@link Ticker} の属性情報を取得します.
   */
  override ticker (): Readonly<TickerConfig>

  override ticker (args?: Partial<TickerConfig>): LiveOnAirSceneBuilder | Readonly<TickerConfig> {
    if (args) {
      super.ticker(args)
      return this
    }
    return super.ticker()
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
        header: { x: 0, y: 0, width: game.width, height: 100 },
        vars: undefined
      })
      const field = new FieldConfigSupplier({ vars: undefined })
      const broadcaster = new BroadcasterConfigSupplier({
        x: 0, y: 0, speed: 1, asset: image(game, 'image/broadcaster.default.png'), vars: undefined
      })
      const screen = new ScreenConfigSupplier({ vars: undefined })
      const liveContext = new LiveContextConfigSupplier({ vars: undefined })
      const spot = new SpotConfigSupplier({
        x: 0,
        y: 0,
        locked: image(game.scene()!, 'image/spot.default.locked.png'),
        unvisited: image(game.scene()!, 'image/spot.default.unvisited.png'),
        disabled: image(game.scene()!, 'image/spot.default.disabled.png'),
        normal: image(game.scene()!, 'image/spot.default.normal.png'),
        name: '',
        labelFont: new g.DynamicFont({
          game,
          fontFamily: 'sans-serif',
          size: 25,
          fontColor: 'black',
          strokeColor: 'white',
          strokeWidth: 3
        }),
        liveClass: SampleLive,
        vars: undefined
      })
      const commentContext = new CommentContextConfigSupplier({
        vars: undefined
      })
      const commentSupplier = new CommentSupplierConfigSupplier({
        interval: 1000,
        comments: [], // ここにいれると CommentSupplierBuilder が更にデフォルト値を足してしまう
        vars: undefined
      })
      const commentDeployer = new CommentDeployerConfigSupplier({
        speed: 4,
        intervalY: 40,
        font: new g.DynamicFont({ game, fontFamily: 'sans-serif', size: 35, strokeColor: 'white', strokeWidth: 4 }),
        vars: undefined
      })
      const scorer = new ScorerConfigSupplier({
        font: new g.DynamicFont({ game, fontFamily: 'monospace', size: 40, strokeColor: 'white', strokeWidth: 4 }),
        digit: 4,
        prefix: 'スコア',
        suffix: '点',
        vars: undefined
      })
      const ticker = new TickerConfigSupplier({
        frame: 1800,
        font: new g.DynamicFont({ game, fontFamily: 'monospace', size: 40, strokeColor: 'white', strokeWidth: 4 }),
        digit: 2,
        prefix: '残り',
        suffix: '秒',
        vars: undefined
      })
      LiveOnAirSceneBuilder.defaultConfig = { game, layer, field, broadcaster, screen, liveContext, spot, commentContext, commentSupplier, commentDeployer, scorer, ticker }
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
