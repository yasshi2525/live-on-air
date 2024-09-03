import { LayerConfig } from './layerConfig'
import { ScenePlayerConfig, SceneSpotConfig } from './sceneConfig'
import { ScenePlayerConfigure, ScenePlayerConfigureImpl } from './scenePlayerConfigure'
import { SceneLayerConfigure, SceneLayerConfigureImpl } from './sceneLayerConfigure'
import { SceneSpotConfigure, SceneSpotConfigureImpl } from './sceneSpotConfigure'
import { isError } from '../util/validate'

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
  player(config: Partial<ScenePlayerConfig>): SceneConfigure

  /**
   * 作成する {@link Player} の属性情報を取得します.
   */
  player(): Readonly<ScenePlayerConfig>

  /**
   * 作成する {@link Spot} の属性情報を設定します.
   *
   * @param config Spot の設定値
   */
  spot(config: Partial<SceneSpotConfig>): SceneConfigure

  /**
   * 作成する {@link Spot} の属性情報を取得します.
   */
  spot(): readonly SceneSpotConfig[]
}

/**
 * 作成する {@link Spot} の属性値が存在しないとき、デフォルト値を設定します.
 * @internal
 */
export interface SpotConfigComplement {
  /**
   * Spot に設定するの属性値が省略された場合、デフォルト値で補完します.
   */
  completeSpotConfig({ value, error } : {
    value: Partial<SceneSpotConfig>,
    error: Partial<Record<keyof SceneSpotConfig, Error>>
  }): SceneSpotConfig
}

/**
 * 作成する {@link Player} の属性値が省略された場合、デフォルト値を設定します.
 * @internal
 */
export interface PlayerConfigComplement {
  /**
   * Player に設定するの属性値が省略された場合、デフォルト値で補完します.
   */
  completePlayerConfig({ value, error } : {
    value: Partial<ScenePlayerConfig>,
    error: Partial<Record<keyof ScenePlayerConfig, Error>>
  }): ScenePlayerConfig
}

export class SceneConfigureImpl implements SceneConfigure, PlayerConfigComplement, SpotConfigComplement {
  protected readonly layerConfig: SceneLayerConfigure
  protected fieldConfig?: object
  protected readonly playerConfig: ScenePlayerConfigure
  protected readonly spotConfigs: SceneSpotConfigure[]
  protected readonly playerComplement?: PlayerConfigComplement
  protected readonly spotComplement?: SpotConfigComplement

  constructor ({ player, spot }: { player?: PlayerConfigComplement, spot?: SpotConfigComplement}) {
    this.layerConfig = new SceneLayerConfigureImpl()
    this.playerConfig = new ScenePlayerConfigureImpl()
    this.spotConfigs = []
    this.spotComplement = spot
    this.playerComplement = player
  }

  layer (config: Partial<LayerConfig>): SceneConfigure

  layer (): Readonly<LayerConfig>

  layer (args?: Partial<LayerConfig>): SceneConfigure | Readonly<LayerConfig> {
    if (args) {
      if (args.field) {
        this.layerConfig.field(args.field)
      }
      return this
    }
    return { field: this.layerConfig.field() }
  }

  field (config: object): SceneConfigure

  field (): Readonly<object>

  field (args?: object): SceneConfigure | Readonly<object> {
    if (args) {
      this.fieldConfig = { ...args }
      return this
    }
    if (!this.fieldConfig) {
      throw new Error('値が設定されていません.')
    }
    return { ...this.fieldConfig }
  }

  player (config: Partial<ScenePlayerConfig>): SceneConfigure

  player (): Readonly<ScenePlayerConfig>

  player (args?: Partial<ScenePlayerConfig>): SceneConfigure | Readonly<ScenePlayerConfig> {
    if (args) {
      if (typeof args.speed === 'number') {
        this.playerConfig.speed(args.speed)
      }
      if (typeof args.x === 'number' && typeof args.y === 'number') {
        this.playerConfig.location({ x: args.x, y: args.y })
      }
      if (args.asset) {
        this.playerConfig.asset(args.asset)
      }
      return this
    }
    return (this.playerComplement ?? this).completePlayerConfig(this.parsePlayerConfig(this.playerConfig))
  }

  // DefaultConfigure で処理するため非到達想定
  // istanbul ignore next
  completePlayerConfig ({ value, error } : {
    value: Partial<ScenePlayerConfig>,
    error: Partial<Record<keyof ScenePlayerConfig, Error>>
  }): ScenePlayerConfig {
    if (error) {
      throw new Error(Object.entries(error).map(([key, err]) => `${key}: ${err.message}`).join('\n'))
    }
    return value as ScenePlayerConfig
  }

