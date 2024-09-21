import { LayerConfig, LayerConfigSupplier } from '../value/layerConfig'
import { BroadcasterConfig, BroadcasterConfigSupplier } from '../value/broadcasterConfig'
import { SpotConfig, SpotConfigSupplier } from '../value/spotConfig'
import { FieldConfig, FieldConfigSupplier } from '../value/fieldConfig'
import { LiveOnAirScene, LiveOnAirSceneImpl } from '../model/liveOnAirScene'
import { ScreenConfig, ScreenConfigSupplier } from '../value/screenConfig'
import { CommentSupplierConfig, CommentSupplierConfigSupplier } from '../value/commentSupplierConfig'
import { CommentDeployerConfig, CommentDeployerConfigSupplier } from '../value/commentDeployerConfig'
import { ScorerConfig, ScorerConfigSupplier } from '../value/scorerConfig'
import { TickerConfig, TickerConfigSupplier } from '../value/tickerConfig'
import { CommentContextConfig, CommentContextConfigSupplier } from '../value/commentContextConfig'

/**
 * {@link LiveOnAirScene} を新規作成する際の各種設定を格納します.
 */
export interface LiveOnAirSceneConfigure {
  /**
   * g.Scene 上に配置される各レイヤーの領域値を設定します.
   *
   * @param config 各レイヤーの領域の位置・大きさ
   */
  layer(config: Partial<LayerConfig>): LiveOnAirSceneConfigure

  /**
   * g.Scene 上に配置される各レイヤーの領域値を取得します.
   *
   */
  layer(): Readonly<LayerConfig>

  /**
   * マップ ({@link Field}) の属性情報を設定します.
   *
   * @param config Field の設定値
   */
  field(config: Partial<FieldConfig>): LiveOnAirSceneConfigure

  /**
   * マップ ({@link Field}) の属性情報を取得します.
   */
  field(): Readonly<FieldConfig>

  /**
   * 作成する {@link Broadcaster} の属性情報を設定します.
   *
   * @param config Broadcaster の設定値
   */
  broadcaster(config: Partial<BroadcasterConfig>): LiveOnAirSceneConfigure

  /**
   * 作成する {@link Broadcaster} の属性情報を取得します.
   */
  broadcaster(): Readonly<BroadcasterConfig>

  /**
   * 生放送の画面 ({@link Screen}) の属性情報を設定します.
   *
   * @param config Field の設定値
   */
  screen(config: Partial<ScreenConfig>): LiveOnAirSceneConfigure

  /**
   * 生放送の画面 ({@link Screen}) の属性情報を取得します.
   */
  screen(): Readonly<ScreenConfig>

  /**
   * 作成する {@link Spot} の属性情報を設定します.
   *
   * @param config Spot の設定値
   */
  spot(config: Partial<SpotConfig>): LiveOnAirSceneConfigure

  /**
   * 作成する {@link Spot} の属性情報を取得します.
   */
  spot(): readonly SpotConfig[]

  /**
   * 作成する {@link CommentContext} の属性情報を設定します.
   *
   * @param config CommentContext の設定値
   */
  commentContext(config: Partial<CommentContextConfig>): LiveOnAirSceneConfigure

  /**
   * 作成する {@link CommentContext} の属性情報を取得します.
   */
  commentContext(): Readonly<CommentContextConfig>

  /**
   * 作成する {@link CommentSupplier} の属性情報を設定します.
   *
   * @param config CommentSupplier の設定値
   */
  commentSupplier(config: Partial<CommentSupplierConfig>): LiveOnAirSceneConfigure

  /**
   * 作成する {@link CommentSupplier} の属性情報を取得します.
   */
  commentSupplier(): Readonly<CommentSupplierConfig>

  /**
   * 作成する {@link CommentSupplier} の属性情報を設定します.
   *
   * @param config CommentSupplier の設定値
   */
  commentDeployer(config: Partial<CommentDeployerConfig>): LiveOnAirSceneConfigure

  /**
   * 作成する {@link CommentSupplier} の属性情報を取得します.
   */
  commentDeployer(): Readonly<CommentDeployerConfig>

  /**
   * 作成する {@link Scorer} の属性情報を設定します.
   *
   * @param config Scorer の設定値
   */
  scorer(config: Partial<ScorerConfig>): LiveOnAirSceneConfigure

  /**
   * 作成する{@link Scorer} の属性情報を取得します.
   */
  scorer(): Readonly<ScorerConfig>

  /**
   * 作成する {@link Ticker} の属性情報を設定します.
   *
   * @param config Ticker の設定値
   */
  ticker(config: Partial<TickerConfig>): LiveOnAirSceneConfigure

