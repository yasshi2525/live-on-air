import { LayerConfig, LayerConfigSupplier } from '../value/layerConfig'
import { Layer, LayerImpl } from '../model/layer'

/**
 * {@link Layer} を新規作成する際の各種設定を保持します.
 */
export interface LayerConfigure {
  /**
   * Spot, Player が配置されるマップを取得します.
   */
  field (): Readonly<g.CommonArea>

  /**
   * Spot, Player が配置されるマップの大きさを設定します.
   *
   * @param area 設定する領域
   */
  field (area: g.CommonArea): LayerConfigure

  /**
   * Live が配置される生放送画面の大きさを取得します.
   */
  screen (): Readonly<g.CommonArea>

  /**
   * Live が配置される生放送画面の大きさを設定します.
   *
   * @param area 設定する領域
   */
  screen (area: g.CommonArea): LayerConfigure

  /**
   * 設定されたレイアウト情報をもとに各レイヤを作成し、sceneに登録します
   */
  build(): Layer
}

export class LayerConfigureImpl implements LayerConfigure {
  private readonly getter: () => LayerConfig
  private readonly setter: (obj: Partial<LayerConfig>) => void

  constructor (isDefault: boolean, private readonly scene: g.Scene, private readonly config: LayerConfigSupplier) {
    this.getter = () => isDefault ? config.default() : config.get()
    this.setter = obj => isDefault ? config.defaultIf(obj) : config.setIf(obj)
  }

  field (): Readonly<g.CommonArea>

  field (area: g.CommonArea): LayerConfigure

  field (args?: g.CommonArea): LayerConfigure | Readonly<g.CommonArea> {
    if (args) {
      this.setter({ field: args })
      return this
    }
    return this.getter().field
  }

  screen (): Readonly<g.CommonArea>

  screen (area: g.CommonArea): LayerConfigure

  screen (args?: g.CommonArea): LayerConfigure | Readonly<g.CommonArea> {
    if (args) {
      this.setter({ screen: args })
      return this
    }
    return this.getter().screen
  }

  build (): Layer {
    return new LayerImpl(this.scene, this.config.get())
  }
}
