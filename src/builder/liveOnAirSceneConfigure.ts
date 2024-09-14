import { LayerConfig, LayerConfigSupplier } from '../value/layerConfig'
import { BroadcasterConfig, BroadcasterConfigSupplier } from '../value/broadcasterConfig'
import { SpotConfig, SpotConfigSupplier } from '../value/spotConfig'
import { FieldConfigSupplier } from '../value/fieldConfig'
import { LiveOnAirScene, LiveOnAirSceneImpl } from '../model/liveOnAirScene'
import { ScreenConfigSupplier } from '../value/screenConfig'
import { CommentSupplierConfig, CommentSupplierConfigSupplier } from '../value/commentSupplierConfig'
import { CommentDeployerConfig, CommentDeployerConfigSupplier } from '../value/commentDeployerConfig'

/**
 * {@link LiveOnAirScene} を新規作成する際の各種設定を格納します.
 */
export interface LiveOnAirSceneConfigure {
  /**
   * g.Scene 上に配置される各レイヤーの領域値を設定します.
   *
   * @param config 設定されている各レイヤーについての領域の位置・大きさ
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
  field(config: object): LiveOnAirSceneConfigure

  /**
   * マップ ({@link Field}) の属性情報を取得します.
   */
  field(): Readonly<object>

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
  screen(config: object): LiveOnAirSceneConfigure

  /**
   * 生放送の画面 ({@link Screen}) の属性情報を取得します.
   */
  screen(): Readonly<object>

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
}

export interface LiveOnAirSceneConfigSupplierOptions {
  game: g.Game
  layer: LayerConfigSupplier
  field: FieldConfigSupplier
  broadcaster: BroadcasterConfigSupplier
  screen: ScreenConfigSupplier
  spot: SpotConfigSupplier
  commentSupplier: CommentSupplierConfigSupplier
  commentDeployer: CommentDeployerConfigSupplier
  isDefault: boolean
}

export class LiveOnAirSceneConfigureImpl implements LiveOnAirSceneConfigure {
  private readonly isDefault: boolean
  private readonly game: g.Game
  private readonly spotConfig: SpotConfigSupplier

  private readonly spotConfigs: SpotConfigSupplier[]

  private readonly layerGetter: () => LayerConfig
  private readonly fieldGetter: () => object
  private readonly broadcasterGetter: () => BroadcasterConfig
  private readonly screenGetter: () => object
  private readonly commentSupplierGetter: () => CommentSupplierConfig
  private readonly commentDeployerGetter: () => CommentDeployerConfig

  private readonly layerSetter: (obj: Partial<LayerConfig>) => void
  private readonly fieldSetter: (obj: object) => void
  private readonly broadcasterSetter: (obj: Partial<BroadcasterConfig>) => void
  private readonly screenSetter: (obj: object) => void
  private readonly commentSupplierSetter: (obj: Partial<CommentSupplierConfig>) => void
  private readonly commentDeployerSetter: (obj: Partial<CommentDeployerConfig>) => void

  constructor ({ game, layer, field, broadcaster, screen, spot, commentSupplier, commentDeployer, isDefault }: LiveOnAirSceneConfigSupplierOptions) {
    this.isDefault = isDefault
    this.game = game
    this.spotConfig = spot
    this.spotConfigs = []

    this.layerGetter = () => isDefault ? layer.default() : layer.get()
    this.fieldGetter = () => isDefault ? field.default() : field.get()
    this.broadcasterGetter = () => isDefault ? broadcaster.default() : broadcaster.get()
    this.screenGetter = () => isDefault ? screen.default() : screen.get()
    this.commentSupplierGetter = () => isDefault ? commentSupplier.default() : commentSupplier.get()
    this.commentDeployerGetter = () => isDefault ? commentDeployer.default() : commentDeployer.get()

    this.layerSetter = obj => isDefault ? layer.defaultIf(obj) : layer.setIf(obj)
    this.fieldSetter = obj => isDefault ? field.defaultIf(obj) : field.setIf(obj)
    this.broadcasterSetter = obj => isDefault ? broadcaster.defaultIf(obj) : broadcaster.setIf(obj)
    this.screenSetter = obj => isDefault ? screen.defaultIf(obj) : screen.setIf(obj)
    this.commentSupplierSetter = obj => isDefault ? commentSupplier.defaultIf(obj) : commentSupplier.setIf(obj)
    this.commentDeployerSetter = obj => isDefault ? commentDeployer.defaultIf(obj) : commentDeployer.setIf(obj)
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

  field (config: object): LiveOnAirSceneConfigure

  field (): Readonly<object>

  field (args?: object): LiveOnAirSceneConfigure | Readonly<object> {
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

  screen (config: object): LiveOnAirSceneConfigure

  screen (): Readonly<object>

  screen (args?: object): LiveOnAirSceneConfigure | Readonly<object> {
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

  /**
   * 指定された設定で {@link LiveOnAirScene} を作成します.
   */
  build (): LiveOnAirScene & g.Scene {
    return new LiveOnAirSceneImpl({ game: this.game, layer: this.layer(), broadcaster: this.broadcaster(), spots: this.spot(), commentSupplier: this.commentSupplier(), commentDeployer: this.commentDeployer() })
  }
}