  /**
   * 作成する {@link Ticker} の属性情報を取得します.
   */
  ticker(): Readonly<TickerConfig>
}

export interface LiveOnAirSceneConfigSupplierOptions {
  game: g.Game
  layer: LayerConfigSupplier
  field: FieldConfigSupplier
  broadcaster: BroadcasterConfigSupplier
  screen: ScreenConfigSupplier
  spot: SpotConfigSupplier
  commentContext: CommentContextConfigSupplier
  commentSupplier: CommentSupplierConfigSupplier
  commentDeployer: CommentDeployerConfigSupplier
  scorer: ScorerConfigSupplier
  ticker: TickerConfigSupplier
  isDefault: boolean
}

export class LiveOnAirSceneConfigureImpl implements LiveOnAirSceneConfigure {
  private readonly isDefault: boolean
  private readonly game: g.Game
  private readonly spotConfig: SpotConfigSupplier

  private readonly spotConfigs: SpotConfigSupplier[]

  private readonly layerGetter: () => LayerConfig
  private readonly fieldGetter: () => FieldConfig
  private readonly broadcasterGetter: () => BroadcasterConfig
  private readonly screenGetter: () => ScreenConfig
  private readonly commentContextGetter: () => CommentContextConfig
  private readonly commentSupplierGetter: () => CommentSupplierConfig
  private readonly commentDeployerGetter: () => CommentDeployerConfig
  private readonly scorerGetter: () => ScorerConfig
  private readonly tickerGetter: () => TickerConfig

  private readonly layerSetter: (obj: Partial<LayerConfig>) => void
  private readonly fieldSetter: (obj: Partial<FieldConfig>) => void
  private readonly broadcasterSetter: (obj: Partial<BroadcasterConfig>) => void
  private readonly screenSetter: (obj: Partial<ScreenConfig>) => void
  private readonly commentContextSetter: (obj: Partial<CommentContextConfig>) => void
  private readonly commentSupplierSetter: (obj: Partial<CommentSupplierConfig>) => void
  private readonly commentDeployerSetter: (obj: Partial<CommentDeployerConfig>) => void
  private readonly scorerSetter: (obj: Partial<ScorerConfig>) => void
  private readonly tickerSetter: (obj: Partial<TickerConfig>) => void

  constructor ({ game, layer, field, broadcaster, screen, spot, commentContext, commentSupplier, commentDeployer, scorer, ticker, isDefault }: LiveOnAirSceneConfigSupplierOptions) {
    this.isDefault = isDefault
    this.game = game
    this.spotConfig = spot
    this.spotConfigs = []

    this.layerGetter = () => isDefault ? layer.default() : layer.get()
    this.fieldGetter = () => isDefault ? field.default() : field.get()
    this.broadcasterGetter = () => isDefault ? broadcaster.default() : broadcaster.get()
    this.screenGetter = () => isDefault ? screen.default() : screen.get()
    this.commentContextGetter = () => isDefault ? commentContext.default() : commentContext.get()
    this.commentSupplierGetter = () => isDefault ? commentSupplier.default() : commentSupplier.get()
    this.commentDeployerGetter = () => isDefault ? commentDeployer.default() : commentDeployer.get()
    this.scorerGetter = () => isDefault ? scorer.default() : scorer.get()
    this.tickerGetter = () => isDefault ? ticker.default() : ticker.get()

    this.layerSetter = obj => isDefault ? layer.defaultIf(obj) : layer.setIf(obj)
    this.fieldSetter = obj => isDefault ? field.defaultIf(obj) : field.setIf(obj)
    this.broadcasterSetter = obj => isDefault ? broadcaster.defaultIf(obj) : broadcaster.setIf(obj)
    this.screenSetter = obj => isDefault ? screen.defaultIf(obj) : screen.setIf(obj)
    this.commentContextSetter = obj => isDefault ? commentContext.defaultIf(obj) : commentContext.setIf(obj)
    this.commentSupplierSetter = obj => isDefault ? commentSupplier.defaultIf(obj) : commentSupplier.setIf(obj)
    this.commentDeployerSetter = obj => isDefault ? commentDeployer.defaultIf(obj) : commentDeployer.setIf(obj)
    this.scorerSetter = obj => isDefault ? scorer.defaultIf(obj) : scorer.setIf(obj)
    this.tickerSetter = obj => isDefault ? ticker.defaultIf(obj) : ticker.setIf(obj)
  }

  layer (config: Partial<LayerConfig>): LiveOnAirSceneConfigure

