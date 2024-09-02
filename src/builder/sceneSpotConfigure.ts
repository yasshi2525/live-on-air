/**
 * Spot を新規作成する際の各種設定を格納します.
 */
export interface SceneSpotConfigure {
  /**
   * 作成する spot を配置する座標を設定します.
   *
   * @param location Spot を配置する座標
   */
  location (location: g.CommonOffset): SceneSpotConfigure

  /**
   * 作成する spot を配置する座標を取得します.
   */
  location (): Readonly<g.CommonOffset>

  /**
   * 作成する spot の未解放状態の画像アセットを設定します.
   *
   * プレイヤーには存在を見せたいが、条件をみたすまで
   * 訪問させたくない Spot を作成したいときに設定してください.
   *
   * @param asset 作成する spot の未解放状態の画像アセット
   */
  locked (asset: g.ImageAsset): SceneSpotConfigure

  /**
   * 作成する spot の未解放状態の画像アセットを取得します.
   */
  locked (): g.ImageAsset

  /**
   * 作成する spot の未訪問状態の画像アセットを設定します.
   *
   * プレイヤーがまだ訪問していない場合、
   * 強調表示をして訪問を促したい際に設定してください.
   *
   * @param asset 作成する spot の未訪問状態の画像アセット
   */
  unvisited (asset: g.ImageAsset): SceneSpotConfigure

  /**
   * 作成する spot の未訪問状態の画像アセットを取得します.
   */
  unvisited (): g.ImageAsset

  /**
   * 作成する spot の訪問操作受付禁止状態の画像アセットを設定します.
   *
   * プレイヤーが他の Spot に向かって移動しているときなど、
   * クリックしても目的地に指定できないことを強調する際に設定してください.
   *
   * @param asset 作成する spot の未訪問状態の画像アセット
   */
  disabled (asset: g.ImageAsset): SceneSpotConfigure

  /**
   * 作成する spot の訪問操作受付禁止状態の画像アセットを取得します.
   */
  disabled (): g.ImageAsset

  /**
   * 作成する spot の通常時の画像アセットを設定します.
   *
   * プレイヤーがクリックすれば目的地に設定される状態の際の画像を設定してください.
   *
   * @param asset 作成する spot の通常時の画像アセット
   */
  normal (asset: g.ImageAsset): SceneSpotConfigure

  /**
   * 作成する spot の通常時の画像アセットを取得します.
   */
  normal (): g.ImageAsset
}

export class SceneSpotConfigureImpl implements SceneSpotConfigure {
  protected _location?: g.CommonOffset
  protected _locked?: g.ImageAsset
  protected _unvisited?: g.ImageAsset
  protected _disabled?: g.ImageAsset
  protected _normal?: g.ImageAsset

  location (location: g.CommonOffset): SceneSpotConfigure

  location (): Readonly<g.CommonOffset>

  location (args?: g.CommonOffset): SceneSpotConfigure | Readonly<g.CommonOffset> {
    if (args) {
      // spot は設定のたびに新規インスタンスを生成するため上書き不可
      // istanbul ignore else
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

  locked (asset: g.ImageAsset): SceneSpotConfigure

  locked (): g.ImageAsset

  locked (args?: g.ImageAsset): SceneSpotConfigure | g.ImageAsset {
    if (args) {
      this._locked = args
      return this
    }
    if (!this._locked) {
      throw new Error('アセットが設定されていません.')
    }
    return this._locked
  }

  unvisited (asset: g.ImageAsset): SceneSpotConfigure

  unvisited (): g.ImageAsset

  unvisited (args?: g.ImageAsset): SceneSpotConfigure | g.ImageAsset {
    if (args) {
      this._unvisited = args
      return this
    }
    if (!this._unvisited) {
      throw new Error('アセットが設定されていません.')
    }
    return this._unvisited
  }

  disabled (asset: g.ImageAsset): SceneSpotConfigure

  disabled (): g.ImageAsset

  disabled (args?: g.ImageAsset): SceneSpotConfigure | g.ImageAsset {
    if (args) {
      this._disabled = args
      return this
    }
    if (!this._disabled) {
      throw new Error('アセットが設定されていません.')
    }
    return this._disabled
  }

  normal (asset: g.ImageAsset): SceneSpotConfigure

  normal (): g.ImageAsset

  normal (args?: g.ImageAsset): SceneSpotConfigure | g.ImageAsset {
    if (args) {
      this._normal = args
      return this
    }
    if (!this._normal) {
      throw new Error('アセットが設定されていません.')
    }
    return this._normal
  }
}
