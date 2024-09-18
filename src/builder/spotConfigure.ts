import { SpotAssetRecord, SpotConfig, SpotConfigSupplier } from '../value/spotConfig'
import { Spot, SpotImpl } from '../model/spot'
import { Live } from '../model/live'

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
   * 作成する Spot に到達すると開始する生放送を取得します.
   */
  liveClass(): new () => Live

  /**
   * 作成する Spot に到達すると開始する生放送を設定します.
   *
   * @param liveClass 開始する生放送クラス名. インスタンスでない点にご留意ください.
   */
  liveClass(liveClass: new() => Live): SpotConfigure

  /**
   * 作成する Spot のライブラリ利用者が自由に使えるフィールドを取得します.
   */
  vars (): unknown

  /**
   * 作成する Spot のライブラリ利用者が自由に使えるフィールドを設定します.
   *
   * @param vars ライブラリ利用者が自由に使えるフィールド
   */
  vars (vars: unknown): SpotConfigure
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

  liveClass (): new () => Live

  liveClass (liveClass: new () => Live): SpotConfigure

  liveClass (args?: new () => Live): SpotConfigure | Readonly<new () => Live> {
    if (args) {
      this.setter({ liveClass: args })
      return this
    }
    return this.getter().liveClass
  }

  vars (): unknown

  vars (vars: unknown): SpotConfigure

  vars (args?: unknown): unknown | SpotConfigure {
    if (arguments.length > 0) {
      this.setter({ vars: args })
      return this
    }
    return this.getter().vars
  }

  /**
   * 指定された設定で Spot を作成します
   */
  build (): Spot {
    return new SpotImpl({ scene: this.scene, image: this.image(), location: this.location(), liveClass: this.liveClass(), vars: this.vars() })
  }
}
