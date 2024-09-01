import { Player, PlayerImpl } from '../model/player'
import { Configure } from '../util/configure'
import { image } from '../util/loader'

/**
 * プレイヤー Player を簡便に作るためのクラス.
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
   * 作成する player に使用される画像アセットを取得します.
   */
  get asset (): g.ImageAsset {
    return this.imgConfig.get('normal')
  }

  /**
   * 作成する player に設定する画像アセットを登録します.
   *
   * @param asset 描画に使用する画像アセット
   */
  set asset (asset : g.ImageAsset) {
    this.imgConfig.put('normal', asset)
  }

  /**
   * 作成する player に設定する移動速度を取得します.
   */
  get speed (): number {
    return this._speed
  }

  /**
   * 作成する player に設定する移動速度を設定します.
   *
   * @param value 移動速度
   */
  set speed (value: number) {
    if (value <= 0) {
      throw new Error(`無効な値 "${value}" を移動速度に設定しようとしました. 0より大きな正の値を指定してください`)
    }
    this._speed = value
  }

  /**
   * 作成する player に設定する座標を取得します.
   */
  get location (): Readonly<g.CommonOffset> {
    return { ...this._location }
  }

  /**
   * 作成する player の座標を登録します.
   *
   * @param location player の座標
   */
  set location (location: g.CommonOffset) {
    this._location.x = location.x
    this._location.y = location.y
  }

  /**
   * player を作成します.
   */
  build (): Player {
    return new PlayerImpl(this.scene, this.imgConfig.get('normal'), this._speed, this._location)
  }
}