  layer (): Readonly<LayerConfig>

  layer (args?: Partial<LayerConfig>): LiveOnAirSceneConfigure | Readonly<LayerConfig> {
    if (args) {
      this.layerSetter(args)
      return this
    }
    return this.layerGetter()
  }

  field (config: Partial<FieldConfig>): LiveOnAirSceneConfigure

  field (): Readonly<FieldConfig>

  field (args?: Partial<FieldConfig>): LiveOnAirSceneConfigure | Readonly<FieldConfig> {
    if (args) {
      this.fieldSetter(args)
      return this
    }
    return this.fieldGetter()
  }

  broadcaster (config: Partial<BroadcasterConfig>): LiveOnAirSceneConfigure

  broadcaster (): Readonly<BroadcasterConfig>

  broadcaster (args?: Partial<BroadcasterConfig>): LiveOnAirSceneConfigure | Readonly<BroadcasterConfig> {
    if (args) {
      this.broadcasterSetter(args)
      return this
    }
    return this.broadcasterGetter()
  }

  screen (config: Partial<ScreenConfig>): LiveOnAirSceneConfigure

  screen (): Readonly<ScreenConfig>

  screen (args?: Partial<ScreenConfig>): LiveOnAirSceneConfigure | Readonly<ScreenConfig> {
    if (args) {
      this.screenSetter(args)
      return this
    }
    return this.screenGetter()
  }

  spot (config: Partial<SpotConfig>): LiveOnAirSceneConfigure

  spot (): readonly SpotConfig[]

  spot (args?: Partial<SpotConfig>): LiveOnAirSceneConfigure | readonly SpotConfig[] {
    if (args) {
      if (!this.isDefault) {
        const spotConfig = new SpotConfigSupplier(this.spotConfig.default())
        spotConfig.setIf(args)
        this.spotConfigs.push(spotConfig)
      } else {
        this.spotConfig.defaultIf(args)
      }
      return this
    }
    return this.isDefault ? [this.spotConfig.default()] : [...this.spotConfigs.map(config => config.get())]
  }

  commentContext (config: Partial<CommentContextConfig>): LiveOnAirSceneConfigure

  commentContext (): Readonly<CommentContextConfig>

  commentContext (args?: Partial<CommentContextConfig>): LiveOnAirSceneConfigure | Readonly<CommentContextConfig> {
    if (args) {
      this.commentContextSetter(args)
      return this
    }
    return this.commentContextGetter()
  }

  commentSupplier (config: Partial<CommentSupplierConfig>): LiveOnAirSceneConfigure

  commentSupplier (): Readonly<CommentSupplierConfig>

  commentSupplier (args?: Partial<CommentSupplierConfig>): LiveOnAirSceneConfigure | Readonly<CommentSupplierConfig> {
    if (args) {
      this.commentSupplierSetter(args)
      return this
    }
    return this.commentSupplierGetter()
  }

  commentDeployer (config: Partial<CommentDeployerConfig>): LiveOnAirSceneConfigure

  commentDeployer (): Readonly<CommentDeployerConfig>

  commentDeployer (args?: Partial<CommentDeployerConfig>): LiveOnAirSceneConfigure | Readonly<CommentDeployerConfig> {
    if (args) {
      this.commentDeployerSetter(args)
      return this
    }
    return this.commentDeployerGetter()
  }

  scorer (config: Partial<ScorerConfig>): LiveOnAirSceneConfigure

  scorer (): Readonly<ScorerConfig>

  scorer (args?: Partial<ScorerConfig>): LiveOnAirSceneConfigure | Readonly<ScorerConfig> {
    if (args) {
      this.scorerSetter(args)
      return this
    }
    return this.scorerGetter()
  }

  ticker (config: Partial<TickerConfig>): LiveOnAirSceneConfigure

  ticker (): Readonly<TickerConfig>

  ticker (args?: Partial<TickerConfig>): LiveOnAirSceneConfigure | Readonly<TickerConfig> {
    if (args) {
      this.tickerSetter(args)
      return this
    }
    return this.tickerGetter()
  }

  /**
   * 指定された設定で {@link LiveOnAirScene} を作成します.
   */
  build (): LiveOnAirScene & g.Scene {
    return new LiveOnAirSceneImpl({ game: this.game, layer: this.layer(), field: this.field(), broadcaster: this.broadcaster(), spots: this.spot(), commentContext: this.commentContext(), commentSupplier: this.commentSupplier(), commentDeployer: this.commentDeployer(), screen: this.screen(), scorer: this.scorer(), ticker: this.ticker() })
  }
}
