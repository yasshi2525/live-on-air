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

  constructor (private readonly scene: g.Scene) {
    const defaultValue = spotImageTypes.reduce((prev, current) => {
      prev[current] = image(scene, `image/spot.default.${current}.png`)
      return prev
    }, {} as SpotImageConfig)
    this.imgConfig = new Configure<SpotImageTypes, g.ImageAsset>(image(scene, 'image/spot.default.png'), defaultValue)
    this.default = new DefaultSpotConfigureImpl(this.imgConfig._default, { x: 0, y: 0 })
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

  /**
   * 作成する Spot を配置する座標を設定します.
   *
   * 設定しなかった場合、
   * default.locate() で設定した座標が使われます.
   * default.locate() でも設定しなかった場合、
   * default.defaultLocation で設定した座標が使用されます.
   *
   * @param location Spot に設定する座標
   */
  locate (location: g.CommonOffset): SpotBuilder {
    this.current.locate(location)
    return this
  }

  /**
   * 作成する Spot を配置する座標を取得します.
   */
  get location (): Readonly<g.CommonOffset> {
    try {
      return { ...this.current.location }
    } catch (e) {
      if (e instanceof Error && e.message === '座標が設定されていません.') {
        return { ...this.default.location }
      }
      // 非到達想定
      // istanbul ignore next
      throw e
    }
  }

  /**
   * 指定された設定で Spot を作成します
   */
  build (): Spot {
    return new SpotImpl(this.scene, this.images, this.location)
  }
}
