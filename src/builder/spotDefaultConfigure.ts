import { SpotConfigure, SpotConfigureImpl } from './spotConfigure'
import { SpotImageTypes } from './spotConfig'
import { RecordWithDefaultConfigure } from '../util/configureRecordDefault'

export interface DefaultSpotConfigure extends SpotConfigure {
  /**
   * 描画する際、該当する画像アセットが見つからなかった場合に使用する画像アセット
   */
  defaultImage: g.ImageAsset
}

export class DefaultSpotConfigureImpl extends SpotConfigureImpl implements DefaultSpotConfigure {
  constructor (protected readonly imageEntry: RecordWithDefaultConfigure<SpotImageTypes, g.ImageAsset>) {
    super(imageEntry)
  }

  get defaultImage (): g.ImageAsset {
    return this.imageEntry.default
  }

  set defaultImage (asset: g.ImageAsset) {
    this.imageEntry.default = asset
  }
}
