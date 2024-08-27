import { SpotImageConfig, spotImageTypes, SpotImageTypes } from './spotConfig'
import { RecordConfigure } from '../util/configureRecord'

/**
 * Spot を新規作成する際の各種設定を格納します.
 */
export interface SpotConfigure {
  /**
   * 描画に使用する画像アセットを設定します.
   *
   * @param assets 状態ごとに使用する画像アセット
   */
  image(assets: Partial<SpotImageConfig>): SpotConfigure

  /**
   * 描画に使用される画像アセットをすべての状態について取得します.
   */
  images: Readonly<SpotImageConfig>
}

export class SpotConfigureImpl implements SpotConfigure {
  // eslint-disable-next-line no-useless-constructor
  constructor (protected readonly imageEntry: RecordConfigure<SpotImageTypes, g.ImageAsset>) {}

  image (assets: SpotImageConfig): SpotConfigure {
    this.imageEntry.putAll(assets)
    return this
  }

  get images (): SpotImageConfig {
    return this.imageEntry.entries(spotImageTypes)
  }
}
