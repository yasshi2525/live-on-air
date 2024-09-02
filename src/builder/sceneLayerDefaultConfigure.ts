import { SceneLayerConfigure, SceneLayerConfigureImpl } from './sceneLayerConfigure'
import { LayerConfig } from './layerConfig'

export class DefaultSceneLayerConfigureImpl extends SceneLayerConfigureImpl {
  readonly _default: LayerConfig
  constructor (_default: LayerConfig) {
    super()
    this._default = { field: { ..._default.field } }
  }

  override field (layout: g.CommonArea): SceneLayerConfigure

  override field (): Readonly<g.CommonArea>

  override field (args?: g.CommonArea): SceneLayerConfigure | Readonly<g.CommonArea> {
    if (args) {
      return super.field(args)
    }
    return this._field ? super.field() : this._default.field
  }
}
