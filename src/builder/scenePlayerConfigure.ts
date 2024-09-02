/**
 * Player を新規作成する際の各種設定を格納します.
 */
export interface ScenePlayerConfigure {
  /**
   * 作成する player の移動速度を設定します.
   *
   * @param speed player の移動速度
   */
  speed (speed: number): ScenePlayerConfigure

  /**
   * 作成する player の移動速度を取得します.
   */
  speed (): Readonly<number>

  /**
   * 作成する player を配置する座標を設定します.
   *
   * @param location Spot を配置する座標
   */
  location (location: g.CommonOffset): ScenePlayerConfigure

  /**
   * 作成する player を配置する座標を取得します.
   */
  location (): Readonly<g.CommonOffset>

  /**
   * 作成する player に使用される画像アセットを設定します.
   *
   * @param asset player に使用される画像アセット
   */
  asset (asset: g.ImageAsset): ScenePlayerConfigure

  /**
   * 作成する player に使用される画像アセットを取得します.
   */
  asset (): g.ImageAsset
}

export class ScenePlayerConfigureImpl implements ScenePlayerConfigure {
  protected _location?: g.CommonOffset
  protected _speed?: number
  protected _asset?: g.ImageAsset

  speed(speed: number): ScenePlayerConfigure

  speed(): Readonly<number>

  speed (args?: number): ScenePlayerConfigure | Readonly<number> {
    if (args) {
      if (args <= 0) {
        throw new Error(`無効な値 "${args}" を移動速度に設定しようとしました. 0より大きな正の値を指定してください`)
      }
      this._speed = args
      return this
    }
    if (!this._speed) {
      throw new Error('移動速度が設定されていません.')
    }
    return this._speed
  }

  location (location: g.CommonOffset): ScenePlayerConfigure

  location (): Readonly<g.CommonOffset>

  location (args?: g.CommonOffset): ScenePlayerConfigure | Readonly<g.CommonOffset> {
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

  asset (asset: g.ImageAsset): ScenePlayerConfigure

  asset (): g.ImageAsset

  asset (args?: g.ImageAsset): ScenePlayerConfigure | g.ImageAsset {
    if (args) {
      this._asset = args
      return this
    }
    if (!this._asset) {
      throw new Error('アセットが設定されていません.')
    }
    return this._asset
  }
}
