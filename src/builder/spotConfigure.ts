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

  /**
   * 作成する Spot を配置する座標を設定します.
   *
   * @param location Spot を配置する座標
   */
  locate(location: g.CommonOffset): SpotConfigure

  /**
   * 作成する Spot を配置する座標を取得します.
   */
  readonly location: Readonly<g.CommonOffset>
}

export class SpotConfigureImpl implements SpotConfigure {
  protected _location?: g.CommonOffset

  // eslint-disable-next-line no-useless-constructor
  constructor (protected readonly imageEntry: RecordConfigure<SpotImageTypes, g.ImageAsset>) {}

  image (assets: SpotImageConfig): SpotConfigure {
    this.imageEntry.putAll(assets)
    return this
  }

  get images (): SpotImageConfig {
    return this.imageEntry.entries(spotImageTypes)
  }

  locate (location: g.CommonOffset): SpotConfigure {
    if (!this._location) {
      this._location = { ...location }
    } else {
      this._location.x = location.x
      this._location.y = location.y
    }
    return this
  }

  get location (): Readonly<g.CommonOffset> {
    if (!this._location) {
      throw new Error('座標が設定されていません.')
    }
    return { ...this._location }
  }
}
