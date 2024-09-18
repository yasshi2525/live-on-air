import { image } from '../util/loader'
import { BroadcasterConfigure, BroadcasterConfigureImpl } from './broadcasterConfigure'
import { BroadcasterConfigSupplier } from '../value/broadcasterConfig'

/**
 * 放送者（プレイヤー） {@link Broadcaster} を簡便に作るためのクラス.
 *
 * Broadcaster は本クラスを用いて作成してください.
 */
export class BroadcasterBuilder extends BroadcasterConfigureImpl {
  private static lastUsedScene?: g.Scene
  private static defaultConfig?: BroadcasterConfigSupplier
  private static defaultConfigure?: BroadcasterConfigure

  constructor (scene: g.Scene) {
    super(false, scene, new BroadcasterConfigSupplier(BroadcasterBuilder.getDefaultConfig(scene).get()))
  }

  /**
   * 作成する Broadcaster に使用される画像アセットを取得します.
   */
  override asset (): g.ImageAsset

  /**
   * 作成する Broadcaster に設定する画像アセットを登録します.
   *
   * @param asset 描画に使用する画像アセット
   */
  override asset (asset: g.ImageAsset): BroadcasterBuilder

  override asset (args?: g.ImageAsset): g.ImageAsset | BroadcasterBuilder {
    if (args) {
      super.asset(args)
      return this
    }
    return super.asset()
  }

  /**
   * 作成する Broadcaster に設定する移動速度を取得します.
   */
  override speed (): number

  /**
   * 作成する Broadcaster に設定する移動速度を設定します.
   *
   * @param speed 移動速度
   */
  override speed (speed: number): BroadcasterBuilder

  override speed (args?: number): number | BroadcasterBuilder {
    if (args) {
      super.speed(args)
      return this
    }
    return super.speed()
  }

  /**
   * 作成する Broadcaster に設定する座標を取得します.
   */
  override location (): g.CommonOffset

  /**
   * 作成する Broadcaster の座標を設定します.
   *
   * @param location Broadcaster の座標
   */
  override location (location: g.CommonOffset): BroadcasterBuilder

  override location (args?: g.CommonOffset): Readonly<g.CommonOffset> | BroadcasterBuilder {
    if (args) {
      super.location(args)
      return this
    }
    return super.location()
  }

  /**
   * 作成する Broadcaster のライブラリ利用者が自由に使えるフィールドを取得します.
   */
  override vars (): unknown

  /**
   * 作成する Broadcaster のライブラリ利用者が自由に使えるフィールドを設定します.
   *
   * @param vars ライブラリ利用者が自由に使えるフィールド
   */
  override vars (vars: unknown): BroadcasterBuilder

  override vars (args?: unknown): unknown | BroadcasterBuilder {
    if (arguments.length > 0) {
      super.vars(args)
      return this
    }
    return super.vars()
  }

  /**
   * 各属性値に値を設定しなかった際に使用されるデフォルト値を設定します.
   *
   * @param scene 現在の scene を指定してください.
   */
  static getDefault (scene: g.Scene): BroadcasterConfigure {
    if (BroadcasterBuilder.lastUsedScene !== scene) {
      BroadcasterBuilder.resetDefault()
    }
    if (!BroadcasterBuilder.defaultConfigure) {
      BroadcasterBuilder.defaultConfigure = new BroadcasterConfigureImpl(true, scene, BroadcasterBuilder.getDefaultConfig(scene))
    }
    BroadcasterBuilder.lastUsedScene = scene
    return BroadcasterBuilder.defaultConfigure
  }

  private static getDefaultConfig (scene: g.Scene): BroadcasterConfigSupplier {
    if (BroadcasterBuilder.lastUsedScene !== scene) {
      BroadcasterBuilder.resetDefault()
    }
    if (!BroadcasterBuilder.defaultConfig) {
      BroadcasterBuilder.defaultConfig = new BroadcasterConfigSupplier({
        x: 0, y: 0, speed: 1, asset: image(scene, 'image/broadcaster.default.png'), vars: undefined
      })
    }
    BroadcasterBuilder.lastUsedScene = scene
    return BroadcasterBuilder.defaultConfig
  }

  /**
   * {@link getDefault} で設定した変更を消去します.
   * @internal
   */
  private static resetDefault () {
    delete BroadcasterBuilder.defaultConfig
    delete BroadcasterBuilder.defaultConfigure
  }
}
