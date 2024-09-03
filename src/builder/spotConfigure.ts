import { SpotImageConfig, spotImageTypes, SpotImageTypes } from './spotConfig'
import { RecordConfigure } from '../util/configureRecord'

/**
 * {@link Spot} を新規作成する際の各種設定を格納します.
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
  image(): Readonly<SpotImageConfig>

  /**
   * 作成する Spot を配置する座標を設定します.
   *
   * @param location Spot を配置する座標
   */
  location(location: g.CommonOffset): SpotConfigure

  /**
   * 作成する Spot を配置する座標を取得します.
   */
  location(): Readonly<g.CommonOffset>
}

export class SpotConfigureImpl implements SpotConfigure {
  protected _location?: g.CommonOffset

  // eslint-disable-next-line no-useless-constructor
  constructor (protected readonly imageEntry: RecordConfigure<SpotImageTypes, g.ImageAsset>) {}

  image (assets: SpotImageConfig): SpotConfigure

  image (): SpotImageConfig

  image (args?: SpotImageConfig): SpotConfigure | SpotImageConfig {
    if (args) {
      this.imageEntry.putAll(args)
      return this
    }
    return this.imageEntry.entries(spotImageTypes)
  }

  location (location: g.CommonOffset): SpotConfigure

  location (): Readonly<g.CommonOffset>

  location (args?: g.CommonOffset): SpotConfigure | Readonly<g.CommonOffset> {
    if (args) {
      if (!this._location) {
        this._location = { ...args }
      } else {
        this._location.x = args.x
        this._location.y = args.y
      }
      return this
    }
    if (!this._location) {
      throw new Error('座標が設定されていません.')
    }
    return { ...this._location }
  }
}
