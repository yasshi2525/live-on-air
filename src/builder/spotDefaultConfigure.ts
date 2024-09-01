import { SpotConfigure, SpotConfigureImpl } from './spotConfigure'
import { SpotImageTypes } from './spotConfig'
import { RecordWithDefaultConfigure } from '../util/configureRecordDefault'

export interface DefaultSpotConfigure extends SpotConfigure {
  /**
   * 描画する際、該当する画像アセットが見つからなかった場合に使用する画像アセット
   */
  defaultImage: g.ImageAsset

  /**
   * 作成する Spot を配置する座標が設定されていなかった場合に使用する座標
   */
  defaultLocation: g.CommonOffset
}

export class DefaultSpotConfigureImpl extends SpotConfigureImpl implements DefaultSpotConfigure {
  private readonly _defaultLocation: g.CommonOffset

  constructor (protected readonly imageEntry: RecordWithDefaultConfigure<SpotImageTypes, g.ImageAsset>,
    _defaultLocation: g.CommonOffset) {
    super(imageEntry)
    this._defaultLocation = { ..._defaultLocation }
  }

  override location (location: g.CommonOffset): SpotConfigure

  override location (): Readonly<g.CommonOffset>

  override location (args?: g.CommonOffset): SpotConfigure | Readonly<g.CommonOffset> {
    if (args) {
      return super.location(args)
    }
    return this._location ? { ...this._location } : { ...this._defaultLocation }
  }

  get defaultImage (): g.ImageAsset {
    return this.imageEntry.default
  }

  set defaultImage (asset: g.ImageAsset) {
    this.imageEntry.default = asset
  }

  get defaultLocation (): Readonly<g.CommonOffset> {
    return { ...this._defaultLocation }
  }

  set defaultLocation (defaultLocation: g.CommonOffset) {
    this._defaultLocation.x = defaultLocation.x
    this._defaultLocation.y = defaultLocation.y
  }
}
