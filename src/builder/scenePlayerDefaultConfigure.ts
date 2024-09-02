import { ScenePlayerConfigure, ScenePlayerConfigureImpl } from './scenePlayerConfigure'
import { ScenePlayerConfig } from './sceneConfig'

export class DefaultScenePlayerConfigureImpl extends ScenePlayerConfigureImpl {
  readonly _default: ScenePlayerConfig
  constructor (_default: ScenePlayerConfig) {
    super()
    // インスタンス生成側で有効値を指定するため非到達
    // istanbul ignore if
    if (_default.speed <= 0) {
      throw new Error(`無効な値 "${_default.speed}" を移動速度に設定しようとしました. 0より大きな正の値を指定してください`)
    }
    this._default = { ..._default }
  }

  override speed(speed: number): ScenePlayerConfigure

  override speed(): Readonly<number>

  override speed (args?: number): ScenePlayerConfigure | Readonly<number> {
    if (args) {
      return super.speed(args)
    }
    return this._speed ? super.speed() : this._default.speed
  }

  override location (location: g.CommonOffset): ScenePlayerConfigure

  override location (): Readonly<g.CommonOffset>

  override location (args?: g.CommonOffset): ScenePlayerConfigure | Readonly<g.CommonOffset> {
    if (args) {
      return super.location(args)
    }
    return this._location ? super.location() : { x: this._default.x, y: this._default.y }
  }

  override asset(asset: g.ImageAsset): ScenePlayerConfigure

  override asset(): g.ImageAsset

  override asset (args?: g.ImageAsset): ScenePlayerConfigure | g.ImageAsset {
    if (args) {
      return super.asset(args)
    }
    return this._asset ? super.asset() : this._default.asset
  }
}
