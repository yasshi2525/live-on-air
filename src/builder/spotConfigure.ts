import { SpotAssetRecord, SpotConfig, SpotConfigSupplier } from '../value/spotConfig'
import { Spot, SpotImpl } from '../model/spot'

/**
 * {@link Spot} を新規作成する際の各種設定を格納します.
 */
export interface SpotConfigure {
  /**
   * 描画に使用する画像アセットを設定します.
   *
   * @param assets 状態ごとに使用する画像アセット
   */
  image(assets: Partial<SpotAssetRecord>): SpotConfigure

  /**
   * 描画に使用される画像アセットをすべての状態について取得します.
   */
  image(): Readonly<SpotAssetRecord>

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

  /**
   * 指定された設定で Spot を作成します
   */
  build (): Spot
}

export class SpotConfigureImpl implements SpotConfigure {
  private readonly getter: () => SpotConfig
  private readonly setter: (obj: Partial<SpotConfig>) => void

  constructor (isDefault: boolean, private readonly scene: g.Scene, config: SpotConfigSupplier) {
    this.getter = () => isDefault ? config.default() : config.get()
    this.setter = obj => isDefault ? config.defaultIf(obj) : config.setIf(obj)
  }

  image (assets: Partial<SpotAssetRecord>): SpotConfigure

  image (): Readonly<SpotAssetRecord>

  image (args?: Partial<SpotAssetRecord>): SpotConfigure | Readonly<SpotAssetRecord> {
    if (args) {
      this.setter(args)
      return this
    }
    const value = this.getter()
    return {
      locked: value.locked,
      unvisited: value.unvisited,
      disabled: value.disabled,
      normal: value.normal
    }
  }

  location (location: g.CommonOffset): SpotConfigure

  location (): Readonly<g.CommonOffset>

  location (args?: g.CommonOffset): SpotConfigure | Readonly<g.CommonOffset> {
    if (args) {
      this.setter(args)
      return this
    }
    const value = this.getter()
    return { x: value.x, y: value.y }
  }

  build (): Spot {
    return new SpotImpl(this.scene, this.image(), this.location())
  }
}
