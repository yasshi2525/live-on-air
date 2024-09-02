import { SceneSpotConfigure, SceneSpotConfigureImpl } from './sceneSpotConfigure'
import { SceneSpotConfig } from './sceneConfig'

export class DefaultSceneSpotConfigureImpl extends SceneSpotConfigureImpl {
  readonly _default: SceneSpotConfig
  constructor (_default: SceneSpotConfig) {
    super()
    this._default = { ..._default }
  }

  override location (location: g.CommonOffset): SceneSpotConfigure

  override location (): Readonly<g.CommonOffset>

  override location (args?: g.CommonOffset): SceneSpotConfigure | Readonly<g.CommonOffset> {
    if (args) {
      return super.location(args)
    }
    return this._location ? super.location() : { x: this._default.x, y: this._default.y }
  }

  override locked (asset: g.ImageAsset): SceneSpotConfigure

  override locked (): g.ImageAsset

  override locked (args?: g.ImageAsset): SceneSpotConfigure | g.ImageAsset {
    if (args) {
      return super.locked(args)
    }
    return this._locked ? super.locked() : this._default.locked
  }

  override unvisited (asset: g.ImageAsset): SceneSpotConfigure

  override unvisited (): g.ImageAsset

  override unvisited (args?: g.ImageAsset): SceneSpotConfigure | g.ImageAsset {
    if (args) {
      return super.unvisited(args)
    }
    return this._unvisited ? super.unvisited() : this._default.unvisited
  }

  override disabled (asset: g.ImageAsset): SceneSpotConfigure

  override disabled (): g.ImageAsset

  override disabled (args?: g.ImageAsset): SceneSpotConfigure | g.ImageAsset {
    if (args) {
      return super.disabled(args)
    }
    return this._disabled ? super.disabled() : this._default.disabled
  }

  override normal (asset: g.ImageAsset): SceneSpotConfigure

  override normal (): g.ImageAsset

  override normal (args?: g.ImageAsset): SceneSpotConfigure | g.ImageAsset {
    if (args) {
      return super.normal(args)
    }
    return this._normal ? super.normal() : this._default.normal
  }
}
