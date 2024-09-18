import { BroadcasterConfig, BroadcasterConfigSupplier } from '../value/broadcasterConfig'
import { Broadcaster, BroadcasterImpl } from '../model/broadcaster'

/**
 * {@link Broadcaster} を新規作成する際の各種設定を保持します.
 */
export interface BroadcasterConfigure {
  /**
   * 作成する Broadcaster に使用される画像アセットを取得します.
   */
  asset (): g.ImageAsset

  /**
   * 作成する Broadcaster に設定する画像アセットを登録します.
   *
   * @param asset 描画に使用する画像アセット
   */
  asset (asset: g.ImageAsset): BroadcasterConfigure

  /**
   * 作成する Broadcaster に設定する移動速度を取得します.
   */
  speed (): number

  /**
   * 作成する Broadcaster に設定する移動速度を設定します.
   *
   * @param speed 移動速度
   */
  speed (speed: number): BroadcasterConfigure

  /**
   * 作成する Broadcaster に設定する座標を取得します.
   */
  location (): g.CommonOffset

  /**
   * 作成する Broadcaster の座標を設定します.
   *
   * @param location Broadcaster の座標
   */
  location (location: g.CommonOffset): BroadcasterConfigure

  /**
   * 作成する Broadcaster のライブラリ利用者が自由に使えるフィールドを取得します.
   */
  vars (): unknown

  /**
   * 作成する Broadcaster のライブラリ利用者が自由に使えるフィールドを設定します.
   *
   * @param vars ライブラリ利用者が自由に使えるフィールド
   */
  vars (vars: unknown): BroadcasterConfigure
}

export class BroadcasterConfigureImpl implements BroadcasterConfigure {
  private readonly getter: () => BroadcasterConfig
  private readonly setter: (obj: Partial<BroadcasterConfig>) => void

  constructor (isDefault: boolean, private readonly scene: g.Scene, private readonly config: BroadcasterConfigSupplier) {
    this.getter = () => isDefault ? config.default() : config.get()
    this.setter = obj => isDefault ? config.defaultIf(obj) : config.setIf(obj)
  }

  asset (): g.ImageAsset

  asset (asset: g.ImageAsset): BroadcasterConfigure

  asset (args?: g.ImageAsset): g.ImageAsset | BroadcasterConfigure {
    if (args) {
      this.setter({ asset: args })
      return this
    }
    return this.getter().asset
  }

  speed (): number

  speed (value: number): BroadcasterConfigure

  speed (args?: number): number | BroadcasterConfigure {
    if (typeof args === 'number') {
      this.setter({ speed: args })
      return this
    }
    return this.getter().speed
  }

  location (): Readonly<g.CommonOffset>

  location (location: g.CommonOffset): BroadcasterConfigure

  location (args?: g.CommonOffset): Readonly<g.CommonOffset> | BroadcasterConfigure {
    if (args) {
      this.setter(args)
      return this
    }
    const value = this.getter()
    return { x: value.x, y: value.y }
  }

  vars (): unknown

  vars (vars: unknown): BroadcasterConfigure

  vars (args?: unknown): unknown | BroadcasterConfigure {
    if (arguments.length > 0) {
      this.setter({ vars: args })
      return this
    }
    return this.getter().vars
  }

  /**
   * Broadcaster を作成します.
   */
  build (): Broadcaster {
    const config = this.config.get()
    return new BroadcasterImpl({ scene: this.scene, asset: config.asset, speed: config.speed, location: { x: config.x, y: config.y }, vars: config.vars })
  }
}
