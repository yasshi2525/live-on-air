import { SpotConfigure, SpotConfigureImpl } from './spotConfigure'
import { DefaultSpotConfigure, DefaultSpotConfigureImpl } from './spotDefaultConfigure'
import { SpotImageConfig, spotImageTypes, SpotImageTypes } from './spotConfig'
import { Configure } from '../util/configure'
import { image } from '../util/loader'
import { Spot, SpotImpl } from '../model/spot'

/**
 * 訪問先 Spot を簡便に作るためのクラス.
 *
 * Spot は本クラスを用いて作成してください.
 */
export class SpotBuilder implements SpotConfigure {
  /**
   * build() を使用して Spot を作成する際、
   * 個別の設定を省略した際のデフォルト値.
   *
   * 個々の Spot によらず共通の設定をしたい場合は、
   * 本パラメタを利用して設定を変更してください.
   */
  readonly default: DefaultSpotConfigure
  private readonly current: SpotConfigure

  private readonly imgConfig: Configure<SpotImageTypes, g.ImageAsset>

  constructor (scene: g.Scene) {
    this.imgConfig = new Configure<SpotImageTypes, g.ImageAsset>(image(scene, 'image/spot.default.png'))
    this.default = new DefaultSpotConfigureImpl(this.imgConfig._default)
    this.current = new SpotConfigureImpl(this.imgConfig.current)
  }

  /**
   * 描画に使用する画像アセットを場面別に設定します.
   *
   * ある場面について画像アセットを設定しなかった場合、
   * default.image(assets) で指定した場面の画像アセットが使用されます.
   * default.image(assets) でも設定しなかった場合、
   * default.defaultImage で設定した画像アセットが使用されます.
   *
   * @param assets 状態ごとに使用する画像アセット
   */
  image (assets: Partial<SpotImageConfig>): SpotBuilder {
    this.current.image(assets)
    return this
  }

  /**
   * 設定されている場面別の描画に使用する画像アセットを取得します.
   */
  get images (): Readonly<SpotImageConfig> {
    return this.imgConfig.entries(spotImageTypes)
  }

  build (): Spot {
    return new SpotImpl(this.images)
  }
}
