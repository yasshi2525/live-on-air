import { ScreenConfigure, ScreenConfigureImpl } from './screenConfigure'
import { ScreenConfigSupplier } from '../value/screenConfig'

/**
 * 生放送環境 ({@link Screen}) を簡便に作るためのクラス.
 *
 * Screen は本クラスを用いて作成してください.
 */
export class ScreenBuilder extends ScreenConfigureImpl {
  private static lastUsedScene?: g.Scene
  private static defaultConfig?: ScreenConfigSupplier
  private static defaultConfigure?: ScreenConfigure

  constructor (scene: g.Scene) {
    super(false, scene, new ScreenConfigSupplier(ScreenBuilder.getDefaultConfig(scene).get()))
  }

  /**
   * 作成する Screen のライブラリ利用者が自由に使えるフィールドを取得します.
   */
  override vars (): unknown

  /**
   * 作成する Screen のライブラリ利用者が自由に使えるフィールドを設定します.
   *
   * @param vars ライブラリ利用者が自由に使えるフィールド
   */
  override vars (vars: unknown): ScreenBuilder

  override vars (args?: unknown): unknown | ScreenBuilder {
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
  static getDefault (scene: g.Scene): ScreenConfigure {
    if (ScreenBuilder.lastUsedScene !== scene) {
      ScreenBuilder.resetDefault()
    }
    if (!ScreenBuilder.defaultConfigure) {
      ScreenBuilder.defaultConfigure = new ScreenConfigureImpl(true, scene, ScreenBuilder.getDefaultConfig(scene))
    }
    ScreenBuilder.lastUsedScene = scene
    return ScreenBuilder.defaultConfigure
  }

  private static getDefaultConfig (scene: g.Scene): ScreenConfigSupplier {
    if (ScreenBuilder.lastUsedScene !== scene) {
      ScreenBuilder.resetDefault()
    }
    if (!ScreenBuilder.defaultConfig) {
      ScreenBuilder.defaultConfig = new ScreenConfigSupplier({ vars: undefined })
    }
    ScreenBuilder.lastUsedScene = scene
    return ScreenBuilder.defaultConfig
  }

  /**
   * {@link getDefault} で設定した変更を消去します.
   * @internal
   */
  private static resetDefault () {
    delete ScreenBuilder.defaultConfig
    delete ScreenBuilder.defaultConfigure
  }
}
