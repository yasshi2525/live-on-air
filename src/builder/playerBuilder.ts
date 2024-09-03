import { Player, PlayerImpl } from '../model/player'
import { Configure } from '../util/configure'
import { image } from '../util/loader'

/**
 * プレイヤー {@link Player} を簡便に作るためのクラス.
 *
 * Player は本クラスを用いて作成してください.
 */
export class PlayerBuilder {
  private readonly imgConfig: Configure<'normal', g.ImageAsset>
  private readonly _location: g.CommonOffset
  private _speed: number

  constructor (private readonly scene: g.Scene) {
    this.imgConfig = new Configure(image(scene, 'image/player.default.png'))
    this._location = { x: 0, y: 0 }
    this._speed = 1
  }

  /**
   * 作成する Player に使用される画像アセットを取得します.
   */
  asset (): g.ImageAsset

  /**
   * 作成する Player に設定する画像アセットを登録します.
   *
   * @param asset 描画に使用する画像アセット
   */
  asset (asset: g.ImageAsset): PlayerBuilder

  asset (args?: g.ImageAsset): g.ImageAsset | PlayerBuilder {
    if (!args) {
      return this.imgConfig.get('normal')
    }
    this.imgConfig.put('normal', args)
    return this
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
  speed (value: number): PlayerBuilder

  speed (args?: number): number | PlayerBuilder {
    if (!args) {
      return this._speed
    }
    if (args <= 0) {
      throw new Error(`無効な値 "${args}" を移動速度に設定しようとしました. 0より大きな正の値を指定してください`)
    }
    this._speed = args
    return this
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
  location (location: g.CommonOffset): PlayerBuilder

  location (arg?: g.CommonOffset): Readonly<g.CommonOffset> | PlayerBuilder {
    if (!arg) {
      return { ...this._location }
    }
    this._location.x = arg.x
    this._location.y = arg.y
    return this
  }

  /**
   * Player を作成します.
   */
  build (): Player {
    return new PlayerImpl(this.scene, this.imgConfig.get('normal'), this._speed, this._location)
  }
}
