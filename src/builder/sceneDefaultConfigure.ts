import { SceneConfigure, SceneConfigureImpl } from './sceneConfigure'
import { LayerConfig } from './layerConfig'
import { ScenePlayerConfig, SceneSpotConfig } from './sceneConfig'
import { DefaultSceneLayerConfigureImpl } from './sceneLayerDefaultConfigure'
import { DefaultScenePlayerConfigureImpl } from './scenePlayerDefaultConfigure'
import { DefaultSceneSpotConfigureImpl } from './sceneSpotDefaultConfigure'

export class DefaultSceneConfigureImpl extends SceneConfigureImpl {
  protected readonly layerConfig: DefaultSceneLayerConfigureImpl
  private readonly defaultFieldConfig: object
  protected readonly playerConfig: DefaultScenePlayerConfigureImpl
  protected readonly spotConfigs: DefaultSceneSpotConfigureImpl[]
  private readonly defaultSpotConfig: SceneSpotConfig

  constructor ({ layer, player, spot }: { layer: LayerConfig, player: ScenePlayerConfig, spot: SceneSpotConfig }) {
    super({})
    this.layerConfig = new DefaultSceneLayerConfigureImpl(layer)
    this.defaultFieldConfig = {}
    this.playerConfig = new DefaultScenePlayerConfigureImpl(player)
    this.spotConfigs = []
    this.defaultSpotConfig = spot
  }

  override field (config: object): SceneConfigure

  override field (): Readonly<object>

  override field (args?: object): SceneConfigure | Readonly<object> {
    if (args) {
      return super.field(args)
    }
    return this.fieldConfig ?? this.defaultFieldConfig
  }

  override completePlayerConfig ({ value, error }: {
    value: Partial<ScenePlayerConfig>,
    error: Partial<Record<keyof ScenePlayerConfig, Error>>
  }): ScenePlayerConfig {
    for (const [key, err] of Object.entries(error) as [keyof ScenePlayerConfig, Error][]) {
      switch (key) {
        case 'x':
        case 'y':
          // 非到達想定
          // istanbul ignore else
          if (err.message === '座標が設定されていません.') {
            value[key] = this.playerConfig.location()[key]
          } else {
            throw err
          }
          break
        case 'speed':
          // 非到達想定
          // istanbul ignore else
          if (err.message === '移動速度が設定されていません.') {
            value[key] = this.playerConfig.speed()
          } else {
            throw err
          }
          break
        case 'asset':
          // 非到達想定
          // istanbul ignore else
          if (err.message === 'アセットが設定されていません.') {
            value[key] = this.playerConfig.asset()
          } else {
            throw err
          }
          break
      }
    }
    return value as ScenePlayerConfig
  }

  override completeSpotConfig ({ value, error }: {
    value: Partial<SceneSpotConfig>,
    error: Partial<Record<keyof SceneSpotConfig, Error>>
  }): SceneSpotConfig {
    for (const [key, err] of Object.entries(error) as [keyof SceneSpotConfig, Error][]) {
      switch (key) {
        case 'x':
        case 'y':
          // 非到達想定
          // istanbul ignore else
          if (err.message === '座標が設定されていません.') {
            value[key] = this.defaultSpotConfig[key]
          } else {
            throw err
          }
          break
        case 'locked':
        case 'unvisited':
        case 'disabled':
        case 'normal':
          // 非到達想定
          // istanbul ignore else
          if (err.message === 'アセットが設定されていません.') {
            value[key] = this.defaultSpotConfig[key]
          } else {
            throw err
          }
          break
      }
    }
    return value as SceneSpotConfig
  }

  protected override newSpotConfig (): DefaultSceneSpotConfigureImpl {
    return new DefaultSceneSpotConfigureImpl(this.defaultSpotConfig)
  }
}
