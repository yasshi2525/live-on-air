import { PlayerConfig, PlayerConfigSupplier } from '../value/playerConfig'
import { Player, PlayerImpl } from '../model/player'

/**
 * {@link Player} を新規作成する際の各種設定を保持します.
 */
export interface PlayerConfigure {
  /**
   * 作成する Player に使用される画像アセットを取得します.
   */
  asset (): g.ImageAsset

  /**
   * 作成する Player に設定する画像アセットを登録します.
   *
   * @param asset 描画に使用する画像アセット
   */
  asset (asset: g.ImageAsset): PlayerConfigure

  /**
   * 作成する Player に設定する移動速度を取得します.
   */
  speed (): number

  /**
   * 作成する Player に設定する移動速度を設定します.
   *
   * @param speed 移動速度
   */
  speed (speed: number): PlayerConfigure

  /**
   * 作成する Player に設定する座標を取得します.
   */
  location (): g.CommonOffset

  /**
   * 作成する Player の座標を登録します.
   *
   * @param location Player の座標
   */
  location (location: g.CommonOffset): PlayerConfigure

  /**
   * Player を作成します.
   */
  build (): Player
}

export class PlayerConfigureImpl implements PlayerConfigure {
  private readonly getter: () => PlayerConfig
  private readonly setter: (obj: Partial<PlayerConfig>) => void

  constructor (isDefault: boolean, private readonly scene: g.Scene, private readonly config: PlayerConfigSupplier) {
    this.getter = () => isDefault ? config.default() : config.get()
    this.setter = obj => isDefault ? config.defaultIf(obj) : config.setIf(obj)
  }

  asset (): g.ImageAsset

  asset (asset: g.ImageAsset): PlayerConfigure

  asset (args?: g.ImageAsset): g.ImageAsset | PlayerConfigure {
    if (args) {
      this.setter({ asset: args })
      return this
    }
    return this.getter().asset
  }

  /**
   * 作成する Player に設定する移動速度を取得します.
   */
  speed (): number

  /**
   * 作成する Player に設定する移動速度を設定します.
   *
   * @param value 移動速度
   */
  speed (value: number): PlayerConfigure

  speed (args?: number): number | PlayerConfigure {
    if (typeof args === 'number') {
      this.setter({ speed: args })
      return this
    }
    return this.getter().speed
  }

  /**
   * 作成する Player に設定する座標を取得します.
   */
  location (): Readonly<g.CommonOffset>

  /**
   * 作成する Player の座標を登録します.
   *
   * @param location Player の座標
   */
  location (location: g.CommonOffset): PlayerConfigure

  location (args?: g.CommonOffset): Readonly<g.CommonOffset> | PlayerConfigure {
    if (args) {
      this.setter(args)
      return this
    }
    const value = this.getter()
    return { x: value.x, y: value.y }
  }

  build (): Player {
    const config = this.config.get()
    return new PlayerImpl(this.scene, config.asset, config.speed, { x: config.x, y: config.y })
  }
}
