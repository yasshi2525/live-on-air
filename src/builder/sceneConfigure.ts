import { LayerConfig, LayerConfigSupplier } from '../value/layerConfig'
import { PlayerConfig, PlayerConfigSupplier } from '../value/playerConfig'
import { SpotConfig, SpotConfigSupplier } from '../value/spotConfig'
import { FieldConfigSupplier } from '../value/fieldConfig'
import { Scene, SceneImpl } from '../model/scene'

/**
 * {@link Scene} を新規作成する際の各種設定を格納します.
 */
export interface SceneConfigure {
  /**
   * Scene 上に配置される各レイヤーの領域値を設定します.
   *
   * @param config 設定されている各レイヤーについての領域の位置・大きさ
   */
  layer(config: Partial<LayerConfig>): SceneConfigure

  /**
   * Scene 上に配置される各レイヤーの領域値を取得します.
   *
   */
  layer(): Readonly<LayerConfig>

  /**
   * マップ ({@link Field}) の属性情報を設定します.
   *
   * @param config Field の設定値
   */
  field(config: object): SceneConfigure

  /**
   * マップ ({@link Field}) の属性情報を取得します.
   */
  field(): Readonly<object>

  /**
   * 作成する {@link Player} の属性情報を設定します.
   *
   * @param config Player の設定値
   */
  player(config: Partial<PlayerConfig>): SceneConfigure

  /**
   * 作成する {@link Player} の属性情報を取得します.
   */
  player(): Readonly<PlayerConfig>

  /**
   * 作成する {@link Spot} の属性情報を設定します.
   *
   * @param config Spot の設定値
   */
  spot(config: Partial<SpotConfig>): SceneConfigure

  /**
   * 作成する {@link Spot} の属性情報を取得します.
   */
  spot(): readonly SpotConfig[]

  /**
   * 指定された設定で {@link Scene} を作成します.
   */
  build (): Scene & g.Scene
}

export interface SceneConfigSupplierOptions {
  game: g.Game
  layer: LayerConfigSupplier
  field: FieldConfigSupplier
  player: PlayerConfigSupplier
  spot: SpotConfigSupplier
  isDefault: boolean
}

export class SceneConfigureImpl implements SceneConfigure {
  private readonly isDefault: boolean
  private readonly game: g.Game
  private readonly spotConfig: SpotConfigSupplier

  private readonly spotConfigs: SpotConfigSupplier[]

  private readonly layerGetter: () => LayerConfig
  private readonly fieldGetter: () => object
  private readonly playerGetter: () => PlayerConfig

  private readonly layerSetter: (obj: Partial<LayerConfig>) => void
  private readonly fieldSetter: (obj: object) => void
  private readonly playerSetter: (obj: Partial<PlayerConfig>) => void

  constructor ({ game, layer, field, player, spot, isDefault }: SceneConfigSupplierOptions) {
    this.isDefault = isDefault
    this.game = game
    this.spotConfig = spot
    this.spotConfigs = []

    this.layerGetter = () => isDefault ? layer.default() : layer.get()
    this.fieldGetter = () => isDefault ? field.default() : field.get()
    this.playerGetter = () => isDefault ? player.default() : player.get()

    this.layerSetter = obj => isDefault ? layer.defaultIf(obj) : layer.setIf(obj)
    this.fieldSetter = obj => isDefault ? field.defaultIf(obj) : field.setIf(obj)
    this.playerSetter = obj => isDefault ? player.defaultIf(obj) : player.setIf(obj)
  }

  layer (config: Partial<LayerConfig>): SceneConfigure

  layer (): Readonly<LayerConfig>

  layer (args?: Partial<LayerConfig>): SceneConfigure | Readonly<LayerConfig> {
    if (args) {
      this.layerSetter(args)
      return this
    }
    return this.layerGetter()
  }

  field (config: object): SceneConfigure

  field (): Readonly<object>

  field (args?: object): SceneConfigure | Readonly<object> {
    if (args) {
      this.fieldSetter(args)
      return this
    }
    return this.fieldGetter()
  }

  player (config: Partial<PlayerConfig>): SceneConfigure

  player (): Readonly<PlayerConfig>

  player (args?: Partial<PlayerConfig>): SceneConfigure | Readonly<PlayerConfig> {
    if (args) {
      this.playerSetter(args)
      return this
    }
    return this.playerGetter()
  }

  spot (config: Partial<SpotConfig>): SceneConfigure

  spot (): readonly SpotConfig[]

  spot (args?: Partial<SpotConfig>): SceneConfigure | readonly SpotConfig[] {
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

  build (): Scene & g.Scene {
    return new SceneImpl({ game: this.game, layer: this.layer(), player: this.player(), spots: this.spot() })
  }
}