  protected parsePlayerConfig (config: ScenePlayerConfigureImpl): { value: Partial<ScenePlayerConfig>, error: Partial<Record<keyof ScenePlayerConfig, Error>> } {
    const value: Partial<ScenePlayerConfig> = {}
    const error: Partial<Record<keyof ScenePlayerConfig, Error>> = {}
    try {
      const location = config.location()
      value.x = location.x
      value.y = location.y
    } catch (e) {
      // 非到達想定
      // istanbul ignore else
      if (isError(e) && e.message === '座標が設定されていません.') {
        error.x = e
        error.y = e
      } else {
        throw e
      }
    }
    try {
      value.speed = config.speed()
    } catch (e) {
      // 非到達想定
      // istanbul ignore else
      if (isError(e) && e.message === '移動速度が設定されていません.') {
        error.speed = e
      } else {
        throw e
      }
    }
    try {
      value.asset = config.asset()
    } catch (e) {
      // 非到達想定
      // istanbul ignore else
      if (isError(e) && e.message === 'アセットが設定されていません.') {
        error.asset = e
      } else {
        throw e
      }
    }
    return { value, error }
  }

  spot (config: Partial<SceneSpotConfig>): SceneConfigure

  spot (): readonly SceneSpotConfig[]

  spot (args?: Partial<SceneSpotConfig>): SceneConfigure | readonly SceneSpotConfig[] {
    if (args) {
      const spotConfig = this.newSpotConfig()
      if (typeof args.x === 'number' && typeof args.y === 'number') {
        spotConfig.location({ x: args.x, y: args.y })
      }
      if (args.locked) {
        spotConfig.locked(args.locked)
      }
      if (args.unvisited) {
        spotConfig.unvisited(args.unvisited)
      }
      if (args.disabled) {
        spotConfig.disabled(args.disabled)
      }
      if (args.normal) {
        spotConfig.normal(args.normal)
      }
      this.spotConfigs.push(spotConfig)
      return this
    }
    return this.spotConfigs.map(config => (this.spotComplement ?? this).completeSpotConfig(this.parseSpotConfig(config)))
  }

  // DefaultConfigure で処理するため非到達想定
  // istanbul ignore next
  completeSpotConfig ({ value, error } : {
    value: Partial<SceneSpotConfig>,
    error: Partial<Record<keyof SceneSpotConfig, Error>>
  }): SceneSpotConfig {
    if (error) {
      throw new Error(Object.entries(error).map(([key, err]) => `${key}: ${err.message}`).join('\n'))
    }
    return value as SceneSpotConfig
  }

  protected newSpotConfig (): SceneSpotConfigureImpl {
    return new SceneSpotConfigureImpl()
  }

  protected parseSpotConfig (config: SceneSpotConfigureImpl): { value: Partial<SceneSpotConfig>, error: Partial<Record<keyof SceneSpotConfig, Error>> } {
    const value: Partial<SceneSpotConfig> = {}
    const error: Partial<Record<keyof SceneSpotConfig, Error>> = {}
    try {
      const location = config.location()
      value.x = location.x
      value.y = location.y
    } catch (e) {
      // 非到達想定
      // istanbul ignore else
      if (isError(e) && e.message === '座標が設定されていません.') {
        error.x = e
        error.y = e
      } else {
        throw e
      }
    }
    try {
      value.locked = config.locked()
    } catch (e) {
      // 非到達想定
      // istanbul ignore else
      if (isError(e) && e.message === 'アセットが設定されていません.') {
        error.locked = e
      } else {
        throw e
      }
    }
    try {
      value.unvisited = config.unvisited()
    } catch (e) {
      // 非到達想定
      // istanbul ignore else
      if (isError(e) && e.message === 'アセットが設定されていません.') {
        error.unvisited = e
      } else {
        throw e
      }
    }
    try {
      value.disabled = config.disabled()
    } catch (e) {
      // 非到達想定
      // istanbul ignore else
      if (isError(e) && e.message === 'アセットが設定されていません.') {
        error.disabled = e
      } else {
        throw e
      }
    }
    try {
      value.normal = config.normal()
    } catch (e) {
      // 非到達想定
      // istanbul ignore else
      if (isError(e) && e.message === 'アセットが設定されていません.') {
        error.normal = e
      } else {
        throw e
      }
    }
    return { value, error }
  }
}
